<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  enabled?: boolean
  volume?: number
}

const props = withDefaults(defineProps<Props>(), {
  enabled: true,
  volume: 0.3
})

const audioContext = ref<AudioContext | null>(null)
const isSupported = ref(false)

// Initialize audio context
const initAudio = () => {
  if (typeof window !== 'undefined' && 'AudioContext' in window) {
    try {
      audioContext.value = new (window.AudioContext || (window as any).webkitAudioContext)()
      isSupported.value = true
    } catch (error) {
      console.log('Audio not supported')
      isSupported.value = false
    }
  }
}

// Play different sound effects
const playSound = (type: 'click' | 'hover' | 'success' | 'error' | 'notification') => {
  if (!props.enabled || !isSupported.value || !audioContext.value) return

  try {
    const oscillator = audioContext.value.createOscillator()
    const gainNode = audioContext.value.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.value.destination)
    
    // Different sound patterns for different types
    switch (type) {
      case 'click':
        oscillator.frequency.setValueAtTime(800, audioContext.value.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.value.currentTime + 0.1)
        gainNode.gain.setValueAtTime(props.volume, audioContext.value.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.value.currentTime + 0.1)
        oscillator.start(audioContext.value.currentTime)
        oscillator.stop(audioContext.value.currentTime + 0.1)
        break
        
      case 'hover':
        oscillator.frequency.setValueAtTime(600, audioContext.value.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.value.currentTime + 0.05)
        gainNode.gain.setValueAtTime(props.volume * 0.5, audioContext.value.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.value.currentTime + 0.05)
        oscillator.start(audioContext.value.currentTime)
        oscillator.stop(audioContext.value.currentTime + 0.05)
        break
        
      case 'success':
        // Happy ascending notes
        oscillator.frequency.setValueAtTime(523, audioContext.value.currentTime) // C5
        oscillator.frequency.setValueAtTime(659, audioContext.value.currentTime + 0.1) // E5
        oscillator.frequency.setValueAtTime(784, audioContext.value.currentTime + 0.2) // G5
        gainNode.gain.setValueAtTime(props.volume, audioContext.value.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.value.currentTime + 0.3)
        oscillator.start(audioContext.value.currentTime)
        oscillator.stop(audioContext.value.currentTime + 0.3)
        break
        
      case 'error':
        // Sad descending notes
        oscillator.frequency.setValueAtTime(400, audioContext.value.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.value.currentTime + 0.2)
        gainNode.gain.setValueAtTime(props.volume, audioContext.value.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.value.currentTime + 0.2)
        oscillator.start(audioContext.value.currentTime)
        oscillator.stop(audioContext.value.currentTime + 0.2)
        break
        
      case 'notification':
        // Gentle notification sound
        oscillator.frequency.setValueAtTime(1000, audioContext.value.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.value.currentTime + 0.1)
        gainNode.gain.setValueAtTime(props.volume * 0.7, audioContext.value.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.value.currentTime + 0.1)
        oscillator.start(audioContext.value.currentTime)
        oscillator.stop(audioContext.value.currentTime + 0.1)
        break
    }
  } catch (error) {
    console.log('Sound playback failed:', error)
  }
}

// Play random funny sound
const playRandomSound = () => {
  const sounds = ['click', 'hover', 'success', 'notification'] as const
  const randomSound = sounds[Math.floor(Math.random() * sounds.length)]
  playSound(randomSound)
}

// Play celebration sound
const playCelebration = () => {
  if (!props.enabled || !isSupported.value || !audioContext.value) return

  try {
    // Play a sequence of happy notes
    const notes = [523, 659, 784, 1047] // C5, E5, G5, C6
    notes.forEach((frequency, index) => {
      setTimeout(() => {
        const oscillator = audioContext.value!.createOscillator()
        const gainNode = audioContext.value!.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.value!.destination)
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.value!.currentTime)
        gainNode.gain.setValueAtTime(props.volume * 0.8, audioContext.value!.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.value!.currentTime + 0.2)
        
        oscillator.start(audioContext.value!.currentTime)
        oscillator.stop(audioContext.value!.currentTime + 0.2)
      }, index * 100)
    })
  } catch (error) {
    console.log('Celebration sound failed:', error)
  }
}

onMounted(() => {
  initAudio()
})

// Expose methods for parent components
defineExpose({
  playSound,
  playRandomSound,
  playCelebration
})
</script>

<template>
  <!-- This component doesn't render anything, it just provides sound functionality -->
</template>
