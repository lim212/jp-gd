// plugins/sidebar-widgets.client.ts
// Applies behaviors only to elements with .sidebar-widget, .widget-header, .widget-body
// - Mobile (≤768px): accordion (body hidden by default; tap header to toggle .is-open)
// - Desktop: body remains visible; long content scrolls via CSS
// - Empty body: add .is-empty to widget to hide it (CSS handles display:none)

import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) return

  const MOBILE_BREAKPOINT = 768
  const isMobile = () => window.innerWidth <= MOBILE_BREAKPOINT
  const boundHeaders = new WeakSet<HTMLElement>()

  const updateEmptyState = (widget: Element) => {
    const body = widget.querySelector('.widget-body') as HTMLElement | null
    if (!body) return

    // Consider empty if no child elements and no non-whitespace text
    const hasElements = body.children.length > 0
    const text = (body.textContent || '').replace(/\u200B/g, '').trim()
    const isEmpty = !hasElements && text.length === 0

    widget.classList.toggle('is-empty', isEmpty)
  }

  const updateAriaExpanded = (widget: Element, header: HTMLElement) => {
    // On desktop, treat as expanded; on mobile, reflect .is-open state
    const expanded = !isMobile() || widget.classList.contains('is-open')
    header.setAttribute('aria-expanded', String(expanded))
  }

  const bindWidget = (widget: Element) => {
    const header = widget.querySelector('.widget-header') as HTMLElement | null
    if (!header) return

    // Avoid duplicate bindings on route changes
    if (boundHeaders.has(header)) return
    boundHeaders.add(header)

    header.setAttribute('role', 'button')
    header.setAttribute('tabindex', '0')

    const toggle = () => {
      if (!isMobile()) return
      widget.classList.toggle('is-open')
      updateAriaExpanded(widget, header)
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        toggle()
      }
    }

    header.addEventListener('click', toggle)
    header.addEventListener('keydown', onKeyDown)

    updateAriaExpanded(widget, header)
  }

  const init = () => {
    const widgets = Array.from(document.querySelectorAll('.sidebar-widget'))
    if (!widgets.length) return

    widgets.forEach((widget) => {
      updateEmptyState(widget)
      bindWidget(widget)
    })

    // Recheck emptiness shortly after to catch late-rendered content
    setTimeout(() => widgets.forEach(updateEmptyState), 300)
    setTimeout(() => widgets.forEach(updateEmptyState), 1200)
  }

  const onResize = () => {
    const headers = document.querySelectorAll<HTMLElement>('.sidebar-widget .widget-header')
    headers.forEach((header) => {
      const widget = header.closest('.sidebar-widget')
      if (!widget) return
      updateAriaExpanded(widget, header)
    })
  }

  // Initialize on mount
  nuxtApp.hook('app:mounted', () => {
    init()
    window.addEventListener('resize', onResize)
  })

  // Re-init on route changes or page transitions
  const router = nuxtApp.$router
  if (router && typeof router.afterEach === 'function') {
    router.afterEach(() => setTimeout(init, 0))
  }
  nuxtApp.hook('page:finish', () => setTimeout(init, 0))
})
