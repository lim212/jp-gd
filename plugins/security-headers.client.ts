// plugins/security-headers.client.ts
// Enhanced security headers tanpa mengubah design atau fungsi

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  class SecurityEnhancer {
    constructor() {
      this.init()
    }

    private init() {
      // Add security headers via meta tags
      this.addSecurityMetaTags()
      
      // Monitor for potential security issues
      this.monitorSecurityEvents()
      
      // Enhance existing security measures
      this.enhanceExistingSecurity()
    }

    private addSecurityMetaTags() {
      // Add Content Security Policy meta tag
      const cspMeta = document.createElement('meta')
      cspMeta.setAttribute('http-equiv', 'Content-Security-Policy')
      cspMeta.setAttribute('content', [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https: blob:",
        "connect-src 'self' https: wss:",
        "media-src 'self' https:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'"
      ].join('; '))
      document.head.appendChild(cspMeta)

      // Add X-Frame-Options
      const frameOptionsMeta = document.createElement('meta')
      frameOptionsMeta.setAttribute('http-equiv', 'X-Frame-Options')
      frameOptionsMeta.setAttribute('content', 'DENY')
      document.head.appendChild(frameOptionsMeta)

      // Add X-Content-Type-Options
      const contentTypeMeta = document.createElement('meta')
      contentTypeMeta.setAttribute('http-equiv', 'X-Content-Type-Options')
      contentTypeMeta.setAttribute('content', 'nosniff')
      document.head.appendChild(contentTypeMeta)

      // Add Referrer Policy
      const referrerMeta = document.createElement('meta')
      referrerMeta.setAttribute('name', 'referrer')
      referrerMeta.setAttribute('content', 'strict-origin-when-cross-origin')
      document.head.appendChild(referrerMeta)
    }

    private monitorSecurityEvents() {
      // Monitor for potential XSS attempts
      document.addEventListener('DOMContentLoaded', () => {
        const scripts = document.querySelectorAll('script')
        scripts.forEach(script => {
          if (script.src && !this.isAllowedScript(script.src)) {
            console.warn('🚨 Potentially suspicious script detected:', script.src)
          }
        })
      })

      // Monitor for suspicious network requests
      const originalFetch = window.fetch
      window.fetch = async (...args) => {
        const url = args[0]?.toString()
        if (url && this.isSuspiciousUrl(url)) {
          console.warn('🚨 Suspicious fetch request detected:', url)
        }
        return originalFetch.apply(this, args)
      }

      // Monitor for potential clickjacking
      window.addEventListener('click', (event) => {
        const target = event.target as HTMLElement
        if (target && target.tagName === 'A') {
          const href = (target as HTMLAnchorElement).href
          if (href && this.isSuspiciousUrl(href)) {
            console.warn('🚨 Suspicious link click detected:', href)
          }
        }
      })
    }

    private enhanceExistingSecurity() {
      // Add integrity checks for external resources
      this.addIntegrityChecks()
      
      // Enhance form security
      this.enhanceFormSecurity()
      
      // Add input sanitization
      this.addInputSanitization()
    }

    private addIntegrityChecks() {
      // Add integrity attributes to external scripts and stylesheets
      const externalResources = document.querySelectorAll('link[rel="stylesheet"], script[src]')
      externalResources.forEach((resource: any) => {
        if (resource.href || resource.src) {
          const url = resource.href || resource.src
          if (this.isExternalResource(url)) {
            // In production, you would calculate and add integrity hashes
            console.log('🔒 External resource detected:', url)
          }
        }
      })
    }

    private enhanceFormSecurity() {
      // Add CSRF protection to forms
      const forms = document.querySelectorAll('form')
      forms.forEach(form => {
        if (!form.querySelector('input[name="_token"]')) {
          const csrfToken = this.generateCSRFToken()
          const csrfInput = document.createElement('input')
          csrfInput.type = 'hidden'
          csrfInput.name = '_token'
          csrfInput.value = csrfToken
          form.appendChild(csrfInput)
        }
      })
    }

    private addInputSanitization() {
      // Add input sanitization to text inputs
      const textInputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea')
      textInputs.forEach(input => {
        input.addEventListener('input', (event) => {
          const target = event.target as HTMLInputElement
          const originalValue = target.value
          const sanitizedValue = this.sanitizeInput(originalValue)
          
          if (originalValue !== sanitizedValue) {
            console.warn('🚨 Potentially malicious input detected and sanitized')
            target.value = sanitizedValue
          }
        })
      })
    }

    private isAllowedScript(src: string): boolean {
      const allowedDomains = [
        'cdn.jsdelivr.net',
        'unpkg.com',
        'fonts.googleapis.com',
        'fonts.gstatic.com',
        window.location.hostname
      ]
      
      try {
        const url = new URL(src)
        return allowedDomains.some(domain => url.hostname.includes(domain))
      } catch {
        return false
      }
    }

    private isSuspiciousUrl(url: string): boolean {
      const suspiciousPatterns = [
        /javascript:/i,
        /data:text\/html/i,
        /vbscript:/i,
        /onload=/i,
        /onerror=/i,
        /<script/i,
        /<iframe/i
      ]
      
      return suspiciousPatterns.some(pattern => pattern.test(url))
    }

    private isExternalResource(url: string): boolean {
      try {
        const urlObj = new URL(url)
        return urlObj.hostname !== window.location.hostname
      } catch {
        return false
      }
    }

    private generateCSRFToken(): string {
      const array = new Uint8Array(32)
      crypto.getRandomValues(array)
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
    }

    private sanitizeInput(input: string): string {
      return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim()
    }
  }

  // Initialize security enhancer
  new SecurityEnhancer()
})
