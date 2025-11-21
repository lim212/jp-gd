<template>
  <div
    class="relative isolate rounded-xl overflow-hidden bg-elevated/50 ring ring-default"
  >
    <UCard
      variant="subtle"
      class="w-full flex bg-white dark:bg-gray-800/5 rounded-lg py-6 sm:py-8 md:py-9 lg:py-10 shadow-md dark:shadow-gray-500"
      :ui="{
        container: 'w-full',
        body: 'w-full px-4 sm:px-6 md:px-8',
      }"
    >
      <div class="text-lg sm:text-xl md:text-xl lg:text-2xl font-bold text-center">
        <h2 class="text-(--ui-primary) uppercase text-shadow-lg/10">
          â– ATURAN TRANSAKSI â–
        </h2>
      </div>

      <ul class="mt-4 space-y-2 sm:space-y-3 font-semibold list-disc px-4 sm:px-6">
        <li>
          Pembeli menyetujui bahwa kami TIDAK bertanggung jawab apapun atas
          seller / toko yang Bpk/Ibu PILIH, kesalahan order, kesalahan item,
          cacat produksi, kerusakan sebelum &amp; ketika pengiriman, di sita
          oleh bea cukai, hilang dalam pengiriman, serta penipuan yang mungkin
          dilakukan oleh seller / toko pilihan Bpk/Ibu
        </li>
        <li>
          TIDAK menerima order berupa : narkotika &amp; obat-obatan terlarang,
          senjata api &amp; barang2 lain yang tercantum pada larangan masuk oleh
          Bea &amp; Cukai
        </li>
        <li>
          Barang yang sudah di pesan tidak dapat dibatalkan
          <span class="text-red-500">(jika barang sudah di bayarkan)</span>
        </li>
        <li>
          Apabila terjadi refund (uang di kembalikan) dari pihak seller /
          penjual, maka uang Bpk/Ibu akan kami kembalikan setelah di kurangi
          biaya adm 10% dan fee transaksi dan selisih kurs beli pada mata uang
          asing yang telah dikembalikan pihak VISA / MASTER CARD ke rekening
          bank Credit Card Kami
        </li>
        <li>
          Apabila terjadi tindakan penipuan / kecurangan atas transaksi yang
          telah dilakukan pihak pembeli dengan secara sengaja memproses
          transaksi tanpa sepengetahuan kami dan transaksi tersebut berhasil
          ditagihkan dan jika kami menemukan kecurangan tersebut dan dilakukan
          secara sengaja, maka kami akan claim transaksi tersebut dan jika
          terjadi refund pada transaksi tersebut maka dana pada transaksi
          tersebut tidak kami kembalikan / refund.
        </li>
        <li>
          Apabila kedapatkan pembeli / pemakai jasa kami berbohong dengan cara
          memanipulasi transaksi yang di bayarkan dengan tujuan mendapatkan
          saldo PayPal dan jika kami menemukan ternyata dana tersebut untuk di
          transfer ke PayPal/Skrill/Neteller account milik pembeli sendiri, Maka
          dana tersebut akan kami dispute/claim dan jika terjadi refund pada
          dana tersebut, maka akan kami sumbangkan kepada pihak UNICEF.
          <span class="text-red-500"
            >(Peraturan ini dibuat untuk menghindari banyaknya penipuan dengan
            cara membeli saldo paypal dan digunakan untuk transaksi penipuan
            Jual-Beli saldo paypal)</span
          >
        </li>
        <li>
          Kurs mata uang yang di gunakan otomatis mengikuti perhitungan yang di
          tagihkan pada VISA / MASTERCARD
        </li>
        <li>
          Barang akan di kirimkan langsung ke alamat Bpk/Ibu sebagai pembeli,
          Jadi mohon kerja samanya memberikan informasi alamat dengan jelas
          (lengkap dengan kodepos) supaya tidak ada kesalahan pengiriman
        </li>
        <li>
          Untuk transaksi melebihi USD 75 (atau sejumlah mata uang lain yang
          setara) ada kemungkinan kena pajak yang nilainya sekitar 10 ©“ 30% dari
          harga barang.
        </li>
        <li>
          Jika terkena pajak tidak perlu khawatir Bpk/Ibu tinggal datang ke
          kantor pos / pihak pengiriman terdekat untuk langsung mengambil+bayar
          pajak barang tersebut
        </li>
        <li>
          Estimasi pengiriman 2 ©“ 8 minggu (tergantung dari seller seberapa
          cepat mengirim barang tersebut)
        </li>
        <li>
          Untuk pembelian barang pengiriman biasa di lakukan via jasa udara atau
          darat, tarifnya bervariasi sesuai total yang di berikan pihak penjual
        </li>
      </ul>
    </UCard>
  </div>
</template>

