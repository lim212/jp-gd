// server/api/blog/cool-tags.get.ts
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    // Generate cool tags with colors - 24 tags total
    const coolTags = [
      { name: 'PayPal', slug: 'paypal', count: 15, color: '#0070ba' },
      { name: 'Pembayaran', slug: 'pembayaran', count: 23, color: '#25d366' },
      { name: 'Digital', slug: 'digital', count: 18, color: '#ff6b6b' },
      { name: 'Online', slug: 'online', count: 21, color: '#4ecdc4' },
      { name: 'Transaksi', slug: 'transaksi', count: 19, color: '#45b7d1' },
      { name: 'Keamanan', slug: 'keamanan', count: 16, color: '#f9ca24' },
      { name: 'Bisnis', slug: 'bisnis', count: 14, color: '#6c5ce7' },
      { name: 'Tips', slug: 'tips', count: 22, color: '#a29bfe' },
      { name: 'Panduan', slug: 'panduan', count: 17, color: '#fd79a8' },
      { name: 'Teknologi', slug: 'teknologi', count: 13, color: '#00b894' },
      { name: 'PAYTECH', slug: 'PAYTECH', count: 12, color: '#e17055' },
      { name: 'E-commerce', slug: 'e-commerce', count: 11, color: '#74b9ff' },
      { name: 'Bitcoin', slug: 'bitcoin', count: 20, color: '#f7931a' },
      { name: 'Crypto', slug: 'crypto', count: 18, color: '#8b5cf6' },
      { name: 'Blockchain', slug: 'blockchain', count: 16, color: '#06b6d4' },
      { name: 'Trading', slug: 'trading', count: 14, color: '#ef4444' },
      { name: 'Investasi', slug: 'investasi', count: 19, color: '#10b981' },
      { name: 'Banking', slug: 'banking', count: 17, color: '#3b82f6' },
      { name: 'Mobile', slug: 'mobile', count: 15, color: '#f59e0b' },
      { name: 'App', slug: 'app', count: 13, color: '#ec4899' },
      { name: 'Web', slug: 'web', count: 21, color: '#8b5cf6' },
      { name: 'API', slug: 'api', count: 12, color: '#06b6d4' },
      { name: 'Cloud', slug: 'cloud', count: 16, color: '#3b82f6' },
      { name: 'AI', slug: 'ai', count: 20, color: '#ef4444' }
    ]
    
    return {
      success: true,
      tags: coolTags
    }
  } catch (error) {
    console.error('Error fetching cool tags:', error)
    return {
      success: false,
      tags: []
    }
  }
})
