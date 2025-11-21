// plugins/custom-popup-themes.client.ts
// Custom themes system for popup reload notifications

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  // Prevent multiple initializations
  if ((window as any).__jpCustomThemesInitialized) return
  ;(window as any).__jpCustomThemesInitialized = true

  class CustomPopupThemesSystem {
    private currentTheme = 'default'
    private availableThemes: Record<string, any> = {}
    private userPreference = ''

    constructor() {
      this.initializeThemes()
      this.loadUserPreference()
      this.applyTheme()
    }

    private initializeThemes() {
      // Default theme
      this.availableThemes.default = {
        name: 'Default',
        description: 'Tema default dengan gradient biru-hijau',
        colors: {
          primary: 'linear-gradient(135deg, #22c55e, #06b6d4)',
          secondary: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
          background: 'linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.03))',
          text: '#f8fafc',
          textSecondary: '#cbd5e1',
          border: 'rgba(34,197,94,.4)',
          shadow: 'rgba(0,0,0,.7)'
        },
        animations: {
          modal: 'jp-fade',
          card: 'jp-pop',
          icon: 'jp-breathe',
          badge: 'jp-badge-pulse'
        }
      }

      // Dark theme
      this.availableThemes.dark = {
        name: 'Dark',
        description: 'Tema gelap dengan aksen ungu',
        colors: {
          primary: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
          secondary: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          background: 'linear-gradient(180deg, rgba(15,23,42,.95), rgba(30,41,59,.95))',
          text: '#e2e8f0',
          textSecondary: '#94a3b8',
          border: 'rgba(139,92,246,.4)',
          shadow: 'rgba(0,0,0,.9)'
        },
        animations: {
          modal: 'jp-fade',
          card: 'jp-pop',
          icon: 'jp-breathe',
          badge: 'jp-badge-pulse'
        }
      }

      // Light theme
      this.availableThemes.light = {
        name: 'Light',
        description: 'Tema terang dengan aksen hijau',
        colors: {
          primary: 'linear-gradient(135deg, #10b981, #059669)',
          secondary: 'linear-gradient(135deg, #06b6d4, #0891b2)',
          background: 'linear-gradient(180deg, rgba(255,255,255,.95), rgba(248,250,252,.95))',
          text: '#0f172a',
          textSecondary: '#334155',
          border: 'rgba(16,185,129,.4)',
          shadow: 'rgba(0,0,0,.1)'
        },
        animations: {
          modal: 'jp-fade',
          card: 'jp-pop',
          icon: 'jp-breathe',
          badge: 'jp-badge-pulse'
        }
      }

      // Neon theme
      this.availableThemes.neon = {
        name: 'Neon',
        description: 'Tema neon dengan efek glow',
        colors: {
          primary: 'linear-gradient(135deg, #00ff88, #00d4ff)',
          secondary: 'linear-gradient(135deg, #ff0080, #ff8c00)',
          background: 'linear-gradient(180deg, rgba(0,0,0,.9), rgba(0,0,0,.8))',
          text: '#00ff88',
          textSecondary: '#00d4ff',
          border: 'rgba(0,255,136,.6)',
          shadow: 'rgba(0,255,136,.3)'
        },
        animations: {
          modal: 'jp-fade',
          card: 'jp-pop',
          icon: 'jp-breathe',
          badge: 'jp-badge-pulse'
        }
      }

      // Minimal theme
      this.availableThemes.minimal = {
        name: 'Minimal',
        description: 'Tema minimalis dengan warna monokrom',
        colors: {
          primary: 'linear-gradient(135deg, #6b7280, #4b5563)',
          secondary: 'linear-gradient(135deg, #9ca3af, #6b7280)',
          background: 'linear-gradient(180deg, rgba(255,255,255,.9), rgba(249,250,251,.9))',
          text: '#111827',
          textSecondary: '#6b7280',
          border: 'rgba(107,114,128,.3)',
          shadow: 'rgba(0,0,0,.05)'
        },
        animations: {
          modal: 'jp-fade',
          card: 'jp-pop',
          icon: 'jp-breathe',
          badge: 'jp-badge-pulse'
        }
      }
    }

    private loadUserPreference() {
      try {
        const stored = localStorage.getItem('jp-popup-theme')
        if (stored && this.availableThemes[stored]) {
          this.userPreference = stored
          this.currentTheme = stored
        } else {
          // Auto-detect theme based on system preference
          if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.currentTheme = 'dark'
          } else {
            this.currentTheme = 'default'
          }
        }
      } catch (error) {
        console.warn('Failed to load theme preference:', error)
        this.currentTheme = 'default'
      }
    }

    private saveUserPreference() {
      try {
        localStorage.setItem('jp-popup-theme', this.currentTheme)
      } catch (error) {
        console.warn('Failed to save theme preference:', error)
      }
    }

    private applyTheme() {
      const theme = this.availableThemes[this.currentTheme]
      if (!theme) return

      // Inject theme-specific CSS
      this.injectThemeCSS(theme)
    }

    private injectThemeCSS(theme: any) {
      const styleId = 'jp-custom-theme-styles'
      let style = document.getElementById(styleId) as HTMLStyleElement

      if (!style) {
        style = document.createElement('style')
        style.id = styleId
        document.head.appendChild(style)
      }

      style.textContent = `
        /* Custom Theme: ${theme.name} */
        #jp-update-modal {
          background: radial-gradient(1400px 700px at 120% -15%,rgba(59,130,246,.25),transparent 65%),radial-gradient(1000px 500px at -20% 120%,rgba(34,197,94,.2),transparent 60%),rgba(2,6,23,.85);
        }
        
        #jp-update-card {
          background: ${theme.colors.background} padding-box, ${theme.colors.primary} border-box;
          border: 1px solid transparent;
        }
        
        #jp-update-card:before {
          background: ${theme.colors.primary};
          opacity: 0.1;
        }
        
        #jp-update-icon {
          background: ${theme.colors.primary};
          box-shadow: 0 16px 48px ${theme.colors.shadow}, inset 0 1px 0 rgba(255,255,255,.3);
        }
        
        #jp-update-badge {
          background: ${theme.colors.primary};
          box-shadow: 0 8px 24px ${theme.colors.shadow};
        }
        
        #jp-update-title {
          color: ${theme.colors.text};
        }
        
        #jp-update-desc {
          color: ${theme.colors.textSecondary};
        }
        
        .jp-btn-primary {
          background: ${theme.colors.primary};
          box-shadow: 0 12px 32px ${theme.colors.shadow}, inset 0 1px 0 rgba(255,255,255,.2);
        }
        
        .jp-btn-primary:hover {
          filter: brightness(1.1) saturate(1.1);
          box-shadow: 0 16px 40px ${theme.colors.shadow}, inset 0 1px 0 rgba(255,255,255,.3);
        }
        
        #jp-update-progress-bar {
          background: ${theme.colors.primary};
          box-shadow: 0 0 8px ${theme.colors.shadow};
        }
        
        #jp-update-countdown-icon {
          background: ${theme.colors.secondary};
        }
        
        /* Theme-specific animations */
        @keyframes ${theme.animations.modal} {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(16px); }
        }
        
        @keyframes ${theme.animations.card} {
          from { opacity: .7; transform: translateY(20px) scale(.9); }
          to { opacity: 1; transform: none; }
        }
        
        @keyframes ${theme.animations.icon} {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-3px) scale(1.05); }
        }
        
        @keyframes ${theme.animations.badge} {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        /* Apply animations */
        #jp-update-modal {
          animation: ${theme.animations.modal} .3s ease-out;
        }
        
        #jp-update-card {
          animation: ${theme.animations.card} .35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        #jp-update-icon {
          animation: ${theme.animations.icon} 4s ease-in-out infinite;
        }
        
        #jp-update-badge {
          animation: ${theme.animations.badge} 2s ease-in-out infinite;
        }
      `
    }

    // Public methods
    setTheme(themeName: string) {
      if (this.availableThemes[themeName]) {
        this.currentTheme = themeName
        this.userPreference = themeName
        this.applyTheme()
        this.saveUserPreference()
        
        console.log('🎨 Theme changed to:', themeName)
        
        // Show theme change notification
        if ((window as any).jpNotify) {
          ;(window as any).jpNotify.success(
            'Tema Diubah',
            `Tema popup berhasil diubah ke "${this.availableThemes[themeName].name}"`,
            3000
          )
        }
        
        return true
      } else {
        console.warn('Theme not found:', themeName)
        return false
      }
    }

    getCurrentTheme() {
      return this.currentTheme
    }

    getAvailableThemes() {
      return Object.keys(this.availableThemes).map(key => ({
        id: key,
        ...this.availableThemes[key]
      }))
    }

    getThemeInfo(themeName: string) {
      return this.availableThemes[themeName] || null
    }

    // Create theme selector UI
    createThemeSelector() {
      const selector = document.createElement('div')
      selector.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(255,255,255,0.95);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(226,232,240,0.8);
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        z-index: 2147483646;
        max-width: 300px;
        animation: slideInUp 0.3s ease-out;
      `

      selector.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 12px; color: #1e293b;">🎨 Pilih Tema Popup</div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${Object.keys(this.availableThemes).map(themeId => {
            const theme = this.availableThemes[themeId]
            const isActive = themeId === this.currentTheme
            return `
              <button onclick="window.jpThemes.setTheme('${themeId}'); this.parentElement.parentElement.parentElement.remove();" style="
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                border: 1px solid ${isActive ? '#3b82f6' : 'rgba(226,232,240,0.8)'};
                border-radius: 8px;
                background: ${isActive ? 'rgba(59,130,246,0.1)' : 'transparent'};
                cursor: pointer;
                transition: all 0.2s ease;
                width: 100%;
                text-align: left;
              " onmouseover="this.style.background='rgba(59,130,246,0.1)'" onmouseout="this.style.background='${isActive ? 'rgba(59,130,246,0.1)' : 'transparent'}'">
                <div style="width: 20px; height: 20px; border-radius: 4px; background: ${theme.colors.primary};"></div>
                <div>
                  <div style="font-weight: 600; font-size: 14px; color: #1e293b;">${theme.name}</div>
                  <div style="font-size: 12px; color: #64748b;">${theme.description}</div>
                </div>
                ${isActive ? '<div style="margin-left: auto; color: #3b82f6;">✓</div>' : ''}
              </button>
            `
          }).join('')}
        </div>
        <button onclick="this.parentElement.remove();" style="
          margin-top: 12px;
          width: 100%;
          padding: 8px;
          border: 1px solid rgba(226,232,240,0.8);
          border-radius: 6px;
          background: transparent;
          cursor: pointer;
          font-size: 12px;
          color: #64748b;
        ">Tutup</button>
      `

      // Add CSS animation
      if (!document.querySelector('#jp-theme-selector-styles')) {
        const style = document.createElement('style')
        style.id = 'jp-theme-selector-styles'
        style.textContent = `
          @keyframes slideInUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `
        document.head.appendChild(style)
      }

      document.body.appendChild(selector)
      return selector
    }
  }

  // Initialize custom themes system
  const themesSystem = new CustomPopupThemesSystem()
  ;(window as any).jpThemes = themesSystem

  // Add global methods
  ;(window as any).jpThemes = {
    setTheme: (themeName: string) => themesSystem.setTheme(themeName),
    getCurrentTheme: () => themesSystem.getCurrentTheme(),
    getAvailableThemes: () => themesSystem.getAvailableThemes(),
    getThemeInfo: (themeName: string) => themesSystem.getThemeInfo(themeName),
    showSelector: () => themesSystem.createThemeSelector()
  }

  // Auto-apply theme based on system preference changes
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      if (!themesSystem.userPreference) {
        const newTheme = e.matches ? 'dark' : 'default'
        themesSystem.setTheme(newTheme)
      }
    })
  }

  console.log('🎨 Custom Popup Themes System initialized:', {
    currentTheme: themesSystem.getCurrentTheme(),
    availableThemes: themesSystem.getAvailableThemes().length,
    userPreference: themesSystem.userPreference || 'auto'
  })
})
