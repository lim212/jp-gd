![nuxt-ui-landing-social-card](https://github.com/user-attachments/assets/299676e9-b798-42b2-85bf-f8eb606993a2)

# Nuxt UI Pro - Landing template

This template lets you build a landing page with [Nuxt UI Pro](https://ui.nuxt.com/pro) quickly.

[![Nuxt UI Pro](https://img.shields.io/badge/Made%20with-Nuxt%20UI%20Pro-00DC82?logo=nuxt.js&labelColor=020420)](https://ui.nuxt.com/pro)

- [Live demo](https://landing-template.nuxt.dev/)
- [Documentation](https://ui.nuxt.com/getting-started/installation/pro/nuxt)

[![Deploy to NuxtHub](https://hub.nuxt.com/button.svg)](https://hub.nuxt.com/new?repo=nuxt-ui-pro/landing)

## Quick Start

```bash [Terminal]
npx nuxi init -t github:nuxt-ui-pro/landing
```

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Renovate integration

Install [Renovate GitHub app](https://github.com/apps/renovate/installations/select_target) on your repository and you are good to go.


## Floating Up/Down/WhatsApp (Bottom-Left)

This project ships with a professional floating actions control built with Nuxt UI Pro and premium styles:
- Scroll Up and Scroll Down buttons with smooth scrolling and dynamic visibility (auto-hidden at top/bottom)
- WhatsApp contact button
- Tooltips, focus rings, and responsive sizing for a polished, accessible experience

Component location:
- app/components/ChatWhatsapp.vue, mounted globally in app/app.vue

Configuration (optional):
Add these to your .env to customize WhatsApp target and default message:

```
WHATSAPP_PHONE=628988888250
WHATSAPP_MESSAGE=Halo JasaPembayaran.com, saya ingin konsultasi tentang jasa PayPal
```

These are exposed via runtimeConfig.public in nuxt.config.ts as `whatsappPhone` and `whatsappMessage`.

Styling:
- Premium gradients and effects are defined in app/assets/css/scroll-buttons.css (already registered in nuxt.config.ts under `css`).

Note:
- ChatWhatsapp is already included globally. Avoid importing it again at page-level to prevent duplicate floating widgets.


## Testimonials API configuration

This project can fetch real testimonials from an external service and gracefully fallback to mock data.

Environment variables:
- TESTIMONIALS_API_BASE: Base URL of the testimonials API. Default: https://testimonial.jasapembayaran.id/testimoni
  - Example: TESTIMONIALS_API_BASE=https://testimonial.jasapembayaran.id/testimoni
- DISABLE_TESTIMONIALS: Set to 'true' to force mock testimonials (useful for local/dev or downtime). Default: false
- TESTIMONIALS_FAIL_THRESHOLD: Number of consecutive failures before temporarily disabling the external API. Default: 10
- TESTIMONIALS_DISABLE_WINDOW_MS: Duration (in milliseconds) to keep external API disabled after reaching the threshold. Default: 21600000 (6 hours)

Logging:
- Fetch failures and circuit-breaker activation are now logged at INFO level to avoid WARN noise in logs.

Behavior:
- Server endpoint GET /api/testimonials?offset=0&limit=12 will try the external API first.
- If it fails or is disabled, it returns curated mock testimonials instead.
- Response shape remains stable:
  {
    items: Testimonial[],
    pagination: { offset: number, limit: number, total: number, isMockData: boolean }
  }

Notes:
- The endpoint maps common fields from various sources (name/nama/full_name/by, message/pesan/testimonial/review/content/comment, etc.)
- Ratings are clamped to 1..5 and dates normalized to ISO string.


## Caching and Redis (optional)

This project supports server-side caching with Redis, but it is fully optional.

- To enable Redis, set REDIS_URL in your environment, for example:

```
REDIS_URL=redis://localhost:6379
```

Behavior:
- If REDIS_URL is not set or the Redis server is unreachable, the app will fall back to an in-memory cache automatically.
- A single warning may be logged on first failure; repeated error spam is avoided.
- In-memory cache is process-local and non-persistent; use Redis in production for durability and cross-instance sharing.


## ChatGPT Blog Generation and local dev performance

The blog generation system uses ChatGPT to create content automatically.

- File: server/plugins/blog-cron.server.ts
- Behavior:
  - In development (NODE_ENV=development): scheduler is disabled by default.
  - In production: scheduler is enabled by default.
- Toggle via environment variable NUXT_ENABLE_BLOG_SCHEDULER:
  - To enable: set NUXT_ENABLE_BLOG_SCHEDULER to true
  - To disable: set NUXT_ENABLE_BLOG_SCHEDULER to false
  - If not set: defaults to disabled in dev, enabled in prod.
- Logs:
  - When disabled, you will see: "Blog scheduler disabled (default). Set NUXT_ENABLE_BLOG_SCHEDULER=true to enable."
  - When enabled, on first middleware run: "Scheduled daily blog refresh at 01:00 local server time".

Why: This avoids external API calls during local development, keeping HMR and server warm-up responsive. If you need to test the scheduler locally, temporarily set NUXT_ENABLE_BLOG_SCHEDULER=true and restart the dev server.



## PWA module is optional
This project integrates PWA via `@vite-pwa/nuxt`, but it is now optional to avoid startup errors when the module is not installed.

How it works:
- The PWA Nuxt module and the PWA client plugin will only be loaded when:
  - The package `@vite-pwa/nuxt` is installed and resolvable, AND
  - The environment variable `NUXT_ENABLE_PWA` is set to `true`.

Enable PWA:
1. Install the dependency (if not already installed):
   - npm: `npm i @vite-pwa/nuxt`
   - pnpm: `pnpm add @vite-pwa/nuxt`
   - yarn: `yarn add @vite-pwa/nuxt`
2. Set env var:
   - `.env`: `NUXT_ENABLE_PWA=true`
   - or in your deployment environment variables.
3. Restart the dev server / rebuild.

Disable PWA (default):
- Remove or set `NUXT_ENABLE_PWA` to anything other than `true` (e.g. leave it unset). Nuxt will start without trying to load the PWA module.

Why this change:
- Prevents the error "Could not load @vite-pwa/nuxt. Is it installed?" when the dependency isn't available in the current environment.


## Ikon Loading Global & Shortcodes WordPress

Agar semua ikon loading rapi (center), tidak saling menabrak, dan konsisten warna/ukuran di semua halaman termasuk blog WordPress, project ini menambahkan:
- Utilitas CSS global: .icon-center dan .icon-stack-safe
- 3 jenis ikon/indikator:
  1) Icon Loading Buku
  2) Icon Loading yang keren (spinner halus)
  3) Progress persen + hitung mundur 30 detik
- Plugin klien yang otomatis memproses shortcode di konten WordPress (.post-content)

Warna default mengikuti tema (var(--cta-bg)); dapat diubah per-pemakaian via atribut color atau CSS variable --icon-color. Ukuran default 64px; dapat diubah via atribut size atau CSS variable --icon-size.

### Pakai di WordPress (Shortcodes)
Cukup tulis di editor (Classic/Gutenberg HTML) dalam konten:

- Icon Loading Buku
```
[jp-book size=72 color="#1976D2" label="Icon Loading Buku"]
```

- Icon Loading yang keren
```
[jp-cool size=72 color="#1976D2" label="Icon Loading yang keren"]
```

- Persen + hitung mundur 30 detik (contoh mulai 50% menuju 100%)
```
[jp-progress duration=30 start=50 target=100 size=96 color="#1976D2" label="Proses"]
```

Catatan:
- size alias s (mis. s=72), color alias c.
- label opsional (teks di bawah ikon).
- Countdown dan teks persen/sisa akan otomatis berjalan di halaman blog.

### Pakai di komponen Vue
Anda bisa juga menulis shortcode dalam elemen yang berkelas post-content, atau gunakan HTML siap pakai berikut.

- HTML Icon Loading Buku
```
<div class="icon-center icon-stack-safe" style="--icon-size:72px; --icon-color:#1976D2">
  <div class="jp-book-loader" role="img" aria-label="Icon Loading Buku">
    <div class="book"><div class="spine"></div>
      <div class="page animate"></div><div class="page animate p2"></div><div class="page animate p3"></div>
    </div>
  </div>
  <div class="label">Icon Loading Buku</div>
</div>
```

- HTML Icon Loading yang keren (spinner)
```
<div class="icon-center icon-stack-safe" style="--icon-size:72px; --icon-color:#1976D2">
  <div class="jp-cool-loader" role="img" aria-label="Loading…"></div>
  <div class="label">Loading…</div>
</div>
```

- HTML Progress + Hitung Mundur
```
<div class="icon-center icon-stack-safe" style="--icon-size:96px; --icon-color:#1976D2">
  <div class="jp-progress" data-duration="30" data-start="50" data-target="100">
    <svg viewBox="0 0 120 120" role="img" aria-label="Proses">
      <circle class="bg" cx="60" cy="60" r="54" fill="none" stroke-width="12"></circle>
      <circle class="bar" cx="60" cy="60" r="54" fill="none" stroke-width="12" stroke-linecap="round"></circle>
    </svg>
    <div class="label" aria-live="polite"><span></span><small></small></div>
  </div>
</div>
```

### Kerapihan & Responsif
- Seluruh blok dibungkus oleh .icon-center.icon-stack-safe (grid terpusat + jarak aman) agar tidak bertindihan dengan teks lain.
- Mobile otomatis mengecil (default --icon-size di layar kecil), namun Anda tetap bisa override via size/--icon-size.
- Warna konsisten mengikuti var(--cta-bg) agar serasi dengan tema. Bisa override dengan atribut color atau --icon-color.

### Halaman Demo
Untuk contoh urutan sesuai permintaan:
- Icon Loading Buku
- Icon Loading yang keren
- Persen + Hitung Mundur 30 detik

Buka: /demo/loaders

Implementasi teknis:
- CSS global di app/assets/css/main.css
- Shortcode processor di plugins/wp-shortcodes.client.ts (terdaftar di nuxt.config.ts)
- Konten blog dirender ke .post-content, plugin akan memproses otomatis.



## Force Update (Auto-Reload) When New Version Is Available
This project is configured to always reload to the latest version across all browsers when a new build is deployed. Any update prompt (Allow/OK/Cancel) is effectively auto-accepted — “Cancel” behaves like “Allow”.

What’s included:
- server/api/version.get.ts
  - Returns a JSON object { buildId } and sets Cache-Control: no-store to bypass caches.
- plugins/version-check.client.ts
  - Client-side checker that polls /api/version every 60 seconds and on tab focus; if buildId changes, it reloads the page immediately.
- Optional PWA auto-update (when NUXT_ENABLE_PWA=true)
  - @vite-pwa/nuxt is configured with workbox clientsClaim and skipWaiting.
  - plugins/pwa.client.ts auto-accepts updates (onNeedRefresh -> updateSW) and reloads on controllerchange, so no manual prompt is needed.
- Cache safety
  - nuxt.config.ts sets routeRules to no-store for HTML and /api/** and long-term immutable cache for hashed assets under /_nuxt/**.

How buildId is generated:
- nuxt.config.ts uses runtimeConfig.public.buildId, resolved from (in order):
  - NUXT_PUBLIC_BUILD_ID
  - VERCEL_GIT_COMMIT_SHA / GITHUB_SHA / COMMIT_SHA
  - Unix timestamp fallback

How to test locally:
1. Start dev server (npm run dev).
2. Set or change NUXT_PUBLIC_BUILD_ID in .env (or restart with a different value).
3. The client will detect the new buildId (via /api/version) and reload automatically.
4. If PWA is enabled (NUXT_ENABLE_PWA=true), the Service Worker update is auto-accepted and the page reloads when the new SW takes control.

Notes:
- No visible prompt is shown to users; updates are applied immediately to ensure everyone runs the latest version.
- If you are behind a CDN, ensure it does not cache SSR HTML. This repo already sets strict Cache-Control headers via nitro routeRules.



## Otomatis Terjemah (ID → EN) + Simpan Harian Jam 03:00

Fitur bahasa sudah diupgrade agar lebih otomatis, rapi, dan aman:

- Default bahasa: Indonesia (id)
  - Plugin utama: plugins/vue-i18n-wrapper.js
  - Fallback: id, dan key yang hilang otomatis pakai teks Indonesia.
  - Atribut <html lang> ikut diperbarui.

- Switcher Bahasa (ikon ID/EN)
  - Komponen: /LanguageSwitcherComponent.vue
  - Saat ganti ke EN, komponen akan:
    1) POST ke /api/i18n/sync untuk menerjemahkan kunci yang belum/berubah dari Indonesia → Inggris (pakai ChatGPT API gpt-4o-mini).
    2) GET /api/i18n/messages?locale=en untuk memuat pesan terbaru.
  - Saat ganti ke ID, pesan ID dimuat dari /api/i18n/messages?locale=id (tanpa menerjemahkan balik).
  - Ada indikator loading dan pesan error bila perlu.

- Penyimpanan Teks Bahasa
  - File: locales/id.json (sumber), locales/en.json (hasil terjemah)
  - Meta hash: data/i18n-meta.json untuk mendeteksi perubahan teks ID sehingga EN di‑translate ulang hanya saat perlu.

- Scheduler Harian Jam 03:00 (otomatis menyimpan teks)
  - File: server/plugins/i18n-cron.server.ts
  - Mekanisme: setiap hari jam 03:00 waktu server, memanggil translateMissingIdToEn() yang memperbarui locales/en.json + meta. Tujuannya mencegah error jika ada update teks Indonesia — Inggris akan otomatis tersimpan.
  - Nonaktifkan jika perlu: set .env NUXT_ENABLE_SCHEDULER=false

- Endpoint API
  - POST /api/i18n/sync → jalankan terjemah ID → EN untuk key yang baru/berubah.
  - GET /api/i18n/messages?locale=id|en → ambil pesan terkini untuk locale terkait.

- Kunci Lingkungan (env)
  - OPENAI_API_KEY=... (wajib untuk menerjemahkan)
  - Opsional: NUXT_ENABLE_SCHEDULER=true (default aktif; set false untuk mematikan cron 03:00)

- Catatan Teknis
  - Terjemah batch dan aman (JSON-only), model: gpt-4o-mini, temperature rendah untuk konsistensi.
  - Pada mode dev, LanguageSwitcher memuat ulang pesan setelah sync sehingga hasil EN langsung terlihat tanpa rebuild.

Cara uji cepat:

1) Set OPENAI_API_KEY di .env, lalu jalankan dev server.
2) Ubah teks Indonesia di locales/id.json.
3) Klik EN pada switcher → sistem akan translate otomatis dan menampilkan hasilnya.
4) Atau tunggu jam 03:00 (atau ubah jam server) untuk sync harian otomatis.


## Port binding and EADDRINUSE fix

This project now avoids crashes like `listen EADDRINUSE ::1:4005` by auto-selecting a free port.

- Development
  - Use `npm run dev` (runs `dev-start.js`).
  - Desired port is taken from `NUXT_DEV_PORT` or `PORT` (default: 4005). If busy, it falls back to the next available port within `[PORT_MIN..PORT_MAX]` (defaults to `desired..desired+50`).
  - Host is set to `0.0.0.0` to prevent IPv6 `::1` binding issues on Windows.

- Production / PM2
  - Use `npm run start` or PM2 with the provided `ecosystem.config.*` (both run `start.js`).
  - Desired port is `PORT` (fallback to 3000), with automatic fallback within `[PORT_MIN..PORT_MAX]` (defaults to `desired..desired+20`).
  - Host defaults to `0.0.0.0`.

Environment variables you can use:

```
# Desired ports (dev and prod)
NUXT_DEV_PORT=4005
PORT=4005

# Host binding
HOST=0.0.0.0

# Optional range to search for a free port
PORT_MIN=4005
PORT_MAX=4055
```

Notes:
- If you want to force a single port (no fallback), set `PORT_MIN` and `PORT_MAX` to the same value.
- Vite dev server is also configured with `strictPort: false` and `host: 0.0.0.0` in `nuxt.config.ts` for smoother fallback.
- PM2 ecosystem files point to `start.js` so that production also benefits from the port probe.


## SEO: Sitemap & Robots

This project auto-generates a Google-friendly sitemap and robots.txt for fast indexing.

- Modules: nuxt-simple-sitemap and nuxt-simple-robots (enabled in nuxt.config.ts)
- Endpoints (available in production and during preview):
  - /sitemap.xml (main sitemap)
  - /sitemap-dynamic.xml (dynamic sitemap chunk)
  - /robots.txt (includes both sitemaps)
- Base site URL: defined in nuxt.config.ts at `site.url` (currently https://jasapembayaran.com). Update if deploying to a different domain.
- Cache headers: configured via Nitro `routeRules` for fast crawl performance.
- Dynamic entries source: server/api/sitemap-dynamic.ts (returns URLs with lastmod/changefreq/priority). Blog lives on blog.jasapembayaran.online and manages its own sitemap.

Tips for faster indexing:
- Ensure your production domain matches `site.url`.
- Keep important pages linked internally and included in the sitemap(s).
- Submit https://jasapembayaran.com/sitemap.xml in Google Search Console.


## OpenAI configuration (Fallback Blog Generator)

This project can optionally generate fallback blog content using OpenAI when WordPress is slow or unavailable. Configure via environment variables:

Required/optional:
- OPENAI_API_KEY: Your OpenAI API key (optional; if missing, deterministic placeholders are used).
- OPENAI_ORG_ID: OpenAI organization ID (optional).
- OPENAI_MODEL: Model used for chat completions (default: gpt-4o-mini).

New reliability options:
- OPENAI_TIMEOUT_MS: Request timeout in milliseconds for OpenAI API calls. Default: 30000.
- OPENAI_MAX_RETRIES: Number of retry attempts on transient errors (timeouts, 429, 5xx). Default: 2.

Behavioral improvements:
- On transient failures, the system automatically retries with exponential backoff and jitter.
- Logs show concise info for each retry and a single warning if a final fallback is used. No sensitive data is logged.
- If all attempts fail or the response is not valid JSON, deterministic placeholder content is used to keep pages working.

Example .env values:
```
OPENAI_API_KEY=sk-...
OPENAI_ORG_ID=org-...
OPENAI_MODEL=gpt-4o-mini
OPENAI_TIMEOUT_MS=30000
OPENAI_MAX_RETRIES=2
```

Catatan (ID): Jika koneksi ke OpenAI lambat atau terputus, sistem akan mencoba ulang beberapa kali secara otomatis. Jika tetap gagal, konten fallback yang rapi akan ditampilkan tanpa mengganggu pengalaman pengguna.



## Auto-Generate Artikel WordPress (autogen-blog.js)

Script Node.js ini akan mengambil artikel terbaru dari WordPress sumber, melakukan regenerate judul dan isi artikel (SEO-friendly), membuat featured image via AI, mengunggah media ke WordPress tujuan, lalu menerbitkan artikel baru dengan kategori & tag yang disalin.

Fitur utama:
- Ambil artikel terbaru dari API WordPress sumber (/wp-json/wp/v2/posts)
- Regenerate judul (55–60 karakter, 6–10 kata, keyword utama di awal)
- Regenerate isi artikel (>= 800 kata, SEO-friendly, H2/H3, bullet list, kesimpulan)
- Generate featured image via AI (OpenAI DALL·E/gpt-image-1)
- Upload media ke WordPress tujuan (/wp-json/wp/v2/media)
- Buat post baru (/wp-json/wp/v2/posts) dengan IMG di bagian paling atas dan set featured image
- Salin kategori & tag (membuat jika belum ada di target)
- Status publish, skip jika judul duplikat
- Retry untuk generate gambar dan upload media
- Dapat dijalankan otomatis via cron (Linux) atau Task Scheduler (Windows)

Persiapan environment variables:
- SOURCE_WP_URL=https://source-site.tld
- TARGET_WP_URL=https://target-site.tld
- WP_USER=wp_username                 (gunakan bersama Application Password)
- WP_APP_PASSWORD=xxxx xxxx xxxx xxxx (WordPress Application Password)
  - Cara membuat: Users → Profile → Application Passwords → Add New → Copy password
- (Opsional) WP_JWT=token             (alternatif Bearer JWT jika menggunakan plugin JWT)
- OPENAI_API_KEY=sk-...
- PER_PAGE=1                           (jumlah artikel terbaru yang diproses tiap run)
- DRY_RUN=true|false                   (paksa mode simulasi)

Menjalankan secara manual:
- Windows/PowerShell (dengan env sudah diset):
  npm run autogen:blog
- Atau langsung:
  node autogen-blog.js

Cron (Linux):
Tambahkan ke crontab untuk jalan setiap hari jam 01:00:
0 1 * * * /usr/bin/node /var/www/autogen-blog.js >> /var/log/autogen-blog.log 2>&1

Catatan: Pastikan file autogen-blog.js ditempatkan di /var/www dan environment variables tersedia untuk proses cron (bisa diset melalui /etc/environment atau export di awal baris cron).

Windows Task Scheduler (setara cron):
1) Buka Task Scheduler → Create Task.
2) Triggers: Daily, 1:00:00.
3) Actions: Start a program → Program/script: node
   - Add arguments: C:\\path\\to\\project\\autogen-blog.js
   - Start in: C:\\path\\to\\project
4) Conditions/Settings sesuai kebutuhan.
5) Pastikan environment variables diset di System Properties → Environment Variables atau gunakan file .cmd yang set variabel lalu panggil node.

Konten dan gambar yang dihasilkan:
- Judul: 55–60 karakter, 6–10 kata, keyword utama di awal (divalidasi otomatis oleh script)
- Isi: >= 800 kata, struktur H2/H3, bullet list, kesimpulan (script akan memperluas konten jika kurang dari 800 kata)
- Gambar: di-generate via OpenAI, diupload sebagai featured image, juga disisipkan sebagai tag <img> paling atas:
  <img src="URL_GAMBAR" alt="Judul Artikel" style="display:block;margin:0 auto;max-width:100%;height:auto;" />

Anti-duplicate & retry:
- Script mengecek judul di WordPress tujuan; jika sudah ada, post dilewati.
- Proses generate gambar dan upload media memiliki retry dengan backoff.

Debug/Dry-run:
- Jika env belum lengkap atau DRY_RUN=true, script berjalan dalam mode simulasi (tidak melakukan publish) dan hanya mencetak log.

Troubleshooting:
- Auth gagal: pastikan WP_USER dan WP_APP_PASSWORD valid, atau gunakan WP_JWT.
- 401/403 saat upload media: cek hak akses user, nonaktifkan security plugin yang memblokir REST API.
- OpenAI error: cek OPENAI_API_KEY dan kuota.
- Node versi: gunakan Node 18+ agar fetch tersedia secara global.



## Performance & PWA Enhancements (2025-08)

This project was updated to improve loading speed, caching, and offline capability.

What changed:
- Client hydration reduction: Wrapped decorative/static components in <ClientOnly>, e.g. HeroBackground in app/app.vue. TrustedPartners and ChatWhatsapp are already inside ClientOnly to avoid SSR hydration duplication.
- @nuxt/image optimization: Global formats set to ['webp','avif'] and a reusable AppImage component uses <NuxtImg> with lazy loading. Images are auto-optimized and cacheable.
- Strong caching headers: Nitro routeRules now add long-lived Cache-Control for static assets including /_nuxt/**, /images/**, /icons/**, /logos/**, /img/**, /fonts/**, and /favicon.ico. Nitro/Node will handle ETag/Last-Modified automatically for static responses.
- PWA + Workbox: @vite-pwa/nuxt enabled by default (unless NUXT_ENABLE_PWA='false'). Workbox caches:
  - Documents (navigations) via NetworkFirst with an offline fallback page at /offline
  - Images via CacheFirst
  - API calls via NetworkFirst
  The offline page lives at pages/offline.vue and is prerendered.

How to enable/disable PWA:
- Enabled by default if @vite-pwa/nuxt is installed.
- To disable explicitly, set env: NUXT_ENABLE_PWA='false'.

HTTP/2 note:
- HTTP/2 must be enabled at your server or reverse proxy (e.g., Nginx, Cloudflare, Vercel). The app cannot force HTTP/2 itself. Recommended: serve _nuxt and public assets with HTTP/2 + gzip/brotli.

Build and analyze:
- Build: npm run build
- Analyze bundles: npm run analyze




## Generator Konten Otomatis Berbasis Keyword (02:00)

Fitur baru ini membuat artikel blog secara otomatis setiap hari jam 02:00 WIB (Asia/Jakarta) berdasarkan keyword yang Anda taruh di folder tanggal.

Cara kerja ringkas:
- Anda menaruh file .txt berisi keyword di folder: data\keywords\YYYY-MM-DD\
- Setiap baris dianggap satu keyword. Jika file kosong, nama file (tanpa .txt) digunakan sebagai keyword.
- Setiap hari jam 02:00, sistem membaca folder untuk tanggal hari itu dan membuat artikel untuk setiap keyword.
- Artikel disimpan ke cache lokal di data\blog sehingga API blog langsung menyajikan tanpa memanggil AI di setiap request.
- Gambar hero otomatis ditempatkan di bagian paling atas konten.

Struktur folder dan contoh:
- data\keywords\2025-08-21\paypal untuk belanja aman.txt
- data\keywords\2025-08-21\list-keyword.txt
  Isi file list-keyword.txt (satu per baris):
  - cara verifikasi paypal indonesia
  - tips keamanan transaksi digital
  - belanja aman di marketplace global

Output yang dihasilkan:
- data\blog\index.json akan diperbarui otomatis.
- data\blog\<slug>.json dibuat untuk setiap artikel.
- API yang sudah ada (/api/blog, /api/blog/[slug]) akan langsung menampilkan hasilnya.

Menjalankan secara manual (testing):
- Jalur API: GET /api/keywords/run?date=YYYY-MM-DD
  Contoh lokal: http://localhost:3000/api/keywords/run?date=2025-08-21
- Jika parameter date tidak diisi, otomatis memakai tanggal hari ini.

Penjadwalan otomatis:
- Plugin server akan menjadwalkan job setiap hari jam 02:00 waktu lokal server (production saja).
- Untuk mematikan scheduler: set NUXT_ENABLE_KEYWORD_SCHEDULER=false (atau NUXT_ENABLE_SCHEDULER=false) di environment.

SEO dan standar Google:
- Judul dioptimalkan panjangnya (kurang-lebih 55–60 karakter) dan natural, sesuai praktik SEO umum.
- Konten berbahasa Indonesia, terstruktur H2/H3, daftar isi, paragraf singkat mudah dipindai, dan FAQ.
- Gambar hero ditempatkan di paling atas untuk CTR yang lebih baik.

Kunci/API:
- Rekomendasi: set OPENAI_API_KEY agar konten dibuat secara cerdas oleh ChatGPT.
- Tanpa OPENAI_API_KEY, sistem tetap jalan dengan konten fallback yang rapi.

Catatan gambar:
- Gambar hero menggunakan URL AI yang aman (tanpa watermark/teks) dan langsung disisipkan di atas konten. Tidak perlu upload file manual ke public\images.

Troubleshooting:
- Tidak ada artikel yang dibuat: pastikan folder data\keywords\<YYYY-MM-DD> ada dan berisi file .txt.
- Slug duplikat: sistem otomatis menambahkan akhiran -2, -3, dst.
- Matikan/aktifkan scheduler sesuai kebutuhan via environment.



### Jumlah Post Harian & Urutan (02:00)
- Sistem otomatis akan membuat 10 artikel setiap hari pukul 02:00 WIB (Asia/Jakarta).
- Ubah jumlah harian via environment variable: NUXT_KEYWORD_DAILY_COUNT (bawaan: 10, rentang aman: 1–50).
- Pemilihan keyword BERDASARKAN URUTAN (atas ke bawah):
  - Jika folder data\keywords\YYYY-MM-DD ada: konsumsi keyword sesuai urutan baris pada file (tanpa acak).
  - Jika folder kosong/tidak ada: gunakan daftar DEFAULT_KEYWORDS di dalam kode persis dari atas ke bawah.
  - Sistem melewati slug yang sudah pernah dibuat dan otomatis lanjut ke keyword berikutnya pada hari-hari selanjutnya hingga habis.
- Setiap artikel yang dibuat memiliki satu gambar AI (hero) otomatis di bagian paling atas konten.
- Menjalankan manual (opsional):
  GET /api/keywords/run?date=YYYY-MM-DD&count=10
  (parameter count opsional; jika tidak diisi, sistem memakai NUXT_KEYWORD_DAILY_COUNT)


## WordPress Auto-Publish from Keyword List (Daily at 02:00 WIB)

This project can automatically generate blog content from a keyword list and publish to a WordPress site via the REST API every day at 02:00 WIB (Asia/Jakarta).

How it works:
- Put your keywords (one per line) under `data\keywords\YYYY-MM-DD\*.txt`.
  - Example: `data\keywords\2025-08-21\list-keyword.txt`.
  - After a file’s keywords are fully consumed, it will be renamed to `.done.txt` automatically.
- A Nitro plugin schedules a daily job at 02:00 WIB: `server\plugins\keyword-cron.server.ts`.
- The job calls `runKeywordJobForDate()` which:
  - Reads today’s keywords; if none found, falls back to internal defaults.
  - Generates content (title, excerpt, content, image) using AI utils.
  - Saves locally to the blog cache.
  - Optionally, publishes to WordPress if enabled.

Enable publishing to WordPress:
- Set the following environment variables in `.env`:
  - `WORDPRESS_API_URL=https://your-blog.example.com/wp-json/wp/v2`
  - `WORDPRESS_AUTH_TOKEN=your_bearer_or_jwt_token`
  - `NUXT_WORDPRESS_PUBLISH=true`  # Enables auto-publishing from the scheduled job
  - Optional: `NUXT_KEYWORD_DAILY_COUNT=10` to control how many keywords are processed per day (1–50).
  - Optional: `WP_FETCH_TIMEOUT_MS=45000` for REST API timeout tuning.
  - Optional: `NUXT_ENABLE_KEYWORD_SCHEDULER=false` to disable the daily scheduler.

Manual trigger (for testing):
- HTTP GET: `/api/keywords/run`
  - Query params:
    - `date=YYYY-MM-DD` (optional)
    - `count=NUMBER` (optional, 1–50)
    - `publish=true|false` (optional). If omitted, the value is taken from `NUXT_WORDPRESS_PUBLISH`.
  - Example: `/api/keywords/run?count=3&publish=true`

Notes:
- The scheduler is disabled in development mode. It runs only when `NODE_ENV=production`.
- Publishing uses `server/utils/wordpress.ts` (saveBlogPost, fetchBlogPostBySlug). The created post attempts to use the same slug as generated. If a post with that slug already exists, it will be skipped.
- If WordPress API has transient connectivity issues, warnings are sampled/suppressed to avoid noise; see `WP_SUPPRESS_WP_WARNINGS` and `WP_WARN_SAMPLE_MS` in `.env` for tuning.


## KBLI 2020 Realtime Scraping

This project ships with a KBLI 2020 page at /kbli and an API at /api/kbli. By default, data can be loaded from:
- Realtime HTML scraping (recommended for live data)
- An external JSON (KBLI_SOURCE_URL)
- Local fallback file data/kbli.json

Configure via environment variables:
- KBLI_SCRAPE=true to enable HTML scraping mode
- KBLI_SCRAPE_URLS="https://example.com/kbli/page-a,https://example.com/kbli/page-b" comma-separated list of pages to scrape
- KBLI_SOURCE_URL=https://example.com/kbli.json optional JSON source (used if scraping is disabled or fails)
- KBLI_TTL_SECONDS=30 cache TTL in seconds (default 600). Lower values make it more realtime.

Example .env:
```
KBLI_SCRAPE=true
KBLI_SCRAPE_URLS=https://your-official-source.example/kbli/a,https://your-official-source.example/kbli/b
KBLI_TTL_SECONDS=30
```

How it works:
- The API endpoint /api/kbli will try scraping first (if KBLI_SCRAPE is true or KBLI_SCRAPE_URLS is provided). It parses HTML tables/links to extract:
  - code (KBLI code)
  - title (KBLI title)
  - description (if available in the 3rd column)
  - risk (if available in the 4th column)
- If scraping is not configured or fails, it falls back to KBLI_SOURCE_URL (JSON), then to local data/kbli.json.
- Results are cached in-memory for KBLI_TTL_SECONDS.
- Force refresh and bypass cache by calling /api/kbli?refresh=true (the /kbli page has a Refresh button).

Using the UI:
- Open /kbli to browse and search KBLI codes by letter, code, title, or description.
- The footer shows the data source and fetchedAt timestamp. Use the Refresh button to fetch fresh data immediately.

Notes:
- To achieve near realtime, set KBLI_TTL_SECONDS to a small value (e.g., 30) and use Refresh when needed.
- The scraper is generic and robust to common table and link structures. If your source uses a different layout, adjust KBLI_SCRAPE_URLS to point to pages listing code and title in tabular or anchor formats.
