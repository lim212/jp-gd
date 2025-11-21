export default defineAppConfig({
  ui: {
    colors: {
      primary: 'yellow',
      neutral: 'neutral'
    }
  },
  // Configure Nuxt Icon to use CSS mode and alias common lucide icons
  icon: {
    mode: 'css',
    aliases: {
      'lucide:moon': 'i-lucide-moon',
      'lucide:sun': 'i-lucide-sun',
      'lucide:languages': 'i-lucide-languages',
      'lucide:menu': 'i-lucide-menu',
      'lucide:arrow-left': 'i-lucide-arrow-left'
    }
  }
})
