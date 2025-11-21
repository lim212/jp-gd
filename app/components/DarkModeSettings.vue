<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useColorMode } from '#imports'
import { useAutoDarkMode } from '~/composables/useAutoDarkMode'

const colorMode = useColorMode()
const { isAutoEnabled, autoSchedule, enableAuto, disableAuto, updateSchedule, initialize, cleanup } = useAutoDarkMode()

// Initialize on mount (client-side only)
onMounted(() => {
  initialize()
})

// Cleanup on unmount
onUnmounted(() => {
  cleanup()
})

const showSettings = ref(false)
const tempDarkStart = ref(autoSchedule.value.darkStart)
const tempDarkEnd = ref(autoSchedule.value.darkEnd)

const toggleSettings = () => {
  showSettings.value = !showSettings.value
}

const toggleAuto = () => {
  if (isAutoEnabled.value) {
    disableAuto()
  } else {
    enableAuto()
  }
}

const applySchedule = () => {
  updateSchedule(tempDarkStart.value, tempDarkEnd.value)
  showSettings.value = false
}

const themeOptions = [
  { value: 'light', label: '☀️ Light Mode', icon: 'i-lucide-sun' },
  { value: 'dark', label: '🌙 Dark Mode', icon: 'i-lucide-moon' },
  { value: 'system', label: '💻 System', icon: 'i-lucide-monitor' },
]
</script>

<template>
  <div class="dark-mode-settings">
    <!-- Settings Button -->
    <button
      @click="toggleSettings"
      class="settings-trigger p-2 rounded-lg bg-gray-100 dark:bg-gray-800 
             text-gray-700 dark:text-gray-300 hover:text-blue-600 
             dark:hover:text-blue-400 transition-all duration-200"
      title="Dark Mode Settings"
    >
      <UIcon name="i-lucide-settings" class="w-5 h-5" />
    </button>

    <!-- Settings Panel -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 transform translate-y-2"
      enter-to-class="opacity-100 transform translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 transform translate-y-0"
      leave-to-class="opacity-0 transform translate-y-2"
    >
      <div
        v-if="showSettings"
        class="settings-panel absolute right-0 top-full mt-2 
               bg-white dark:bg-gray-900 rounded-2xl shadow-2xl 
               border border-gray-200 dark:border-gray-700 
               p-6 w-80 z-50"
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
            🎨 Theme Settings
          </h3>
          <button
            @click="toggleSettings"
            class="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <UIcon name="i-lucide-x" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <!-- Theme Selector -->
        <div class="mb-6">
          <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
            Theme Mode
          </label>
          <div class="space-y-2">
            <button
              v-for="option in themeOptions"
              :key="option.value"
              @click="colorMode.preference = option.value"
              :class="[
                'w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200',
                colorMode.preference === option.value
                  ? 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border-2 border-blue-500'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
              ]"
            >
              <UIcon :name="option.icon" class="w-5 h-5" />
              <span class="font-medium">{{ option.label }}</span>
              <UIcon
                v-if="colorMode.preference === option.value"
                name="i-lucide-check"
                class="w-5 h-5 ml-auto"
              />
            </button>
          </div>
        </div>

        <!-- Divider -->
        <div class="border-t border-gray-200 dark:border-gray-700 my-6"></div>

        <!-- Auto Dark Mode Toggle -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-3">
            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">
              🕐 Auto Dark Mode
            </label>
            <button
              @click="toggleAuto"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                isAutoEnabled
                  ? 'bg-blue-600 dark:bg-blue-500'
                  : 'bg-gray-300 dark:bg-gray-600'
              ]"
            >
              <span
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  isAutoEnabled ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Automatically switch based on time
          </p>
        </div>

        <!-- Schedule Settings (shown when auto is enabled) -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-96"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 max-h-96"
          leave-to-class="opacity-0 max-h-0"
        >
          <div v-if="isAutoEnabled" class="space-y-4">
            <!-- Dark Start Time -->
            <div>
              <label class="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                🌙 Dark mode starts at
              </label>
              <div class="flex items-center gap-2">
                <input
                  v-model.number="tempDarkStart"
                  type="range"
                  min="0"
                  max="23"
                  class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span class="text-sm font-bold text-gray-900 dark:text-white w-16 text-right">
                  {{ tempDarkStart }}:00
                </span>
              </div>
            </div>

            <!-- Dark End Time -->
            <div>
              <label class="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                ☀️ Light mode starts at
              </label>
              <div class="flex items-center gap-2">
                <input
                  v-model.number="tempDarkEnd"
                  type="range"
                  min="0"
                  max="23"
                  class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span class="text-sm font-bold text-gray-900 dark:text-white w-16 text-right">
                  {{ tempDarkEnd }}:00
                </span>
              </div>
            </div>

            <!-- Apply Button -->
            <button
              @click="applySchedule"
              class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 
                     text-white font-medium rounded-lg transition-colors 
                     flex items-center justify-center gap-2"
            >
              <UIcon name="i-lucide-check" class="w-4 h-4" />
              Apply Schedule
            </button>
          </div>
        </Transition>

        <!-- Info -->
        <div class="mt-6 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
          <p class="text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
            <UIcon name="i-lucide-info" class="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              Your theme preference is saved and will be applied across all pages.
            </span>
          </p>
        </div>
      </div>
    </Transition>

    <!-- Click outside to close -->
    <div
      v-if="showSettings"
      @click="toggleSettings"
      class="fixed inset-0 z-40"
    ></div>
  </div>
</template>

<style scoped>
.dark-mode-settings {
  position: relative;
}

.settings-panel {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Custom range slider styling */
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
  transition: all 0.2s ease;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.6);
}

.dark input[type="range"]::-webkit-slider-thumb {
  background: #60a5fa;
}

input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #3b82f6;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
  transition: all 0.2s ease;
}

input[type="range"]::-moz-range-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.6);
}

.dark input[type="range"]::-moz-range-thumb {
  background: #60a5fa;
}
</style>

