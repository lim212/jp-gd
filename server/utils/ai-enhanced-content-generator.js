// AI-Enhanced Content Generator with Advanced OpenAI Integration
import { getOpenAIManager } from './openaiManager.ts'

class AIEnhancedContentGenerator {
  constructor() {
    this.openaiManager = getOpenAIManager()
    this.contentTemplates = {
      beginner: {
        systemPrompt: `Anda adalah expert content writer untuk JasaPembayaran.com. Buat konten yang:
- SEO-optimized untuk keyword "{keyword}"
- Panjang 1000-1500 kata
- Struktur: Introduction, Penjelasan, Cara Penggunaan, Tips, FAQ, Kesimpulan
- Bahasa Indonesia yang natural dan mudah dipahami
- Tone: Professional tapi friendly
- Include call-to-action yang relevan`,
        userPrompt: `Buat artikel lengkap tentang "{keyword}" dengan fokus pada pemula. Sertakan:
1. Penjelasan yang mudah dipahami
2. Langkah-langkah praktis
3. Tips dan trik
4. FAQ yang relevan
5. Kesimpulan yang actionable`
      },
      advanced: {
        systemPrompt: `Anda adalah expert content writer untuk JasaPembayaran.com. Buat konten advanced yang:
- SEO-optimized untuk keyword "{keyword}"
- Panjang 1200-1800 kata
- Struktur: Overview, Advanced Techniques, Optimization, Troubleshooting, Best Practices
- Bahasa Indonesia yang professional
- Tone: Expert dan authoritative
- Include technical details dan advanced tips`,
        userPrompt: `Buat artikel advanced tentang "{keyword}" untuk user yang sudah berpengalaman. Sertakan:
1. Teknik-teknik advanced
2. Optimasi dan performance tips
3. Troubleshooting common issues
4. Best practices dari expert
5. Case studies dan examples`
      },
      comparison: {
        systemPrompt: `Anda adalah expert content writer untuk JasaPembayaran.com. Buat konten perbandingan yang:
- SEO-optimized untuk keyword "{keyword}"
- Panjang 1000-1500 kata
- Struktur: Overview, Comparison Table, Pros/Cons, Recommendations, Conclusion
- Bahasa Indonesia yang objektif
- Tone: Analytical dan informative
- Include detailed comparisons`,
        userPrompt: `Buat artikel perbandingan tentang "{keyword}" dengan alternatif lainnya. Sertakan:
1. Perbandingan detail
2. Keunggulan dan kelemahan
3. Rekomendasi berdasarkan use case
4. Analisis cost-benefit
5. Kesimpulan yang membantu decision making`
      },
      tutorial: {
        systemPrompt: `Anda adalah expert content writer untuk JasaPembayaran.com. Buat tutorial yang:
- SEO-optimized untuk keyword "{keyword}"
- Panjang 800-1200 kata
- Struktur: Prerequisites, Step-by-step Guide, Verification, Troubleshooting, Tips
- Bahasa Indonesia yang step-by-step
- Tone: Instructional dan clear
- Include screenshots descriptions`,
        userPrompt: `Buat tutorial step-by-step tentang "{keyword}". Sertakan:
1. Prerequisites yang diperlukan
2. Langkah-langkah detail
3. Cara verifikasi hasil
4. Troubleshooting common issues
5. Tips untuk success`
      }
    }
  }

  // Enhanced AI-powered title generation
  async generateAITitle(keyword, contentType = 'beginner') {
    try {
      const systemPrompt = `Anda adalah expert SEO writer. Buat judul artikel yang:
- SEO-optimized untuk keyword "${keyword}"
- Panjang 50-60 karakter (Google standard)
- Menggunakan bahasa Indonesia yang natural
- Menarik dan informatif
- Format yang sesuai dengan jenis konten: ${contentType}

Contoh format yang baik:
- "Cara {keyword} untuk Pemula - Panduan Lengkap 2025"
- "{keyword} vs Alternatif - Perbandingan Terlengkap"
- "Tips Advanced {keyword} - Solusi Profesional"

Hindari:
- Judul yang terlalu panjang (>60 karakter)
- Kata-kata yang tidak natural
- Spam keywords`

      const userPrompt = `Buat 3 judul artikel yang berbeda untuk keyword "${keyword}" dengan jenis konten ${contentType}. Berikan dalam format JSON:
{
  "titles": [
    "Judul 1",
    "Judul 2", 
    "Judul 3"
  ],
  "recommended": "Judul yang paling direkomendasikan"
}`

      const response = await this.openaiManager.chatCompletionText({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 300
      })

      const parsed = JSON.parse(response)
      return parsed.recommended || parsed.titles[0] || this.generateFallbackTitle(keyword)

    } catch (error) {
      console.error('AI title generation failed:', error)
      return this.generateFallbackTitle(keyword)
    }
  }

  // Enhanced AI-powered content generation
  async generateAIContent(keyword, title, contentType = 'beginner') {
    try {
      const template = this.contentTemplates[contentType] || this.contentTemplates.beginner
      
      const systemPrompt = template.systemPrompt.replace('{keyword}', keyword)
      const userPrompt = template.userPrompt.replace('{keyword}', keyword)

      const response = await this.openaiManager.chatCompletionText({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 3000
      })

      return this.enhanceContentWithHTML(response, keyword, title)

    } catch (error) {
      console.error('AI content generation failed:', error)
      return this.generateFallbackContent(keyword, title)
    }
  }

  // Enhanced AI-powered meta description
  async generateAIMetaDescription(keyword, title, content) {
    try {
      const systemPrompt = `Anda adalah expert SEO writer. Buat meta description yang:
- SEO-optimized untuk keyword "${keyword}"
- Panjang 150-160 karakter (Google standard)
- Menggunakan bahasa Indonesia yang natural
- Menarik dan informatif
- Mengandung call-to-action

Format yang baik:
"Panduan lengkap tentang {keyword}. Pelajari cara mudah dan aman menggunakan {keyword} untuk kebutuhan Anda. Konsultasi gratis!"`

      const userPrompt = `Buat meta description untuk artikel dengan:
- Keyword: "${keyword}"
- Title: "${title}"
- Content preview: "${content.substring(0, 500)}..."

Berikan dalam format JSON:
{
  "meta_description": "Meta description yang dioptimasi"
}`

      const response = await this.openaiManager.chatCompletionText({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.6,
        max_tokens: 200
      })

      const parsed = JSON.parse(response)
      return parsed.meta_description || this.generateFallbackMetaDescription(keyword)

    } catch (error) {
      console.error('AI meta description generation failed:', error)
      return this.generateFallbackMetaDescription(keyword)
    }
  }

  // Enhanced AI-powered tags generation
  async generateAITags(keyword, content) {
    try {
      const systemPrompt = `Anda adalah expert SEO writer. Buat tags yang:
- Relevan dengan keyword "${keyword}"
- SEO-optimized untuk pencarian
- Menggunakan bahasa Indonesia
- Jumlah 5-8 tags
- Include long-tail keywords

Format yang baik:
["tag1", "tag2", "tag3", "tag4", "tag5"]`

      const userPrompt = `Buat tags untuk artikel dengan:
- Keyword: "${keyword}"
- Content: "${content.substring(0, 1000)}..."

Berikan dalam format JSON:
{
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}`

      const response = await this.openaiManager.chatCompletionText({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.5,
        max_tokens: 150
      })

      const parsed = JSON.parse(response)
      return parsed.tags || this.generateFallbackTags(keyword)

    } catch (error) {
      console.error('AI tags generation failed:', error)
      return this.generateFallbackTags(keyword)
    }
  }

  // Content enhancement with HTML structure
  enhanceContentWithHTML(content, keyword, title) {
    // Add proper HTML structure
    let enhancedContent = content

    // Add introduction section
    if (!enhancedContent.includes('<h1>')) {
      enhancedContent = `<h1>${title}</h1>\n\n${enhancedContent}`
    }

    // Add table of contents
    const toc = this.generateTableOfContents(enhancedContent)
    if (toc) {
      enhancedContent = enhancedContent.replace('<h1>', `<h1>${title}</h1>\n\n<div class="table-of-contents">\n<h3>Daftar Isi</h3>\n${toc}\n</div>\n\n<h2>`)
    }

    // Add images
    enhancedContent = this.addImagesToContent(enhancedContent, keyword)

    // Add CTA section
    if (!enhancedContent.includes('cta-section')) {
      enhancedContent += this.generateCTASection(keyword)
    }

    // Add related articles
    enhancedContent += this.generateRelatedArticles(keyword)

    return enhancedContent
  }

  generateTableOfContents(content) {
    const headings = content.match(/<h[2-3][^>]*>(.*?)<\/h[2-3]>/g)
    if (!headings || headings.length < 3) return null

    const tocItems = headings.map(heading => {
      const text = heading.replace(/<[^>]*>/g, '').trim()
      const id = text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')
      return `<li><a href="#${id}">${text}</a></li>`
    }).join('\n')

    return `<ul>\n${tocItems}\n</ul>`
  }

  addImagesToContent(content, keyword) {
    // Add images to sections
    let enhancedContent = content

    // Add intro image
    if (!enhancedContent.includes('intro-img')) {
      enhancedContent = enhancedContent.replace(
        '<h1>',
        `<div class="intro-section">
<div class="intro-image">
<img src="/images/dummy/dummy-${Math.floor(Math.random() * 100) + 1}.jpg" alt="${keyword}" class="intro-img" loading="lazy">
</div>
<p class="intro-text">`
      )
    }

    // Add section images
    const sections = enhancedContent.split('<h2>')
    if (sections.length > 1) {
      enhancedContent = sections[0]
      for (let i = 1; i < sections.length; i++) {
        const section = sections[i]
        const sectionTitle = section.split('</h2>')[0]
        const sectionContent = section.split('</h2>')[1]
        
        enhancedContent += `<h2>${sectionTitle}</h2>
<div class="content-image">
<img src="/images/dummy/dummy-${Math.floor(Math.random() * 100) + 1}.jpg" alt="${sectionTitle}" class="section-img" loading="lazy">
<p class="image-caption">${sectionTitle} - Solusi Terpercaya</p>
</div>
${sectionContent}`
      }
    }

    return enhancedContent
  }

  generateCTASection(keyword) {
    return `
<div class="cta-section">
<div class="cta-card">
<div class="cta-image">
<img src="/images/dummy/dummy-${Math.floor(Math.random() * 100) + 1}.jpg" alt="Call to Action ${keyword}" class="cta-img" loading="lazy">
</div>
<h3>Siap Memulai Perjalanan Anda?</h3>
<p>Jangan lewatkan kesempatan untuk merasakan manfaat ${keyword} sekarang juga. Dapatkan pengalaman terbaik dengan layanan profesional kami dan bergabunglah dengan ribuan pengguna yang sudah merasakan manfaatnya.</p>
<div class="cta-buttons">
<a href="/contact" class="cta-button primary">Hubungi Kami Sekarang</a>
<a href="/pricing" class="cta-button secondary">Lihat Paket & Harga</a>
</div>
<div class="cta-guarantee">
<p>✓ Garansi 30 hari uang kembali</p>
<p>✓ Support 24/7</p>
<p>✓ Setup gratis</p>
</div>
</div>
</div>`
  }

  generateRelatedArticles(keyword) {
    return `
<div class="related-articles">
<h3>Artikel Terkait yang Mungkin Anda Suka</h3>
<div class="related-grid">
<div class="related-item">
<div class="related-image">
<img src="/images/dummy/dummy-${Math.floor(Math.random() * 100) + 1}.jpg" alt="Tips Advanced ${keyword}" class="related-img" loading="lazy">
</div>
<h4>Tips & Trik Advanced ${keyword}</h4>
<p>Pelajari tips dan trik advanced untuk memaksimalkan ${keyword} dan mendapatkan hasil terbaik dari layanan ini.</p>
<a href="#" class="read-more">Baca Selengkapnya →</a>
</div>
<div class="related-item">
<div class="related-image">
<img src="/images/dummy/dummy-${Math.floor(Math.random() * 100) + 1}.jpg" alt="Troubleshooting ${keyword}" class="related-img" loading="lazy">
</div>
<h4>Troubleshooting ${keyword}</h4>
<p>Solusi lengkap untuk masalah umum yang sering terjadi dan cara mengatasinya dengan mudah.</p>
<a href="#" class="read-more">Baca Selengkapnya →</a>
</div>
</div>
</div>`
  }

  // Fallback methods
  generateFallbackTitle(keyword) {
    const templates = [
      `${keyword} - Panduan Lengkap 2025`,
      `Cara ${keyword} yang Benar`,
      `Tips ${keyword} untuk Pemula`,
      `${keyword} - Solusi Terpercaya`
    ]
    return templates[Math.floor(Math.random() * templates.length)]
  }

  generateFallbackContent(keyword, title) {
    return `
<h1>${title}</h1>

<div class="intro-section">
<p>Dalam artikel ini, kami akan membahas secara detail tentang ${keyword} yang mungkin Anda butuhkan. Sebagai penyedia jasa pembayaran terpercaya di Indonesia, kami sering mendapat pertanyaan tentang ${keyword}.</p>
</div>

<h2>Apa itu ${keyword}?</h2>
<p>${keyword} adalah layanan yang sangat dibutuhkan di era digital saat ini. Dengan perkembangan teknologi yang pesat, kebutuhan akan layanan pembayaran yang aman, cepat, dan terpercaya semakin meningkat.</p>

<h2>Mengapa Memilih ${keyword}?</h2>
<p>Ada beberapa keunggulan yang membuat layanan ${keyword} kami menjadi pilihan utama:</p>
<ul>
<li><strong>Keamanan Terjamin:</strong> Sistem keamanan berlapis dengan enkripsi tingkat militer</li>
<li><strong>Proses Cepat:</strong> Transaksi selesai dalam hitungan menit, bukan jam</li>
<li><strong>Biaya Terjangkau:</strong> Tarif kompetitif tanpa biaya tersembunyi</li>
<li><strong>Support 24/7:</strong> Tim customer service siap membantu kapan saja</li>
</ul>

<h2>FAQ - Pertanyaan yang Sering Diajukan</h2>
<p><strong>Q: Apakah layanan ${keyword} aman dan legal?</strong><br>
A: Ya, semua layanan kami 100% legal dan aman. Kami memiliki izin resmi dan menggunakan sistem keamanan berlapis untuk melindungi data klien.</p>

<h2>Kesimpulan</h2>
<p>${keyword} adalah solusi terpercaya untuk kebutuhan pembayaran digital Anda. Dengan pengalaman bertahun-tahun dan ribuan klien puas, JasaPembayaran.com siap memberikan layanan terbaik dengan standar keamanan dan kualitas tertinggi.</p>
`
  }

  generateFallbackMetaDescription(keyword) {
    return `Pelajari ${keyword} dengan panduan lengkap 2025. Tips terbaik, cara mudah, dan solusi aman untuk kebutuhan digital Anda. Konsultasi gratis!`
  }

  generateFallbackTags(keyword) {
    return [keyword, 'jasa pembayaran', 'indonesia', '2025', 'terpercaya', 'aman', 'cepat', 'mudah']
  }
}

export default AIEnhancedContentGenerator
