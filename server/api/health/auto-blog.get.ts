
// Health Check API for Auto Blog Scheduler
export default defineEventHandler(async (event) => {
  try {
    // Check if scheduler is running
    const isSchedulerActive = process.env.NUXT_ENABLE_AUTO_BLOG === 'true';
    
    // Basic health metrics
    const health = {
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      scheduler: {
        active: isSchedulerActive,
        environment: process.env.NODE_ENV,
        enabled: process.env.NUXT_ENABLE_AUTO_BLOG
      },
      system: {
        memory: process.memoryUsage(),
        platform: process.platform,
        nodeVersion: process.version
      }
    };
    
    return {
      status: 'ok',
      ...health
    };
  } catch (error) {
    return {
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
});
