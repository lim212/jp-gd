// components/blog/BlogList.vue
<script setup lang="ts">
import type { BlogPostsResponse } from '~/types/blog'

const currentPage = ref(1)
const { data: blogResponse, refresh } = await useFetch<BlogPostsResponse>('/api/blog', {
  query: computed(() => ({
    page: currentPage.value
  })),
  watch: [currentPage] // Tambahkan watch untuk reactive fetch
})

const posts = computed(() => blogResponse.value?.posts || [])
const totalPages = computed(() => blogResponse.value?.totalPages || 0)

async function changePage(page: number) {
  currentPage.value = page
  await refresh() // Refresh data setelah page berubah
}
</script>

<template>
  <div class="container mx-auto px-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
      <BlogCard
        v-for="post in posts"
        :key="post.id"
        :post="post"
      />
    </div>

    <UPagination
      v-if="totalPages > 1"
      v-model="currentPage"
      :total="totalPages"
      :pageCount="totalPages"
      class="flex justify-center my-8"
      @change="changePage"
    />
  </div>
</template>

