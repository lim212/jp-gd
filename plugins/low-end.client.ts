// plugins/low-end.client.ts
// Detect low-end devices and mark the <html> element to reduce heavy effects
export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  try {
    const d = document.documentElement
    const ram = (navigator as any).deviceMemory
    const cores = (navigator as any).hardwareConcurrency

    const isLowRam = typeof ram === 'number' && ram <= 2
    const isLowCpu = typeof cores === 'number' && cores <= 2

    if (isLowRam || isLowCpu) {
      d.classList.add('low-end')
      d.setAttribute('data-low-end', '1')
    }
  } catch {}
})
