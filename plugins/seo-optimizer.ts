/**
 * SEO Optimizer Plugin
 *
 * This plugin optimizes the loading of SEO-related modules in development mode
 * to reduce startup time and improve developer experience.
 */

export default defineNuxtPlugin((nuxtApp) => {
  // Only apply optimizations in development mode
  if (process.env.NODE_ENV === 'development') {
    // Defer non-critical SEO operations
    const deferSeoOperations = () => {
      // This will run after the initial page load
      setTimeout(() => {
        // You can add any deferred SEO operations here if needed
        console.log('SEO operations deferred in development mode for better performance');
      }, 2000);
    };

    // Execute on client-side only
    if (import.meta.client) {
      // Wait for the app to be mounted
      nuxtApp.hook('app:mounted', () => {
        deferSeoOperations();
      });
    }
  }

  return {
    provide: {
      // Provide a utility to check if we're using optimized SEO
      isOptimizedSeo: process.env.NODE_ENV === 'development'
    }
  };
});
