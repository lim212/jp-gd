// server/tasks/regenerateBlog.ts
export default defineNitroPlugin(() => {
  // Berjalan otomatis setiap hari jam 1 pagi
  const schedule = process.env.REGENERATION_CRON || '0 1 * * *'

  cron.schedule(schedule, async () => {
    try {
      // 1. Generate posts using ChatGPT (WordPress removed)
      const { posts } = await fetchPosts(1, 5) // 5 post terbaru

      for (const post of posts) {
        // 2. Backup konten lama
        await backupPost(post)

        // 3. Generate konten baru dengan AI
        const { content, excerpt } = await generateBlogContent(
          post.title,
          post.tags
        )

        // 4. Generate gambar baru (optional)
        const imageUrl = await generateImage(post.title)

        // 5. Moderasi konten
        const moderation = await moderateContent(content, post.title)

        if (moderation.approved) {
          // 6a. Update post jika lolos moderasi
          await updatePost(post.id, {
            content,
            excerpt,
            featuredImage: imageUrl
          })

          // 7a. Invalidate cache
          await invalidateCache(`blog:post:${post.id}*`)
          await invalidateCache('blog:list:*')

          // 8a. Kirim notifikasi sukses
          await sendEmail(
            process.env.ADMIN_EMAIL!,
            'contentApproved',
            { title: post.title }
          )
        } else {
          // 6b. Masuk antrian moderasi jika perlu review
          await addToModerationQueue(
            { id: post.id, title: post.title, content },
            'regeneration'
          )
        }

        // Rate limiting untuk API calls
        await new Promise(resolve => setTimeout(resolve,
          60000 / Number(process.env.RATE_LIMIT_PER_MINUTE || 50)
        ))
      }

    } catch (error) {
      await logError(error, { phase: 'regeneration' })

      // Kirim notifikasi error
      await sendEmail(
        process.env.ADMIN_EMAIL!,
        'regenerationError',
        { error: error.message }
      )
    }
  })
})
