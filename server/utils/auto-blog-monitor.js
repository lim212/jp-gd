
// Enhanced Auto Blog Monitoring System
import { promises as fs } from 'fs';
import path from 'path';

class AutoBlogMonitor {
  constructor() {
    this.metrics = {
      totalGenerated: 0,
      lastGeneration: null,
      averageGenerationTime: 0,
      errorCount: 0,
      successRate: 100
    };
    this.startTime = Date.now();
  }

  logGeneration(success, duration, blogCount) {
    this.metrics.totalGenerated += blogCount;
    this.metrics.lastGeneration = new Date().toISOString();
    
    if (success) {
      this.metrics.averageGenerationTime = 
        (this.metrics.averageGenerationTime + duration) / 2;
    } else {
      this.metrics.errorCount++;
    }
    
    this.metrics.successRate = 
      ((this.metrics.totalGenerated - this.metrics.errorCount) / 
       this.metrics.totalGenerated) * 100;
    
    this.saveMetrics();
  }

  async saveMetrics() {
    try {
      const metricsFile = path.join(process.cwd(), 'data/auto-blog-metrics.json');
      await fs.writeFile(metricsFile, JSON.stringify(this.metrics, null, 2));
    } catch (error) {
      console.error('Error saving metrics:', error);
    }
  }

  getHealthStatus() {
    const uptime = Date.now() - this.startTime;
    return {
      status: 'healthy',
      uptime,
      metrics: this.metrics,
      lastCheck: new Date().toISOString()
    };
  }
}

export default AutoBlogMonitor;
