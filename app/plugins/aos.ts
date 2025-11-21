export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.client) return

  // Check device type based on window width
  const isMobile = window.innerWidth < 640
  const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024

  // Network-aware: also disable animations when connection is slow or Save-Data is on
  const net = useState<{ slow: boolean; reason?: string }>('net-mode')
  const isSlowNet = (window as any).__NET_SLOW__ === true || !!net.value?.slow || ((navigator as any)?.connection?.saveData === true)

  // Smart-mode gate: fully disable animations when smart mode is active
  const isSmart = (window as any).__SMART_MODE__ === true || document.documentElement.classList.contains('smart-mode')

  // We'll lazily import AOS only when needed to keep initial bundle light
  let aosModule: any | null = null

  const initAos = async () => {
    if (aosModule) return aosModule
    const mod = await import('aos')
    await import('aos/dist/aos.css')
    aosModule = mod
    return mod
  }

  const setup = async () => {
    if (isSmart || isMobile || isTablet || isSlowNet) {
      // Do not import AOS at all in disabled scenarios
      try { (nuxtApp as any).AOS = { refresh: () => {}, init: () => ({}) } } catch {}
      return
    }

    // Desktop + fast network: load and init with performant defaults
    const { default: Aos } = await initAos()
    ;(nuxtApp as any).AOS = Aos.init({
      delay: 300,
      once: true, // Only animate once to improve performance
      throttleDelay: 100,
      offset: 120,
      duration: 700,
      easing: 'ease-in-out'
    })
  }

  // Defer initialization to idle to avoid blocking first paint
  const defer = (window as any).jpDefer as undefined | ((fn: () => void, timeout?: number) => void)
  if (typeof defer === 'function') defer(() => { setup() }, 1200)
  else setTimeout(() => { setup() }, 0)

  // Debounced resize handler — refresh only if AOS was loaded
  let resizeTimer: any
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(async () => {
      try {
        if (aosModule) {
          const { default: Aos } = aosModule
          Aos.refresh()
        }
      } catch {}
    }, 250)
  })
})
