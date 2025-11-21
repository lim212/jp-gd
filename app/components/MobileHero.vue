<template>
  <section class="mobile-hero">
    <!-- Hero Background with Parallax Effect -->
    <div class="mobile-hero-background">
      <div class="mobile-hero-gradient"></div>
      <div class="mobile-hero-particles" ref="particlesContainer"></div>
    </div>

    <!-- Hero Content -->
    <div class="mobile-hero-content">
      <div class="mobile-container">
        <!-- Main Hero Text -->
        <div class="mobile-hero-text">
          <h1 class="mobile-hero-title mobile-fade-in">
            <span class="mobile-hero-title-main">Jasa PayPal</span>
            <span class="mobile-hero-title-sub">Terpercaya</span>
          </h1>
          
          <p class="mobile-hero-description mobile-fade-in" style="animation-delay: 0.2s">
            Layanan pembayaran online terpercaya sejak 2011. 
            Isi saldo, bayar, dan kirim dengan aman dan cepat.
          </p>

          <!-- Hero Stats -->
          <div class="mobile-hero-stats mobile-fade-in" style="animation-delay: 0.4s">
            <div class="mobile-hero-stat">
              <div class="mobile-hero-stat-number">14+</div>
              <div class="mobile-hero-stat-label">Tahun Pengalaman</div>
            </div>
            <div class="mobile-hero-stat">
              <div class="mobile-hero-stat-number">50K+</div>
              <div class="mobile-hero-stat-label">Transaksi Sukses</div>
            </div>
            <div class="mobile-hero-stat">
              <div class="mobile-hero-stat-number">99%</div>
              <div class="mobile-hero-stat-label">Kepuasan Pelanggan</div>
            </div>
          </div>

          <!-- CTA Buttons -->
          <div class="mobile-hero-actions mobile-fade-in" style="animation-delay: 0.6s">
            <button
              class="mobile-btn mobile-btn-primary mobile-hero-cta"
              @click="scrollToServices"
            >
              <UIcon name="i-lucide-hand-coins" class="mobile-icon" />
              <span>Mulai Transaksi</span>
            </button>
            
            <button
              class="mobile-btn mobile-btn-glass mobile-hero-secondary"
              @click="scrollToAbout"
            >
              <UIcon name="i-lucide-info" class="mobile-icon" />
              <span>Pelajari Lebih</span>
            </button>
          </div>

          <!-- Trust Indicators -->
          <div class="mobile-hero-trust mobile-fade-in" style="animation-delay: 0.8s">
            <div class="mobile-hero-trust-item">
              <UIcon name="i-lucide-shield-check" class="mobile-hero-trust-icon" />
              <span>100% Aman</span>
            </div>
            <div class="mobile-hero-trust-item">
              <UIcon name="i-lucide-clock" class="mobile-hero-trust-icon" />
              <span>Proses Cepat</span>
            </div>
            <div class="mobile-hero-trust-item">
              <UIcon name="i-lucide-headphones" class="mobile-hero-trust-icon" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>

        <!-- Hero Visual -->
        <div class="mobile-hero-visual mobile-fade-in" style="animation-delay: 1s">
          <div class="mobile-hero-card">
            <div class="mobile-hero-card-header">
              <div class="mobile-hero-card-avatar">
                <UIcon name="i-lucide-user" class="mobile-hero-card-avatar-icon" />
              </div>
              <div class="mobile-hero-card-info">
                <div class="mobile-hero-card-name">John Doe</div>
                <div class="mobile-hero-card-status">
                  <div class="mobile-hero-card-status-dot"></div>
                  <span>Verified Customer</span>
                </div>
              </div>
            </div>
            
            <div class="mobile-hero-card-content">
              <div class="mobile-hero-card-transaction">
                <div class="mobile-hero-card-transaction-label">PayPal Transfer</div>
                <div class="mobile-hero-card-transaction-amount">$500.00</div>
              </div>
              
              <div class="mobile-hero-card-progress">
                <div class="mobile-hero-card-progress-bar">
                  <div class="mobile-hero-card-progress-fill"></div>
                </div>
                <div class="mobile-hero-card-progress-text">Processing...</div>
              </div>
            </div>
            
            <div class="mobile-hero-card-footer">
              <div class="mobile-hero-card-time">
                <UIcon name="i-lucide-clock" class="mobile-icon" />
                <span>2 minutes ago</span>
              </div>
              <div class="mobile-hero-card-status-badge success">
                <UIcon name="i-lucide-check" class="mobile-icon" />
                <span>Completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="mobile-hero-scroll-indicator mobile-fade-in" style="animation-delay: 1.2s">
      <div class="mobile-hero-scroll-text">Scroll untuk melihat lebih</div>
      <div class="mobile-hero-scroll-arrow">
        <UIcon name="i-lucide-chevron-down" class="mobile-hero-scroll-icon" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Refs
const particlesContainer = ref<HTMLDivElement>()

// Methods
const scrollToServices = () => {
  const servicesSection = document.querySelector('#services')
  if (servicesSection) {
    servicesSection.scrollIntoView({ behavior: 'smooth' })
  }
}

const scrollToAbout = () => {
  const aboutSection = document.querySelector('#about')
  if (aboutSection) {
    aboutSection.scrollIntoView({ behavior: 'smooth' })
  }
}

// Particle animation
const createParticles = () => {
  if (!particlesContainer.value) return

  const particles = []
  const particleCount = 20

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div')
    particle.className = 'mobile-hero-particle'
    particle.style.left = Math.random() * 100 + '%'
    particle.style.animationDelay = Math.random() * 3 + 's'
    particle.style.animationDuration = (Math.random() * 3 + 2) + 's'
    particlesContainer.value.appendChild(particle)
  }
}

// Parallax effect
const handleParallax = () => {
  const scrolled = window.pageYOffset
  const parallaxElements = document.querySelectorAll('.mobile-hero-background')
  
  parallaxElements.forEach(element => {
    const speed = 0.5
    element.style.transform = `translateY(${scrolled * speed}px)`
  })
}

// Lifecycle
onMounted(() => {
  createParticles()
  window.addEventListener('scroll', handleParallax, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleParallax)
})
</script>

<style scoped>
/* Mobile Hero Styles */
.mobile-hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: linear-gradient(135deg, 
    var(--mobile-primary) 0%, 
    var(--mobile-secondary) 50%, 
    var(--mobile-accent) 100%
  );
}

.mobile-hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.mobile-hero-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(255, 122, 0, 0.1) 0%, 
    rgba(245, 179, 1, 0.1) 50%, 
    rgba(88, 166, 255, 0.1) 100%
  );
}

.mobile-hero-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.mobile-hero-particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: mobile-particle-float infinite linear;
}

@keyframes mobile-particle-float {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

.mobile-hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
  padding: var(--mobile-3xl) 0;
}

.mobile-hero-text {
  text-align: center;
  margin-bottom: var(--mobile-3xl);
}

.mobile-hero-title {
  margin-bottom: var(--mobile-lg);
}

.mobile-hero-title-main {
  display: block;
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 800;
  color: white;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  line-height: 1.1;
}

.mobile-hero-title-sub {
  display: block;
  font-size: clamp(1.5rem, 5vw, 2.5rem);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-top: var(--mobile-sm);
}

.mobile-hero-description {
  font-size: var(--mobile-text-lg);
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto var(--mobile-xl);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.mobile-hero-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--mobile-lg);
  margin-bottom: var(--mobile-2xl);
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.mobile-hero-stat {
  text-align: center;
  padding: var(--mobile-md);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.mobile-hero-stat-number {
  font-size: var(--mobile-text-2xl);
  font-weight: 700;
  color: white;
  margin-bottom: var(--mobile-xs);
}

.mobile-hero-stat-label {
  font-size: var(--mobile-text-sm);
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.mobile-hero-actions {
  display: flex;
  flex-direction: column;
  gap: var(--mobile-md);
  align-items: center;
  margin-bottom: var(--mobile-2xl);
}

.mobile-hero-cta {
  min-width: 200px;
  padding: var(--mobile-lg) var(--mobile-2xl);
  font-size: var(--mobile-text-lg);
  font-weight: 600;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

.mobile-hero-secondary {
  min-width: 180px;
  padding: var(--mobile-md) var(--mobile-xl);
  font-size: var(--mobile-text-base);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.mobile-hero-trust {
  display: flex;
  justify-content: center;
  gap: var(--mobile-lg);
  flex-wrap: wrap;
}

.mobile-hero-trust-item {
  display: flex;
  align-items: center;
  gap: var(--mobile-sm);
  font-size: var(--mobile-text-sm);
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.mobile-hero-trust-icon {
  width: 16px;
  height: 16px;
  color: rgba(255, 255, 255, 0.8);
}

.mobile-hero-visual {
  display: flex;
  justify-content: center;
  margin-top: var(--mobile-2xl);
}

.mobile-hero-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: var(--mobile-xl);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  max-width: 320px;
  width: 100%;
  animation: mobile-card-float 6s ease-in-out infinite;
}

@keyframes mobile-card-float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.mobile-hero-card-header {
  display: flex;
  align-items: center;
  gap: var(--mobile-md);
  margin-bottom: var(--mobile-lg);
}

.mobile-hero-card-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--mobile-primary), var(--mobile-secondary));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-hero-card-avatar-icon {
  width: 24px;
  height: 24px;
  color: white;
}

.mobile-hero-card-info {
  flex: 1;
}

.mobile-hero-card-name {
  font-weight: 600;
  color: var(--text);
  margin-bottom: var(--mobile-xs);
}

.mobile-hero-card-status {
  display: flex;
  align-items: center;
  gap: var(--mobile-xs);
  font-size: var(--mobile-text-sm);
  color: var(--text-secondary);
}

.mobile-hero-card-status-dot {
  width: 8px;
  height: 8px;
  background: var(--mobile-success);
  border-radius: 50%;
}

.mobile-hero-card-content {
  margin-bottom: var(--mobile-lg);
}

.mobile-hero-card-transaction {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--mobile-md);
}

.mobile-hero-card-transaction-label {
  font-size: var(--mobile-text-sm);
  color: var(--text-secondary);
}

.mobile-hero-card-transaction-amount {
  font-size: var(--mobile-text-xl);
  font-weight: 700;
  color: var(--text);
}

.mobile-hero-card-progress {
  margin-bottom: var(--mobile-md);
}

.mobile-hero-card-progress-bar {
  height: 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: var(--mobile-xs);
}

.mobile-hero-card-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--mobile-primary), var(--mobile-secondary));
  border-radius: 3px;
  width: 100%;
  animation: mobile-progress-fill 2s ease-in-out infinite;
}

@keyframes mobile-progress-fill {
  0% {
    width: 0%;
  }
  50% {
    width: 100%;
  }
  100% {
    width: 100%;
  }
}

.mobile-hero-card-progress-text {
  font-size: var(--mobile-text-sm);
  color: var(--text-secondary);
}

.mobile-hero-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mobile-hero-card-time {
  display: flex;
  align-items: center;
  gap: var(--mobile-xs);
  font-size: var(--mobile-text-sm);
  color: var(--text-secondary);
}

.mobile-hero-card-status-badge {
  display: flex;
  align-items: center;
  gap: var(--mobile-xs);
  padding: var(--mobile-xs) var(--mobile-sm);
  border-radius: 20px;
  font-size: var(--mobile-text-sm);
  font-weight: 600;
}

.mobile-hero-card-status-badge.success {
  background: rgba(34, 197, 94, 0.1);
  color: var(--mobile-success);
}

.mobile-hero-scroll-indicator {
  position: absolute;
  bottom: var(--mobile-xl);
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  z-index: 2;
}

.mobile-hero-scroll-text {
  font-size: var(--mobile-text-sm);
  margin-bottom: var(--mobile-sm);
}

.mobile-hero-scroll-arrow {
  animation: mobile-scroll-bounce 2s infinite;
}

@keyframes mobile-scroll-bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.mobile-hero-scroll-icon {
  width: 24px;
  height: 24px;
}

/* Responsive adjustments */
@media (min-width: 480px) {
  .mobile-hero-actions {
    flex-direction: row;
    justify-content: center;
  }
  
  .mobile-hero-stats {
    max-width: 500px;
  }
}

@media (min-width: 768px) {
  .mobile-hero-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--mobile-3xl);
    align-items: center;
  }
  
  .mobile-hero-text {
    text-align: left;
    margin-bottom: 0;
  }
  
  .mobile-hero-stats {
    justify-content: flex-start;
    margin-left: 0;
    margin-right: 0;
  }
  
  .mobile-hero-actions {
    justify-content: flex-start;
  }
  
  .mobile-hero-trust {
    justify-content: flex-start;
  }
}

@media (min-width: 1024px) {
  .mobile-hero-title-main {
    font-size: 5rem;
  }
  
  .mobile-hero-title-sub {
    font-size: 3rem;
  }
  
  .mobile-hero-card {
    max-width: 400px;
  }
}

/* Dark mode adjustments */
.dark .mobile-hero-card {
  background: rgba(17, 24, 39, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.dark .mobile-hero-card-name {
  color: var(--text);
}

.dark .mobile-hero-card-transaction-amount {
  color: var(--text);
}

/* Performance optimizations */
.mobile-hero-particle {
  will-change: transform, opacity;
}

.mobile-hero-card {
  will-change: transform;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .mobile-hero-card {
    animation: none;
  }
  
  .mobile-hero-particle {
    animation: none;
  }
  
  .mobile-hero-card-progress-fill {
    animation: none;
    width: 100%;
  }
  
  .mobile-hero-scroll-arrow {
    animation: none;
  }
}
</style>

