import { defineEventHandler, getQuery, setHeader } from 'h3'

// Simple icon proxy for external icon services
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const name = query.name as string
  
  if (!name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Icon name is required'
    })
  }
  
  try {
    // Parse icon name (format: "collection:icon-name")
    const [collection, iconName] = name.split(':')
    
    if (!collection || !iconName) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid icon format. Use "collection:icon-name"'
      })
    }
    
    // Set appropriate headers for SVG
    setHeader(event, 'Content-Type', 'image/svg+xml')
    setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
    
    // Generate a simple SVG icon based on the collection and name
    const svg = generateIconSVG(collection, iconName)
    
    return svg
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate icon'
    })
  }
})

function generateIconSVG(collection: string, iconName: string): string {
  // Generate a simple SVG icon based on the collection and name
  const size = 24
  const color = '#6b7280' // gray-500
  
  // Simple icon generation based on common patterns
  let path = ''
  
  switch (collection) {
    case 'lucide':
      path = generateLucideIcon(iconName)
      break
    case 'fa-solid':
      path = generateFontAwesomeIcon(iconName)
      break
    case 'heroicons':
      path = generateHeroIcon(iconName)
      break
    case 'simple-icons':
      path = generateSimpleIcon(iconName)
      break
    case 'mdi':
      path = generateMaterialIcon(iconName)
      break
    case 'circle-flags':
      path = generateFlagIcon(iconName)
      break
    default:
      // Default fallback icon
      path = `<circle cx="12" cy="12" r="10" fill="${color}" opacity="0.2"/><circle cx="12" cy="12" r="6" fill="${color}"/>`
  }
  
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    ${path}
  </svg>`
}

function generateLucideIcon(iconName: string): string {
  const color = '#6b7280'
  
  switch (iconName) {
    case 'chevron-down':
      return `<path d="m6 9 6 6 6-6" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`
    case 'chevron-up':
      return `<path d="m18 15-6-6-6 6" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`
    case 'menu':
      return `<path d="M3 12h18M3 6h18M3 18h18" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`
    case 'clock':
      return `<circle cx="12" cy="12" r="10" stroke="${color}" stroke-width="2" fill="none"/><path d="M12 6v6l4 2" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`
    case 'phone-call':
      return `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`
    default:
      return `<circle cx="12" cy="12" r="10" stroke="${color}" stroke-width="2" fill="none"/>`
  }
}

function generateFontAwesomeIcon(iconName: string): string {
  const color = '#6b7280'
  
  switch (iconName) {
    case 'user':
      return `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="12" cy="7" r="4" stroke="${color}" stroke-width="2" fill="none"/>`
    case 'clock':
      return `<circle cx="12" cy="12" r="10" stroke="${color}" stroke-width="2" fill="none"/><path d="M12 6v6l4 2" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`
    case 'calendar':
      return `<rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="${color}" stroke-width="2" fill="none"/><line x1="16" y1="2" x2="16" y2="6" stroke="${color}" stroke-width="2" stroke-linecap="round"/><line x1="8" y1="2" x2="8" y2="6" stroke="${color}" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="10" x2="21" y2="10" stroke="${color}" stroke-width="2" stroke-linecap="round"/>`
    default:
      return `<circle cx="12" cy="12" r="10" stroke="${color}" stroke-width="2" fill="none"/>`
  }
}

function generateHeroIcon(iconName: string): string {
  const color = '#6b7280'
  
  switch (iconName) {
    case 'information-circle':
      return `<path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`
    default:
      return `<circle cx="12" cy="12" r="10" stroke="${color}" stroke-width="2" fill="none"/>`
  }
}

function generateSimpleIcon(iconName: string): string {
  const color = '#6b7280'
  
  switch (iconName) {
    case 'whatsapp':
      return `<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" fill="${color}"/>`
    default:
      return `<circle cx="12" cy="12" r="10" stroke="${color}" stroke-width="2" fill="none"/>`
  }
}

function generateMaterialIcon(iconName: string): string {
  const color = '#6b7280'
  
  switch (iconName) {
    case 'paypal':
      return `<path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.543-.68c-.608-.685-1.46-1.03-2.55-1.03H9.95c-.524 0-.968.382-1.05.9L7.76 19.337h4.716c.524 0 .968-.382 1.05-.9l1.12-7.106h2.19c2.57 0 4.578-.543 5.69-1.81 1.01-1.15 1.304-2.42 1.012-4.287-.023-.143-.047-.288-.077-.437z" fill="${color}"/>`
    case 'credit-card':
      return `<path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" fill="${color}"/>`
    case 'information-outline':
      return `<path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" fill="${color}"/>`
    case 'certificate-outline':
      return `<path d="M13,21L15.2,16.6L20,17L16,13.3L17.2,8.5L13,11.2L8.8,8.5L10,13.3L6,17L10.8,16.6L13,21M12,8A3,3 0 0,1 15,5A3,3 0 0,1 18,8A3,3 0 0,1 15,11A3,3 0 0,1 12,8M7,12A3,3 0 0,1 10,9A3,3 0 0,1 13,12A3,3 0 0,1 10,15A3,3 0 0,1 7,12M17,12A3,3 0 0,1 20,9A3,3 0 0,1 23,12A3,3 0 0,1 20,15A3,3 0 0,1 17,12Z" fill="${color}"/>`
    case 'file-document-outline':
      return `<path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill="${color}"/>`
    case 'whatsapp':
      return `<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" fill="${color}"/>`
    default:
      return `<circle cx="12" cy="12" r="10" stroke="${color}" stroke-width="2" fill="none"/>`
  }
}

function generateFlagIcon(iconName: string): string {
  const color = '#6b7280'
  
  switch (iconName) {
    case 'id':
      return `<rect x="2" y="4" width="20" height="16" rx="2" fill="#ff0000"/><rect x="2" y="12" width="20" height="8" fill="#ffffff"/>`
    case 'us':
      return `<rect x="2" y="4" width="20" height="16" rx="2" fill="#b22234"/><rect x="2" y="4" width="20" height="1.23" fill="#ffffff"/><rect x="2" y="6.46" width="20" height="1.23" fill="#ffffff"/><rect x="2" y="8.92" width="20" height="1.23" fill="#ffffff"/><rect x="2" y="11.38" width="20" height="1.23" fill="#ffffff"/><rect x="2" y="13.84" width="20" height="1.23" fill="#ffffff"/><rect x="2" y="16.3" width="20" height="1.23" fill="#ffffff"/><rect x="2" y="18.76" width="20" height="1.23" fill="#ffffff"/>`
    default:
      return `<rect x="2" y="4" width="20" height="16" rx="2" fill="${color}" opacity="0.3"/>`
  }
}
