<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-8">🔍 TEST SPACING PAGE</h1>
    
    <p class="mb-4 text-lg font-semibold">Halaman ini untuk test apakah inline styles berfungsi:</p>
    
    <!-- Kotak 1 dengan inline style -->
    <div style="margin: 60px 0 !important; padding: 40px !important; border: 5px solid red !important; background-color: lightyellow !important;">
      <h2 class="text-xl font-bold text-red-600">🔴 KOTAK 1: Butuh Bantuan</h2>
      <p>Kalau Anda lihat kotak ini dengan:</p>
      <ul class="list-disc ml-6">
        <li>Background = KUNING MUDA</li>
        <li>Border = MERAH 5px</li>
        <li>Jarak 60px ke atas dan bawah</li>
      </ul>
      <p class="font-bold mt-2">Maka inline styles BERFUNGSI! ✅</p>
    </div>
    
    <!-- Kotak 2 dengan inline style -->
    <div style="margin: 60px 0 !important; padding: 40px !important; border: 5px solid blue !important; background-color: lightblue !important;">
      <h2 class="text-xl font-bold text-blue-600">🔵 KOTAK 2: Trusted Partners</h2>
      <p>Kalau Anda lihat kotak ini dengan:</p>
      <ul class="list-disc ml-6">
        <li>Background = BIRU MUDA</li>
        <li>Border = BIRU 5px</li>
        <li>Jarak 60px ke atas dan bawah</li>
      </ul>
      <p class="font-bold mt-2">Maka inline styles BERFUNGSI! ✅</p>
    </div>
    
    <!-- Kotak 3 dengan inline style -->
    <div style="margin: 60px 0 !important; padding: 40px !important; border: 5px solid green !important; background-color: lightgreen !important;">
      <h2 class="text-xl font-bold text-green-600">🟢 KOTAK 3: Jasa PayPal</h2>
      <p>Kalau Anda lihat kotak ini dengan:</p>
      <ul class="list-disc ml-6">
        <li>Background = HIJAU MUDA</li>
        <li>Border = HIJAU 5px</li>
        <li>Jarak 60px ke atas dan bawah</li>
      </ul>
      <p class="font-bold mt-2">Maka inline styles BERFUNGSI! ✅</p>
    </div>
    
    <div class="mt-12 p-6 bg-gray-100 rounded-lg">
      <h3 class="text-xl font-bold mb-4">📊 HASIL TEST:</h3>
      <div class="space-y-2">
        <p><strong>✅ Kalau ketiga kotak terlihat dengan warna berbeda dan jarak jelas:</strong></p>
        <p class="ml-4">→ Inline styles WORK!</p>
        <p class="ml-4">→ Masalahnya di homepage adalah cache browser</p>
        <p class="ml-4">→ Solusi: Clear cache lebih aggressive</p>
        
        <p class="mt-4"><strong>❌ Kalau ketiga kotak tidak berwarna atau tidak ada jarak:</strong></p>
        <p class="ml-4">→ Ada masalah dengan rendering</p>
        <p class="ml-4">→ Atau browser tidak support inline styles (sangat jarang)</p>
      </div>
      
      <div class="mt-6 p-4 bg-blue-100 rounded">
        <p class="font-bold">📌 Kembali ke homepage:</p>
        <NuxtLink to="/" class="text-blue-600 underline font-semibold">Klik di sini untuk kembali ke homepage</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false // No layout untuk test murni
})
</script>

