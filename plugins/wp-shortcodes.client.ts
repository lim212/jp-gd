// Lightweight shortcode enhancer for ChatGPT-generated HTML inside .post-content
// Supports:
//   [jp-book size=64 color="#1976D2" label="Loading Buku"]
//   [jp-cool size=64 color="#1976D2" label="Loading..."]
//   [jp-progress duration=30 start=50 target=100 size=96 color="#1976D2" label="Proses"]
// Also accepts aliases: jp-book-loader, jp-cool-loader, jp-progress-countdown
//
// The CSS classes used here are defined in app/assets/css/main.css

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  const timers = new WeakMap<Element, number>()

  function escapeHtml(text: string): string {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  function parseAttrs(input: string): Record<string, string> {
    const out: Record<string, string> = {}
    const re = /(\w+)=(?:"([^"]*)"|'([^']*)'|([^\s\]]+))/g
    let m: RegExpExecArray | null
    while ((m = re.exec(input))) {
      const key = (m[1] || '').toLowerCase()
      const val = (m[2] ?? m[3] ?? m[4] ?? '').trim()
      out[key] = val
    }
    return out
  }

  function clamp(num: number, min: number, max: number) {
    return Math.min(max, Math.max(min, num))
  }

  function formatTimeLeft(ms: number) {
    const sec = Math.max(0, Math.ceil(ms / 1000))
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  function initProgress(el: HTMLElement) {
    // Avoid double-init
    if (timers.has(el)) return

    const radius = 54
    const circumference = 2 * Math.PI * radius

    const bar = el.querySelector('.bar') as SVGCircleElement | null
    const label = el.querySelector('.label') as HTMLElement | null
    if (!bar || !label) return

    bar.style.strokeDasharray = String(circumference)

    const durationSec = Number(el.getAttribute('data-duration')) || 30
    const durationMs = durationSec * 1000
    const start = clamp(Number(el.getAttribute('data-start')) || 0, 0, 100)
    const target = clamp(Number(el.getAttribute('data-target')) || 100, 0, 100)

    const startTime = performance.now()

    function setPercent(p: number, timeLeft: number) {
      const pct = clamp(p, 0, 100)
      const offset = circumference * (1 - pct / 100)
      bar.style.strokeDashoffset = String(offset)

      const done = Math.round(pct)
      const remaining = Math.max(0, 100 - done)

      const span = label.querySelector('span') || document.createElement('span')
      const small = label.querySelector('small') || document.createElement('small')
      span.textContent = `${done}%`
      small.textContent = `sisa ${remaining}% • ${formatTimeLeft(timeLeft)}`
      if (!label.contains(span)) label.appendChild(span)
      if (!label.contains(small)) label.appendChild(small)
    }

    function frame(now: number) {
      const elapsed = now - startTime
      const t = durationMs <= 0 ? 1 : Math.min(1, elapsed / durationMs)
      const current = start + (target - start) * t
      setPercent(current, Math.max(0, durationMs - elapsed))

      if (t < 1) {
        const id = requestAnimationFrame(frame)
        timers.set(el, id)
      } else {
        timers.delete(el)
      }
    }

    setPercent(start, durationMs)
    const id = requestAnimationFrame(frame)
    timers.set(el, id)
  }

  function buildStyle(size?: string, color?: string) {
    const s = size ? `--icon-size:${parseInt(size, 10)}px;` : ''
    const c = color ? `--icon-color:${color};` : ''
    return (s || c) ? ` style="${s}${c}"` : ''
  }

  function replaceShortcodes(container: HTMLElement) {
    const original = container.innerHTML

    // Quick check to avoid unnecessary work
    if (!/\[(jp-book|jp-book-loader|jp-cool|jp-cool-loader|jp-progress|jp-progress-countdown)([^\]]*)\]/i.test(original)) {
      return false
    }

    let html = original

    // Book loader
    html = html.replace(/\[(jp-book|jp-book-loader)([^\]]*)\]/gi, (_m, _n, attrs) => {
      const a = parseAttrs(attrs || '')
      const size = a.size || a.s
      const color = a.color || a.c
      const label = escapeHtml(a.label || a.text || 'Loading Buku…')
      const style = buildStyle(size, color)
      return `<div class="icon-center icon-stack-safe"${style}>` +
             `<div class="jp-book-loader" role="img" aria-label="${label}">` +
             `<div class="book"><div class="spine"></div>` +
             `<div class="page animate"></div><div class="page animate p2"></div><div class="page animate p3"></div>` +
             `</div></div>` +
             `<div class="label">${label}</div>` +
             `</div>`
    })

    // Cool loader
    html = html.replace(/\[(jp-cool|jp-cool-loader)([^\]]*)\]/gi, (_m, _n, attrs) => {
      const a = parseAttrs(attrs || '')
      const size = a.size || a.s
      const color = a.color || a.c
      const label = escapeHtml(a.label || a.text || 'Loading…')
      const style = buildStyle(size, color)
      return `<div class="icon-center icon-stack-safe"${style}>` +
             `<div class="jp-cool-loader" role="img" aria-label="${label}"></div>` +
             `<div class="label">${label}</div>` +
             `</div>`
    })

    // Progress countdown (30s default)
    html = html.replace(/\[(jp-progress|jp-progress-countdown)([^\]]*)\]/gi, (_m, _n, attrs) => {
      const a = parseAttrs(attrs || '')
      const size = a.size || a.s
      const color = a.color || a.c
      const label = escapeHtml(a.label || a.text || 'Proses')
      const duration = a.duration || a.time || a.t || '30'
      const start = a.start || a.from || '50'
      const target = a.target || a.to || '100'
      const style = buildStyle(size, color)
      return `<div class="icon-center icon-stack-safe"${style}>` +
             `<div class="jp-progress" data-duration="${Number(duration)}" data-start="${Number(start)}" data-target="${Number(target)}">` +
             `<svg viewBox="0 0 120 120" role="img" aria-label="${label}">` +
             `<circle class="bg" cx="60" cy="60" r="54" fill="none" stroke-width="12"></circle>` +
             `<circle class="bar" cx="60" cy="60" r="54" fill="none" stroke-width="12" stroke-linecap="round"></circle>` +
             `</svg>` +
             `<div class="label" aria-live="polite"><span></span><small></small></div>` +
             `</div>` +
             `</div>`
    })

    if (html !== original) {
      container.innerHTML = html
      // Initialize any progress instances inside this container
      container.querySelectorAll<HTMLElement>('.jp-progress').forEach(initProgress)
      return true
    }

    return false
  }

  function enhance(target?: HTMLElement) {
    type WithProcessed = HTMLElement & { __jpShortcodesProcessed?: boolean }
    const roots = (target ? [target] : Array.from(document.querySelectorAll<HTMLElement>('.post-content'))) as WithProcessed[]
    roots.forEach((root) => {
      // Skip if already processed and contains no shortcodes
      if (root.__jpShortcodesProcessed) {
        // Still ensure any jp-progress present gets initialized (e.g., server-rendered)
        root.querySelectorAll<HTMLElement>('.jp-progress').forEach(initProgress)
        return
      }

      const _changed = replaceShortcodes(root)
      // Mark as processed regardless, to avoid re-parsing each mutation
      root.__jpShortcodesProcessed = true

      // Initialize progress rings if present
      root.querySelectorAll<HTMLElement>('.jp-progress').forEach(initProgress)
    })
  }

  // Run once on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => enhance())
  } else {
    enhance()
  }

  // Observe future changes (navigations/component swaps)
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      m.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return
        if (node.matches && node.matches('.post-content')) {
          enhance(node)
        } else if (node.querySelector) {
          const inner = node.querySelector('.post-content') as HTMLElement | null
          if (inner) enhance(inner)
        }
      })
    }
  })

  observer.observe(document.body, { childList: true, subtree: true })
})
