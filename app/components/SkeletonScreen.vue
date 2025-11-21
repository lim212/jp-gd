<template>
  <div class="skeleton-screen" :class="{ 'dark-mode': isDark }">
    <!-- Skeleton Header -->
    <div class="skeleton-header">
      <div class="skeleton-container">
        <div class="skeleton-logo"></div>
        <div class="skeleton-nav">
          <div class="skeleton-nav-item" v-for="i in 4" :key="`nav-${i}`"></div>
        </div>
        <div class="skeleton-actions">
          <div class="skeleton-button"></div>
          <div class="skeleton-button"></div>
        </div>
      </div>
    </div>

    <!-- Skeleton Hero -->
    <div class="skeleton-hero">
      <div class="skeleton-container">
        <div class="skeleton-hero-content">
          <div class="skeleton-title skeleton-xl"></div>
          <div class="skeleton-title skeleton-lg"></div>
          <div class="skeleton-text skeleton-md"></div>
          <div class="skeleton-text skeleton-sm"></div>
          <div class="skeleton-button-group">
            <div class="skeleton-button-primary"></div>
            <div class="skeleton-button-secondary"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Skeleton Services -->
    <div class="skeleton-services">
      <div class="skeleton-container">
        <div class="skeleton-section-title"></div>
        <div class="skeleton-cards">
          <div class="skeleton-card" v-for="i in 3" :key="`card-${i}`">
            <div class="skeleton-card-icon"></div>
            <div class="skeleton-card-title"></div>
            <div class="skeleton-card-text skeleton-line"></div>
            <div class="skeleton-card-text skeleton-line"></div>
            <div class="skeleton-card-text skeleton-line skeleton-short"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Skeleton Features -->
    <div class="skeleton-features">
      <div class="skeleton-container">
        <div class="skeleton-features-grid">
          <div class="skeleton-feature-item" v-for="i in 6" :key="`feature-${i}`">
            <div class="skeleton-feature-icon"></div>
            <div class="skeleton-feature-text"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Progress Indicator -->
    <div class="skeleton-progress" v-if="showProgress">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
      </div>
      <div class="progress-text">{{ progressText }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useColorMode } from '#imports'

const props = defineProps({
  showProgress: {
    type: Boolean,
    default: true
  },
  progress: {
    type: Number,
    default: 0
  },
  progressText: {
    type: String,
    default: 'Loading...'
  }
})

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
</script>

<style scoped>
/* Container */
.skeleton-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #ffffff;
  overflow-y: auto;
  z-index: 9997;
}

.skeleton-screen.dark-mode {
  background: #0f172a;
}

.skeleton-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Base skeleton element */
.skeleton-logo,
.skeleton-nav-item,
.skeleton-button,
.skeleton-title,
.skeleton-text,
.skeleton-card-icon,
.skeleton-card-title,
.skeleton-card-text,
.skeleton-section-title,
.skeleton-button-primary,
.skeleton-button-secondary,
.skeleton-feature-icon,
.skeleton-feature-text {
  background: linear-gradient(90deg, #e5e7eb 25%, #d1d5db 50%, #e5e7eb 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite ease-in-out;
  border-radius: 8px;
}

.dark-mode .skeleton-logo,
.dark-mode .skeleton-nav-item,
.dark-mode .skeleton-button,
.dark-mode .skeleton-title,
.dark-mode .skeleton-text,
.dark-mode .skeleton-card-icon,
.dark-mode .skeleton-card-title,
.dark-mode .skeleton-card-text,
.dark-mode .skeleton-section-title,
.dark-mode .skeleton-button-primary,
.dark-mode .skeleton-button-secondary,
.dark-mode .skeleton-feature-icon,
.dark-mode .skeleton-feature-text {
  background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);
  background-size: 200% 100%;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Header */
.skeleton-header {
  position: sticky;
  top: 0;
  background: inherit;
  padding: 1.5rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.dark-mode .skeleton-header {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.skeleton-header .skeleton-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.skeleton-logo {
  width: 180px;
  height: 40px;
  border-radius: 8px;
}

.skeleton-nav {
  display: flex;
  gap: 1.5rem;
  flex: 1;
}

.skeleton-nav-item {
  width: 80px;
  height: 20px;
}

.skeleton-actions {
  display: flex;
  gap: 1rem;
}

.skeleton-button {
  width: 100px;
  height: 40px;
  border-radius: 8px;
}

/* Hero */
.skeleton-hero {
  padding: 4rem 0;
  min-height: 500px;
  display: flex;
  align-items: center;
}

.skeleton-hero-content {
  max-width: 700px;
}

.skeleton-title {
  height: 48px;
  margin-bottom: 1rem;
}

.skeleton-title.skeleton-xl {
  width: 90%;
  height: 56px;
}

.skeleton-title.skeleton-lg {
  width: 75%;
  height: 48px;
}

.skeleton-text {
  height: 24px;
  margin-bottom: 0.75rem;
}

.skeleton-text.skeleton-md {
  width: 85%;
}

.skeleton-text.skeleton-sm {
  width: 70%;
}

.skeleton-button-group {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.skeleton-button-primary,
.skeleton-button-secondary {
  width: 160px;
  height: 56px;
  border-radius: 12px;
}

/* Services */
.skeleton-services {
  padding: 4rem 0;
  background: rgba(0, 0, 0, 0.02);
}

.dark-mode .skeleton-services {
  background: rgba(255, 255, 255, 0.02);
}

.skeleton-section-title {
  width: 300px;
  height: 40px;
  margin: 0 auto 3rem;
}

.skeleton-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.skeleton-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.dark-mode .skeleton-card {
  background: #1e293b;
}

.skeleton-card-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.skeleton-card-title {
  width: 70%;
  height: 28px;
  margin-bottom: 1rem;
}

.skeleton-card-text {
  height: 16px;
  margin-bottom: 0.5rem;
}

.skeleton-card-text.skeleton-line {
  width: 100%;
}

.skeleton-card-text.skeleton-short {
  width: 60%;
}

/* Features */
.skeleton-features {
  padding: 3rem 0;
}

.skeleton-features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
}

.skeleton-feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
}

.skeleton-feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.skeleton-feature-text {
  width: 120px;
  height: 20px;
}

/* Progress Indicator */
.skeleton-progress {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 1rem;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 11;
}

.dark-mode .skeleton-progress {
  background: #1e293b;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.dark-mode .progress-bar {
  background: rgba(255, 255, 255, 0.1);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
  border-radius: 999px;
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.dark-mode .progress-text {
  color: #94a3b8;
}

/* Responsive */
@media (max-width: 768px) {
  .skeleton-nav {
    display: none;
  }
  
  .skeleton-actions {
    gap: 0.5rem;
  }
  
  .skeleton-button {
    width: 80px;
    height: 36px;
  }
  
  .skeleton-hero {
    padding: 3rem 0;
    min-height: 400px;
  }
  
  .skeleton-title.skeleton-xl {
    height: 40px;
  }
  
  .skeleton-title.skeleton-lg {
    height: 36px;
  }
  
  .skeleton-cards {
    grid-template-columns: 1fr;
  }
  
  .skeleton-features-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .skeleton-logo {
    width: 120px;
    height: 32px;
  }
  
  .skeleton-button-group {
    flex-direction: column;
  }
  
  .skeleton-button-primary,
  .skeleton-button-secondary {
    width: 100%;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .skeleton-logo,
  .skeleton-nav-item,
  .skeleton-button,
  .skeleton-title,
  .skeleton-text,
  .skeleton-card-icon,
  .skeleton-card-title,
  .skeleton-card-text,
  .skeleton-section-title {
    animation: none;
    background: #e5e7eb;
  }
  
  .dark-mode .skeleton-logo,
  .dark-mode .skeleton-nav-item,
  .dark-mode .skeleton-button,
  .dark-mode .skeleton-title,
  .dark-mode .skeleton-text,
  .dark-mode .skeleton-card-icon,
  .dark-mode .skeleton-card-title,
  .dark-mode .skeleton-card-text,
  .dark-mode .skeleton-section-title {
    background: #1e293b;
  }
}
</style>

