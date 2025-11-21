<template>
  <header class="site-header">
    <!-- Top bar dengan utility icons -->
    <div class="header-top-bar">
      <div class="container">
        <div class="header-utilities">
          <!-- Contact info -->
          <div class="contact-info">
            <span class="contact-item">
              <i class="fas fa-phone"></i>
              +62 123 456 7890
            </span>
            <span class="contact-item">
              <i class="fas fa-envelope"></i>
              info@jasapembayaran.com
            </span>
          </div>
          
          <!-- Utility icons -->
          <div class="utility-icons">
            <!-- Search Icon - Enhanced -->
            <div class="utility-item">
              <SearchIcon @search-toggle="toggleSearchModal" />
            </div>
            
            <!-- Language Switcher -->
            <div class="utility-item language-switcher">
              <button 
                class="lang-btn" 
                :class="{ active: currentLang === 'id' }"
                @click="setLanguage('id')"
              >
                ID
              </button>
              <span class="separator">|</span>
              <button 
                class="lang-btn" 
                :class="{ active: currentLang === 'en' }"
                @click="setLanguage('en')"
              >
                EN
              </button>
            </div>
            
            <!-- Theme Toggle - Enhanced -->
            <div class="utility-item">
              <ThemeToggle />
            </div>
            
            <!-- Testimoni Link -->
            <div class="utility-item">
              <NuxtLink to="/testimonials" class="testimoni-link">
                <i class="fas fa-star"></i>
                Testimoni
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Main navigation -->
    <nav class="main-navigation">
      <div class="container">
        <div class="nav-content">
          <!-- Logo -->
          <div class="site-logo">
            <NuxtLink to="/" class="logo-link">
              <img src="/logo.png" alt="JasaPembayaran" class="logo-img logo-img-responsive" />
              <span class="logo-text logo-text-responsive">JasaPembayaran</span>
            </NuxtLink>
          </div>
          
          <!-- Navigation Menu -->
          <ul class="nav-menu">
            <li class="nav-item">
              <NuxtLink to="/" class="nav-link" :class="{ active: $route.path === '/' }">
                Beranda
              </NuxtLink>
            </li>
            <li class="nav-item">
              <NuxtLink to="/layanan" class="nav-link" :class="{ active: $route.path.startsWith('/layanan') }">
                Layanan
              </NuxtLink>
            </li>
            <li class="nav-item">
              <NuxtLink to="/tentang" class="nav-link" :class="{ active: $route.path.startsWith('/tentang') }">
                Tentang
              </NuxtLink>
            </li>
            <li class="nav-item">
              <NuxtLink to="/kontak" class="nav-link" :class="{ active: $route.path.startsWith('/kontak') }">
                Kontak
              </NuxtLink>
            </li>
          </ul>
          
          <!-- CTA Button -->
          <div class="header-cta">
            <NuxtLink to="/order" class="cta-button enhanced-btn">
              <i class="fas fa-rocket"></i>
              <span>Mulai Sekarang</span>
            </NuxtLink>
          </div>
          
          <!-- Clock Trigger - Enhanced -->
          <div class="clock-trigger">
            <button class="clock-button" @click="toggleClockPopup">
              <i class="fas fa-clock"></i>
              <span class="time-display">{{ currentTime }}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
    
    <!-- Enhanced Clock Popup -->
    <ClockPopup :is-open="showClockPopup" @close="showClockPopup = false" />
    
    <!-- Enhanced Search Modal -->
    <div v-if="showSearchModal" class="search-modal-overlay" @click="showSearchModal = false">
      <div class="search-modal enhanced-card" @click.stop>
        <div class="search-modal-header">
          <h3 class="search-title">
            <i class="fas fa-search"></i>
            Cari Layanan
          </h3>
          <button class="search-close-btn" @click="showSearchModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="search-modal-content">
          <div class="search-input-group">
            <input 
              type="text" 
              placeholder="Masukkan kata kunci..." 
              class="search-input" 
              v-model="searchQuery"
              @keyup.enter="performSearch"
            />
            <button class="search-submit-btn enhanced-btn" @click="performSearch">
              <i class="fas fa-search"></i>
              Cari
            </button>
          </div>
          
          <!-- Search Suggestions -->
          <div class="search-suggestions" v-if="searchSuggestions.length > 0">
            <h4>Pencarian Populer:</h4>
            <div class="suggestions-list">
              <button 
                v-for="suggestion in searchSuggestions" 
                :key="suggestion"
                class="suggestion-item"
                @click="selectSuggestion(suggestion)"
              >
                <i class="fas fa-search"></i>
                {{ suggestion }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import SearchIcon from './SearchIcon.vue'
import ThemeToggle from './ThemeToggle.vue'
import ClockPopup from './ClockPopup.vue'

// Reactive data
const showClockPopup = ref(false)
const showSearchModal = ref(false)
const currentTime = ref('00:46:09')
const currentLang = ref('id')
const searchQuery = ref('')

// Search suggestions
const searchSuggestions = ref([
  'Jasa PayPal',
  'Jasa Transfer Bitcoin',
  'Jasa Bayar Skrill',
  'Jasa Top Up Game',
  'Jasa Pembayaran Online'
])

let timeInterval

// Methods
const toggleClockPopup = () => {
  showClockPopup.value = !showClockPopup.value
}

const toggleSearchModal = () => {
  showSearchModal.value = !showSearchModal.value
}

const setLanguage = (lang) => {
  currentLang.value = lang
  // Implement language switching logic here
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    // Implement search logic here
    console.log('Searching for:', searchQuery.value)
    showSearchModal.value = false
    searchQuery.value = ''
  }
}

const selectSuggestion = (suggestion) => {
  searchQuery.value = suggestion
  performSearch()
}

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('id-ID', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Lifecycle
onMounted(() => {
  timeInterval = setInterval(updateTime, 1000)
  updateTime()
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.header-top-bar {
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header-utilities {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.contact-info {
  display: flex;
  gap: 20px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #b8c5d1;
  font-size: 13px;
}

.contact-item i {
  color: #4fc3f7;
}

.utility-icons {
  display: flex;
  align-items: center;
  gap: 15px;
}

.utility-item {
  display: flex;
  align-items: center;
}

.language-switcher {
  gap: 8px;
}

.lang-btn {
  background: none;
  border: none;
  color: #b8c5d1;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.lang-btn.active {
  color: #4fc3f7;
  background: rgba(79, 195, 247, 0.1);
}

.lang-btn:hover {
  color: #4fc3f7;
  background: rgba(79, 195, 247, 0.1);
}

.separator {
  color: #636e72;
  font-size: 12px;
}

.testimoni-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #fd79a8, #e84393);
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.testimoni-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(253, 121, 168, 0.3);
}

.main-navigation {
  padding: 15px 0;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.site-logo .logo-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.logo-img {
  width: 40px;
  height: 40px;
  border-radius: 8px;
}

.logo-img-responsive {
  width: 48px;
  height: 48px;
  min-width: 40px;
  min-height: 40px;
  max-width: 60px;
  max-height: 60px;
  object-fit: contain;
  transition: all 0.3s ease;
}

@media (min-width: 640px) {
  .logo-img-responsive {
    width: 52px;
    height: 52px;
    max-width: 64px;
    max-height: 64px;
  }
}

@media (min-width: 768px) {
  .logo-img-responsive {
    width: 56px;
    height: 56px;
    max-width: 68px;
    max-height: 68px;
  }
}

@media (min-width: 1024px) {
  .logo-img-responsive {
    width: 60px;
    height: 60px;
    max-width: 72px;
    max-height: 72px;
  }
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
}

.logo-text-responsive {
  font-size: 18px;
  transition: all 0.3s ease;
}

@media (min-width: 640px) {
  .logo-text-responsive {
    font-size: 20px;
  }
}

@media (min-width: 768px) {
  .logo-text-responsive {
    font-size: 22px;
  }
}

@media (min-width: 1024px) {
  .logo-text-responsive {
    font-size: 24px;
  }
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 30px;
  margin: 0;
  padding: 0;
}

.nav-link {
  color: #b8c5d1;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover,
.nav-link.active {
  color: #4fc3f7;
  background: rgba(79, 195, 247, 0.1);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  width: 0;
  height: 2px;
  background: #4fc3f7;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 80%;
}

.cta-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  text-decoration: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #00b894, #00cec9);
  color: white;
  font-weight: 600;
  transition: all 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 184, 148, 0.3);
}

.clock-trigger {
  position: relative;
}

.clock-button {
  background: rgba(79, 195, 247, 0.1);
  border: 1px solid rgba(79, 195, 247, 0.3);
  border-radius: 8px;
  padding: 8px 12px;
  color: #4fc3f7;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.clock-button:hover {
  background: rgba(79, 195, 247, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(79, 195, 247, 0.2);
}

.time-display {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  font-size: 12px;
}

/* Search Modal */
.search-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}

.search-modal {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 16px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
}

.search-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
  margin: 0;
  font-size: 18px;
}

.search-title i {
  color: #4fc3f7;
}

.search-close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-close-btn:hover {
  background: rgba(255, 107, 107, 0.8);
  transform: rotate(90deg);
}

.search-modal-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-input-group {
  display: flex;
  gap: 12px;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 14px;
}

.search-input::placeholder {
  color: #b8c5d1;
}

.search-input:focus {
  outline: none;
  border-color: #4fc3f7;
  box-shadow: 0 0 0 2px rgba(79, 195, 247, 0.2);
}

.search-submit-btn {
  padding: 12px 20px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-suggestions h4 {
  color: #fff;
  font-size: 14px;
  margin-bottom: 10px;
}

.suggestions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.suggestion-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 6px 12px;
  color: #b8c5d1;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.suggestion-item:hover {
  background: rgba(79, 195, 247, 0.1);
  color: #4fc3f7;
  border-color: rgba(79, 195, 247, 0.3);
}

.suggestion-item i {
  font-size: 10px;
}

/* Responsive */
@media (max-width: 768px) {
  .header-utilities {
    flex-direction: column;
    gap: 10px;
  }
  
  .contact-info {
    gap: 15px;
    font-size: 12px;
  }
  
  .utility-icons {
    gap: 10px;
  }
  
  .nav-content {
    flex-direction: column;
    gap: 15px;
  }
  
  .nav-menu {
    gap: 15px;
  }
  
  .search-modal {
    padding: 20px;
    margin: 20px;
  }
  
  .search-input-group {
    flex-direction: column;
  }
  
  .search-submit-btn {
    justify-content: center;
  }
}
</style>
