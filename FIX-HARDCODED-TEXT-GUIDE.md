# 🔧 How to Fix Hardcoded Text in Components

## Problem
Components have hardcoded Indonesian text that doesn't change when user clicks EN icon.

## Solution
Replace hardcoded text with i18n keys using $t() or useI18n()

## Quick Start

### Step 1: Add useI18n to component
```vue
<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>
```

### Step 2: Replace hardcoded text
```vue
<!-- ❌ BEFORE (Hardcoded) -->
<button>Langsung Masuk</button>

<!-- ✅ AFTER (Using i18n) -->
<button>{{ t('loading.skip_button') }}</button>
```

## Examples by Component

### 1. SuperLoadingScreen.vue

**Replace:**
```vue
<!-- Line ~326 -->
<p class="skip-text">Loading agak lama? Klik tombol di bawah untuk langsung masuk</p>
<!-- TO: -->
<p class="skip-text">{{ t('loading.slow_loading_message') }}</p>

<!-- Line ~332 -->
<span>Langsung Masuk</span>
<!-- TO: -->
<span>{{ t('loading.skip_button') }}</span>

<!-- Line ~486 -->
return `${connectionQuality.value.message} - Mode pintar aktif`
<!-- TO: -->
return `${connectionQuality.value.message} - ${t('loading.smart_mode_active')}`
```

### 2. ChatWhatsapp.vue

**Replace:**
```vue
<!-- Line ~9 -->
const whatsappMessage = computed(
  () => config.public?.whatsappMessage || 'Halo JasaPembayaran.com, saya ingin konsultasi tentang jasa PayPal'
)
<!-- TO: -->
const whatsappMessage = computed(
  () => config.public?.whatsappMessage || t('whatsapp.default_message')
)
```

### 3. WhyWe.vue

**Replace all hardcoded titles and descriptions:**
```vue
<!-- Line ~14 -->
title: "<span class=\"text-emerald-400\">Keamanan</span> Berstandar Bank",
<!-- TO: -->
title: `<span class="text-emerald-400">${t('why_we.security.title').split(' ')[0]}</span> ${t('why_we.security.title').split(' ').slice(1).join(' ')}`,

<!-- Or simpler: -->
title: computed(() => t('why_we.security.title')),

<!-- Line ~15-16 -->
description: "Berpengalaman lebih dari...",
<!-- TO: -->
description: computed(() => t('why_we.security.description')),
```

## Available i18n Keys

Check `locales/id.json` and `locales/en.json` for all available keys.

New keys added:
- `loading.*` - Loading screen texts
- `whatsapp.*` - WhatsApp messages
- `why_we.*` - Why choose us section
- `common.*` - Common buttons and links

## Testing

After making changes:

1. Start dev server:
   ```bash
   npm run dev
   ```

2. Open website in browser

3. Click EN icon (top right)

4. **ALL text should change to English!** ✅

5. Click ID icon to switch back

## Troubleshooting

### Text not changing?
- Check if you're using {{ t('key') }} not hardcoded text
- Verify key exists in both id.json and en.json
- Check browser console for errors
- Try hard refresh (Ctrl+F5)

### Key not found error?
- Run: `npm run translate:setup`
- Check spelling of key
- Make sure key exists in locales/id.json

## Quick Commands

```bash
# Update translation files
npm run translate:setup

# Trigger translation sync
npm run translate:sync

# Check status
npm run translate:stats
```

## Need Help?

See: TRANSLATION-TROUBLESHOOTING.md for detailed troubleshooting guide.
