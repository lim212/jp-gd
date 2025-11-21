<script setup lang="ts">
useSeoMeta({ title: 'Demo Loaders', description: 'Contoh ikon loading dan progress hitung mundur 30 detik' })
</script>

<template>
  <div class="px-4 py-8 space-y-10">
    <section class="post-content">
      <h2>Icon Loading Buku</h2>
      <p>[jp-book size=72 label="Icon Loading Buku"]</p>
    </section>

    <section class="post-content">
      <h2>Icon Loading yang keren</h2>
      <p>[jp-cool size=72 label="Icon Loading yang keren"]</p>
    </section>

    <section class="post-content">
      <h2>Persen dengan Hitung Mundur 30 Detik</h2>
      <p>[jp-progress duration=30 start=50 target=100 size=96 label="Proses"]</p>
    </section>
  </div>
</template>

