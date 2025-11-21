import { ref, onMounted, onUnmounted } from 'vue'

export function useVisitors() {
  // Backward-compatible fields (hits by period + all-time total)
  const today = ref<number>(0)
  const month = ref<number>(0)
  const year = ref<number>(0)
  const total = ref<number>(0)
  const online = ref<number>(0)
  const robots = ref<number>(0) // now represents online robots

  // Extended precise fields
  const hitsToday = ref<number>(0)
  const hitsMonth = ref<number>(0)
  const hitsYear = ref<number>(0)
  const totalYearHits = ref<number>(0)
  // Per-IP (current requester) metrics
  const ipHitsToday = ref<number>(0)
  const ipHitsMonth = ref<number>(0)
  const ipHitsYear = ref<number>(0)
  const uniqueToday = ref<number>(0)
  const uniqueMonth = ref<number>(0)
  const uniqueYear = ref<number>(0)
  const onlineVisitors = ref<number>(0)
  const onlineRobots = ref<number>(0)

  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const isLowEnd = ref<boolean>(false)

  let refreshTimer: any = null
  let heartbeatTimer: any = null
  let pageVisible = true

  function detectLowEndClient(): boolean {
    try {
      if (typeof navigator === 'undefined') return false
      // Save-Data preference
      const anyNav = navigator as any
      const saveData = !!(anyNav.connection && anyNav.connection.saveData)
      const effectiveType = (anyNav.connection && anyNav.connection.effectiveType) || ''
      const slowNet = /(^|\b)(2g|slow-2g)($|\b)/i.test(String(effectiveType))
      // CPU cores
      const cores = (navigator as any).hardwareConcurrency || 4
      // Approx device memory (Chrome only)
      const mem = (navigator as any).deviceMemory || 4
      return saveData || slowNet || cores <= 2 || mem <= 2
    } catch {
      return false
    }
  }

  async function postAction(action: 'hit' | 'heartbeat') {
    try {
      if (typeof window === 'undefined') return
      await $fetch('/api/visitors', { method: 'POST', body: { action } })
    } catch {
      // ignore network error
    }
  }

  async function refresh() {
    if (typeof window === 'undefined') return
    try {
      loading.value = true
      const data = await $fetch<{
        ok: boolean
        timezone?: string
        today: number
        month: number
        year: number
        total: number
        online: number
        robots: number
        // Global hit aggregates
        hitsToday?: number
        hitsMonth?: number
        hitsYear?: number
        totalYearHits?: number
        // Per-IP hit aggregates (current requester)
        ipHitsToday?: number
        ipHitsMonth?: number
        ipHitsYear?: number
        // Unique counts
        uniqueToday?: number
        uniqueMonth?: number
        uniqueYear?: number
        // Online counts
        onlineVisitors?: number
        onlineRobots?: number
      }>(
        '/api/visitors',
        { method: 'GET' }
      )
      if (data && data.ok) {
        // legacy
        today.value = data.today ?? 0
        month.value = data.month ?? 0
        year.value = data.year ?? 0
        total.value = data.total ?? 0
        online.value = data.online ?? 0
        robots.value = data.robots ?? 0
        // extended
        hitsToday.value = data.hitsToday ?? today.value
        hitsMonth.value = data.hitsMonth ?? month.value
        hitsYear.value = data.hitsYear ?? year.value
        totalYearHits.value = data.totalYearHits ?? hitsYear.value
        // per-IP
        ipHitsToday.value = data.ipHitsToday ?? 0
        ipHitsMonth.value = data.ipHitsMonth ?? 0
        ipHitsYear.value = data.ipHitsYear ?? 0
        // uniques and online
        uniqueToday.value = data.uniqueToday ?? 0
        uniqueMonth.value = data.uniqueMonth ?? 0
        uniqueYear.value = data.uniqueYear ?? 0
        onlineVisitors.value = data.onlineVisitors ?? online.value
        onlineRobots.value = data.onlineRobots ?? robots.value
        error.value = null
      }
    } catch (e: any) {
      error.value = e?.message || 'Failed to load visitor stats'
    } finally {
      loading.value = false
    }
  }

  function startHeartbeat() {
    if (heartbeatTimer) return
    // Align with server ONLINE_TTL_MS (60s); send heartbeat every 20s when visible
    heartbeatTimer = setInterval(() => {
      if (pageVisible && !isLowEnd.value) postAction('heartbeat')
    }, 20000)
  }

  function stopHeartbeat() {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer)
      heartbeatTimer = null
    }
  }

  function startRefreshTimer() {
    if (refreshTimer || isLowEnd.value) return
    refreshTimer = setInterval(refresh, 25000)
  }

  function stopRefreshTimer() {
    if (refreshTimer) {
      clearInterval(refreshTimer)
      refreshTimer = null
    }
  }

  function handleVisibility() {
    try {
      if (typeof document === 'undefined') return;
      pageVisible = document.visibilityState === 'visible'
      if (pageVisible) {
        // Update immediately when returning to the page
        refresh()
        if (!isLowEnd.value) postAction('heartbeat')
      }
    } catch {}
  }

  onMounted(() => {
    // Detect device capability
    isLowEnd.value = detectLowEndClient()
    // Initial fetch and mark presence
    refresh()
    try { setTimeout(refresh, 2000) } catch {}

    // Use window-scoped flags to avoid duplicate hits/heartbeats across multiple consumers
    try {
      if (typeof window !== 'undefined') {
        const w: any = window as any
        w.__visitorsConsumers = (w.__visitorsConsumers || 0) + 1
        if (!w.__visitorsInitDone) {
          w.__visitorsInitDone = true
          postAction('hit')
        }
        if (!isLowEnd.value) {
          if (!w.__visitorsTimersStarted) {
            startRefreshTimer()
            startHeartbeat()
            w.__visitorsTimersStarted = true
          }
          if (!w.__vis_visibilityListenerAdded && typeof document !== 'undefined') {
            document.addEventListener('visibilitychange', handleVisibility)
            w.__vis_visibilityListenerAdded = true
          }
        }
      }
    } catch {}
  })

  onUnmounted(() => {
    try {
      if (typeof window !== 'undefined') {
        const w: any = window as any
        w.__visitorsConsumers = Math.max(0, (w.__visitorsConsumers || 1) - 1)
        if (w.__visitorsConsumers === 0) {
          stopRefreshTimer()
          stopHeartbeat()
          try {
            if (w.__vis_visibilityListenerAdded && typeof document !== 'undefined') {
              document.removeEventListener('visibilitychange', handleVisibility)
            }
          } catch {}
          w.__visitorsTimersStarted = false
          w.__vis_visibilityListenerAdded = false
          w.__visitorsInitDone = false
        }
      }
    } catch {}
  })

  return {
    // legacy
    today, month, year, total, online, robots,
    // extended
    hitsToday, hitsMonth, hitsYear, totalYearHits,
    uniqueToday, uniqueMonth, uniqueYear,
    onlineVisitors, onlineRobots,
    // per-IP
    ipHitsToday, ipHitsMonth, ipHitsYear,
    loading, error, refresh,
  }
}
