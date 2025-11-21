
// Title Validation Middleware for Blog Generation
export const validateAndCleanTitle = (title, slug) => {
  // Clean repetitive patterns
  let cleanTitle = title
    .replace(/(Mudah, Aman, dan Terjangkau:?\s*)+/gi, '')
    .replace(/(Panduan Lengkap\s*)+/gi, 'Panduan Lengkap ')
    .replace(/(Tanpa Ribet\s*)+/gi, '')
    .replace(/(Solusi Aman & Cepat untuk\s*)+/gi, '')
    .replace(/(:?\s*)+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Length validation
  if (cleanTitle.length > 80) {
    const words = cleanTitle.split(' ');
    let truncated = '';
    
    for (const word of words) {
      if ((truncated + ' ' + word).trim().length <= 80) {
        truncated += (truncated ? ' ' : '') + word;
      } else {
        break;
      }
    }
    
    cleanTitle = truncated.trim();
  }
  
  // Ensure minimum length
  if (cleanTitle.length < 30) {
    const baseTitles = {
      'bayar-akun-netflix': 'Cara Bayar Akun Netflix dengan Mudah dan Aman - Panduan Lengkap 2024',
      'balance-paypal-adalah': 'Balance PayPal Adalah: Pengertian, Cara Cek, dan Tips Mengelola Saldo',
      'arti-paypal-indonesia': 'PayPal Indonesia: Panduan Lengkap untuk Pemula dan Tips Keamanan',
      'akun-paypal-indonesia': 'Cara Membuat Akun PayPal Indonesia: Panduan Lengkap untuk Pemula',
      'arti-kata-paypal': 'Arti Kata PayPal: Pengertian, Sejarah, dan Manfaat untuk Transaksi Online',
      'akun-paypal-adalah': 'Akun PayPal Adalah: Jenis, Fitur, dan Cara Memilih yang Tepat',
      'aplikasi-pembayaran-paypal': 'Aplikasi Pembayaran PayPal: Fitur, Keunggulan, dan Cara Menggunakan'
    };
    
    cleanTitle = baseTitles[slug] || cleanTitle;
  }
  
  return {
    title: cleanTitle,
    isValid: cleanTitle.length >= 30 && cleanTitle.length <= 80,
    length: cleanTitle.length
  };
};

// Middleware to prevent repetitive titles in future blog generation
export const preventRepetitiveTitles = (req, res, next) => {
  if (req.body && req.body.title) {
    const validation = validateAndCleanTitle(req.body.title, req.body.slug);
    
    if (!validation.isValid) {
      console.warn('Invalid title detected, cleaning...');
      req.body.title = validation.title;
    }
  }
  
  next();
};
