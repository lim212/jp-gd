<template>
  <div class="mobile-dropdown-container" :class="containerClasses" ref="dropdownContainer">
    <!-- Trigger Button -->
    <button
      class="mobile-dropdown-trigger"
      :class="triggerClasses"
      :style="triggerStyle"
      @click="toggleDropdown"
      @keydown="handleKeydown"
      :disabled="disabled"
      :aria-expanded="isOpen"
      :aria-haspopup="true"
      :aria-label="label"
      ref="triggerButton"
    >
      <div class="mobile-dropdown-trigger-content">
        <!-- Custom trigger content -->
        <slot name="trigger" :isOpen="isOpen" :selectedItem="selectedItem">
          <div class="mobile-dropdown-trigger-default">
            <Icon v-if="icon" :name="icon" class="mobile-dropdown-trigger-icon" />
            <span class="mobile-dropdown-trigger-text">
              {{ displayText }}
            </span>
            <Icon 
              name="lucide:chevron-down" 
              class="mobile-dropdown-trigger-arrow"
              :class="{ 'mobile-dropdown-trigger-arrow-open': isOpen }"
            />
          </div>
        </slot>
      </div>
    </button>

    <!-- Dropdown Menu -->
    <Teleport to="body">
      <Transition name="mobile-dropdown-menu">
        <div
          v-if="isOpen"
          class="mobile-dropdown-menu"
          :class="menuClasses"
          :style="menuStyle"
          @click.stop
          role="menu"
          :aria-labelledby="triggerButton?.id"
        >
          <!-- Search Input (if enabled) -->
          <div v-if="searchable" class="mobile-dropdown-search">
            <div class="mobile-dropdown-search-input-wrapper">
              <Icon name="lucide:search" class="mobile-dropdown-search-icon" />
              <input
                ref="searchInput"
                v-model="searchQuery"
                type="text"
                class="mobile-dropdown-search-input"
                :placeholder="searchPlaceholder"
                @keydown="handleSearchKeydown"
                @input="handleSearchInput"
              />
              <button
                v-if="searchQuery"
                class="mobile-dropdown-search-clear"
                @click="clearSearch"
                aria-label="Clear search"
              >
                <Icon name="lucide:x" />
              </button>
            </div>
          </div>

          <!-- Menu Items -->
          <div class="mobile-dropdown-items" :class="itemsClasses">
            <!-- Group Header -->
            <div
              v-for="(group, groupIndex) in filteredGroups"
              :key="groupIndex"
              class="mobile-dropdown-group"
            >
              <div v-if="group.label" class="mobile-dropdown-group-header">
                {{ group.label }}
              </div>
              
              <!-- Group Items -->
              <div class="mobile-dropdown-group-items">
                <button
                  v-for="(item, itemIndex) in group.items"
                  :key="item.id || `${groupIndex}-${itemIndex}`"
                  class="mobile-dropdown-item"
                  :class="getItemClasses(item, groupIndex, itemIndex)"
                  :style="getItemStyle(item, groupIndex, itemIndex)"
                  @click="selectItem(item, groupIndex, itemIndex)"
                  @keydown="handleItemKeydown($event, item, groupIndex, itemIndex)"
                  :disabled="item.disabled"
                  :aria-selected="isItemSelected(item)"
                  role="menuitem"
                  :tabindex="isItemSelected(item) ? 0 : -1"
                >
                  <div class="mobile-dropdown-item-content">
                    <!-- Item Icon -->
                    <Icon 
                      v-if="item.icon" 
                      :name="item.icon" 
                      class="mobile-dropdown-item-icon"
                      :class="{ 'mobile-dropdown-item-icon-selected': isItemSelected(item) }"
                    />
                    
                    <!-- Item Text -->
                    <div class="mobile-dropdown-item-text">
                      <div class="mobile-dropdown-item-label">{{ item.label }}</div>
                      <div v-if="item.description" class="mobile-dropdown-item-description">
                        {{ item.description }}
                      </div>
                    </div>
                    
                    <!-- Item Badge -->
                    <div v-if="item.badge" class="mobile-dropdown-item-badge">
                      {{ item.badge }}
                    </div>
                    
                    <!-- Selection Indicator -->
                    <Icon 
                      v-if="isItemSelected(item) && showCheckmark"
                      name="lucide:check" 
                      class="mobile-dropdown-item-check"
                    />
                  </div>
                  
                  <!-- Item Divider -->
                  <div v-if="item.divider" class="mobile-dropdown-item-divider"></div>
                </button>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="filteredGroups.length === 0" class="mobile-dropdown-empty">
              <Icon name="lucide:search-x" class="mobile-dropdown-empty-icon" />
              <div class="mobile-dropdown-empty-text">{{ emptyText }}</div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div v-if="$slots.footer" class="mobile-dropdown-footer">
            <slot name="footer" :close="closeDropdown"></slot>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Backdrop -->
    <Transition name="mobile-dropdown-backdrop">
      <div
        v-if="isOpen"
        class="mobile-dropdown-backdrop"
        @click="closeDropdown"
        @touchstart="handleBackdropTouch"
      ></div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted, watch } from 'vue'

// Props
const props = defineProps({
  // Data
  items: {
    type: Array as () => Array<{
      id?: string
      label: string
      value?: any
      description?: string
      icon?: string
      badge?: string | number
      disabled?: boolean
      divider?: boolean
      group?: string
    }>,
    default: () => []
  },
  
  // Selection
  modelValue: {
    type: [String, Number, Object, Array],
    default: null
  },
  multiple: {
    type: Boolean,
    default: false
  },
  
  // Display
  placeholder: {
    type: String,
    default: 'Select an option'
  },
  label: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  
  // Search
  searchable: {
    type: Boolean,
    default: false
  },
  searchPlaceholder: {
    type: String,
    default: 'Search...'
  },
  
  // Behavior
  disabled: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: false
  },
  showCheckmark: {
    type: Boolean,
    default: true
  },
  
  // Position
  position: {
    type: String,
    default: 'bottom-start',
    validator: (value: string) => [
      'bottom-start', 'bottom-end', 'top-start', 'top-end',
      'left-start', 'left-end', 'right-start', 'right-end'
    ].includes(value)
  },
  
  // Size
  size: {
    type: String,
    default: 'md',
    validator: (value: string) => ['sm', 'md', 'lg'].includes(value)
  },
  
  // Variants
  variant: {
    type: String,
    default: 'default',
    validator: (value: string) => ['default', 'outline', 'ghost', 'filled'].includes(value)
  },
  
  // Colors
  color: {
    type: String,
    default: 'primary',
    validator: (value: string) => ['primary', 'secondary', 'success', 'warning', 'error'].includes(value)
  },
  
  // Menu
  maxHeight: {
    type: [String, Number],
    default: '300px'
  },
  width: {
    type: [String, Number],
    default: 'auto'
  },
  
  // Empty state
  emptyText: {
    type: String,
    default: 'No options found'
  }
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: any]
  'change': [value: any, item: any]
  'open': []
  'close': []
  'search': [query: string]
}>()

// Refs
const dropdownContainer = ref<HTMLElement>()
const triggerButton = ref<HTMLElement>()
const searchInput = ref<HTMLInputElement>()
const isOpen = ref(false)
const searchQuery = ref('')
const menuPosition = ref({ top: 0, left: 0, width: 0 })

// Computed
const containerClasses = computed(() => [
  `mobile-dropdown-${props.size}`,
  `mobile-dropdown-${props.variant}`,
  `mobile-dropdown-${props.color}`,
  {
    'mobile-dropdown-open': isOpen.value,
    'mobile-dropdown-disabled': props.disabled,
    'mobile-dropdown-multiple': props.multiple
  }
])

const triggerClasses = computed(() => [
  `mobile-dropdown-trigger-${props.size}`,
  `mobile-dropdown-trigger-${props.variant}`,
  `mobile-dropdown-trigger-${props.color}`,
  {
    'mobile-dropdown-trigger-open': isOpen.value,
    'mobile-dropdown-trigger-disabled': props.disabled
  }
])

const menuClasses = computed(() => [
  `mobile-dropdown-menu-${props.position}`,
  {
    'mobile-dropdown-menu-searchable': props.searchable
  }
])

const itemsClasses = computed(() => [
  {
    'mobile-dropdown-items-scrollable': props.maxHeight !== 'none'
  }
])

const triggerStyle = computed(() => {
  const style: Record<string, string> = {}
  
  if (props.width !== 'auto') {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  
  return style
})

const menuStyle = computed(() => {
  const style: Record<string, string> = {
    top: `${menuPosition.value.top}px`,
    left: `${menuPosition.value.left}px`,
    width: `${menuPosition.value.width}px`
  }
  
  if (props.maxHeight !== 'none') {
    style.maxHeight = typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight
  }
  
  return style
})

const selectedItem = computed(() => {
  if (props.multiple) {
    return props.items.filter(item => 
      Array.isArray(props.modelValue) && props.modelValue.includes(item.value || item.id)
    )
  }
  
  return props.items.find(item => 
    item.value === props.modelValue || item.id === props.modelValue
  )
})

const displayText = computed(() => {
  if (props.multiple && Array.isArray(props.modelValue)) {
    if (props.modelValue.length === 0) return props.placeholder
    if (props.modelValue.length === 1) {
      const item = selectedItem.value?.[0]
      return item?.label || props.placeholder
    }
    return `${props.modelValue.length} selected`
  }
  
  const item = selectedItem.value
  return item?.label || props.placeholder
})

const filteredGroups = computed(() => {
  let filteredItems = props.items
  
  // Filter by search query
  if (props.searchable && searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filteredItems = props.items.filter(item =>
      item.label.toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query))
    )
  }
  
  // Group items
  const groups: Record<string, { label?: string; items: any[] }> = {}
  
  filteredItems.forEach(item => {
    const groupKey = item.group || 'default'
    if (!groups[groupKey]) {
      groups[groupKey] = {
        label: item.group || undefined,
        items: []
      }
    }
    groups[groupKey].items.push(item)
  })
  
  return Object.values(groups)
})

// Methods
const toggleDropdown = async () => {
  if (props.disabled) return
  
  if (isOpen.value) {
    closeDropdown()
  } else {
    await openDropdown()
  }
}

const openDropdown = async () => {
  isOpen.value = true
  emit('open')
  
  await nextTick()
  calculateMenuPosition()
  
  if (props.searchable && searchInput.value) {
    searchInput.value.focus()
  }
}

const closeDropdown = () => {
  isOpen.value = false
  searchQuery.value = ''
  emit('close')
}

const selectItem = (item: any, groupIndex: number, itemIndex: number) => {
  if (item.disabled) return
  
  let newValue: any
  
  if (props.multiple) {
    const currentValue = Array.isArray(props.modelValue) ? props.modelValue : []
    const itemValue = item.value || item.id
    
    if (currentValue.includes(itemValue)) {
      newValue = currentValue.filter((v: any) => v !== itemValue)
    } else {
      newValue = [...currentValue, itemValue]
    }
  } else {
    newValue = item.value || item.id
    closeDropdown()
  }
  
  emit('update:modelValue', newValue)
  emit('change', newValue, item)
}

const isItemSelected = (item: any) => {
  const itemValue = item.value || item.id
  
  if (props.multiple) {
    return Array.isArray(props.modelValue) && props.modelValue.includes(itemValue)
  }
  
  return props.modelValue === itemValue
}

const calculateMenuPosition = () => {
  if (!triggerButton.value) return
  
  const triggerRect = triggerButton.value.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  
  let top = 0
  let left = 0
  let width = triggerRect.width
  
  // Calculate position based on position prop
  switch (props.position) {
    case 'bottom-start':
      top = triggerRect.bottom + 4
      left = triggerRect.left
      break
    case 'bottom-end':
      top = triggerRect.bottom + 4
      left = triggerRect.right - width
      break
    case 'top-start':
      top = triggerRect.top - 4
      left = triggerRect.left
      break
    case 'top-end':
      top = triggerRect.top - 4
      left = triggerRect.right - width
      break
    case 'left-start':
      top = triggerRect.top
      left = triggerRect.left - width - 4
      break
    case 'left-end':
      top = triggerRect.bottom - 200 // Approximate menu height
      left = triggerRect.left - width - 4
      break
    case 'right-start':
      top = triggerRect.top
      left = triggerRect.right + 4
      break
    case 'right-end':
      top = triggerRect.bottom - 200 // Approximate menu height
      left = triggerRect.right + 4
      break
  }
  
  // Adjust for viewport boundaries
  if (left + width > viewportWidth) {
    left = viewportWidth - width - 16
  }
  if (left < 16) {
    left = 16
  }
  
  if (top + 300 > viewportHeight) { // Approximate menu height
    top = triggerRect.top - 300 - 4
  }
  if (top < 16) {
    top = 16
  }
  
  menuPosition.value = { top, left, width }
}

const handleKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault()
      toggleDropdown()
      break
    case 'Escape':
      if (isOpen.value) {
        closeDropdown()
      }
      break
    case 'ArrowDown':
      event.preventDefault()
      if (!isOpen.value) {
        openDropdown()
      }
      break
  }
}

const handleSearchKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeDropdown()
  }
}

const handleSearchInput = () => {
  emit('search', searchQuery.value)
}

const clearSearch = () => {
  searchQuery.value = ''
  if (searchInput.value) {
    searchInput.value.focus()
  }
}

const handleItemKeydown = (event: KeyboardEvent, item: any, groupIndex: number, itemIndex: number) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault()
      selectItem(item, groupIndex, itemIndex)
      break
    case 'Escape':
      closeDropdown()
      break
  }
}

const handleBackdropTouch = (event: TouchEvent) => {
  // Prevent backdrop touch from closing on mobile
  event.preventDefault()
}

const getItemClasses = (item: any, groupIndex: number, itemIndex: number) => {
  const classes = []
  
  if (isItemSelected(item)) {
    classes.push('mobile-dropdown-item-selected')
  }
  
  if (item.disabled) {
    classes.push('mobile-dropdown-item-disabled')
  }
  
  if (item.divider) {
    classes.push('mobile-dropdown-item-with-divider')
  }
  
  return classes
}

const getItemStyle = (item: any, groupIndex: number, itemIndex: number) => {
  const style: Record<string, string> = {}
  
  // Add animation delay for staggered appearance
  style.animationDelay = `${(groupIndex * 10 + itemIndex * 5)}ms`
  
  return style
}

// Event listeners
const handleClickOutside = (event: Event) => {
  if (isOpen.value && !dropdownContainer.value?.contains(event.target as Node)) {
    closeDropdown()
  }
}

const handleResize = () => {
  if (isOpen.value) {
    calculateMenuPosition()
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', handleResize)
})

// Watch for modelValue changes
watch(() => props.modelValue, () => {
  // Update display when modelValue changes
})
</script>

<style scoped>
/* Mobile Dropdown Base Styles */
.mobile-dropdown-container {
  position: relative;
  display: inline-block;
  width: 100%;
}

.mobile-dropdown-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--mobile-md) var(--mobile-lg);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  cursor: pointer;
  transition: var(--mobile-transition);
  text-align: left;
  font-family: inherit;
}

.mobile-dropdown-trigger:focus {
  outline: 2px solid var(--mobile-primary);
  outline-offset: -2px;
}

.mobile-dropdown-trigger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mobile-dropdown-trigger-content {
  width: 100%;
}

.mobile-dropdown-trigger-default {
  display: flex;
  align-items: center;
  gap: var(--mobile-sm);
}

.mobile-dropdown-trigger-icon {
  width: 20px;
  height: 20px;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.mobile-dropdown-trigger-text {
  flex: 1;
  color: var(--text-primary);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mobile-dropdown-trigger-arrow {
  width: 16px;
  height: 16px;
  color: var(--text-secondary);
  transition: var(--mobile-transition);
  flex-shrink: 0;
}

.mobile-dropdown-trigger-arrow-open {
  transform: rotate(180deg);
}

/* Trigger Variants */
.mobile-dropdown-trigger-outline {
  background: transparent;
  border: 2px solid var(--border);
}

.mobile-dropdown-trigger-ghost {
  background: transparent;
  border: none;
  padding: var(--mobile-sm) var(--mobile-md);
}

.mobile-dropdown-trigger-filled {
  background: var(--mobile-primary);
  border-color: var(--mobile-primary);
  color: white;
}

.mobile-dropdown-trigger-filled .mobile-dropdown-trigger-text,
.mobile-dropdown-trigger-filled .mobile-dropdown-trigger-icon,
.mobile-dropdown-trigger-filled .mobile-dropdown-trigger-arrow {
  color: white;
}

/* Trigger Sizes */
.mobile-dropdown-trigger-sm {
  padding: var(--mobile-sm) var(--mobile-md);
  min-height: 36px;
}

.mobile-dropdown-trigger-sm .mobile-dropdown-trigger-icon {
  width: 16px;
  height: 16px;
}

.mobile-dropdown-trigger-sm .mobile-dropdown-trigger-arrow {
  width: 14px;
  height: 14px;
}

.mobile-dropdown-trigger-lg {
  padding: var(--mobile-lg) var(--mobile-xl);
  min-height: 56px;
}

.mobile-dropdown-trigger-lg .mobile-dropdown-trigger-icon {
  width: 24px;
  height: 24px;
}

.mobile-dropdown-trigger-lg .mobile-dropdown-trigger-arrow {
  width: 18px;
  height: 18px;
}

/* Dropdown Menu */
.mobile-dropdown-menu {
  position: fixed;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(20px);
  z-index: 1000;
  overflow: hidden;
  min-width: 200px;
}

.mobile-dropdown-menu-searchable {
  padding-top: 0;
}

/* Search Input */
.mobile-dropdown-search {
  padding: var(--mobile-md);
  border-bottom: 1px solid var(--border);
  background: var(--surface);
}

.mobile-dropdown-search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.mobile-dropdown-search-icon {
  position: absolute;
  left: var(--mobile-sm);
  width: 16px;
  height: 16px;
  color: var(--text-secondary);
  z-index: 2;
}

.mobile-dropdown-search-input {
  width: 100%;
  padding: var(--mobile-sm) var(--mobile-sm) var(--mobile-sm) 32px;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: var(--mobile-text-sm);
  color: var(--text-primary);
  transition: var(--mobile-transition);
}

.mobile-dropdown-search-input:focus {
  outline: none;
  border-color: var(--mobile-primary);
  box-shadow: 0 0 0 2px rgba(255, 122, 0, 0.1);
}

.mobile-dropdown-search-clear {
  position: absolute;
  right: var(--mobile-sm);
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: var(--mobile-transition);
}

.mobile-dropdown-search-clear:hover {
  background: var(--background);
  color: var(--text-primary);
}

/* Menu Items */
.mobile-dropdown-items {
  max-height: 300px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}

.mobile-dropdown-items::-webkit-scrollbar {
  width: 4px;
}

.mobile-dropdown-items::-webkit-scrollbar-track {
  background: transparent;
}

.mobile-dropdown-items::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 2px;
}

.mobile-dropdown-items-scrollable {
  max-height: 300px;
}

/* Groups */
.mobile-dropdown-group {
  margin-bottom: var(--mobile-sm);
}

.mobile-dropdown-group:last-child {
  margin-bottom: 0;
}

.mobile-dropdown-group-header {
  padding: var(--mobile-sm) var(--mobile-md);
  font-size: var(--mobile-text-xs);
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: var(--background);
  border-bottom: 1px solid var(--border);
}

.mobile-dropdown-group-items {
  padding: var(--mobile-xs) 0;
}

/* Individual Items */
.mobile-dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  padding: var(--mobile-sm) var(--mobile-md);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: var(--mobile-transition);
  text-align: left;
  font-family: inherit;
  position: relative;
  animation: mobile-dropdown-item-appear 0.2s ease forwards;
  opacity: 0;
  transform: translateY(-4px);
}

.mobile-dropdown-item:hover {
  background: var(--background);
}

.mobile-dropdown-item:focus {
  outline: 2px solid var(--mobile-primary);
  outline-offset: -2px;
}

.mobile-dropdown-item:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mobile-dropdown-item-selected {
  background: rgba(255, 122, 0, 0.1);
  color: var(--mobile-primary);
}

.mobile-dropdown-item-content {
  display: flex;
  align-items: center;
  gap: var(--mobile-sm);
  width: 100%;
}

.mobile-dropdown-item-icon {
  width: 20px;
  height: 20px;
  color: var(--text-secondary);
  flex-shrink: 0;
  transition: var(--mobile-transition);
}

.mobile-dropdown-item-icon-selected {
  color: var(--mobile-primary);
}

.mobile-dropdown-item-text {
  flex: 1;
  min-width: 0;
}

.mobile-dropdown-item-label {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.mobile-dropdown-item-description {
  font-size: var(--mobile-text-sm);
  color: var(--text-secondary);
  line-height: 1.3;
}

.mobile-dropdown-item-badge {
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
  flex-shrink: 0;
}

.mobile-dropdown-item-check {
  width: 16px;
  height: 16px;
  color: var(--mobile-primary);
  flex-shrink: 0;
}

.mobile-dropdown-item-divider {
  position: absolute;
  bottom: 0;
  left: var(--mobile-md);
  right: var(--mobile-md);
  height: 1px;
  background: var(--border);
}

.mobile-dropdown-item-with-divider {
  margin-bottom: var(--mobile-xs);
}

/* Empty State */
.mobile-dropdown-empty {
  padding: var(--mobile-xl);
  text-align: center;
  color: var(--text-secondary);
}

.mobile-dropdown-empty-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto var(--mobile-md);
  opacity: 0.5;
}

.mobile-dropdown-empty-text {
  font-size: var(--mobile-text-sm);
  margin: 0;
}

/* Footer */
.mobile-dropdown-footer {
  padding: var(--mobile-md);
  border-top: 1px solid var(--border);
  background: var(--background);
}

/* Backdrop */
.mobile-dropdown-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
  z-index: 999;
}

/* Animations */
@keyframes mobile-dropdown-item-appear {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mobile-dropdown-menu-enter-active,
.mobile-dropdown-menu-leave-active {
  transition: all 0.2s ease;
}

.mobile-dropdown-menu-enter-from,
.mobile-dropdown-menu-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-8px);
}

.mobile-dropdown-backdrop-enter-active,
.mobile-dropdown-backdrop-leave-active {
  transition: opacity 0.2s ease;
}

.mobile-dropdown-backdrop-enter-from,
.mobile-dropdown-backdrop-leave-to {
  opacity: 0;
}

/* Color Variants */
.mobile-dropdown-primary .mobile-dropdown-trigger:focus,
.mobile-dropdown-primary .mobile-dropdown-item:focus,
.mobile-dropdown-primary .mobile-dropdown-search-input:focus {
  border-color: var(--mobile-primary);
  box-shadow: 0 0 0 2px rgba(255, 122, 0, 0.1);
}

.mobile-dropdown-secondary .mobile-dropdown-trigger:focus,
.mobile-dropdown-secondary .mobile-dropdown-item:focus,
.mobile-dropdown-secondary .mobile-dropdown-search-input:focus {
  border-color: var(--mobile-secondary);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
}

.mobile-dropdown-success .mobile-dropdown-trigger:focus,
.mobile-dropdown-success .mobile-dropdown-item:focus,
.mobile-dropdown-success .mobile-dropdown-search-input:focus {
  border-color: var(--mobile-success);
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.1);
}

.mobile-dropdown-warning .mobile-dropdown-trigger:focus,
.mobile-dropdown-warning .mobile-dropdown-item:focus,
.mobile-dropdown-warning .mobile-dropdown-search-input:focus {
  border-color: var(--mobile-warning);
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.1);
}

.mobile-dropdown-error .mobile-dropdown-trigger:focus,
.mobile-dropdown-error .mobile-dropdown-item:focus,
.mobile-dropdown-error .mobile-dropdown-search-input:focus {
  border-color: var(--mobile-error);
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);
}

/* Dark Mode Adjustments */
.dark .mobile-dropdown-menu {
  background: var(--surface);
  border-color: var(--border);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.dark .mobile-dropdown-search-input {
  background: var(--background);
  border-color: var(--border);
}

.dark .mobile-dropdown-group-header {
  background: var(--background);
  border-color: var(--border);
}

.dark .mobile-dropdown-footer {
  background: var(--background);
  border-color: var(--border);
}

/* Responsive Adjustments */
@media (max-width: 480px) {
  .mobile-dropdown-menu {
    left: 16px !important;
    right: 16px !important;
    width: auto !important;
    max-width: calc(100vw - 32px);
  }
  
  .mobile-dropdown-trigger {
    padding: var(--mobile-sm) var(--mobile-md);
  }
  
  .mobile-dropdown-item {
    padding: var(--mobile-md);
    min-height: 48px;
  }
}

/* Performance Optimizations */
.mobile-dropdown-item,
.mobile-dropdown-trigger {
  will-change: transform, opacity;
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  .mobile-dropdown-trigger,
  .mobile-dropdown-trigger-arrow,
  .mobile-dropdown-item,
  .mobile-dropdown-item-icon {
    transition: none;
  }
  
  .mobile-dropdown-item {
    animation: none;
    opacity: 1;
    transform: none;
  }
  
  .mobile-dropdown-menu-enter-active,
  .mobile-dropdown-menu-leave-active,
  .mobile-dropdown-backdrop-enter-active,
  .mobile-dropdown-backdrop-leave-active {
    transition: none;
  }
}

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  .mobile-dropdown-trigger,
  .mobile-dropdown-menu {
    border-width: 2px;
  }
  
  .mobile-dropdown-item:focus,
  .mobile-dropdown-trigger:focus {
    outline-width: 3px;
  }
}
</style>

