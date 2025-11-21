<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface StatusItem {
  id: string
  label: string
  status: 'checking' | 'success' | 'warning' | 'error'
  progress: number
  details?: string
}

const props = defineProps<{
  errorCode: string
  showDetailedStatus?: boolean
}>()

const statusItems = ref<StatusItem[]>([
  {
    id: 'server',
    label: 'Server Status',
    status: 'checking',
    progress: 0,
    details: 'Memeriksa koneksi server...'
  },
  {
    id: 'database',
    label: 'Database Connection',
    status: 'checking',
    progress: 0,
    details: 'Menguji koneksi database...'
  },
  {
    id: 'cache',
    label: 'Cache System',
    status: 'checking',
    progress: 0,
    details: 'Memeriksa sistem cache...'
  },
  {
    id: 'api',
    label: 'API Endpoints',
    status: 'checking',
    progress: 0,
    details: 'Menguji endpoint API...'
  }
])

const overallProgress = ref(0)
const currentStatus = ref('checking')
const estimatedTime = ref(120) // seconds

let statusInterval: NodeJS.Timeout
let progressInterval: NodeJS.Timeout

const updateStatus = () => {
  statusItems.value.forEach((item, index) => {
    // Simulate checking process
    if (item.status === 'checking') {
      item.progress += Math.random() * 15
      
      if (item.progress >= 100) {
        // Randomly assign success/warning/error
        const rand = Math.random()
        if (rand > 0.8) {
          item.status = 'error'
          item.details = 'Error detected - fixing...'
        } else if (rand > 0.6) {
          item.status = 'warning'
          item.details = 'Warning - monitoring...'
        } else {
          item.status = 'success'
          item.details = 'All systems operational'
        }
        item.progress = 100
      }
    }
  })
  
  // Update overall progress
  const totalProgress = statusItems.value.reduce((sum, item) => sum + item.progress, 0)
  overallProgress.value = totalProgress / statusItems.value.length
  
  // Update current status
  const hasErrors = statusItems.value.some(item => item.status === 'error')
  const hasWarnings = statusItems.value.some(item => item.status === 'warning')
  const allComplete = statusItems.value.every(item => item.progress >= 100)
  
  if (hasErrors) {
    currentStatus.value = 'error'
  } else if (hasWarnings) {
    currentStatus.value = 'warning'
  } else if (allComplete) {
    currentStatus.value = 'success'
  } else {
    currentStatus.value = 'checking'
  }
}

const updateEstimatedTime = () => {
  if (estimatedTime.value > 0) {
    estimatedTime.value--
  }
}

onMounted(() => {
  // Start status updates
  statusInterval = setInterval(updateStatus, 800)
  progressInterval = setInterval(updateEstimatedTime, 1000)
})

onBeforeUnmount(() => {
  if (statusInterval) clearInterval(statusInterval)
  if (progressInterval) clearInterval(progressInterval)
})

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'success': return 'i-lucide-check-circle'
    case 'warning': return 'i-lucide-alert-triangle'
    case 'error': return 'i-lucide-x-circle'
    default: return 'i-lucide-loader-2'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'success': return 'text-green-600 dark:text-green-400'
    case 'warning': return 'text-yellow-600 dark:text-yellow-400'
    case 'error': return 'text-red-600 dark:text-red-400'
    default: return 'text-blue-600 dark:text-blue-400'
  }
}

const getOverallStatusColor = () => {
  switch (currentStatus.value) {
    case 'success': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
    case 'warning': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
    case 'error': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
    default: return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
  }
}
</script>

<template>
  <div v-if="showDetailedStatus" class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50">
    <div class="flex items-center justify-between mb-8">
      <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
        System Status Monitor
      </h3>
      <div 
        class="px-4 py-2 rounded-full text-sm font-medium"
        :class="getOverallStatusColor()"
      >
        {{ currentStatus.toUpperCase() }}
      </div>
    </div>

    <!-- Overall Progress -->
    <div class="mb-8">
      <div class="flex justify-between items-center mb-4">
        <span class="text-lg font-semibold text-gray-900 dark:text-white">
          Overall Progress
        </span>
        <span class="text-lg font-bold text-gray-600 dark:text-gray-300">
          {{ Math.round(overallProgress) }}%
        </span>
      </div>
      
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div 
          class="h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
          :class="{
            'bg-gradient-to-r from-green-500 to-emerald-500': currentStatus === 'success',
            'bg-gradient-to-r from-yellow-500 to-orange-500': currentStatus === 'warning',
            'bg-gradient-to-r from-red-500 to-pink-500': currentStatus === 'error',
            'bg-gradient-to-r from-blue-500 to-purple-500': currentStatus === 'checking'
          }"
          :style="{ width: overallProgress + '%' }"
        >
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
        </div>
      </div>
    </div>

    <!-- Status Items -->
    <div class="space-y-6">
      <div 
        v-for="item in statusItems" 
        :key="item.id"
        class="flex items-center justify-between p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50"
      >
        <div class="flex items-center gap-4">
          <div class="flex-shrink-0">
            <UIcon 
              :name="getStatusIcon(item.status)" 
              class="w-8 h-8"
              :class="getStatusColor(item.status)"
              :class="{ 'animate-spin': item.status === 'checking' }"
            />
          </div>
          <div>
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ item.label }}
            </h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ item.details }}
            </p>
          </div>
        </div>
        
        <div class="flex items-center gap-4">
          <!-- Progress Circle -->
          <div class="relative w-16 h-16">
            <svg class="w-16 h-16 transform -rotate-90" viewBox="0 0 60 60">
              <circle
                cx="30"
                cy="30"
                r="25"
                stroke="currentColor"
                stroke-width="4"
                fill="none"
                class="text-gray-200 dark:text-gray-600"
              />
              <circle
                cx="30"
                cy="30"
                r="25"
                stroke="currentColor"
                stroke-width="4"
                fill="none"
                stroke-dasharray="157"
                :stroke-dashoffset="157 - (157 * item.progress / 100)"
                class="transition-all duration-500 ease-out"
                :class="getStatusColor(item.status)"
              />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-xs font-bold text-gray-900 dark:text-white">
                {{ Math.round(item.progress) }}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Estimated Time -->
    <div class="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-700/50">
      <div class="flex items-center justify-between">
        <div>
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Estimated Resolution Time
          </h4>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Based on current system analysis
          </p>
        </div>
        <div class="text-right">
          <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {{ Math.floor(estimatedTime / 60) }}:{{ (estimatedTime % 60).toString().padStart(2, '0') }}
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            minutes remaining
          </p>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="mt-8 flex flex-col sm:flex-row gap-4">
      <UButton 
        @click="$emit('refresh')"
        color="primary"
        icon="i-lucide-refresh-cw"
        class="flex-1"
      >
        Refresh Status
      </UButton>
      <UButton 
        @click="$emit('contact-support')"
        color="green"
        variant="outline"
        icon="i-lucide-message-circle"
        class="flex-1"
      >
        Contact Support
      </UButton>
    </div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s linear infinite;
}
</style>
