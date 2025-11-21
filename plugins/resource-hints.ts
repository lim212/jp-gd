export default defineNuxtPlugin(() => {
  // Add critical resource hints
  const addResourceHints = () => {
    // Preconnect to critical origins
    const preconnectOrigins = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://cdn.jsdelivr.net'
    ]

    preconnectOrigins.forEach(origin => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = origin
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })

    // DNS prefetch for other domains
    const dnsPrefetchDomains = [
      '//blog.jasapembayaran.com',
      '//i0.wp.com',
      '//i1.wp.com',
      '//i2.wp.com'
    ]

    dnsPrefetchDomains.forEach(domain => {
      const link = document.createElement('link')
      link.rel = 'dns-prefetch'
      link.href = domain
      document.head.appendChild(link)
    })
  }

  if (import.meta.client) {
    // Add hints as early as possible
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', addResourceHints)
    } else {
      addResourceHints()
    }
  }
})

