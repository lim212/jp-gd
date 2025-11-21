<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  errorCode: string
  showDebugInfo?: boolean
  showRetryOptions?: boolean
}>()

const emit = defineEmits<{
  retry: []
  contactSupport: []
  reportIssue: []
}>()

const debugInfo = ref({
  timestamp: typeof window !== 'undefined' ? new Date().toISOString() : new Date().toISOString(),
  userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'SSR',
  url: typeof window !== 'undefined' ? window.location.href : 'SSR',
  referrer: typeof document !== 'undefined' ? document.referrer : 'SSR',
  viewport: {
    width: typeof window !== 'undefined' ? window.innerWidth : 800,
    height: typeof window !== 'undefined' ? window.innerHeight : 600
  },
  connection: typeof navigator !== 'undefined' ? (navigator as any).connection?.effectiveType || 'unknown' : 'SSR',
  memory: typeof performance !== 'undefined' && (performance as any).memory ? {
    used: Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024),
    total: Math.round((performance as any).memory.totalJSHeapSize / 1024 / 1024)
  } : null
})

const showDebug = ref(false)
const retryCount = ref(0)
const isRetrying = ref(false)

const retryOptions = computed(() => [
  {
    id: 'soft-refresh',
    label: 'Soft Refresh',
    description: 'Reload page without clearing cache',
    icon: 'i-lucide-refresh-cw',
    action: () => window.location.reload()
  },
  {
    id: 'hard-refresh',
    label: 'Hard Refresh',
    description: 'Clear cache and reload',
    icon: 'i-lucide-rotate-ccw',
    action: () => {
      window.location.reload()
      // Clear cache
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => caches.delete(name))
        })
      }
    }
  },
  {
    id: 'new-tab',
    label: 'Open in New Tab',
    description: 'Try opening in a fresh tab',
    icon: 'i-lucide-external-link',
    action: () => window.open(window.location.href, '_blank')
  }
])

const handleRetry = async (option: any) => {
  isRetrying.value = true
  retryCount.value++
  
  // Show loading state
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  try {
    option.action()
  } catch (error) {
    console.error('Retry failed:', error)
  } finally {
    isRetrying.value = false
  }
}

const copyDebugInfo = async () => {
  const debugText = `Error Code: ${props.errorCode}
Timestamp: ${debugInfo.value.timestamp}
URL: ${debugInfo.value.url}
User Agent: ${debugInfo.value.userAgent}
Viewport: ${debugInfo.value.viewport.width}x${debugInfo.value.viewport.height}
Connection: ${debugInfo.value.connection}
${debugInfo.value.memory ? `Memory: ${debugInfo.value.memory.used}MB / ${debugInfo.value.memory.total}MB` : ''}`

  try {
    await navigator.clipboard.writeText(debugText)
    // Show success message
    const button = document.querySelector('[data-copy-debug]') as HTMLElement
    if (button) {
      const originalText = button.textContent
      button.textContent = 'Copied!'
      setTimeout(() => {
        button.textContent = originalText
      }, 2000)
    }
  } catch (error) {
    console.error('Failed to copy debug info:', error)
  }
}
</script>

<template>
  <div class="space-y-8">
    <!-- Retry Options -->
    <div v-if="showRetryOptions" class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50">
      <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Try These Solutions
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          v-for="option in retryOptions" 
          :key="option.id"
          class="group p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 cursor-pointer bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700"
          @click="handleRetry(option)"
        >
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <UIcon :name="option.icon" class="w-8 h-8 text-white" />
            </div>
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {{ option.label }}
            </h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ option.description }}
            </p>
          </div>
        </div>
      </div>
      
      <div v-if="isRetrying" class="mt-6 text-center">
        <div class="inline-flex items-center gap-3 px-6 py-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
          <UIcon name="i-lucide-loader-2" class="w-5 h-5 animate-spin text-blue-600" />
          <span class="text-blue-800 dark:text-blue-200 font-medium">
            Retrying... (Attempt {{ retryCount }})
          </span>
        </div>
      </div>
    </div>

    <!-- Debug Information -->
    <div v-if="showDebugInfo" class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
          Debug Information
        </h3>
        <div class="flex gap-3">
          <UButton 
            @click="showDebug = !showDebug"
            :color="showDebug ? 'red' : 'blue'"
            :variant="showDebug ? 'solid' : 'outline'"
            :icon="showDebug ? 'i-lucide-eye-off' : 'i-lucide-eye'"
            size="sm"
          >
            {{ showDebug ? 'Hide' : 'Show' }} Debug
          </UButton>
          <UButton 
            @click="copyDebugInfo"
            color="gray"
            variant="outline"
            icon="i-lucide-copy"
            size="sm"
            data-copy-debug
          >
            Copy Info
          </UButton>
        </div>
      </div>

      <div v-if="showDebug" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Error Details</h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Error Code:</span>
                  <span class="font-mono text-gray-900 dark:text-white">{{ errorCode }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Timestamp:</span>
                  <span class="font-mono text-gray-900 dark:text-white">{{ debugInfo.timestamp }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Retry Count:</span>
                  <span class="font-mono text-gray-900 dark:text-white">{{ retryCount }}</span>
                </div>
              </div>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Browser Info</h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Viewport:</span>
                  <span class="font-mono text-gray-900 dark:text-white">
                    {{ debugInfo.viewport.width }}×{{ debugInfo.viewport.height }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Connection:</span>
                  <span class="font-mono text-gray-900 dark:text-white">{{ debugInfo.connection }}</span>
                </div>
                <div v-if="debugInfo.memory" class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Memory:</span>
                  <span class="font-mono text-gray-900 dark:text-white">
                    {{ debugInfo.memory.used }}MB / {{ debugInfo.memory.total }}MB
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Page Info</h4>
              <div class="space-y-2 text-sm">
                <div>
                  <span class="text-gray-600 dark:text-gray-400 block mb-1">URL:</span>
                  <span class="font-mono text-gray-900 dark:text-white break-all">{{ debugInfo.url }}</span>
                </div>
                <div v-if="debugInfo.referrer">
                  <span class="text-gray-600 dark:text-gray-400 block mb-1">Referrer:</span>
                  <span class="font-mono text-gray-900 dark:text-white break-all">{{ debugInfo.referrer }}</span>
                </div>
              </div>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <h4 class="font-semibold text-gray-900 dark:text-white mb-2">User Agent</h4>
              <div class="text-xs font-mono text-gray-900 dark:text-white break-all">
                {{ debugInfo.userAgent }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50">
      <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Quick Actions
      </h3>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <UButton 
          @click="emit('retry')"
          color="primary"
          icon="i-lucide-refresh-cw"
          class="p-6 h-auto flex-col gap-3"
        >
          <UIcon name="i-lucide-refresh-cw" class="w-8 h-8" />
          <span class="text-sm font-semibold">Retry</span>
        </UButton>
        
        <UButton 
          @click="emit('contactSupport')"
          color="green"
          variant="outline"
          icon="i-lucide-message-circle"
          class="p-6 h-auto flex-col gap-3"
        >
          <UIcon name="i-lucide-message-circle" class="w-8 h-8" />
          <span class="text-sm font-semibold">Support</span>
        </UButton>
        
        <UButton 
          @click="emit('reportIssue')"
          color="orange"
          variant="outline"
          icon="i-lucide-bug"
          class="p-6 h-auto flex-col gap-3"
        >
          <UIcon name="i-lucide-bug" class="w-8 h-8" />
          <span class="text-sm font-semibold">Report Bug</span>
        </UButton>
        
        <UButton 
          to="/"
          color="gray"
          variant="outline"
          icon="i-lucide-home"
          class="p-6 h-auto flex-col gap-3"
        >
          <UIcon name="i-lucide-home" class="w-8 h-8" />
          <span class="text-sm font-semibold">Home</span>
        </UButton>
      </div>
    </div>
  </div>
</template>
