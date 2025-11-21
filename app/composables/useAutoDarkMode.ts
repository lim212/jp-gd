/**
 * Auto Dark Mode Composable
 * Automatically switch to dark mode based on time of day
 * SSR-SAFE VERSION
 */

import { ref } from 'vue'
import { useColorMode } from '#imports'

export const useAutoDarkMode = () => {
  const colorMode = useColorMode()
  const isAutoEnabled = ref(false)
  const autoSchedule = ref({
    darkStart: 18, // 6 PM
    darkEnd: 6,    // 6 AM
  })
  
  let checkInterval: ReturnType<typeof setInterval> | null = null
  let isInitialized = false

  /**
   * Check if running on client
   */
  const isClient = typeof window !== 'undefined'

  /**
   * Check if current time is within dark hours
   */
  const isDarkHours = (): boolean => {
    const hour = new Date().getHours()
    const { darkStart, darkEnd } = autoSchedule.value
    
    // If dark mode starts at 18 and ends at 6
    // Dark hours: 18-23 and 0-5
    if (darkStart > darkEnd) {
      return hour >= darkStart || hour < darkEnd
    }
    // If dark mode starts at 22 and ends at 24 (not crossing midnight)
    return hour >= darkStart && hour < darkEnd
  }

  /**
   * Apply auto dark mode
   */
  const applyAutoDarkMode = () => {
    if (!isClient || !isAutoEnabled.value) return
    
    const shouldBeDark = isDarkHours()
    const currentMode = colorMode.value
    
    // Only change if needed
    if (shouldBeDark && currentMode !== 'dark') {
      console.log('🌙 Auto Dark Mode: Switching to dark mode')
      colorMode.preference = 'dark'
    } else if (!shouldBeDark && currentMode !== 'light') {
      console.log('☀️ Auto Dark Mode: Switching to light mode')
      colorMode.preference = 'light'
    }
  }

  /**
   * Initialize (call this from onMounted in component)
   */
  const initialize = () => {
    if (!isClient || isInitialized) return
    
    // Load saved settings
    const saved = localStorage.getItem('autoDarkMode')
    if (saved === 'enabled') {
      isAutoEnabled.value = true
    }
    
    const savedSchedule = localStorage.getItem('autoDarkModeSchedule')
    if (savedSchedule) {
      try {
        autoSchedule.value = JSON.parse(savedSchedule)
      } catch (e) {
        console.error('Failed to parse auto dark mode schedule:', e)
      }
    }
    
    // Apply if enabled
    if (isAutoEnabled.value) {
      applyAutoDarkMode()
      checkInterval = setInterval(applyAutoDarkMode, 5 * 60 * 1000)
    }
    
    isInitialized = true
  }

  /**
   * Enable auto dark mode
   */
  const enableAuto = () => {
    if (!isClient) return
    
    isAutoEnabled.value = true
    localStorage.setItem('autoDarkMode', 'enabled')
    applyAutoDarkMode()
    
    // Check every 5 minutes
    if (!checkInterval) {
      checkInterval = setInterval(applyAutoDarkMode, 5 * 60 * 1000)
    }
  }

  /**
   * Disable auto dark mode
   */
  const disableAuto = () => {
    if (!isClient) return
    
    isAutoEnabled.value = false
    localStorage.removeItem('autoDarkMode')
    
    if (checkInterval) {
      clearInterval(checkInterval)
      checkInterval = null
    }
  }

  /**
   * Update schedule
   */
  const updateSchedule = (start: number, end: number) => {
    if (!isClient) return
    
    autoSchedule.value = { darkStart: start, darkEnd: end }
    localStorage.setItem('autoDarkModeSchedule', JSON.stringify(autoSchedule.value))
    
    if (isAutoEnabled.value) {
      applyAutoDarkMode()
    }
  }

  /**
   * Cleanup (call this from onUnmounted in component)
   */
  const cleanup = () => {
    if (checkInterval) {
      clearInterval(checkInterval)
      checkInterval = null
    }
  }

  /**
   * Get readable schedule text
   */
  const getScheduleText = (): string => {
    const { darkStart, darkEnd } = autoSchedule.value
    return `Dark mode from ${darkStart}:00 to ${darkEnd}:00`
  }

  return {
    isAutoEnabled,
    autoSchedule,
    isDarkHours,
    enableAuto,
    disableAuto,
    updateSchedule,
    getScheduleText,
    initialize,
    cleanup,
  }
}

