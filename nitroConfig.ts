export default {
  hooks: {
    'build:manifest': async () => {
      return new Promise(resolve => setTimeout(resolve, 3000))
    }
  },

  nitro: {
    routeRules: {
      '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      '/api/**': { headers: { 'cache-control': 'no-store, max-age=0, must-revalidate' } },
      '/**': { headers: { 'cache-control': 'no-store, max-age=0, must-revalidate' } }
    }
  }
}
