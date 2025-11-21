
// Title Validation System - Google Optimal (50-60 characters)
export const TITLE_VALIDATION_RULES = {
  MIN_LENGTH: 40,
  MAX_LENGTH: 60, // Google optimal: 50-60 characters
  MAX_REPEAT_WORDS: 2,
  FORBIDDEN_PATTERNS: [
    /(Mudah, Aman, dan Terjangkau)/gi,
    /(Panduan Lengkap)/gi,
    /(Tanpa Ribet)/gi,
    /(Solusi Aman & Cepat untuk)/gi,
    /(Panduan Terbaik)/gi,
    /(Solusi Terbaik)/gi,
    /(Maksimalkan.*dengan)/gi
  ]
};

export const validateBlogTitle = (title) => {
  const issues = [];
  
  // Check length
  if (title.length < TITLE_VALIDATION_RULES.MIN_LENGTH) {
    issues.push(`Title too short (${title.length} < ${TITLE_VALIDATION_RULES.MIN_LENGTH})`);
  }
  
  if (title.length > TITLE_VALIDATION_RULES.MAX_LENGTH) {
    issues.push(`Title too long (${title.length} > ${TITLE_VALIDATION_RULES.MAX_LENGTH})`);
  }
  
  // Check for repetitive patterns
  for (const pattern of TITLE_VALIDATION_RULES.FORBIDDEN_PATTERNS) {
    const matches = title.match(pattern);
    if (matches && matches.length > TITLE_VALIDATION_RULES.MAX_REPEAT_WORDS) {
      issues.push(`Repetitive pattern found: "${matches[0]}" (${matches.length} times)`);
    }
  }
  
  // Check for word repetition
  const words = title.toLowerCase().split(/\s+/);
  const wordCount = {};
  for (const word of words) {
    if (word.length > 3) {
      wordCount[word] = (wordCount[word] || 0) + 1;
    }
  }
  
  for (const [word, count] of Object.entries(wordCount)) {
    if (count > TITLE_VALIDATION_RULES.MAX_REPEAT_WORDS) {
      issues.push(`Word "${word}" repeated ${count} times`);
    }
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    score: Math.max(0, 100 - (issues.length * 20))
  };
};

export const generateSEOOptimizedTitle = (slug, keywords = []) => {
  const baseTitles = {
    'bayar-akun-netflix': 'Cara Bayar Akun Netflix dengan Mudah dan Aman - Panduan Lengkap 2024',
    'balance-paypal-adalah': 'Balance PayPal Adalah: Pengertian, Cara Cek, dan Tips Mengelola Saldo',
    'arti-paypal-indonesia': 'PayPal Indonesia: Panduan Lengkap untuk Pemula dan Tips Keamanan',
    'akun-paypal-indonesia': 'Cara Membuat Akun PayPal Indonesia: Panduan Lengkap untuk Pemula',
    'arti-kata-paypal': 'Arti Kata PayPal: Pengertian, Sejarah, dan Manfaat untuk Transaksi Online',
    'akun-paypal-adalah': 'Akun PayPal Adalah: Jenis, Fitur, dan Cara Memilih yang Tepat',
    'aplikasi-pembayaran-paypal': 'Aplikasi Pembayaran PayPal: Fitur, Keunggulan, dan Cara Menggunakan'
  };
  
  let title = baseTitles[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  // Add keywords if provided and space allows
  if (keywords.length > 0 && title.length < 60) {
    const keywordString = keywords.slice(0, 2).join(', ');
    if (title.length + keywordString.length + 3 < 80) {
      title += ` - ${keywordString}`;
    }
  }
  
  return title;
};
