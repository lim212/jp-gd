/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
// @ts-nocheck
// Global fetch wrapper with retry logic to handle ECONNRESET errors
// This plugin standardizes network request handling across the application

// Error logging control to prevent spam
const errorLogCache = new Map<string, { count: number, lastLogged: number }>();
const MAX_ERROR_LOGS = 1; // Maximum number of times to log the same error
const ERROR_LOG_RESET_TIME = 300000; // 5 minutes before resetting error count

// Enhanced console logging with rate limiting
function limitedConsoleWarn(message: string, ...args: unknown[]) {
  const cacheKey = message.split(':')[0]; // Use first part of message as key
  const now = Date.now();
  const cached = errorLogCache.get(cacheKey);

  if (!cached) {
    // First occurrence, log normally
    errorLogCache.set(cacheKey, { count: 1, lastLogged: now });
    console.warn(message, ...args);
    return;
  }

  // Check if we should reset the counter (after ERROR_LOG_RESET_TIME)
  if (now - cached.lastLogged > ERROR_LOG_RESET_TIME) {
    errorLogCache.set(cacheKey, { count: 1, lastLogged: now });
    console.warn(message, ...args);
    return;
  }

  // Increment counter
  const newCount = cached.count + 1;
  errorLogCache.set(cacheKey, { count: newCount, lastLogged: now });

  // Only log if under threshold
  if (newCount <= MAX_ERROR_LOGS) {
    console.warn(message, ...args);
  } else if (newCount === MAX_ERROR_LOGS + 1) {
    // Log one final message that we're suppressing future logs
    console.warn(`${cacheKey}: Additional warnings of this type will be suppressed for 5 minutes to prevent spam`);
  }
}

function limitedConsoleError(message: string, ...args: unknown[]) {
  const cacheKey = message.split(':')[0]; // Use first part of message as key
  const now = Date.now();
  const cached = errorLogCache.get(cacheKey);

  if (!cached) {
    // First occurrence, log normally
    errorLogCache.set(cacheKey, { count: 1, lastLogged: now });
    console.error(message, ...args);
    return;
  }

  // Check if we should reset the counter (after ERROR_LOG_RESET_TIME)
  if (now - cached.lastLogged > ERROR_LOG_RESET_TIME) {
    errorLogCache.set(cacheKey, { count: 1, lastLogged: now });
    console.error(message, ...args);
    return;
  }

  // Increment counter
  const newCount = cached.count + 1;
  errorLogCache.set(cacheKey, { count: newCount, lastLogged: now });

  // Only log if under threshold
  if (newCount <= MAX_ERROR_LOGS) {
    console.error(message, ...args);
  } else if (newCount === MAX_ERROR_LOGS + 1) {
    // Log one final message that we're suppressing future logs
    console.error(`${cacheKey}: Additional errors of this type will be suppressed for 5 minutes to prevent spam`);
  }
}

// Simple DNS resolution check function
async function checkDnsResolution(hostname: string): Promise<boolean> {
  try {
    // Use a simple HEAD request to check if the hostname resolves
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    await fetch(`https://${hostname}/favicon.ico`, {
      method: 'HEAD',
      signal: controller.signal,
      cache: 'no-store'
    });

    clearTimeout(timeoutId);
    return true;
  } catch (error) {
    limitedConsoleWarn(`DNS resolution check failed for ${hostname}:`, error);
    return false;
  }
}

interface FetchOptions {
  timeout?: number;
  maxRetries?: number;
  headers?: Record<string, string>;
  cache?: boolean | string;
  cacheKey?: string;
  [key: string]: unknown;
}

interface FetchError extends Error {
  message: string;
  [key: string]: unknown;
}

// Simple in-memory cache
const responseCache = new Map<string, { data: unknown, timestamp: number }>();
const CACHE_TTL = 60000; // 1 minute cache TTL by default

export default defineNuxtPlugin(() => {
  const originalFetch = globalThis.$fetch;

  // Preserve the original raw method if it exists
  const originalRaw = originalFetch.raw;

  // Override the global fetch with our enhanced version
  globalThis.$fetch = async function enhancedFetch(url: string, options: FetchOptions = {}) {
    // Skip WordPress API calls to prevent timeout errors
    if (url.includes('api.jasapembayaran.com/api/blog-wp')) {
      limitedConsoleWarn(`WordPress API call to ${url} was blocked to prevent timeout errors.`);
      // Return empty data structure based on the expected response format
      return { data: [], meta: { current_page: 1, last_page: 1, links: [] } };
    }

    // Extract hostname for DNS resolution check
    let hostname = '';
    try {
      // Check if URL is absolute (has protocol) or is a relative URL
      if (url.startsWith('http://') || url.startsWith('https://')) {
        hostname = new URL(url).hostname;

        // Check DNS resolution for external URLs (skip for localhost and IP addresses)
        if (hostname &&
            !hostname.includes('localhost') &&
            !hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
          const dnsResolved = await checkDnsResolution(hostname);
          if (!dnsResolved) {
            limitedConsoleWarn(`DNS resolution failed for ${hostname}, request may fail`);
            // Continue with the request anyway, but log the warning
          }
        }
      }
      // Skip DNS check for relative URLs
    } catch (error) {
      limitedConsoleWarn(`Failed to parse URL for DNS check: ${url}`, error);
      // Continue with the request even if URL parsing fails
    }

    // Default configuration with improved defaults for performance and reliability
    const config: FetchOptions = {
      timeout: 30000, // Increased timeout to 30 seconds to handle slow API responses
      maxRetries: 4, // Set max retries to 4 (total 5 attempts including initial try)
      cache: options.cache || false, // Default to no caching unless explicitly enabled
      ...options,
      headers: {
        // Don't set a default Connection header to let the system decide the best strategy
        // This prevents issues with connections being kept alive but becoming stale
        'Keep-Alive': 'timeout=5, max=1000', // If keep-alive is used, set reasonable limits
        'Accept-Encoding': 'gzip, deflate', // Support compression to reduce data size
        ...(options?.headers || {})
      }
    };

    // Generate cache key if caching is enabled
    const shouldUseCache = config.cache === true || config.cache === 'force-cache';
    const cacheKey = config.cacheKey || `${url}${JSON.stringify(config)}`;

    // Check cache first if enabled
    if (shouldUseCache) {
      const cachedResponse = responseCache.get(cacheKey);
      if (cachedResponse) {
        const now = Date.now();
        if (now - cachedResponse.timestamp < CACHE_TTL) {
          return cachedResponse.data;
        } else {
          // Remove expired cache entry
          responseCache.delete(cacheKey);
        }
      }
    }

    // Extract and remove maxRetries and cache options from config to avoid passing to fetch
    const maxRetries = config.maxRetries || 4; // Default to 4 retries (total 5 attempts including initial try)
    delete config.maxRetries;
    delete config.cache;
    delete config.cacheKey;

    let retryCount = 0;
    let lastError: FetchError | null = null;

    while (retryCount <= maxRetries) {
      try {
        // Attempt the fetch with our enhanced configuration
        const response = await originalFetch(url, config);

        // Cache the successful response if caching is enabled
        if (shouldUseCache && response) {
          responseCache.set(cacheKey, {
            data: response,
            timestamp: Date.now()
          });
        }

        return response;
      } catch (error) {
        // Cast error to our FetchError type
        const fetchError = error as FetchError;
        lastError = fetchError;

        // Check for timeout errors
        const isTimeout =
          fetchError.message?.includes('timeout') ||
          fetchError.message?.includes('aborted due to timeout') ||
          fetchError.message?.includes('timed out');

        // Special handling for connection reset errors
        const isConnectionReset =
          fetchError.message?.includes('ECONNRESET') ||
          fetchError.message?.includes('ECONNREFUSED') ||
          fetchError.message?.includes('connect ECONNREFUSED') ||
          fetchError.message?.includes('connection refused') ||
          fetchError.message?.includes('connection reset') ||
          fetchError.message?.includes('network error');

        // Special handling for connection aborted errors
        const isConnectionAborted =
          fetchError.message?.includes('ECONNABORTED') ||
          fetchError.message?.includes('connection aborted');

        // For timeout errors, use more aggressive retry logic with longer timeouts
        if (isTimeout) {
          limitedConsoleWarn(`Timeout detected for ${url}. Attempting recovery with longer timeout...`);

          // Use a significantly longer timeout for the next attempt
          config.timeout = Math.min((config.timeout as number || 30000) * 2, 120000); // Double timeout up to 2 minutes max

          // Add a random delay to prevent thundering herd problem
          const jitter = Math.random() * 1000;
          await new Promise(resolve => setTimeout(resolve, 2000 + jitter));

          // Try again with a fresh connection and no caching
          config.headers = {
            ...config.headers,
            'Connection': 'close', // Force a new connection
            'Cache-Control': 'no-cache, no-store, must-revalidate' // Bypass all caches
          };

          retryCount++;
          limitedConsoleWarn(`Retry ${retryCount}/${maxRetries} for ${url} with timeout ${config.timeout}ms`);
          continue; // Skip the standard retry logic and try again immediately
        }

        // For connection reset errors, use more aggressive retry logic
        if (isConnectionReset) {
          limitedConsoleWarn(`Connection reset detected for ${url}. Attempting recovery with enhanced strategy...`);

          // Use a longer timeout for the next attempt
          config.timeout = Math.min((config.timeout as number || 30000) * 2, 120000); // Double timeout up to 2 minutes max

          // Add a longer random delay for connection reset errors
          const jitter = Math.random() * 1000;
          await new Promise(resolve => setTimeout(resolve, 2000 + jitter));

          // Try again with a completely fresh connection and different headers
          config.headers = {
            ...config.headers,
            'Connection': 'close', // Force a new connection
            'Cache-Control': 'no-cache, no-store, must-revalidate', // Bypass all caches
            'Pragma': 'no-cache', // Legacy cache header
            'Expires': '0' // Force expired content
          };

          // Add a unique parameter to the URL to bypass any potential caching
          const separator = url.includes('?') ? '&' : '?';
          const uniqueParam = `_t=${Date.now()}`;
          url = `${url}${separator}${uniqueParam}`;

          retryCount++;
          limitedConsoleWarn(`Retry ${retryCount}/${maxRetries} for ${url} with timeout ${config.timeout}ms and enhanced recovery`);
          continue; // Skip the standard retry logic and try again immediately
        }

        // For connection aborted errors, use specialized recovery logic
        if (isConnectionAborted) {
          limitedConsoleWarn(`Connection aborted detected for ${url}. Attempting specialized recovery...`);

          // Use a longer timeout for the next attempt
          config.timeout = (config.timeout as number || 30000) * 2;

          // Add a longer delay with jitter for connection aborted errors
          const jitter = Math.random() * 1000;
          await new Promise(resolve => setTimeout(resolve, 2000 + jitter));

          // Try again with a completely fresh connection and different headers
          config.headers = {
            ...config.headers,
            'Connection': 'close', // Force a new connection
            'Cache-Control': 'no-cache, no-store, must-revalidate', // Bypass all caches
            'Pragma': 'no-cache', // Legacy cache header
            'Expires': '0' // Force expired content
          };

          // Add a unique parameter to the URL to bypass any potential caching
          const separator = url.includes('?') ? '&' : '?';
          const uniqueParam = `_t=${Date.now()}`;
          url = `${url}${separator}${uniqueParam}`;

          retryCount++;
          limitedConsoleWarn(`Retry ${retryCount}/${maxRetries} for ${url} with timeout ${config.timeout}ms`);
          continue; // Skip the standard retry logic and try again immediately
        }

        // Standard retry logic for other errors
        retryCount++;

        // Log all errors to help with debugging
        limitedConsoleWarn(`Fetch attempt ${retryCount}/${maxRetries + 1} failed for ${url}: ${fetchError.message}`);
        limitedConsoleWarn(`Remaining attempts: ${maxRetries - retryCount + 1} of 5 total attempts`);

        // If we've reached max retries, rethrow the error
        if (retryCount > maxRetries) {
          limitedConsoleError(`Fetch attempt failed: Maximum of 5 attempts reached (1 initial + ${maxRetries} retries) for ${url}. Last error: ${fetchError.message}`);
          throw new Error(`Maximum fetch attempts (5) reached for ${url}. Last error: ${fetchError.message}`);
        }

        // Improved exponential backoff with longer delays for better recovery
        const delay = 500 * retryCount;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // This should never be reached due to the throw in the catch block
    throw lastError;
  };

  // Implement the raw method to fix "globalThis.$fetch.raw is not a function" error
  globalThis.$fetch.raw = async function enhancedFetchRaw(url: string, options: FetchOptions = {}) {
    try {
      // If original raw method exists, use it with our enhanced options
      if (originalRaw && typeof originalRaw === 'function') {
        return await originalRaw(url, {
          timeout: 30000, // Match the timeout with enhancedFetch
          maxRetries: 4,  // Set max retries to 4 (total 5 attempts including initial try)
          ...options
        });
      }

      // Fallback implementation if originalRaw doesn't exist
      const response = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          // Use the same improved connection handling as enhancedFetch
          'Keep-Alive': 'timeout=5, max=1000',
          'Accept-Encoding': 'gzip, deflate'
        }
      });

      // Create a response object similar to what $fetch.raw would return
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      // Safely convert headers to object
      let headersObj: Record<string, string> = {}
      try {
        if (response.headers && typeof response.headers.entries === 'function') {
          headersObj = Object.fromEntries(response.headers.entries())
        }
      } catch (e) {
        // Fallback if headers conversion fails
        headersObj = {}
      }

      return {
        _data: data,
        _response: response,
        headers: headersObj,
        status: response.status,
        statusText: response.statusText,
        body: text
      };
    } catch (error) {
      limitedConsoleError(`Error in enhancedFetchRaw for ${url}:`, error);
      throw error;
    }
  };

  // Also provide a composable for use in components
  return {
    provide: {
      enhancedFetch: globalThis.$fetch
    }
  };
});

