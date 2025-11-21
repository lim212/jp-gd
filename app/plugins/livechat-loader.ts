// LiveChat helper plugin
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  // We no longer register the LiveChatWidget component as we've switched to direct script injection
  // The actual LiveChat initialization is now fully handled by the livechat.ts plugin

  return {
    provide: {
      livechat: {
        isReady: () => typeof window !== 'undefined' && !!window.LiveChatWidget
      }
    }
  }
})

// Add type definitions for LiveChatWidget
declare global {
  interface Window {
    LiveChatWidget?: {
      on: (event: string, callback: () => void) => void;
      // Add other LiveChatWidget methods as needed
      [key: string]: unknown;
    }
  }
}
