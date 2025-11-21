import { useState, useRuntimeConfig } from '#imports'

export type DataSaverLevel = 'off' | 'lite' | 'text'
export type DataSaverMode = 'auto' | 'manual'

export interface DataSaverState {
  mode: DataSaverMode
  level: DataSaverLevel
  autoTriggered: boolean
  reason?: '2g' | 'lowDownlink' | 'saveData' | 'unknown'
}

const LS_KEY = 'data-saver-pref'

export function useDataSaver() {
  const state = useState<DataSaverState>('dataSaver', () => ({
    mode: 'auto',
    level: 'off',
    autoTriggered: false
  }))

  function loadPref() {
    try {
      if (typeof localStorage === 'undefined') return;
      const raw = localStorage.getItem(LS_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && typeof parsed === 'object') {
          state.value.mode = parsed.mode === 'manual' ? 'manual' : 'auto'
          state.value.level = parsed.level === 'text' ? 'text' : parsed.level === 'lite' ? 'lite' : 'off'
        }
      }
    } catch {}
  }

  function savePref() {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(LS_KEY, JSON.stringify({ mode: state.value.mode, level: state.value.level }))
    } catch {}
  }

  function setManual(level: DataSaverLevel) {
    state.value.mode = 'manual'
    state.value.level = level
    state.value.autoTriggered = false
    state.value.reason = undefined
    savePref()
  }

  function setAuto(level: DataSaverLevel, reason?: DataSaverState['reason']) {
    // Respect manual override
    if (state.value.mode === 'manual') return
    state.value.mode = 'auto'
    state.value.level = level
    state.value.autoTriggered = level !== 'off'
    state.value.reason = reason
  }

  function clearManual() {
    state.value.mode = 'auto'
    savePref()
  }

  function isTextOnly() { return state.value.level === 'text' }
  function isLite() { return state.value.level === 'lite' }
  function isOff() { return state.value.level === 'off' }

  function prefixCdn(url: string | undefined) {
    if (!url) return url
    const config = useRuntimeConfig()
    const cdnBase: string | undefined = (config.public as any)?.cdnBase
    if (cdnBase && url.startsWith('/')) {
      return cdnBase.replace(/\/$/, '') + url
    }
    return url
  }

  return { state, loadPref, savePref, setManual, setAuto, clearManual, isTextOnly, isLite, isOff, prefixCdn }
}
