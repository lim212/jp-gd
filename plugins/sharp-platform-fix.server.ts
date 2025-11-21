// plugins/sharp-platform-fix.server.ts
// Fix for sharp warning about missing linux-x64 binaries when in online mode on Windows
// This plugin ensures that the correct platform is detected for sharp and logs only once

export default defineNuxtPlugin(() => {
  // Only run on server-side
  if (!import.meta.server) return

  // Check if we're running on Windows
  const isWindows = process.platform === 'win32'
  if (!isWindows) return

  // Ensure we only apply and log this fix once per Node process
  const g = globalThis as any
  if (g.__sharpPlatformFixApplied) {
    return
  }

  // Ensure npm_config_platform is set to 'win32' for sharp
  if (!process.env.npm_config_platform) {
    process.env.npm_config_platform = 'win32'
  }

  g.__sharpPlatformFixApplied = true
  console.info('[sharp-platform-fix] Ensured platform is set to win32 for sharp')
})
