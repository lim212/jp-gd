// server/api/blog/index.get.ts
import { defineEventHandler, getQuery } from 'h3'
import { promises as fs } from 'fs'
import path from 'path'
import { ensureHeroImage, normalizeTitle } from '../../utils/blog-normalize'
import { listGeneratedBlogs } from '../../utils/generated-blogs'
import { pickAuthorForSlug, isAdminLike } from '../../utils/authors'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Math.max(1, Number(query.page) || 1)
  const perPage = Math.min(1000, Math.max(1, Number(query.limit) || 8))

  try {
    // Load blog posts from data/blog directory
    const blogDir = path.join(process.cwd(), 'data', 'blog')
    let allPosts: any[] = []
    
    try {
      const files = await fs.readdir(blogDir)
      const blogFiles = files.filter(f => 
        f.endsWith('.json') && 
        f !== 'index.json' && 
        f !== 'popular-posts.json' && 
        f !== 'latest-posts.json' && 
        f !== 'cool-tags.json' &&
        !f.includes('generated')
      )
      
      console.log(`Found ${blogFiles.length} blog files in data/blog directory`)
      
      // Load blog posts from individual files
      for (const file of blogFiles) {
        try {
          const content = await fs.readFile(path.join(blogDir, file), 'utf-8')
          const blog = JSON.parse(content)
          
          if (blog && blog.slug && blog.title) {
            const imageCandidates = [
              blog.aiImageUrl,
              blog.ai_image_url,
              blog.imageUrl,
              blog.image_url,
              blog.image,
              blog.featured_image,
              blog.featuredImage,
              blog.coverImage,
              blog.cover_image,
              blog.thumbnail,
              blog.thumb,
              blog.heroImage,
              blog.meta?.image,
              Array.isArray(blog.gallery) ? blog.gallery[0] : undefined
            ] as (string | undefined)[]

            let resolvedImage: string | undefined
            for (const candidate of imageCandidates) {
              if (!candidate || typeof candidate !== 'string') continue
              const trimmed = candidate.trim()
              if (!trimmed) continue
              resolvedImage = trimmed
              break
            }

            if (!resolvedImage && blog.slug) {
              const imageDir = path.join(process.cwd(), 'data', 'blog', 'images')
              const possibleExt = ['.webp', '.jpg', '.jpeg', '.png']
              for (const ext of possibleExt) {
                const filePath = path.join(imageDir, `${blog.slug}${ext}`)
                try {
                  await fs.access(filePath)
                  resolvedImage = `/api/blog/image/${blog.slug}${ext}`
                  break
                } catch (error) {
                  // ignore missing file
                }
              }
            }

            const normalizedTitle = normalizeTitle(blog.title, blog.slug)
            const heroImage = ensureHeroImage(
              resolvedImage,
              normalizedTitle,
              blog.slug
            )
            console.debug('[BlogAPI] hero image resolved', {
              slug: blog.slug,
              source: resolvedImage || 'fallback',
              heroImage
            })

            allPosts.push({
              id: blog.id || Date.now() + Math.random(),
              slug: blog.slug,
              title: normalizedTitle,
              date: blog.date || blog.publish_at || new Date().toISOString(),
              image: heroImage,
              aiImageUrl: heroImage,
              excerpt: blog.excerpt || blog.meta_description || '',
              author: (blog.author && !blog.author.includes('JasaPembayaran') && !isAdminLike(blog.author))
                ? blog.author
                : pickAuthorForSlug(blog.slug),
          content: blog.content || '',
              categories: blog.categories || ['Blog', 'Panduan'],
              tags: blog.tags || [blog.slug, 'tips', 'panduan', 'indonesia']
            })
          }
        } catch (error) {
          console.error(`Error reading blog file ${file}:`, error)
        }
      }
      
      console.log(`Successfully loaded ${allPosts.length} blog posts`)
    } catch (error) {
      console.error('Error reading blog directory:', error)
    }

    // ✅ Merge AI-generated blogs from database/content/generated-blogs.json (REAL AI)
    try {
      const generated = await listGeneratedBlogs()
      if (generated && Array.isArray(generated) && generated.length > 0) {
        console.log(`[BlogAPI] Merging ${generated.length} AI-generated blogs from generated-blogs.json`)

        const aiPosts = generated.map((b: any) => {
          const normalizedTitle = normalizeTitle(b.title, b.slug)
          const heroImage = ensureHeroImage(
            b.featured_image || b.image,
            normalizedTitle,
            b.slug
          )

          return {
            id: b.id || Date.now() + Math.random(),
            slug: b.slug,
            title: normalizedTitle,
            date: b.publish_at || b.date || new Date().toISOString(),
            image: heroImage,
            aiImageUrl: heroImage,
            excerpt: b.meta_description || '',
            author: pickAuthorForSlug(b.slug || 'blog'),
            content: b.content || '',
            categories: ['Blog', 'Panduan'],
            tags: [b.slug, 'ai-blog', 'tips', 'panduan', 'indonesia']
          }
        })

        // Hindari duplikasi berdasarkan slug
        const existingSlugs = new Set(allPosts.map(p => p.slug))
        const merged = aiPosts.filter(p => p.slug && !existingSlugs.has(p.slug))
        allPosts.push(...merged)
      }
    } catch (error) {
      console.error('[BlogAPI] Error merging AI-generated blogs:', error)
    }
    
    // If no posts found, create some sample posts
    if (allPosts.length === 0) {
      console.log('No blog posts found, creating sample posts')
      allPosts = [
        {
          id: 1,
          slug: 'jasa-paypal',
          title: 'Jasa PayPal: Solusi Pembayaran Online Aman',
          date: new Date().toISOString(),
          image: '/images/fallback-news.svg',
          excerpt: 'Panduan lengkap tentang jasa PayPal untuk transaksi online yang aman dan terpercaya.',
          author: 'JasaPembayaran.com Team',
          content: '<h2>Pendahuluan</h2><p>PayPal adalah salah satu platform pembayaran online terpopuler di dunia...</p>',
          categories: ['Blog', 'Panduan'],
          tags: ['paypal', 'pembayaran', 'online']
        },
        {
          id: 2,
          slug: 'jasa-bayar-paypal',
          title: 'Jasa Bayar PayPal Cepat & Terpercaya',
          date: new Date(Date.now() - 86400000).toISOString(),
          image: '/images/fallback-news.svg',
          excerpt: 'Layanan jasa bayar PayPal yang cepat, aman, dan terpercaya untuk kebutuhan transaksi Anda.',
          author: 'JasaPembayaran.com Team',
          content: '<h2>Pendahuluan</h2><p>Layanan jasa bayar PayPal kami memberikan solusi terbaik...</p>',
          categories: ['Blog', 'Layanan'],
          tags: ['paypal', 'jasa', 'bayar']
        },
        {
          id: 3,
          slug: 'jasa-transfer-paypal',
          title: 'Jasa Transfer PayPal untuk Transaksi Global',
          date: new Date(Date.now() - 172800000).toISOString(),
          image: '/images/fallback-news.svg',
          excerpt: 'Transfer PayPal internasional yang aman dan cepat untuk berbagai kebutuhan bisnis.',
          author: 'JasaPembayaran.com Team',
          content: '<h2>Pendahuluan</h2><p>Transfer PayPal internasional menjadi kebutuhan penting...</p>',
          categories: ['Blog', 'Transfer'],
          tags: ['paypal', 'transfer', 'internasional']
        }
      ]
    }

    // Ensure every post has a normalized title and hero image
    allPosts = allPosts.map((post, idx) => {
      const normalizedTitle = normalizeTitle(post.title, post.slug || `post-${idx}`)
      const heroImage = ensureHeroImage(
        post.image,
        normalizedTitle,
        post.slug || `post-${idx}`
      )
      console.debug('[BlogAPI] ensure hero for cached post', {
        slug: post.slug || `post-${idx}`,
        heroImage
      })
      return {
        ...post,
        title: normalizedTitle,
        image: heroImage,
        aiImageUrl: heroImage
      }
    })

    // ✅ Sort posts by date (TERBARU DULU - newest first)
    // Priority: date > publish_at > created_at > current date
    allPosts.sort((a, b) => {
      const getDateValue = (post: any) => {
        const dateStr = post.date || post.publish_at || post.created_at || new Date().toISOString()
        const parsed = new Date(dateStr).getTime()
        // If invalid date, return current timestamp
        return isNaN(parsed) ? Date.now() : parsed
      }
      
      const dateA = getDateValue(a)
      const dateB = getDateValue(b)
      
      // Sort DESCENDING (newest first / terbaru dulu)
      return dateB - dateA
    })
    
    // Log first and last posts for debugging
    if (allPosts.length > 0) {
      console.log('✅ Blog posts sorted (newest first):')
      console.log('  First:', allPosts[0]?.title?.substring(0, 50), '→', allPosts[0]?.date)
      console.log('  Last:', allPosts[allPosts.length - 1]?.title?.substring(0, 50), '→', allPosts[allPosts.length - 1]?.date)
    }

    const total = allPosts.length
    const totalPages = Math.ceil(total / perPage)
    
    // Pagination
    const startIndex = (page - 1) * perPage
    const endIndex = startIndex + perPage
    const paginatedPosts = allPosts.slice(startIndex, endIndex)

    console.log(`Returning ${paginatedPosts.length} posts for page ${page} of ${totalPages}`)

    return {
      posts: paginatedPosts,
      pagination: {
        page,
        perPage,
        total,
        totalPages
      }
    }
  } catch (error) {
    console.error('Blog API error:', error)
    
    // Return empty result on error
    return {
      posts: [],
      pagination: {
        page: 1,
        perPage: 8,
        total: 0,
        totalPages: 0
      }
    }
  }
})