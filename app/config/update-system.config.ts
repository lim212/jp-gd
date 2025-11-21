/**
 * 🚀 UPDATE SYSTEM CONFIGURATION
 * 
 * Konfigurasi untuk sistem update notification
 * Bisa diubah sesuai kebutuhan
 */

export const updateSystemConfig = {
  /**
   * Enable/disable update system
   * Set false untuk disable di development
   */
  enabled: process.env.NODE_ENV === 'production',
  
  /**
   * Check interval (milliseconds)
   * Production: 30 seconds
   * Development: 60 seconds
   */
  checkInterval: process.env.NODE_ENV === 'production' ? 30000 : 60000,
  
  /**
   * Initial delay sebelum mulai check (milliseconds)
   * Beri waktu untuk loading screen selesai
   * Production: 10 seconds
   * Development: 15 seconds
   */
  initialDelay: process.env.NODE_ENV === 'production' ? 10000 : 15000,
  
  /**
   * Countdown duration (seconds)
   * Berapa lama sebelum auto reload
   */
  countdownDuration: 30,
  
  /**
   * Z-index untuk popup
   * Harus lebih tinggi dari loading screen (99999)
   */
  zIndex: 1000000,
  
  /**
   * Debug mode
   * Show console logs
   */
  debug: process.env.NODE_ENV === 'development',
  
  /**
   * Loading screen selectors
   * Untuk detect apakah loading screen masih aktif
   */
  loadingScreenSelectors: [
    '.loading-screen',
    '.super-loading-screen',
    '.background-loading-indicator',
    '.skeleton-screen'
  ],
  
  /**
   * Cache keys to clear
   * LocalStorage keys yang akan di-clear saat reload
   */
  cacheKeys: [
    'jp_app_version',
    'jp_build_id',
    'jp_last_version'
  ],
  
  /**
   * Manual trigger function name
   * Expose ke window untuk testing
   */
  manualTriggerName: 'showUpdatePopup'
}

export default updateSystemConfig

