<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

interface LoadingStep {
  id: string
  name: string
  weight: number
  completed: boolean
  error?: boolean
}

interface Props {
  steps: LoadingStep[]
  showProgress?: boolean
  showSteps?: boolean
  autoStart?: boolean
  duration?: number
  onComplete?: () => void
  onError?: (step: LoadingStep) => void
}

const props = withDefaults(defineProps<Props>(), {
  showProgress: true,
  showSteps: true,
  autoStart: true,
  duration: 3000
})

const currentStep = ref(0)
const progress = ref(0)
const isComplete = ref(false)
const isError = ref(false)
const startTime = ref(0)

const totalWeight = computed(() => 
  props.steps.reduce((sum, step) => sum + step.weight, 0)
)

const completedWeight = computed(() => 
  props.steps
    .filter(step => step.completed)
    .reduce((sum, step) => sum + step.weight, 0)
)

const progressPercentage = computed(() => 
  Math.round((completedWeight.value / totalWeight.value) * 100)
)

const currentStepName = computed(() => 
  props.steps[currentStep.value]?.name || ''
)

const startLoading = () => {
  startTime.value = Date.now()
  currentStep.value = 0
  progress.value = 0
  isComplete.value = false
  isError.value = false
  
  // Reset all steps
  props.steps.forEach(step => {
    step.completed = false
    step.error = false
  })
  
  processSteps()
}

const processSteps = async () => {
  for (let i = 0; i < props.steps.length; i++) {
    currentStep.value = i
    const step = props.steps[i]
    
    try {
      // Simulate step processing
      await new Promise(resolve => setTimeout(resolve, (step.weight / totalWeight.value) * props.duration))
      
      step.completed = true
      progress.value = progressPercentage.value
      
    } catch (error) {
      step.error = true
      isError.value = true
      props.onError?.(step)
      return
    }
  }
  
  isComplete.value = true
  progress.value = 100
  props.onComplete?.()
}

const reset = () => {
  currentStep.value = 0
  progress.value = 0
  isComplete.value = false
  isError.value = false
  
  props.steps.forEach(step => {
    step.completed = false
    step.error = false
  })
}

onMounted(() => {
  if (props.autoStart) {
    startLoading()
  }
})

defineExpose({
  startLoading,
  reset,
  progress: readonly(progress),
  isComplete: readonly(isComplete),
  isError: readonly(isError),
  currentStep: readonly(currentStep)
})
</script>

<template>
  <div class="progressive-loader">
    <!-- Progress Bar -->
    <div v-if="showProgress" class="progress-container">
      <div class="progress-bar">
        <div 
          class="progress-fill"
          :style="{ width: `${progress}%` }"
          :class="{ 
            'progress-complete': isComplete,
            'progress-error': isError 
          }"
        ></div>
      </div>
      <div class="progress-text">
        {{ progress }}%
      </div>
    </div>

    <!-- Steps List -->
    <div v-if="showSteps" class="steps-container">
      <div 
        v-for="(step, index) in steps" 
        :key="step.id"
        class="step-item"
        :class="{
          'step-completed': step.completed,
          'step-current': index === currentStep && !step.completed,
          'step-error': step.error
        }"
      >
        <div class="step-icon">
          <div v-if="step.completed" class="icon-check">✓</div>
          <div v-else-if="step.error" class="icon-error">✗</div>
          <div v-else-if="index === currentStep" class="icon-loading">
            <div class="spinner-small"></div>
          </div>
          <div v-else class="icon-pending">{{ index + 1 }}</div>
        </div>
        <div class="step-content">
          <div class="step-name">{{ step.name }}</div>
          <div class="step-weight">Weight: {{ step.weight }}</div>
        </div>
      </div>
    </div>

    <!-- Current Step Info -->
    <div v-if="currentStepName" class="current-step">
      <div class="current-step-text">
        {{ currentStepName }}
      </div>
    </div>

    <!-- Completion Message -->
    <div v-if="isComplete" class="completion-message">
      <div class="completion-icon">🎉</div>
      <div class="completion-text">Loading Complete!</div>
    </div>

    <!-- Error Message -->
    <div v-if="isError" class="error-message">
      <div class="error-icon">⚠️</div>
      <div class="error-text">Loading failed. Please try again.</div>
    </div>
  </div>
</template>

<style scoped>
.progressive-loader {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

/* Progress Bar */
.progress-container {
  margin-bottom: 24px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-complete {
  background: linear-gradient(90deg, #10b981, #059669);
}

.progress-error {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

.progress-text {
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

/* Steps List */
.steps-container {
  margin-bottom: 20px;
}

.step-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.step-item:last-child {
  border-bottom: none;
}

.step-completed {
  opacity: 0.7;
}

.step-current {
  background: #f0f9ff;
  border-radius: 8px;
  padding: 12px;
  margin: 0 -12px;
}

.step-error {
  background: #fef2f2;
  border-radius: 8px;
  padding: 12px;
  margin: 0 -12px;
}

.step-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 14px;
  font-weight: 600;
}

.step-completed .step-icon {
  background: #10b981;
  color: white;
}

.step-error .step-icon {
  background: #ef4444;
  color: white;
}

.step-current .step-icon {
  background: #3b82f6;
  color: white;
}

.step-item:not(.step-completed):not(.step-error):not(.step-current) .step-icon {
  background: #e5e7eb;
  color: #6b7280;
}

.icon-check {
  font-size: 16px;
}

.icon-error {
  font-size: 16px;
}

.icon-loading {
  width: 20px;
  height: 20px;
}

.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.icon-pending {
  font-size: 12px;
}

.step-content {
  flex: 1;
}

.step-name {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 2px;
}

.step-weight {
  font-size: 12px;
  color: #6b7280;
}

/* Current Step */
.current-step {
  text-align: center;
  margin-bottom: 16px;
}

.current-step-text {
  font-size: 16px;
  font-weight: 600;
  color: #3b82f6;
}

/* Completion Message */
.completion-message {
  text-align: center;
  padding: 20px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  margin-top: 16px;
}

.completion-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.completion-text {
  font-size: 16px;
  font-weight: 600;
  color: #059669;
}

/* Error Message */
.error-message {
  text-align: center;
  padding: 20px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  margin-top: 16px;
}

.error-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.error-text {
  font-size: 16px;
  font-weight: 600;
  color: #dc2626;
}

/* Animations */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .progress-bar {
    background: #374151;
  }
  
  .progress-text {
    color: #d1d5db;
  }
  
  .step-item {
    border-bottom-color: #374151;
  }
  
  .step-current {
    background: #1e3a8a;
  }
  
  .step-error {
    background: #7f1d1d;
  }
  
  .step-item:not(.step-completed):not(.step-error):not(.step-current) .step-icon {
    background: #374151;
    color: #9ca3af;
  }
  
  .step-name {
    color: #d1d5db;
  }
  
  .step-weight {
    color: #9ca3af;
  }
  
  .current-step-text {
    color: #60a5fa;
  }
  
  .completion-message {
    background: #064e3b;
    border-color: #065f46;
  }
  
  .completion-text {
    color: #34d399;
  }
  
  .error-message {
    background: #7f1d1d;
    border-color: #991b1b;
  }
  
  .error-text {
    color: #f87171;
  }
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .progress-fill {
    transition: none;
  }
  
  .spinner-small {
    animation: none;
  }
}
</style>
