<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface Props {
  errorCode: string
  mood: 'happy' | 'sad' | 'confused' | 'excited' | 'sleepy'
  intensity?: 'low' | 'medium' | 'high'
}

const props = withDefaults(defineProps<Props>(), {
  mood: 'confused',
  intensity: 'medium'
})

const characters = ref<Array<{
  id: number
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  rotation: number
  rotationSpeed: number
  emoji: string
  life: number
}>>([])

const animationId = ref<number>()

// Character configurations based on mood
const getCharacterConfig = () => {
  const configs = {
    happy: ['😊', '😄', '😁', '🤗', '🥳', '🎉', '✨', '🌟'],
    sad: ['😢', '😭', '😔', '😞', '💔', '🌧️', '☁️', '💧'],
    confused: ['😕', '🤔', '😵', '🤯', '❓', '❔', '💭', '🔍'],
    excited: ['🤩', '😍', '🥰', '😘', '💖', '🔥', '⚡', '🚀'],
    sleepy: ['😴', '😪', '🥱', '💤', '🌙', '⭐', '🌠', '💫']
  }
  
  return configs[props.mood] || configs.confused
}

// Create floating characters
const createCharacters = () => {
  const count = props.intensity === 'high' ? 25 : props.intensity === 'medium' ? 15 : 8
  const emojis = getCharacterConfig()
  
  for (let i = 0; i < count; i++) {
    characters.value.push({
      id: i,
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
      y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 600),
      size: Math.random() * 20 + 15,
      speedX: (Math.random() - 0.5) * 1.5,
      speedY: (Math.random() - 0.5) * 1.5,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 4,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      life: Math.random() * 200 + 100
    })
  }
}

// Animate characters
const animateCharacters = () => {
  characters.value.forEach(character => {
    character.x += character.speedX
    character.y += character.speedY
    character.rotation += character.rotationSpeed
    character.life--
    
    // Bounce off edges
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 800
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 600
    
    if (character.x < 0 || character.x > screenWidth) {
      character.speedX *= -1
    }
    if (character.y < 0 || character.y > screenHeight) {
      character.speedY *= -1
    }
    
    // Reset character when it dies
    if (character.life <= 0) {
      character.x = Math.random() * screenWidth
      character.y = Math.random() * screenHeight
      character.life = Math.random() * 200 + 100
    }
  })
  
  animationId.value = requestAnimationFrame(animateCharacters)
}

onMounted(() => {
  createCharacters()
  animateCharacters()
})

onBeforeUnmount(() => {
  if (animationId.value) {
    cancelAnimationFrame(animationId.value)
  }
})
</script>

<template>
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <!-- Floating Characters -->
    <div
      v-for="character in characters"
      :key="character.id"
      class="absolute text-2xl select-none"
      :style="{
        left: character.x + 'px',
        top: character.y + 'px',
        transform: `rotate(${character.rotation}deg) scale(${character.size / 20})`,
        opacity: Math.min(1, character.life / 100)
      }"
    >
      {{ character.emoji }}
    </div>

    <!-- Special Effects based on error code -->
    <div v-if="errorCode === '404'" class="absolute inset-0">
      <!-- Search magnifying glass -->
      <div class="absolute top-1/4 left-1/4 text-6xl animate-bounce" style="animation-delay: 0.5s;">
        🔍
      </div>
      <div class="absolute top-1/3 right-1/4 text-5xl animate-pulse" style="animation-delay: 1s;">
        ❓
      </div>
      <div class="absolute bottom-1/4 left-1/3 text-4xl animate-spin" style="animation-duration: 3s;">
        🌀
      </div>
    </div>

    <div v-else-if="errorCode === '500'" class="absolute inset-0">
      <!-- Server crash effects -->
      <div class="absolute top-1/4 left-1/4 text-6xl animate-bounce" style="animation-delay: 0.3s;">
        💥
      </div>
      <div class="absolute top-1/3 right-1/4 text-5xl animate-pulse" style="animation-delay: 0.8s;">
        🔧
      </div>
      <div class="absolute bottom-1/4 left-1/3 text-4xl animate-spin" style="animation-duration: 2s;">
        ⚙️
      </div>
      <div class="absolute bottom-1/3 right-1/4 text-5xl animate-bounce" style="animation-delay: 1.2s;">
        🛠️
      </div>
    </div>

    <div v-else-if="errorCode === '403'" class="absolute inset-0">
      <!-- Access denied effects -->
      <div class="absolute top-1/4 left-1/4 text-6xl animate-bounce" style="animation-delay: 0.4s;">
        🚫
      </div>
      <div class="absolute top-1/3 right-1/4 text-5xl animate-pulse" style="animation-delay: 0.9s;">
        🔒
      </div>
      <div class="absolute bottom-1/4 left-1/3 text-4xl animate-spin" style="animation-duration: 4s;">
        🛡️
      </div>
    </div>

    <!-- Floating particles -->
    <div class="absolute inset-0">
      <div
        v-for="i in 20"
        :key="`particle-${i}`"
        class="absolute w-2 h-2 rounded-full opacity-30 animate-float"
        :class="{
          'bg-blue-400': i % 4 === 0,
          'bg-purple-400': i % 4 === 1,
          'bg-pink-400': i % 4 === 2,
          'bg-yellow-400': i % 4 === 3
        }"
        :style="{
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%',
          animationDelay: Math.random() * 5 + 's',
          animationDuration: (Math.random() * 3 + 2) + 's'
        }"
      ></div>
    </div>

    <!-- Sparkle effects -->
    <div class="absolute inset-0">
      <div
        v-for="i in 15"
        :key="`sparkle-${i}`"
        class="absolute text-2xl opacity-60 animate-ping"
        :style="{
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%',
          animationDelay: Math.random() * 3 + 's',
          animationDuration: (Math.random() * 2 + 1) + 's'
        }"
      >
        ✨
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-20px) rotate(120deg);
  }
  66% {
    transform: translateY(10px) rotate(240deg);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Character hover effects */
.character:hover {
  transform: scale(1.2) rotate(360deg);
  transition: all 0.3s ease;
}
</style>
