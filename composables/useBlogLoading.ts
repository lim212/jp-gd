export function useBlogLoading() {
  const isLoading = ref(false)
  const loadingProgress = ref(0)
  const loadingMessage = ref('')
  const loadingStartTime = ref(0)
  let loadingInterval: NodeJS.Timeout | null = null

  function startLoading(message: string = 'Memuat data...') {
    // Clear any existing interval
    if (loadingInterval) {
      clearInterval(loadingInterval)
    }
    
    isLoading.value = true
    loadingProgress.value = 0
    loadingMessage.value = message
    loadingStartTime.value = Date.now()
    
    // Faster progress simulation
    loadingInterval = setInterval(() => {
      if (loadingProgress.value < 85) {
        loadingProgress.value += Math.random() * 15 + 5 // Faster progress
      }
    }, 50) // Faster interval
    
    return loadingInterval
  }

  function stopLoading() {
    // Clear the interval first
    if (loadingInterval) {
      clearInterval(loadingInterval)
      loadingInterval = null
    }
    
    // Set progress to 100% immediately
    loadingProgress.value = 100
    
    // Hide loading after a brief delay (enough to show 100%)
    setTimeout(() => {
      isLoading.value = false
      loadingProgress.value = 0
      loadingMessage.value = ''
      loadingStartTime.value = 0
    }, 150) // Reduced delay for faster response
  }

  return {
    isLoading,
    loadingProgress,
    loadingMessage,
    loadingStartTime,
    startLoading,
    stopLoading
  }
}


