
// Enhanced Blog Generator with Title Validation
import { validateBlogTitle, generateSEOOptimizedTitle } from '../utils/title-validation.js';

export const generateBlogWithValidation = async (slug, content, keywords = []) => {
  // Generate title with validation
  let title = generateSEOOptimizedTitle(slug, keywords);
  let validation = validateBlogTitle(title);
  
  // If title is invalid, try to fix it
  if (!validation.isValid) {
    console.warn('Generated title has issues:', validation.issues);
    
    // Try alternative title generation
    title = generateAlternativeTitle(slug, keywords);
    validation = validateBlogTitle(title);
    
    if (!validation.isValid) {
      console.error('Could not generate valid title for slug:', slug);
      // Fallback to basic title
      title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  }
  
  return {
    title,
    content,
    slug,
    validation,
    meta_title: title.substring(0, 60),
    meta_description: content.substring(0, 160).replace(/<[^>]*>/g, '')
  };
};

const generateAlternativeTitle = (slug, keywords) => {
  // Alternative title generation logic
  const alternatives = {
    'bayar-akun-netflix': 'Panduan Lengkap Bayar Netflix di Indonesia 2024',
    'balance-paypal-adalah': 'Mengenal Balance PayPal: Cara Cek dan Kelola Saldo',
    'arti-paypal-indonesia': 'PayPal Indonesia: Panduan Komprehensif untuk Pemula',
    'akun-paypal-indonesia': 'Tutorial Membuat Akun PayPal Indonesia dengan Mudah',
    'arti-kata-paypal': 'Definisi PayPal: Sejarah dan Manfaat untuk Bisnis Online',
    'akun-paypal-adalah': 'Memahami Akun PayPal: Panduan Lengkap untuk Pemula',
    'aplikasi-pembayaran-paypal': 'Aplikasi PayPal: Fitur dan Cara Penggunaan Terlengkap'
  };
  
  return alternatives[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};
