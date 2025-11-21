// Loading stages with icons and text
export const loadingStages = [
  { icon: '🚀', text: 'Memulai loading...' },
  { icon: '⚙️', text: 'Memproses data...' },
  { icon: '📦', text: 'Memuat resources...' },
  { icon: '✨', text: 'Menyelesaikan...' }
]

// Super detailed resources being loaded
export const initialResources = [
  {
    name: 'Styles',
    icon: '🎨',
    files: [
      { name: 'main.css', size: '45KB', loaded: false },
      { name: 'components.css', size: '32KB', loaded: false },
      { name: 'responsive.css', size: '18KB', loaded: false },
      { name: 'animations.css', size: '12KB', loaded: false }
    ],
    loaded: false,
    progress: 0
  },
  {
    name: 'Scripts',
    icon: '⚡',
    files: [
      { name: 'vue.js', size: '156KB', loaded: false },
      { name: 'nuxt.js', size: '89KB', loaded: false },
      { name: 'components.js', size: '67KB', loaded: false },
      { name: 'utils.js', size: '23KB', loaded: false }
    ],
    loaded: false,
    progress: 0
  },
  {
    name: 'Images',
    icon: '🖼️',
    files: [
      { name: 'hero-banner.jpg', size: '2.1MB', loaded: false },
      { name: 'logo.png', size: '45KB', loaded: false },
      { name: 'icons.svg', size: '12KB', loaded: false },
      { name: 'backgrounds/', size: '3.2MB', loaded: false }
    ],
    loaded: false,
    progress: 0
  },
  {
    name: 'Content',
    icon: '📄',
    files: [
      { name: 'blog-posts.json', size: '234KB', loaded: false },
      { name: 'translations.json', size: '89KB', loaded: false },
      { name: 'config.json', size: '12KB', loaded: false },
      { name: 'metadata.json', size: '5KB', loaded: false }
    ],
    loaded: false,
    progress: 0
  }
]


