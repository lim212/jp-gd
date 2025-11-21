<script setup lang="ts">
import BlogListComponent from "~/app/components/BlogList.vue";
import BlogSidebar from "~/app/components/LazyBlogSidebar.vue";

definePageMeta({ 
  name: 'blog',
  layout: 'default'
})

// SEO for blog listing page
useSeoMeta({
  title: 'Blog Terbaru - Jasa Pembayaran Online',
  ogTitle: 'Blog Terbaru - Jasa Pembayaran Online',
  twitterTitle: 'Blog Terbaru - Jasa Pembayaran Online',
  description: 'Baca artikel terbaru seputar layanan pembayaran online, tips keamanan transaksi, dan perkembangan teknologi PAYTECH dari JasaPembayaran.com',
  ogDescription: 'Baca artikel terbaru seputar layanan pembayaran online, tips keamanan transaksi, dan perkembangan teknologi PAYTECH dari JasaPembayaran.com',
  twitterDescription: 'Baca artikel terbaru seputar layanan pembayaran online, tips keamanan transaksi, dan perkembangan teknologi PAYTECH dari JasaPembayaran.com',
});

useHead({
  meta: [
    { name: 'keywords', content: 'blog, artikel, pembayaran online, PAYTECH, tips keamanan, teknologi pembayaran' }
  ]
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-blue-950/30 dark:to-indigo-950/50">
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-700 dark:via-purple-700 dark:to-indigo-700 shadow-lg">
      <div class="container mx-auto px-4 py-6">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
            📚 Blog Artikel Terbaru
          </h1>
          <p class="text-sm text-blue-100 dark:text-blue-200 mb-3 leading-relaxed">
            Temukan artikel menarik tentang teknologi pembayaran dan PAYTECH
          </p>
          <div class="flex items-center justify-center space-x-3 text-blue-100 dark:text-blue-200 text-xs">
            <div class="flex items-center space-x-1">
              <UIcon name="i-lucide-newspaper" class="w-3 h-3" />
              <span>Artikel Berkualitas</span>
            </div>
            <div class="w-1 h-1 bg-blue-300 rounded-full"></div>
            <div class="flex items-center space-x-1">
              <UIcon name="i-lucide-clock" class="w-3 h-3" />
              <span>Update Terbaru</span>
            </div>
            <div class="w-1 h-1 bg-blue-300 rounded-full"></div>
            <div class="flex items-center space-x-1">
              <UIcon name="i-lucide-shield-check" class="w-3 h-3" />
              <span>Konten Terpercaya</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-4">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- Main Content -->
          <div class="lg:col-span-3">
            <!-- Blog List Component with list mode -->
            <BlogListComponent mode="list" />
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <div class="sticky top-4 space-y-4">
              <BlogSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

