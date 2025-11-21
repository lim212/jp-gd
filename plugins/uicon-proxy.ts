// plugins/uicon-proxy.ts
// Purpose: Proxy <UIcon> usages to Nuxt's <Icon> component using the
// required name format "prefix:icon-name" and keep existing props/classes.
// This lets us gradually migrate templates while guaranteeing that all
// icon rendering goes through <Icon /> with a proper "collection:icon" name.

import { defineNuxtPlugin } from '#app'
import { defineComponent, h, resolveComponent } from 'vue'

function toPrefixName(raw: any): string {
  const name = String(raw || '')
  if (!name) return ''
  if (name.includes(':')) return name // already "prefix:icon"
  if (name.startsWith('i-')) {
    // i-<collection>-<icon>
    const parts = name.split('-')
    if (parts.length >= 3) {
      const collection = parts[1]
      const icon = parts.slice(2).join('-')
      return `${collection}:${icon}`
    }
  }
  return name
}

export default defineNuxtPlugin((nuxtApp) => {
  const app: any = nuxtApp.vueApp as any

  const ProxyUIcon = defineComponent({
    name: 'ProxyUIcon',
    inheritAttrs: false,
    props: {
      name: { type: String, default: '' },
      size: { type: [String, Number], default: undefined }
    },
    setup(props, { attrs }) {
      return () => {
        const iconName = toPrefixName(props.name || (attrs as any)?.name)
        const IconComp: any = resolveComponent('Icon')
        const passThrough: Record<string, any> = { ...attrs, name: iconName }
        if (props.size != null) passThrough.size = props.size
        return h(IconComp, passThrough)
      }
    }
  })

  // Override/define global UIcon to ensure consistent behavior
  app.component('UIcon', ProxyUIcon)
})
