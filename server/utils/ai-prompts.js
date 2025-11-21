
// AI Prompts for Human-Like Content
class AIPrompts {
  constructor() {
    this.prompts = {
      title: `
Buat judul artikel yang SEO-friendly untuk keyword "{keyword}" dengan ketentuan:
- Panjang 50-60 karakter (Google standard)
- Menggunakan bahasa Indonesia yang natural
- Mengandung kata kunci utama
- Menarik dan informatif
- Format: "Tips {keyword} untuk Pemula" atau "{keyword} - Panduan Lengkap 2025"

Contoh yang baik:
- "Cara Top Up PayPal yang Benar"
- "Tips Jasa Pembayaran untuk Pemula"
- "PayPal - Panduan Lengkap 2025"

Hindari:
- Judul yang terlalu panjang (>60 karakter)
- Kata-kata yang tidak natural
- Spam keywords
`,

      content: `
Buat konten artikel yang human-friendly untuk keyword "{keyword}" dengan ketentuan:
- Bahasa Indonesia yang natural dan mudah dipahami
- Struktur yang jelas dengan heading H1, H2, H3
- Konten yang informatif dan bermanfaat
- Panjang 800-1200 kata
- Menggunakan kata ganti "Anda" untuk personal touch
- Menyertakan tips praktis dan FAQ
- Call-to-action yang natural

Struktur yang diinginkan:
1. Introduction yang engaging
2. Penjelasan tentang {keyword}
3. Keunggulan dan manfaat
4. Cara penggunaan step-by-step
5. Tips & trik
6. FAQ
7. Kesimpulan
8. Call-to-action

Tone: Friendly, helpful, professional
Style: Conversational, easy to read
`,

      excerpt: `
Buat excerpt (ringkasan) untuk artikel tentang "{keyword}" dengan ketentuan:
- Panjang 150-160 karakter
- Mengandung keyword utama
- Menarik dan informatif
- Menggunakan bahasa Indonesia yang natural
- Format: "Panduan lengkap tentang {keyword}. Pelajari cara mudah dan aman menggunakan {keyword} untuk kebutuhan Anda."
`
    };
  }

  getTitlePrompt(keyword) {
    return this.prompts.title.replace('{keyword}', keyword);
  }

  getContentPrompt(keyword) {
    return this.prompts.content.replace('{keyword}', keyword);
  }

  getExcerptPrompt(keyword) {
    return this.prompts.excerpt.replace('{keyword}', keyword);
  }
}

export default AIPrompts;
