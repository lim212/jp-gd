// Blog images pool - using dummy folder images that are known to work
export const BLOG_IMAGES = [
  'dummy-1.jpg',
  'dummy-2.jpg', 
  'dummy-3.jpg',
  'dummy-4.jpg',
  'dummy-5.jpg',
  'dummy-6.jpg',
  'dummy-7.jpg',
  'dummy-8.jpg'
]

// Simple image URLs - using LOCAL images for better performance
export const SIMPLE_IMAGES = [
  '/images/dummy/dummy-1.jpg',
  '/images/dummy/dummy-2.jpg',
  '/images/dummy/dummy-3.jpg',
  '/images/dummy/dummy-4.jpg',
  '/images/dummy/dummy-5.jpg',
  '/images/dummy/dummy-6.jpg',
  '/images/dummy/dummy-7.jpg',
  '/images/dummy/dummy-8.jpg'
]

export const SUPER_DUMMY_IMAGES = Array.from({ length: 60 }, (_, idx) => {
  const num = String(idx + 1).padStart(2, '0')
  return `/images/dummy/super/super-dummy-${num}.svg`
})

// AI-Generated blog images from /images/blog/ folder
export const AI_BLOG_IMAGES = [
  '/images/blog/jasa-paypal-1760990485278.jpg',
  '/images/blog/jasa-transfer-paypal-1760990622512.jpg',
  '/images/blog/jasa-bayar-paypal-1760990551361.jpg',
  '/images/blog/jasa-bitcoin-1760991019009.jpg',
  '/images/blog/jasa-namecheap-1760990731749.jpg',
  '/images/blog/jasa-domain-namecheap-1760990684690.jpg',
  '/images/blog/jasa-bayar-livechat-1760990974761.jpg',
  '/images/blog/jasa-topup-saldo-namecheap-1760990916270.jpg',
  '/images/blog/jasa-pembayaran-namecheap-1760990771823.jpg',
  '/images/blog/jasa-top-up-saldo-namecheap-1760990851021.jpg',
  '/images/blog/jasa-paypal-1760904102241.jpg',
  '/images/blog/jasa-bitcoin-1760904510817.jpg',
  '/images/blog/jasa-namecheap-1760904305720.jpg',
  '/images/blog/jasa-domain-namecheap-1760904256746.jpg',
  '/images/blog/jasa-bayar-livechat-1760904469087.jpg',
  '/images/blog/jasa-transfer-paypal-1760904209103.jpg',
  '/images/blog/jasa-paypal-1760731352868.jpg',
  '/images/blog/jasa-bitcoin-1760731941244.jpg',
  '/images/blog/jasa-namecheap-1760731626976.jpg',
  '/images/blog/jasa-domain-namecheap-1760731575977.jpg',
  '/images/blog/jasa-bayar-livechat-1760731890506.jpg',
  '/images/blog/jasa-transfer-paypal-1760731526926.jpg',
  '/images/blog/jasa-pembayaran-namecheap-1760731675566.jpg',
  '/images/blog/jasa-top-up-saldo-namecheap-1760731744136.jpg',
  '/images/blog/jasa-topup-saldo-namecheap-1760731801836.jpg',
  '/images/blog/jasa-paypal-1759201174423.jpg',
  '/images/blog/jasa-bitcoin-1759201129426.jpg',
  '/images/blog/jasa-namecheap-1759201159477.jpg',
  '/images/blog/jasa-domain-namecheap-1759201144626.jpg',
  '/images/blog/jasa-bayar-livechat-1759201099480.jpg',
  '/images/blog/jasa-transfer-paypal-1759201234532.jpg',
  '/images/blog/jasa-pembayaran-namecheap-1759201189902.jpg',
  '/images/blog/jasa-top-up-saldo-namecheap-1759201204476.jpg',
  '/images/blog/jasa-topup-saldo-namecheap-1759201219534.jpg'
]

// Fallback SVG images (50 available)
export const FALLBACK_SVG_IMAGES: string[] = []
for (let i = 1; i <= 50; i++) {
  FALLBACK_SVG_IMAGES.push(`/images/fallback-blog-${i}.svg`)
}

// Hash function for deterministic dummy image selection
export function hashString(input: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < input.length; i++) { 
    h ^= input.charCodeAt(i); 
    h = Math.imul(h, 16777619) 
  }
  return h >>> 0
}

export function isValidImageUrl(url?: string) {
  if (!url || typeof url !== 'string') return false
  try {
    const base = import.meta.client ? window.location.origin : 'http://localhost'
    const u = new URL(url, base)
    const isHttp = u.protocol === 'http:' || u.protocol === 'https:'
    const isDataImg = url.startsWith('data:image')
    return isHttp || isDataImg
  } catch {
    return false
  }
}

export function normalizeImageUrlClient(img?: string): string {
  const s = String(img || '').trim()
  if (!s) return ''
  if (s.startsWith('data:image')) return s
  if (s.startsWith('http://') || s.startsWith('https://')) return s
  if (s.startsWith('//')) return `https:${s}`
  if (s.startsWith('/')) return s
  return ''
}

export function getSafeImage(candidate?: string, titleText?: string, slugText?: string) {
  // Normalize common patterns that could break on the client
  const normalized = normalizeImageUrlClient(candidate)
  
  // If it's fallback-news.svg, replace with AI-generated image
  if (normalized === '/images/fallback-news.svg') {
    const seed = slugText || titleText || 'default'
    const aiIdx = hashString(seed) % AI_BLOG_IMAGES.length
    return AI_BLOG_IMAGES[aiIdx] || AI_BLOG_IMAGES[0] || `/images/dummy/${BLOG_IMAGES[0]}`
  }
  
  // Prefer provided image if it's a valid URL
  if (normalized && isValidImageUrl(normalized)) {
    return String(normalized)
  }
  
  // Use AI-generated image from /images/blog/ folder (deterministic)
  const seed = slugText || titleText || 'default'
  const aiIdx = hashString(seed) % AI_BLOG_IMAGES.length
  const aiImage = AI_BLOG_IMAGES[aiIdx] || AI_BLOG_IMAGES[0]
  if (aiImage) {
    return aiImage
  }
  
  // Fallback to dummy image if AI images not available
  const idx = hashString(seed) % BLOG_IMAGES.length
  return `/images/dummy/${BLOG_IMAGES[idx] || BLOG_IMAGES[0]}`
}

// Choose the best image for card rendering with priority:
// 1) image or aiImageUrl from API/blog data if valid
// 2) AI-generated image from /images/blog/ folder (deterministic based on slug)
// 3) Dummy image based on slug (deterministic)
// 4) Fallback SVG image based on slug
export function getCardImage(b: any): string {
  // Priority 1: Use provided image or aiImageUrl from blog data
  const candidate = b?.image || b?.aiImageUrl || b?.featured_image
  if (candidate) {
    const normalized = normalizeImageUrlClient(candidate)
    // Skip fallback-news.svg and use AI images instead
    if (normalized && normalized !== '/images/fallback-news.svg' && isValidImageUrl(normalized)) {
      return normalized
    }
  }
  
  // Priority 2: Use AI-generated images from /images/blog/ folder (deterministic)
  const slug = String(b?.slug || b?.id || 'default')
  const aiIdx = hashString(slug) % AI_BLOG_IMAGES.length
  const aiImage = AI_BLOG_IMAGES[aiIdx] || AI_BLOG_IMAGES[0]
  if (aiImage) {
    return aiImage
  }
  
  // Priority 3: Use newly generated super dummy images
  if (SUPER_DUMMY_IMAGES.length > 0) {
    const superIdx = hashString(slug) % SUPER_DUMMY_IMAGES.length
    const superDummy = SUPER_DUMMY_IMAGES[superIdx] || SUPER_DUMMY_IMAGES[0]
    if (superDummy) {
      return superDummy
    }
  }

  // Priority 4: Use legacy dummy images
  if (SIMPLE_IMAGES.length > 0) {
    const dummyIdx = hashString(slug) % SIMPLE_IMAGES.length
    const dummyImage = SIMPLE_IMAGES[dummyIdx] || SIMPLE_IMAGES[0]
    if (dummyImage) {
      return dummyImage
    }
  }
  
  // Priority 5: Use fallback SVG (deterministic)
  const svgIdx = hashString(slug) % FALLBACK_SVG_IMAGES.length
  return FALLBACK_SVG_IMAGES[svgIdx] || FALLBACK_SVG_IMAGES[0] || '/images/fallback-blog-1.svg'
}

export function buildAiHeroUrl(titleText?: string, slugText?: string) {
  const cleanTitle = (titleText || '').replace(/<[^>]*>/g, '').trim();
  const basePrompt = cleanTitle
    ? `${cleanTitle}, modern 3D illustration, gradient lighting, PAYTECH payments, isometric, glassmorphism, highly detailed, cinematic, trending on dribbble`
    : `modern 3D illustration, gradient lighting, PAYTECH payments, isometric, glassmorphism, highly detailed, cinematic, trending on dribbble`;
  const encoded = encodeURIComponent(basePrompt);
  const seed = encodeURIComponent(String(slugText || cleanTitle || 'blog'));
  return `https://image.pollinations.ai/prompt/${encoded}?seed=${seed}&width=1200&height=630&nologo=true&enhance=true`;
}

export function onCardImgError(e: Event) {
  const img = e.target as HTMLImageElement | null
  if (!img) return
  
  const cardId = img.getAttribute('data-card-id') || 'default'
  const currentSrc = img.src
  
  // Don't fallback to another fallback SVG if already on one
  if (currentSrc.includes('fallback-blog-') || currentSrc.includes('fallback-news.svg')) {
    // Hide the image and show fallback placeholder
    img.style.display = 'none'
    const fallbackPlaceholder = img.parentElement?.querySelector('.fallback-placeholder') as HTMLElement
    if (fallbackPlaceholder) {
      fallbackPlaceholder.style.display = 'flex'
    }
    return
  }
  
  // Try fallback to SVG image
  const idx = hashString(cardId) % FALLBACK_SVG_IMAGES.length
  const fallbackSvg = FALLBACK_SVG_IMAGES[idx] || FALLBACK_SVG_IMAGES[0]
  
  if (fallbackSvg && !currentSrc.includes(fallbackSvg)) {
    img.src = fallbackSvg
    return
  }
  
  // Final fallback: show placeholder
  img.style.display = 'none'
  const fallbackPlaceholder = img.parentElement?.querySelector('.fallback-placeholder') as HTMLElement
  if (fallbackPlaceholder) {
    fallbackPlaceholder.style.display = 'flex'
  }
}

export function onCardImgLoad(e: Event) {
  const img = e.target as HTMLImageElement | null
  if (!img) return
  
  const cardId = img.getAttribute('data-card-id') || 'default'
  
  // Add loaded class for fade-in animation
  img.classList.add('loaded')
  
  // Hide fallback placeholder when image loads successfully
  const fallbackPlaceholder = img.parentElement?.querySelector('.fallback-placeholder') as HTMLElement
  if (fallbackPlaceholder) {
    fallbackPlaceholder.style.display = 'none'
  }
}


