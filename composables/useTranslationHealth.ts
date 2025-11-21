/**
 * Translation System Health Composable
 * 
 * Provides health check functionality for translation system
 * Useful for admin panels or monitoring
 */

import { ref } from 'vue'

interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'checking'
  healthy: boolean
  timestamp?: string
  checks?: Record<string, any>
  recommendations?: string[]
  error?: string
}

export function useTranslationHealth() {
  const health = ref<HealthStatus>({
    status: 'checking',
    healthy: false
  })

  const isChecking = ref(false)

  /**
   * Check translation system health
   */
  async function checkHealth(): Promise<HealthStatus> {
    if (isChecking.value) {
      return health.value
    }

    try {
      isChecking.value = true
      health.value = {
        status: 'checking',
        healthy: false
      }

      const result = await $fetch<HealthStatus>('/api/i18n/health')
      
      health.value = result
      return result
    } catch (error: any) {
      const errorStatus: HealthStatus = {
        status: 'unhealthy',
        healthy: false,
        error: error?.message || 'Health check failed',
        timestamp: new Date().toISOString()
      }
      
      health.value = errorStatus
      return errorStatus
    } finally {
      isChecking.value = false
    }
  }

  /**
   * Get health status color for UI
   */
  const healthColor = computed(() => {
    switch (health.value.status) {
      case 'healthy':
        return 'green'
      case 'unhealthy':
        return 'red'
      case 'checking':
        return 'yellow'
      default:
        return 'gray'
    }
  })

  /**
   * Get health status icon
   */
  const healthIcon = computed(() => {
    switch (health.value.status) {
      case 'healthy':
        return '✅'
      case 'unhealthy':
        return '❌'
      case 'checking':
        return '⏳'
      default:
        return '❓'
    }
  })

  return {
    health,
    isChecking,
    checkHealth,
    healthColor,
    healthIcon
  }
}

