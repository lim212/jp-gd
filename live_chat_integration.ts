import { LiveChatWidget } from '@livechat/widget-vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('LiveChatWidget', LiveChatWidget)
})
