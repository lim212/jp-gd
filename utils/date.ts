// utils/date.ts
// A small, SSR-safe date formatter that accepts string | Date | null | undefined
// and returns an Indonesian formatted date (Asia/Jakarta) or "-" when invalid.

export type DateInput = string | Date | null | undefined

function toValidDate(input: DateInput): Date | null {
  if (input == null) return null
  try {
    if (input instanceof Date) {
      return isNaN(input.getTime()) ? null : input
    }
    // If it's a number-like string, parse as integer timestamp or year-month-day pattern.
    const str = String(input).trim()
    if (!str) return null

    // Try to parse ISO or standard date first
    const fromNative = new Date(str)
    if (!isNaN(fromNative.getTime())) return fromNative

    // Try numeric epoch (seconds or milliseconds)
    const num = Number(str)
    if (!isNaN(num) && isFinite(num)) {
      const ms = num > 1e12 ? num : (num > 1e10 ? num * 100 : num * 1000) // handle seconds vs ms heuristically
      const fromNum = new Date(ms)
      return isNaN(fromNum.getTime()) ? null : fromNum
    }

    return null
  } catch {
    return null
  }
}

export function formatDateSafe(input: DateInput): string {
  const d = toValidDate(input)
  if (!d) return '-'
  try {
    return d.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Jakarta'
    })
  } catch {
    return '-'
  }
}
