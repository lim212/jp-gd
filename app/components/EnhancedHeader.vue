<template>
  <header class="enhanced-header">
    <!-- Top bar with utilities -->
    <div class="header-top">
      <div class="container">
        <div class="header-utilities">
          <!-- Contact info -->
          <div class="contact-info">
            <span><i class="fas fa-phone"></i> +62 123 456 7890</span>
            <span><i class="fas fa-envelope"></i> info@jasapembayaran.com</span>
          </div>
          
          <!-- Utility icons -->
          <div class="utility-icons">
            <!-- Search Icon -->
            <SearchIcon @search-toggle="openSearchModal" />
            
            <!-- Language Switcher -->
            <div class="language-switcher">
              <button class="lang-btn active">ID</button>
              <span class="separator">|</span>
              <button class="lang-btn">EN</button>
            </div>
            
            <!-- Theme Toggle -->
            <ThemeToggle />
            
            <!-- Testimoni Link -->
            <button class="testimoni-btn">
              <i class="fas fa-star"></i>
              Testimoni
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Main navigation -->
    <nav class="main-nav">
      <div class="container">
        <div class="nav-content">
          <!-- Logo -->
          <div class="logo">
            <img src="/logo.png" alt="Jasa Pembayaran" class="logo-img-responsive" />
            <span class="logo-text logo-text-responsive">Jasa Pembayaran</span>
          </div>
          
          <!-- Navigation Menu -->
          <ul class="nav-menu">
            <li><a href="/" class="nav-link active">Beranda</a></li>
            <li><a href="/layanan" class="nav-link">Layanan</a></li>
            <li><a href="/tentang" class="nav-link">Tentang</a></li>
            <li><a href="/kontak" class="nav-link">Kontak</a></li>
          </ul>
          
          <!-- CTA Button -->
          <button class="cta-btn enhanced-btn">
            <i class="fas fa-rocket"></i>
            Mulai Sekarang
          </button>
        </div>
      </div>
    </nav>
    
    <!-- Clock Icon in navigation -->
    <div class="clock-trigger">
      <button class="clock-btn" @click="toggleClockPopup">
        <i class="fas fa-clock"></i>
        <span class="time-display">{{ currentTime }}</span>
      </button>
    </div>
    
    <!-- Clock Popup -->
    <ClockPopup :is-open="showClockPopup" @close="showClockPopup = false" />
    
    <!-- Search Modal (placeholder) -->
    <div v-if="showSearchModal" class="search-modal-overlay" @click="showSearchModal = false">
      <div class="search-modal" @click.stop>
        <div class="search-header">
          <h3>Cari Layanan</h3>
          <button class="close-btn" @click="showSearchModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="search-content">
          <input type="text" placeholder="Masukkan kata kunci..." class="search-input" />
          <button class="search-submit enhanced-btn">Cari</button>
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

const showClockPopup = ref(false)
const showSearchModal = ref(false)
const currentTime = ref('00:46:09')

let timeInterval

const toggleClockPopup = () => {
  showClockPopup.value = !showClockPopup.value
}

const openSearchModal = () => {
  showSearchModal.value = true
}

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('id-ID', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  })
}

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
.enhanced-header {
  position: relative;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.header-top {
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
  color: #b8c5d1;
  font-size: 13px;
}

.contact-info span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.contact-info i {
  color: #4fc3f7;
}

.utility-icons {
  display: flex;
  align-items: center;
  gap: 15px;
}

.language-switcher {
  display: flex;
  align-items: center;
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

.testimoni-btn {
  background: linear-gradient(135deg, #fd79a8, #e84393);
  border: none;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.testimoni-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(253, 121, 168, 0.3);
}

.main-nav {
  padding: 15px 0;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo img {
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

.cta-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #00b894, #00cec9);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 184, 148, 0.3);
}

.clock-trigger {
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
}

.clock-btn {
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

.clock-btn:hover {
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

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-header h3 {
  color: #fff;
  margin: 0;
}

.search-content {
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

.search-submit {
  padding: 12px 20px;
  white-space: nowrap;
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
  
  .clock-trigger {
    position: static;
    transform: none;
    margin-top: 10px;
  }
  
  .search-modal {
    padding: 20px;
  }
  
  .search-content {
    flex-direction: column;
  }
}
</style>
