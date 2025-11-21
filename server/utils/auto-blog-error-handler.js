
// Enhanced Error Handler for Auto Blog System
class AutoBlogErrorHandler {
  constructor() {
    this.errorLog = [];
    this.maxLogSize = 1000;
  }

  logError(error, context = {}) {
    const errorEntry = {
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      context,
      type: error.constructor.name
    };

    this.errorLog.push(errorEntry);
    
    // Keep only recent errors
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(-this.maxLogSize);
    }

    this.saveErrorLog();
    this.sendNotification(error, context);
  }

  async saveErrorLog() {
    try {
      const errorFile = path.join(process.cwd(), 'logs/auto-blog-errors.json');
      await fs.writeFile(errorFile, JSON.stringify(this.errorLog, null, 2));
    } catch (error) {
      console.error('Error saving error log:', error);
    }
  }

  async sendNotification(error, context) {
    // Implement notification logic (email, Slack, etc.)
    console.error('🚨 Auto Blog Error:', {
      message: error.message,
      context,
      timestamp: new Date().toISOString()
    });
  }

  getErrorStats() {
    const last24h = Date.now() - (24 * 60 * 60 * 1000);
    const recentErrors = this.errorLog.filter(
      error => new Date(error.timestamp).getTime() > last24h
    );

    return {
      total: this.errorLog.length,
      last24h: recentErrors.length,
      recent: recentErrors.slice(-10)
    };
  }
}

export default AutoBlogErrorHandler;
