<template>
  <div
    class="mobile-card-container"
    :class="[
      `mobile-card-${variant}`,
      { 'mobile-card-interactive': interactive },
      { 'mobile-card-loading': loading }
    ]"
    @click="handleClick"
  >
    <!-- Loading State -->
    <div v-if="loading" class="mobile-card-loading-state">
      <div class="mobile-skeleton mobile-card-skeleton-image"></div>
      <div class="mobile-card-skeleton-content">
        <div class="mobile-skeleton mobile-card-skeleton-title"></div>
        <div class="mobile-skeleton mobile-card-skeleton-text"></div>
        <div class="mobile-skeleton mobile-card-skeleton-text"></div>
      </div>
    </div>

    <!-- Card Content -->
    <div v-else class="mobile-card-content">
      <!-- Card Image -->
      <div v-if="image || $slots.image" class="mobile-card-image">
        <slot name="image">
          <AppImage
            v-if="image"
            :src="image"
            :alt="imageAlt"
            class="mobile-card-img"
            :loading="imageLoading"
            :width="imageWidth"
            :height="imageHeight"
          />
        </slot>
        
        <!-- Image Overlay -->
        <div v-if="imageOverlay" class="mobile-card-image-overlay">
          <slot name="imageOverlay">
            <div class="mobile-card-overlay-content">
              <UIcon :name="imageOverlayIcon" class="mobile-card-overlay-icon" />
              <span class="mobile-card-overlay-text">{{ imageOverlayText }}</span>
            </div>
          </slot>
        </div>

        <!-- Badge -->
        <div v-if="badge" class="mobile-card-badge" :class="`mobile-card-badge-${badgeVariant}`">
          <slot name="badge">
            <span class="mobile-card-badge-text">{{ badge }}</span>
          </slot>
        </div>
      </div>

      <!-- Card Header -->
      <div v-if="title || $slots.header" class="mobile-card-header">
        <slot name="header">
          <h3 v-if="title" class="mobile-card-title">{{ title }}</h3>
          <p v-if="subtitle" class="mobile-card-subtitle">{{ subtitle }}</p>
        </slot>
      </div>

      <!-- Card Body -->
      <div v-if="$slots.default || description" class="mobile-card-body">
        <slot>
          <p v-if="description" class="mobile-card-description">{{ description }}</p>
        </slot>
      </div>

      <!-- Card Footer -->
      <div v-if="$slots.footer || actions" class="mobile-card-footer">
        <slot name="footer">
          <div v-if="actions" class="mobile-card-actions">
            <button
              v-for="(action, index) in actions"
              :key="index"
              class="mobile-card-action"
              :class="`mobile-card-action-${action.variant || 'primary'}`"
              @click.stop="handleAction(action, index)"
            >
              <UIcon v-if="action.icon" :name="action.icon" class="mobile-card-action-icon" />
              <span>{{ action.label }}</span>
            </button>
          </div>
        </slot>
      </div>

      <!-- Card Progress -->
      <div v-if="progress !== undefined" class="mobile-card-progress">
        <div class="mobile-card-progress-bar">
          <div 
            class="mobile-card-progress-fill"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
        <div v-if="progressText" class="mobile-card-progress-text">{{ progressText }}</div>
      </div>

      <!-- Card Stats -->
      <div v-if="stats && stats.length" class="mobile-card-stats">
        <div
          v-for="(stat, index) in stats"
          :key="index"
          class="mobile-card-stat"
        >
          <div class="mobile-card-stat-value">{{ stat.value }}</div>
          <div class="mobile-card-stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>

    <!-- Hover Effects -->
    <div v-if="interactive && !loading" class="mobile-card-hover-effect"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props
interface Action {
  label: string
  icon?: string
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  handler?: () => void
}

interface Stat {
  value: string | number
  label: string
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
  description: {
    type: String,
    default: ''
  },
  
  // Image
  image: {
    type: String,
    default: ''
  },
  imageAlt: {
    type: String,
    default: ''
  },
  imageWidth: {
    type: [String, Number],
    default: '100%'
  },
  imageHeight: {
    type: [String, Number],
    default: '200px'
  },
  imageLoading: {
    type: String,
    default: 'lazy'
  },
  imageOverlay: {
    type: Boolean,
    default: false
  },
  imageOverlayIcon: {
    type: String,
    default: 'i-lucide-play'
  },
  imageOverlayText: {
    type: String,
    default: 'View'
  },
  
  // Badge
  badge: {
    type: String,
    default: ''
  },
  badgeVariant: {
    type: String,
    default: 'primary'
  },
  
  // Actions
  actions: {
    type: Array as () => Action[],
    default: () => []
  },
  
  // Progress
  progress: {
    type: Number,
    default: undefined
  },
  progressText: {
    type: String,
    default: ''
  },
  
  // Stats
  stats: {
    type: Array as () => Stat[],
    default: () => []
  },
  
  // Variants
  variant: {
    type: String,
    default: 'default'
  },
  
  // States
  loading: {
    type: Boolean,
    default: false
  },
  interactive: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits<{
  click: [event: MouseEvent]
  action: [action: Action, index: number]
}>()

// Computed
const computedImageAlt = computed(() => {
  return props.imageAlt || props.title || 'Card image'
})

// Methods
const handleClick = (event: MouseEvent) => {
  if (props.interactive && !props.loading) {
    emit('click', event)
  }
}

const handleAction = (action: Action, index: number) => {
  if (action.handler) {
    action.handler()
  }
  emit('action', action, index)
}
</script>

<style scoped>
/* Mobile Card Base Styles */
.mobile-card-container {
  position: relative;
  background: var(--surface);
  border-radius: 16px;
  overflow: hidden;
  transition: var(--mobile-transition);
  border: 1px solid var(--border);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.mobile-card-container:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.mobile-card-interactive {
  cursor: pointer;
}

.mobile-card-interactive:active {
  transform: translateY(-2px) scale(0.98);
}

/* Card Variants */
.mobile-card-default {
  background: var(--surface);
}

.mobile-card-glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.mobile-card-elevated {
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
}

.mobile-card-outlined {
  background: transparent;
  border: 2px solid var(--border);
}

.mobile-card-flat {
  box-shadow: none;
  border: none;
}

/* Loading State */
.mobile-card-loading-state {
  padding: var(--mobile-lg);
}

.mobile-card-skeleton-image {
  height: 200px;
  border-radius: 12px;
  margin-bottom: var(--mobile-lg);
}

.mobile-card-skeleton-content {
  display: flex;
  flex-direction: column;
  gap: var(--mobile-md);
}

.mobile-card-skeleton-title {
  height: 24px;
  width: 70%;
  border-radius: 4px;
}

.mobile-card-skeleton-text {
  height: 16px;
  border-radius: 4px;
}

.mobile-card-skeleton-text:last-child {
  width: 50%;
}

/* Card Content */
.mobile-card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Card Image */
.mobile-card-image {
  position: relative;
  overflow: hidden;
}

.mobile-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--mobile-transition);
}

.mobile-card-container:hover .mobile-card-img {
  transform: scale(1.05);
}

.mobile-card-image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: var(--mobile-transition);
}

.mobile-card-container:hover .mobile-card-image-overlay {
  opacity: 1;
}

.mobile-card-overlay-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--mobile-sm);
  color: white;
  text-align: center;
}

.mobile-card-overlay-icon {
  width: 32px;
  height: 32px;
}

.mobile-card-overlay-text {
  font-weight: 600;
  font-size: var(--mobile-text-sm);
}

/* Card Badge */
.mobile-card-badge {
  position: absolute;
  top: var(--mobile-md);
  right: var(--mobile-md);
  padding: var(--mobile-xs) var(--mobile-sm);
  border-radius: 20px;
  font-size: var(--mobile-text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.mobile-card-badge-primary {
  background: var(--mobile-primary);
  color: white;
}

.mobile-card-badge-secondary {
  background: var(--mobile-secondary);
  color: white;
}

.mobile-card-badge-success {
  background: var(--mobile-success);
  color: white;
}

.mobile-card-badge-warning {
  background: var(--mobile-warning);
  color: white;
}

.mobile-card-badge-error {
  background: var(--mobile-error);
  color: white;
}

/* Card Header */
.mobile-card-header {
  padding: var(--mobile-lg) var(--mobile-lg) var(--mobile-md);
}

.mobile-card-title {
  font-size: var(--mobile-text-lg);
  font-weight: 700;
  color: var(--heading);
  margin: 0 0 var(--mobile-xs) 0;
  line-height: 1.3;
}

.mobile-card-subtitle {
  font-size: var(--mobile-text-sm);
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.4;
}

/* Card Body */
.mobile-card-body {
  padding: 0 var(--mobile-lg) var(--mobile-md);
  flex: 1;
}

.mobile-card-description {
  font-size: var(--mobile-text-base);
  color: var(--text);
  line-height: 1.6;
  margin: 0;
}

/* Card Footer */
.mobile-card-footer {
  padding: var(--mobile-md) var(--mobile-lg) var(--mobile-lg);
  border-top: 1px solid var(--border);
  margin-top: auto;
}

.mobile-card-actions {
  display: flex;
  gap: var(--mobile-sm);
  flex-wrap: wrap;
}

.mobile-card-action {
  display: flex;
  align-items: center;
  gap: var(--mobile-xs);
  padding: var(--mobile-sm) var(--mobile-md);
  border-radius: 8px;
  border: none;
  font-size: var(--mobile-text-sm);
  font-weight: 600;
  cursor: pointer;
  transition: var(--mobile-transition);
  min-height: var(--touch-target);
}

.mobile-card-action-primary {
  background: var(--mobile-primary);
  color: white;
}

.mobile-card-action-primary:hover {
  background: var(--mobile-primary-hover);
  transform: translateY(-1px);
}

.mobile-card-action-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text);
  border: 1px solid var(--border);
}

.mobile-card-action-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

.mobile-card-action-danger {
  background: var(--mobile-error);
  color: white;
}

.mobile-card-action-danger:hover {
  background: #0ea5e9;
}

.mobile-card-action-success {
  background: var(--mobile-success);
  color: white;
}

.mobile-card-action-success:hover {
  background: #16a34a;
}

.mobile-card-action-icon {
  width: 16px;
  height: 16px;
}

/* Card Progress */
.mobile-card-progress {
  padding: var(--mobile-md) var(--mobile-lg);
  border-top: 1px solid var(--border);
}

.mobile-card-progress-bar {
  height: 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: var(--mobile-xs);
}

.mobile-card-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--mobile-primary), var(--mobile-secondary));
  border-radius: 3px;
  transition: width 0.3s ease;
}

.mobile-card-progress-text {
  font-size: var(--mobile-text-sm);
  color: var(--text-secondary);
  text-align: center;
}

/* Card Stats */
.mobile-card-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: var(--mobile-md);
  padding: var(--mobile-md) var(--mobile-lg);
  border-top: 1px solid var(--border);
}

.mobile-card-stat {
  text-align: center;
}

.mobile-card-stat-value {
  font-size: var(--mobile-text-lg);
  font-weight: 700;
  color: var(--heading);
  margin-bottom: var(--mobile-xs);
}

.mobile-card-stat-label {
  font-size: var(--mobile-text-xs);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Hover Effect */
.mobile-card-hover-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(255, 122, 0, 0.05) 0%, 
    rgba(245, 179, 1, 0.05) 100%
  );
  opacity: 0;
  transition: var(--mobile-transition);
  pointer-events: none;
}

.mobile-card-container:hover .mobile-card-hover-effect {
  opacity: 1;
}

/* Dark Mode Adjustments */
.dark .mobile-card-container {
  background: var(--surface);
  border-color: var(--border);
}

.dark .mobile-card-glass {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .mobile-card-progress-bar {
  background: rgba(255, 255, 255, 0.1);
}

/* Responsive Adjustments */
@media (min-width: 768px) {
  .mobile-card-actions {
    flex-wrap: nowrap;
  }
  
  .mobile-card-stats {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Performance Optimizations */
.mobile-card-container,
.mobile-card-img,
.mobile-card-hover-effect {
  will-change: transform;
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  .mobile-card-container {
    transition: none;
  }
  
  .mobile-card-container:hover {
    transform: none;
  }
  
  .mobile-card-img {
    transition: none;
  }
  
  .mobile-card-container:hover .mobile-card-img {
    transform: none;
  }
  
  .mobile-card-hover-effect {
    transition: none;
  }
}

/* Focus Styles for Accessibility */
.mobile-card-interactive:focus-visible {
  outline: 2px solid var(--mobile-primary);
  outline-offset: 2px;
}

.mobile-card-action:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
</style>

