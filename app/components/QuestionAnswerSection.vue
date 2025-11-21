<script setup lang="ts">
const links = ref([
  {
    label: "Klik Disini untuk Pertanyaan",
    color: "success",
    variant: "solid",
    trailingIcon: "simple-icons:whatsapp",
    to: "https://api.whatsapp.com/send/?phone=628988888250&text=Halo%20JasaPembayaran.com,%20saya%20ingin%20konsultasi%20tentang%20jasa%20PayPal&type=phone_number&app_absent=0",
    target: "_blank",
  },
]);
</script>

<template>
  <UPageCTA
    class="text-center"
    variant="subtle"
    title="Ada pertanyaan lain? Hubungi kami kapan saja."
    description="Untuk Bertanya tentang Pembelian, Pembayaran dan Perantara Jasa Bayar Online serahkan pada kami Jasa Bayar dan Titip Online PayPal, Kartu Kredit, Skrill, Neteller, BTC, Bitcoin dan mata uang kripto / crypto JasaPembayaran.com, Kami akan senantiasa melayani dan membantu Perantara dan Pembayaran transaksi luar negeri Bpk/Ibu dengan aman."
    :links="links"
    :ui="{
      container:
        'lg:py-10 w-full flex justify-center bg-white dark:bg-gray-800/5 rounded-lg py-5 shadow-md dark:shadow-gray-500',
      links: '[&>a]:flex [&>a]:gap-2 [&>a]:p-5 [&>a]:rounded-full',
    }"
  >
    <template #title>
      <MDC
        value="Ada [pertanyaan]{.text-(--ui-primary)} lain? [Hubungi]{.text-(--ui-primary)} kami kapan saja"
      />
    </template>
  </UPageCTA>
</template>

