<template>
  <div class="mobile-skeleton-container" :class="containerClasses">
    <!-- Text Skeleton -->
    <div v-if="type === 'text'" class="mobile-skeleton mobile-skeleton-text" :style="skeletonStyle">
      <div class="mobile-skeleton-line" v-for="n in lines" :key="n" :style="getLineStyle(n)"></div>
    </div>

    <!-- Avatar Skeleton -->
    <div v-else-if="type === 'avatar'" class="mobile-skeleton mobile-skeleton-avatar" :style="skeletonStyle"></div>

    <!-- Image Skeleton -->
    <div v-else-if="type === 'image'" class="mobile-skeleton mobile-skeleton-image" :style="skeletonStyle"></div>

    <!-- Card Skeleton -->
    <div v-else-if="type === 'card'" class="mobile-skeleton mobile-skeleton-card" :style="skeletonStyle">
      <div class="mobile-skeleton-card-header">
        <div class="mobile-skeleton-avatar mobile-skeleton-avatar-small"></div>
        <div class="mobile-skeleton-card-header-content">
          <div class="mobile-skeleton-line mobile-skeleton-line-title"></div>
          <div class="mobile-skeleton-line mobile-skeleton-line-subtitle"></div>
        </div>
      </div>
      <div class="mobile-skeleton-card-body">
        <div class="mobile-skeleton-line" v-for="n in 3" :key="n"></div>
      </div>
      <div class="mobile-skeleton-card-footer">
        <div class="mobile-skeleton-line mobile-skeleton-line-button"></div>
        <div class="mobile-skeleton-line mobile-skeleton-line-button"></div>
      </div>
    </div>

    <!-- List Skeleton -->
    <div v-else-if="type === 'list'" class="mobile-skeleton mobile-skeleton-list" :style="skeletonStyle">
      <div class="mobile-skeleton-list-item" v-for="n in items" :key="n">
        <div class="mobile-skeleton-avatar mobile-skeleton-avatar-small"></div>
        <div class="mobile-skeleton-list-item-content">
          <div class="mobile-skeleton-line mobile-skeleton-line-title"></div>
          <div class="mobile-skeleton-line mobile-skeleton-line-subtitle"></div>
        </div>
      </div>
    </div>

    <!-- Table Skeleton -->
    <div v-else-if="type === 'table'" class="mobile-skeleton mobile-skeleton-table" :style="skeletonStyle">
      <div class="mobile-skeleton-table-header">
        <div class="mobile-skeleton-line" v-for="n in columns" :key="n"></div>
      </div>
      <div class="mobile-skeleton-table-row" v-for="row in rows" :key="row">
        <div class="mobile-skeleton-line" v-for="col in columns" :key="col"></div>
      </div>
    </div>

    <!-- Custom Skeleton -->
    <div v-else class="mobile-skeleton" :style="skeletonStyle">
      <slot>
        <div class="mobile-skeleton-line"></div>
      </slot>
    </div>

    <!-- Loading Overlay -->
    <div v-if="showOverlay" class="mobile-skeleton-overlay">
      <div class="mobile-skeleton-spinner">
        <div class="mobile-skeleton-spinner-circle"></div>
      </div>
      <div v-if="loadingText" class="mobile-skeleton-loading-text">{{ loadingText }}</div>
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
    default: 'text',
    validator: (value: string) => [
      'text', 'avatar', 'image', 'card', 'list', 'table', 'custom'
    ].includes(value)
  },
  
  // Size
  width: {
    type: [String, Number],
    default: '100%'
  },
  height: {
    type: [String, Number],
    default: 'auto'
  },
  
  // Text specific
  lines: {
    type: Number,
    default: 3
  },
  
  // List specific
  items: {
    type: Number,
    default: 5
  },
  
  // Table specific
  rows: {
    type: Number,
    default: 5
  },
  columns: {
    type: Number,
    default: 3
  },
  
  // Animation
  animated: {
    type: Boolean,
    default: true
  },
  animationDuration: {
    type: Number,
    default: 1500
  },
  
  // Overlay
  showOverlay: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: ''
  },
  
  // Variants
  variant: {
    type: String,
    default: 'default',
    validator: (value: string) => ['default', 'rounded', 'circular'].includes(value)
  },
  
  // Colors
  color: {
    type: String,
    default: 'default',
    validator: (value: string) => ['default', 'light', 'dark'].includes(value)
  }
})

// Computed
const containerClasses = computed(() => [
  `mobile-skeleton-${props.variant}`,
  `mobile-skeleton-${props.color}`,
  {
    'mobile-skeleton-animated': props.animated,
    'mobile-skeleton-overlay-visible': props.showOverlay
  }
])

const skeletonStyle = computed(() => {
  const style: Record<string, string> = {}
  
  if (props.width) {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  
  if (props.height) {
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }
  
  if (props.animated) {
    style.animationDuration = `${props.animationDuration}ms`
  }
  
  return style
})

const getLineStyle = (index: number) => {
  const widths = ['100%', '85%', '95%', '70%', '90%']
  return {
    width: widths[(index - 1) % widths.length]
  }
}
</script>

<style scoped>
/* Mobile Skeleton Base Styles */
.mobile-skeleton-container {
  position: relative;
  width: 100%;
}

.mobile-skeleton {
  background: linear-gradient(90deg, 
    rgba(0, 0, 0, 0.06) 25%, 
    rgba(0, 0, 0, 0.15) 50%, 
    rgba(0, 0, 0, 0.06) 75%
  );
  background-size: 200% 100%;
  border-radius: 8px;
  overflow: hidden;
}

.mobile-skeleton-animated {
  animation: mobile-skeleton-loading 1.5s infinite;
}

@keyframes mobile-skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Skeleton Types */
.mobile-skeleton-text {
  padding: var(--mobile-md);
}

.mobile-skeleton-line {
  height: 16px;
  background: inherit;
  border-radius: 4px;
  margin-bottom: var(--mobile-sm);
}

.mobile-skeleton-line:last-child {
  margin-bottom: 0;
}

.mobile-skeleton-line-title {
  height: 20px;
  width: 60%;
}

.mobile-skeleton-line-subtitle {
  height: 14px;
  width: 40%;
}

.mobile-skeleton-line-button {
  height: 32px;
  width: 80px;
  border-radius: 16px;
}

.mobile-skeleton-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: inherit;
}

.mobile-skeleton-avatar-small {
  width: 32px;
  height: 32px;
}

.mobile-skeleton-image {
  width: 100%;
  height: 200px;
  border-radius: 12px;
  background: inherit;
}

.mobile-skeleton-card {
  padding: var(--mobile-lg);
  border-radius: 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.mobile-skeleton-card-header {
  display: flex;
  align-items: center;
  gap: var(--mobile-md);
  margin-bottom: var(--mobile-lg);
}

.mobile-skeleton-card-header-content {
  flex: 1;
}

.mobile-skeleton-card-body {
  margin-bottom: var(--mobile-lg);
}

.mobile-skeleton-card-footer {
  display: flex;
  gap: var(--mobile-md);
  justify-content: flex-end;
}

.mobile-skeleton-list {
  padding: var(--mobile-md);
}

.mobile-skeleton-list-item {
  display: flex;
  align-items: center;
  gap: var(--mobile-md);
  margin-bottom: var(--mobile-lg);
  padding: var(--mobile-md);
  border-radius: 12px;
  background: var(--surface);
  border: 1px solid var(--border);
}

.mobile-skeleton-list-item:last-child {
  margin-bottom: 0;
}

.mobile-skeleton-list-item-content {
  flex: 1;
}

.mobile-skeleton-table {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: var(--surface);
  border: 1px solid var(--border);
}

.mobile-skeleton-table-header {
  display: flex;
  padding: var(--mobile-md);
  background: rgba(0, 0, 0, 0.02);
  border-bottom: 1px solid var(--border);
}

.mobile-skeleton-table-row {
  display: flex;
  padding: var(--mobile-md);
  border-bottom: 1px solid var(--border);
}

.mobile-skeleton-table-row:last-child {
  border-bottom: none;
}

.mobile-skeleton-table-header .mobile-skeleton-line,
.mobile-skeleton-table-row .mobile-skeleton-line {
  flex: 1;
  margin-right: var(--mobile-md);
  margin-bottom: 0;
}

.mobile-skeleton-table-header .mobile-skeleton-line:last-child,
.mobile-skeleton-table-row .mobile-skeleton-line:last-child {
  margin-right: 0;
}

/* Skeleton Variants */
.mobile-skeleton-rounded .mobile-skeleton {
  border-radius: 12px;
}

.mobile-skeleton-circular .mobile-skeleton {
  border-radius: 50%;
}

/* Skeleton Colors */
.mobile-skeleton-light .mobile-skeleton {
  background: linear-gradient(90deg, 
    rgba(0, 0, 0, 0.03) 25%, 
    rgba(0, 0, 0, 0.08) 50%, 
    rgba(0, 0, 0, 0.03) 75%
  );
  background-size: 200% 100%;
}

.mobile-skeleton-dark .mobile-skeleton {
  background: linear-gradient(90deg, 
    rgba(255, 255, 255, 0.06) 25%, 
    rgba(255, 255, 255, 0.15) 50%, 
    rgba(255, 255, 255, 0.06) 75%
  );
  background-size: 200% 100%;
}

/* Loading Overlay */
.mobile-skeleton-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--mobile-md);
  z-index: 10;
  opacity: 0;
  visibility: hidden;
  transition: var(--mobile-transition);
}

.mobile-skeleton-overlay-visible .mobile-skeleton-overlay {
  opacity: 1;
  visibility: visible;
}

.mobile-skeleton-spinner {
  width: 40px;
  height: 40px;
  position: relative;
}

.mobile-skeleton-spinner-circle {
  width: 100%;
  height: 100%;
  border: 3px solid rgba(255, 122, 0, 0.2);
  border-top-color: var(--mobile-primary);
  border-radius: 50%;
  animation: mobile-skeleton-spin 1s linear infinite;
}

@keyframes mobile-skeleton-spin {
  to {
    transform: rotate(360deg);
  }
}

.mobile-skeleton-loading-text {
  font-size: var(--mobile-text-sm);
  color: var(--text-secondary);
  font-weight: 500;
}

/* Dark Mode Adjustments */
.dark .mobile-skeleton {
  background: linear-gradient(90deg, 
    rgba(255, 255, 255, 0.03) 25%, 
    rgba(255, 255, 255, 0.08) 50%, 
    rgba(255, 255, 255, 0.03) 75%
  );
  background-size: 200% 100%;
}

.dark .mobile-skeleton-card,
.dark .mobile-skeleton-list-item,
.dark .mobile-skeleton-table {
  background: var(--surface);
  border-color: var(--border);
}

.dark .mobile-skeleton-table-header {
  background: rgba(255, 255, 255, 0.02);
}

.dark .mobile-skeleton-overlay {
  background: rgba(0, 0, 0, 0.8);
}

/* Responsive Adjustments */
@media (max-width: 480px) {
  .mobile-skeleton-card {
    padding: var(--mobile-md);
  }
  
  .mobile-skeleton-list-item {
    padding: var(--mobile-sm);
  }
  
  .mobile-skeleton-table-header,
  .mobile-skeleton-table-row {
    padding: var(--mobile-sm);
  }
}

/* Performance Optimizations */
.mobile-skeleton {
  will-change: background-position;
}

.mobile-skeleton-spinner-circle {
  will-change: transform;
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  .mobile-skeleton-animated {
    animation: none;
  }
  
  .mobile-skeleton-spinner-circle {
    animation: none;
  }
}

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  .mobile-skeleton {
    background: linear-gradient(90deg, 
      rgba(0, 0, 0, 0.1) 25%, 
      rgba(0, 0, 0, 0.2) 50%, 
      rgba(0, 0, 0, 0.1) 75%
    );
    background-size: 200% 100%;
  }
  
  .dark .mobile-skeleton {
    background: linear-gradient(90deg, 
      rgba(255, 255, 255, 0.1) 25%, 
      rgba(255, 255, 255, 0.2) 50%, 
      rgba(255, 255, 255, 0.1) 75%
    );
    background-size: 200% 100%;
  }
}
</style>

