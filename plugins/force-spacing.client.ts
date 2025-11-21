/**
 * Force Spacing Plugin - Direct DOM Manipulation
 * Bypass ALL CSS cache dengan JavaScript langsung!
 */

export default defineNuxtPlugin((nuxtApp) => {
  // Disabled by default unless explicitly enabled via window.__FORCE_SPACING = true
  if (typeof window === 'undefined' || (window as any).__FORCE_SPACING !== true) return

  // Function untuk force spacing - CARI BERDASARKAN TEXT!
  const forceSpacing = () => {
    console.log('🔧 Force Spacing: Starting...')
    console.log('🔍 Mencari element berdasarkan text content...')
    
    // Cari semua div
    const allDivs = Array.from(document.querySelectorAll('div')) as HTMLElement[]
    
    // Cari "Butuh Bantuan" section
    const helpDiv = allDivs.find(div => {
      const text = div.textContent || ''
      return text.includes('Butuh Bantuan') || text.includes('Butuh bantuan')
    })
    
    if (helpDiv) {
      // Cari parent wrapper (naik 2-3 level)
      let wrapper: HTMLElement = helpDiv
      for (let i = 0; i < 3; i++) {
        if (wrapper.parentElement) wrapper = wrapper.parentElement as HTMLElement
      }
      
      wrapper.style.cssText = `
        margin-top: 100px !important;
        margin-bottom: 100px !important;
        padding: 50px !important;
        border: 10px solid red !important;
        background-color: yellow !important;
        box-shadow: 0 0 50px red !important;
        display: block !important;
      `
      console.log('✅ BUTUH BANTUAN section fixed - KUNING!')
    } else {
      console.warn('❌ "Butuh Bantuan" section NOT FOUND!')
    }
    
    // Cari "Trusted Partners" section
    const trustedDiv = allDivs.find(div => {
      const text = div.textContent || ''
      return text.includes('Trusted Partners')
    })
    
    if (trustedDiv) {
      let wrapper: HTMLElement = trustedDiv
      for (let i = 0; i < 2; i++) {
        if (wrapper.parentElement) wrapper = wrapper.parentElement as HTMLElement
      }
      
      wrapper.style.cssText = `
        margin-top: 100px !important;
        margin-bottom: 100px !important;
        padding: 50px !important;
        border: 10px solid blue !important;
        background-color: lightblue !important;
        box-shadow: 0 0 50px blue !important;
        display: block !important;
      `
      console.log('✅ TRUSTED PARTNERS section fixed - BIRU MUDA!')
    } else {
      console.warn('❌ "Trusted Partners" section NOT FOUND!')
    }
    
    // Cari "Jasa PayPal" section
    const aboutDiv = allDivs.find(div => {
      const text = div.textContent || ''
      return text.includes('JASA PAYPAL TERPERCAYA') || text.includes('Apa itu Jasa PayPal')
    })
    
    if (aboutDiv) {
      let wrapper: HTMLElement = aboutDiv
      for (let i = 0; i < 2; i++) {
        if (wrapper.parentElement) wrapper = wrapper.parentElement as HTMLElement
      }
      
      wrapper.style.cssText = `
        margin-top: 100px !important;
        margin-bottom: 100px !important;
        padding: 50px !important;
        border: 10px solid green !important;
        background-color: lightgreen !important;
        box-shadow: 0 0 50px green !important;
        display: block !important;
      `
      console.log('✅ JASA PAYPAL section fixed - HIJAU MUDA!')
    } else {
      console.warn('❌ "Jasa PayPal" section NOT FOUND!')
    }
    
    console.log('🎉 Force Spacing Complete!')
    console.log('Kalau berhasil, Anda akan lihat:')
    console.log('🟡 Kotak 1 = KUNING dengan border MERAH')
    console.log('🔵 Kotak 2 = BIRU MUDA dengan border BIRU')  
    console.log('🟢 Kotak 3 = HIJAU MUDA dengan border HIJAU')
  }

  // Run setelah page load (only when enabled)
  nuxtApp.hook('page:finish', () => {
    setTimeout(() => {
      forceSpacing()
      console.log('🎨 Force Spacing: Complete!')
    }, 100)
  })

  window.addEventListener('load', () => {
    setTimeout(forceSpacing, 500)
  })
  // Run immediately juga
  setTimeout(forceSpacing, 1000)

  console.log('✅ Force Spacing Plugin: Enabled')
})

