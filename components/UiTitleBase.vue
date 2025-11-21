<template>
  <div class="section-header-frame relative w-fit mx-auto">
    <h2 class="font-montserrat uppercase text-2xl md:text-3xl lg:text-4xl font-bold relative pb-2 px-5 py-2 rounded-2xl backdrop-blur-[2px] shadow-sm">
      <span class="[&_.text-ui-primary]:text-ui-primary dark:[&_.text-ui-primary]:text-yellow-400 [&:not(*)]:bg-gradient-to-r [&:not(*)]:from-yellow-500 [&:not(*)]:to-yellow-600 dark:[&:not(*)]:from-yellow-400 dark:[&:not(*)]:to-yellow-500 [&:not(*)]:bg-clip-text [&:not(*)]:text-transparent">
        <slot />
      </span>
    </h2>
  </div>
</template>

<style scoped>
.section-header-frame {
  position: relative;
  border-radius: 1rem;
  padding: 3px; /* Frame thickness */
  background: linear-gradient(90deg, rgba(234,179,8,0.95), rgba(234,88,12,0.95));
  box-shadow: 0 4px 18px rgba(245, 158, 11, 0.25);
}
.section-header-frame h2 {
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 0.875rem; /* slightly smaller to fit inside frame */
}
:global(.dark) .section-header-frame {
  background: linear-gradient(90deg, rgba(250,204,21,0.9), rgba(245,158,11,0.9));
  box-shadow: 0 6px 20px rgba(250, 204, 21, 0.18);
}
:global(.dark) .section-header-frame h2 {
  background-color: rgba(17, 24, 39, 0.6); /* gray-900 with transparency */
}
</style>

