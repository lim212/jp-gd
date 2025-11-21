// plugins/image-skeleton.client.ts
// Global lightweight skeleton loader and smart lazy-loading for <img> elements
// - Adds shimmer skeleton while images are loading
// - Sets loading="lazy" and decoding="async" by default (non-invasive)
// - Respects existing components (NetworkAwareImage) and attributes
// - Adapts behaviour for smart-mode (reduced animation, lower fetchpriority)

import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) return

  // Avoid duplicate registration
  const g: any = globalThis as any
  if (g.__JP_IMG_SKELETON__) return
  g.__JP_IMG_SKELETON__ = true

  const SMART = () => {
    try { return (window as any).__SMART_MODE__ === true } catch { return false }
  }

  // Inject minimal CSS once
  try {
    if (!document.getElementById('jp-img-skeleton-style')) {
      const st = document.createElement('style')
      st.id = 'jp-img-skeleton-style'
      st.textContent = `
img.jp-img-loading{
  /* Brand-colored shimmer with a bottom indeterminate bar */
  position: relative;
  background-color: #f8fafc;
  background-image:
    linear-gradient(100deg, rgba(59,130,246,0.18) 20%, rgba(59,130,246,0.35) 28%, rgba(59,130,246,0.18) 36%),
    linear-gradient(90deg, #3b82f6, #60a5fa);
  background-size: 200% 100%, 30% 3px;
  background-repeat: no-repeat, no-repeat;
  background-position: 200% 0, -30% calc(100% - 2px);
  animation: jp-shimmer 1.2s linear infinite;
  color: transparent !important; /* hide alt text */
}

/* Visible text label while loading */
img.jp-img-loading::before{
  content: attr(data-loading-label);
  position: absolute;
  left: 50%;
  top: calc(50% + 24px);
  transform: translate(-50%, 0);
  font-size: 12px;
  line-height: 1;
  color: #1f2937;
  background: rgba(255,255,255,0.7);
  padding: 2px 8px;
  border-radius: 9999px;
  backdrop-filter: saturate(120%) blur(2px);
  white-space: nowrap;
}

/* Center spinner icon using pseudo-element */
img.jp-img-loading::after{
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 26px;
  height: 26px;
  margin-left: -13px;
  margin-top: -13px;
  border: 3px solid rgba(59, 130, 246, 0.25);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: jp-spin 1s linear infinite;
}

/* Dark mode adjustment */
html.dark img.jp-img-loading{
  background-color: #0b1220;
  background-image:
    linear-gradient(100deg, rgba(96,165,250,0.20) 20%, rgba(96,165,250,0.40) 28%, rgba(96,165,250,0.20) 36%),
    linear-gradient(90deg, #60a5fa, #93c5fd);
}
html.dark img.jp-img-loading::before{
  color: #e5e7eb;
  background: rgba(17,24,39,0.55);
}
html.dark img.jp-img-loading::after{
  border-color: rgba(96, 165, 250, 0.25);
  border-top-color: #60a5fa;
}

/* Reduce CPU for smart-mode and users preferring less motion */
html.smart-mode img.jp-img-loading{ animation-duration: 1.8s }
html.smart-mode img.jp-img-loading::after{ animation-duration: 1.4s }
@media (prefers-reduced-motion: reduce){ img.jp-img-loading{ animation: none; } img.jp-img-loading::after{ animation: none; } }

img.jp-img-error{
  background: #eef1f5 !important;
}
html.dark img.jp-img-error{ background: #1f2937 !important; }

@keyframes jp-shimmer{
  0%{ background-position: 200% 0, -30% calc(100% - 2px) }
  100%{ background-position: -200% 0, 130% calc(100% - 2px) }
}
@keyframes jp-spin { to { transform: rotate(360deg); } }
`
      document.head.appendChild(st)
    }
  } catch {}

  const isEnhanced = (img: HTMLImageElement) => {
    try {
      if (img.closest('.network-aware-image')) return true
      const cls = img.className || ''
      if (/\b(loaded-img|placeholder-img|error-img)\b/.test(cls)) return true
      if (img.hasAttribute('data-enhanced')) return true
    } catch {}
    return false
  }

  const inViewport = (el: Element) => {
    try {
      const r = el.getBoundingClientRect()
      return r.top < window.innerHeight && r.bottom > 0 && r.left < window.innerWidth && r.right > 0
    } catch { return false }
  }

  let firstBoosted = 0
  const boostLimit = 2

  const processImg = (img: HTMLImageElement) => {
    if ((img as any).__jpSkel) return
    ;(img as any).__jpSkel = true

    if (isEnhanced(img)) return

    // Hints: decoding async by default
    if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async')

    // Set loading hint only if not explicitly set
    const hasExplicitLoading = img.hasAttribute('loading')

    // Smart-mode: prefer lazy and low priority for offscreen images
    const smart = SMART()

    // Prioritize first visible, reasonably sized images (likely LCP)
    const visibleNow = inViewport(img)
    const maybeLarge = (img.width || img.clientWidth || 0) >= 80

    if (!hasExplicitLoading) {
      if (visibleNow && firstBoosted < boostLimit && maybeLarge) {
        img.setAttribute('loading', 'eager')
        img.setAttribute('fetchpriority', 'high')
        firstBoosted++
      } else {
        img.setAttribute('loading', 'lazy')
      }
    }

    // For smart-mode, gently lower priority for non-visible images
    if (smart && !visibleNow && !img.hasAttribute('fetchpriority')) {
      img.setAttribute('fetchpriority', 'low')
    }

    const onDone = () => {
      img.classList.remove('jp-img-loading')
      img.classList.remove('jp-img-error')
      try{ img.removeAttribute('aria-busy'); }catch(_){ }
      try{ img.removeAttribute('aria-label'); }catch(_){ }
      try{ img.removeAttribute('data-loading-label'); }catch(_){ }
    }
    const onError = () => {
      img.classList.remove('jp-img-loading')
      img.classList.add('jp-img-error')
      try{ img.setAttribute('aria-busy','false'); }catch(_){ }
      try{ img.setAttribute('data-loading-label','Gagal memuat'); }catch(_){ }
      try{ img.setAttribute('aria-label','Gagal memuat gambar'); }catch(_){ }
    }

    // Apply skeleton if not already complete
    if (!img.complete || (img.complete && img.naturalWidth === 0)) {
      img.classList.add('jp-img-loading')
      try { if (!img.hasAttribute('data-loading-label')) img.setAttribute('data-loading-label', 'Sedang memuat…') } catch {}
      try { img.setAttribute('aria-busy', 'true') } catch {}
      try {
        const alt = img.getAttribute('alt') || ''
        img.setAttribute('aria-label', alt ? ('Sedang memuat: ' + alt) : 'Sedang memuat gambar')
      } catch {}
      img.addEventListener('load', onDone, { once: true })
      img.addEventListener('error', onError, { once: true })
    }
  }

  const scanAll = () => {
    try {
      firstBoosted = 0
      const imgs = Array.from(document.querySelectorAll('img')) as HTMLImageElement[]
      imgs.forEach(processImg)
    } catch {}
  }

  // Observe new images added to DOM
  try {
    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.addedNodes) {
          m.addedNodes.forEach((n) => {
            if (n.nodeType === 1) {
              const el = n as Element
              if (el.tagName === 'IMG') processImg(el as HTMLImageElement)
              if (typeof (el as any).querySelectorAll === 'function') {
                el.querySelectorAll('img').forEach((i) => processImg(i as HTMLImageElement))
              }
            }
          })
        }
      }
    })
    mo.observe(document.documentElement, { childList: true, subtree: true })
  } catch {}

  // Nuxt hooks
  nuxtApp.hook('app:mounted', () => scanAll())
  nuxtApp.hook('page:finish', () => scanAll())

  // Fallback triggers
  window.addEventListener('DOMContentLoaded', scanAll, { once: true })
  window.addEventListener('load', scanAll, { once: true })
})
