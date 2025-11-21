
// Performance Monitoring System
export class PerformanceMonitoring {
  constructor() {
    this.metrics = {};
    this.init();
  }

  init() {
    if (process.client) {
      this.measurePageLoad();
      this.measureWebVitals();
      this.measureResourceTiming();
      this.setupPerformanceObserver();
    }
  }

  measurePageLoad() {
    if (typeof window !== 'undefined' && typeof performance !== 'undefined') {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0];
        
        this.metrics.pageLoad = {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          totalTime: navigation.loadEventEnd - navigation.fetchStart
        };

        console.log('Page Load Metrics:', this.metrics.pageLoad);
      });
    }
  }

  measureWebVitals() {
    // Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.startTime;
      console.log('LCP:', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        this.metrics.fid = entry.processingStart - entry.startTime;
        console.log('FID:', entry.processingStart - entry.startTime);
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      this.metrics.cls = clsValue;
      console.log('CLS:', clsValue);
    }).observe({ entryTypes: ['layout-shift'] });
  }

  measureResourceTiming() {
    const resources = performance.getEntriesByType('resource');
    const resourceMetrics = {
      total: resources.length,
      totalSize: 0,
      loadTime: 0
    };

    resources.forEach(resource => {
      resourceMetrics.totalSize += resource.transferSize || 0;
      resourceMetrics.loadTime += resource.duration;
    });

    this.metrics.resources = resourceMetrics;
    console.log('Resource Metrics:', resourceMetrics);
  }

  setupPerformanceObserver() {
    // Monitor long tasks
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        if (entry.duration > 50) {
          console.warn('Long task detected:', entry.duration);
        }
      });
    }).observe({ entryTypes: ['longtask'] });

    // Monitor memory usage
    if ('memory' in performance) {
      setInterval(() => {
        const memory = performance.memory;
        this.metrics.memory = {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit
        };
      }, 5000);
    }
  }

  getMetrics() {
    return this.metrics;
  }

  sendMetrics() {
    // Send metrics to analytics service
    if (this.metrics.lcp && this.metrics.fid && this.metrics.cls) {
      // Example: Send to Google Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'web_vitals', {
          lcp: this.metrics.lcp,
          fid: this.metrics.fid,
          cls: this.metrics.cls
        });
      }
    }
  }
}

// Initialize performance monitoring
if (process.client && typeof window !== 'undefined') {
  window.performanceMonitoring = new PerformanceMonitoring();
}
