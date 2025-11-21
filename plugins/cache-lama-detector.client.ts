// plugins/cache-lama-detector.client.ts
// Detektor cache lama dengan interval 12 jam dan max 3x paksa reload

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  // Prevent multiple initializations
  if ((window as any).__cacheLamaDetectorInitialized) return
  ;(window as any).__cacheLamaDetectorInitialized = true

  class CacheLamaDetector {
    private detectionInterval: number | undefined
    private lastDetectionTime = 0
    private detectionCooldown = 12 * 60 * 60 * 1000 // 12 jam cooldown
    private maxDetections = 3 // Max 3x deteksi dalam 12 jam
    private detectionCount = 0
    private firstDetectionTime = 0
    private twelveHourWindow = 12 * 60 * 60 * 1000 // 12 jam window
    private isDetecting = false

    constructor() {
      this.loadDetectionState()
      this.setupGlobalMethods()
      this.startDetection()
    }

    private loadDetectionState() {
      try {
        const stored = localStorage.getItem('jp-cache-lama-detector-state')
        if (stored) {
          const state = JSON.parse(stored)
          this.lastDetectionTime = state.lastDetectionTime || 0
          this.detectionCount = state.detectionCount || 0
          this.firstDetectionTime = state.firstDetectionTime || 0
          
          // Reset jika sudah lebih dari 12 jam dari deteksi pertama
          const now = Date.now()
          if (this.firstDetectionTime > 0 && (now - this.firstDetectionTime) > this.twelveHourWindow) {
            console.log('🔄 12 jam window untuk deteksi cache lama expired, resetting')
            this.resetDetectionState()
          }
        }
      } catch (error) {
        console.warn('Failed to load cache lama detector state:', error)
        this.resetDetectionState()
      }
    }

    private saveDetectionState() {
      try {
        const state = {
          lastDetectionTime: this.lastDetectionTime,
          detectionCount: this.detectionCount,
          firstDetectionTime: this.firstDetectionTime
        }
        localStorage.setItem('jp-cache-lama-detector-state', JSON.stringify(state))
      } catch (error) {
        console.warn('Failed to save cache lama detector state:', error)
      }
    }

    private resetDetectionState() {
      this.lastDetectionTime = 0
      this.detectionCount = 0
      this.firstDetectionTime = 0
      this.saveDetectionState()
      console.log('🔄 Cache lama detector state reset (12 jam window cleared)')
    }

    private setupGlobalMethods() {
      // Make cache lama detector globally available
      ;(window as any).jpCacheLamaDetector = {
        forceDetection: () => this.forceDetection(),
        getStatus: () => this.getStatus(),
        resetDetections: () => this.resetDetections(),
        isDetectionAllowed: () => this.isDetectionAllowed()
      }
    }

    private isDetectionAllowed(): boolean {
      const now = Date.now()
      
      // Cek apakah sudah lebih dari 12 jam dari deteksi pertama
      if (this.firstDetectionTime > 0 && (now - this.firstDetectionTime) > this.twelveHourWindow) {
        console.log('🔄 12 jam window untuk deteksi expired, resetting untuk deteksi baru')
        this.resetDetectionState()
        return true
      }
      
      // Cek limit 3x deteksi dalam 12 jam
      if (this.detectionCount >= this.maxDetections) {
        const timeRemaining = this.twelveHourWindow - (now - this.firstDetectionTime)
        const hoursRemaining = Math.ceil(timeRemaining / (60 * 60 * 1000))
        console.warn(`🚫 Deteksi cache lama sudah mencapai limit 3x dalam 12 jam. Tunggu ${hoursRemaining} jam lagi.`)
        return false
      }
      
      // Cek cooldown 12 jam
      if (now - this.lastDetectionTime < this.detectionCooldown) {
        const timeRemaining = this.detectionCooldown - (now - this.lastDetectionTime)
        const hoursRemaining = Math.ceil(timeRemaining / (60 * 60 * 1000))
        console.warn(`⏰ Deteksi cache lama masih dalam cooldown. Tunggu ${hoursRemaining} jam lagi.`)
        return false
      }
      
      return true
    }

    private async detectCacheLama(): Promise<boolean> {
      if (this.isDetecting) {
        console.warn('Cache lama detection already in progress')
        return false
      }

      if (!this.isDetectionAllowed()) {
        return false
      }

      this.isDetecting = true

      try {
        console.log('🔍 Detecting cache lama...')
        
        // Simulasi deteksi cache lama dengan membandingkan version
        const currentVersion = localStorage.getItem('jp-cache-version') || 'unknown'
        
        // Use centralized API call manager for better error handling
        const response = await (window as any).jpApiCallManager?.makeCall(`/api/version?t=${Date.now()}`)
        
        if (!response) {
          return false // API call was rate limited or failed
        }

        if (response.ok) {
          const data = await response.json()
          const serverVersion = data.buildId || data.uniqueId || 'unknown'
          
          if (serverVersion !== currentVersion) {
            console.log('🚨 Cache lama terdeteksi!', { current: currentVersion, server: serverVersion })
            this.handleCacheLamaDetected(serverVersion)
            return true
          } else {
            console.log('✅ Cache sudah up-to-date')
            // Update current version to prevent future false detections
            try {
              localStorage.setItem('jp-cache-version', serverVersion)
            } catch (error) {
              console.warn('Failed to update cache version:', error)
            }
            return false
          }
        }
        
        return false
      } catch (error) {
        // Error handling is now managed by the API call manager
        console.debug('Cache lama detection completed with error handling')
        return false
      } finally {
        this.isDetecting = false
      }
    }

    private handleCacheLamaDetected(newVersion: string) {
      const now = Date.now()
      
      // Set first detection time jika ini adalah deteksi pertama dalam window 12 jam
      if (this.detectionCount === 0) {
        this.firstDetectionTime = now
        console.log('🕐 12 jam window untuk deteksi cache lama dimulai dari sekarang')
      }
      
      this.detectionCount++
      this.lastDetectionTime = now
      this.saveDetectionState()
      
      console.log(`🚨 Cache lama detected: ${this.detectionCount}/${this.maxDetections} (dalam 12 jam window)`)
      
      // Show notification
      if ((window as any).jpNotify) {
        const attemptsRemaining = this.maxDetections - this.detectionCount
        const timeRemaining = this.twelveHourWindow - (now - this.firstDetectionTime)
        const hoursRemaining = Math.ceil(timeRemaining / (60 * 60 * 1000))
        
        ;(window as any).jpNotify.warning(
          '🚨 Cache Lama Terdeteksi',
          `Website menggunakan cache lama. ${attemptsRemaining} percobaan reload tersisa dalam ${hoursRemaining} jam.`,
          8000
        )
      }
      
      // Attempt reload menggunakan super smart reload
      if ((window as any).jpSuperSmartReload) {
        setTimeout(() => {
          ;(window as any).jpSuperSmartReload.attemptReload({
            clearCache: true,
            showNotification: true,
            delay: 1000
          })
        }, 2000)
      }
    }

    private startDetection() {
      // Deteksi awal setelah 5 detik
      setTimeout(() => {
        this.detectCacheLama()
      }, 5000)
      
      // Deteksi berkala setiap 12 jam
      this.detectionInterval = window.setInterval(() => {
        this.detectCacheLama()
      }, this.detectionCooldown)
      
      console.log('🚀 Cache lama detector started (12 jam interval)')
    }

    public async forceDetection(): Promise<boolean> {
      console.log('💥 FORCE cache lama detection triggered!')
      return await this.detectCacheLama()
    }

    public resetDetections(): boolean {
      this.resetDetectionState()
      
      if ((window as any).jpNotify) {
        ;(window as any).jpNotify.success(
          '✅ Reset Deteksi Berhasil',
          'Percobaan deteksi cache lama telah direset. Anda dapat melakukan deteksi lagi.',
          5000
        )
      }
      
      return true
    }

    public getStatus() {
      const now = Date.now()
      const timeSinceLastDetection = now - this.lastDetectionTime
      const cooldownRemaining = Math.max(0, this.detectionCooldown - timeSinceLastDetection)
      const timeSinceFirstDetection = this.firstDetectionTime > 0 ? now - this.firstDetectionTime : 0
      const twelveHourWindowRemaining = Math.max(0, this.twelveHourWindow - timeSinceFirstDetection)
      const hoursRemaining = Math.ceil(twelveHourWindowRemaining / (60 * 60 * 1000))
      const cooldownHoursRemaining = Math.ceil(cooldownRemaining / (60 * 60 * 1000))
      
      return {
        detectionCount: this.detectionCount,
        maxDetections: this.maxDetections,
        detectionsRemaining: Math.max(0, this.maxDetections - this.detectionCount),
        lastDetectionTime: this.lastDetectionTime,
        cooldownRemaining: cooldownRemaining,
        cooldownHoursRemaining: cooldownHoursRemaining,
        isDetectionAllowed: this.isDetectionAllowed(),
        isDetecting: this.isDetecting,
        twelveHourWindow: {
          firstDetectionTime: this.firstDetectionTime,
          timeRemaining: twelveHourWindowRemaining,
          hoursRemaining: hoursRemaining,
          isExpired: timeSinceFirstDetection > this.twelveHourWindow
        }
      }
    }

    public destroy() {
      if (this.detectionInterval) {
        clearInterval(this.detectionInterval)
        this.detectionInterval = undefined
      }
    }
  }

  // Initialize the cache lama detector
  const cacheLamaDetector = new CacheLamaDetector()

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    cacheLamaDetector.destroy()
  })

  console.log('🚀 Cache Lama Detector initialized with 12 jam interval and 3x limit!')
})
