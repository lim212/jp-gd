export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<{
      event?: string
      data?: any
      timestamp?: string
      userAgent?: string
      referrer?: string
    }>(event)

    // For now, just log to server console in dev to confirm receipt
    if (process.dev) {
      console.info('[analytics] event received', {
        event: body?.event || 'unknown',
        timestamp: body?.timestamp,
      })
    }

    return {
      success: true,
      receivedAt: new Date().toISOString(),
    }
  } catch (error) {
    console.warn('[analytics] failed to store analytics event', error)
    return {
      success: false,
    }
  }
})





