<template>
  <div class="mobile-fab-container" :class="containerClasses">
    <!-- Main FAB Button -->
    <button
      class="mobile-fab-main"
      :class="mainClasses"
      :style="mainStyle"
      @click="toggleMenu"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
      :aria-expanded="isOpen"
      :aria-label="label"
      :disabled="disabled"
    >
      <Transition name="mobile-fab-rotate" mode="out-in">
        <Icon 
          :name="isOpen ? closeIcon : icon" 
          class="mobile-fab-icon"
          :class="{ 'mobile-fab-icon-rotated': isOpen }"
        />
      </Transition>
      
      <!-- Ripple Effect -->
      <div v-if="showRipple" class="mobile-fab-ripple" :class="{ 'mobile-fab-ripple-active': isRippling }"></div>
    </button>

    <!-- Speed Dial Menu -->
    <Transition name="mobile-fab-menu">
      <div v-if="isOpen && items.length > 0" class="mobile-fab-menu" :class="menuClasses">
        <!-- Backdrop -->
        <div class="mobile-fab-backdrop" @click="closeMenu"></div>
        
        <!-- Menu Items -->
        <div class="mobile-fab-items" :class="itemsClasses">
          <button
            v-for="(item, index) in items"
            :key="item.id || index"
            class="mobile-fab-item"
            :class="getItemClasses(index)"
            :style="getItemStyle(index)"
            @click="handleItemClick(item, index)"
            :disabled="item.disabled"
            :aria-label="item.label"
          >
            <div class="mobile-fab-item-content">
              <Icon v-if="item.icon" :name="item.icon" class="mobile-fab-item-icon" />
              <span v-if="showLabels" class="mobile-fab-item-label">{{ item.label }}</span>
            </div>
            
            <!-- Item Badge -->
            <div v-if="item.badge" class="mobile-fab-item-badge">{{ item.badge }}</div>
          </button>
        </div>
      </div>
    </Transition>

    <!-- Tooltip -->
    <Transition name="mobile-fab-tooltip">
      <div v-if="showTooltip && !isOpen" class="mobile-fab-tooltip" :class="tooltipClasses">
        {{ tooltipText }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Props
const props = defineProps({
  // Main button
  icon: {
    type: String,
    default: 'lucide:plus'
  },
  closeIcon: {
    type: String,
    default: 'lucide:x'
  },
  label: {
    type: String,
    default: 'Open menu'
  },
  
  // Menu items
  items: {
    type: Array as () => Array<{
      id?: string
      label: string
      icon?: string
      badge?: string | number
      disabled?: boolean
      color?: string
    }>,
    default: () => []
  },
  
  // Position
  position: {
    type: String,
    default: 'bottom-right',
    validator: (value: string) => [
      'bottom-right', 'bottom-left', 'top-right', 'top-left',
      'center-right', 'center-left', 'center-top', 'center-bottom'
    ].includes(value)
  },
  
  // Size
  size: {
    type: String,
    default: 'md',
    validator: (value: string) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  
  // Colors
  color: {
    type: String,
    default: 'primary',
    validator: (value: string) => ['primary', 'secondary', 'success', 'warning', 'error', 'info'].includes(value)
  },
  
  // Behavior
  direction: {
    type: String,
    default: 'up',
    validator: (value: string) => ['up', 'down', 'left', 'right', 'center'].includes(value)
  },
  
  // Features
  showLabels: {
    type: Boolean,
    default: true
  },
  showTooltip: {
    type: Boolean,
    default: false
  },
  tooltipText: {
    type: String,
    default: ''
  },
  showRipple: {
    type: Boolean,
    default: true
  },
  
  // State
  disabled: {
    type: Boolean,
    default: false
  },
  persistent: {
    type: Boolean,
    default: false
  },
  
  // Animation
  animation: {
    type: String,
    default: 'scale',
    validator: (value: string) => ['scale', 'slide', 'fade', 'bounce'].includes(value)
  },
  
  // Haptic feedback
  haptic: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits<{
  'update:open': [value: boolean]
  'item-click': [item: any, index: number]
  'main-click': []
}>()

// Refs
const isOpen = ref(false)
const isRippling = ref(false)
const touchStartTime = ref(0)

// Computed
const containerClasses = computed(() => [
  `mobile-fab-${props.position}`,
  `mobile-fab-${props.size}`,
  `mobile-fab-${props.color}`,
  {
    'mobile-fab-open': isOpen.value,
    'mobile-fab-disabled': props.disabled,
    'mobile-fab-persistent': props.persistent
  }
])

const mainClasses = computed(() => [
  `mobile-fab-main-${props.size}`,
  `mobile-fab-main-${props.color}`,
  {
    'mobile-fab-main-open': isOpen.value,
    'mobile-fab-main-disabled': props.disabled
  }
])

const menuClasses = computed(() => [
  `mobile-fab-menu-${props.direction}`,
  `mobile-fab-menu-${props.animation}`
])

const itemsClasses = computed(() => [
  `mobile-fab-items-${props.direction}`,
  {
    'mobile-fab-items-with-labels': props.showLabels
  }
])

const tooltipClasses = computed(() => [
  `mobile-fab-tooltip-${props.position}`
])

const mainStyle = computed(() => {
  const style: Record<string, string> = {}
  
  if (props.persistent && isOpen.value) {
    style.transform = 'scale(1.1)'
  }
  
  return style
})

// Methods
const toggleMenu = () => {
  if (props.disabled) return
  
  isOpen.value = !isOpen.value
  emit('update:open', isOpen.value)
  emit('main-click')
  
  if (props.haptic) {
    triggerHapticFeedback()
  }
}

const closeMenu = () => {
  if (props.persistent) return
  
  isOpen.value = false
  emit('update:open', isOpen.value)
}

const handleItemClick = (item: any, index: number) => {
  if (item.disabled) return
  
  emit('item-click', item, index)
  
  if (!props.persistent) {
    closeMenu()
  }
  
  if (props.haptic) {
    triggerHapticFeedback('light')
  }
}

const handleTouchStart = () => {
  touchStartTime.value = Date.now()
}

const handleTouchEnd = () => {
  const touchDuration = Date.now() - touchStartTime.value
  
  if (touchDuration < 200 && props.showRipple) {
    showRippleEffect()
  }
}

const showRippleEffect = () => {
  isRippling.value = true
  
  setTimeout(() => {
    isRippling.value = false
  }, 600)
}

const triggerHapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'medium') => {
  if ('vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30]
    }
    
    navigator.vibrate(patterns[type])
  }
}

const getItemClasses = (index: number) => {
  const classes = []
  
  if (props.items[index]?.disabled) {
    classes.push('mobile-fab-item-disabled')
  }
  
  if (props.items[index]?.color) {
    classes.push(`mobile-fab-item-${props.items[index].color}`)
  }
  
  return classes
}

const getItemStyle = (index: number) => {
  const style: Record<string, string> = {}
  
  // Stagger animation delay
  if (props.animation === 'scale' || props.animation === 'slide') {
    style.animationDelay = `${index * 0.05}s`
  }
  
  return style
}

// Keyboard handling
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value) {
    closeMenu()
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* Mobile FAB Base Styles */
.mobile-fab-container {
  position: fixed;
  z-index: 1000;
  pointer-events: none;
}

.mobile-fab-main {
  position: relative;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: var(--mobile-transition);
  pointer-events: auto;
  overflow: hidden;
}

.mobile-fab-main:focus {
  outline: 2px solid var(--mobile-primary);
  outline-offset: 2px;
}

.mobile-fab-main:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.mobile-fab-icon {
  transition: var(--mobile-transition);
  z-index: 2;
}

.mobile-fab-icon-rotated {
  transform: rotate(45deg);
}

/* FAB Sizes */
.mobile-fab-main-sm {
  width: 40px;
  height: 40px;
}

.mobile-fab-main-sm .mobile-fab-icon {
  width: 18px;
  height: 18px;
}

.mobile-fab-main-md {
  width: 56px;
  height: 56px;
}

.mobile-fab-main-md .mobile-fab-icon {
  width: 24px;
  height: 24px;
}

.mobile-fab-main-lg {
  width: 72px;
  height: 72px;
}

.mobile-fab-main-lg .mobile-fab-icon {
  width: 32px;
  height: 32px;
}

.mobile-fab-main-xl {
  width: 88px;
  height: 88px;
}

.mobile-fab-main-xl .mobile-fab-icon {
  width: 40px;
  height: 40px;
}

/* FAB Colors */
.mobile-fab-main-primary {
  background: var(--mobile-primary);
  color: white;
}

.mobile-fab-main-secondary {
  background: var(--mobile-secondary);
  color: white;
}

.mobile-fab-main-success {
  background: var(--mobile-success);
  color: white;
}

.mobile-fab-main-warning {
  background: var(--mobile-warning);
  color: white;
}

.mobile-fab-main-error {
  background: var(--mobile-error);
  color: white;
}

.mobile-fab-main-info {
  background: var(--mobile-info);
  color: white;
}

/* FAB Positions */
.mobile-fab-bottom-right {
  bottom: var(--mobile-xl);
  right: var(--mobile-xl);
}

.mobile-fab-bottom-left {
  bottom: var(--mobile-xl);
  left: var(--mobile-xl);
}

.mobile-fab-top-right {
  top: var(--mobile-xl);
  right: var(--mobile-xl);
}

.mobile-fab-top-left {
  top: var(--mobile-xl);
  left: var(--mobile-xl);
}

.mobile-fab-center-right {
  top: 50%;
  right: var(--mobile-xl);
  transform: translateY(-50%);
}

.mobile-fab-center-left {
  top: 50%;
  left: var(--mobile-xl);
  transform: translateY(-50%);
}

.mobile-fab-center-top {
  top: var(--mobile-xl);
  left: 50%;
  transform: translateX(-50%);
}

.mobile-fab-center-bottom {
  bottom: var(--mobile-xl);
  left: 50%;
  transform: translateX(-50%);
}

/* Ripple Effect */
.mobile-fab-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.mobile-fab-ripple-active {
  animation: mobile-fab-ripple 0.6s ease-out;
}

@keyframes mobile-fab-ripple {
  0% {
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    width: 200%;
    height: 200%;
    opacity: 0;
  }
}

/* Speed Dial Menu */
.mobile-fab-menu {
  position: absolute;
  pointer-events: auto;
}

.mobile-fab-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
}

.mobile-fab-items {
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: var(--mobile-md);
}

/* Menu Directions */
.mobile-fab-items-up {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: var(--mobile-lg);
}

.mobile-fab-items-down {
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: var(--mobile-lg);
}

.mobile-fab-items-left {
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-right: var(--mobile-lg);
  flex-direction: row-reverse;
}

.mobile-fab-items-right {
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: var(--mobile-lg);
  flex-direction: row;
}

.mobile-fab-items-center {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  flex-direction: column;
  gap: var(--mobile-lg);
}

/* Menu Items */
.mobile-fab-item {
  position: relative;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface);
  color: var(--text-primary);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  transition: var(--mobile-transition);
  min-width: 48px;
  min-height: 48px;
}

.mobile-fab-item:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.mobile-fab-item:focus {
  outline: 2px solid var(--mobile-primary);
  outline-offset: 2px;
}

.mobile-fab-item:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.mobile-fab-item-content {
  display: flex;
  align-items: center;
  gap: var(--mobile-sm);
  padding: var(--mobile-sm);
}

.mobile-fab-item-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.mobile-fab-item-label {
  font-size: var(--mobile-text-sm);
  font-weight: 500;
  white-space: nowrap;
  padding-right: var(--mobile-sm);
}

.mobile-fab-item-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: var(--mobile-error);
  color: white;
  font-size: var(--mobile-text-xs);
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Item Colors */
.mobile-fab-item-primary {
  background: var(--mobile-primary);
  color: white;
}

.mobile-fab-item-secondary {
  background: var(--mobile-secondary);
  color: white;
}

.mobile-fab-item-success {
  background: var(--mobile-success);
  color: white;
}

.mobile-fab-item-warning {
  background: var(--mobile-warning);
  color: white;
}

.mobile-fab-item-error {
  background: var(--mobile-error);
  color: white;
}

.mobile-fab-item-info {
  background: var(--mobile-info);
  color: white;
}

/* Tooltip */
.mobile-fab-tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: var(--mobile-sm) var(--mobile-md);
  border-radius: 8px;
  font-size: var(--mobile-text-sm);
  white-space: nowrap;
  pointer-events: none;
  z-index: 1001;
}

.mobile-fab-tooltip-bottom-right {
  bottom: 100%;
  right: 0;
  margin-bottom: var(--mobile-md);
}

.mobile-fab-tooltip-bottom-left {
  bottom: 100%;
  left: 0;
  margin-bottom: var(--mobile-md);
}

.mobile-fab-tooltip-top-right {
  top: 100%;
  right: 0;
  margin-top: var(--mobile-md);
}

.mobile-fab-tooltip-top-left {
  top: 100%;
  left: 0;
  margin-top: var(--mobile-md);
}

/* Animations */
.mobile-fab-rotate-enter-active,
.mobile-fab-rotate-leave-active {
  transition: transform 0.3s ease;
}

.mobile-fab-rotate-enter-from,
.mobile-fab-rotate-leave-to {
  transform: rotate(180deg);
}

.mobile-fab-menu-enter-active,
.mobile-fab-menu-leave-active {
  transition: all 0.3s ease;
}

.mobile-fab-menu-enter-from,
.mobile-fab-menu-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.mobile-fab-tooltip-enter-active,
.mobile-fab-tooltip-leave-active {
  transition: all 0.2s ease;
}

.mobile-fab-tooltip-enter-from,
.mobile-fab-tooltip-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

/* Menu Animation Variants */
.mobile-fab-menu-scale .mobile-fab-item {
  animation: mobile-fab-item-scale 0.3s ease forwards;
  opacity: 0;
  transform: scale(0);
}

@keyframes mobile-fab-item-scale {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.mobile-fab-menu-slide .mobile-fab-item {
  animation: mobile-fab-item-slide 0.3s ease forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes mobile-fab-item-slide {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mobile-fab-menu-fade .mobile-fab-item {
  animation: mobile-fab-item-fade 0.3s ease forwards;
  opacity: 0;
}

@keyframes mobile-fab-item-fade {
  to {
    opacity: 1;
  }
}

.mobile-fab-menu-bounce .mobile-fab-item {
  animation: mobile-fab-item-bounce 0.5s ease forwards;
  opacity: 0;
  transform: scale(0);
}

@keyframes mobile-fab-item-bounce {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Dark Mode Adjustments */
.dark .mobile-fab-item {
  background: var(--surface);
  color: var(--text-primary);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.dark .mobile-fab-tooltip {
  background: rgba(255, 255, 255, 0.9);
  color: var(--text-primary);
}

/* Responsive Adjustments */
@media (max-width: 480px) {
  .mobile-fab-main-md {
    width: 48px;
    height: 48px;
  }
  
  .mobile-fab-main-md .mobile-fab-icon {
    width: 20px;
    height: 20px;
  }
  
  .mobile-fab-item {
    min-width: 44px;
    min-height: 44px;
  }
  
  .mobile-fab-item-icon {
    width: 18px;
    height: 18px;
  }
  
  .mobile-fab-bottom-right,
  .mobile-fab-bottom-left {
    bottom: var(--mobile-lg);
  }
  
  .mobile-fab-top-right,
  .mobile-fab-top-left {
    top: var(--mobile-lg);
  }
}

/* Performance Optimizations */
.mobile-fab-main,
.mobile-fab-item,
.mobile-fab-ripple {
  will-change: transform, opacity;
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  .mobile-fab-main,
  .mobile-fab-item,
  .mobile-fab-icon {
    transition: none;
  }
  
  .mobile-fab-ripple-active {
    animation: none;
  }
  
  .mobile-fab-menu-scale .mobile-fab-item,
  .mobile-fab-menu-slide .mobile-fab-item,
  .mobile-fab-menu-fade .mobile-fab-item,
  .mobile-fab-menu-bounce .mobile-fab-item {
    animation: none;
    opacity: 1;
    transform: none;
  }
}

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  .mobile-fab-main {
    border: 2px solid var(--mobile-primary);
  }
  
  .mobile-fab-item {
    border: 1px solid var(--border);
  }
  
  .mobile-fab-tooltip {
    border: 1px solid var(--border);
  }
}
</style>

