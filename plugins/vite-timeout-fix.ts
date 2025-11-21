// plugins/vite-timeout-fix.ts
// This plugin overrides the default REQUEST_TIMEOUT_MS value in the Vite Node client
// to fix the "Request timeout after 10000ms for type: module" and "Request timeout after 10000ms for type: invalidates" errors

export default defineNuxtPlugin(() => {
  // This plugin runs on both client and server

  // Only run this code during development
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  // Ensure we only apply and log this patch once per environment (client/server)
  const g: any = globalThis as any
  const flagName = import.meta.client ? '__viteTimeoutPatchedClient' : '__viteTimeoutPatchedServer'
  if (g[flagName]) {
    return
  }

  // Try to patch the Vite Node client timeout
  try {
    // This is a workaround to increase the timeout for Vite Node client requests
    // The default timeout is 10000ms (10 seconds)

    // Define global variables to override the default timeouts
    if (typeof global !== 'undefined') {
      // @ts-expect-error - Adding custom properties to global
      global.VITE_NODE_REQUEST_TIMEOUT_MS = 600000; // 600 seconds (10 minutes)

      // Explicitly set timeout for module requests
      // @ts-expect-error - Adding custom property to global
      global.VITE_NODE_MODULE_REQUEST_TIMEOUT_MS = 600000; // 600 seconds (10 minutes)

      // Patch the REQUEST_TIMEOUT_MS constant if possible (Node-only)
      try {
        // Try to directly modify the module that contains the REQUEST_TIMEOUT_MS constant
        // @ts-expect-error require may not exist in all environments; guarded by try/catch
        const moduleCache = require?.cache || {};
        Object.keys(moduleCache).forEach(modulePath => {
          if (modulePath.includes('vite-node-shared.mjs') || modulePath.includes('vite-builder')) {
            // Force reload of the module with our custom timeout
            delete moduleCache[modulePath];
          }
        });
      } catch (e) {
        // Keep this quiet to avoid noisy logs during HMR; the globals above are sufficient in most cases.
      }
    }

    // For browser environment
    if (typeof window !== 'undefined') {
      // @ts-expect-error - Adding custom properties to window
      window.VITE_NODE_REQUEST_TIMEOUT_MS = 600000; // 600 seconds (10 minutes)
      // @ts-expect-error - Adding custom property to window
      window.VITE_NODE_MODULE_REQUEST_TIMEOUT_MS = 600000; // 600 seconds (10 minutes)
    }

    g[flagName] = true
    console.log('✅ Vite Node client timeout increased to 600000ms (10 minutes) for all request types including modules');
  } catch (error) {
    console.error('❌ Failed to patch Vite Node client timeout:', error);
  }
});

