<template>
  <div class="search-icon-container" @click="toggleSearch">
    <div class="search-icon" :class="{ active: isActive }">
      <div class="search-circle">
        <div class="search-handle"></div>
      </div>
    </div>
    <div class="search-ripple" :class="{ animate: isActive }"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isActive = ref(false)

const toggleSearch = () => {
  isActive.value = !isActive.value
  // Emit event untuk membuka search modal/form
  // emit('search-toggle')
}
</script>

<style scoped>
.search-icon-container {
  position: relative;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-icon {
  position: relative;
  width: 24px;
  height: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-circle {
  width: 18px;
  height: 18px;
  border: 2px solid #4fc3f7;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-handle {
  width: 8px;
  height: 2px;
  background: #4fc3f7;
  position: absolute;
  bottom: -2px;
  right: -2px;
  border-radius: 1px;
  transform: rotate(45deg);
  transform-origin: left center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-icon:hover .search-circle {
  border-color: #29b6f6;
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(79, 195, 247, 0.4);
}

.search-icon:hover .search-handle {
  background: #29b6f6;
}

.search-icon.active .search-circle {
  border-color: #00b894;
  transform: scale(1.2);
  box-shadow: 0 0 20px rgba(0, 184, 148, 0.6);
}

.search-icon.active .search-handle {
  background: #00b894;
  transform: rotate(45deg) scale(1.1);
}

.search-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(79, 195, 247, 0.3) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.search-ripple.animate {
  animation: ripple 0.6s ease-out;
}

@keyframes ripple {
  0% {
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    width: 60px;
    height: 60px;
    opacity: 0;
  }
}

/* Glow effect */
.search-icon-container::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(79, 195, 247, 0.1) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.search-icon-container:hover::before {
  opacity: 1;
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
  .search-circle {
    border-color: #64b5f6;
  }
  
  .search-handle {
    background: #64b5f6;
  }
  
  .search-icon:hover .search-circle {
    border-color: #42a5f5;
    box-shadow: 0 0 15px rgba(100, 181, 246, 0.4);
  }
  
  .search-icon:hover .search-handle {
    background: #42a5f5;
  }
}

/* Mobile responsive */
@media (max-width: 768px) {
  .search-icon-container {
    width: 36px;
    height: 36px;
  }
  
  .search-icon {
    width: 22px;
    height: 22px;
  }
  
  .search-circle {
    width: 16px;
    height: 16px;
  }
  
  .search-handle {
    width: 7px;
    height: 2px;
  }
}
</style>
