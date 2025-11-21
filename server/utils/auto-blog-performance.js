
// Performance Metrics for Auto Blog System
class AutoBlogPerformance {
  constructor() {
    this.metrics = {
      generationTimes: [],
      apiCallTimes: [],
      memoryUsage: [],
      cpuUsage: []
    };
  }

  startTimer(label) {
    return {
      label,
      start: Date.now(),
      end: () => {
        const duration = Date.now() - this.start;
        this.recordMetric(label, duration);
        return duration;
      }
    };
  }

  recordMetric(type, value) {
    if (!this.metrics[type]) {
      this.metrics[type] = [];
    }
    
    this.metrics[type].push({
      value,
      timestamp: Date.now()
    });

    // Keep only last 1000 entries
    if (this.metrics[type].length > 1000) {
      this.metrics[type] = this.metrics[type].slice(-1000);
    }
  }

  getAverageTime(type) {
    const data = this.metrics[type] || [];
    if (data.length === 0) return 0;
    
    const sum = data.reduce((acc, item) => acc + item.value, 0);
    return sum / data.length;
  }

  getPerformanceReport() {
    return {
      averageGenerationTime: this.getAverageTime('generationTimes'),
      averageApiCallTime: this.getAverageTime('apiCallTimes'),
      totalGenerations: this.metrics.generationTimes.length,
      lastGeneration: this.metrics.generationTimes.slice(-1)[0]?.timestamp,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime()
    };
  }

  async saveMetrics() {
    try {
      const metricsFile = path.join(process.cwd(), 'data/performance-metrics.json');
      await fs.writeFile(metricsFile, JSON.stringify(this.metrics, null, 2));
    } catch (error) {
      console.error('Error saving performance metrics:', error);
    }
  }
}

export default AutoBlogPerformance;
