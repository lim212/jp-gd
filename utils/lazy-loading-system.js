
// Advanced Lazy Loading System
export class LazyLoadingSystem {
  constructor() {
    this.observer = null;
    this.images = new Set();
    this.init();
  }

  init() {
    if (typeof IntersectionObserver === 'undefined') {
      // Fallback for older browsers
      this.loadAllImages();
      return;
    }

    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        rootMargin: '50px 0px',
        threshold: 0.1
      }
    );

    this.observeImages();
  }

  observeImages() {
    const images = document.querySelectorAll('img[data-src], img[data-srcset]');
    images.forEach(img => {
      this.images.add(img);
      this.observer.observe(img);
    });
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        this.loadImage(img);
        this.observer.unobserve(img);
        this.images.delete(img);
      }
    });
  }

  loadImage(img) {
    // Add loading class
    img.classList.add('loading');
    
    // Create new image to preload
    const newImg = new Image();
    
    newImg.onload = () => {
      // Image loaded successfully
      img.src = newImg.src;
      if (img.dataset.srcset) {
        img.srcset = newImg.srcset;
      }
      img.classList.remove('loading');
      img.classList.add('loaded');
    };
    
    newImg.onerror = () => {
      // Image failed to load
      img.classList.remove('loading');
      img.classList.add('error');
    };
    
    // Set source
    if (img.dataset.src) {
      newImg.src = img.dataset.src;
    }
    if (img.dataset.srcset) {
      newImg.srcset = img.dataset.srcset;
    }
  }

  loadAllImages() {
    // Fallback: load all images immediately
    const images = document.querySelectorAll('img[data-src], img[data-srcset]');
    images.forEach(img => this.loadImage(img));
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Initialize lazy loading system
if (process.client) {
  document.addEventListener('DOMContentLoaded', () => {
    window.lazyLoadingSystem = new LazyLoadingSystem();
  });
}
