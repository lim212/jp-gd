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
          â– CARA PEMBELIAN / PEMBAYARAN ONLINE â–
        </h2>
      </div>

      <ul class="mt-4 space-y-2 sm:space-y-3 font-semibold list-disc px-4 sm:px-6">
        <li>
          Pilih barang / situs web yang Bpk/Ibu ingin bayarkan dari web
          tersebut, kemudian kirimkan link web yang Bpk/Ibu ingin bayarkan
          kepada kami, bisa melalui LIVE CHAT,ORDER FORM,WHATSAPP atau EMAIL
        </li>
        <li>
          Untuk barang / web yang ingin Bpk/Ibu bayarkan dan sudah kami
          totalkan, maka Bpk/Ibu wajib untuk membayar 100% dari total yang sudah
          kami totalkan jika Bpk/Ibu telah setuju
        </li>
        <li>
          Untuk pembelian barang akan di kirimkan langsung ke alamat Bpk/Ibu
          sebagai pembeli sesuai data alamat yang sudah Bpk/Ibu konfirmasikan ke
          kami
        </li>
        <li>
          Untuk pembelian online tidak berbentuk seperti software atau lainya
          bisa menggunakan account Bpk/Ibu sendiri atau kami
          <span class="text-red-500"
            >(semua keputusan ada di tangan Bpk/Ibu)</span
          >
        </li>
      </ul>
    </UCard>
  </div>
</template>

