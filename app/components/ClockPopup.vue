<template>
  <div v-if="isOpen" class="clock-popup-overlay" @click="closePopup">
    <div
      class="clock-popup"
      role="dialog"
      aria-modal="true"
      aria-label="Informasi waktu dan statistik pengunjung"
      @click.stop
    >
      <!-- Header dengan tombol close -->
      <div class="popup-header">
        <div class="header-info">
          <div class="date-info">
            <i class="fas fa-calendar-alt"></i>
            <div class="info-text">
              <span class="info-label">Tanggal</span>
              <span class="info-value">{{ currentDate }}</span>
            </div>
          </div>
          <div class="ip-info">
            <i class="fas fa-globe"></i>
            <div class="info-text">
              <span class="info-label">IP Visitor</span>
              <span class="info-value">{{ visitorIP }}</span>
              <span v-if="locationDisplay" class="info-subtle">{{ locationDisplay }}</span>
            </div>
          </div>
        </div>
        <button class="close-btn" @click="closePopup">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Clock Display -->
      <div class="clock-section">
        <div class="clock-display">
          <i class="fas fa-clock"></i>
          <span class="time">{{ currentTime }}</span>
          <span class="timezone">{{ timezoneLabel }}</span>
        </div>
      </div>

      <!-- System Info -->
      <div class="system-info">
        <div class="info-grid">
          <div class="info-item">
            <div class="info-icon flag-icon">
              <i class="fas fa-flag"></i>
            </div>
            <div class="info-detail">
              <span class="info-label">Negara</span>
              <span class="info-value">{{ countryName }}</span>
              <span v-if="locationDisplay" class="info-subtle">{{ locationDisplay }}</span>
            </div>
          </div>
          <div class="info-item">
            <div class="info-icon os-icon">
              <i class="fab fa-windows"></i>
            </div>
            <div class="info-detail">
              <span class="info-label">Sistem Operasi</span>
              <span class="info-value">{{ deviceOS }}</span>
            </div>
          </div>
          <div class="info-item">
            <div class="info-icon browser-icon">
              <i class="fab fa-edge"></i>
            </div>
            <div class="info-detail">
              <span class="info-label">Browser</span>
              <span class="info-value">{{ browserName }}</span>
            </div>
          </div>
          <div class="info-item">
            <div class="info-icon device-icon">
              <i class="fas fa-desktop"></i>
            </div>
            <div class="info-detail">
              <span class="info-label">Perangkat</span>
              <span class="info-value">{{ deviceType }}</span>
              <span class="info-subtle">{{ deviceLabel }}</span>
            </div>
          </div>
        </div>

        <p class="privacy-note">
          Informasi IP, negara, dan perangkat hanya digunakan untuk statistik internal dan peningkatan kualitas layanan,
          tidak dibagikan ke pihak lain.
        </p>

        <div class="network-info">
          <div class="network-item">
            <i class="fas fa-wifi"></i>
            <span>Kualitas Jaringan: <span class="status-chip" :class="networkQualityClass">{{ networkQuality }}</span></span>
          </div>
          <div class="network-item">
            <i class="fas fa-broadcast-tower"></i>
            <span>Jenis Koneksi: <span class="status-chip status-neutral">{{ connectionLabel }}</span></span>
          </div>
          <div class="network-item">
            <i class="fas fa-building"></i>
            <span>ISP: {{ isp }}</span>
          </div>
          <div class="network-item">
            <i class="fas fa-tv"></i>
            <span>Screen Size: {{ screenSize }}</span>
          </div>
          <div class="network-item">
            <i class="fas fa-shield-alt"></i>
            <span>Proxy: <span class="status-chip" :class="proxyStatus === 'Aktif' ? 'status-warning' : 'status-neutral'">{{ proxyStatus }}</span></span>
          </div>
          <div class="network-item">
            <i class="fas fa-key"></i>
            <span>VPN: <span class="status-chip" :class="vpnStatus === 'Aktif' ? 'status-warning' : 'status-neutral'">{{ vpnStatus }}</span></span>
          </div>
          <div class="network-item">
            <i class="fas fa-cookie-bite"></i>
            <span>Cookie: <span class="status-chip" :class="cookiesEnabled ? 'status-success' : 'status-warning'">{{ cookiesEnabled ? 'Enable' : 'Disable' }}</span></span>
          </div>
          <div class="network-item">
            <i class="fab fa-js-square"></i>
            <span>Javascript: <span class="status-chip status-success">{{ jsEnabled ? 'Enable' : 'Disable' }}</span></span>
          </div>
        </div>
      </div>

      <!-- Visitor Statistics -->
      <div class="visitor-stats">
        <h3 class="stats-title">
          <i class="fas fa-chart-line"></i>
          Statistik Pengunjung
        </h3>
        <p class="stats-subtitle">
          Data ini diambil langsung dari server dan menggambarkan aktivitas pengunjung yang sedang berlangsung
          (otomatis diperbarui berkala tanpa perlu reload halaman).
        </p>
        <div v-if="!visitorsLoading" class="stats-grid">
          <div class="stat-card today-visits">
            <div class="stat-icon">
              <i class="fas fa-calendar-day"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.todayVisits }}</div>
              <div class="stat-label">Kunjungan Hari Ini</div>
            </div>
          </div>
          <div class="stat-card today-visitors">
            <div class="stat-icon">
              <i class="fas fa-users"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.todayVisitors }}</div>
              <div class="stat-label">Visitor Hari Ini</div>
            </div>
          </div>
          <div class="stat-card month-visits">
            <div class="stat-icon">
              <i class="fas fa-calendar-week"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.monthVisits }}</div>
              <div class="stat-label">
                Kunjungan Bulan Ini
                <span class="stat-extra">
                  Total hit / kunjungan (semua pengunjung)
                </span>
              </div>
            </div>
          </div>
          <div class="stat-card month-visitors">
            <div class="stat-icon">
              <i class="fas fa-user-friends"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.monthUniqueVisitors }}</div>
              <div class="stat-label">
                Visitor Bulan Ini
                <span class="stat-extra">
                  Jumlah pengunjung unik selama bulan berjalan
                </span>
              </div>
            </div>
          </div>
          <div class="stat-card year-visitors">
            <div class="stat-icon">
              <i class="fas fa-calendar-alt"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.yearVisits }}</div>
              <div class="stat-label">
                Kunjungan Tahun Ini
                <span class="stat-extra">
                  Termasuk semua hit selama tahun berjalan ({{ stats.yearUniqueVisitors }} visitor unik)
                </span>
              </div>
            </div>
          </div>
          <div class="stat-card total-visits">
            <div class="stat-icon">
              <i class="fas fa-chart-bar"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.totalVisits }}</div>
              <div class="stat-label">Kunjungan Keseluruhan</div>
            </div>
          </div>
          <div class="stat-card online-visitors">
            <div class="stat-icon">
              <i class="fas fa-circle online-dot"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.onlineVisitors }}</div>
              <div class="stat-label">
                Visitor Online
                <span class="stat-extra">
                  (pengunjung aktif dalam ±1 menit terakhir, tidak termasuk robot)
                </span>
              </div>
            </div>
          </div>
          <div class="stat-card robot-visitors">
            <div class="stat-icon">
              <i class="fas fa-robot"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.robotVisitors }}</div>
              <div class="stat-label">Visitor Robot</div>
            </div>
          </div>
        </div>
        <div v-else class="stats-loading">
          <div class="loading-row" v-for="n in 4" :key="n">
            <div class="loading-icon"></div>
            <div class="loading-lines">
              <div class="loading-line short"></div>
              <div class="loading-line long"></div>
            </div>
          </div>
        </div>
        <p v-if="visitorsError" class="stats-error">
          Beberapa data statistik tidak dapat dimuat saat ini. Silakan coba kembali beberapa saat lagi.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useVisitors } from '~~/composables/useVisitors'

const TIME_ZONE = 'Asia/Jakarta'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const currentTime = ref('--:--:--')
const currentDate = ref('Memuat...')
const visitorIP = ref('Memuat...')
const countryName = ref('Memuat...')
const regionName = ref('')
const cityName = ref('')
const browserName = ref('Tidak diketahui')
const deviceOS = ref('Tidak diketahui')
const deviceType = ref('Desktop')
const deviceLabel = ref('Desktop')
const isp = ref('Memuat...')
const screenSize = ref('')
const connectionType = ref('Tidak diketahui')
const networkQuality = ref('Normal')
const proxyStatus = ref('Tidak diketahui')
const vpnStatus = ref('Tidak diketahui')
const cookiesEnabled = ref(false)
const jsEnabled = ref(true)

let timeInterval: ReturnType<typeof setInterval> | null = null
let resizeListener: (() => void) | null = null
let connection: any = null
let connectionChangeHandler: (() => void) | null = null
let statsInterval: ReturnType<typeof setInterval> | null = null

const {
  uniqueToday,
  uniqueMonth,
  uniqueYear,
  hitsToday,
  hitsMonth,
  hitsYear,
  onlineVisitors,
  onlineRobots,
  total,
  refresh,
  loading,
  error
} = useVisitors()

const nf = (value: number | null | undefined) => {
  try {
    return new Intl.NumberFormat('id-ID').format(value ?? 0)
  } catch {
    return String(value ?? 0)
  }
}

const stats = computed(() => ({
  todayVisits: nf(hitsToday.value || uniqueToday.value),
  todayVisitors: nf(uniqueToday.value),
  monthVisits: nf(hitsMonth.value || uniqueMonth.value),
  monthUniqueVisitors: nf(uniqueMonth.value),
  yearVisits: nf(hitsYear.value || uniqueYear.value),
  yearUniqueVisitors: nf(uniqueYear.value),
  totalVisits: nf(total.value || hitsYear.value || uniqueYear.value),
  onlineVisitors: nf(onlineVisitors.value),
  robotVisitors: nf(onlineRobots.value)
}))

const visitorsLoading = computed(() => loading.value)
const visitorsError = computed(() => error.value)

const timezoneLabel = computed(() => {
  try {
    const parts = new Intl.DateTimeFormat('id-ID', {
      timeZone: TIME_ZONE,
      timeZoneName: 'short'
    }).formatToParts(new Date())
    return parts.find(part => part.type === 'timeZoneName')?.value || 'WIB'
  } catch {
    return 'WIB'
  }
})

const locationDisplay = computed(() => {
  const segments = [cityName.value, regionName.value].filter(Boolean)
  return segments.join(', ')
})

const networkQualityClass = computed(() => {
  switch (networkQuality.value) {
    case 'Cepat':
      return 'status-success'
    case 'Normal':
      return 'status-neutral'
    case 'Pelan':
    case 'Lambat':
      return 'status-warning'
    case 'Sangat Slow':
      return 'status-critical'
    default:
      return 'status-neutral'
  }
})

const connectionLabel = computed(() => {
  const base = connectionType.value && connectionType.value !== 'unknown'
    ? connectionType.value.toUpperCase()
    : 'Tidak diketahui'
  return base
})

function closePopup() {
  emit('close')
}

function updateTime() {
  try {
    const now = new Date()
    currentTime.value = new Intl.DateTimeFormat('id-ID', {
      timeZone: TIME_ZONE,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(now)
  } catch {
    currentTime.value = '--:--:--'
  }
}

function updateDate() {
  try {
    const now = new Date()
    currentDate.value = new Intl.DateTimeFormat('id-ID', {
      timeZone: TIME_ZONE,
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(now)
  } catch {
    currentDate.value = 'Tidak tersedia'
  }
}

function detectDevice() {
  try {
    if (typeof navigator === 'undefined') return
    const ua = navigator.userAgent || navigator.vendor || ''

    const isIpad = /iPad/.test(ua) || (/(Macintosh)/.test(ua) && 'ontouchend' in window)
    const isTablet = isIpad || (/Android/.test(ua) && !/Mobile/.test(ua)) || /Tablet/.test(ua)
    const isMobile = /Mobi|Android|iPhone|iPod|Windows Phone/.test(ua)
    deviceType.value = isTablet ? 'Tablet' : (isMobile ? 'Mobile' : 'Desktop')

    let detectedBrowser = ''
    const navAny: any = navigator
    const uaData = navAny?.userAgentData
    if (uaData?.brands?.length) {
      const brands = uaData.brands.map((b: any) => String(b?.brand || '').toLowerCase())
      if (brands.some((b: string) => b.includes('edge'))) detectedBrowser = 'Edge'
      else if (brands.some((b: string) => b.includes('opera'))) detectedBrowser = 'Opera'
      else if (brands.some((b: string) => b.includes('chrome'))) detectedBrowser = 'Chrome'
    }
    if (!detectedBrowser) {
      if (/Brave/i.test(ua)) detectedBrowser = 'Brave'
      else if (/Vivaldi/i.test(ua)) detectedBrowser = 'Vivaldi'
      else if (/YaBrowser/i.test(ua)) detectedBrowser = 'Yandex'
      else if (/UCBrowser/i.test(ua)) detectedBrowser = 'UC Browser'
      else if (/Whale/i.test(ua)) detectedBrowser = 'Whale'
      else if (/QQBrowser/i.test(ua)) detectedBrowser = 'QQ Browser'
      else if (/Edg\//.test(ua)) detectedBrowser = 'Edge'
      else if (/OPR\//.test(ua) || /Opera/.test(ua)) detectedBrowser = 'Opera'
      else if (/CriOS\//.test(ua)) detectedBrowser = 'Chrome (iOS)'
      else if (/Chrome\//.test(ua)) detectedBrowser = 'Chrome'
      else if (/Firefox\//.test(ua)) detectedBrowser = 'Firefox'
      else if (/SamsungBrowser\//.test(ua)) detectedBrowser = 'Samsung Internet'
      else if (/Safari\//.test(ua)) detectedBrowser = 'Safari'
      else if (/MSIE|Trident\//.test(ua)) detectedBrowser = 'Internet Explorer'
    }
    browserName.value = detectedBrowser || 'Tidak diketahui'

    if (/Android/i.test(ua)) deviceOS.value = 'Android'
    else if (/iPhone|iPad|iPod/i.test(ua)) deviceOS.value = 'iOS'
    else if (/Windows NT/i.test(ua)) deviceOS.value = 'Windows'
    else if (/Macintosh|Mac OS X/i.test(ua)) deviceOS.value = 'macOS'
    else if (/CrOS/i.test(ua)) deviceOS.value = 'ChromeOS'
    else if (/Linux/i.test(ua)) deviceOS.value = 'Linux'
    else deviceOS.value = 'Lainnya'

    if (/iPhone/i.test(ua)) deviceLabel.value = 'iPhone'
    else if (/iPad/i.test(ua)) deviceLabel.value = 'iPad'
    else if (/Android/i.test(ua)) {
      const m = ua.match(/Android[^;]*;\s*([^;)]+)/i)
      deviceLabel.value = (m && m[1]) ? m[1].trim() : 'Android'
    } else if (/Windows|Macintosh|Linux/i.test(ua)) {
      deviceLabel.value = 'Desktop'
    } else {
      deviceLabel.value = deviceType.value
    }
  } catch {
    browserName.value = 'Tidak diketahui'
    deviceOS.value = 'Tidak diketahui'
    deviceType.value = 'Desktop'
    deviceLabel.value = 'Desktop'
  }
}

function updateScreenSize() {
  try {
    if (typeof window === 'undefined') return
    screenSize.value = `${window.innerWidth}px × ${window.innerHeight}px`
  } catch {
    screenSize.value = 'Tidak diketahui'
  }
}

function updateConnectionInfo() {
  try {
    if (typeof navigator === 'undefined') return
    const conn: any = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    connectionType.value = conn?.effectiveType || conn?.type || 'unknown'
  } catch {
    connectionType.value = 'unknown'
  }
}

function detectNetworkQuality() {
  try {
    if (typeof navigator === 'undefined') return
    const conn: any = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    if (conn && (conn.effectiveType || conn.downlink || conn.rtt)) {
      const et = String(conn.effectiveType || '').toLowerCase()
      if (et.includes('5g') || et === '4g') networkQuality.value = 'Cepat'
      else if (et === '3g') networkQuality.value = 'Normal'
      else if (et === '2g') networkQuality.value = 'Lambat'
      else if (et.includes('slow-2g')) networkQuality.value = 'Sangat Slow'
      else {
        const dl = Number(conn.downlink || 0)
        const rtt = Number(conn.rtt || 0)
        if (dl >= 10 && rtt <= 100) networkQuality.value = 'Cepat'
        else if (dl >= 2 && rtt <= 300) networkQuality.value = 'Normal'
        else if (dl >= 0.5 && rtt <= 700) networkQuality.value = 'Pelan'
        else if (dl > 0) networkQuality.value = 'Lambat'
        else networkQuality.value = 'Sangat Slow'
      }
      return
    }
  } catch { /* ignore */ }
  networkQuality.value = 'Normal'
}

async function fetchVisitorMeta() {
  if (typeof window === 'undefined') return
  const fetchers = [
    'https://ipapi.co/json/',
    'https://ipwho.is/',
    'https://ipinfo.io/json'
  ]

  for (const url of fetchers) {
    try {
      const response = await fetch(url, { cache: 'no-store' })
      if (!response.ok) continue
      const data = await response.json()
      if (data?.ip && visitorIP.value === 'Memuat...') {
        visitorIP.value = data.ip
      }
      if (data?.country_name || data?.country) {
        countryName.value = data.country_name || data.country || countryName.value
      }
      if (data?.city) cityName.value = data.city
      if (data?.region || data?.region_name || data?.state) {
        regionName.value = data.region || data.region_name || data.state || regionName.value
      }
      if (data?.org || data?.connection?.isp) {
        isp.value = data.org || data.connection?.isp || isp.value
      }
      if (typeof data?.connection?.proxy === 'boolean') {
        proxyStatus.value = data.connection.proxy ? 'Aktif' : 'Tidak aktif'
      } else if (typeof data?.proxy === 'boolean') {
        proxyStatus.value = data.proxy ? 'Aktif' : 'Tidak aktif'
      }
      if (data?.security?.vpn === true || data?.connection?.vpn === true || data?.privacy?.vpn === true || data?.vpn === true) {
        vpnStatus.value = 'Aktif'
      }
      if (countryName.value !== 'Memuat...' && visitorIP.value !== 'Memuat...') {
        break
      }
    } catch {
      continue
    }
  }

  if (!visitorIP.value || visitorIP.value === 'Memuat...') {
    visitorIP.value = 'Tidak tersedia'
  }
  if (!countryName.value || countryName.value === 'Memuat...') {
    countryName.value = 'Tidak diketahui'
  }
  if (!isp.value || isp.value === 'Memuat...') {
    isp.value = 'Tidak diketahui'
  }
}

function refreshBasics() {
  updateTime()
  updateDate()
  updateScreenSize()
  detectNetworkQuality()
  updateConnectionInfo()
  cookiesEnabled.value = typeof navigator !== 'undefined' ? Boolean(navigator.cookieEnabled) : false
  jsEnabled.value = true
}

onMounted(() => {
  refreshBasics()
  detectDevice()
  fetchVisitorMeta()

  timeInterval = setInterval(updateTime, 1000)
  resizeListener = () => updateScreenSize()
  if (typeof window !== 'undefined' && resizeListener) {
    window.addEventListener('resize', resizeListener)
  }

  if (typeof navigator !== 'undefined') {
    connection = navigator.connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    if (connection && typeof connection.addEventListener === 'function') {
      connectionChangeHandler = () => {
        detectNetworkQuality()
        updateConnectionInfo()
      }
      connection.addEventListener('change', connectionChangeHandler)
    } else if (connection) {
      connectionChangeHandler = () => {
        detectNetworkQuality()
        updateConnectionInfo()
      }
      connection.onchange = connectionChangeHandler
    }
  }
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
    timeInterval = null
  }
  if (typeof window !== 'undefined' && resizeListener) {
    window.removeEventListener('resize', resizeListener)
    resizeListener = null
  }
  if (connection && connectionChangeHandler) {
    if (typeof connection.removeEventListener === 'function') {
      connection.removeEventListener('change', connectionChangeHandler)
    } else {
      connection.onchange = null
    }
  }
  connectionChangeHandler = null
  connection = null
  if (statsInterval) {
    clearInterval(statsInterval)
    statsInterval = null
  }
})

watch(() => props.isOpen, value => {
  if (value) {
    refreshBasics()
    fetchVisitorMeta()
    try {
      refresh()
    } catch {}
    if (!statsInterval) {
      statsInterval = setInterval(() => {
        try {
          refresh()
        } catch {}
      }, 25000)
    }
  } else if (statsInterval) {
    clearInterval(statsInterval)
    statsInterval = null
  }
})
</script>

<style scoped>
.clock-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}

.clock-popup {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  border-radius: 20px;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.05) 0%, transparent 100%);
}

.header-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.date-info, .ip-info {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #e0e6ed;
  font-size: 14px;
}

.date-info i, .ip-info i {
  color: #4fc3f7;
  width: 16px;
}

.close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 107, 107, 0.8);
  transform: rotate(90deg);
}

.clock-section {
  padding: 25px;
  text-align: center;
  background: linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%);
  margin: 0 20px 20px;
  border-radius: 15px;
  position: relative;
  overflow: hidden;
}

.clock-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.1)"/></svg>') repeat;
  background-size: 20px 20px;
  opacity: 0.3;
}

.clock-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  position: relative;
  z-index: 1;
}

.clock-display i {
  font-size: 24px;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.time {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  font-family: 'Courier New', monospace;
}

.timezone {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 600;
}

.system-info {
  padding: 0 25px 20px;
}

.privacy-note {
  margin-top: 10px;
  font-size: 11px;
  color: #9fb2c5;
  line-height: 1.4;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.info-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

.info-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #fff;
}

.flag-icon { background: linear-gradient(135deg, #ff6b6b, #ee5a24); }
.os-icon { background: linear-gradient(135deg, #74b9ff, #0984e3); }
.browser-icon { background: linear-gradient(135deg, #fd79a8, #e84393); }
.device-icon { background: linear-gradient(135deg, #fdcb6e, #e17055); }

.info-text,
.info-detail {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: rgba(224, 230, 237, 0.65);
}

.info-value {
  color: #e0e6ed;
  font-size: 15px;
  font-weight: 600;
}

.info-subtle {
  font-size: 11px;
  color: rgba(224, 230, 237, 0.55);
}

.network-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.network-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 15px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  border-left: 3px solid #4fc3f7;
  font-size: 13px;
  color: #b8c5d1;
}

.network-item i {
  color: #4fc3f7;
  width: 16px;
}

.status-good { color: #00b894; font-weight: 600; }
.status-unknown { color: #fdcb6e; font-weight: 600; }
.status-enabled { color: #00b894; font-weight: 600; }

.status-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  background: rgba(79, 195, 247, 0.16);
  color: #4fc3f7;
}

.status-success {
  background: rgba(0, 184, 148, 0.18);
  color: #00d1a6;
}

.status-neutral {
  background: rgba(79, 195, 247, 0.16);
  color: #4fc3f7;
}

.status-warning {
  background: rgba(253, 203, 110, 0.2);
  color: #fdbc4c;
}

.status-critical {
  background: rgba(255, 118, 117, 0.2);
  color: #ff7675;
}

.visitor-stats {
  padding: 0 25px 25px;
}

.stats-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #4fc3f7;
}

.stats-title i {
  color: #4fc3f7;
}

.stats-subtitle {
  font-size: 12px;
  color: #b8c5d1;
  margin-bottom: 16px;
  line-height: 1.5;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #4fc3f7, #29b6f6);
}

.stat-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.stat-card.today-visits::before { background: linear-gradient(90deg, #00b894, #00cec9); }
.stat-card.today-visitors::before { background: linear-gradient(90deg, #74b9ff, #0984e3); }
.stat-card.month-visits::before { background: linear-gradient(90deg, #fd79a8, #e84393); }
.stat-card.month-visitors::before { background: linear-gradient(90deg, #fdcb6e, #e17055); }
.stat-card.year-visitors::before { background: linear-gradient(90deg, #a29bfe, #6c5ce7); }
.stat-card.total-visits::before { background: linear-gradient(90deg, #ff7675, #d63031); }
.stat-card.online-visitors::before { background: linear-gradient(90deg, #00b894, #00cec9); }
.stat-card.robot-visitors::before { background: linear-gradient(90deg, #636e72, #2d3436); }

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #fff;
}

.today-visits .stat-icon { background: linear-gradient(135deg, #00b894, #00cec9); }
.today-visitors .stat-icon { background: linear-gradient(135deg, #74b9ff, #0984e3); }
.month-visits .stat-icon { background: linear-gradient(135deg, #fd79a8, #e84393); }
.month-visitors .stat-icon { background: linear-gradient(135deg, #fdcb6e, #e17055); }
.year-visitors .stat-icon { background: linear-gradient(135deg, #a29bfe, #6c5ce7); }
.total-visits .stat-icon { background: linear-gradient(135deg, #ff7675, #d63031); }
.online-visitors .stat-icon { background: linear-gradient(135deg, #00b894, #00cec9); }
.robot-visitors .stat-icon { background: linear-gradient(135deg, #636e72, #2d3436); }

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 11px;
  color: #b8c5d1;
  line-height: 1.2;
}

.stat-extra {
  display: block;
  font-size: 10px;
  color: #8fa1b3;
  margin-top: 3px;
}

.online-dot {
  color: #00b894 !important;
  animation: pulse 2s infinite;
}

.stats-loading {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.loading-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.loading-icon {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(79, 195, 247, 0.3), rgba(41, 182, 246, 0.1));
  animation: shimmer 1.4s infinite;
}

.loading-lines {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.loading-line {
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
  position: relative;
}

.loading-line::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent);
  animation: shimmer 1.4s infinite;
}

.loading-line.short {
  width: 40%;
}

.loading-line.long {
  width: 70%;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.stats-error {
  margin-top: 10px;
  font-size: 11px;
  color: #fca5a5;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Responsive */
@media (max-width: 768px) {
  .clock-popup {
    width: 95%;
    margin: 10px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .time {
    font-size: 28px;
  }
  
  .popup-header {
    padding: 15px 20px;
  }
  
  .clock-section {
    margin: 0 15px 15px;
    padding: 20px;
  }
  
  .system-info, .visitor-stats {
    padding: 0 20px 20px;
  }
}
</style>
