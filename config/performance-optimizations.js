
// Performance Optimizations for Nuxt Config
export const performanceOptimizations = {
  // Vite optimizations
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Core Vue chunks
            'vue-vendor': ['vue', '@vue/runtime-core', '@vue/runtime-dom'],
            // UI components
            'ui-vendor': ['@nuxt/ui', '@nuxtjs/color-mode'],
            // Icons
            'icons-vendor': ['@iconify/vue', 'lucide-vue-next'],
            // Utils
            'utils-vendor': ['@vueuse/core', '@vueuse/head'],
            // Large libraries
            'large-vendor': ['swiper', 'aos']
          }
        }
      }
    },
    optimizeDeps: {
      include: [
        'vue',
        '@vue/runtime-core',
        '@vue/runtime-dom',
        '@vueuse/core',
        '@vueuse/head'
      ]
    }
  },

  // Nitro optimizations
  nitro: {
    compressPublicAssets: true,
    minify: true,
    sourceMap: false,
    experimental: {
      wasm: false
    },
    routeRules: {
      // Static assets with long cache
      '/_nuxt/**': { 
        headers: { 
          'cache-control': 'public, max-age=31536000, immutable' 
        } 
      },
      '/images/**': { 
        headers: { 
          'cache-control': 'public, max-age=2592000, immutable' 
        } 
      },
      '/icons/**': { 
        headers: { 
          'cache-control': 'public, max-age=2592000, immutable' 
        } 
      },
      '/fonts/**': { 
        headers: { 
          'cache-control': 'public, max-age=31536000, immutable' 
        } 
      }
    }
  },

  // Image optimizations
  image: {
    quality: 80,
    format: ['webp', 'avif'],
    densities: [1, 2],
    placeholder: true,
    loading: 'lazy',
    presets: {
      thumbnail: { 
        modifiers: { 
          width: 300, 
          height: 200, 
          fit: 'cover', 
          format: 'webp', 
          quality: 75 
        } 
      },
      medium: { 
        modifiers: { 
          width: 600, 
          height: 400, 
          fit: 'cover', 
          format: 'webp', 
          quality: 80 
        } 
      },
      large: { 
        modifiers: { 
          width: 1200, 
          height: 800, 
          fit: 'cover', 
          format: 'webp', 
          quality: 85 
        } 
      }
    }
  }
};
