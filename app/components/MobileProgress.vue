<template>
  <div class="mobile-progress-container" :class="containerClasses">
    <!-- Linear Progress -->
    <div v-if="type === 'linear'" class="mobile-progress mobile-progress-linear" :style="progressStyle">
      <div class="mobile-progress-track">
        <div 
          class="mobile-progress-fill" 
          :class="fillClasses"
          :style="fillStyle"
        ></div>
      </div>
      <div v-if="showLabel" class="mobile-progress-label">
        <span class="mobile-progress-text">{{ labelText }}</span>
        <span v-if="showPercentage" class="mobile-progress-percentage">{{ percentage }}%</span>
      </div>
    </div>

    <!-- Circular Progress -->
    <div v-else-if="type === 'circular'" class="mobile-progress mobile-progress-circular" :style="circularStyle">
      <svg class="mobile-progress-svg" :width="size" :height="size">
        <circle
          class="mobile-progress-track-circle"
          :cx="center"
          :cy="center"
          :r="radius"
          :stroke-width="strokeWidth"
        ></circle>
        <circle
          class="mobile-progress-fill-circle"
          :class="fillClasses"
          :cx="center"
          :cy="center"
          :r="radius"
          :stroke-width="strokeWidth"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="strokeDashoffset"
          :style="fillStyle"
        ></circle>
      </svg>
      <div v-if="showLabel" class="mobile-progress-circular-label">
        <span v-if="showPercentage" class="mobile-progress-percentage">{{ percentage }}%</span>
        <span v-if="label" class="mobile-progress-text">{{ label }}</span>
      </div>
    </div>

    <!-- Step Progress -->
    <div v-else-if="type === 'steps'" class="mobile-progress mobile-progress-steps">
      <div class="mobile-progress-steps-container">
        <div 
          v-for="(step, index) in steps" 
          :key="index"
          class="mobile-progress-step"
          :class="getStepClasses(index)"
        >
          <div class="mobile-progress-step-indicator">
            <div v-if="index < currentStep" class="mobile-progress-step-check">
              <Icon name="lucide:check" class="mobile-progress-step-icon" />
            </div>
            <div v-else-if="index === currentStep" class="mobile-progress-step-current">
              <div class="mobile-progress-step-dot"></div>
            </div>
            <div v-else class="mobile-progress-step-dot mobile-progress-step-dot-inactive"></div>
          </div>
          <div class="mobile-progress-step-content">
            <div class="mobile-progress-step-title">{{ step.title }}</div>
            <div v-if="step.description" class="mobile-progress-step-description">{{ step.description }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Progress -->
    <div v-else-if="type === 'loading'" class="mobile-progress mobile-progress-loading">
      <div class="mobile-progress-loading-container">
        <div class="mobile-progress-loading-dots">
          <div 
            v-for="n in 3" 
            :key="n"
            class="mobile-progress-loading-dot"
            :style="{ animationDelay: `${(n - 1) * 0.2}s` }"
          ></div>
        </div>
        <div v-if="loadingText" class="mobile-progress-loading-text">{{ loadingText }}</div>
      </div>
    </div>

    <!-- Pulse Progress -->
    <div v-else-if="type === 'pulse'" class="mobile-progress mobile-progress-pulse">
      <div class="mobile-progress-pulse-container">
        <div class="mobile-progress-pulse-circle" :style="pulseStyle"></div>
        <div v-if="showLabel" class="mobile-progress-pulse-label">
          <span class="mobile-progress-text">{{ labelText }}</span>
        </div>
      </div>
    </div>

    <!-- Wave Progress -->
    <div v-else-if="type === 'wave'" class="mobile-progress mobile-progress-wave">
      <div class="mobile-progress-wave-container">
        <div class="mobile-progress-wave-bar" v-for="n in 5" :key="n" :style="getWaveBarStyle(n)"></div>
      </div>
      <div v-if="showLabel" class="mobile-progress-wave-label">
        <span class="mobile-progress-text">{{ labelText }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props
const props = defineProps({
  // Type
  type: {
    type: String,
    default: 'linear',
    validator: (value: string) => [
      'linear', 'circular', 'steps', 'loading', 'pulse', 'wave'
    ].includes(value)
  },
  
  // Progress value
  value: {
    type: Number,
    default: 0,
    validator: (value: number) => value >= 0 && value <= 100
  },
  
  // Size
  size: {
    type: Number,
    default: 120
  },
  height: {
    type: Number,
    default: 8
  },
  
  // Colors
  color: {
    type: String,
    default: 'primary',
    validator: (value: string) => [
      'primary', 'secondary', 'success', 'warning', 'error', 'info'
    ].includes(value)
  },
  
  // Variants
  variant: {
    type: String,
    default: 'default',
    validator: (value: string) => ['default', 'gradient', 'striped', 'animated'].includes(value)
  },
  
  // Labels
  label: {
    type: String,
    default: ''
  },
  showLabel: {
    type: Boolean,
    default: true
  },
  showPercentage: {
    type: Boolean,
    default: true
  },
  
  // Loading specific
  loadingText: {
    type: String,
    default: 'Loading...'
  },
  
  // Steps specific
  steps: {
    type: Array as () => Array<{ title: string; description?: string }>,
    default: () => []
  },
  currentStep: {
    type: Number,
    default: 0
  },
  
  // Animation
  animated: {
    type: Boolean,
    default: true
  },
  indeterminate: {
    type: Boolean,
    default: false
  }
})

// Computed
const percentage = computed(() => Math.round(props.value))

const containerClasses = computed(() => [
  `mobile-progress-${props.type}`,
  `mobile-progress-${props.color}`,
  `mobile-progress-${props.variant}`,
  {
    'mobile-progress-animated': props.animated,
    'mobile-progress-indeterminate': props.indeterminate
  }
])

const fillClasses = computed(() => [
  `mobile-progress-fill-${props.color}`,
  `mobile-progress-fill-${props.variant}`,
  {
    'mobile-progress-fill-animated': props.animated,
    'mobile-progress-fill-indeterminate': props.indeterminate
  }
])

const progressStyle = computed(() => ({
  height: `${props.height}px`
}))

const circularStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`
}))

const center = computed(() => props.size / 2)
const radius = computed(() => (props.size - props.height) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const strokeWidth = computed(() => props.height)
const strokeDashoffset = computed(() => {
  const progress = props.indeterminate ? 0 : (100 - props.value) / 100
  return circumference.value * progress
})

const fillStyle = computed(() => {
  const style: Record<string, string> = {}
  
  if (props.type === 'linear') {
    style.width = props.indeterminate ? '100%' : `${props.value}%`
  }
  
  return style
})

const pulseStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`
}))

const labelText = computed(() => {
  if (props.label) return props.label
  if (props.type === 'loading') return props.loadingText
  return ''
})

// Methods
const getStepClasses = (index: number) => {
  const classes = []
  
  if (index < props.currentStep) {
    classes.push('mobile-progress-step-completed')
  } else if (index === props.currentStep) {
    classes.push('mobile-progress-step-current')
  } else {
    classes.push('mobile-progress-step-pending')
  }
  
  return classes
}

const getWaveBarStyle = (index: number) => {
  const delays = [0, 0.1, 0.2, 0.3, 0.4]
  return {
    animationDelay: `${delays[index - 1]}s`
  }
}
</script>

<style scoped>
/* Mobile Progress Base Styles */
.mobile-progress-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--mobile-sm);
}

.mobile-progress {
  position: relative;
}

/* Linear Progress */
.mobile-progress-linear {
  width: 100%;
}

.mobile-progress-track {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 9999px;
  overflow: hidden;
  position: relative;
}

.mobile-progress-fill {
  height: 100%;
  background: var(--mobile-primary);
  border-radius: inherit;
  transition: width 0.3s ease;
  position: relative;
  overflow: hidden;
}

.mobile-progress-fill-animated {
  animation: mobile-progress-shimmer 2s infinite;
}

.mobile-progress-fill-indeterminate {
  animation: mobile-progress-indeterminate 1.5s infinite;
}

@keyframes mobile-progress-shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes mobile-progress-indeterminate {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
}

/* Circular Progress */
.mobile-progress-circular {
  position: relative;
  display: inline-block;
}

.mobile-progress-svg {
  transform: rotate(-90deg);
}

.mobile-progress-track-circle {
  fill: none;
  stroke: rgba(0, 0, 0, 0.1);
}

.mobile-progress-fill-circle {
  fill: none;
  stroke: var(--mobile-primary);
  stroke-linecap: round;
  transition: stroke-dashoffset 0.3s ease;
}

.mobile-progress-circular-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--mobile-xs);
}

/* Step Progress */
.mobile-progress-steps {
  width: 100%;
}

.mobile-progress-steps-container {
  display: flex;
  flex-direction: column;
  gap: var(--mobile-lg);
}

.mobile-progress-step {
  display: flex;
  align-items: flex-start;
  gap: var(--mobile-md);
}

.mobile-progress-step-indicator {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.mobile-progress-step-check {
  width: 100%;
  height: 100%;
  background: var(--mobile-success);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.mobile-progress-step-current {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-progress-step-dot {
  width: 12px;
  height: 12px;
  background: var(--mobile-primary);
  border-radius: 50%;
  animation: mobile-progress-pulse 2s infinite;
}

.mobile-progress-step-dot-inactive {
  background: rgba(0, 0, 0, 0.2);
  animation: none;
}

.mobile-progress-step-icon {
  width: 16px;
  height: 16px;
}

.mobile-progress-step-content {
  flex: 1;
  padding-top: 4px;
}

.mobile-progress-step-title {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--mobile-xs);
}

.mobile-progress-step-description {
  font-size: var(--mobile-text-sm);
  color: var(--text-secondary);
  line-height: 1.4;
}

/* Loading Progress */
.mobile-progress-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--mobile-lg);
}

.mobile-progress-loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--mobile-md);
}

.mobile-progress-loading-dots {
  display: flex;
  gap: var(--mobile-sm);
}

.mobile-progress-loading-dot {
  width: 8px;
  height: 8px;
  background: var(--mobile-primary);
  border-radius: 50%;
  animation: mobile-progress-bounce 1.4s infinite ease-in-out;
}

@keyframes mobile-progress-bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* Pulse Progress */
.mobile-progress-pulse {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--mobile-lg);
}

.mobile-progress-pulse-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--mobile-md);
}

.mobile-progress-pulse-circle {
  background: var(--mobile-primary);
  border-radius: 50%;
  animation: mobile-progress-pulse-scale 2s infinite;
}

@keyframes mobile-progress-pulse-scale {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2.4);
    opacity: 0;
  }
}

/* Wave Progress */
.mobile-progress-wave {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--mobile-lg);
}

.mobile-progress-wave-container {
  display: flex;
  align-items: center;
  gap: 3px;
  height: 40px;
}

.mobile-progress-wave-bar {
  width: 4px;
  background: var(--mobile-primary);
  border-radius: 2px;
  animation: mobile-progress-wave 1.2s infinite ease-in-out;
}

@keyframes mobile-progress-wave {
  0%, 40%, 100% {
    transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
  }
}

/* Progress Labels */
.mobile-progress-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--mobile-sm);
}

.mobile-progress-text {
  font-size: var(--mobile-text-sm);
  color: var(--text-secondary);
  font-weight: 500;
}

.mobile-progress-percentage {
  font-size: var(--mobile-text-sm);
  color: var(--text-primary);
  font-weight: 600;
}

.mobile-progress-pulse-label,
.mobile-progress-wave-label {
  margin-top: var(--mobile-sm);
}

/* Color Variants */
.mobile-progress-primary .mobile-progress-fill,
.mobile-progress-primary .mobile-progress-fill-circle,
.mobile-progress-primary .mobile-progress-step-check,
.mobile-progress-primary .mobile-progress-step-dot,
.mobile-progress-primary .mobile-progress-loading-dot,
.mobile-progress-primary .mobile-progress-pulse-circle,
.mobile-progress-primary .mobile-progress-wave-bar {
  background: var(--mobile-primary);
}

.mobile-progress-secondary .mobile-progress-fill,
.mobile-progress-secondary .mobile-progress-fill-circle,
.mobile-progress-secondary .mobile-progress-step-check,
.mobile-progress-secondary .mobile-progress-step-dot,
.mobile-progress-secondary .mobile-progress-loading-dot,
.mobile-progress-secondary .mobile-progress-pulse-circle,
.mobile-progress-secondary .mobile-progress-wave-bar {
  background: var(--mobile-secondary);
}

.mobile-progress-success .mobile-progress-fill,
.mobile-progress-success .mobile-progress-fill-circle,
.mobile-progress-success .mobile-progress-step-check,
.mobile-progress-success .mobile-progress-step-dot,
.mobile-progress-success .mobile-progress-loading-dot,
.mobile-progress-success .mobile-progress-pulse-circle,
.mobile-progress-success .mobile-progress-wave-bar {
  background: var(--mobile-success);
}

.mobile-progress-warning .mobile-progress-fill,
.mobile-progress-warning .mobile-progress-fill-circle,
.mobile-progress-warning .mobile-progress-step-check,
.mobile-progress-warning .mobile-progress-step-dot,
.mobile-progress-warning .mobile-progress-loading-dot,
.mobile-progress-warning .mobile-progress-pulse-circle,
.mobile-progress-warning .mobile-progress-wave-bar {
  background: var(--mobile-warning);
}

.mobile-progress-error .mobile-progress-fill,
.mobile-progress-error .mobile-progress-fill-circle,
.mobile-progress-error .mobile-progress-step-check,
.mobile-progress-error .mobile-progress-step-dot,
.mobile-progress-error .mobile-progress-loading-dot,
.mobile-progress-error .mobile-progress-pulse-circle,
.mobile-progress-error .mobile-progress-wave-bar {
  background: var(--mobile-error);
}

.mobile-progress-info .mobile-progress-fill,
.mobile-progress-info .mobile-progress-fill-circle,
.mobile-progress-info .mobile-progress-step-check,
.mobile-progress-info .mobile-progress-step-dot,
.mobile-progress-info .mobile-progress-loading-dot,
.mobile-progress-info .mobile-progress-pulse-circle,
.mobile-progress-info .mobile-progress-wave-bar {
  background: var(--mobile-info);
}

/* Variant Styles */
.mobile-progress-gradient .mobile-progress-fill,
.mobile-progress-gradient .mobile-progress-fill-circle {
  background: linear-gradient(90deg, var(--mobile-primary), var(--mobile-secondary));
}

.mobile-progress-striped .mobile-progress-fill {
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 1rem 1rem;
}

.mobile-progress-animated .mobile-progress-striped .mobile-progress-fill {
  animation: mobile-progress-stripes 1s linear infinite;
}

@keyframes mobile-progress-stripes {
  0% {
    background-position: 1rem 0;
  }
  100% {
    background-position: 0 0;
  }
}

/* Dark Mode Adjustments */
.dark .mobile-progress-track,
.dark .mobile-progress-track-circle {
  stroke: rgba(255, 255, 255, 0.1);
}

.dark .mobile-progress-step-dot-inactive {
  background: rgba(255, 255, 255, 0.2);
}

/* Responsive Adjustments */
@media (max-width: 480px) {
  .mobile-progress-circular {
    transform: scale(0.8);
  }
  
  .mobile-progress-steps-container {
    gap: var(--mobile-md);
  }
  
  .mobile-progress-step-indicator {
    width: 28px;
    height: 28px;
  }
  
  .mobile-progress-step-dot {
    width: 10px;
    height: 10px;
  }
}

/* Performance Optimizations */
.mobile-progress-fill,
.mobile-progress-fill-circle,
.mobile-progress-loading-dot,
.mobile-progress-pulse-circle,
.mobile-progress-wave-bar {
  will-change: transform, opacity;
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  .mobile-progress-fill-animated,
  .mobile-progress-fill-indeterminate,
  .mobile-progress-loading-dot,
  .mobile-progress-pulse-circle,
  .mobile-progress-wave-bar,
  .mobile-progress-step-dot {
    animation: none;
  }
  
  .mobile-progress-fill,
  .mobile-progress-fill-circle {
    transition: none;
  }
}

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  .mobile-progress-track,
  .mobile-progress-track-circle {
    background: rgba(0, 0, 0, 0.3);
    stroke: rgba(0, 0, 0, 0.3);
  }
  
  .dark .mobile-progress-track,
  .dark .mobile-progress-track-circle {
    background: rgba(255, 255, 255, 0.3);
    stroke: rgba(255, 255, 255, 0.3);
  }
}
</style>

