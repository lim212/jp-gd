<template>
  <div class="w-full mt-8 mb-6 bg-gradient-to-br from-indigo-400 via-purple-300 to-pink-500 dark:from-indigo-600 dark:via-purple-500 dark:to-pink-700 shadow-2xl border border-indigo-300 dark:border-indigo-600 overflow-hidden rounded-3xl relative backdrop-blur-sm">
    <!-- Super Cool Animated Background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Subtle floating orbs with reduced blur -->
      <div class="absolute top-10 right-10 w-32 h-32 bg-gradient-to-r from-indigo-400/10 to-cyan-400/10 rounded-full animate-pulse blur-sm"></div>
      <div class="absolute top-20 right-32 w-20 h-20 bg-gradient-to-r from-cyan-400/10 to-pink-400/10 rounded-full animate-bounce blur-sm"></div>
      <div class="absolute bottom-10 left-10 w-28 h-28 bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 rounded-full animate-pulse blur-sm"></div>
      <div class="absolute bottom-20 left-32 w-16 h-16 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full animate-bounce blur-sm"></div>
      
      <!-- Gradient mesh overlay -->
      <div class="absolute inset-0 bg-gradient-to-br from-transparent via-blue-100/10 to-cyan-100/10 dark:via-blue-900/5 dark:to-cyan-900/5"></div>
      
      <!-- Animated grid pattern -->
      <div class="absolute inset-0 opacity-5 dark:opacity-10">
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0); background-size: 20px 20px; animation: grid-move 20s linear infinite;"></div>
      </div>
    </div>
    <!-- Section Title -->
    <div class="text-center mb-8">
      <div class="flex items-center gap-4 justify-center relative z-10">
        <div class="relative">
          <div class="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full blur-sm opacity-40"></div>
          <UIcon name="i-lucide-layers" class="text-indigo-200 size-8 md:size-10 relative z-10 drop-shadow-lg" />
        </div>
        <span class="relative text-xl md:text-2xl font-bold px-4 py-2 rounded-lg bg-black/80 backdrop-blur-sm border border-white/30">
          <span class="text-white drop-shadow-2xl dark:text-white dark:drop-shadow-2xl">🚀 Blog</span> 
          <span class="text-indigo-200 drop-shadow-2xl dark:text-indigo-200 dark:drop-shadow-2xl">Lengkap</span> 
          <span class="text-white drop-shadow-2xl dark:text-white dark:drop-shadow-2xl">🚀</span>
          <span class="absolute -bottom-2 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 rounded-full shadow-lg"></span>
        </span>
        <div class="relative">
          <div class="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-sm opacity-40"></div>
          <UIcon name="i-lucide-star" class="text-purple-200 size-8 md:size-10 relative z-10 drop-shadow-lg" />
        </div>
      </div>
      
      <div class="max-w-4xl mx-auto px-0 sm:px-4 mb-2 relative z-10 mt-4">
        <div class="text-center">
          <div class="bg-black/70 backdrop-blur-sm rounded-lg px-4 py-3 mb-3 border border-white/20">
            <p class="text-white dark:text-white text-base md:text-lg leading-relaxed font-medium drop-shadow-2xl dark:drop-shadow-2xl">
              🎯 <span class="text-indigo-200 dark:text-indigo-200 font-bold">Konten Blog Terlengkap & Terupdate!</span> 🎯
            </p>
          </div>
          <div class="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
            <p class="text-white dark:text-white text-sm md:text-base leading-relaxed drop-shadow-2xl dark:drop-shadow-2xl">
              📖 Temukan artikel trending, kategori populer, dan rekomendasi editor terbaik untuk menambah wawasan digital Anda
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Three Additional Blog Boxes -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 lg:px-6 relative z-10 py-6">
      
      <!-- Box 1: Artikel Trending -->
      <div class="blog-additional-card trending-card relative overflow-hidden rounded-2xl shadow-2xl bg-white dark:bg-gray-800/90 border border-orange-200/40 dark:border-orange-600/40 h-full flex flex-col group hover:scale-105 transition-all duration-300">
        <!-- Animated top accent line -->
        <div class="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 z-10 shadow-lg"></div>
        
        <!-- Corner accents -->
        <div class="absolute top-0 right-0 w-20 h-20 bg-orange-50/60 dark:bg-orange-900/20 rounded-bl-2xl"></div>
        <div class="absolute bottom-0 left-0 w-20 h-20 bg-amber-50/60 dark:bg-amber-900/20 rounded-tr-2xl"></div>
        
        <!-- Header -->
        <div class="blog-card-header bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4 relative z-10">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <UIcon name="i-lucide-trending-up" class="text-white size-6" />
            </div>
            <div>
              <h3 class="text-white font-bold text-lg">Artikel Trending</h3>
              <p class="text-orange-100 text-sm">Paling Viral Hari Ini</p>
            </div>
          </div>
        </div>
        
        <!-- Content -->
        <div class="blog-card-body bg-white dark:bg-gray-800 px-6 py-5 flex-grow">
          <div class="space-y-4">
            <!-- Trending Article 1 -->
            <div class="trending-item flex items-start gap-3 p-3 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl border border-orange-200/60 dark:border-orange-600/60 hover:shadow-lg transition-all duration-200">
              <div class="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-white font-bold text-sm">1</span>
              </div>
              <div class="flex-grow">
                <h4 class="font-semibold text-gray-800 dark:text-gray-200 text-sm leading-tight">Cara Mudah Top Up PayPal 2024</h4>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-orange-600 dark:text-orange-400 text-xs font-medium">🔥 Trending</span>
                  <span class="text-gray-500 dark:text-gray-400 text-xs">2.5k views</span>
                </div>
              </div>
            </div>
            
            <!-- Trending Article 2 -->
            <div class="trending-item flex items-start gap-3 p-3 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl border border-orange-200/60 dark:border-orange-600/60 hover:shadow-lg transition-all duration-200">
              <div class="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-white font-bold text-sm">2</span>
              </div>
              <div class="flex-grow">
                <h4 class="font-semibold text-gray-800 dark:text-gray-200 text-sm leading-tight">Jasa PayPal Terpercaya Indonesia</h4>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-orange-600 dark:text-orange-400 text-xs font-medium">🔥 Trending</span>
                  <span class="text-gray-500 dark:text-gray-400 text-xs">1.8k views</span>
                </div>
              </div>
            </div>
            
            <!-- Trending Article 3 -->
            <div class="trending-item flex items-start gap-3 p-3 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl border border-orange-200/60 dark:border-orange-600/60 hover:shadow-lg transition-all duration-200">
              <div class="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-white font-bold text-sm">3</span>
              </div>
              <div class="flex-grow">
                <h4 class="font-semibold text-gray-800 dark:text-gray-200 text-sm leading-tight">Tips Keamanan Transaksi Online</h4>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-orange-600 dark:text-orange-400 text-xs font-medium">🔥 Trending</span>
                  <span class="text-gray-500 dark:text-gray-400 text-xs">1.2k views</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="blog-card-footer bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 px-6 py-4 border-t border-orange-200/60 dark:border-orange-600/60">
          <NuxtLink to="/blog" class="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold py-3 px-4 rounded-xl text-center block hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-lg hover:shadow-xl">
            Lihat Semua Trending
          </NuxtLink>
        </div>
        
        <!-- Bottom accent -->
        <div class="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-50"></div>
      </div>

      <!-- Box 2: Kategori Populer -->
      <div class="blog-additional-card categories-card relative overflow-hidden rounded-2xl shadow-2xl bg-white dark:bg-gray-800/90 border border-purple-200/40 dark:border-purple-600/40 h-full flex flex-col group hover:scale-105 transition-all duration-300">
        <!-- Animated top accent line -->
        <div class="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 z-10 shadow-lg"></div>
        
        <!-- Corner accents -->
        <div class="absolute top-0 right-0 w-20 h-20 bg-purple-50/60 dark:bg-purple-900/20 rounded-bl-2xl"></div>
        <div class="absolute bottom-0 left-0 w-20 h-20 bg-violet-50/60 dark:bg-violet-900/20 rounded-tr-2xl"></div>
        
        <!-- Header -->
        <div class="blog-card-header bg-gradient-to-r from-purple-500 to-violet-500 px-6 py-4 relative z-10">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <UIcon name="i-lucide-tags" class="text-white size-6" />
            </div>
            <div>
              <h3 class="text-white font-bold text-lg">Kategori Populer</h3>
              <p class="text-purple-100 text-sm">Topik Favorit Pembaca</p>
            </div>
          </div>
        </div>
        
        <!-- Content -->
        <div class="blog-card-body bg-white dark:bg-gray-800 px-6 py-5 flex-grow">
          <div class="space-y-4">
            <!-- Category 1 -->
            <div class="category-item flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl border border-purple-200/60 dark:border-purple-600/60 hover:shadow-lg transition-all duration-200">
              <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center flex-shrink-0">
                <UIcon name="i-lucide-credit-card" class="text-white size-4" />
              </div>
              <div class="flex-grow">
                <h4 class="font-semibold text-gray-800 dark:text-gray-200 text-sm">Jasa PayPal</h4>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-purple-600 dark:text-purple-400 text-xs font-medium">15 artikel</span>
                  <span class="text-gray-500 dark:text-gray-400 text-xs">•</span>
                  <span class="text-gray-500 dark:text-gray-400 text-xs">Populer</span>
                </div>
              </div>
            </div>
            
            <!-- Category 2 -->
            <div class="category-item flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl border border-purple-200/60 dark:border-purple-600/60 hover:shadow-lg transition-all duration-200">
              <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center flex-shrink-0">
                <UIcon name="i-lucide-bitcoin" class="text-white size-4" />
              </div>
              <div class="flex-grow">
                <h4 class="font-semibold text-gray-800 dark:text-gray-200 text-sm">Bitcoin & Crypto</h4>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-purple-600 dark:text-purple-400 text-xs font-medium">12 artikel</span>
                  <span class="text-gray-500 dark:text-gray-400 text-xs">•</span>
                  <span class="text-gray-500 dark:text-gray-400 text-xs">Trending</span>
                </div>
              </div>
            </div>
            
            <!-- Category 3 -->
            <div class="category-item flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl border border-purple-200/60 dark:border-purple-600/60 hover:shadow-lg transition-all duration-200">
              <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center flex-shrink-0">
                <UIcon name="i-lucide-shield-check" class="text-white size-4" />
              </div>
              <div class="flex-grow">
                <h4 class="font-semibold text-gray-800 dark:text-gray-200 text-sm">Keamanan Digital</h4>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-purple-600 dark:text-purple-400 text-xs font-medium">8 artikel</span>
                  <span class="text-gray-500 dark:text-gray-400 text-xs">•</span>
                  <span class="text-gray-500 dark:text-gray-400 text-xs">Penting</span>
                </div>
              </div>
            </div>
            
            <!-- Category 4 -->
            <div class="category-item flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl border border-purple-200/60 dark:border-purple-600/60 hover:shadow-lg transition-all duration-200">
              <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center flex-shrink-0">
                <UIcon name="i-lucide-trending-up" class="text-white size-4" />
              </div>
              <div class="flex-grow">
                <h4 class="font-semibold text-gray-800 dark:text-gray-200 text-sm">Tips & Tutorial</h4>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-purple-600 dark:text-purple-400 text-xs font-medium">20 artikel</span>
                  <span class="text-gray-500 dark:text-gray-400 text-xs">•</span>
                  <span class="text-gray-500 dark:text-gray-400 text-xs">Terbaru</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="blog-card-footer bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 px-6 py-4 border-t border-purple-200/60 dark:border-purple-600/60">
          <NuxtLink to="/blog" class="w-full bg-gradient-to-r from-purple-500 to-violet-500 text-white font-semibold py-3 px-4 rounded-xl text-center block hover:from-purple-600 hover:to-violet-600 transition-all duration-200 shadow-lg hover:shadow-xl">
            Lihat Semua Kategori
          </NuxtLink>
        </div>
        
        <!-- Bottom accent -->
        <div class="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-50"></div>
      </div>

      <!-- Box 3: Rekomendasi Editor -->
      <div class="blog-additional-card editor-card relative overflow-hidden rounded-2xl shadow-2xl bg-white dark:bg-gray-800/90 border border-blue-200/40 dark:border-blue-600/40 h-full flex flex-col group hover:scale-105 transition-all duration-300">
        <!-- Animated top accent line -->
        <div class="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 z-10 shadow-lg"></div>
        
        <!-- Corner accents -->
        <div class="absolute top-0 right-0 w-20 h-20 bg-blue-50/60 dark:bg-blue-900/20 rounded-bl-2xl"></div>
        <div class="absolute bottom-0 left-0 w-20 h-20 bg-cyan-50/60 dark:bg-cyan-900/20 rounded-tr-2xl"></div>
        
        <!-- Header -->
        <div class="blog-card-header bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4 relative z-10">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <UIcon name="i-lucide-star" class="text-white size-6" />
            </div>
            <div>
              <h3 class="text-white font-bold text-lg">Rekomendasi Editor</h3>
              <p class="text-blue-100 text-sm">Pilihan Terbaik Tim</p>
            </div>
          </div>
        </div>
        
        <!-- Content -->
        <div class="blog-card-body bg-white dark:bg-gray-800 px-6 py-5 flex-grow">
          <div class="space-y-4">
            <!-- Editor Pick 1 -->
            <div class="editor-item flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200/60 dark:border-blue-600/60 hover:shadow-lg transition-all duration-200">
              <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                <UIcon name="i-lucide-crown" class="text-white size-4" />
              </div>
              <div class="flex-grow">
                <h4 class="font-semibold text-gray-800 dark:text-gray-200 text-sm leading-tight">Panduan Lengkap Jasa PayPal 2024</h4>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-blue-600 dark:text-blue-400 text-xs font-medium">⭐ Editor's Choice</span>
                  <span class="text-gray-500 dark:text-gray-400 text-xs">•</span>
                  <span class="text-gray-500 dark:text-gray-400 text-xs">5 min read</span>
                </div>
              </div>
            </div>
            
            <!-- Editor Pick 2 -->
            <div class="editor-item flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200/60 dark:border-blue-600/60 hover:shadow-lg transition-all duration-200">
              <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                <UIcon name="i-lucide-award" class="text-white size-4" />
              </div>
              <div class="flex-grow">
                <h4 class="font-semibold text-gray-800 dark:text-gray-200 text-sm leading-tight">Keamanan Transaksi Digital Terbaru</h4>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-blue-600 dark:text-blue-400 text-xs font-medium">⭐ Must Read</span>
                  <span class="text-gray-500 dark:text-gray-400 text-xs">•</span>
                  <span class="text-gray-500 dark:text-gray-400 text-xs">7 min read</span>
                </div>
              </div>
            </div>
            
            <!-- Editor Pick 3 -->
            <div class="editor-item flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200/60 dark:border-blue-600/60 hover:shadow-lg transition-all duration-200">
              <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                <UIcon name="i-lucide-gem" class="text-white size-4" />
              </div>
              <div class="flex-grow">
                <h4 class="font-semibold text-gray-800 dark:text-gray-200 text-sm leading-tight">Tips Sukses Trading Bitcoin</h4>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-blue-600 dark:text-blue-400 text-xs font-medium">⭐ Recommended</span>
                  <span class="text-gray-500 dark:text-gray-400 text-xs">•</span>
                  <span class="text-gray-500 dark:text-gray-400 text-xs">10 min read</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="blog-card-footer bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 px-6 py-4 border-t border-blue-200/60 dark:border-blue-600/60">
          <NuxtLink to="/blog" class="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-3 px-4 rounded-xl text-center block hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl">
            Lihat Semua Rekomendasi
          </NuxtLink>
        </div>
        
        <!-- Bottom accent -->
        <div class="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No additional logic needed for this component
</script>

<style scoped>
/* Additional Blog Cards Styling */
.blog-additional-card {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.blog-additional-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Trending Card Specific */
.trending-card:hover {
  box-shadow: 0 25px 50px -12px rgba(251, 146, 60, 0.25);
}

/* Categories Card Specific */
.categories-card:hover {
  box-shadow: 0 25px 50px -12px rgba(147, 51, 234, 0.25);
}

/* Editor Card Specific */
.editor-card:hover {
  box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.25);
}

/* Item hover effects */
.trending-item:hover,
.category-item:hover,
.editor-item:hover {
  transform: translateX(4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .blog-additional-card {
    margin-bottom: 1rem;
  }
  
  .blog-card-header {
    padding: 1rem;
  }
  
  .blog-card-body {
    padding: 1rem;
  }
  
  .blog-card-footer {
    padding: 1rem;
  }
}

/* Animation for cards */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Grid animation */
@keyframes grid-move {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(20px, 20px);
  }
}

.blog-additional-card {
  animation: fadeInUp 0.6s ease-out;
}

.blog-additional-card:nth-child(1) {
  animation-delay: 0.1s;
}

.blog-additional-card:nth-child(2) {
  animation-delay: 0.2s;
}

.blog-additional-card:nth-child(3) {
  animation-delay: 0.3s;
}
</style>
