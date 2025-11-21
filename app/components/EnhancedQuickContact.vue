<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRuntimeConfig } from '#imports'

// Props
const props = defineProps({
  position: {
    type: String,
    default: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
    validator: (value: string) => ['bottom-right', 'bottom-left', 'top-right', 'top-left'].includes(value)
  },
  theme: {
    type: String,
    default: 'gradient', // gradient, solid, glass
    validator: (value: string) => ['gradient', 'solid', 'glass'].includes(value)
  }
})

// State
const isOpen = ref(false)
const isVisible = ref(false)
const config = useRuntimeConfig()

// Computed
const whatsappPhone = computed(() => config.public?.whatsappPhone || '628988888250')
const whatsappMessage = computed(() => config.public?.whatsappMessage || 'Halo JasaPembayaran.com, saya ingin konsultasi')

const whatsappHref = computed(() => {
  const params = new URLSearchParams({
    phone: String(whatsappPhone.value),
    text: String(whatsappMessage.value),
    type: 'phone_number',
    app_absent: '0'
  })
  return `https://api.whatsapp.com/send/?${params.toString()}`
})

const positionClasses = computed(() => {
  const positions = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-24 right-6',
    'top-left': 'top-24 left-6'
  }
  return positions[props.position] || positions['bottom-right']
})

const themeClasses = computed(() => {
  const themes = {
    'gradient': 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700',
    'solid': 'bg-blue-600 hover:bg-blue-700',
    'glass': 'bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20'
  }
  return themes[props.theme] || themes['gradient']
})

// Methods
const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}

// Contact actions
const contactActions = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: 'i-lucide-message-circle',
    href: whatsappHref,
    color: 'from-green-500 to-emerald-500',
    external: true
  },
  {
    id: 'email',
    label: 'Email',
    icon: 'i-lucide-mail',
    href: 'mailto:admin@jasapembayaran.com',
    color: 'from-blue-500 to-cyan-500',
    external: false
  },
  {
    id: 'jasa-paypal',
    label: 'Jasa PayPal',
    icon: 'i-mdi-paypal',
    href: '/jasa-paypal',
    color: 'from-indigo-500 to-purple-500',
    external: false
  },
  {
    id: 'testimoni',
    label: 'Testimoni',
    icon: 'i-lucide-star',
    href: '/testimonials',
    color: 'from-purple-500 to-pink-500',
    external: false
  }
]

// Lifecycle
onMounted(() => {
  // Show button after a short delay
  setTimeout(() => {
    isVisible.value = true
  }, 500)

  // Close menu when clicking outside
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (!target.closest('.quick-contact-container')) {
      closeMenu()
    }
  }
  document.addEventListener('click', handleClickOutside)

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>

<template>
  <div 
    v-if="isVisible"
    class="quick-contact-container fixed z-50 transition-all duration-300"
    :class="[positionClasses, isOpen ? 'scale-100' : 'scale-100']"
  >
    <!-- Menu Items -->
    <transition-group
      name="menu-items"
      tag="div"
      class="flex flex-col gap-3 mb-3"
    >
      <div
        v-for="(action, index) in contactActions"
        v-show="isOpen"
        :key="action.id"
        :style="{ transitionDelay: `${index * 50}ms` }"
        class="menu-item"
      >
        <component
          :is="action.external ? 'a' : 'NuxtLink'"
          :href="action.external ? action.href : undefined"
          :to="action.external ? undefined : action.href"
          :target="action.external ? '_blank' : undefined"
          :rel="action.external ? 'noopener noreferrer' : undefined"
          class="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-r text-white font-semibold min-w-[200px]"
          :class="action.color"
          @click="closeMenu"
        >
          <UIcon :name="action.icon" class="size-5 flex-shrink-0" />
          <span>{{ action.label }}</span>
        </component>
      </div>
    </transition-group>

    <!-- Main Button -->
    <button
      type="button"
      class="main-button w-16 h-16 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
      :class="[themeClasses, isOpen ? 'rotate-45' : 'rotate-0']"
      @click="toggleMenu"
    >
      <UIcon 
        :name="isOpen ? 'i-lucide-x' : 'i-lucide-phone'"
        class="size-8 text-white"
      />
    </button>

    <!-- Pulse Animation Ring -->
    <div
      v-if="!isOpen"
      class="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20 pointer-events-none"
    ></div>
  </div>
</template>

<style scoped>
/* Main Button Styles */
.main-button {
  position: relative;
  overflow: hidden;
}

.main-button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.main-button:hover::before {
  opacity: 1;
}

/* Menu Items Animation */
.menu-items-enter-active,
.menu-items-leave-active {
  transition: all 0.3s ease;
}

.menu-items-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.9);
}

.menu-items-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.9);
}

/* Hover Effects */
.menu-item a {
  position: relative;
  overflow: hidden;
}

.menu-item a::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0));
  transform: translateX(-100%);
  transition: transform 0.5s ease;
}

.menu-item a:hover::before {
  transform: translateX(0);
}

/* Glass Effect for Glass Theme */
.glass-theme {
  backdrop-filter: blur(12px) saturate(180%);
  background-color: rgba(255, 255, 255, 0.1);
}

/* Responsive */
@media (max-width: 640px) {
  .quick-contact-container {
    bottom: 1rem;
    right: 1rem;
  }

  .main-button {
    width: 3.5rem;
    height: 3.5rem;
  }

  .menu-item a {
    min-width: 180px;
    font-size: 0.875rem;
    padding: 0.75rem 1rem;
  }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  .quick-contact-container,
  .menu-items-enter-active,
  .menu-items-leave-active,
  .menu-item a {
    transition: none;
    animation: none;
  }

  .animate-ping {
    animation: none;
  }
}
</style>

