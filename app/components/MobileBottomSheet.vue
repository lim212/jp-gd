<template>
  <Teleport to="body">
    <Transition
      enter-active-class="mobile-bottom-sheet-enter"
      leave-active-class="mobile-bottom-sheet-leave"
    >
      <div
        v-if="visible"
        class="mobile-bottom-sheet-overlay"
        @click="handleOverlayClick"
      >
        <div
          class="mobile-bottom-sheet"
          :class="[
            `mobile-bottom-sheet-${size}`,
            { 'mobile-bottom-sheet-fullscreen': fullscreen }
          ]"
          @click.stop
        >
          <!-- Handle -->
          <div class="mobile-bottom-sheet-handle" @click="close"></div>

          <!-- Header -->
          <div v-if="title || $slots.header" class="mobile-bottom-sheet-header">
            <slot name="header">
              <div class="mobile-bottom-sheet-header-content">
                <h3 v-if="title" class="mobile-bottom-sheet-title">{{ title }}</h3>
                <p v-if="subtitle" class="mobile-bottom-sheet-subtitle">{{ subtitle }}</p>
              </div>
              <button
                v-if="closable"
                class="mobile-bottom-sheet-close"
                @click="close"
                aria-label="Close"
              >
                <UIcon name="i-lucide-x" class="mobile-bottom-sheet-close-icon" />
              </button>
            </slot>
          </div>

          <!-- Content -->
          <div class="mobile-bottom-sheet-content">
            <slot>
              <div v-if="message" class="mobile-bottom-sheet-message">{{ message }}</div>
            </slot>
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer || actions" class="mobile-bottom-sheet-footer">
            <slot name="footer">
              <div v-if="actions" class="mobile-bottom-sheet-actions">
                <button
                  v-for="(action, index) in actions"
                  :key="index"
                  class="mobile-bottom-sheet-action"
                  :class="`mobile-bottom-sheet-action-${action.variant || 'primary'}`"
                  @click="handleAction(action, index)"
                >
                  <UIcon v-if="action.icon" :name="action.icon" class="mobile-bottom-sheet-action-icon" />
                  <span>{{ action.label }}</span>
                </button>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

// Props
interface BottomSheetAction {
  label: string
  icon?: string
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  handler?: () => void
}

const props = defineProps({
  // Content
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  
  // Behavior
  closable: {
    type: Boolean,
    default: true
  },
  closeOnOverlay: {
    type: Boolean,
    default: true
  },
  fullscreen: {
    type: Boolean,
    default: false
  },
  
  // Size
  size: {
    type: String,
    default: 'medium',
    validator: (value: string) => ['small', 'medium', 'large'].includes(value)
  },
  
  // Actions
  actions: {
    type: Array as () => BottomSheetAction[],
    default: () => []
  }
})

// Emits
const emit = defineEmits<{
  close: []
  action: [action: BottomSheetAction, index: number]
}>()

// State
const visible = ref(false)

// Methods
const close = () => {
  visible.value = false
  emit('close')
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    close()
  }
}

const handleAction = (action: BottomSheetAction, index: number) => {
  if (action.handler) {
    action.handler()
  }
  emit('action', action, index)
  close()
}

// Keyboard handling
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && visible.value) {
    close()
  }
}

// Lifecycle
onMounted(() => {
  visible.value = true
  document.addEventListener('keydown', handleKeydown)
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})

// Watch for visibility changes
watch(visible, (newValue) => {
  if (!newValue) {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
/* Mobile Bottom Sheet Base Styles */
.mobile-bottom-sheet-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1001;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.mobile-bottom-sheet {
  background: var(--surface);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid var(--border);
  width: 100%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  backdrop-filter: blur(20px);
}

.mobile-bottom-sheet-fullscreen {
  max-height: 100vh;
  border-radius: 0;
}

/* Bottom Sheet Sizes */
.mobile-bottom-sheet-small {
  max-height: 40vh;
}

.mobile-bottom-sheet-medium {
  max-height: 60vh;
}

.mobile-bottom-sheet-large {
  max-height: 80vh;
}

/* Handle */
.mobile-bottom-sheet-handle {
  width: 40px;
  height: 4px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  margin: var(--mobile-md) auto;
  cursor: pointer;
  transition: var(--mobile-transition);
}

.mobile-bottom-sheet-handle:hover {
  background: rgba(0, 0, 0, 0.3);
}

.dark .mobile-bottom-sheet-handle {
  background: rgba(255, 255, 255, 0.2);
}

.dark .mobile-bottom-sheet-handle:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Header */
.mobile-bottom-sheet-header {
  padding: 0 var(--mobile-lg) var(--mobile-lg);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--mobile-md);
}

.mobile-bottom-sheet-header-content {
  flex: 1;
  min-width: 0;
}

.mobile-bottom-sheet-title {
  font-size: var(--mobile-text-xl);
  font-weight: 700;
  color: var(--heading);
  margin: 0 0 var(--mobile-xs) 0;
  line-height: 1.3;
}

.mobile-bottom-sheet-subtitle {
  font-size: var(--mobile-text-sm);
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.4;
}

.mobile-bottom-sheet-close {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--mobile-transition);
}

.mobile-bottom-sheet-close:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--text);
}

.mobile-bottom-sheet-close-icon {
  width: 20px;
  height: 20px;
}

/* Content */
.mobile-bottom-sheet-content {
  flex: 1;
  padding: var(--mobile-lg);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.mobile-bottom-sheet-message {
  font-size: var(--mobile-text-base);
  color: var(--text);
  line-height: 1.6;
  margin: 0;
}

/* Footer */
.mobile-bottom-sheet-footer {
  padding: var(--mobile-lg);
  border-top: 1px solid var(--border);
  background: var(--surface);
}

.mobile-bottom-sheet-actions {
  display: flex;
  gap: var(--mobile-md);
  flex-wrap: wrap;
}

.mobile-bottom-sheet-action {
  flex: 1;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--mobile-sm);
  padding: var(--mobile-md) var(--mobile-lg);
  border-radius: 12px;
  border: none;
  font-size: var(--mobile-text-base);
  font-weight: 600;
  cursor: pointer;
  transition: var(--mobile-transition);
  min-height: var(--touch-target);
}

.mobile-bottom-sheet-action-primary {
  background: var(--mobile-primary);
  color: white;
}

.mobile-bottom-sheet-action-primary:hover {
  background: var(--mobile-primary-hover);
  transform: translateY(-1px);
}

.mobile-bottom-sheet-action-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text);
  border: 1px solid var(--border);
}

.mobile-bottom-sheet-action-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

.mobile-bottom-sheet-action-danger {
  background: var(--mobile-error);
  color: white;
}

.mobile-bottom-sheet-action-danger:hover {
  background: #0ea5e9;
}

.mobile-bottom-sheet-action-success {
  background: var(--mobile-success);
  color: white;
}

.mobile-bottom-sheet-action-success:hover {
  background: #16a34a;
}

.mobile-bottom-sheet-action-icon {
  width: 20px;
  height: 20px;
}

/* Animation Classes */
.mobile-bottom-sheet-enter-active {
  transition: all 0.3s var(--mobile-smooth);
}

.mobile-bottom-sheet-leave-active {
  transition: all 0.3s var(--mobile-smooth);
}

.mobile-bottom-sheet-enter-from .mobile-bottom-sheet-overlay {
  opacity: 0;
}

.mobile-bottom-sheet-leave-to .mobile-bottom-sheet-overlay {
  opacity: 0;
}

.mobile-bottom-sheet-enter-from .mobile-bottom-sheet {
  transform: translateY(100%);
}

.mobile-bottom-sheet-leave-to .mobile-bottom-sheet {
  transform: translateY(100%);
}

/* Dark Mode Adjustments */
.dark .mobile-bottom-sheet {
  background: var(--surface);
  border-color: var(--border);
}

.dark .mobile-bottom-sheet-close:hover {
  background: rgba(255, 255, 255, 0.05);
}

/* Responsive Adjustments */
@media (min-width: 768px) {
  .mobile-bottom-sheet {
    max-width: 500px;
    margin: 0 auto;
  }
  
  .mobile-bottom-sheet-actions {
    flex-wrap: nowrap;
  }
}

@media (min-width: 1024px) {
  .mobile-bottom-sheet {
    max-width: 600px;
  }
}

/* Performance Optimizations */
.mobile-bottom-sheet {
  will-change: transform;
}

.mobile-bottom-sheet-overlay {
  will-change: opacity;
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  .mobile-bottom-sheet-enter-active,
  .mobile-bottom-sheet-leave-active {
    transition: opacity 0.2s ease;
  }
  
  .mobile-bottom-sheet-enter-from .mobile-bottom-sheet,
  .mobile-bottom-sheet-leave-to .mobile-bottom-sheet {
    transform: none;
  }
}

/* Focus Styles for Accessibility */
.mobile-bottom-sheet-close:focus-visible,
.mobile-bottom-sheet-action:focus-visible {
  outline: 2px solid var(--mobile-primary);
  outline-offset: 2px;
}

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  .mobile-bottom-sheet {
    border-width: 2px;
  }
  
  .mobile-bottom-sheet-header,
  .mobile-bottom-sheet-footer {
    border-width: 2px;
  }
}
</style>

