<script setup lang="ts">
interface Star {
  x: number
  y: number
  size: number
  color: string
  twinkleSpeed: number
  twinkleDelay: number
  parallaxFactor: number
}

const props = withDefaults(defineProps<{
  starCount?: number
  baseColor?: string
  speed?: 'slow' | 'normal' | 'fast'
  size?: { min: number, max: number }
  enableParallax?: boolean
  enableTwinkle?: boolean
  enableGlow?: boolean
}>(), {
  starCount: 350,
  baseColor: 'var(--ui-primary)',
  speed: 'normal',
  size: () => ({
    min: 1,
    max: 3.5
  }),
  enableParallax: true,
  enableTwinkle: true,
  enableGlow: true
})

// Smart-mode gate: disable heavy star rendering when smart mode is active
const smartMode = useState<boolean>('smartMode', () => false)
const enabled = ref(true)
if (typeof window !== 'undefined' && (window as any).__SMART_MODE__ === true) {
  enabled.value = false
}

// Mouse position for parallax effect
const mouseX = ref(0);
const mouseY = ref(0);
const isHydrated = ref(false);

// Generate random star positions, sizes, and premium effects
const generateStars = (count: number): Star[] => {
  // Color variations based on the base color
  const colorVariations = [
    props.baseColor,
    'rgba(14, 165, 233, 0.9)', // Sky-500
    'rgba(255, 255, 255, 0.95)', // White
    'rgba(6, 182, 212, 0.85)', // Cyan-500
  ];

  return Array.from({ length: count }, () => {
    const size = typeof props.size === 'number'
      ? props.size
      : Math.random() * (props.size.max - props.size.min) + props.size.min;

    // Randomize twinkle animation properties for more natural effect
    const twinkleSpeed = 2 + Math.random() * 4; // Between 2-6s
    const twinkleDelay = Math.random() * 5; // Random delay up to 5s

    // Randomize parallax factor (how much the star moves with mouse)
    const parallaxFactor = 0.01 + Math.random() * 0.04;

    return {
      x: Math.floor(Math.random() * 2000),
      y: Math.floor(Math.random() * 2000),
      size,
      // Randomly select a color from variations
      color: colorVariations[Math.floor(Math.random() * colorVariations.length)],
      twinkleSpeed,
      twinkleDelay,
      parallaxFactor
    };
  });
}

// Enhanced speed configurations with more sophisticated properties
const speedMap = {
  slow: { duration: 240, opacity: 0.6, ratio: 0.35, easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)' },
  normal: { duration: 180, opacity: 0.8, ratio: 0.35, easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)' },
  fast: { duration: 120, opacity: 1, ratio: 0.3, easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)' }
}

// Create state lazily; avoid generating stars if disabled
const stars = useState<{ slow: Star[], normal: Star[], fast: Star[] }>('premium-stars', () => ({ slow: [], normal: [], fast: [] }))

// Compute star layers with different speeds and properties
const starLayers = computed(() => [
  { stars: stars.value.fast, ...speedMap.fast },
  { stars: stars.value.normal, ...speedMap.normal },
  { stars: stars.value.slow, ...speedMap.slow }
])

// Handle mouse movement for parallax effect
const handleMouseMove = (event) => {
  if (!props.enableParallax || typeof window === 'undefined') return;

  // Calculate mouse position relative to the window center
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  mouseX.value = (event.clientX - windowWidth / 2) / windowWidth;
  mouseY.value = (event.clientY - windowHeight / 2) / windowHeight;
}

// Initialize on client side only
onMounted(() => {
  // If smart mode is off, enable and generate stars
  if (!smartMode.value && enabled.value) {
    stars.value = {
      slow: generateStars(Math.floor(props.starCount * speedMap.slow.ratio)),
      normal: generateStars(Math.floor(props.starCount * speedMap.normal.ratio)),
      fast: generateStars(Math.floor(props.starCount * speedMap.fast.ratio))
    }
  }

  if (enabled.value && props.enableParallax && typeof window !== 'undefined') {
    window.addEventListener('mousemove', handleMouseMove);
  }

  // Mark as hydrated for client-side effects
  isHydrated.value = true;
});

// If device/network improves (smart mode turns off), progressively enable heavy stars
watch(smartMode, (next) => {
  if (!next && !enabled.value) {
    enabled.value = true
    stars.value = {
      slow: generateStars(Math.floor(props.starCount * speedMap.slow.ratio)),
      normal: generateStars(Math.floor(props.starCount * speedMap.normal.ratio)),
      fast: generateStars(Math.floor(props.starCount * speedMap.fast.ratio))
    }
    if (props.enableParallax && typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove)
    }
  }
})

onBeforeUnmount(() => {
  if (props.enableParallax && typeof window !== 'undefined') {
    window.removeEventListener('mousemove', handleMouseMove);
  }
});
</script>

<template>
  <div v-if="enabled" class="absolute pointer-events-none z-[-1] inset-y-0 inset-x-5 sm:inset-x-7 lg:inset-x-9 overflow-hidden">
    <div
      class="premium-stars size-full absolute inset-x-0 top-0"
      :class="{ 'parallax-enabled': enableParallax && isHydrated }"
      :style="enableParallax && isHydrated ? {
        '--parallax-x': `${mouseX * 20}px`,
        '--parallax-y': `${mouseY * 20}px`
      } : {}"
    >
      <div
        v-for="(layer, index) in starLayers"
        :key="index"
        class="star-layer"
        :style="{
          '--star-duration': `${layer.duration}s`,
          '--star-opacity': layer.opacity,
          '--star-easing': layer.easing
        }"
      >
        <div
          v-for="(star, starIndex) in layer.stars"
          :key="starIndex"
          class="premium-star absolute rounded-full"
          :class="{
            'twinkle-animation': enableTwinkle,
            'glow-effect': enableGlow
          }"
          :style="{
            left: `${star.x}px`,
            top: `${star.y}px`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            opacity: 'var(--star-opacity)',
            '--twinkle-speed': `${star.twinkleSpeed}s`,
            '--twinkle-delay': `${star.twinkleDelay}s`,
            '--parallax-factor': star.parallaxFactor,
            '--star-color': star.color,
            '--star-size': `${star.size}px`,
            boxShadow: enableGlow ? `0 0 ${star.size * 2}px ${star.size / 2}px ${star.color}` : 'none'
          }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.premium-stars {
  left: 50%;
  transform: translate(-50%);
  -webkit-mask-image: linear-gradient(
    180deg,
    rgba(217, 217, 217, 0) 0%,
    rgba(217, 217, 217, 0.8) 25%,
    #0ea5e9 50%,
    rgba(217, 217, 217, 0.8) 75%,
    rgba(217, 217, 217, 0) 100%
  );
  mask-image: linear-gradient(
    180deg,
    rgba(217, 217, 217, 0) 0%,
    rgba(217, 217, 217, 0.8) 25%,
    #0ea5e9 50%,
    rgba(217, 217, 217, 0.8) 75%,
    rgba(217, 217, 217, 0) 100%
  );
  -webkit-mask-size: cover;
  mask-size: cover;
  transition: transform 0.5s ease-out;
}

/* Parallax effect */
.parallax-enabled {
  transform: translate(calc(-50% + var(--parallax-x)), calc(var(--parallax-y)));
}

.star-layer {
  animation: premiumRisingStarsAnimation var(--star-easing) infinite;
  animation-duration: var(--star-duration);
  will-change: transform;
  position: relative;
}

.premium-star {
  transform: translateZ(0); /* Force GPU acceleration */
  will-change: opacity, transform, box-shadow;
  transition: transform 0.3s ease-out;
}

/* Twinkling animation */
.twinkle-animation {
  animation: twinkle ease-in-out infinite;
  animation-duration: var(--twinkle-speed);
  animation-delay: var(--twinkle-delay);
}

/* Glow effect */
.glow-effect {
  filter: blur(0.2px);
}

/* Premium rising animation with easing */
@keyframes premiumRisingStarsAnimation {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-2000px);
  }
}

/* Twinkling animation */
@keyframes twinkle {
  0%, 100% {
    opacity: var(--star-opacity);
    transform: scale(1);
  }
  50% {
    opacity: calc(var(--star-opacity) * 0.5);
    transform: scale(0.85);
  }
}

/* Media query for better performance on mobile */
@media (max-width: 768px) {
  .glow-effect {
    box-shadow: none !important; /* Disable glow on mobile for performance */
  }

  .premium-star {
    filter: none; /* Disable blur on mobile for performance */
  }
}

/* Enhanced performance for high-end devices */
@media (min-width: 1200px) {
  .premium-star.glow-effect:hover {
    transform: scale(1.2);
    z-index: 1;
  }
}
</style>

