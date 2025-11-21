<template>
  <Teleport to="body">
    <Transition
      enter-active-class="mobile-toast-enter"
      leave-active-class="mobile-toast-leave"
    >
      <div
        v-if="visible"
        class="mobile-toast"
        :class="[
          `mobile-toast-${type}`,
          { 'mobile-toast-closable': closable }
        ]"
        role="alert"
        :aria-live="type === 'error' ? 'assertive' : 'polite'"
      >
        <!-- Toast Icon -->
        <div class="mobile-toast-icon">
          <UIcon :name="toastIcon" class="mobile-toast-icon-svg" />
        </div>

        <!-- Toast Content -->
        <div class="mobile-toast-content">
          <div v-if="title" class="mobile-toast-title">{{ title }}</div>
          <div v-if="message" class="mobile-toast-message">{{ message }}</div>
          
          <!-- Toast Actions -->
          <div v-if="actions && actions.length" class="mobile-toast-actions">
            <button
              v-for="(action, index) in actions"
              :key="index"
              class="mobile-toast-action"
              @click="handleAction(action, index)"
            >
              {{ action.label }}
            </button>
          </div>
        </div>

        <!-- Close Button -->
        <button
          v-if="closable"
          class="mobile-toast-close"
          @click="close"
          aria-label="Close notification"
        >
          <UIcon name="i-lucide-x" class="mobile-toast-close-icon" />
        </button>

        <!-- Progress Bar -->
        <div v-if="autoClose && duration" class="mobile-toast-progress">
          <div
            class="mobile-toast-progress-bar"
            :style="{ animationDuration: `${duration}ms` }"
          ></div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

// Props
interface ToastAction {
  label: string
  handler?: () => void
}

const props = defineProps({
  // Content
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  
  // Type
  type: {
    type: String,
    default: 'info',
    validator: (value: string) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  
  // Behavior
  duration: {
    type: Number,
    default: 5000
  },
  autoClose: {
    type: Boolean,
    default: true
  },
  closable: {
    type: Boolean,
    default: true
  },
  
  // Actions
  actions: {
    type: Array as () => ToastAction[],
    default: () => []
  },
  
  // Position
  position: {
    type: String,
    default: 'top-right',
    validator: (value: string) => [
      'top-left', 'top-center', 'top-right',
      'bottom-left', 'bottom-center', 'bottom-right'
    ].includes(value)
  }
})

// Emits
const emit = defineEmits<{
  close: []
  action: [action: ToastAction, index: number]
}>()

// State
const visible = ref(false)
const autoCloseTimer = ref<NodeJS.Timeout | null>(null)

// Computed
const toastIcon = computed(() => {
  const icons = {
    success: 'i-lucide-check-circle',
    error: 'i-lucide-x-circle',
    warning: 'i-lucide-alert-triangle',
    info: 'i-lucide-info'
  }
  return icons[props.type as keyof typeof icons] || icons.info
})

// Methods
const close = () => {
  visible.value = false
  clearAutoCloseTimer()
  emit('close')
}

const handleAction = (action: ToastAction, index: number) => {
  if (action.handler) {
    action.handler()
  }
  emit('action', action, index)
  close()
}

const clearAutoCloseTimer = () => {
  if (autoCloseTimer.value) {
    clearTimeout(autoCloseTimer.value)
    autoCloseTimer.value = null
  }
}

const startAutoClose = () => {
  if (props.autoClose && props.duration > 0) {
    clearAutoCloseTimer()
    autoCloseTimer.value = setTimeout(() => {
      close()
    }, props.duration)
  }
}

// Lifecycle
onMounted(() => {
  visible.value = true
  startAutoClose()
})

onUnmounted(() => {
  clearAutoCloseTimer()
})

// Watch for duration changes
watch(() => props.duration, () => {
  if (visible.value) {
    startAutoClose()
  }
})
</script>

<style scoped>
/* Mobile Toast Base Styles */
.mobile-toast {
  position: fixed;
  z-index: 2000;
  max-width: 400px;
  width: calc(100vw - 32px);
  background: var(--surface);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid var(--border);
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  gap: var(--mobile-md);
  padding: var(--mobile-lg);
  backdrop-filter: blur(20px);
}

/* Toast Positions */
.mobile-toast[data-position="top-left"] {
  top: var(--mobile-xl);
  left: var(--mobile-lg);
}

.mobile-toast[data-position="top-center"] {
  top: var(--mobile-xl);
  left: 50%;
  transform: translateX(-50%);
}

.mobile-toast[data-position="top-right"] {
  top: var(--mobile-xl);
  right: var(--mobile-lg);
}

.mobile-toast[data-position="bottom-left"] {
  bottom: var(--mobile-xl);
  left: var(--mobile-lg);
}

.mobile-toast[data-position="bottom-center"] {
  bottom: var(--mobile-xl);
  left: 50%;
  transform: translateX(-50%);
}

.mobile-toast[data-position="bottom-right"] {
  bottom: var(--mobile-xl);
  right: var(--mobile-lg);
}

/* Toast Types */
.mobile-toast-success {
  border-left: 4px solid var(--mobile-success);
}

.mobile-toast-error {
  border-left: 4px solid var(--mobile-error);
}

.mobile-toast-warning {
  border-left: 4px solid var(--mobile-warning);
}

.mobile-toast-info {
  border-left: 4px solid var(--mobile-accent);
}

/* Toast Icon */
.mobile-toast-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-top: 2px;
}

.mobile-toast-success .mobile-toast-icon {
  background: rgba(34, 197, 94, 0.1);
  color: var(--mobile-success);
}

.mobile-toast-error .mobile-toast-icon {
  background: rgba(239, 68, 68, 0.1);
  color: var(--mobile-error);
}

.mobile-toast-warning .mobile-toast-icon {
  background: rgba(245, 158, 11, 0.1);
  color: var(--mobile-warning);
}

.mobile-toast-info .mobile-toast-icon {
  background: rgba(88, 166, 255, 0.1);
  color: var(--mobile-accent);
}

.mobile-toast-icon-svg {
  width: 16px;
  height: 16px;
}

/* Toast Content */
.mobile-toast-content {
  flex: 1;
  min-width: 0;
}

.mobile-toast-title {
  font-size: var(--mobile-text-base);
  font-weight: 600;
  color: var(--heading);
  margin-bottom: var(--mobile-xs);
  line-height: 1.3;
}

.mobile-toast-message {
  font-size: var(--mobile-text-sm);
  color: var(--text);
  line-height: 1.5;
  margin-bottom: var(--mobile-sm);
}

.mobile-toast-actions {
  display: flex;
  gap: var(--mobile-sm);
  flex-wrap: wrap;
}

.mobile-toast-action {
  padding: var(--mobile-xs) var(--mobile-sm);
  border-radius: 6px;
  border: none;
  background: rgba(255, 122, 0, 0.1);
  color: var(--mobile-primary);
  font-size: var(--mobile-text-sm);
  font-weight: 600;
  cursor: pointer;
  transition: var(--mobile-transition);
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-toast-action:hover {
  background: rgba(255, 122, 0, 0.2);
  transform: translateY(-1px);
}

.mobile-toast-action:active {
  transform: translateY(0);
}

/* Close Button */
.mobile-toast-close {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--mobile-transition);
  margin-top: 2px;
}

.mobile-toast-close:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--text);
}

.mobile-toast-close-icon {
  width: 16px;
  height: 16px;
}

/* Progress Bar */
.mobile-toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.mobile-toast-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--mobile-primary), var(--mobile-secondary));
  animation: mobile-toast-progress linear;
}

@keyframes mobile-toast-progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

/* Animation Classes */
.mobile-toast-enter-active {
  transition: all 0.3s var(--mobile-smooth);
}

.mobile-toast-leave-active {
  transition: all 0.3s var(--mobile-smooth);
}

.mobile-toast-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.mobile-toast-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

/* Dark Mode Adjustments */
.dark .mobile-toast {
  background: var(--surface);
  border-color: var(--border);
}

.dark .mobile-toast-close:hover {
  background: rgba(255, 255, 255, 0.05);
}

.dark .mobile-toast-progress {
  background: rgba(255, 255, 255, 0.1);
}

/* Responsive Adjustments */
@media (max-width: 480px) {
  .mobile-toast {
    width: calc(100vw - 16px);
    margin: 0 var(--mobile-sm);
  }
  
  .mobile-toast-actions {
    flex-direction: column;
  }
  
  .mobile-toast-action {
    width: 100%;
  }
}

@media (min-width: 768px) {
  .mobile-toast {
    max-width: 500px;
  }
}

/* Performance Optimizations */
.mobile-toast {
  will-change: transform, opacity;
}

.mobile-toast-progress-bar {
  will-change: width;
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  .mobile-toast-enter-active,
  .mobile-toast-leave-active {
    transition: opacity 0.2s ease;
  }
  
  .mobile-toast-enter-from,
  .mobile-toast-leave-to {
    transform: none;
  }
  
  .mobile-toast-progress-bar {
    animation: none;
  }
}

/* Focus Styles for Accessibility */
.mobile-toast-close:focus-visible,
.mobile-toast-action:focus-visible {
  outline: 2px solid var(--mobile-primary);
  outline-offset: 2px;
}

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  .mobile-toast {
    border-width: 2px;
  }
  
  .mobile-toast-success {
    border-left-color: var(--mobile-success);
  }
  
  .mobile-toast-error {
    border-left-color: var(--mobile-error);
  }
  
  .mobile-toast-warning {
    border-left-color: var(--mobile-warning);
  }
  
  .mobile-toast-info {
    border-left-color: var(--mobile-accent);
  }
}
</style>

