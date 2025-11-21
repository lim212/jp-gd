
// Notification System for Auto Blog
class AutoBlogNotification {
  constructor() {
    this.notificationTypes = {
      SUCCESS: 'success',
      ERROR: 'error',
      WARNING: 'warning',
      INFO: 'info'
    };
  }

  async sendNotification(type, message, data = {}) {
    const notification = {
      type,
      message,
      data,
      timestamp: new Date().toISOString()
    };

    // Log notification
    console.log(`📢 [${type.toUpperCase()}] ${message}`);
    
    // Save to file
    await this.saveNotification(notification);
    
    // Send to external services if configured
    if (process.env.NOTIFICATION_WEBHOOK) {
      await this.sendWebhook(notification);
    }
  }

  async saveNotification(notification) {
    try {
      const notificationFile = path.join(process.cwd(), 'logs/notifications.json');
      let notifications = [];
      
      try {
        const content = await fs.readFile(notificationFile, 'utf-8');
        notifications = JSON.parse(content);
      } catch {
        // File doesn't exist, start fresh
      }
      
      notifications.push(notification);
      
      // Keep only last 1000 notifications
      if (notifications.length > 1000) {
        notifications = notifications.slice(-1000);
      }
      
      await fs.writeFile(notificationFile, JSON.stringify(notifications, null, 2));
    } catch (error) {
      console.error('Error saving notification:', error);
    }
  }

  async sendWebhook(notification) {
    try {
      const response = await fetch(process.env.NOTIFICATION_WEBHOOK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification)
      });
      
      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Webhook notification failed:', error);
    }
  }

  // Convenience methods
  async notifySuccess(message, data) {
    await this.sendNotification(this.notificationTypes.SUCCESS, message, data);
  }

  async notifyError(message, data) {
    await this.sendNotification(this.notificationTypes.ERROR, message, data);
  }

  async notifyWarning(message, data) {
    await this.sendNotification(this.notificationTypes.WARNING, message, data);
  }

  async notifyInfo(message, data) {
    await this.sendNotification(this.notificationTypes.INFO, message, data);
  }
}

export default AutoBlogNotification;
