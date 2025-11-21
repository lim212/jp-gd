<script lang="ts" setup>
// The LiveChatWidget component is no longer used as we've switched to direct script injection
// import { LiveChatWidget } from '@livechat/widget-vue'
</script>

<template>
  <!--
    LiveChat is now loaded via direct script injection in app/plugins/livechat.ts
    This container is kept for the CSS styling which helps position the widget correctly
  -->
  <div class="livechat-fixed-container"></div>
</template>

<style scoped>
/* LiveChat Widget Fixed Positioning - Improved to prevent layout shifts */
.livechat-fixed-container {
  position: fixed;
  z-index: 2147483001;
  pointer-events: none;
  /* Container doesn't need to take full width/height */
  width: 0;
  height: 0;
  bottom: 0;
  right: 0;
  /* Ensure it doesn't affect document flow */
  overflow: visible;
}

/* Target the actual LiveChat iframe that gets injected */
.livechat-fixed-container :deep(iframe),
.livechat-fixed-container :deep(#chat-widget-container),
.livechat-fixed-container :deep(div[data-testid="chat-widget-container"]) {
  position: fixed !important;
  pointer-events: auto !important;
  z-index: 2147483001 !important;
  display: block !important;
  visibility: visible !important;
  /* Default position for desktop - positioned at the very bottom with transparent background */
  bottom: 0 !important;
  right: 20px !important;
  max-height: calc(100vh - 20px) !important;
  max-width: 400px !important;
  min-height: 60px !important;
  background: transparent !important;
  overflow: hidden !important;
  /* Prevent layout shifts */
  transform: translateZ(0) !important;
  will-change: transform !important;
  /* Ensure it doesn't push content */
  margin: 0 !important;
  padding: 0 !important;
}

/* Tablet positioning - positioned at the very bottom */
@media (min-width: 640px) and (max-width: 1023px) {
  .livechat-fixed-container :deep(iframe),
  .livechat-fixed-container :deep(#chat-widget-container),
  .livechat-fixed-container :deep(div[data-testid="chat-widget-container"]) {
    bottom: 0 !important;
    right: 15px !important;
    max-width: 360px !important;
    background: transparent !important;
  }
}

/* Mobile positioning - positioned at the very bottom with transparent background */
@media (max-width: 639px) {
  .livechat-fixed-container :deep(iframe),
  .livechat-fixed-container :deep(#chat-widget-container),
  .livechat-fixed-container :deep(div[data-testid="chat-widget-container"]) {
    bottom: 0 !important;
    right: 10px !important;
    max-width: 300px !important;
    max-height: calc(100vh - 50px) !important;
    /* Ensure it doesn't push content on small screens */
    transform: translateZ(0) !important;
    will-change: transform !important;
    /* Ensure visibility over other elements */
    z-index: 2147483001 !important;
    /* Make background transparent */
    background: transparent !important;
  }
}
</style>



