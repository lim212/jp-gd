<template>
  <div 
    v-if="headings.length > 0"
    class="toc-container-center bg-transparent border-0 shadow-none p-0 transition-all duration-300"
  >
    <div class="flex items-center gap-1.5 mb-2 pb-1.5 px-4 pt-3 border-b border-gray-200 dark:border-gray-700">
      <Icon name="mdi:format-list-bulleted" class="text-blue-600 dark:text-blue-400" size="14" />
      <h3 class="font-medium text-xs text-gray-900 dark:text-white">Daftar Isi</h3>
    </div>
    
    <nav class="toc-nav-center px-4 pb-3">
      <ul class="space-y-0.5">
        <li 
          v-for="(heading, index) in headings" 
          :key="index"
          :class="[
            'toc-item-center transition-all duration-200',
            heading.level === 2 ? 'ml-0' : 'ml-2'
          ]"
        >
          <a 
            :href="`#${heading.id}`"
            @click.prevent="scrollToHeading(heading.id)"
            :class="[
              'block py-1 px-2 rounded text-xs transition-all duration-200',
              activeSection === heading.id 
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium border-l-2 border-blue-600 dark:border-blue-400' 
                : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-l-2 border-transparent'
            ]"
          >
            {{ heading.text }}
          </a>
        </li>
      </ul>
    </nav>
    
    <!-- Progress Indicator -->
    <div class="mt-2 pt-2 px-4 pb-3 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between text-gray-600 dark:text-gray-400 mb-1">
        <span class="text-xs">Progress</span>
        <span class="font-medium text-xs">{{ Math.round(readingProgress) }}%</span>
      </div>
      <div class="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          class="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 rounded-full"
          :style="{ width: readingProgress + '%' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Heading {
  id: string
  text: string
  level: number
}

const props = defineProps<{
  content: string
}>()

const headings = ref<Heading[]>([])
const activeSection = ref<string>('')
const readingProgress = ref(0)

// Extract headings from content
function extractHeadings() {
  if (!props.content) return []
  
  const parser = new DOMParser()
  const doc = parser.parseFromString(props.content, 'text/html')
  const headingElements = doc.querySelectorAll('h2, h3')
  
  const extractedHeadings: Heading[] = []
  
  headingElements.forEach((element, index) => {
    const text = element.textContent?.trim() || ''
    const level = parseInt(element.tagName.charAt(1))
    
    // Generate ID if not exists
    let id = element.id
    if (!id) {
      id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      element.id = id
    }
    
    extractedHeadings.push({ id, text, level })
  })
  
  return extractedHeadings
}

// Scroll to heading with smooth animation
function scrollToHeading(id: string) {
  const element = document.getElementById(id)
  if (element) {
    const offset = 100 // Account for sticky header
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

// Update active section based on scroll position
function updateActiveSection() {
  if (headings.value.length === 0) return
  
  const scrollPosition = window.scrollY + 150
  
  for (let i = headings.value.length - 1; i >= 0; i--) {
    const heading = headings.value[i]
    const element = document.getElementById(heading.id)
    
    if (element && element.offsetTop <= scrollPosition) {
      activeSection.value = heading.id
      break
    }
  }
  
  // Update reading progress
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  const scrollTop = window.scrollY
  const progress = (scrollTop / (documentHeight - windowHeight)) * 100
  readingProgress.value = Math.min(Math.max(progress, 0), 100)
}

// Setup on mount
onMounted(() => {
  headings.value = extractHeadings()
  
  // Add IDs to actual DOM headings
  nextTick(() => {
    const contentElement = document.querySelector('.blog-content')
    if (contentElement) {
      const h2Elements = contentElement.querySelectorAll('h2, h3')
      h2Elements.forEach((element) => {
        const text = element.textContent?.trim() || ''
        if (!element.id) {
          const id = text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
          element.id = id
        }
      })
    }
  })
  
  // Setup scroll listener
  window.addEventListener('scroll', updateActiveSection, { passive: true })
  updateActiveSection()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveSection)
})

// Watch for content changes
watch(() => props.content, () => {
  headings.value = extractHeadings()
  nextTick(() => {
    updateActiveSection()
  })
})
</script>

<style scoped>
.toc-container-center {
  max-height: calc(100vh - 160px);
  overflow-y: auto;
  position: relative;
}

.toc-container-center::-webkit-scrollbar {
  width: 3px;
}

.toc-container-center::-webkit-scrollbar-track {
  background: transparent;
}

.toc-container-center::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.dark .toc-container-center::-webkit-scrollbar-thumb {
  background: #475569;
}

.toc-nav-center a {
  word-break: break-word;
  word-wrap: break-word;
  overflow-wrap: break-word;
  line-height: 1.4;
  hyphens: auto;
}

.toc-item-center {
  max-width: 100%;
}

/* Responsive: Show on all screens but smaller on mobile */
@media (max-width: 768px) {
  .toc-container-center {
    max-height: none;
    padding: 0.75rem;
    border-radius: 10px;
    background: #f8fafc;
    border: 1px solid #e5e7eb;
  }
  
  .toc-container-center .flex {
    padding: 0.5rem 0.75rem;
    border-bottom-width: 1px;
  }
  
  .toc-container-center h3 {
    font-size: 0.8rem;
  }
  
  .toc-nav-center {
    padding: 0.75rem;
  }
  
  .toc-nav-center ul {
    gap: 0.25rem;
  }
  
  .toc-nav-center a {
    font-size: 0.75rem;
    padding: 0.5rem 0.625rem;
    line-height: 1.4;
  }
  
  .toc-container-center .mt-2 {
    padding: 0.5rem 0.75rem;
    border-top-width: 1px;
  }
  
  .toc-container-center .text-xs {
    font-size: 0.7rem;
  }
  
  .toc-container-center .h-1 {
    height: 0.25rem;
  }
}

@media (max-width: 640px) {
  .toc-container-center {
    position: relative;
    top: auto;
    max-height: none;
    margin-bottom: 0.875rem;
    padding: 0.625rem;
    border-radius: 8px;
  }
  
  .toc-container-center .flex {
    padding: 0.45rem 0.625rem;
    gap: 0.5rem;
  }
  
  .toc-container-center h3 {
    font-size: 0.75rem;
  }
  
  .toc-nav-center {
    padding: 0.625rem;
  }
  
  .toc-nav-center ul {
    gap: 0.2rem;
  }
  
  .toc-nav-center a {
    font-size: 0.7rem;
    padding: 0.4rem 0.5rem;
    line-height: 1.35;
  }
  
  .toc-container-center .mt-2 {
    padding: 0.45rem 0.625rem;
  }
  
  .toc-container-center .text-xs {
    font-size: 0.65rem;
  }
  
  .toc-container-center .h-1 {
    height: 0.2rem;
  }
}
</style>


