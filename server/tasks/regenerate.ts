// server/tasks/regenerate.ts
export default defineNitroPlugin(() => {
  const schedule = process.env.REGENERATION_CRON

  cron.schedule(schedule, async () => {
    // 1. Generate posts using ChatGPT (WordPress removed)
    // 2. Regenerate content dengan ChatGPT
    // 3. Generate gambar baru
    // 4. Update posts
  })
})
