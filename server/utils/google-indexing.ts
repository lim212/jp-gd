// Google Search Console Indexing API Integration
// Auto-submit new articles for fast indexing (hours instead of days!)

import { promises as fs } from 'fs'
import path from 'path'

export class GoogleIndexing {
  private apiKey: string
  private serviceAccount: any

  constructor() {
    this.apiKey = process.env.GOOGLE_INDEXING_API_KEY || ''
    
    // Load service account credentials if available
    this.loadServiceAccount()
  }

  /**
   * Load Google Service Account credentials
   */
  async loadServiceAccount() {
    try {
      const credPath = process.env.GOOGLE_SERVICE_ACCOUNT_PATH || 'config/google-service-account.json'
      const fullPath = path.join(process.cwd(), credPath)
      const content = await fs.readFile(fullPath, 'utf-8')
      this.serviceAccount = JSON.parse(content)
      console.log('✅ Google Service Account loaded')
    } catch (error) {
      console.log('⚠️ Google Service Account not found (optional)')
    }
  }

  /**
   * Submit URL to Google for indexing
   */
  async submitUrl(url: string, type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED'): Promise<boolean> {
    if (!this.apiKey && !this.serviceAccount) {
      console.log('⚠️ Google Indexing API not configured, skipping submission')
      return false
    }

    try {
      console.log(`🔍 Submitting to Google: ${url}`)
      
      // Method 1: Using Indexing API (requires service account)
      if (this.serviceAccount) {
        const token = await this.getAccessToken()
        
        const response = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            url: url,
            type: type
          })
        })
        
        const data = await response.json()
        
        if (response.ok) {
          console.log(`✅ Submitted to Google Indexing API: ${url}`)
          return true
        } else {
          console.error('❌ Google Indexing API error:', data)
          return false
        }
      }
      
      // Method 2: Using sitemap ping (simpler, no auth needed)
      await this.pingSitemap()
      return true
      
    } catch (error) {
      console.error('❌ Error submitting to Google:', error)
      return false
    }
  }

  /**
   * Ping Google sitemap
   */
  async pingSitemap(): Promise<void> {
    try {
      const sitemapUrl = encodeURIComponent('https://jasapembayaran.com/sitemap.xml')
      const pingUrl = `https://www.google.com/ping?sitemap=${sitemapUrl}`
      
      const response = await fetch(pingUrl)
      
      if (response.ok) {
        console.log('✅ Sitemap pinged to Google')
      } else {
        console.log('⚠️ Sitemap ping failed (not critical)')
      }
    } catch (error) {
      console.error('❌ Error pinging sitemap:', error)
    }
  }

  /**
   * Get OAuth2 access token for Google API
   */
  private async getAccessToken(): Promise<string> {
    // Simplified - in production, use google-auth-library
    // For now, return placeholder or use API key
    return this.apiKey
  }

  /**
   * Batch submit multiple URLs
   */
  async batchSubmit(urls: string[]): Promise<{ submitted: number, failed: number }> {
    let submitted = 0
    let failed = 0
    
    console.log(`📤 Batch submitting ${urls.length} URLs to Google...`)
    
    for (const url of urls) {
      const success = await this.submitUrl(url)
      if (success) {
        submitted++
      } else {
        failed++
      }
      
      // Rate limiting - Google allows 200 requests/day
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    console.log(`✅ Batch submit complete: ${submitted} submitted, ${failed} failed`)
    
    return { submitted, failed }
  }

  /**
   * Submit to Bing Webmaster Tools
   */
  async submitToBing(url: string): Promise<boolean> {
    const bingApiKey = process.env.BING_WEBMASTER_API_KEY
    
    if (!bingApiKey) {
      console.log('⚠️ Bing API not configured')
      return false
    }

    try {
      const siteUrl = process.env.BASE_URL || 'https://jasapembayaran.com'
      const endpoint = `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrl?apikey=${bingApiKey}`
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteUrl: siteUrl,
          url: url
        })
      })
      
      if (response.ok) {
        console.log(`✅ Submitted to Bing: ${url}`)
        return true
      }
      
      return false
    } catch (error) {
      console.error('❌ Bing submission error:', error)
      return false
    }
  }

  /**
   * Submit to all search engines
   */
  async submitToAllSearchEngines(url: string): Promise<{ google: boolean, bing: boolean }> {
    console.log(`\n🌐 Submitting ${url} to all search engines...`)
    
    const results = {
      google: await this.submitUrl(url),
      bing: await this.submitToBing(url)
    }
    
    console.log(`✅ Submission complete: Google=${results.google}, Bing=${results.bing}`)
    
    return results
  }
}

export default GoogleIndexing

