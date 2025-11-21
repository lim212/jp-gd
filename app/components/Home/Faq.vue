<script setup lang="ts">
const faqItems = ref([
  {
    label: "Apa itu Jasa Pembayaran PayPal Terpercaya?",
    content:
      '<div class="space-y-3"><p><a href="/" class="font-semibold text-blue-600 hover:text-blue-700 transition-colors">JasaPembayaran.com</a> adalah penyedia <strong>jasa PayPal terpercaya</strong> yang telah melayani ribuan pelanggan sejak 2010.</p><div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700"><h4 class="font-semibold text-blue-800 dark:text-blue-200 mb-2">Layanan yang Tersedia:</h4><ul class="space-y-1 text-blue-700 dark:text-blue-300"><li>• PayPal Transfer & Top Up</li><li>• Neteller & Skrill</li><li>• Kartu Kredit</li><li>• Bitcoin & TRC20</li></ul></div><p class="text-sm text-gray-600 dark:text-gray-400">Proses cepat dan aman 24/7 dengan tingkat kepuasan pelanggan yang tinggi.</p></div>',
  },
  {
    label: "Apa keuntungan menggunakan Jasa Bayar PayPal?",
    content:
      '<div class="space-y-4"><p>Menggunakan <strong>jasa bayar PayPal</strong> dari JasaPembayaran.com memberikan banyak keuntungan:</p><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"><div class="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700"><UIcon name="i-lucide-shield-check" class="text-green-600 dark:text-green-400 size-5 mt-0.5 flex-shrink-0" /><div><h4 class="font-medium text-green-800 dark:text-green-200">Keamanan</h4><p class="text-sm text-green-700 dark:text-green-300">Terjamin</p><p class="text-sm text-green-700 dark:text-green-300">Transaksi aman</p><p class="text-sm text-green-700 dark:text-green-300">enkripsi SSL</p></div></div><div class="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700"><UIcon name="i-lucide-clock" class="text-blue-600 dark:text-blue-400 size-5 mt-0.5 flex-shrink-0" /><div><h4 class="font-medium text-blue-800 dark:text-blue-200">Proses</h4><p class="text-sm text-blue-700 dark:text-blue-300">Cepat</p><p class="text-sm text-blue-700 dark:text-blue-300">Tersedia 24/7</p><p class="text-sm text-blue-700 dark:text-blue-300">proses instan</p></div></div><div class="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700"><UIcon name="i-lucide-credit-card" class="text-purple-600 dark:text-purple-400 size-5 mt-0.5 flex-shrink-0" /><div><h4 class="font-medium text-purple-800 dark:text-purple-200">Tanpa Akun PayPal</h4><p class="text-sm text-purple-700 dark:text-purple-300">Tidak perlu memiliki akun PayPal</p></div></div><div class="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700"><UIcon name="i-lucide-headphones" class="text-orange-600 dark:text-orange-400 size-5 mt-0.5 flex-shrink-0" /><div><h4 class="font-medium text-orange-800 dark:text-orange-200">Customer Service</h4><p class="text-sm text-orange-700 dark:text-orange-300">Responsif via WhatsApp & email</p></div></div></div></div>',
  },
  {
    label: "Bagaimana cara menggunakan Jasa Transfer PayPal?",
    content:
      '<div class="space-y-4"><p>Untuk menggunakan <strong>jasa transfer PayPal</strong>, ikuti langkah-langkah berikut:</p><div class="space-y-3"><div class="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700"><div class="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div><div><h4 class="font-medium text-blue-800 dark:text-blue-200">Hubungi Customer Service</h4><p class="text-sm text-blue-700 dark:text-blue-300">Hubungi kami melalui <a target="_blank" href="https://api.whatsapp.com/send/?phone=628988888250" class="font-medium underline hover:no-underline">WhatsApp</a> atau email</p></div></div><div class="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-700"><div class="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div><div><h4 class="font-medium text-green-800 dark:text-green-200">Berikan Detail Transfer</h4><p class="text-sm text-green-700 dark:text-green-300">Beritahu email penerima, jumlah transfer, dan informasi lainnya</p></div></div><div class="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-lg border border-purple-200 dark:border-purple-700"><div class="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div><div><h4 class="font-medium text-purple-800 dark:text-purple-200">Lakukan Pembayaran</h4><p class="text-sm text-purple-700 dark:text-purple-300">Transfer ke rekening yang kami berikan</p></div></div><div class="flex items-start gap-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg border border-orange-200 dark:border-orange-700"><div class="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div><div><h4 class="font-medium text-orange-800 dark:text-orange-200">Konfirmasi & Proses</h4><p class="text-sm text-orange-700 dark:text-orange-300">Kirim bukti transfer, kami akan memproses segera</p></div></div></div></div>',
  },
  {
    label: "Berapa lama proses Jasa Top Up PayPal?",
    content:
      '<div class="space-y-4"><div class="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-700"><div class="flex items-center gap-3 mb-3"><UIcon name="i-lucide-zap" class="text-green-600 dark:text-green-400 size-6" /><h3 class="text-lg font-semibold text-green-800 dark:text-green-200">Proses Super Cepat</h3></div><p class="text-green-700 dark:text-green-300">Proses <strong>jasa top up PayPal</strong> kami sangat cepat dan efisien:</p></div><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700"><div class="flex items-center gap-2 mb-2"><UIcon name="i-lucide-clock" class="text-blue-600 dark:text-blue-400 size-5" /><h4 class="font-medium text-blue-800 dark:text-blue-200">Jam Kerja</h4></div><p class="text-sm text-blue-700 dark:text-blue-300">5-15 menit setelah konfirmasi pembayaran</p></div><div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700"><div class="flex items-center gap-2 mb-2"><UIcon name="i-lucide-moon" class="text-purple-600 dark:text-purple-400 size-5" /><h4 class="font-medium text-purple-800 dark:text-purple-200">Luar Jam Kerja</h4></div><p class="text-sm text-purple-700 dark:text-purple-300">Maksimal 1-2 jam untuk proses</p></div></div><div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"><p class="text-sm text-gray-600 dark:text-gray-400"><UIcon name="i-lucide-file-text" class="inline size-4 mr-2" />Bukti pembayaran akan dikirimkan segera setelah proses selesai</p></div></div>',
  },
  {
    label: "Metode pembayaran apa saja yang diterima?",
    content:
      '<div class="space-y-4"><p>Kami menerima berbagai metode pembayaran untuk memudahkan transaksi Anda:</p><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"><div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700 text-center"><UIcon name="i-lucide-building-2" class="text-blue-600 dark:text-blue-400 size-8 mx-auto mb-2" /><h4 class="font-medium text-blue-800 dark:text-blue-200">Transfer Bank</h4><p class="text-xs text-blue-700 dark:text-blue-300 mt-1">BCA, Mandiri, BNI, BRI</p></div><div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700 text-center"><UIcon name="i-lucide-smartphone" class="text-green-600 dark:text-green-400 size-8 mx-auto mb-2" /><h4 class="font-medium text-green-800 dark:text-green-200">E-wallet</h4><p class="text-xs text-green-700 dark:text-green-300 mt-1">OVO, GoPay, DANA, LinkAja</p></div><div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700 text-center"><UIcon name="i-lucide-qr-code" class="text-purple-600 dark:text-purple-400 size-8 mx-auto mb-2" /><h4 class="font-medium text-purple-800 dark:text-purple-200">QRIS</h4><p class="text-xs text-purple-700 dark:text-purple-300 mt-1">Pembayaran QR Code</p></div><div class="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700 text-center"><UIcon name="i-lucide-credit-card" class="text-orange-600 dark:text-orange-400 size-8 mx-auto mb-2" /><h4 class="font-medium text-orange-800 dark:text-orange-200">Virtual Account</h4><p class="text-xs text-orange-700 dark:text-orange-300 mt-1">VA Bank</p></div></div><div class="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700"><p class="text-sm text-green-700 dark:text-green-300 text-center"><UIcon name="i-lucide-shield-check" class="inline size-4 mr-2" />Semua pembayaran diproses dengan cepat dan aman</p></div></div>',
  },
  {
    label: "Apakah ada biaya tambahan untuk layanan ini?",
    content:
      "Biaya layanan kami sudah termasuk dalam rate yang kami berikan. Kami menawarkan rate yang kompetitif dan transparan tanpa biaya tersembunyi. Rate dapat berubah sesuai dengan fluktuasi pasar, jadi silakan tanyakan rate terbaru saat akan melakukan transaksi.",
  },
  {
    label: "Apakah jasapembayaran.com melayani CICILAN kartu kredit?",
    content: "Maaf, kami tidak melayani CICILAN kartu kredit untuk pembelian barang seperti HP atau lainnya. Layanan kami fokus pada jasa pembayaran dan transfer dana.",
  },
  {
    label: "Apakah jasapembayaran.com bisa melakukan penarikan uang dari PayPal/Neteller/Skrill/Kartu Kredit?",
    content:
      "Maaf, kami tidak melayani penarikan uang dari PayPal/Neteller/Skrill/Kartu Kredit Anda. Kami hanya menyediakan jasa pembayaran dan transfer dana ke akun-akun tersebut, bukan penarikan dana dari akun-akun tersebut.",
  },
  {
    label: "Apakah jasapembayaran.com bisa melakukan penarikan uang dengan CEK atau BILYET GIRO?",
    content:
      "Maaf, kami tidak melayani penarikan uang tunai menggunakan CEK atau BILYET GIRO. Layanan kami terbatas pada transfer dana elektronik dan pembayaran online.",
  },
  {
    label: "Apakah jasapembayaran.com bisa melakukan penarikan uang dari marketplace?",
    content:
      "Maaf, kami tidak melayani jasa penarikan uang dari akun marketplace seperti Akulaku, Bukalapak, Tokopedia, Shopee dan sejenisnya. Kami hanya menyediakan jasa pembayaran untuk pembelian di platform tersebut.",
  },
  {
    label: "Apakah pembayaran dan pembelian online mendapatkan bukti pembayaran?",
    content:
      'Ya, untuk setiap transaksi pembayaran dan pembelian online, kami akan memberikan bukti pembayaran resmi. Bukti pembayaran akan dikirimkan langsung setelah transaksi selesai dan juga akan diupdate di <a target="_blank" href="https://upload.jasapembayaran.com">sistem kami</a>. Anda juga bisa menghubungi kami melalui email: <a href="mailto:admin@jasapembayaran.com">admin@JasaPembayaran.com</a> untuk mendapatkan bukti pembayaran.',
  },
  {
    label: "Bagaimana jika transaksi saya gagal?",
    content:
      'Jika transaksi Anda gagal dan dana dikembalikan ke kami, silakan hubungi kami melalui <a target="_blank" href="https://jasapembayaran.com/refund">FORM REFUND</a> atau melalui form <a target="_blank" href="/transaksi">CEK TRANSAKSI</a> yang tersedia di website kami. Tim kami akan membantu proses pengembalian dana Anda dengan cepat dan profesional.',
  },
  {
    label: "Apakah bukti pembayaran bisa tidak diupdate di web?",
    content:
      "Ya, kami dapat mengakomodasi permintaan khusus untuk tidak mengupdate bukti pembayaran di website kami. Jika Anda memerlukan privasi untuk transaksi Anda, cukup beritahu kami saat melakukan transaksi, dan kami akan mengirimkan bukti pembayaran langsung kepada Anda tanpa mempublikasikannya di website kami.",
  },
  {
    label: "Apakah bisa dibantu untuk klaim jika barang belum sampai?",
    content:
      "Ya, kami dapat membantu Anda membuat pelaporan klaim jika barang yang Anda beli belum sampai. Bantuan ini diberikan dengan syarat status pengiriman barang tidak valid atau barang tidak dikirim oleh penjual. Anda perlu menyediakan bukti yang kuat bahwa penjual bermasalah atau berniat tidak mengembalikan uang/menipu dalam transaksi Anda. Tim kami akan membantu proses klaim dengan pihak terkait.",
  },
  {
    label: "Bagaimana cara menghubungi customer service?",
    content:
      '<div class="space-y-4"><p>Anda dapat menghubungi customer service kami melalui beberapa cara:</p><div class="grid grid-cols-1 sm:grid-cols-3 gap-4"><div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700 text-center"><UIcon name="i-lucide-message-circle" class="text-green-600 dark:text-green-400 size-8 mx-auto mb-3" /><h4 class="font-medium text-green-800 dark:text-green-200 mb-2">WhatsApp</h4><a target="_blank" href="https://api.whatsapp.com/send/?phone=628988888250" class="text-sm text-green-700 dark:text-green-300 font-medium underline hover:no-underline">+62 898-8888-250</a></div><div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700 text-center"><UIcon name="i-lucide-mail" class="text-blue-600 dark:text-blue-400 size-8 mx-auto mb-3" /><h4 class="font-medium text-blue-800 dark:text-blue-200 mb-2">Email</h4><a href="mailto:admin@jasapembayaran.com" class="text-sm text-blue-700 dark:text-blue-300 font-medium underline hover:no-underline">admin@JasaPembayaran.com</a></div><div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700 text-center"><UIcon name="i-lucide-file-text" class="text-purple-600 dark:text-purple-400 size-8 mx-auto mb-3" /><h4 class="font-medium text-purple-800 dark:text-purple-200 mb-2">Form Kontak</h4><p class="text-sm text-purple-700 dark:text-purple-300">Di website kami</p></div></div><div class="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700"><p class="text-sm text-green-700 dark:text-green-300 text-center"><UIcon name="i-lucide-clock" class="inline size-4 mr-2" />Customer service kami siap melayani Anda 24/7 untuk semua pertanyaan dan bantuan</p></div></div>',
  },
  {
    label: "Apakah layanan ini aman dan terpercaya?",
    content:
      '<div class="space-y-4"><div class="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-700"><div class="flex items-center gap-3 mb-3"><UIcon name="i-lucide-shield-check" class="text-green-600 dark:text-green-400 size-6" /><h3 class="text-lg font-semibold text-green-800 dark:text-green-200">100% Aman & Terpercaya</h3></div><p class="text-green-700 dark:text-green-300">Ya, layanan kami sangat aman dan terpercaya dengan berbagai jaminan keamanan.</p></div><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700"><div class="flex items-center gap-2 mb-2"><UIcon name="i-lucide-lock" class="text-blue-600 dark:text-blue-400 size-5" /><h4 class="font-medium text-blue-800 dark:text-blue-200">Enkripsi SSL</h4></div><p class="text-sm text-blue-700 dark:text-blue-300">Semua transaksi dilindungi enkripsi SSL</p></div><div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700"><div class="flex items-center gap-2 mb-2"><UIcon name="i-lucide-users" class="text-purple-600 dark:text-purple-400 size-5" /><h4 class="font-medium text-purple-800 dark:text-purple-200">Ribuan Pelanggan</h4></div><p class="text-sm text-purple-700 dark:text-purple-300">Melayani ribuan pelanggan sejak 2010</p></div></div></div>',
  },
  {
    label: "Berapa minimum dan maksimum transaksi?",
    content:
      '<div class="space-y-4"><p>Kami melayani transaksi dengan range yang fleksibel:</p><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700 text-center"><UIcon name="i-lucide-arrow-down" class="text-green-600 dark:text-green-400 size-8 mx-auto mb-2" /><h4 class="font-medium text-green-800 dark:text-green-200 mb-1">Minimum</h4><p class="text-2xl font-bold text-green-700 dark:text-green-300">Rp 10.000</p><p class="text-xs text-green-600 dark:text-green-400">Untuk semua layanan</p></div><div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700 text-center"><UIcon name="i-lucide-arrow-up" class="text-blue-600 dark:text-blue-400 size-8 mx-auto mb-2" /><h4 class="font-medium text-blue-800 dark:text-blue-200 mb-1">Maksimum</h4><p class="text-2xl font-bold text-blue-700 dark:text-blue-300">Rp 50.000.000</p><p class="text-xs text-blue-600 dark:text-blue-400">Per transaksi</p></div></div><div class="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700"><p class="text-sm text-yellow-700 dark:text-yellow-300 text-center"><UIcon name="i-lucide-info" class="inline size-4 mr-2" />Untuk transaksi di atas limit, silakan hubungi customer service</p></div></div>',
  },
]);

// State untuk mengelola FAQ yang terbuka
const openItems = ref<boolean[]>(new Array(faqItems.value.length).fill(false));

// Function untuk toggle FAQ item
const toggleItem = (index: number) => {
  openItems.value[index] = !openItems.value[index];
};
</script>

<template>
  <div
    id="faq-section"
    class="@container faq-override scroll-mt-24 py-6 px-4 sm:px-6 lg:px-8 bg-gray-50/60 dark:bg-[#111827] border border-gray-200/60 dark:border-gray-800/70 overflow-hidden rounded-2xl shadow-xl flex flex-col relative"
  >
    <div class="absolute inset-0 bg-gradient-to-br from-indigo-50/40 to-transparent dark:from-indigo-900/20 dark:to-transparent opacity-60 pointer-events-none"></div>

    <div class="text-center mb-5 relative z-10">
      <!-- Clean Title -->
      <div class="flex items-center gap-3 justify-center mb-3">
        <div class="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg">
          <UIcon name="i-lucide-help-circle" class="text-white size-6" />
        </div>
        <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
          FAQ
        </h2>
        <div class="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg">
          <UIcon name="i-lucide-file-question" class="text-white size-6" />
        </div>
      </div>
      
      <p class="text-gray-700 dark:text-gray-200 text-sm sm:text-base max-w-4xl mx-auto leading-relaxed">
        Pertanyaan yang sering muncul seputar <span class="font-semibold text-indigo-600 dark:text-indigo-400">jasa pembayaran PayPal</span> dan layanan JasaPembayaran. 
        Temukan jawaban praktis sebelum Anda mulai transaksi.
      </p>
    </div>

    <!-- FAQ Container Box - Compact & Clean -->
    <div class="relative z-10 bg-gradient-to-br from-gray-50/90 to-gray-100/80 dark:from-gray-800/95 dark:to-gray-850/90 rounded-xl shadow-lg border border-gray-200/60 dark:border-gray-700/60 p-3 sm:p-4">
      <div class="space-y-1">
        <div
          v-for="(item, index) in faqItems"
          :key="index"
          class="w-full"
        >
          <!-- FAQ Question Box - Compact -->
          <div 
            :class="[
              'faq-question group w-full px-3 sm:px-4 py-3 bg-gray-50/80 dark:bg-gray-700/80 border border-gray-200/60 dark:border-gray-600/60 cursor-pointer transition-all duration-300 flex items-center justify-between',
              index === 0 ? 'rounded-t-lg' : '',
              index === faqItems.length - 1 && !openItems[index] ? 'rounded-b-lg' : '',
              openItems[index] ? 'border-indigo-400/60 dark:border-indigo-500/60 bg-gradient-to-r from-indigo-50/90 to-blue-50/80 dark:from-indigo-900/30 dark:to-blue-900/20 shadow-sm' : 'hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-gray-100/50 dark:hover:bg-gray-600/50'
            ]"
            @click="toggleItem(index)"
          >
            <h3 class="text-xs sm:text-sm font-bold text-gray-800 dark:text-white text-left break-words leading-tight flex-1 pr-2 sm:pr-3">
              {{ item.label }}
            </h3>
            <button :class="[
              'flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none',
              openItems[index] ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40'
            ]">
              <UIcon
                :name="openItems[index] ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                class="size-3 transition-transform duration-300"
                :class="openItems[index] ? 'rotate-0' : 'group-hover:translate-y-0.5'"
              />
            </button>
          </div>

          <!-- FAQ Answer Box - Only show when open -->
          <div 
            v-if="openItems[index]"
            class="px-3 sm:px-4 py-3 sm:py-4 bg-gradient-to-br from-gray-50/90 to-gray-100/80 dark:from-gray-800/90 dark:to-gray-850/80 border border-gray-200/60 dark:border-gray-600/60 border-t-0"
            :class="index === faqItems.length - 1 ? 'rounded-b-lg' : ''"
          >
            <div
              class="faq-content text-gray-700 dark:text-gray-200
              [&>a]:font-semibold [&>a]:text-blue-600 dark:[&>a]:text-blue-400
              [&>a]:underline [&>a]:underline-offset-2 [&>a]:hover:no-underline
              [&>strong]:text-blue-600 dark:[&>strong]:text-blue-400 [&>strong]:font-semibold
              [&>h3]:text-sm [&>h3]:sm:text-base [&>h3]:font-bold [&>h3]:mb-2 [&>h3]:text-gray-800 [&>h3]:dark:text-gray-100
              [&>h4]:text-xs [&>h4]:sm:text-sm [&>h4]:font-semibold [&>h4]:mb-1 [&>h4]:text-gray-700 [&>h4]:dark:text-gray-200
              [&>p]:mb-2 [&>p]:leading-relaxed [&>p]:text-xs [&>p]:sm:text-sm
              [&>ul]:space-y-1 [&>ul]:mb-2
              [&>li]:flex [&>li]:items-center [&>li]:gap-2 [&>li]:text-xs [&>li]:sm:text-sm
              [&>div]:mb-2 [&>div:last-child]:mb-0
              [&_.grid]:grid-cols-1 [&_.grid]:sm:grid-cols-2 [&_.grid]:lg:grid-cols-3 [&_.grid]:xl:grid-cols-4
              [&_.grid]:gap-2 [&_.grid]:sm:gap-3
              text-xs sm:text-sm leading-snug"
              v-html="item.content"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Premium FAQ Styles */
.faq-question {
  will-change: transform, background-color;
}

.faq-question:hover {
  transform: translateX(2px);
}

/* FAQ Content Styling */
.faq-content {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile Optimization */
@media (max-width: 768px) {
  #faq-section {
    padding: 1.5rem 1rem !important;
  }
  
  .faq-question {
    padding: 0.75rem !important;
  }
}

/* Smooth Animations */
@media (prefers-reduced-motion: no-preference) {
  .faq-question {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

/* Accessibility - Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .faq-question,
  .faq-content {
    animation: none !important;
    transition: none !important;
  }
}
</style>

