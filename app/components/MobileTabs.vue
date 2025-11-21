<template>
  <div class="mobile-tabs-container" :class="containerClasses">
    <!-- Tab Headers -->
    <div class="mobile-tabs-header" :class="headerClasses">
      <div class="mobile-tabs-scroll" ref="tabsScroll">
        <div class="mobile-tabs-list" :style="tabsListStyle">
          <button
            v-for="(tab, index) in tabs"
            :key="tab.id || index"
            class="mobile-tab-button"
            :class="getTabClasses(index)"
            :style="getTabStyle(index)"
            @click="selectTab(index)"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
            :disabled="tab.disabled"
            :aria-selected="activeTab === index"
            :aria-controls="`tab-panel-${index}`"
            role="tab"
          >
            <div class="mobile-tab-content">
              <Icon 
                v-if="tab.icon" 
                :name="tab.icon" 
                class="mobile-tab-icon"
                :class="{ 'mobile-tab-icon-active': activeTab === index }"
              />
              <span class="mobile-tab-label">{{ tab.label }}</span>
              <div v-if="tab.badge" class="mobile-tab-badge">{{ tab.badge }}</div>
            </div>
            <div class="mobile-tab-indicator" :class="{ 'mobile-tab-indicator-active': activeTab === index }"></div>
          </button>
        </div>
      </div>
      
      <!-- Scroll Indicators -->
      <div v-if="showScrollIndicators" class="mobile-tabs-scroll-indicators">
        <button 
          v-if="canScrollLeft" 
          class="mobile-tabs-scroll-button mobile-tabs-scroll-left"
          @click="scrollLeft"
          aria-label="Scroll left"
        >
          <Icon name="lucide:chevron-left" />
        </button>
        <button 
          v-if="canScrollRight" 
          class="mobile-tabs-scroll-button mobile-tabs-scroll-right"
          @click="scrollRight"
          aria-label="Scroll right"
        >
          <Icon name="lucide:chevron-right" />
        </button>
      </div>
    </div>

    <!-- Tab Panels -->
    <div class="mobile-tabs-panels" :class="panelsClasses">
      <div
        v-for="(tab, index) in tabs"
        :key="tab.id || index"
        :id="`tab-panel-${index}`"
        class="mobile-tab-panel"
        :class="{ 'mobile-tab-panel-active': activeTab === index }"
        :aria-labelledby="`tab-${index}`"
        role="tabpanel"
        :aria-hidden="activeTab !== index"
      >
        <Transition
          :name="transitionName"
          mode="out-in"
          @before-enter="onBeforeEnter"
          @enter="onEnter"
          @leave="onLeave"
        >
          <div v-if="activeTab === index" class="mobile-tab-panel-content" :key="index">
            <slot :name="`tab-${index}`" :tab="tab" :index="index">
              <component v-if="tab.component" :is="tab.component" v-bind="tab.props" />
              <div v-else-if="tab.content" v-html="tab.content"></div>
              <div v-else class="mobile-tab-panel-empty">
                <Icon name="lucide:file-text" class="mobile-tab-panel-empty-icon" />
                <p class="mobile-tab-panel-empty-text">No content available</p>
              </div>
            </slot>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Floating Action Button (if enabled) -->
    <button
      v-if="showFAB"
      class="mobile-tabs-fab"
      :class="fabClasses"
      @click="onFabClick"
      :aria-label="fabLabel"
    >
      <Icon :name="fabIcon" class="mobile-tabs-fab-icon" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'

// Props
const props = defineProps({
  // Tabs data
  tabs: {
    type: Array as () => Array<{
      id?: string
      label: string
      icon?: string
      badge?: string | number
      disabled?: boolean
      component?: any
      props?: Record<string, any>
      content?: string
    }>,
    required: true
  },
  
  // Active tab
  modelValue: {
    type: Number,
    default: 0
  },
  
  // Variants
  variant: {
    type: String,
    default: 'default',
    validator: (value: string) => ['default', 'pills', 'underline', 'segmented'].includes(value)
  },
  
  // Size
  size: {
    type: String,
    default: 'md',
    validator: (value: string) => ['sm', 'md', 'lg'].includes(value)
  },
  
  // Layout
  layout: {
    type: String,
    default: 'horizontal',
    validator: (value: string) => ['horizontal', 'vertical'].includes(value)
  },
  
  // Behavior
  lazy: {
    type: Boolean,
    default: false
  },
  keepAlive: {
    type: Boolean,
    default: false
  },
  
  // Scrolling
  scrollable: {
    type: Boolean,
    default: true
  },
  showScrollIndicators: {
    type: Boolean,
    default: true
  },
  
  // Transitions
  transition: {
    type: String,
    default: 'slide',
    validator: (value: string) => ['slide', 'fade', 'scale', 'none'].includes(value)
  },
  
  // FAB
  showFAB: {
    type: Boolean,
    default: false
  },
  fabIcon: {
    type: String,
    default: 'lucide:plus'
  },
  fabLabel: {
    type: String,
    default: 'Add new tab'
  },
  fabPosition: {
    type: String,
    default: 'bottom-right',
    validator: (value: string) => ['bottom-right', 'bottom-left', 'top-right', 'top-left'].includes(value)
  },
  
  // Colors
  color: {
    type: String,
    default: 'primary',
    validator: (value: string) => ['primary', 'secondary', 'success', 'warning', 'error'].includes(value)
  }
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: number]
  'tab-change': [index: number, tab: any]
  'fab-click': []
}>()

// Refs
const tabsScroll = ref<HTMLElement>()
const activeTab = ref(props.modelValue)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)
const touchStartX = ref(0)
const touchStartY = ref(0)
const isDragging = ref(false)

// Computed
const containerClasses = computed(() => [
  `mobile-tabs-${props.variant}`,
  `mobile-tabs-${props.size}`,
  `mobile-tabs-${props.layout}`,
  `mobile-tabs-${props.color}`,
  {
    'mobile-tabs-scrollable': props.scrollable,
    'mobile-tabs-lazy': props.lazy,
    'mobile-tabs-keep-alive': props.keepAlive
  }
])

const headerClasses = computed(() => [
  `mobile-tabs-header-${props.variant}`,
  {
    'mobile-tabs-header-scrollable': props.scrollable
  }
])

const panelsClasses = computed(() => [
  `mobile-tabs-panels-${props.layout}`,
  {
    'mobile-tabs-panels-lazy': props.lazy
  }
])

const fabClasses = computed(() => [
  `mobile-tabs-fab-${props.fabPosition}`,
  `mobile-tabs-fab-${props.color}`
])

const transitionName = computed(() => {
  if (props.transition === 'none') return ''
  return `mobile-tab-${props.transition}`
})

const tabsListStyle = computed(() => {
  if (!props.scrollable) return {}
  
  return {
    display: 'flex',
    minWidth: 'max-content'
  }
})

// Methods
const selectTab = (index: number) => {
  if (props.tabs[index]?.disabled) return
  
  activeTab.value = index
  emit('update:modelValue', index)
  emit('tab-change', index, props.tabs[index])
  
  // Scroll to active tab
  if (props.scrollable) {
    scrollToActiveTab()
  }
}

const scrollToActiveTab = async () => {
  await nextTick()
  
  if (!tabsScroll.value) return
  
  const activeButton = tabsScroll.value.querySelector('.mobile-tab-button[aria-selected="true"]') as HTMLElement
  if (!activeButton) return
  
  const container = tabsScroll.value
  const containerRect = container.getBoundingClientRect()
  const buttonRect = activeButton.getBoundingClientRect()
  
  const scrollLeft = buttonRect.left - containerRect.left + container.scrollLeft - (containerRect.width / 2) + (buttonRect.width / 2)
  
  container.scrollTo({
    left: scrollLeft,
    behavior: 'smooth'
  })
}

const scrollLeft = () => {
  if (!tabsScroll.value) return
  
  tabsScroll.value.scrollBy({
    left: -200,
    behavior: 'smooth'
  })
}

const scrollRight = () => {
  if (!tabsScroll.value) return
  
  tabsScroll.value.scrollBy({
    left: 200,
    behavior: 'smooth'
  })
}

const updateScrollIndicators = () => {
  if (!tabsScroll.value) return
  
  const { scrollLeft, scrollWidth, clientWidth } = tabsScroll.value
  canScrollLeft.value = scrollLeft > 0
  canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 1
}

const getTabClasses = (index: number) => {
  const classes = []
  
  if (activeTab.value === index) {
    classes.push('mobile-tab-active')
  }
  
  if (props.tabs[index]?.disabled) {
    classes.push('mobile-tab-disabled')
  }
  
  return classes
}

const getTabStyle = (index: number) => {
  if (props.variant === 'segmented') {
    const width = 100 / props.tabs.length
    return {
      width: `${width}%`
    }
  }
  return {}
}

// Touch handling
const handleTouchStart = (event: TouchEvent) => {
  touchStartX.value = event.touches[0].clientX
  touchStartY.value = event.touches[0].clientY
  isDragging.value = false
}

const handleTouchMove = (event: TouchEvent) => {
  if (!isDragging.value) {
    const deltaX = Math.abs(event.touches[0].clientX - touchStartX.value)
    const deltaY = Math.abs(event.touches[0].clientY - touchStartY.value)
    
    if (deltaX > deltaY && deltaX > 10) {
      isDragging.value = true
    }
  }
}

const handleTouchEnd = () => {
  isDragging.value = false
}

// Transition hooks
const onBeforeEnter = (el: Element) => {
  if (props.transition === 'slide') {
    (el as HTMLElement).style.transform = 'translateX(100%)'
  } else if (props.transition === 'scale') {
    (el as HTMLElement).style.transform = 'scale(0.8)'
    (el as HTMLElement).style.opacity = '0'
  }
}

const onEnter = (el: Element) => {
  if (props.transition === 'slide') {
    (el as HTMLElement).style.transform = 'translateX(0)'
  } else if (props.transition === 'scale') {
    (el as HTMLElement).style.transform = 'scale(1)'
    (el as HTMLElement).style.opacity = '1'
  }
}

const onLeave = (el: Element) => {
  if (props.transition === 'slide') {
    (el as HTMLElement).style.transform = 'translateX(-100%)'
  } else if (props.transition === 'scale') {
    (el as HTMLElement).style.transform = 'scale(0.8)'
    (el as HTMLElement).style.opacity = '0'
  }
}

const onFabClick = () => {
  emit('fab-click')
}

// Lifecycle
onMounted(() => {
  if (props.scrollable && tabsScroll.value) {
    tabsScroll.value.addEventListener('scroll', updateScrollIndicators)
    updateScrollIndicators()
  }
})

onUnmounted(() => {
  if (tabsScroll.value) {
    tabsScroll.value.removeEventListener('scroll', updateScrollIndicators)
  }
})

// Watch for modelValue changes
watch(() => props.modelValue, (newValue) => {
  activeTab.value = newValue
  if (props.scrollable) {
    nextTick(() => scrollToActiveTab())
  }
})
</script>

<style scoped>
/* Mobile Tabs Base Styles */
.mobile-tabs-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.mobile-tabs-header {
  position: relative;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  overflow: hidden;
}

.mobile-tabs-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.mobile-tabs-scroll::-webkit-scrollbar {
  display: none;
}

.mobile-tabs-list {
  display: flex;
  min-width: max-content;
}

.mobile-tab-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--mobile-md) var(--mobile-lg);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: var(--mobile-transition);
  white-space: nowrap;
  min-height: 48px;
  flex-shrink: 0;
}

.mobile-tab-button:focus {
  outline: 2px solid var(--mobile-primary);
  outline-offset: -2px;
}

.mobile-tab-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mobile-tab-content {
  display: flex;
  align-items: center;
  gap: var(--mobile-sm);
  position: relative;
  z-index: 2;
}

.mobile-tab-icon {
  width: 20px;
  height: 20px;
  transition: var(--mobile-transition);
  opacity: 0.6;
}

.mobile-tab-icon-active {
  opacity: 1;
}

.mobile-tab-label {
  font-weight: 500;
  color: var(--text-secondary);
  transition: var(--mobile-transition);
}

.mobile-tab-badge {
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

.mobile-tab-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--mobile-primary);
  transform: scaleX(0);
  transition: var(--mobile-transition);
  border-radius: 2px 2px 0 0;
}

.mobile-tab-indicator-active {
  transform: scaleX(1);
}

/* Tab States */
.mobile-tab-active .mobile-tab-label {
  color: var(--mobile-primary);
  font-weight: 600;
}

.mobile-tab-active .mobile-tab-icon {
  color: var(--mobile-primary);
}

/* Tab Variants */
.mobile-tabs-pills .mobile-tab-button {
  border-radius: 24px;
  margin: var(--mobile-sm);
  background: rgba(0, 0, 0, 0.05);
}

.mobile-tabs-pills .mobile-tab-active {
  background: var(--mobile-primary);
  color: white;
}

.mobile-tabs-pills .mobile-tab-active .mobile-tab-label {
  color: white;
}

.mobile-tabs-pills .mobile-tab-active .mobile-tab-icon {
  color: white;
}

.mobile-tabs-pills .mobile-tab-indicator {
  display: none;
}

.mobile-tabs-underline .mobile-tab-indicator {
  height: 2px;
  border-radius: 0;
}

.mobile-tabs-segmented .mobile-tabs-list {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 4px;
  margin: var(--mobile-md);
}

.mobile-tabs-segmented .mobile-tab-button {
  border-radius: 8px;
  margin: 0;
  background: transparent;
}

.mobile-tabs-segmented .mobile-tab-active {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.mobile-tabs-segmented .mobile-tab-indicator {
  display: none;
}

/* Tab Sizes */
.mobile-tabs-sm .mobile-tab-button {
  padding: var(--mobile-sm) var(--mobile-md);
  min-height: 40px;
}

.mobile-tabs-sm .mobile-tab-icon {
  width: 16px;
  height: 16px;
}

.mobile-tabs-lg .mobile-tab-button {
  padding: var(--mobile-lg) var(--mobile-xl);
  min-height: 56px;
}

.mobile-tabs-lg .mobile-tab-icon {
  width: 24px;
  height: 24px;
}

/* Tab Panels */
.mobile-tabs-panels {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.mobile-tab-panel {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  visibility: hidden;
  transition: var(--mobile-transition);
}

.mobile-tab-panel-active {
  opacity: 1;
  visibility: visible;
  position: relative;
}

.mobile-tab-panel-content {
  padding: var(--mobile-lg);
  height: 100%;
  overflow-y: auto;
}

.mobile-tab-panel-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--text-secondary);
  gap: var(--mobile-md);
}

.mobile-tab-panel-empty-icon {
  width: 48px;
  height: 48px;
  opacity: 0.5;
}

.mobile-tab-panel-empty-text {
  font-size: var(--mobile-text-sm);
  margin: 0;
}

/* Scroll Indicators */
.mobile-tabs-scroll-indicators {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  background: linear-gradient(to left, var(--surface) 0%, transparent 100%);
  padding: 0 var(--mobile-sm);
  pointer-events: none;
}

.mobile-tabs-scroll-button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--surface);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--mobile-transition);
  pointer-events: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.mobile-tabs-scroll-button:hover {
  background: var(--mobile-primary);
  color: white;
  border-color: var(--mobile-primary);
}

.mobile-tabs-scroll-left {
  margin-right: var(--mobile-xs);
}

/* Floating Action Button */
.mobile-tabs-fab {
  position: fixed;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--mobile-primary);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: var(--mobile-transition);
  z-index: 1000;
}

.mobile-tabs-fab:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2);
}

.mobile-tabs-fab-icon {
  width: 24px;
  height: 24px;
}

.mobile-tabs-fab-bottom-right {
  bottom: var(--mobile-xl);
  right: var(--mobile-xl);
}

.mobile-tabs-fab-bottom-left {
  bottom: var(--mobile-xl);
  left: var(--mobile-xl);
}

.mobile-tabs-fab-top-right {
  top: var(--mobile-xl);
  right: var(--mobile-xl);
}

.mobile-tabs-fab-top-left {
  top: var(--mobile-xl);
  left: var(--mobile-xl);
}

/* Transitions */
.mobile-tab-slide-enter-active,
.mobile-tab-slide-leave-active {
  transition: transform 0.3s ease;
}

.mobile-tab-slide-enter-from {
  transform: translateX(100%);
}

.mobile-tab-slide-leave-to {
  transform: translateX(-100%);
}

.mobile-tab-fade-enter-active,
.mobile-tab-fade-leave-active {
  transition: opacity 0.3s ease;
}

.mobile-tab-fade-enter-from,
.mobile-tab-fade-leave-to {
  opacity: 0;
}

.mobile-tab-scale-enter-active,
.mobile-tab-scale-leave-active {
  transition: all 0.3s ease;
}

.mobile-tab-scale-enter-from,
.mobile-tab-scale-leave-to {
  transform: scale(0.8);
  opacity: 0;
}

/* Color Variants */
.mobile-tabs-primary .mobile-tab-indicator,
.mobile-tabs-primary .mobile-tab-active .mobile-tab-label,
.mobile-tabs-primary .mobile-tab-active .mobile-tab-icon,
.mobile-tabs-primary .mobile-tabs-fab {
  color: var(--mobile-primary);
  background: var(--mobile-primary);
}

.mobile-tabs-secondary .mobile-tab-indicator,
.mobile-tabs-secondary .mobile-tab-active .mobile-tab-label,
.mobile-tabs-secondary .mobile-tab-active .mobile-tab-icon,
.mobile-tabs-secondary .mobile-tabs-fab {
  color: var(--mobile-secondary);
  background: var(--mobile-secondary);
}

.mobile-tabs-success .mobile-tab-indicator,
.mobile-tabs-success .mobile-tab-active .mobile-tab-label,
.mobile-tabs-success .mobile-tab-active .mobile-tab-icon,
.mobile-tabs-success .mobile-tabs-fab {
  color: var(--mobile-success);
  background: var(--mobile-success);
}

.mobile-tabs-warning .mobile-tab-indicator,
.mobile-tabs-warning .mobile-tab-active .mobile-tab-label,
.mobile-tabs-warning .mobile-tab-active .mobile-tab-icon,
.mobile-tabs-warning .mobile-tabs-fab {
  color: var(--mobile-warning);
  background: var(--mobile-warning);
}

.mobile-tabs-error .mobile-tab-indicator,
.mobile-tabs-error .mobile-tab-active .mobile-tab-label,
.mobile-tabs-error .mobile-tab-active .mobile-tab-icon,
.mobile-tabs-error .mobile-tabs-fab {
  color: var(--mobile-error);
  background: var(--mobile-error);
}

/* Dark Mode Adjustments */
.dark .mobile-tabs-header {
  background: var(--surface);
  border-color: var(--border);
}

.dark .mobile-tabs-pills .mobile-tab-button {
  background: rgba(255, 255, 255, 0.05);
}

.dark .mobile-tabs-pills .mobile-tab-active {
  background: var(--mobile-primary);
}

.dark .mobile-tabs-segmented .mobile-tabs-list {
  background: rgba(255, 255, 255, 0.05);
}

.dark .mobile-tabs-segmented .mobile-tab-active {
  background: var(--surface);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.dark .mobile-tabs-scroll-indicators {
  background: linear-gradient(to left, var(--surface) 0%, transparent 100%);
}

.dark .mobile-tabs-scroll-button {
  background: var(--surface);
  border-color: var(--border);
}

/* Responsive Adjustments */
@media (max-width: 480px) {
  .mobile-tab-button {
    padding: var(--mobile-sm) var(--mobile-md);
    min-height: 44px;
  }
  
  .mobile-tab-panel-content {
    padding: var(--mobile-md);
  }
  
  .mobile-tabs-fab {
    width: 48px;
    height: 48px;
  }
  
  .mobile-tabs-fab-icon {
    width: 20px;
    height: 20px;
  }
}

/* Performance Optimizations */
.mobile-tab-button,
.mobile-tab-indicator,
.mobile-tab-panel {
  will-change: transform, opacity;
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  .mobile-tab-button,
  .mobile-tab-indicator,
  .mobile-tab-panel,
  .mobile-tabs-fab {
    transition: none;
  }
  
  .mobile-tab-slide-enter-active,
  .mobile-tab-slide-leave-active,
  .mobile-tab-fade-enter-active,
  .mobile-tab-fade-leave-active,
  .mobile-tab-scale-enter-active,
  .mobile-tab-scale-leave-active {
    transition: none;
  }
}

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  .mobile-tab-button {
    border: 1px solid var(--border);
  }
  
  .mobile-tab-active {
    border-color: var(--mobile-primary);
  }
  
  .mobile-tabs-fab {
    border: 2px solid var(--mobile-primary);
  }
}
</style>

