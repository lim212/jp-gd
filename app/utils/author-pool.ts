export const AUTHOR_POOL: string[] = [
  'Felix Mahendra', 'Andi Pratama', 'Budi Santoso', 'Citra Maharani', 'Dimas Kurniawan',
  'Eka Putri', 'Fajar Nugroho', 'Gita Anindya', 'Hendra Wijaya', 'Intan Safitri',
  'Joko Saputra', 'Karin Amelia', 'Luthfi Ramadhan', 'Maya Sari', 'Nanda Prasetyo',
  'Oki Firmansyah', 'Putri Ayu', 'Rian Saputra', 'Sinta Dewi', 'Taufik Hidayat',
  'Vina Lestari', 'Wulan Sari', 'Yoga Mahardika', 'Zahra Nurfitri', 'Aditya Rahman',
  'Bagus Nugraha', 'Calista Wulandari', 'Devi Oktaviani', 'Erlangga Setiawan', 'Farah Ayuningtyas',
  'Galang Prakoso', 'Helmi Saputra', 'Indira Maharani', 'Jihan Permata', 'Keyla Shafira',
  'Laras Sekar', 'Mahesa Putra', 'Nabila Putri', 'Orlando Siregar', 'Priska Natalia',
  'Qori Azzahra', 'Raffael Wibowo', 'Selvi Anjani', 'Tara Pertiwi', 'Utami Dwitasari',
  'Vira Damayanti', 'Widya Rahmania', 'Xenia Ayunda', 'Yosua Ferdinand', 'Zidan Alfath',
  'Alya Salsabila', 'Bian Pradipta', 'Chandra Kusuma', 'Dini Lestari', 'Elang Surya',
  'Fauzan Rafi', 'Ghaniyah Syifa', 'Hanif Setyo', 'Irene Kusnadi', 'Javier Alvino',
  'Kezia Aprilia', 'Leo Hartanto', 'Mega Azalea', 'Niko Wicaksono', 'Olive Maharani',
  'Pradana Dewa', 'Queena Laksmi', 'Raka Firdaus', 'Salma Rahmadani', 'Tito Wiryawan',
  'Ufuk Maulana', 'Valen Angkasa', 'Wildan Arya', 'Xaverius Andika', 'Yumna Maresha',
  'Zahwa Amalia', 'Arga Darmawan', 'Belva Ramadhani', 'Chyntia Veronika', 'Davin Maheswara',
  'Elora Cahyani', 'Ferry Januar', 'Gilang Mahaputra', 'Hilda Rukmana', 'Ikhsan Malik',
  'Jasmin Cahya', 'Kino Aryasatya', 'Lina Widodo', 'Maria Fransiska', 'Novi Anggita',
  'Omar Fadhil', 'Prita Oktarina', 'Qirani Prameswari', 'Reno Syahputra', 'Safira Khalila',
  'Tania Dwikora', 'Ubay Ramadhan', 'Verrell Aditya', 'Widi Hartati', 'Xaveria Mirah',
  'Yossi Permadi', 'Zikri Alamsyah', 'Ahmad Fauzi', 'Bella Kartika', 'Cahya Permata',
  'Dian Kusuma', 'Eko Wijaya', 'Fitri Handayani', 'Guntur Pratama', 'Hana Lestari',
  'Ivan Gunawan', 'Jihan Sari', 'Krisna Aditya', 'Lia Permata', 'Mario Santoso',
  'Nina Wulandari', 'Oscar Wijaya', 'Putra Ramadhan', 'Rina Kartika', 'Sari Dewi',
  'Teguh Prasetyo', 'Umi Kurnia', 'Vino Maulana', 'Wira Nugroho', 'Yuda Pratama',
  'Zara Maharani', 'Aris Setiawan', 'Bima Aditya', 'Cinta Sari', 'Doni Kurniawan',
  'Eva Permata', 'Feri Gunawan', 'Gina Lestari', 'Hadi Wijaya', 'Indah Kartika',
  'Jaya Pratama', 'Kiki Sari', 'Luki Ramadhan', 'Mira Dewi', 'Nando Santoso',
  'Ovi Kurniawan', 'Pandu Wijaya', 'Rizki Pratama', 'Sari Lestari', 'Toni Gunawan',
  'Udin Kurnia', 'Vira Sari', 'Wawan Pratama', 'Yani Kartika', 'Zaki Ramadhan'
]

export function isAdminLike(name?: string | null): boolean {
  const s = String(name || '').trim().toLowerCase()
  if (!s) return true
  return s === 'admin' || s.includes('admin blog') || /^admin\b/.test(s)
}

function hashString(input: string): number {
  let h = 2166136261 >>> 0 // FNV-1a
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function pickAuthorForSlug(slug?: string, preferred?: string): string {
  if (preferred && !isAdminLike(preferred)) {
    const p = String(preferred).trim()
    if (p) return p
  }
  const base = String(slug || '').trim().toLowerCase() || String(Date.now())
  const idx = AUTHOR_POOL.length > 0 ? hashString(base) % AUTHOR_POOL.length : 0
  return AUTHOR_POOL[idx] || 'Felix Mahendra'
}

