// plugins/super-smart-reload.client.ts
// SUPER PINTAR reload system dengan limit 3x dan proteksi infinite loop

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  // Prevent multiple initializations
  if ((window as any).__superSmartReloadInitialized) return
  ;(window as any).__superSmartReloadInitialized = true

  class SuperSmartReload {
    private reloadAttempts = 0
    private maxReloadAttempts = 5 // Limit 5x dalam 12 jam (ditingkatkan untuk fleksibilitas)
    private lastReloadTime = 0
    private reloadCooldown = 60 * 1000 // 60 detik cooldown (diperpanjang untuk mencegah spam)
    private resetTimeout: number | undefined
    private isReloading = false
    private reloadHistory: number[] = []
    private twelveHourWindow = 12 * 60 * 60 * 1000 // 12 jam window
    private firstAttemptInWindow = 0 // Waktu attempt pertama dalam window 12 jam

    constructor() {
      this.loadReloadState()
      this.setupGlobalMethods()
      this.setupEventListeners()
    }

    private loadReloadState() {
      try {
        const stored = localStorage.getItem('jp-super-smart-reload-state')
        if (stored) {
          const state = JSON.parse(stored)
          this.reloadAttempts = state.attempts || 0
          this.lastReloadTime = state.lastReload || 0
          this.reloadHistory = state.history || []
          this.firstAttemptInWindow = state.firstAttemptInWindow || 0
          
          // Reset jika sudah lebih dari 12 jam dari attempt pertama
          const now = Date.now()
          if (this.firstAttemptInWindow > 0 && (now - this.firstAttemptInWindow) > this.twelveHourWindow) {
            console.log('🔄 12 jam window expired, resetting reload state')
            this.resetReloadState()
          }
        }
      } catch (error) {
        console.warn('Failed to load reload state:', error)
        this.resetReloadState()
      }
    }

    private saveReloadState() {
      try {
        const state = {
          attempts: this.reloadAttempts,
          lastReload: this.lastReloadTime,
          history: this.reloadHistory.slice(-10), // Keep last 10 attempts
          firstAttemptInWindow: this.firstAttemptInWindow
        }
        localStorage.setItem('jp-super-smart-reload-state', JSON.stringify(state))
      } catch (error) {
        console.warn('Failed to save reload state:', error)
      }
    }

    private resetReloadState() {
      this.reloadAttempts = 0
      this.lastReloadTime = 0
      this.reloadHistory = []
      this.firstAttemptInWindow = 0
      this.saveReloadState()
      console.log('🔄 Reload state reset (12 jam window cleared)')
    }

    private setupGlobalMethods() {
      // Make super smart reload globally available
      ;(window as any).jpSuperSmartReload = {
        attemptReload: (options?: any) => this.attemptReload(options),
        forceReload: (options?: any) => this.forceReload(options),
        resetAttempts: () => this.resetAttempts(),
        getStatus: () => this.getStatus(),
        isAllowed: () => this.isReloadAllowed()
      }
    }

    private setupEventListeners() {
      // Listen for page unload to track reloads
      window.addEventListener('beforeunload', () => {
        if (this.isReloading) {
          this.recordReloadAttempt()
        }
      })

      // Listen for page load to detect if this is a reload
      window.addEventListener('load', () => {
        // Check if this page was reloaded
        const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
        if (navigationEntries.length > 0) {
          const navEntry = navigationEntries[0]
          if (navEntry.type === 'reload') {
            console.log('🔄 Page reload detected')
          }
        }
      })
    }

    private isReloadAllowed(): boolean {
      const now = Date.now()
      
      // Cek cooldown
      if (now - this.lastReloadTime < this.reloadCooldown) {
        console.warn('⚠️ Reload masih dalam cooldown period')
        return false
      }
      
      // Cek apakah sudah lebih dari 12 jam dari attempt pertama
      if (this.firstAttemptInWindow > 0 && (now - this.firstAttemptInWindow) > this.twelveHourWindow) {
        console.log('🔄 12 jam window expired, resetting untuk attempt baru')
        this.resetReloadState()
        return true
      }
      
      // Cek limit 3x dalam 12 jam
      if (this.reloadAttempts >= this.maxReloadAttempts) {
        const timeRemaining = this.twelveHourWindow - (now - this.firstAttemptInWindow)
        const hoursRemaining = Math.ceil(timeRemaining / (60 * 60 * 1000))
        console.warn(`🚫 Reload sudah mencapai limit 3x dalam 12 jam. Tunggu ${hoursRemaining} jam lagi.`)
        return false
      }
      
      return true
    }

    private recordReloadAttempt() {
      const now = Date.now()
      
      // Set first attempt time jika ini adalah attempt pertama dalam window 12 jam
      if (this.reloadAttempts === 0) {
        this.firstAttemptInWindow = now
        console.log('🕐 12 jam window dimulai dari sekarang')
      }
      
      this.reloadAttempts++
      this.lastReloadTime = now
      this.reloadHistory.push(now)
      
      // Keep only last 10 attempts
      if (this.reloadHistory.length > 10) {
        this.reloadHistory = this.reloadHistory.slice(-10)
      }
      
      this.saveReloadState()
      
      console.log(`🔄 Reload attempt recorded: ${this.reloadAttempts}/${this.maxReloadAttempts} (dalam 12 jam window)`)
      
      // Set auto-reset timer (12 jam dari attempt pertama)
      if (this.resetTimeout) {
        clearTimeout(this.resetTimeout)
      }
      this.resetTimeout = window.setTimeout(() => {
        this.resetReloadState()
      }, this.twelveHourWindow)
    }

    public async attemptReload(options: any = {}): Promise<boolean> {
      if (this.isReloading) {
        console.warn('Reload already in progress')
        return false
      }

      // Cek apakah reload diperbolehkan
      if (!this.isReloadAllowed()) {
        this.showBlockedNotification()
        return false
      }

      this.isReloading = true

      try {
        // Show notification
        if (options.showNotification !== false && (window as any).jpNotify) {
          const attemptsRemaining = this.maxReloadAttempts - this.reloadAttempts
          ;(window as any).jpNotify.info(
            '🔄 Memperbarui Halaman',
            `Sedang memuat ulang dengan cache terbaru... (${attemptsRemaining} percobaan tersisa)`,
            3000
          )
        }

        // Record attempt
        this.recordReloadAttempt()

        // Use enhanced reload function if available
        if ((window as any).jpForceReload) {
          await (window as any).jpForceReload({
            clearCache: options.clearCache !== false,
            showNotification: false, // We already showed notification
            delay: options.delay || 500
          })
        } else {
          // Fallback to simple reload
          setTimeout(() => {
            window.location.reload()
          }, options.delay || 1000)
        }

        return true
      } catch (error) {
        console.error('Reload failed:', error)
        this.isReloading = false
        return false
      }
    }

    public async forceReload(options: any = {}): Promise<boolean> {
      // Force reload bypasses the smart checking (use with caution)
      console.warn('⚠️ FORCE reload called - bypassing smart reload protection')
      
      this.isReloading = true
      
      try {
        if ((window as any).jpForceReload) {
          await (window as any).jpForceReload(options)
        } else {
          window.location.reload()
        }
        return true
      } catch (error) {
        console.error('Force reload failed:', error)
        this.isReloading = false
        return false
      }
    }

    public resetAttempts(): boolean {
      this.resetReloadState()
      
      if ((window as any).jpNotify) {
        ;(window as any).jpNotify.success(
          '✅ Reset Berhasil',
          'Percobaan reload telah direset. Anda dapat melakukan reload lagi.',
          5000
        )
      }
      
      return true
    }

    private showBlockedNotification() {
      if ((window as any).jpNotify) {
        const now = Date.now()
        const remainingTime = Math.ceil((this.reloadCooldown - (now - this.lastReloadTime)) / 1000)
        
        let message = ''
        if (this.reloadAttempts >= this.maxReloadAttempts) {
          const timeRemaining = this.twelveHourWindow - (now - this.firstAttemptInWindow)
          const hoursRemaining = Math.ceil(timeRemaining / (60 * 60 * 1000))
          message = `Sudah mencapai limit 3x reload dalam 12 jam. Tunggu ${hoursRemaining} jam lagi. Website tetap dapat diakses normal dengan cache lama.`
        } else {
          message = `Terlalu cepat. Tunggu ${remainingTime} detik lagi.`
        }
        
        ;(window as any).jpNotify.warning(
          '⚠️ Reload Diblokir',
          message,
          10000
        )
      } else {
        const now = Date.now()
        const timeRemaining = this.twelveHourWindow - (now - this.firstAttemptInWindow)
        const hoursRemaining = Math.ceil(timeRemaining / (60 * 60 * 1000))
        console.warn('🚫 Reload diblokir:', this.reloadAttempts >= this.maxReloadAttempts ? `Limit 3x tercapai dalam 12 jam. Tunggu ${hoursRemaining} jam lagi.` : 'Cooldown aktif')
      }
    }

    public getStatus() {
      const now = Date.now()
      const timeSinceLastReload = now - this.lastReloadTime
      const cooldownRemaining = Math.max(0, this.reloadCooldown - timeSinceLastReload)
      const timeSinceFirstAttempt = this.firstAttemptInWindow > 0 ? now - this.firstAttemptInWindow : 0
      const twelveHourWindowRemaining = Math.max(0, this.twelveHourWindow - timeSinceFirstAttempt)
      const hoursRemaining = Math.ceil(twelveHourWindowRemaining / (60 * 60 * 1000))
      
      return {
        attempts: this.reloadAttempts,
        maxAttempts: this.maxReloadAttempts,
        attemptsRemaining: Math.max(0, this.maxReloadAttempts - this.reloadAttempts),
        lastReloadTime: this.lastReloadTime,
        cooldownRemaining: cooldownRemaining,
        isAllowed: this.isReloadAllowed(),
        isReloading: this.isReloading,
        history: this.reloadHistory,
        twelveHourWindow: {
          firstAttemptTime: this.firstAttemptInWindow,
          timeRemaining: twelveHourWindowRemaining,
          hoursRemaining: hoursRemaining,
          isExpired: timeSinceFirstAttempt > this.twelveHourWindow
        }
      }
    }

    public destroy() {
      if (this.resetTimeout) {
        clearTimeout(this.resetTimeout)
        this.resetTimeout = undefined
      }
    }
  }

  // Initialize the super smart reload system
  const superSmartReload = new SuperSmartReload()

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    superSmartReload.destroy()
  })

  console.log('🚀 SUPER PINTAR Reload System initialized with 3x limit protection!')
})
