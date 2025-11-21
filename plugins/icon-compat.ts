// plugins/icon-compat.ts
// Purpose: Ensure a global <Icon> component is available across the app.
// In this project we are not using @nuxt/icon module, but templates rely on
// <Icon name="collection:icon" /> (e.g., circle-flags:id). We register a
// compatibility wrapper around Iconify Vue that accepts both `name` and `icon`
// props and preload critical collections offline to avoid missing icons.

import { defineNuxtPlugin } from '#app'
import { h, defineComponent } from 'vue'
import { Icon as IconifyIcon, addCollection } from '@iconify/vue'
// Offline icon collection for flags (ID/US)
// Package is present in dependencies; importing JSON makes icons available offline.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - icons.json has no TS types
import circleFlags from '@iconify-json/circle-flags/icons.json'
// Preload Lucide collection offline to eliminate "failed to load icon lucide:*" warnings
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - icons.json has no TS types
import lucide from '@iconify-json/lucide/icons.json'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - icons.json has no TS types
import mdi from '@iconify-json/mdi/icons.json'

export default defineNuxtPlugin((nuxtApp) => {
  // Preload circle-flags collection offline so <Icon name="circle-flags:..." /> always works
  try { addCollection(circleFlags as any) } catch {}
  // Preload lucide collection offline so <Icon name="lucide:..." /> works without network
  try { addCollection(lucide as any) } catch {}
  // Preload mdi collection offline so <Icon name="mdi:..." /> works without network
  try { addCollection(mdi as any) } catch {}

  // Register global <Icon> component as a compatibility wrapper (SSR/CSR safe)
  const IconCompat = defineComponent({
    name: 'Icon',
    props: {
      name: { type: [String, Object] as any, required: false },
      icon: { type: [String, Object] as any, required: false }
    },
    setup(props, { attrs, slots }) {
      return () => {
        const passedName = (props as any).name ?? (attrs as any)?.name
        const passedIcon = (props as any).icon ?? (attrs as any)?.icon
        const rawIcon = (passedName ?? passedIcon) as any
        // Normalize i-<collection>-<icon> to collection:icon for Iconify
        let normalized = rawIcon
        if (typeof normalized === 'string' && normalized.startsWith('i-')) {
          const parts = normalized.split('-')
          if (parts.length >= 3) {
            const collection = parts[1]
            const iconName = parts.slice(2).join('-')
            normalized = `${collection}:${iconName}`
          }
        }
        // Build final props for Iconify, mapping name/icon -> icon
        const { name, icon: _ignored, ...rest } = (attrs as any) || {}
        const finalProps = { ...rest, icon: normalized }
        return h(IconifyIcon as any, finalProps, slots)
      }
    }
  })

  const existing = (nuxtApp.vueApp as any).component && (nuxtApp.vueApp as any).component('Icon')
  if (!existing) {
    (nuxtApp.vueApp as any).component('Icon', IconCompat)
  }
})
