export default defineNuxtConfig({
  // ... other config
  vite: {
    server: {
      hmr: {
        port: 24679  // Use a different port
      }
    }
  }
})
