<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';

// Define props with TypeScript types
const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  width: {
    type: [Number, String],
    default: null
  },
  height: {
    type: [Number, String],
    default: null
  },
  placeholder: {
    type: String,
    default: '/img/loading-bar.svg'
  },
  fallback: {
    type: String,
    default: '/img/image-error.svg'
  },
  quality: {
    type: String,
    default: 'auto' // 'auto', 'low', 'medium', 'high'
  },
  fetchpriority: {
    type: String as () => 'high' | 'low' | 'auto' | undefined,
    default: undefined
  }
});

// Reactive state
const isLoading = ref(true);
const hasError = ref(false);
const connection = ref('4g'); // Default to 4g
const imageLoaded = ref(false);
const actualSrc = ref(props.src);

// Loading progress (simulated, safe for cross-origin)
const progress = ref(0);
let progressTimer: number | null = null;
const displayPercent = computed(() => Math.min(100, Math.max(0, Math.floor(progress.value))))

// Detect empty source (graceful empty state)
const isEmpty = computed(() => !props.src || String(props.src).trim().length === 0);

// Check network connection type and speed
const checkConnection = () => {
  if (typeof navigator === 'undefined') {
    connection.value = '4g';
    return;
  }
  
  // Prefer Network Information API when available
  // Use Save-Data as a strong signal for low quality
  const navConn: any = (navigator as any).connection
  if (!navConn) {
    // If Network Information API is not available, assume good connection
    connection.value = '4g';
    return;
  }

  const sd = navConn.saveData === true
  const effectiveType = navConn.effectiveType || '4g'
  connection.value = sd ? '2g' : effectiveType

  // Listen for connection changes
  navConn.addEventListener('change', () => {
    const sd2 = navConn.saveData === true
    const eff2 = navConn.effectiveType || '4g'
    connection.value = sd2 ? '2g' : eff2
    updateImageQuality();
  });
};

// Preload current actualSrc to ensure load events while placeholder is shown
const preloadImage = (url: string) => {
  try {
    const img = new Image();
    img.decoding = 'async';
    img.loading = 'eager';
    img.src = url;
    img.onload = () => handleLoad();
    img.onerror = () => handleError();
  } catch {}
};

// Update image quality based on connection
const updateImageQuality = () => {
  // Only adjust if quality is set to auto
  if (props.quality !== 'auto' || imageLoaded.value) return;

  // If image is already loaded, don't change it
  if (imageLoaded.value) return;

  // Determine quality based on connection
  let qualityParam = '';

  if (connection.value === 'slow-2g' || connection.value === '2g') {
    qualityParam = '?quality=low';
  } else if (connection.value === '3g') {
    qualityParam = '?quality=medium';
  } else {
    qualityParam = ''; // Default/high quality
  }

  // Only add quality parameter for images from our domain
  if (props.src.includes('jasapembayaran.com') && qualityParam) {
    actualSrc.value = `${props.src}${qualityParam}`;
  } else {
    actualSrc.value = props.src;
  }

  // Note: avoid manual preloading so skeleton stays visible until actual <img> fires load
};

// Progress handling (simulated determinate progress)
const stopProgress = () => {
  if (progressTimer !== null) {
    try { clearTimeout(progressTimer); } catch {}
    progressTimer = null;
  }
};

const startProgress = () => {
  stopProgress();
  progress.value = 0;
  const step = () => {
    if (!isLoading.value) { stopProgress(); return; }
    let inc = progress.value < 40 ? 3 : (progress.value < 70 ? 2 : 1);
    if (connection.value === 'slow-2g' || connection.value === '2g') inc = Math.max(1, Math.floor(inc / 2));
    else if (connection.value === '3g') inc = Math.max(1, inc - 1);
    if (progress.value < 95) {
      progress.value = Math.min(progress.value + inc, 95);
      progressTimer = window.setTimeout(step, 140);
    } else {
      // Hold near-complete until actual load
      progressTimer = window.setTimeout(step, 300);
    }
  };
  progressTimer = window.setTimeout(step, 140);
};

const finalizeProgress = () => {
  progress.value = 100;
  stopProgress();
};

// Computed styles
const containerStyle = computed(() => {
  const style: Record<string, string> = {};
  const w = props.width as any;
  const h = props.height as any;

  if (w) {
    style.width = typeof w === 'number' ? `${w}px` : String(w);
  }

  if (h) {
    style.height = typeof h === 'number' ? `${h}px` : String(h);
  }

  // Add aspect-ratio to minimize layout shift when width & height are provided
  const wn = typeof w === 'number' ? w : parseFloat(String(w));
  const hn = typeof h === 'number' ? h : parseFloat(String(h));
  if (!Number.isNaN(wn) && !Number.isNaN(hn) && wn > 0 && hn > 0) {
    style.aspectRatio = `${wn} / ${hn}`;
  }

  return style;
});

// Handle image load
const handleLoad = () => {
  finalizeProgress();
  isLoading.value = false;
  imageLoaded.value = true;
};

// Handle image error
const handleError = () => {
  stopProgress();
  isLoading.value = false;
  hasError.value = true;
};

// Smooth reveal state
const isRevealed = ref(false);

// Handle NuxtImg load with smooth reveal
const onImgLoad = async () => {
  handleLoad();
  await nextTick();
  // Tiny delay to trigger CSS transition reliably
  setTimeout(() => {
    isRevealed.value = true;
  }, 20);
};

// Reset when src changes
watch(() => props.src, (newVal) => {
  actualSrc.value = newVal;
  hasError.value = false;
  imageLoaded.value = false;
  isRevealed.value = false;
  isLoading.value = !isEmpty.value;
  stopProgress();
  if (!isEmpty.value) {
    updateImageQuality();
    startProgress();
  } else {
    progress.value = 0;
  }
});

// Retry loading the image
const retryLoad = () => {
  if (hasError.value) {
    hasError.value = false;
    isLoading.value = true;
    progress.value = 0;
    startProgress();

    // Try with original source again
    actualSrc.value = props.src;

    // Add a small delay before retrying
    setTimeout(() => {
      const img = document.createElement('img');
      img.src = actualSrc.value;
      img.onload = () => {
        handleLoad();
      };
      img.onerror = () => {
        handleError();
      };
    }, 1000);
  }
};

// Initialize on mount
onMounted(() => {
  checkConnection();
  if (!isEmpty.value) {
    updateImageQuality();
    startProgress();
  } else {
    isLoading.value = false;
  }
});

onBeforeUnmount(() => {
  stopProgress();
});
</script>

<template>
  <div
    class="network-aware-image"
    :style="containerStyle"
    :aria-busy="isLoading ? 'true' : 'false'"
    @click="retryLoad"
  >
    <!-- Empty state (no src provided) -->
    <div v-if="isEmpty" class="image-empty" role="status" aria-live="polite">
      <div class="skeleton" aria-hidden="true"></div>
      <div class="loading-info">
        <div class="loading-text">Gambar belum tersedia</div>
      </div>
    </div>

    <!-- Loading state with modern shimmer -->
    <div v-else-if="isLoading" class="image-placeholder" role="status" aria-live="polite">
      <div class="skeleton" aria-hidden="true"></div>
      <div class="loading-info">
        <div class="loading-spinner" aria-hidden="true"></div>
        <div class="loading-text">Memuat gambar… <span class="percent-pill">{{ displayPercent }}%</span></div>
      </div>
      <div
        class="loading-bar"
        role="progressbar"
        aria-label="Memuat gambar"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="displayPercent"
      >
        <div class="loading-bar-inner" :style="{ width: displayPercent + '%', transform: 'none', animation: 'none' }"></div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="hasError" class="image-error">
      <img
        :src="fallback"
        :alt="`Failed to load ${alt}`"
        class="error-img"
      />
      <span class="error-text">Ketuk untuk coba lagi</span>
    </div>

    <!-- Loaded state with smooth reveal -->
    <img
      v-else
      :src="actualSrc"
      :alt="alt"
      :width="width || undefined"
      :height="height || undefined"
      loading="lazy"
      decoding="async"
      :fetchpriority="fetchpriority"
      :class="['loaded-img', { 'is-visible': isRevealed }]"
      @load="onImgLoad"
      @error="handleError"
    />
  </div>
</template>

<style scoped>
.network-aware-image {
  position: relative;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;
  width: 100%;
}

.image-placeholder,
.image-error,
.image-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 1rem;
  text-align: center;
  position: relative; /* for skeleton overlay */
}

.placeholder-img,
.error-img {
  max-width: 50px;
  max-height: 50px;
  opacity: 0.5;
}

.error-text {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #666;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  margin-top: 0.5rem;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-top-color: #0ea5e9; /* sky-500 */
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loaded-img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
  opacity: 0;
  filter: blur(12px) saturate(100%) contrast(100%);
  transform: scale(1.01);
  transition: opacity .5s ease, filter .6s ease, transform .6s ease;
}

.loaded-img.is-visible {
  opacity: 1;
  filter: blur(0) saturate(100%) contrast(100%);
  transform: scale(1);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .loading-spinner {
    width: 20px;
    height: 20px;
  }

  .placeholder-img,
  .error-img {
    max-width: 40px;
    max-height: 40px;
  }

  .error-text {
    font-size: 0.7rem;
  }
}

/* Respect user preferences for reduced motion */
@media (prefers-reduced-motion: reduce) {
  .loading-spinner {
    animation: none;
  }
}

.loading-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 0.5rem;
}

.loading-text {
  font-size: 0.8rem;
  color: #1f2937; /* slate-800 */
}
html.dark .loading-text { color: #e5e7eb; }

/* Percent pill */
.percent-pill{
  display:inline-block;
  margin-left:.35rem;
  font-variant-numeric: tabular-nums;
  font-weight:600;
  font-size:.8rem;
  padding:.15rem .45rem;
  border-radius:.5rem;
  color:#1f2937;
  background:rgba(59,130,246,0.12);
  border:1px solid rgba(59,130,246,0.25);
}
html.dark .percent-pill{
  color:#e5e7eb;
  background:rgba(96,165,250,0.15);
  border-color:rgba(96,165,250,0.35);
}

/* Make spinner more visible with brand color */
.loading-spinner {
  width: 26px;
  height: 26px;
  margin-top: 0; /* moved inside loading-info */
  border: 3px solid rgba(59, 130, 246, 0.25); /* blue-500 with opacity */
  border-top-color: #3b82f6; /* blue-500 */
}

/* Indeterminate loading bar */
.loading-bar {
  position: relative;
  width: 80%;
  max-width: 360px;
  height: 4px;
  margin-top: 10px;
  background: #e5e7eb; /* gray-200 */
  border-radius: 9999px;
  overflow: hidden;
}
html.dark .loading-bar { background: #1f2937; /* gray-800 */ }

.loading-bar-inner {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 30%;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  border-radius: inherit;
  transform: translateX(-100%);
  animation: jp-indeterminate 1.1s ease-in-out infinite;
}
html.dark .loading-bar-inner { background: linear-gradient(90deg, #60a5fa, #93c5fd); }

/* Shimmer skeleton overlay */
.skeleton {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(90deg, rgba(0,0,0,0.06) 25%, rgba(0,0,0,0.12) 37%, rgba(0,0,0,0.06) 63%);
  background-size: 400% 100%;
  animation: shimmer 1.2s ease-in-out infinite;
}
html.dark .skeleton {
  background: linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.12) 37%, rgba(255,255,255,0.06) 63%);
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@keyframes jp-indeterminate {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(300%); }
}

/* Respect reduced motion for shimmer */
@media (prefers-reduced-motion: reduce) {
  .skeleton { animation: none; }
}

/* Premium aurora overlay for image loading */
.image-placeholder::before{content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;background:
  radial-gradient(500px 250px at 10% 20%, rgba(212,175,55,0.12), transparent 60%),
  radial-gradient(500px 250px at 90% 30%, rgba(59,130,246,0.12), transparent 60%);
  animation:nai-aurora 18s linear infinite;opacity:.55}
html.dark .image-placeholder::before{background:
  radial-gradient(500px 250px at 10% 20%, rgba(212,175,55,0.18), transparent 60%),
  radial-gradient(500px 250px at 90% 30%, rgba(96,165,250,0.18), transparent 60%);opacity:.4}
@keyframes nai-aurora{0%{background-position:0% 50%,100% 50%}100%{background-position:100% 50%,0% 50%}}
@media (prefers-reduced-motion: reduce){.image-placeholder::before{animation:none}}

/* Upgraded loading bar visuals */
.image-placeholder .loading-bar{background: rgba(229,231,235,0.55); border:1px solid rgba(59,130,246,0.18); box-shadow: inset 0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(59,130,246,0.08);}
html.dark .image-placeholder .loading-bar{background: rgba(31,41,55,0.55); border-color: rgba(96,165,250,0.25); box-shadow: inset 0 1px 2px rgba(255,255,255,0.06), 0 4px 12px rgba(96,165,250,0.10);}
.image-placeholder .loading-bar-inner{background:linear-gradient(90deg,#3b82f6,#60a5fa,#93c5fd);background-size:200% 100%;animation: nai-bar 2.2s ease infinite; box-shadow: 0 0 10px rgba(59,130,246,0.45), inset 0 0 6px rgba(255,255,255,0.5);}
html.dark .image-placeholder .loading-bar-inner{background:linear-gradient(90deg,#60a5fa,#93c5fd,#bfdbfe); box-shadow: 0 0 10px rgba(96,165,250,0.45), inset 0 0 8px rgba(255,255,255,0.22);}
@keyframes nai-bar{0%{background-position:0% 50%}100%{background-position:100% 50%}}

</style>

