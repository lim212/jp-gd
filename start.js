import net from 'node:net'

const desired = parseInt(process.env.NITRO_PORT || process.env.PORT || '3000', 10)
const hostEnv = process.env.NITRO_HOST || process.env.HOST || '0.0.0.0'
const rangeMax = parseInt(process.env.PORT_MAX || String(desired + 20), 10)
const rangeMin = parseInt(process.env.PORT_MIN || String(desired), 10)

function probe(port, host) {
  return new Promise((resolve) => {
    const server = net.createServer()
    const done = (ok) => {
      try { server.close() } catch {}
      resolve(ok)
    }
    server.once('error', (err) => {
      // EADDRINUSE => not free, any other error we consider not free, except EADDRNOTAVAIL (IPv6 disabled)
      if (err && (err.code === 'EADDRINUSE' || err.code === 'EACCES')) return done(false)
      if (err && err.code === 'EADDRNOTAVAIL') return done(true)
      return done(false)
    })
    try {
      server.listen({ port, host, exclusive: true }, () => done(true))
    } catch {
      done(false)
    }
  })
}

async function isPortFreeOnAllStacks(port) {
  const v4 = await probe(port, '0.0.0.0')
  // Probe IPv6 if available; treat EADDRNOTAVAIL as ok in probe()
  const v6 = await probe(port, '::')
  return v4 && v6
}

async function findAvailablePort(start, end) {
  for (let p = start; p <= end; p++) {
    // quick skip for privileged ports
    if (p < 1024) continue
    if (await isPortFreeOnAllStacks(p)) return p
  }
  return 0
}

const chosen = await findAvailablePort(rangeMin, rangeMax)
if (!chosen) {
  console.error(`[start] No free port available in range ${rangeMin}-${rangeMax}.`)
  process.exit(1)
}

if (chosen !== desired) {
  console.warn(`[start] Port ${desired} is busy. Using ${chosen} instead.`)
}

process.env.NITRO_PORT = String(chosen)
process.env.PORT = String(chosen)
process.env.NITRO_HOST = hostEnv
process.env.HOST = hostEnv

// Dynamically import the Nitro built server entry
const entryUrl = new URL('./.output/server/index.mjs', import.meta.url)
try {
  console.log('Starting server from:', entryUrl.href)
  await import(entryUrl.href)
} catch (error) {
  console.error('Failed to start server:', error.message)
  console.error('Make sure to run "npm run build" first')
  console.error('Build output should be at: .output/server/index.mjs')
  console.error('Current working directory:', process.cwd())
  console.error('Entry URL:', entryUrl.href)
  process.exit(1)
}
