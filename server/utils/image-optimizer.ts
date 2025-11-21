// Image Optimizer with Sharp
// Compress images 500KB → 100KB (80% reduction!)
// Optimize for web & SEO

import sharp from 'sharp'
import { promises as fs } from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'

export class ImageOptimizer {
  private defaultQuality = 80
  private maxWidth = 1200
  private maxHeight = 630
  private format = 'jpeg'

  /**
   * Download and optimize image in one go
   */
  async downloadAndOptimize(imageUrl: string, slug: string): Promise<{ path: string, size: number, optimized: boolean }> {
    try {
      console.log(`🖼️ Downloading image: ${imageUrl}`)
      
      // Download image
      const imageBuffer = await this.downloadImage(imageUrl)
      console.log(`   📥 Downloaded: ${(imageBuffer.length / 1024).toFixed(2)} KB`)
      
      // Optimize image
      const optimizedBuffer = await this.optimizeImage(imageBuffer)
      console.log(`   ⚡ Optimized: ${(optimizedBuffer.length / 1024).toFixed(2)} KB`)
      
      // Calculate reduction
      const reduction = ((1 - optimizedBuffer.length / imageBuffer.length) * 100).toFixed(1)
      console.log(`   ✅ Reduction: ${reduction}% smaller`)
      
      // Save optimized image
      const timestamp = Date.now()
      const filename = `${slug}-${timestamp}.jpg`
      const savePath = path.join(process.cwd(), 'public', 'images', 'blog', filename)
      
      await fs.mkdir(path.dirname(savePath), { recursive: true })
      await fs.writeFile(savePath, optimizedBuffer)
      
      const publicPath = `/images/blog/${filename}`
      console.log(`   💾 Saved: ${publicPath}`)
      
      return {
        path: publicPath,
        size: optimizedBuffer.length,
        optimized: true
      }
      
    } catch (error) {
      console.error('❌ Error optimizing image:', error)
      
      // Fallback: try to save without optimization
      try {
        const buffer = await this.downloadImage(imageUrl)
        const filename = `${slug}-${Date.now()}.jpg`
        const savePath = path.join(process.cwd(), 'public', 'images', 'blog', filename)
        await fs.writeFile(savePath, buffer)
        
        return {
          path: `/images/blog/${filename}`,
          size: buffer.length,
          optimized: false
        }
      } catch (fallbackError) {
        throw new Error(`Failed to process image: ${fallbackError}`)
      }
    }
  }

  /**
   * Optimize existing image
   */
  async optimizeImage(buffer: Buffer): Promise<Buffer> {
    try {
      return await sharp(buffer)
        .resize(this.maxWidth, this.maxHeight, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({
          quality: this.defaultQuality,
          progressive: true,
          mozjpeg: true // Use mozjpeg for better compression
        })
        .toBuffer()
    } catch (error) {
      console.error('❌ Sharp optimization failed:', error)
      return buffer // Return original if optimization fails
    }
  }

  /**
   * Download image from URL
   */
  private downloadImage(url: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https') ? https : http
      
      protocol.get(url, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          // Handle redirects
          const redirectUrl = response.headers.location
          if (redirectUrl) {
            this.downloadImage(redirectUrl).then(resolve).catch(reject)
            return
          }
        }
        
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download: ${response.statusCode}`))
          return
        }
        
        const chunks: Buffer[] = []
        response.on('data', chunk => chunks.push(chunk))
        response.on('end', () => resolve(Buffer.concat(chunks)))
        response.on('error', reject)
      }).on('error', reject)
    })
  }

  /**
   * Batch optimize images
   */
  async batchOptimize(imagePaths: string[]): Promise<{ optimized: number, failed: number, totalSaved: number }> {
    let optimized = 0
    let failed = 0
    let totalSaved = 0
    
    for (const imagePath of imagePaths) {
      try {
        const fullPath = path.join(process.cwd(), 'public', imagePath)
        const buffer = await fs.readFile(fullPath)
        const originalSize = buffer.length
        
        const optimizedBuffer = await this.optimizeImage(buffer)
        await fs.writeFile(fullPath, optimizedBuffer)
        
        const saved = originalSize - optimizedBuffer.length
        totalSaved += saved
        optimized++
        
        console.log(`✅ Optimized: ${imagePath} (saved ${(saved / 1024).toFixed(2)} KB)`)
      } catch (error) {
        failed++
        console.error(`❌ Failed: ${imagePath}`, error)
      }
    }
    
    return { optimized, failed, totalSaved }
  }

  /**
   * Generate WebP version (modern format)
   */
  async generateWebP(buffer: Buffer, slug: string): Promise<string> {
    try {
      const webpBuffer = await sharp(buffer)
        .resize(this.maxWidth, this.maxHeight, { fit: 'cover' })
        .webp({ quality: 85 })
        .toBuffer()
      
      const filename = `${slug}-${Date.now()}.webp`
      const savePath = path.join(process.cwd(), 'public', 'images', 'blog', filename)
      await fs.writeFile(savePath, webpBuffer)
      
      return `/images/blog/${filename}`
    } catch (error) {
      console.error('❌ WebP generation failed:', error)
      throw error
    }
  }

  /**
   * Generate multiple image sizes (responsive)
   */
  async generateResponsiveSizes(buffer: Buffer, slug: string): Promise<{ large: string, medium: string, small: string, thumbnail: string }> {
    const sizes = {
      large: { width: 1200, height: 630, suffix: 'lg' },
      medium: { width: 800, height: 420, suffix: 'md' },
      small: { width: 400, height: 210, suffix: 'sm' },
      thumbnail: { width: 200, height: 105, suffix: 'thumb' }
    }
    
    const results: any = {}
    
    for (const [key, config] of Object.entries(sizes)) {
      try {
        const optimized = await sharp(buffer)
          .resize(config.width, config.height, { fit: 'cover' })
          .jpeg({ quality: this.defaultQuality, progressive: true })
          .toBuffer()
        
        const filename = `${slug}-${Date.now()}-${config.suffix}.jpg`
        const savePath = path.join(process.cwd(), 'public', 'images', 'blog', filename)
        await fs.writeFile(savePath, optimized)
        
        results[key] = `/images/blog/${filename}`
      } catch (error) {
        console.error(`❌ Failed to generate ${key}:`, error)
        results[key] = null
      }
    }
    
    return results
  }
}

export default ImageOptimizer

