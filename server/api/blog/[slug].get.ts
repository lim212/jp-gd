// server/api/blog/[slug].get.ts
import { defineEventHandler, getRouterParam } from 'h3'
import { getPostFromCache } from '../../utils/blog-cache'
import { listGeneratedBlogs } from '../../utils/generated-blogs'
import { pickAuthorForSlug, isAdminLike } from '../../utils/authors'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  
  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug parameter is required'
    })
  }

  try {
    console.log(`Fetching blog post for slug: ${slug}`)
    
    // First try to load from data/blog directory
    const { promises: fs } = await import('fs')
    const path = await import('path')
    const blogDir = path.join(process.cwd(), 'data', 'blog')
    const blogFile = path.join(blogDir, `${slug}.json`)
    
    try {
      if (await fs.access(blogFile).then(() => true).catch(() => false)) {
        const content = await fs.readFile(blogFile, 'utf-8')
        // Handle potential UTF-8 BOM or leading whitespace which can break JSON.parse
        const cleanedContent = content.replace(/^\uFEFF/, '').trim()
        const blog = JSON.parse(cleanedContent)
        
        if (blog && blog.slug && blog.title) {
          console.log(`Found blog post: ${blog.title}`)
          return {
            id: blog.id || Date.now(),
            slug: blog.slug,
            title: blog.title,
            content: blog.content || '',
            excerpt: blog.excerpt || blog.meta_description || '',
            author: (blog.author && !blog.author.includes('JasaPembayaran') && !isAdminLike(blog.author)) 
              ? blog.author 
              : pickAuthorForSlug(blog.slug || slug),
            date: blog.date || blog.publish_at || new Date().toISOString(),
            publish_at: blog.date || blog.publish_at || new Date().toISOString(),
            image: blog.image || blog.featured_image || '/images/fallback-news.svg',
            featured_image: blog.image || blog.featured_image || '/images/fallback-news.svg',
            tags: blog.tags || [blog.slug, 'tips', 'panduan', 'indonesia'],
            categories: blog.categories || ['Blog', 'Panduan'],
            meta_title: blog.meta_title || blog.title,
            meta_description: blog.meta_description || blog.excerpt || ''
          }
        }
      }
    } catch (fileError) {
      console.error(`Error reading blog file ${slug}.json:`, fileError)
    }
    
    // Try to get from cache
    let post = await getPostFromCache(slug)
    if (post) {
      console.log(`Found blog post in cache: ${post.title}`)
      return post
    }
    
    // Try generated blogs
    const generatedBlogs = await listGeneratedBlogs()
    post = generatedBlogs.find(blog => blog.slug === slug)
    if (post) {
      console.log(`Found blog post in generated blogs: ${post.title}`)
      return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        content: post.content,
        excerpt: post.meta_description || '',
        author: pickAuthorForSlug(post.slug || slug),
        date: post.publish_at,
        publish_at: post.publish_at,
        image: post.featured_image,
        featured_image: post.featured_image,
        tags: [post.slug, 'tips', 'panduan', 'indonesia'],
        categories: ['Blog', 'Panduan'],
        meta_title: post.meta_title || post.title,
        meta_description: post.meta_description || ''
      }
    }
    
    // If still not found, create a fallback post
    console.log(`Creating fallback blog post for slug: ${slug}`)
    return {
      id: Date.now(),
      slug: slug,
      title: `Artikel ${slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
      content: `
        <h2>Pendahuluan</h2>
        <p>Selamat datang di artikel kami tentang ${slug.replace(/-/g, ' ')}. Dalam artikel ini, Anda akan menemukan informasi lengkap dan terpercaya tentang topik ini.</p>
        
        <h2>Tentang Layanan</h2>
        <p>Kami menyediakan layanan profesional yang dapat membantu Anda dengan kebutuhan terkait ${slug.replace(/-/g, ' ')}. Tim kami berpengalaman dan siap memberikan solusi terbaik.</p>
        
        <h2>Keunggulan</h2>
        <ul>
          <li>Layanan profesional dan terpercaya</li>
          <li>Proses yang cepat dan aman</li>
          <li>Dukungan customer service 24/7</li>
          <li>Harga yang kompetitif</li>
        </ul>
        
        <h2>Cara Menggunakan</h2>
        <ol>
          <li>Hubungi kami melalui WhatsApp atau email</li>
          <li>Konsultasikan kebutuhan Anda</li>
          <li>Kami akan memberikan penawaran terbaik</li>
          <li>Proses transaksi yang aman dan cepat</li>
          <li>Konfirmasi dan follow-up</li>
        </ol>
        
        <h2>Tips & FAQ</h2>
        <p>Berikut adalah beberapa tips dan pertanyaan yang sering diajukan:</p>
        <ul>
          <li><strong>Apakah layanan ini aman?</strong> Ya, kami menggunakan sistem keamanan berlapis.</li>
          <li><strong>Berapa lama prosesnya?</strong> Biasanya 1-24 jam tergantung kompleksitas.</li>
          <li><strong>Apakah ada garansi?</strong> Ya, kami memberikan garansi kepuasan pelanggan.</li>
        </ul>
        
        <h2>Kesimpulan</h2>
        <p>Dengan layanan kami, Anda dapat mempercayai kebutuhan ${slug.replace(/-/g, ' ')} Anda kepada tim profesional yang berpengalaman. Hubungi kami sekarang untuk konsultasi gratis!</p>
      `,
      excerpt: `Panduan lengkap tentang ${slug.replace(/-/g, ' ')} - layanan profesional dan terpercaya untuk kebutuhan Anda.`,
      author: pickAuthorForSlug(slug),
      date: new Date().toISOString(),
      publish_at: new Date().toISOString(),
      image: '/images/fallback-news.svg',
      featured_image: '/images/fallback-news.svg',
      tags: [slug, 'tips', 'panduan', 'indonesia'],
      categories: ['Blog', 'Panduan'],
      meta_title: `Artikel ${slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
      meta_description: `Panduan lengkap tentang ${slug.replace(/-/g, ' ')} - layanan profesional dan terpercaya untuk kebutuhan Anda.`
    }
  } catch (error) {
    console.error(`Error fetching blog post ${slug}:`, error)
    
    // Return a fallback post instead of throwing error
    return {
      id: Date.now(),
      slug: slug,
      title: `Artikel ${slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
      content: '<p>Konten blog sedang dimuat...</p>',
      excerpt: 'Artikel blog sedang dimuat',
      author: pickAuthorForSlug(slug),
      date: new Date().toISOString(),
      publish_at: new Date().toISOString(),
      image: '/images/fallback-news.svg',
      featured_image: '/images/fallback-news.svg',
      tags: [slug, 'tips', 'panduan', 'indonesia'],
      categories: ['Blog', 'Panduan'],
      meta_title: `Artikel ${slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
      meta_description: 'Artikel blog sedang dimuat'
    }
  }
})
