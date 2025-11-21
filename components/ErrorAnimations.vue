<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface Props {
  type: 'particles' | 'waves' | 'geometric' | 'minimal'
  color: string
  intensity?: 'low' | 'medium' | 'high'
}

const props = withDefaults(defineProps<Props>(), {
  intensity: 'medium'
})

const particles = ref<Array<{
  id: number
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  life: number
}>>([])

const animationId = ref<number>()

// Create particles based on type
const createParticles = () => {
  const count = props.intensity === 'high' ? 50 : props.intensity === 'medium' ? 30 : 15
  
  for (let i = 0; i < count; i++) {
    particles.value.push({
      id: i,
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
      y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 600),
      size: Math.random() * 4 + 1,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      opacity: Math.random() * 0.5 + 0.1,
      life: Math.random() * 100 + 50
    })
  }
}

// Animate particles
const animateParticles = () => {
  particles.value.forEach(particle => {
    particle.x += particle.speedX
    particle.y += particle.speedY
    particle.life--
    
    // Reset particle when it goes off screen or dies
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 800;
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 600;
    
    if (particle.x < 0 || particle.x > screenWidth || 
        particle.y < 0 || particle.y > screenHeight || 
        particle.life <= 0) {
      particle.x = Math.random() * screenWidth
      particle.y = Math.random() * screenHeight
      particle.life = Math.random() * 100 + 50
    }
  })
  
  animationId.value = requestAnimationFrame(animateParticles)
}

onMounted(() => {
  createParticles()
  animateParticles()
})

onBeforeUnmount(() => {
  if (animationId.value) {
    cancelAnimationFrame(animationId.value)
  }
})
</script>

<template>
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <!-- Particles Animation -->
    <div v-if="type === 'particles'" class="absolute inset-0">
      <div
        v-for="particle in particles"
        :key="particle.id"
        class="absolute rounded-full animate-pulse"
        :class="`bg-${color}-400`"
        :style="{
          left: particle.x + 'px',
          top: particle.y + 'px',
          width: particle.size + 'px',
          height: particle.size + 'px',
          opacity: particle.opacity
        }"
      ></div>
    </div>

    <!-- Waves Animation -->
    <div v-else-if="type === 'waves'" class="absolute inset-0">
      <svg class="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" :stop-color="`rgb(var(--${color}-400))`" stop-opacity="0.1" />
            <stop offset="50%" :stop-color="`rgb(var(--${color}-500))`" stop-opacity="0.05" />
            <stop offset="100%" :stop-color="`rgb(var(--${color}-600))`" stop-opacity="0.1" />
          </linearGradient>
        </defs>
        <path
          d="M0,400 Q300,300 600,400 T1200,400 L1200,800 L0,800 Z"
          fill="url(#waveGradient)"
          class="animate-wave"
        />
        <path
          d="M0,500 Q400,400 800,500 T1200,500 L1200,800 L0,800 Z"
          fill="url(#waveGradient)"
          class="animate-wave"
          style="animation-delay: 1s;"
        />
      </svg>
    </div>

    <!-- Geometric Animation -->
    <div v-else-if="type === 'geometric'" class="absolute inset-0">
      <div
        v-for="i in 12"
        :key="i"
        class="absolute border-2 animate-spin-slow"
        :class="`border-${color}-300`"
        :style="{
          width: (i * 20) + 'px',
          height: (i * 20) + 'px',
          left: '50%',
          top: '50%',
          marginLeft: -(i * 10) + 'px',
          marginTop: -(i * 10) + 'px',
          animationDelay: (i * 0.1) + 's',
          opacity: 0.1 + (i * 0.02)
        }"
      ></div>
    </div>

    <!-- Minimal Animation -->
    <div v-else-if="type === 'minimal'" class="absolute inset-0">
      <div class="absolute top-1/4 left-1/4 w-2 h-2 rounded-full animate-pulse" :class="`bg-${color}-400`"></div>
      <div class="absolute top-1/3 right-1/3 w-1 h-1 rounded-full animate-pulse" :class="`bg-${color}-500`" style="animation-delay: 0.5s;"></div>
      <div class="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 rounded-full animate-pulse" :class="`bg-${color}-300`" style="animation-delay: 1s;"></div>
      <div class="absolute bottom-1/3 right-1/4 w-1 h-1 rounded-full animate-pulse" :class="`bg-${color}-400`" style="animation-delay: 1.5s;"></div>
    </div>
  </div>
</template>

<style scoped>
@keyframes wave {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-wave {
  animation: wave 8s ease-in-out infinite;
}

.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}
</style>
