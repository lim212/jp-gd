<template>
  <div class="theme-toggle-container" @click="toggleTheme">
    <div class="toggle-wrapper" :class="{ 'dark-mode': isDarkMode }">
      <div class="toggle-background">
        <div class="toggle-slider">
          <div class="slider-icon sun-icon">
            <i class="fas fa-sun"></i>
          </div>
          <div class="slider-icon moon-icon">
            <i class="fas fa-moon"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="toggle-label">
      {{ isDarkMode ? 'Dark' : 'Light' }} Mode
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useColorMode } from '#imports'

// Use Nuxt Color Mode
const colorMode = useColorMode()

// Computed property for dark mode state
const isDarkMode = computed(() => colorMode.value === 'dark')

const toggleTheme = () => {
  // Toggle using Nuxt Color Mode
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<style scoped>
.theme-toggle-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  padding: 8px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.theme-toggle-container:hover {
  background: rgba(255, 255, 255, 0.1);
}

.toggle-wrapper {
  position: relative;
  width: 60px;
  height: 32px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toggle-background {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #ffd700 0%, #ff8c00 50%, #ff4500 100%);
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.2),
    0 2px 8px rgba(255, 215, 0, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toggle-wrapper.dark-mode .toggle-background {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.4),
    0 2px 8px rgba(26, 26, 46, 0.3);
}

.toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.2),
    0 1px 3px rgba(0, 0, 0, 0.1);
}

.toggle-wrapper.dark-mode .toggle-slider {
  transform: translateX(28px);
  background: linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%);
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.3),
    0 0 15px rgba(79, 195, 247, 0.4);
}

.slider-icon {
  position: absolute;
  font-size: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sun-icon {
  color: #ff8c00;
  opacity: 1;
  transform: rotate(0deg) scale(1);
}

.moon-icon {
  color: #64b5f6;
  opacity: 0;
  transform: rotate(180deg) scale(0.5);
}

.toggle-wrapper.dark-mode .sun-icon {
  opacity: 0;
  transform: rotate(180deg) scale(0.5);
}

.toggle-wrapper.dark-mode .moon-icon {
  opacity: 1;
  transform: rotate(0deg) scale(1);
  color: #fff;
}

.toggle-label {
  font-size: 11px;
  font-weight: 600;
  color: #e0e6ed;
  text-align: center;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.theme-toggle-container:hover .toggle-label {
  color: #4fc3f7;
}

/* Animated background particles */
.toggle-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.2) 1px, transparent 1px);
  background-size: 20px 20px, 15px 15px;
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.toggle-wrapper.dark-mode .toggle-background::before {
  background-image: 
    radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    radial-gradient(circle at 70% 70%, rgba(79, 195, 247, 0.2) 1px, transparent 1px);
  opacity: 0.8;
}

/* Glow effect on hover */
.theme-toggle-container:hover .toggle-background {
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.2),
    0 4px 16px rgba(255, 215, 0, 0.5);
}

.toggle-wrapper.dark-mode:hover .toggle-background {
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.4),
    0 4px 16px rgba(79, 195, 247, 0.5);
}

/* Pulse animation for icons */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.sun-icon {
  animation: pulse 3s ease-in-out infinite;
}

.toggle-wrapper.dark-mode .moon-icon {
  animation: pulse 3s ease-in-out infinite;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .toggle-wrapper {
    width: 50px;
    height: 28px;
  }
  
  .toggle-slider {
    width: 24px;
    height: 24px;
  }
  
  .toggle-wrapper.dark-mode .toggle-slider {
    transform: translateX(22px);
  }
  
  .slider-icon {
    font-size: 10px;
  }
  
  .toggle-label {
    font-size: 10px;
  }
  
  .theme-toggle-container {
    padding: 6px;
    gap: 6px;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .toggle-slider,
  .slider-icon,
  .sun-icon,
  .moon-icon {
    transition: none;
  }
  
  .sun-icon,
  .moon-icon {
    animation: none;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .toggle-background {
    border: 2px solid #fff;
  }
  
  .toggle-wrapper.dark-mode .toggle-background {
    border: 2px solid #4fc3f7;
  }
}
</style>
