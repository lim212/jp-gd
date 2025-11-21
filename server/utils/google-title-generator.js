
// Google-Optimized Title Generator
class GoogleTitleGenerator {
  constructor() {
    this.titleTemplates = {
      short: [
        "{keyword} - Panduan Lengkap 2025",
        "Cara {keyword} yang Benar",
        "Tips {keyword} untuk Pemula", 
        "{keyword} - Solusi Terpercaya",
        "Panduan {keyword} Step by Step",
        "Rahasia {keyword} yang Efektif",
        "{keyword} - Panduan Praktis",
        "Cara Mudah {keyword}",
        "Tips Sukses {keyword}",
        "{keyword} - Solusi Terbaik"
      ],
      medium: [
        "Cara Mudah {keyword} - Panduan Lengkap",
        "Tips & Trik {keyword} untuk Sukses",
        "{keyword} - Panduan Komprehensif 2025",
        "Rahasia {keyword} yang Efektif",
        "Panduan Praktis {keyword} untuk Pemula",
        "Cara Benar {keyword} - Tips Expert",
        "{keyword} - Solusi Terpercaya & Aman",
        "Tips Jitu {keyword} untuk Pemula",
        "Panduan Lengkap {keyword} 2025",
        "Cara Sukses {keyword} - Panduan Expert"
      ]
    };
  }

  generateTitle(keyword) {
    // Clean keyword
    const cleanKeyword = keyword.toLowerCase().trim();
    
    // Choose template based on keyword length
    const templates = cleanKeyword.length > 20 ? this.titleTemplates.short : this.titleTemplates.medium;
    
    // Select random template
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    // Generate title
    let title = template.replace('{keyword}', cleanKeyword);
    
    // Ensure title is Google-optimized (50-60 characters)
    if (title.length > 60) {
      title = title.substring(0, 57) + '...';
    }
    
    // Capitalize first letter of each word
    title = title.replace(/\b\w/g, l => l.toUpperCase());
    
    return title;
  }

  validateTitle(title) {
    const issues = [];
    
    if (title.length < 30) {
      issues.push('Title too short (minimum 30 characters)');
    }
    
    if (title.length > 60) {
      issues.push('Title too long (maximum 60 characters)');
    }
    
    if (!title.includes('2025') && !title.includes('Tips') && !title.includes('Panduan')) {
      issues.push('Title missing SEO keywords');
    }
    
    return {
      isValid: issues.length === 0,
      issues: issues,
      length: title.length
    };
  }
}

export default GoogleTitleGenerator;
