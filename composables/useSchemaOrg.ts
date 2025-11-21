// composables/useSchemaOrg.ts
// Schema.org markup for better SEO

export const useSchemaOrg = () => {
  const config = useRuntimeConfig()
  const route = useRoute()

  // Organization Schema
  const organizationSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'JasaPembayaran.com',
    url: 'https://jasapembayaran.com',
    logo: 'https://jasapembayaran.com/logo.png',
    description: 'Jasa PayPal terpercaya #1 di Indonesia untuk isi saldo, bayar, dan transfer PayPal. Melayani BTC, TRC20, dan berbagai layanan digital.',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+62-898-8888-250',
      contactType: 'Customer Service',
      availableLanguage: ['Indonesian', 'English']
    },
    sameAs: [
      'https://www.facebook.com/jasapembayaran',
      'https://twitter.com/jasapembayaran',
      'https://www.instagram.com/jasapembayaran'
    ]
  })

  // Article Schema for Blog Posts
  const articleSchema = (article: {
    title: string
    description: string
    image: string
    publishDate: string
    modifiedDate?: string
    author?: string
    slug: string
  }) => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image.startsWith('http') ? article.image : `https://jasapembayaran.com${article.image}`,
    datePublished: article.publishDate,
    dateModified: article.modifiedDate || article.publishDate,
    author: {
      '@type': 'Person',
      name: article.author || 'JasaPembayaran.com Team'
    },
    publisher: {
      '@type': 'Organization',
      name: 'JasaPembayaran.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://jasapembayaran.com/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://jasapembayaran.com/blog/${article.slug}`
    }
  })

  // BreadcrumbList Schema
  const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `https://jasapembayaran.com${item.url}`
    }))
  })

  // FAQ Schema
  const faqSchema = (faqs: { question: string; answer: string }[]) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  })

  // Service Schema
  const serviceSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Jasa Pembayaran Digital',
    provider: {
      '@type': 'Organization',
      name: 'JasaPembayaran.com'
    },
    areaServed: {
      '@type': 'Country',
      name: 'Indonesia'
    },
    description: 'Layanan jasa PayPal terpercaya untuk top up, transfer, dan pembayaran digital'
  })

  // Insert schema to head
  const insertSchema = (schema: any) => {
    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(schema)
        }
      ]
    })
  }

  return {
    organizationSchema,
    articleSchema,
    breadcrumbSchema,
    faqSchema,
    serviceSchema,
    insertSchema
  }
}

