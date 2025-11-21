<template>
  <div
    class="li-wrapper"
    :class="wrapperClass"
    :style="wrapperStyle"
    :aria-busy="!loaded && !error ? 'true' : 'false'"
  >
    <!-- Prefer NuxtPicture for raster formats; fall back to a lightweight local stub when the module isn't available -->
    <component
      v-if="useNuxtPicture && effectiveSrc"
      :is="nuxtPictureTag"
      :src="effectiveSrc"
      :img-attrs="{ class: combinedImgClass, style: imgStyle, loading, decoding, fetchpriority, onLoad, onError, srcset: effectiveSrcset, sizes, alt }"
      :sizes="sizes"
      :format="['avif','webp']"
    />

    <!-- Fallback to plain <img> (SVGs, data URIs, or when Nuxt Image cannot handle the source) -->
    <img
      v-else-if="effectiveSrc"
      :src="effectiveSrc"
      :srcset="effectiveSrcset"
      :sizes="sizes"
      :alt="alt"
      :class="combinedImgClass"
      :style="imgStyle"
      :loading="loading"
      :decoding="decoding"
      :fetchpriority="fetchpriority"
      @load="onLoad"
      @error="onError"
    />

    <!-- Text-only mode fallback -->
    <div v-if="!effectiveSrc" class="li-textonly" :style="textOnlyStyle">{{ textPlaceholder || alt }}</div>

    <!-- Placeholder shown until the image is loaded (works even if global CSS is delayed) -->
    <div v-if="effectiveSrc && !loaded && !error" class="li-placeholder" :style="placeholderStyle" aria-hidden="true">
      <svg width="28" height="28" viewBox="0 0 50 50" focusable="false" aria-hidden="true">
        <circle cx="25" cy="25" r="20" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25" />
        <circle cx="25" cy="25" r="20" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round">
          <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>

    <!-- Error fallback -->
    <div v-if="error" class="li-error" :style="placeholderStyle" aria-hidden="true">
      <svg width="28" height="28" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <path fill="currentColor" d="M11 7h2v6h-2zm0 8h2v2h-2z" />
        <path fill="currentColor" d="M1 21h22L12 2 1 21z" />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, h, getCurrentInstance, defineComponent } from 'vue'
import { useDataSaver } from '../../composables/useDataSaver'

const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: '' },
  imgClass: { type: [String, Array, Object], default: '' },
  wrapperClass: { type: [String, Array, Object], default: '' },
  // If you need explicit sizing, you can pass width/height; otherwise the wrapper will stretch to its parent
  width: { type: [String, Number], default: undefined },
  height: { type: [String, Number], default: undefined },
  loading: { type: String, default: 'lazy' },
  decoding: { type: String, default: 'async' },
  fetchpriority: { type: String, default: undefined },
  // Responsive images support
  srcset: { type: String, default: undefined },
  sizes: { type: String, default: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw' },
  // Optional low-res image for data saver "lite" mode
  lowSrc: { type: String, default: undefined },
  // Optional plain-text label to show in text-only mode
  textPlaceholder: { type: String, default: undefined },
  // If true, bypass data-saver (always load full image)
  ignoreDataSaver: { type: Boolean, default: false }
})

const loaded = ref(false)
const error = ref(false)

const { isTextOnly, isLite, prefixCdn } = useDataSaver()

const effectiveSrc = computed(() => {
  if (!props.ignoreDataSaver) {
    if (isTextOnly()) return undefined
    const chosen = isLite() && props.lowSrc ? props.lowSrc : props.src
    return prefixCdn(chosen)
  }
  // Ignore data saver: always use main src
  return prefixCdn(props.src)
})

const effectiveSrcset = computed(() => {
  if (!props.ignoreDataSaver && isTextOnly()) return undefined
  return props.srcset
})

// Decide when to use NuxtPicture (raster images) vs plain <img>
const useNuxtPicture = computed(() => {
  const s = String(effectiveSrc.value || '')
  if (!s) return false
  if (/^data:/i.test(s)) return false
  if (/\.svg(\?|#|$)/i.test(s)) return false
  // Allow common raster formats
  return /\.(png|jpe?g|gif|webp|avif|bmp|tiff)(\?|#|$)/i.test(s)
})

function onLoad() { loaded.value = true }
function onError() { error.value = true; loaded.value = false }

// Lightweight local stub for NuxtPicture to avoid warnings when @nuxt/image is not present
const NuxtPictureLocal = defineComponent({
  name: 'NuxtPictureLocal',
  props: {
    src: { type: String, required: true },
    imgAttrs: { type: Object, default: () => ({}) },
    sizes: { type: String, default: undefined },
    format: { type: [String, Array], default: undefined }
  },
  setup(p) {
    return () => h('img', {
      src: p.src,
      ...(p.imgAttrs || {}),
      sizes: p.sizes
    })
  }
})

const nuxtPictureTag = computed(() => {
  try {
    // Try to use the real NuxtPicture if available and registered
    const app = getCurrentInstance()?.appContext?.app
    if (app && app.component && app.component('NuxtPicture')) {
      return 'NuxtPicture'
    }
  } catch {}
  // Fallback to local stub
  return NuxtPictureLocal
})

const wrapperStyle = computed(() => {
  const style = {}
  if (props.width) style['--w'] = String(props.width)
  if (props.height) style['--h'] = String(props.height)
  return style
})

const imgStyle = computed(() => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover'
}))

const combinedImgClass = computed(() => {
  const base = props.imgClass
  const list = []

  if (Array.isArray(base)) {
    list.push(...base)
  } else if (base && typeof base === 'object') {
    list.push(base)
  } else if (typeof base === 'string' && base.trim()) {
    list.push(base)
  }

  list.push(loaded.value ? 'loaded' : 'loading')
  return list
})

const placeholderStyle = computed(() => ({
  display: 'grid',
  placeItems: 'center',
  color: 'rgba(107, 114, 128, 0.9)'
}))

const textOnlyStyle = computed(() => ({
  display: 'grid',
  placeItems: 'center',
  color: 'rgba(55, 65, 81, 0.95)',
  fontWeight: '600'
}))
</script>

<style scoped>
.li-wrapper {
  position: relative;
  width: var(--w, 100%);
  height: var(--h, auto);
  min-height: 40px;
}
.li-placeholder,
.li-error {
  position: absolute;
  inset: 0;
}
.partner-logo {
  max-height: 52px;
}
</style>

