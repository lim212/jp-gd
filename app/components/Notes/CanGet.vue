<template>
  <div
    class="relative isolate rounded-xl overflow-hidden bg-elevated/50 ring ring-default w-full"
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
          â– TRANSAKSI YANG BISA DILAKUKAN â–
        </h2>
      </div>

      <ul class="mt-4 space-y-2 sm:space-y-3 font-semibold list-disc px-4 sm:px-6">
        <li>BUY IT NOW</li>
        <li>
          BID (LELANG)
          <span class="text-red-500"
            >(Jika Bpk/Ibu sudah menang lelang dan ingin di bayarkan silahkan
            hub kami)</span
          >
        </li>
        <li>
          PEMBAYARAN DAN PEMBELIAN ONLINE MENGUNAKAN PAYPAL, KARTU KREDIT dan
          Lainnya
        </li>
      </ul>

      <div class="mt-5 leading-tight text-center text-red-500">
        (jika Bpk/Ibu tidak mengerti silahkan contact
        <NuxtLink to="https://tiket.jasapembayaran.com/order">Kami</NuxtLink>)
      </div>
    </UCard>
  </div>
</template>

