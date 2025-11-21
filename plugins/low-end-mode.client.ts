import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  if (import.meta.server) return
  try {
    const d = document.documentElement
    const dm = (navigator as any).deviceMemory
    const hc = (navigator as any).hardwareConcurrency
    const isLowMem = typeof dm === 'number' && dm <= 2
    const isLowCpu = typeof hc === 'number' && hc <= 2
    const isLowEnd = !!(isLowMem || isLowCpu)
    if (isLowEnd) {
      d.classList.add('low-end')
      d.setAttribute('data-low-end', '1')
    } else {
      d.classList.remove('low-end')
      d.removeAttribute('data-low-end')
    }
  } catch {}
})
