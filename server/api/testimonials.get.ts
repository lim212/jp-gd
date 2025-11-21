// server/api/testimonials.get.ts
import { defineEventHandler, getQuery } from 'h3'

// Mock testimonials data
const mockTestimonials = [
  {
    id: 1,
    name: "Ahmad Rizki",
    message: "Pelayanan sangat memuaskan, transaksi PayPal berjalan lancar dan cepat. Recommended!",
    rating: 5,
    date: "2025-01-15T10:30:00Z",
    avatar: "/images/avatars/avatar-1.jpg"
  },
  {
    id: 2,
    name: "Siti Nurhaliza",
    message: "JasaPembayaran.com sangat membantu untuk transaksi internasional. Proses mudah dan aman.",
    rating: 5,
    date: "2025-01-14T15:45:00Z",
    avatar: "/images/avatars/avatar-2.jpg"
  },
  {
    id: 3,
    name: "Budi Santoso",
    message: "Tim support responsif dan profesional. Transaksi PayPal selesai dalam hitungan menit.",
    rating: 5,
    date: "2025-01-13T09:20:00Z",
    avatar: "/images/avatars/avatar-3.jpg"
  },
  {
    id: 4,
    name: "Maya Sari",
    message: "Layanan terbaik untuk jasa pembayaran PayPal. Harga kompetitif dan proses cepat.",
    rating: 5,
    date: "2025-01-12T14:15:00Z",
    avatar: "/images/avatars/avatar-4.jpg"
  },
  {
    id: 5,
    name: "Rizki Pratama",
    message: "Sangat puas dengan layanan JasaPembayaran.com. Transaksi aman dan terpercaya.",
    rating: 5,
    date: "2025-01-11T11:30:00Z",
    avatar: "/images/avatars/avatar-5.jpg"
  },
  {
    id: 6,
    name: "Dewi Lestari",
    message: "Proses pembayaran PayPal sangat mudah dan cepat. Customer service sangat membantu.",
    rating: 5,
    date: "2025-01-10T16:45:00Z",
    avatar: "/images/avatars/avatar-6.jpg"
  },
  {
    id: 7,
    name: "Agus Wijaya",
    message: "Layanan jasa PayPal terbaik yang pernah saya gunakan. Highly recommended!",
    rating: 5,
    date: "2025-01-09T13:20:00Z",
    avatar: "/images/avatars/avatar-7.jpg"
  },
  {
    id: 8,
    name: "Indah Permata",
    message: "Transaksi PayPal berjalan lancar tanpa kendala. Tim sangat profesional dan ramah.",
    rating: 5,
    date: "2025-01-08T10:15:00Z",
    avatar: "/images/avatars/avatar-8.jpg"
  },
  {
    id: 9,
    name: "Fajar Nugroho",
    message: "JasaPembayaran.com memberikan layanan terbaik untuk transaksi PayPal. Sangat memuaskan!",
    rating: 5,
    date: "2025-01-07T15:30:00Z",
    avatar: "/images/avatars/avatar-9.jpg"
  },
  {
    id: 10,
    name: "Rina Wulandari",
    message: "Proses pembayaran sangat mudah dan aman. Customer service 24/7 sangat membantu.",
    rating: 5,
    date: "2025-01-06T12:45:00Z",
    avatar: "/images/avatars/avatar-10.jpg"
  },
  {
    id: 11,
    name: "Hendra Kurniawan",
    message: "Layanan jasa PayPal terpercaya dan profesional. Transaksi cepat dan aman.",
    rating: 5,
    date: "2025-01-05T09:20:00Z",
    avatar: "/images/avatars/avatar-11.jpg"
  },
  {
    id: 12,
    name: "Lina Marlina",
    message: "Sangat puas dengan layanan JasaPembayaran.com. Proses mudah dan hasil memuaskan.",
    rating: 5,
    date: "2025-01-04T14:10:00Z",
    avatar: "/images/avatars/avatar-12.jpg"
  }
]

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const offset = Math.max(0, Number(query.offset) || 0)
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 12))
  
  try {
    // Try to fetch from external API first (if configured)
    const externalApiBase = process.env.TESTIMONIALS_API_BASE
    const disableTestimonials = process.env.DISABLE_TESTIMONIALS === 'true'
    
    if (externalApiBase && !disableTestimonials) {
      try {
        const response = await fetch(`${externalApiBase}?offset=${offset}&limit=${limit}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'JasaPembayaran.com/1.0'
          },
          signal: AbortSignal.timeout(5000) // 5 second timeout
        })
        
        if (response.ok) {
          const data = await response.json()
          
          // Normalize the response format
          const normalizedItems = (data.items || data.testimonials || data).map((item: any) => ({
            id: item.id || Math.random(),
            name: item.name || item.nama || item.full_name || item.by || 'Anonymous',
            message: item.message || item.pesan || item.testimonial || item.review || item.content || item.comment || '',
            rating: Math.min(5, Math.max(1, Number(item.rating) || 5)),
            date: item.date || item.created_at || item.timestamp || new Date().toISOString(),
            avatar: item.avatar || item.profile_picture || `/images/avatars/avatar-${Math.floor(Math.random() * 12) + 1}.jpg`
          }))
          
          return {
            items: normalizedItems,
            pagination: {
              offset,
              limit,
              total: data.total || normalizedItems.length,
              isMockData: false
            }
          }
        }
      } catch (externalError) {
        console.log('External testimonials API failed, using mock data:', externalError.message)
      }
    }
    
    // Fallback to mock data
    const startIndex = offset
    const endIndex = Math.min(startIndex + limit, mockTestimonials.length)
    const paginatedTestimonials = mockTestimonials.slice(startIndex, endIndex)
    
    return {
      items: paginatedTestimonials,
      pagination: {
        offset,
        limit,
        total: mockTestimonials.length,
        isMockData: true
      }
    }
    
  } catch (error) {
    console.error('Testimonials API error:', error)
    
    // Return mock data on error
    const startIndex = offset
    const endIndex = Math.min(startIndex + limit, mockTestimonials.length)
    const paginatedTestimonials = mockTestimonials.slice(startIndex, endIndex)
    
    return {
      items: paginatedTestimonials,
      pagination: {
        offset,
        limit,
        total: mockTestimonials.length,
        isMockData: true
      }
    }
  }
})
