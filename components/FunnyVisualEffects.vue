<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface Props {
  type: 'confetti' | 'fireworks' | 'hearts' | 'stars' | 'rainbow'
  intensity?: 'low' | 'medium' | 'high'
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  intensity: 'medium',
  duration: 3000
})

const particles = ref<Array<{
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
  emoji?: string
}>>([])

const animationId = ref<number>()
const isActive = ref(false)

// Particle configurations
const getParticleConfig = () => {
  const configs = {
    confetti: {
      colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'],
      emojis: ['🎉', '🎊', '✨', '🌟', '💫', '⭐']
    },
    fireworks: {
      colors: ['#ff6b6b', '#ffa500', '#ffff00', '#00ff00', '#00ffff', '#ff00ff'],
      emojis: ['💥', '🎆', '🎇', '✨', '🌟', '💫']
    },
    hearts: {
      colors: ['#ff69b4', '#ff1493', '#dc143c', '#ffc0cb', '#ffb6c1'],
      emojis: ['❤️', '💕', '💖', '💗', '💘', '💝']
    },
    stars: {
      colors: ['#ffff00', '#ffd700', '#ffa500', '#ffffff', '#f0f8ff'],
      emojis: ['⭐', '🌟', '✨', '💫', '🌠', '⭐']
    },
    rainbow: {
      colors: ['#ff0000', '#ff8000', '#ffff00', '#00ff00', '#0080ff', '#8000ff'],
      emojis: ['🌈', '🦄', '✨', '🌟', '💫', '⭐']
    }
  }
  
  return configs[props.type] || configs.confetti
}

// Create particles
const createParticles = () => {
  const count = props.intensity === 'high' ? 50 : props.intensity === 'medium' ? 30 : 15
  const config = getParticleConfig()
  
  for (let i = 0; i < count; i++) {
    particles.value.push({
      id: i,
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
      y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 600),
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10 - 2, // Slight upward bias
      life: 1,
      maxLife: 1,
      size: Math.random() * 8 + 4,
      color: config.colors[Math.floor(Math.random() * config.colors.length)],
      emoji: config.emojis[Math.floor(Math.random() * config.emojis.length)]
    })
  }
}

// Animate particles
const animateParticles = () => {
  particles.value.forEach((particle, index) => {
    particle.x += particle.vx
    particle.y += particle.vy
    particle.vy += 0.1 // Gravity
    particle.life -= 0.02
    
    // Remove dead particles
    if (particle.life <= 0) {
      particles.value.splice(index, 1)
    }
  })
  
  // Continue animation if there are particles or if we're still in the duration
  if (particles.value.length > 0 || isActive.value) {
    animationId.value = requestAnimationFrame(animateParticles)
  }
}

// Start effect
const startEffect = () => {
  if (isActive.value) return
  
  isActive.value = true
  createParticles()
  animateParticles()
  
  // Stop after duration
  setTimeout(() => {
    isActive.value = false
  }, props.duration)
}

// Stop effect
const stopEffect = () => {
  isActive.value = false
  particles.value = []
  if (animationId.value) {
    cancelAnimationFrame(animationId.value)
  }
}

onMounted(() => {
  // Auto-start effect
  setTimeout(startEffect, 500)
})

onBeforeUnmount(() => {
  stopEffect()
})

// Expose methods
defineExpose({
  startEffect,
  stopEffect
})
</script>

<template>
  <div class="fixed inset-0 pointer-events-none z-50">
    <!-- Particles -->
    <div
      v-for="particle in particles"
      :key="particle.id"
      class="absolute transition-opacity duration-100"
      :style="{
        left: particle.x + 'px',
        top: particle.y + 'px',
        opacity: particle.life,
        transform: `scale(${particle.life})`
      }"
    >
      <!-- Emoji particles -->
      <div 
        v-if="particle.emoji"
        class="text-2xl select-none"
        :style="{ fontSize: particle.size + 'px' }"
      >
        {{ particle.emoji }}
      </div>
      
      <!-- Color particles -->
      <div 
        v-else
        class="rounded-full"
        :style="{
          width: particle.size + 'px',
          height: particle.size + 'px',
          backgroundColor: particle.color
        }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
/* Particle animations */
.particle {
  will-change: transform, opacity;
}
</style>
