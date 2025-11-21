
// Image Optimization Configuration
export const imageOptimization = {
  // WebP conversion
  webp: {
    quality: 80,
    lossless: false,
    nearLossless: false,
    smartSubsample: true
  },

  // AVIF conversion
  avif: {
    quality: 70,
    lossless: false,
    speed: 4
  },

  // Responsive images
  responsive: {
    breakpoints: [320, 640, 768, 1024, 1280, 1920],
    sizes: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
  },

  // Lazy loading
  lazy: {
    rootMargin: '50px 0px',
    threshold: 0.1,
    placeholder: 'blur'
  },

  // Compression
  compression: {
    jpeg: { quality: 85 },
    png: { quality: 90 },
    webp: { quality: 80 },
    avif: { quality: 70 }
  }
};
