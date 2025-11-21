
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

// Initialize i18n
useI18n() // Initialize i18n without unused variables
</script>

<template>
  <NuxtLayout>
    <AppHeader />
    <div class="app-content-offset">
      <NuxtPage />
    </div>
    <AppFooter />
    <LiveChatComponent />
  </NuxtLayout>
</template>

<style scoped>
.app-content-offset {
  padding-top: 92px;
}
@media (min-width: 640px) {
  .app-content-offset { padding-top: 104px; }
}
@media (min-width: 768px) {
  .app-content-offset { padding-top: 116px; }
}
@media (min-width: 1024px) {
  .app-content-offset { padding-top: 128px; }
}
@media (min-width: 1280px) {
  .app-content-offset { padding-top: 136px; }
}
</style>

