// server/utils/ip.ts
// Helper to extract client IP from an H3/Nitro event in various deployment environments.
import type { H3Event } from 'h3'
import { getHeader } from 'h3'

function parseXForwardedFor(v?: string | null): string | undefined {
  if (!v) return undefined
  // X-Forwarded-For may contain a list: client, proxy1, proxy2
  const first = v.split(',')[0]?.trim()
  return first || undefined
}

export function getClientIp(event: H3Event): string {
  try {
    const cf = getHeader(event, 'cf-connecting-ip')
    if (cf) return cf

    const xff = parseXForwardedFor(getHeader(event, 'x-forwarded-for'))
    if (xff) return xff

    const xr = getHeader(event, 'x-real-ip')
    if (xr) return xr

    // RFC 7239 Forwarded: for=1.2.3.4;proto=https;by=...
    const fwd = getHeader(event, 'forwarded')
    if (fwd) {
      const m = /for=([^;]+)/i.exec(fwd)
      if (m && m[1]) {
        return m[1].replace(/^"|"$/g, '')
      }
    }

    const any = (event as any)?.node?.req?.socket?.remoteAddress ||
                (event as any)?.node?.req?.connection?.remoteAddress
    if (any) return any
  } catch {}
  return 'unknown'
}
