// plugins/image-enhancer.ts
// Image Enhancer Plugin (Nuxt 3)
// - Lazy/responsive/network-aware images untuk konten <article>
// - Aman dari double-inject & double-listener
// - Menyediakan $imageEnhancer (bukan $enhanceImages) untuk trigger manual

import { defineNuxtPlugin } from '#app'
import { createApp, h } from 'vue'
import NetworkAwareImage from '../app/components/NetworkAwareImage.vue'

export default defineNuxtPlugin((nuxtApp) => {
  // 1) Client only
  if (import.meta.server) return
  // Disable this enhancer in development to avoid image replacement issues and slowness
  if (process.env.NODE_ENV === 'development') {
    console.warn('[image-enhancer] Disabled in development mode')
    return
  }
  // Skip enhancer entirely in smart-mode (light mode for slow devices/networks)
  try {
    if ((window as any).__SMART_MODE__ === true) {
      console.warn('[image-enhancer] Skipped in smart-mode')
      return
    }
  } catch {}

  // Prevent duplicate registration across multiple plugin files
  const anyNuxt = nuxtApp as any
  if (anyNuxt.$enhanceImages) {
    return
  }
  const g: any = globalThis as any
  if (g.__IMAGE_ENHANCER_REGISTERED__) {
    return
  }
  g.__IMAGE_ENHANCER_REGISTERED__ = true

  const KEY = 'imageEnhancer' // <— injection name ($imageEnhancer)
  const gp = nuxtApp.vueApp.config.globalProperties as Record<string, any>

  // 2) Guards: jangan inject kalau sudah ada
  if ((nuxtApp as any)['$' + KEY]) return
  if (Object.prototype.hasOwnProperty.call(gp, '$' + KEY)) return

  // 3) Worker: enhance semua <img> di dalam <article>
  const enhanceImages = () => {
    // kecilkan risk race-condition render
    setTimeout(() => {
      const articles = document.querySelectorAll('article')

      articles.forEach((article) => {
        // Demote H1 di dalam article -> H2 (tetap satu H1 per page)
        try {
          const h1s = article.querySelectorAll('h1')
          h1s.forEach((h1) => {
            const h2 = document.createElement('h2')
            h2.innerHTML = h1.innerHTML
            Array.from(h1.attributes).forEach((attr) =>
              h2.setAttribute(attr.name, attr.value)
            )
            h1.replaceWith(h2)
          })
        } catch {
          // ignore
        }

        // Ambil img yang belum di-enhance
        const images = article.querySelectorAll(
          'img:not(.loaded-img):not(.placeholder-img):not(.error-img)'
        )

        images.forEach((img) => {
          // skip kalau sudah diproses
          if (img.hasAttribute('data-enhanced')) return
          img.setAttribute('data-enhanced', 'true')

          const src = img.getAttribute('src') || ''
          let alt = (img.getAttribute('alt') || '').trim()
          const width = img.getAttribute('width') || null
          const height = img.getAttribute('height') || null
          const className = img.getAttribute('class') || ''

          if (!alt) {
            const pageH1 = document.querySelector('h1')?.textContent?.trim()
            if (pageH1 && pageH1.length > 0) {
              // Optimize alt text for PayPal-related content
              if (pageH1.toLowerCase().includes('paypal') || pageH1.toLowerCase().includes('jasa')) {
                alt = `Ilustrasi Jasa PayPal Terpercaya: ${pageH1}`
              } else {
                alt = `Ilustrasi: ${pageH1}`
              }
            } else {
              try {
                const url = new URL(src, window.location.origin)
                const fname = url.pathname.split('/').pop() || ''
                const base = fname
                  .replace(/[-_]/g, ' ')
                  .replace(/\.[a-zA-Z0-9]+$/, '')
                
                // Check if it's PayPal-related image
                if (base.toLowerCase().includes('paypal') || base.toLowerCase().includes('jasa')) {
                  alt = base ? `Ilustrasi Jasa PayPal Terpercaya: ${base}` : 'Ilustrasi Jasa PayPal Terpercaya'
                } else {
                  alt = base ? `Ilustrasi: ${base}` : 'Ilustrasi artikel'
                }
              } catch {
                alt = 'Ilustrasi Jasa PayPal Terpercaya'
              }
            }
          }

          if (!src) return

          // Bungkus & mount komponen pengganti
          const wrapper = document.createElement('div')
          wrapper.className = 'network-aware-image-wrapper'
          img.parentNode?.insertBefore(wrapper, img)

          try {
            const app = createApp({
              render() {
                return h(NetworkAwareImage, {
                  src,
                  alt,
                  width,
                  height,
                  class: className,
                  quality: 'auto'
                })
              }
            })
            app.mount(wrapper)
            img.remove()
          } catch {}
        })
      })
    }, 500)
  }

  // 4) Hooks + listeners (hindari double register)
  nuxtApp.hook('app:mounted', () => enhanceImages())
  nuxtApp.hook('page:finish', () => enhanceImages())

  if (!g.__IMAGE_ENHANCER_LISTENERS__) {
    window.addEventListener('DOMContentLoaded', enhanceImages)
    window.addEventListener('load', enhanceImages)
    g.__IMAGE_ENHANCER_LISTENERS__ = true
  }

  // 5) Provide method manual → useNuxtApp().$imageEnhancer?.()
  return {
    provide: {
      [KEY]: enhanceImages
    }
  }
})

