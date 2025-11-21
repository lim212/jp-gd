/**
 * Force Light Mode on First Visit
 * Plugin ini memaksa klien untuk menggunakan light mode pada kunjungan pertama,
 * terlepas dari preferensi browser. Setelah kunjungan pertama, preferensi user
 * akan dihormati.
 * 
 * IMPORTANT: Plugin ini harus dijalankan SEBELUM Nuxt Color Mode membaca localStorage
 */

export default defineNuxtPlugin({
  name: 'force-light-mode-first-visit',
  enforce: 'pre', // Jalankan sebelum plugin lain, termasuk colorMode
  setup() {
    // Hanya jalankan di client-side
    if (process.server) return

    // Jalankan segera tanpa menunggu DOM (karena kita perlu set localStorage sebelum colorMode membaca)
    if (typeof window === 'undefined') return

    try {
      const storageKey = 'color-mode'
      const firstVisitFlag = 'first-visit-completed'
      const ls = window.localStorage

      // Cek apakah ini kunjungan pertama
      const isFirstVisit = !ls.getItem(firstVisitFlag)

      if (isFirstVisit) {
        console.log('🌞 First visit detected - Forcing light mode (ignoring browser preference)')

        // Paksa set ke light mode SEBELUM colorMode membaca
        // Hapus 'system' jika ada, karena kita tidak ingin mengikuti browser
        const currentValue = ls.getItem(storageKey)
        if (currentValue === 'system' || !currentValue) {
          ls.setItem(storageKey, 'light')
        } else if (currentValue !== 'light') {
          // Jika user sudah pernah set ke dark, tetap paksa ke light pada first visit
          ls.setItem(storageKey, 'light')
        }
        
        // Set flag bahwa ini bukan kunjungan pertama lagi
        ls.setItem(firstVisitFlag, 'true')

        // Update DOM segera setelah DOM ready
        const applyLightMode = () => {
          try {
            const root = document.documentElement
            root.classList.remove('dark', 'system')
            root.classList.add('light')
            root.setAttribute('data-color-mode', 'light')
            root.setAttribute('data-theme', 'light')

            // Set color-scheme meta untuk konsistensi
            const metaThemeColor = document.querySelector('meta[name="theme-color"]')
            if (metaThemeColor) {
              metaThemeColor.setAttribute('content', '#ffffff')
            }

            // Pastikan body juga light
            if (document.body) {
              document.body.classList.remove('dark')
              document.body.classList.add('light')
            }

            console.log('✅ Light mode forced on first visit')
          } catch (err) {
            console.warn('⚠️ Error applying light mode to DOM:', err)
          }
        }

        // Apply segera jika DOM sudah ready, atau tunggu DOM ready
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', applyLightMode, { once: true })
        } else {
          applyLightMode()
        }

        // Juga apply setelah sedikit delay untuk memastikan
        setTimeout(applyLightMode, 0)
      } else {
        console.log('👤 Returning visitor - Respecting saved preference')
      }
    } catch (error) {
      console.warn('⚠️ Error forcing light mode on first visit:', error)
    }
  }
})

