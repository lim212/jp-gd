<template>
  <!-- Developer Quick Actions - Only show in dev mode -->
  <div
    v-if="isDev && showActions"
    class="fixed bottom-4 left-4 z-[9998] flex flex-col gap-2"
  >
    <!-- Toggle Button -->
    <button
      @click="isExpanded = !isExpanded"
      class="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-purple-400"
      title="Developer Actions"
    >
      <svg v-if="!isExpanded" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Actions Menu -->
    <Transition name="slide-up">
      <div
        v-if="isExpanded"
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 border-2 border-purple-200 dark:border-purple-700 min-w-[200px]"
      >
        <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
          Dev Tools
        </h3>
        
        <div class="space-y-2">
          <!-- Force Refresh -->
          <button
            @click="handleForceRefresh"
            class="w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-xs font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center gap-2 shadow-md"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Force Refresh
          </button>

          <!-- Reload CSS -->
          <button
            @click="handleReloadCSS"
            class="w-full px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-xs font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center gap-2 shadow-md"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            Reload CSS
          </button>

          <!-- Check Updates -->
          <button
            @click="handleCheckUpdate"
            class="w-full px-3 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg text-xs font-semibold hover:from-emerald-600 hover:to-green-600 transition-all flex items-center gap-2 shadow-md"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Check Update
          </button>

          <!-- Show Version -->
          <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p class="text-xs text-gray-600 dark:text-gray-400">
              Version: <span class="font-mono font-bold">{{ cacheVersion }}</span>
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Force show in dev - check both process.env and window location
const isDev = computed(() => {
  if (typeof window !== 'undefined') {
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  }
  return process.env.NODE_ENV === 'development'
})

const showActions = ref(false)
const isExpanded = ref(false)
const cacheVersion = ref('loading...')

const { forceReloadPage, reloadCSS, checkForUpdates, getCacheVersion } = useFreshCache()

const handleForceRefresh = () => {
  console.log('🔄 Force refresh initiated by dev tools')
  forceReloadPage()
}

const handleReloadCSS = () => {
  console.log('🎨 Reloading CSS...')
  reloadCSS()
  // Show toast
  if (typeof window !== 'undefined') {
    const toast = document.createElement('div')
    toast.innerHTML = '✅ CSS Reloaded!'
    toast.className = 'fixed top-24 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-xl z-[10000] text-sm font-bold'
    document.body.appendChild(toast)
    setTimeout(() => {
      toast.remove()
    }, 2000)
  }
}

const handleCheckUpdate = async () => {
  console.log('🔍 Checking for updates...')
  const hasUpdate = await checkForUpdates()
  if (hasUpdate) {
    alert('🎉 Update tersedia! Silakan reload.')
  } else {
    alert('✅ Anda sudah menggunakan versi terbaru!')
  }
}

onMounted(() => {
  // Show immediately in dev
  console.log('🛠️ Dev Quick Actions initialized')
  console.log('📍 isDev:', isDev.value)
  console.log('📍 hostname:', window.location.hostname)
  
  showActions.value = true
  
  // Get version
  try {
    cacheVersion.value = getCacheVersion()
    console.log('📦 Cache Version:', cacheVersion.value)
  } catch (e) {
    console.error('Failed to get cache version:', e)
    cacheVersion.value = 'error'
  }
})
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>

