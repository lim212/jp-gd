
// Resource Hints System
export class ResourceHintsSystem {
  constructor() {
    this.hints = new Map();
    this.init();
  }

  init() {
    if (process.client) {
      this.addCriticalHints();
      this.addDynamicHints();
    }
  }

  addCriticalHints() {
    // DNS prefetch for external domains
    const dnsPrefetchDomains = [
      'fonts.googleapis.com',
      'fonts.gstatic.com',
      'cdn.jsdelivr.net',
      'unpkg.com'
    ];

    dnsPrefetchDomains.forEach(domain => {
      this.addHint('dns-prefetch', domain);
    });

    // Preconnect to critical origins
    const preconnectOrigins = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ];

    preconnectOrigins.forEach(origin => {
      this.addHint('preconnect', origin, { crossorigin: 'anonymous' });
    });

    // Preload critical resources
    const criticalResources = [
      { href: '/fonts/Poppins-Regular.woff2', as: 'font', type: 'font/woff2' },
      { href: '/css/critical.css', as: 'style' },
      { href: '/images/logo.webp', as: 'image' }
    ];

    criticalResources.forEach(resource => {
      this.addHint('preload', resource.href, resource);
    });
  }

  addDynamicHints() {
    // Prefetch likely next pages
    const likelyPages = [
      '/testimonials',
      '/informasi/transaksi',
      '/blog'
    ];

    // Add prefetch hints after page load
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        setTimeout(() => {
          likelyPages.forEach(page => {
            this.addHint('prefetch', page, { as: 'document' });
          });
        }, 2000);
      });
    }
  }

  addHint(rel, href, attributes = {}) {
    if (typeof document === 'undefined') return;
    
    const hint = document.createElement('link');
    hint.rel = rel;
    hint.href = href;
    
    Object.entries(attributes).forEach(([key, value]) => {
      hint.setAttribute(key, value);
    });
    
    document.head.appendChild(hint);
    this.hints.set(href, hint);
  }

  removeHint(href) {
    const hint = this.hints.get(href);
    if (hint && hint.parentNode) {
      hint.parentNode.removeChild(hint);
      this.hints.delete(href);
    }
  }
}

// Initialize resource hints system
if (process.client && typeof document !== 'undefined' && typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.resourceHintsSystem = new ResourceHintsSystem();
  });
}
