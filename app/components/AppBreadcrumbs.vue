<script setup lang="ts">
interface BreadcrumbItem {
  text: string;
  href?: string;
  current?: boolean;
}

const props = defineProps<{
  items: BreadcrumbItem[];
}>();

// Generate JSON-LD schema for breadcrumbs
const breadcrumbsSchema = computed(() => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': props.items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.text,
      'item': item.href ? `https://jasapembayaran.com${item.href}` : undefined,
      'name': item.text.includes('Jasa PayPal') ? item.text : item.text
    }))
  };
});

// Add schema to head
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(breadcrumbsSchema.value)
    }
  ]
});
</script>

<template>
  <nav aria-label="Breadcrumb" class="mb-4">
    <ol class="flex flex-wrap items-center gap-x-2 text-sm">
      <li v-for="(item, index) in items" :key="index" class="flex items-center">
        <template v-if="index > 0">
          <span class="mx-2 text-gray-400">/</span>
        </template>

        <NuxtLink
          v-if="item.href && !item.current"
          :to="item.href"
          class="text-gray-600 hover:text-(--ui-primary) transition-colors duration-300"
        >
          {{ item.text }}
        </NuxtLink>

        <span
          v-else
          class="font-medium"
          :class="item.current ? 'text-(--ui-primary)' : 'text-gray-600'"
        >
          {{ item.text }}
        </span>
      </li>
    </ol>
  </nav>
</template>

