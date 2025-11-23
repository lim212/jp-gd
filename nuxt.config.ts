/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
const require = createRequire(import.meta.url)
const flagIconsShimPath = fileURLToPath(new URL('./app/assets/css/flag-icons-shim.css', import.meta.url))
const flagIconsShimPathNorm = flagIconsShimPath.replace(/\\/g, '/').replace(/\/+/g, '/')

// CRITICAL: Suppress Node.js DEP0155 deprecation warnings (trailing slash pattern mapping)
// This must run before any modules are loaded
if (typeof process !== 'undefined') {
  // Patch process.emitWarning to suppress DEP0155 warnings
  if (process.emitWarning) {
    const originalEmitWarning = process.emitWarning
    process.emitWarning = function(warning: any, ...args: any[]) {
      // Suppress DEP0155 warnings about trailing slash pattern mapping
      if (typeof warning === 'string' && warning.includes('DEP0155')) {
        return
      }
      if (warning && typeof warning === 'object' && warning.name === 'DeprecationWarning' && warning.code === 'DEP0155') {
        return
      }
      if (warning && typeof warning === 'object' && warning.code === 'DEP0155') {
        return
      }
      return originalEmitWarning.apply(process, [warning, ...args] as any)
    }
  }
  
  // Also patch process.on('warning') to catch warnings emitted via events
  const originalOn = process.on
  process.on = function(event: string, listener: any) {
    if (event === 'warning') {
      const wrappedListener = (warning: any) => {
        // Suppress DEP0155 warnings
        if (warning && warning.code === 'DEP0155') {
          return
        }
        if (warning && warning.name === 'DeprecationWarning' && warning.code === 'DEP0155') {
          return
        }
        return listener(warning)
      }
      return originalOn.call(process, event, wrappedListener)
    }
    return originalOn.call(process, event, listener)
  } as typeof process.on
}

// CRITICAL: Patch consola IMMEDIATELY at module load time to catch @nuxt/image warnings
// This must run before any Nuxt modules are loaded
;(() => {
  try {
    const consola = require('consola')
    if (!consola) return
    
    const suppressSharpWarning = (args: any[]): boolean => {
      try {
        const first = args?.[0]
        const msg = typeof first === 'string' ? first : (first?.message || '')
        if (typeof msg === 'string') {
          return (
            msg.includes('sharp binaries') ||
            msg.includes('linux-x64 cannot be found') ||
            (msg.includes('sharp') && msg.includes('cannot be found'))
          )
        }
      } catch {}
      return false
    }
    
    // Suppress Google Fonts fetch warnings (common on VPS without internet during build)
    const suppressGoogleFontsWarning = (args: any[]): boolean => {
      try {
        const first = args?.[0]
        const msg = typeof first === 'string' ? first : (first?.message || '')
        if (typeof msg === 'string') {
          return (
            msg.includes('Could not fetch from https://fonts.google.com') ||
            msg.includes('fonts.google.com/metadata/fonts') ||
            msg.includes('Will retry in') ||
            msg.includes('retries left') ||
            msg.includes('Could not initialize provider google') ||
            msg.includes('unifont will not be able to process fonts') ||
            msg.includes('getaddrinfo ENOTFOUND fonts.google.com')
          )
        }
      } catch {}
      return false
    }
    
    // Patch consola.warn
    if (typeof consola.warn === 'function' && !(consola.warn as any).__sharpPatched) {
      const originalWarn = consola.warn.bind(consola)
      consola.warn = ((...args: any[]) => {
        if (suppressSharpWarning(args)) return
        if (suppressGoogleFontsWarning(args)) return
        return originalWarn(...args)
      }) as typeof consola.warn
      ;(consola.warn as any).__sharpPatched = true
    }
    
    // Patch consola.withTag - CRITICAL for [@nuxt/image] tagged loggers
    if (typeof consola.withTag === 'function' && !(consola.withTag as any).__sharpPatched) {
      const originalWithTag = consola.withTag.bind(consola)
      consola.withTag = ((tag: string) => {
        const logger = originalWithTag(tag)
        if (logger && typeof logger.warn === 'function' && !(logger.warn as any).__sharpPatched) {
          const originalLoggerWarn = logger.warn.bind(logger)
          logger.warn = ((...args: any[]) => {
            if (suppressSharpWarning(args)) return
            if (suppressGoogleFontsWarning(args)) return
            return originalLoggerWarn(...args)
          }) as typeof logger.warn
          ;(logger.warn as any).__sharpPatched = true
        }
        return logger
      }) as typeof consola.withTag
      ;(consola.withTag as any).__sharpPatched = true
    }
    
    // Patch consola.create
    if (typeof consola.create === 'function' && !(consola.create as any).__sharpPatched) {
      const originalCreate = consola.create.bind(consola)
      consola.create = ((...args: any[]) => {
        const logger = originalCreate(...args)
        if (logger && typeof logger.warn === 'function' && !(logger.warn as any).__sharpPatched) {
          const originalLoggerWarn = logger.warn.bind(logger)
          logger.warn = ((...args: any[]) => {
            if (suppressSharpWarning(args)) return
            if (suppressGoogleFontsWarning(args)) return
            return originalLoggerWarn(...args)
          }) as typeof logger.warn
          ;(logger.warn as any).__sharpPatched = true
        }
        return logger
      }) as typeof consola.create
      ;(consola.create as any).__sharpPatched = true
    }
    
    // Patch consola.withScope
    if (typeof consola.withScope === 'function' && !(consola.withScope as any).__sharpPatched) {
      const originalWithScope = consola.withScope.bind(consola)
      consola.withScope = ((scope: any) => {
        const logger = originalWithScope(scope)
        if (logger && typeof logger.warn === 'function' && !(logger.warn as any).__sharpPatched) {
          const originalLoggerWarn = logger.warn.bind(logger)
          logger.warn = ((...args: any[]) => {
            if (suppressSharpWarning(args)) return
            if (suppressGoogleFontsWarning(args)) return
            return originalLoggerWarn(...args)
          }) as typeof logger.warn
          ;(logger.warn as any).__sharpPatched = true
        }
        return logger
      }) as typeof consola.withScope
      ;(consola.withScope as any).__sharpPatched = true
    }
  } catch {
    // Ignore if consola not available
  }
})()

// Demote noisy UI Pro offline license verify errors to warnings on hosts without outbound network
// This prevents alarming ERROR logs like:
// "Cannot validate Nuxt UI Pro License: FetchError: [GET] https://api.nuxtlabs.com/ui-pro/verify ..."
// while keeping other errors intact.
// You can disable this behavior by setting NUXT_UI_PRO_SOFT_VALIDATE=false in env.
const __softUiPro = process.env.NUXT_UI_PRO_SOFT_VALIDATE !== 'false'
if (__softUiPro) {
  const __origConsoleError = console.error
  console.error = (...args) => {
    try {
      const first = args?.[0]
      const msg = typeof first === 'string' ? first : (first?.message || '')
      if (typeof msg === 'string' && msg.includes('Cannot validate Nuxt UI Pro License')) {
        console.warn(...args)
        return
      }
    } catch {}
    return __origConsoleError(...args)
  }

  // Also patch consola (Nuxt logger) to demote the same specific message, including scoped loggers
  try {
    const consola = require('consola')
    if (consola && typeof consola.error === 'function') {
      const __origConsolaError = consola.error.bind(consola)
      consola.error = (...args) => {
        try {
          const first = args?.[0]
          const msg = typeof first === 'string' ? first : (first?.message || '')
          if (typeof msg === 'string' && msg.includes('Cannot validate Nuxt UI Pro License')) {
            // Use console.warn to avoid recursion with patched consola
            console.warn(...args)
            return
          }
        } catch {}
        return __origConsolaError(...args)
      }
    }
    if (consola && typeof consola.create === 'function') {
      const __origConsolaCreate = consola.create.bind(consola)
      consola.create = (...cargs) => {
        const logger = __origConsolaCreate(...cargs)
        if (logger && typeof logger.error === 'function') {
          const __origLoggerError = logger.error.bind(logger)
          logger.error = (...args) => {
            try {
              const first = args?.[0]
              const msg = typeof first === 'string' ? first : (first?.message || '')
              if (typeof msg === 'string' && msg.includes('Cannot validate Nuxt UI Pro License')) {
                console.warn(...args)
                return
              }
            } catch {}
            return __origLoggerError(...args)
          }
        }
        return logger
      }
    }
  } catch {
    // consola not available, ignore
  }
}

const hasPwaModule = (() => {
  try { require.resolve('@vite-pwa/nuxt'); return true } catch { return false }
})()
const enablePWA = process.env.NUXT_ENABLE_PWA === 'true' && hasPwaModule

// Guard for optional nuxt-critters module to avoid startup errors when not installed
const hasCrittersModule = (() => {
  try { require.resolve('nuxt-critters'); return true } catch { return false }
})()

// Suppress @nuxt/image sharp binaries warning at build time
if (typeof process !== 'undefined' && typeof console !== 'undefined') {
  const originalWarn = console.warn
  if (!(originalWarn as any).__patchedForSharp) {
    console.warn = ((...args: any[]) => {
      const message = args[0]?.toString() || ''
      // Suppress sharp binaries warning from @nuxt/image
      if (message.includes('sharp binaries') || 
          message.includes('linux-x64 cannot be found') ||
          (message.includes('@nuxt/image') && message.includes('sharp'))) {
        return
      }
      // Suppress Google Fonts fetch warnings (common on VPS without internet during build)
      if (message.includes('Could not fetch from https://fonts.google.com') ||
          message.includes('fonts.google.com/metadata/fonts') ||
          message.includes('Will retry in') ||
          message.includes('retries left') ||
          message.includes('Could not initialize provider google') ||
          message.includes('unifont will not be able to process fonts') ||
          message.includes('getaddrinfo ENOTFOUND fonts.google.com')) {
        return
      }
      return originalWarn.apply(console, args)
    }) as typeof console.warn
    ;(console.warn as any).__patchedForSharp = true
  }
  
  // Also patch consola (Nuxt logger) to suppress sharp warnings
  try {
    const consola = require('consola')
    if (consola && typeof consola.warn === 'function') {
      const originalConsolaWarn = consola.warn.bind(consola)
      if (!(originalConsolaWarn as any).__patchedForSharp) {
        consola.warn = ((...args: any[]) => {
          try {
            const first = args?.[0]
            const msg = typeof first === 'string' ? first : (first?.message || '')
            if (typeof msg === 'string' && (
              msg.includes('sharp binaries') ||
              msg.includes('linux-x64 cannot be found') ||
              (msg.includes('@nuxt/image') && msg.includes('sharp'))
            )) {
              return // Suppress the warning
            }
          } catch {}
          return originalConsolaWarn(...args)
        }) as typeof consola.warn
        ;(consola.warn as any).__patchedForSharp = true
      }
    }
    // Also patch consola.create to handle scoped loggers
    if (consola && typeof consola.create === 'function') {
      const originalConsolaCreate = consola.create.bind(consola)
      consola.create = (...cargs: any[]) => {
        const logger = originalConsolaCreate(...cargs)
        if (logger && typeof logger.warn === 'function') {
          const originalLoggerWarn = logger.warn.bind(logger)
          if (!(originalLoggerWarn as any).__patchedForSharp) {
            logger.warn = ((...args: any[]) => {
              try {
                const first = args?.[0]
                const msg = typeof first === 'string' ? first : (first?.message || '')
                if (typeof msg === 'string' && (
                  msg.includes('sharp binaries') ||
                  msg.includes('linux-x64 cannot be found') ||
                  (msg.includes('@nuxt/image') && msg.includes('sharp'))
                )) {
                  return // Suppress the warning
                }
              } catch {}
              return originalLoggerWarn(...args)
            }) as typeof logger.warn
            ;(logger.warn as any).__patchedForSharp = true
          }
        }
        return logger
      }
    }
    // Patch consola.withTag to handle tagged loggers like [@nuxt/image]
    if (consola && typeof consola.withTag === 'function') {
      const originalWithTag = consola.withTag.bind(consola)
      consola.withTag = ((tag: string) => {
        const logger = originalWithTag(tag)
        if (logger && typeof logger.warn === 'function') {
          const originalLoggerWarn = logger.warn.bind(logger)
          if (!(originalLoggerWarn as any).__patchedForSharp) {
            logger.warn = ((...args: any[]) => {
              try {
                const first = args?.[0]
                const msg = typeof first === 'string' ? first : (first?.message || '')
                if (typeof msg === 'string' && (
                  msg.includes('sharp binaries') ||
                  msg.includes('linux-x64 cannot be found') ||
                  (msg.includes('@nuxt/image') && msg.includes('sharp'))
                )) {
                  return // Suppress the warning
                }
              } catch {}
              return originalLoggerWarn(...args)
            }) as typeof logger.warn
            ;(logger.warn as any).__patchedForSharp = true
          }
        }
        return logger
      }) as typeof consola.withTag
    }
    
    // CRITICAL: Patch consola.withScope which is used by @nuxt/image
    if (consola && typeof consola.withScope === 'function') {
      const originalWithScope = consola.withScope.bind(consola)
      if (!(originalWithScope as any).__patchedForSharp) {
        consola.withScope = ((scope: any) => {
          const logger = originalWithScope(scope)
          if (logger && typeof logger.warn === 'function') {
            const originalLoggerWarn = logger.warn.bind(logger)
            if (!(originalLoggerWarn as any).__patchedForSharp) {
              logger.warn = ((...args: any[]) => {
                try {
                  const first = args?.[0]
                  const msg = typeof first === 'string' ? first : (first?.message || '')
                  if (typeof msg === 'string' && (
                    msg.includes('sharp binaries') ||
                    msg.includes('linux-x64 cannot be found') ||
                    (msg.includes('sharp') && msg.includes('cannot be found'))
                  )) {
                    return
                  }
                } catch {}
                return originalLoggerWarn(...args)
              }) as typeof logger.warn
              ;(originalLoggerWarn as any).__patchedForSharp = true
            }
          }
          return logger
        }) as typeof consola.withScope
        ;(consola.withScope as any).__patchedForSharp = true
      }
    }
  } catch {
    // consola not available, ignore
  }
}

export default defineNuxtConfig({
  // Use default build directory
  // buildDir: '.nuxt-build',
  
  // Hooks to suppress @nuxt/image sharp warnings early and handle build cleanup
  hooks: {
    // Ensure public assets exist before Nitro tries to access them
    'nitro:build:before'(nitro: any) {
      try {
        const fs = require('fs')
        const path = require('path')
        const publicDir = path.join(process.cwd(), 'public')
        const outputPublicDir = path.join(process.cwd(), '.output', 'public')
        
        // Ensure .output/public exists
        if (!fs.existsSync(outputPublicDir)) {
          fs.mkdirSync(outputPublicDir, { recursive: true })
        }
        
        // Copy critical public files if they exist
        const criticalFiles = ['social-card.png', 'landing-page.png']
        
        for (const file of criticalFiles) {
          const sourceFile = path.join(publicDir, file)
          const destFile = path.join(outputPublicDir, file)
          
          if (fs.existsSync(sourceFile) && !fs.existsSync(destFile)) {
            try {
              fs.copyFileSync(sourceFile, destFile)
            } catch (e) {
              // Ignore copy errors, Nitro will handle it
            }
          }
        }
      } catch (e) {
        // Ignore errors - Nitro will handle public assets
      }
    },
    
    // Handle build cleanup errors gracefully (Windows ENOTEMPTY issue)
    'build:before'() {
      try {
        const fs = require('fs')
        const path = require('path')
        const outputImagesPath = path.join(process.cwd(), '.output', 'public', 'images')
        if (fs.existsSync(outputImagesPath)) {
          // Try to remove directory contents first, then the directory
          const files = fs.readdirSync(outputImagesPath)
          files.forEach((file: string) => {
            const filePath = path.join(outputImagesPath, file)
            try {
              const stat = fs.statSync(filePath)
              if (stat.isDirectory()) {
                fs.rmSync(filePath, { recursive: true, force: true })
              } else {
                fs.unlinkSync(filePath)
              }
            } catch (e) {
              // Ignore errors during cleanup
            }
          })
        }
      } catch (e) {
        // Ignore cleanup errors - build will continue
      }
    },
    // Patch consola at the earliest possible moment
    'ready'() {
      try {
        const consola = require('consola')
        const suppressSharp = (args: any[]) => {
          try {
            const first = args?.[0]
            const msg = typeof first === 'string' ? first : (first?.message || '')
            return typeof msg === 'string' && (
              msg.includes('sharp binaries') ||
              msg.includes('linux-x64 cannot be found') ||
              (msg.includes('sharp') && msg.includes('cannot be found'))
            )
          } catch { return false }
        }
        
        // Force patch all consola methods again
        if (consola.warn) {
          const orig = consola.warn.bind(consola)
          consola.warn = ((...args: any[]) => {
            if (suppressSharp(args)) return
            return orig(...args)
          }) as typeof consola.warn
        }
        
        if (consola.withTag) {
          const orig = consola.withTag.bind(consola)
          consola.withTag = ((tag: string) => {
            const logger = orig(tag)
            if (logger?.warn) {
              const origWarn = logger.warn.bind(logger)
              logger.warn = ((...args: any[]) => {
                if (suppressSharp(args)) return
                return origWarn(...args)
              }) as typeof logger.warn
            }
            return logger
          }) as typeof consola.withTag
        }
      } catch {}
    },
    // Patch consola before modules are loaded
    'modules:before'() {
      try {
        const consola = require('consola')
        const patchLogger = (logger: any) => {
          if (logger && typeof logger.warn === 'function') {
            const originalWarn = logger.warn.bind(logger)
            if (!(originalWarn as any).__patchedForSharp) {
              logger.warn = ((...args: any[]) => {
                try {
                  const first = args?.[0]
                  const msg = typeof first === 'string' ? first : (first?.message || '')
                  if (typeof msg === 'string' && (
                    msg.includes('sharp binaries') ||
                    msg.includes('linux-x64 cannot be found') ||
                    (msg.includes('sharp') && msg.includes('cannot be found'))
                  )) {
                    return // Suppress the warning
                  }
                } catch {}
                return originalWarn(...args)
              }) as typeof logger.warn
              ;(originalWarn as any).__patchedForSharp = true
            }
          }
        }
        patchLogger(consola)
        if (typeof consola.withTag === 'function') {
          const originalWithTag = consola.withTag.bind(consola)
          consola.withTag = ((tag: string) => {
            const logger = originalWithTag(tag)
            patchLogger(logger)
            return logger
          }) as typeof consola.withTag
        }
        if (typeof consola.create === 'function') {
          const originalCreate = consola.create.bind(consola)
          consola.create = ((...args: any[]) => {
            const logger = originalCreate(...args)
            patchLogger(logger)
            return logger
          }) as typeof consola.create
        }
      } catch {}
    },
    // Also patch after modules are loaded as backup
    'modules:done'() {
      try {
        const consola = require('consola')
        const patchLogger = (logger: any) => {
          if (logger && typeof logger.warn === 'function') {
            const originalWarn = logger.warn.bind(logger)
            if (!(originalWarn as any).__patchedForSharp) {
              logger.warn = ((...args: any[]) => {
                try {
                  const first = args?.[0]
                  const msg = typeof first === 'string' ? first : (first?.message || '')
                  if (typeof msg === 'string' && (
                    msg.includes('sharp binaries') ||
                    msg.includes('linux-x64 cannot be found') ||
                    (msg.includes('sharp') && msg.includes('cannot be found'))
                  )) {
                    return // Suppress the warning
                  }
                } catch {}
                return originalWarn(...args)
              }) as typeof logger.warn
              ;(originalWarn as any).__patchedForSharp = true
            }
          }
        }
        patchLogger(consola)
        if (typeof consola.withTag === 'function') {
          const originalWithTag = consola.withTag.bind(consola)
          consola.withTag = ((tag: string) => {
            const logger = originalWithTag(tag)
            patchLogger(logger)
            return logger
          }) as typeof consola.withTag
        }
        if (typeof consola.create === 'function') {
          const originalCreate = consola.create.bind(consola)
          consola.create = ((...args: any[]) => {
            const logger = originalCreate(...args)
            patchLogger(logger)
            return logger
          }) as typeof consola.create
        }
      } catch {}
    }
  },
  
  // Build configuration
  build: {
    transpile: ['@nuxt/ui']
  },
  
  // Import protection - prevent @nuxt/kit from being imported in client-side
  imports: {
    transform: {
      // Exclude @nuxt/kit from client-side imports
      exclude: [/@nuxt\/kit/]
    }
  },
  
  // Optimize module loading and prevent timeouts
  experimental: {
    payloadExtraction: false,
    inlineSSRStyles: false,
    componentIslands: false,
    typedPages: false,
    headNext: false,
    renderJsonPayloads: false,
    scanPageMeta: false,
    writeEarlyHints: false,
    watcher: 'chokidar-granular',
    defaults: {
      nuxtLink: {
        prefetch: false,
        prefetchOn: { visibility: false }
      }
    }
  },

  // Router configuration to prevent API route handling
  router: {
    options: {
      // Prevent router from handling API routes
      strict: false,
      // Custom route matching to exclude API routes
      scrollBehaviorType: 'smooth'
    }
  },
  
  typescript: {
    strict: false,
    shim: false,
    typeCheck: false,
    tsConfig: {
      compilerOptions: {
        target: 'ESNext',
        module: 'ESNext'
      }
    }
  },

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => {
        // Add any custom elements that should be ignored
        const customElements = [
          'lazy-u-content-search',
          'UColorModeImage',
          'UPageSection', 
          'UPage',
          'UCard',
          'UButton',
          'UInput',
          'UForm',
          'UFormGroup',
          'UAlert',
          'UBadge',
          'UAvatar',
          'UDropdown',
          'UModal',
          'UTooltip',
          'UTabs',
          'UAccordion',
          'UCheckbox',
          'URadio',
          'USelect',
          'UTextarea',
          'UProgress',
          'USpinner',
          'UContainer',
          'UHeader',
          'UFooter',
          'UNavigation',
          'UBreadcrumb',
          'UPagination',
          'UTable',
          'UList',
          'UListItem',
          'UDivider',
          'USpace',
          'UGroup',
          'UStack',
          'UWrap',
          'UGrid',
          'UColumn',
          'URow',
          'UContainer',
          'USection',
          'UHero',
          'UFeature',
          'UTestimonial',
          'UStats',
          'UFAQ',
          'UPricing',
          'UContact',
          'UNewsletter',
          'USocial',
          'ULogo',
          'UImage',
          'UVideo',
          'UAudio',
          'UCode',
          'UCodeBlock',
          'UMarkdown',
          'UHtml',
          'UJson',
          'UXml',
          'UCsv',
          'UPdf',
          'UExcel',
          'UWord',
          'UPowerPoint',
          'UArchive',
          'UFile',
          'UFolder',
          'UDrive',
          'UCloud',
          'UServer',
          'UDatabase',
          'UApi',
          'UWebhook',
          'UIntegration',
          'UPlugin',
          'UExtension',
          'UAddon',
          'UModule',
          'UPackage',
          'ULibrary',
          'UFramework',
          'UToolkit',
          'USdk',
          'UClient',
          'UServer',
          'UDesktop',
          'UMobile',
          'UWeb',
          'UApp',
          'UWebsite',
          'UBlog',
          'UEcommerce',
          'UStore',
          'UShop',
          'UMarketplace',
          'UPlatform',
          'UEcosystem',
          'UCommunity',
          'UNetwork',
          'UHub',
          'UCenter',
          'UBase',
          'UCore',
          'UFoundation',
          'UInfrastructure',
          'UArchitecture',
          'UDesign',
          'UPattern',
          'UTemplate',
          'UTheme',
          'ULayout',
          'UStructure',
          'UComponent',
          'UElement',
          'UWidget',
          'UGadget',
          'UFeature',
          'UFunction',
          'UCapability',
          'UAbility',
          'UPower',
          'UStrength',
          'UAdvantage',
          'UBenefit',
          'UValue',
          'UQuality',
          'UPerformance',
          'UEfficiency',
          'UProductivity',
          'UOptimization',
          'UEnhancement',
          'UImprovement',
          'UUpgrade',
          'UUpdate',
          'UVersion',
          'URelease',
          'UDeployment',
          'UInstallation',
          'USetup',
          'UConfiguration',
          'USettings',
          'UOptions',
          'UPreferences',
          'UCustomization',
          'UPersonalization',
          'UAdaptation',
          'UModification',
          'UAdjustment',
          'UTuning',
          'UCalibration',
          'UOptimization',
          'UEnhancement',
          'UImprovement',
          'UUpgrade',
          'UUpdate',
          'UVersion',
          'URelease',
          'UDeployment',
          'UInstallation',
          'USetup',
          'UConfiguration',
          'USettings',
          'UOptions',
          'UPreferences',
          'UCustomization',
          'UPersonalization',
          'UAdaptation',
          'UModification',
          'UAdjustment',
          'UTuning',
          'UCalibration'
        ]
        return customElements.includes(tag)
      }
    }
  },

  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
    storageKey: 'color-mode'
  },

  ui: {
    // Aggressive optimization: disable global registration to speed up module setup
    global: false,
    // Enhanced safelist with more colors for better design
    safelistColors: ['yellow', 'gray', 'red', 'purple', 'blue', 'green', 'indigo', 'pink'],
    // Suppress CSS warnings from Tailwind/Lightning CSS
    disableGlobalStyles: false,
    icons: {
      // Optimize for faster startup
      dynamicImports: false,
      loadingTimeout: 2000,
      cache: true,
      // Simplified icon preloading - only load what's needed
      mode: 'svg',
      serverBundle: 'local',
      clientBundle: 'local',
      aliases: {
        'lucide:click': 'lucide:mouse-pointer-click',
        'mdi:whatsapp': 'mdi:whatsapp',
        'lucide:check-square': 'lucide:square-check'
      }
    }
  },

  components: {
    dirs: [
      { path: './components', pathPrefix: false, ignore: ['Lazy*.vue', '**/Lazy*.vue'], global: false },
      { path: './app/components', pathPrefix: true, ignore: ['Lazy*.vue', '**/Lazy*.vue', '**/Ui/TitleBase.vue'], global: false }
    ]
  },

  runtimeConfig: {
    enableScheduler: process.env.NUXT_ENABLE_SCHEDULER === 'true',
    enableAutoBlog: process.env.NUXT_ENABLE_AUTO_BLOG === 'true',
    enableKeywordScheduler: process.env.NUXT_ENABLE_KEYWORD_SCHEDULER === 'true',
    enableBlogScheduler: process.env.NUXT_ENABLE_BLOG_SCHEDULER === 'true',
    openaiApiKey: process.env.OPENAI_API_KEY,
    // Default 20 posts per day for AI blog scheduler (can be overridden via env)
    maxDailyPosts: process.env.MAX_DAILY_POSTS || '20',
    blogGenerationTime: process.env.BLOG_GENERATION_TIME || '03:00',
    autoRebuild: process.env.AUTO_REBUILD === 'true',
    rebuildDelay: process.env.REBUILD_DELAY || '3600000',
    public: {
      whatsappPhone: process.env.WHATSAPP_PHONE || '628988888250',
      whatsappMessage: process.env.WHATSAPP_MESSAGE || 'Halo JasaPembayaran.com, saya ingin konsultasi tentang jasa PayPal',
      buildId: process.env.NUXT_PUBLIC_BUILD_ID || process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || process.env.COMMIT_SHA || String(Math.floor(Date.now() / 1000)),
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://jasapembayaran.com',
      cdnBase: process.env.NUXT_PUBLIC_CDN_BASE || ''
    }
  },

  alias: {
    'flag-icons/css/flag-icons.min.css': flagIconsShimPathNorm,
    'flag-icons/css/flag-icons.css': flagIconsShimPathNorm
  },

  postcss: {
    plugins: {
      // PENTING: CSS minification yang lebih aman - hanya whitespace, tidak mengubah selectors atau properties
      cssnano: process.env.NODE_ENV === 'production' ? {
        preset: ['default', {
          discardComments: {
            removeAll: false, // PENTING: false untuk memastikan CSS comments tetap ada jika diperlukan
          },
          cssDeclarationSorter: false, // PENTING: false agar urutan CSS tidak berubah
          normalizeWhitespace: true, // Hanya normalize whitespace
          minifySelectors: false, // PENTING: false agar selectors tidak diubah
          minifyFontValues: false, // PENTING: false agar font values tidak diubah
          minifyParams: false, // PENTING: false agar CSS params tidak diubah
          normalizeUrl: false, // PENTING: false agar URL tidak diubah
          reduceIdents: false, // PENTING: false agar ID tidak diubah
          zindex: false // PENTING: false agar z-index tidak diubah
        }]
      } : false
    }
  },

  vite: {
    // Error handler untuk menangkap error pre-transform
    logLevel: 'warn',
    clearScreen: false,
    plugins: [
      // Plugin to resolve #app-manifest alias (MUST be first to handle pre-transform errors)
      {
        name: 'resolve-app-manifest',
        enforce: 'pre',
        buildStart() {
          // Ensure stub file exists
          try {
            const fs = require('fs')
            const path = require('path')
            const stubPath = fileURLToPath(new URL('./server/stubs/app-manifest-stub.ts', import.meta.url))
            if (!fs.existsSync(stubPath)) {
              const stubDir = path.dirname(stubPath)
              if (!fs.existsSync(stubDir)) {
                fs.mkdirSync(stubDir, { recursive: true })
              }
              fs.writeFileSync(stubPath, 'export default {}\n', 'utf-8')
            }
          } catch {
            // Ignore errors
          }
        },
        resolveId(id, importer) {
          // Handle #app-manifest alias - this is a Nuxt internal alias
          if (id === '#app-manifest') {
            try {
              const stubPath = fileURLToPath(new URL('./server/stubs/app-manifest-stub.ts', import.meta.url))
              // Return absolute path to ensure it's resolved correctly
              return stubPath
            } catch (e) {
              // Fallback: return null to let other resolvers handle it
              return null
            }
          }
          return null
        },
        load(id) {
          // Load the stub file content directly
          if (id && id.includes('app-manifest-stub')) {
            return 'export default {}'
          }
          return null
        }
      },
      // Custom plugin to handle @nuxt/ui/dist/module.mjs import protection
      // Must run before import-protection plugin (enforce: 'pre' ensures this)
      {
        name: 'nuxt-ui-module-fix',
        enforce: 'pre',
        resolveId(id, importer) {
          // Intercept ALL @nuxt/kit imports in client context and redirect to stub
          if (id === '@nuxt/kit' || id.includes('@nuxt/kit')) {
            // Check if this is a client-side import (not from node_modules/@nuxt/kit itself)
            if (!importer || importer.includes('@nuxt/ui') || importer.includes('dist/module.mjs')) {
              const stubPath = fileURLToPath(new URL('./server/stubs/nuxt-kit-stub.ts', import.meta.url))
              return stubPath
            }
          }
          // Intercept @nuxt/ui/dist/module.mjs and return stub
          if (id.includes('@nuxt/ui/dist/module.mjs')) {
            const stubPath = fileURLToPath(new URL('./server/stubs/nuxt-ui-module-stub.ts', import.meta.url))
            return stubPath
          }
          return null
        },
        load(id) {
          // Return empty module for stubs
          if (id.includes('nuxt-ui-module-stub.ts') || id.includes('nuxt-kit-stub.ts')) {
            return 'export default {}'
          }
          return null
        }
      },
      // Plugin to resolve @nuxt/vite-builder paths (fixes file:// URL resolution warnings)
      {
        name: 'resolve-vite-builder-paths',
        enforce: 'pre',
        resolveId(id, importer) {
          // Handle file:// URLs from @nuxt/vite-builder
          if (id && typeof id === 'string') {
            // Check if it's a file:// URL pointing to @nuxt/vite-builder
            if (id.startsWith('file://') && id.includes('@nuxt/vite-builder')) {
              // Extract the actual path from file:// URL
              try {
                const url = new URL(id)
                const actualPath = url.pathname
                // On Windows, pathname starts with /, we need to handle it
                const normalizedPath = process.platform === 'win32' 
                  ? actualPath.replace(/^\/([A-Za-z]:)/, '$1')
                  : actualPath
                
                // Try to resolve the actual file path
                try {
                  return require.resolve(normalizedPath)
                } catch {
                  // If require.resolve fails, return the normalized path
                  return normalizedPath
                }
              } catch {
                // If URL parsing fails, try to extract path manually
                const match = id.match(/file:\/\/(.+)$/)
                if (match) {
                  let path = match[1]
                  // Handle Windows paths
                  if (process.platform === 'win32') {
                    path = path.replace(/^\/([A-Za-z]:)/, '$1')
                  }
                  return path
                }
              }
            }
            
            // Handle @nuxt/vite-builder imports that can't be resolved
            if (id.includes('@nuxt/vite-builder/dist/runtime/vite-node.mjs')) {
              try {
                return require.resolve('@nuxt/vite-builder/dist/runtime/vite-node.mjs', {
                  paths: [require.resolve('nuxt/package.json')]
                })
              } catch {
                // Return null to let Vite handle it as external
                return { id, external: true }
              }
            }
            
            if (id.includes('@nuxt/vite-builder/dist/runtime/client.manifest.mjs')) {
              try {
                return require.resolve('@nuxt/vite-builder/dist/runtime/client.manifest.mjs', {
                  paths: [require.resolve('nuxt/package.json')]
                })
              } catch {
                // Return null to let Vite handle it as external
                return { id, external: true }
              }
            }
          }
          return null
        }
      },
      // Plugin to suppress esbuild CSS minify warnings and module resolution warnings
      {
        name: 'suppress-css-warnings',
        enforce: 'post',
        generateBundle(options, bundle) {
          // This plugin runs after bundle generation to suppress warnings
        },
        buildEnd() {
          // Suppress warnings during build
        }
      }
    ],
    css: { 
      devSourcemap: false,
      preprocessorOptions: {
        css: { charset: false }
      },
      // Force PostCSS transformer to avoid Lightning CSS warnings about :deep()
      transformer: 'postcss',
      // Disable CSS minification warnings for Tailwind classes
      postcss: {
        plugins: []
      }
    },
    esbuild: { 
      // JANGAN hapus console di production untuk debugging
      drop: [], // Tidak menghapus console/debugger untuk memastikan fungsi tetap berjalan
      target: 'es2020',
      // Minification yang lebih aman - hanya whitespace, tidak mengubah identifiers
      minifyIdentifiers: false, // PENTING: false agar tidak merusak nama fungsi/class
      minifySyntax: process.env.NODE_ENV === 'production', // Hanya minify syntax, tidak identifiers
      minifyWhitespace: process.env.NODE_ENV === 'production', // Hanya whitespace
      format: 'esm',
      // Tree shaking yang lebih aman - tidak terlalu agresif
      treeShaking: false, // PENTING: false untuk memastikan semua code tetap ada
      legalComments: 'none',
      // Preserve semua code dan design
      keepNames: true, // PENTING: keep names agar fungsi tetap bisa dipanggil
      // Suppress CSS warnings for Tailwind classes with decimals
      logOverride: {
        'css-syntax-error': 'silent'
      }
    },
    // Speed up server startup - optimized warmup
    server: {
      warmup: {
        clientFiles: ['./app/app.vue']
      },
      // Optimize dev server performance
      middlewareMode: false,
      preTransformRequests: true,
      fs: {
        strict: false,
        allow: ['.']
      }
    },
    build: { 
      sourcemap: false,
      chunkSizeWarningLimit: 1500,
      cssCodeSplit: true,
      // PENTING: Gunakan terser untuk minify yang lebih aman, atau false untuk development
      minify: process.env.NODE_ENV === 'production' ? 'terser' : false, // Terser lebih aman dari esbuild untuk minify
      // PENTING: Jangan minify CSS terlalu agresif
      cssMinify: false, // CSS minification via postcss/cssnano saja
      // Log level for build process
      logLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
      rollupOptions: {
        onwarn(warning, warn) {
          // Suppress sourcemap warnings
          if (warning.code === 'SOURCEMAP_ERROR' || 
              warning.message?.includes('Sourcemap is likely to be incorrect')) {
            return
          }
          // Suppress chunk size warnings
          if (warning.code === 'CHUNK_SIZE_WARNING') {
            return
          }
          // Suppress CSS warnings about :deep()
          if (warning.message?.includes('deep') || 
              warning.message?.includes('pseudo-class') ||
              warning.message?.includes('pseudo-element')) {
            return
          }
          // Suppress @nuxt/ui module.mjs warnings
          if (warning.message?.includes('@nuxt/ui/dist/module.mjs') ||
              warning.message?.includes('@nuxt/kit')) {
            return
          }
          // Suppress esbuild warnings about @nuxt/vite-builder file:// URL resolution
          if (warning.message?.includes('could not be resolved') && 
              (warning.message?.includes('@nuxt/vite-builder') ||
               warning.message?.includes('vite-node.mjs') ||
               warning.message?.includes('client.manifest.mjs') ||
               warning.message?.includes('treating it as an external dependency'))) {
            return
          }
          // Suppress file:// URL resolution warnings
          if (warning.message?.includes('file://') && 
              warning.message?.includes('could not be resolved')) {
            return
          }
          // Suppress #app-manifest resolution errors (handled by plugin and stub)
          if (warning.message?.includes('#app-manifest') || 
              (warning.message?.includes('Failed to resolve import') && 
               warning.message?.includes('#app-manifest'))) {
            return
          }
          warn(warning)
        },
        external: (id) => {
          // Exclude @nuxt/ui module files from client bundle
          if (id.includes('@nuxt/ui/dist/module.mjs')) {
            return true
          }
          // Handle @nuxt/vite-builder files as external (they're resolved at runtime)
          if (id.includes('@nuxt/vite-builder/dist/runtime/vite-node.mjs') ||
              id.includes('@nuxt/vite-builder/dist/runtime/client.manifest.mjs') ||
              (id.startsWith('file://') && id.includes('@nuxt/vite-builder'))) {
            return true
          }
          return false
        },
        output: {
          experimentalMinChunkSize: 10000,
          sourcemap: false,
          manualChunks: (id) => {
            // Aggressive chunking strategy for better caching
            if (id.includes('node_modules')) {
              // Core framework
              if (id.includes('vue') && !id.includes('@nuxt')) {
                return 'framework'
              }
              // Nuxt framework
              if (id.includes('@nuxt') && !id.includes('@nuxt/ui')) {
                return 'nuxt-framework'
              }
              // Heavy libraries - separate chunks
              if (id.includes('swiper')) {
                return 'swiper'
              }
              if (id.includes('aos')) {
                return 'aos'
              }
              // Icons
              if (id.includes('@iconify') || id.includes('lucide') || id.includes('unplugin-icons')) {
                return 'icons'
              }
              // UI components - split Nuxt UI into separate chunk
              if (id.includes('@nuxt/ui') || id.includes('@headlessui')) {
                return 'ui'
              }
              // Tailwind and CSS utilities
              if (id.includes('tailwind') || id.includes('@tailwindcss')) {
                return 'tailwind'
              }
              // Utils
              if (id.includes('@vueuse') || id.includes('lodash')) {
                return 'utils'
              }
              // i18n related
              if (id.includes('vue-i18n') || id.includes('@intlify')) {
                return 'i18n'
              }
              // Rest of vendors
              return 'vendor'
            }
          }
        }
      }
    },
    optimizeDeps: {
      include: ['vue', '@vue/runtime-core', '@vue/runtime-dom'],
      exclude: ['@intlify/core-base', 'aos', '@nuxt/ui', '@nuxt/ui/dist/module.mjs', 'swiper', 'vue-i18n'],
      esbuildOptions: {
        target: 'es2020',
        define: {
          __VUE_I18N_FULL_INSTALL__: 'true',
          __VUE_I18N_LEGACY_API__: 'false',
          __INTLIFY_PROD_DEVTOOLS__: 'false',
          __INTLIFY_JIT_COMPILATION__: 'false'
        }
      },
      force: true
    },
    worker: {
      format: 'es'
    },
    json: {
      stringify: true
    },
    ssr: { 
      noExternal: ['vue-i18n', '@intlify/core', '@intlify/core-base', '@intlify/shared', '@intlify/message-compiler', '@intlify/devtools-if', '@intlify/vue-devtools', '@intlify/utils'],
      external: ['@nuxt/kit', '@nuxt/ui']
    },
    resolve: { 
      alias: {
        'vue-i18n': require.resolve('vue-i18n/dist/vue-i18n.esm-bundler.js'),
        // Stub to avoid nuxt-simple-sitemap trying to load @nuxt/content server during prerender on some environments
        '#content/server': require.resolve('./server/stubs/content-server-stub.ts'),
        // Handle #app-manifest alias - Nuxt internal alias that may not be available during pre-transform
        '#app-manifest': fileURLToPath(new URL('./server/stubs/app-manifest-stub.ts', import.meta.url)),
        // Fallback shim to avoid Vite resolving error for flag-icons CSS (actual styles are loaded via CDN in app.head.link)
        'flag-icons/css/flag-icons.min.css': flagIconsShimPathNorm,
        'flag-icons/css/flag-icons.css': flagIconsShimPathNorm,
        // Fix alias resolution for app directory
        '~': fileURLToPath(new URL('./', import.meta.url)),
        '@': fileURLToPath(new URL('./', import.meta.url)),
        // Stub @nuxt/kit for client-side to prevent import errors
        '@nuxt/kit': fileURLToPath(new URL('./server/stubs/nuxt-kit-stub.ts', import.meta.url)),
        // Alias @nuxt/ui/dist/module.mjs to prevent it from being bundled in client
        '@nuxt/ui/dist/module.mjs': fileURLToPath(new URL('./server/stubs/nuxt-ui-module-stub.ts', import.meta.url))
      },
      dedupe: ['@nuxt/ui']
    },
    define: {
      __VUE_I18N_FULL_INSTALL__: true,
      __VUE_I18N_LEGACY_API__: false,
      __INTLIFY_PROD_DEVTOOLS__: false,
      __INTLIFY_JIT_COMPILATION__: false
    },
    server: {
      fs: { strict: false },
      host: process.env.HOST || '0.0.0.0',
      strictPort: false,
      hmr: {
        host: process.env.NUXT_HMR_HOST || 'localhost',
        port: parseInt(process.env.NUXT_HMR_PORT || '24679', 10),
        clientPort: parseInt(process.env.NUXT_HMR_CLIENT_PORT || process.env.NUXT_HMR_PORT || '24679', 10),
        protocol: process.env.NUXT_HMR_PROTOCOL || 'ws',
        // Add timeout and retry configuration to handle connection issues
        timeout: 30000,
        overlay: false
      },
      watch: {
        usePolling: process.env.USE_POLLING === 'true',
        interval: parseInt(process.env.POLL_INTERVAL || '1000', 10)
      },
      // Add middleware to handle connection errors gracefully
      middlewareMode: false,
      // Add error handling for connection issues
      cors: true,
      // Disable strict port to allow fallback ports
      strictPort: false
    }
  },

  ssr: true,

  site: { url: 'https://jasapembayaran.com' },

  modules: [
    '@nuxtjs/color-mode',
    '@nuxt/image',
    ['@nuxt/ui', {
      global: false,
      icons: {
        provider: 'iconify',
        preferredAPI: 'local'
      }
    }],
    '@nuxt/fonts',
    ['unplugin-icons/nuxt', { autoInstall: false, scale: 1, compiler: 'vue3' }],
    // Only load heavy modules in production
    ...(process.env.NODE_ENV === 'production' ? [
      ['@nuxtjs/seo', {
        debug: false,
        deferSitemapGeneration: true,
        minimalSetup: true,
        lazy: true,
        ogImage: {
          componentOptions: { global: false },
          lazy: true
        }
      }],
      '@nuxt/scripts',
      ...(hasCrittersModule ? ['nuxt-critters'] : []),
      '@nuxtjs/robots',
      '@nuxtjs/sitemap',
      ...(enablePWA ? [[
        '@vite-pwa/nuxt',
        {
          registerType: 'prompt',
          workbox: {
            clientsClaim: true,
            skipWaiting: true,
            cleanupOutdatedCaches: true,
            navigateFallbackDenylist: [/^\/api\//],
            maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
            globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2}'],
            globIgnores: [
              '**/node_modules/**/*',
              'sw.js',
              'workbox-*.js',
              '**/macbook.svg',
              '**/Cikt8pox.js',
              '**/CYqdmDV6.js'
            ],
            mode: 'production',
            sourcemap: false,
            dontCacheBustURLsMatching: /\.\w{8}\./,
            runtimeCaching: [
              {
                urlPattern: ({ request }) => request.destination === 'image',
                handler: 'CacheFirst',
                options: {
                  cacheName: 'images',
                  expiration: { maxEntries: 200, maxAgeSeconds: 2592000 },
                  cacheableResponse: { statuses: [0, 200] }
                }
              },
              {
                urlPattern: /^https?:\/\/[^/]+\/api\/.*$/,
                handler: 'NetworkFirst',
                options: {
                  cacheName: 'api',
                  networkTimeoutSeconds: 5,
                  expiration: { maxEntries: 50, maxAgeSeconds: 60 },
                  cacheableResponse: { statuses: [0, 200] }
                }
              },
              {
                urlPattern: ({ request }) => request.mode === 'navigate',
                handler: 'NetworkFirst',
                options: {
                  cacheName: 'pages',
                  networkTimeoutSeconds: 3,
                  expiration: { maxEntries: 50, maxAgeSeconds: 86400 },
                  cacheableResponse: { statuses: [0, 200] }
                }
              }
            ]
          },
          manifest: {
            name: 'JasaPembayaran.com',
            short_name: 'JasaPembayaran',
            start_url: '/',
            display: 'standalone',
            background_color: '#ffffff',
            theme_color: '#1D4ED8',
            icons: [{ src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' }]
          },
          devOptions: { enabled: false }
        }
      ]] : [])
    ] : [])
  ],

  critters: {
    // Inline critical CSS and defer the rest
    pruneSource: true,
    preload: 'swap',
    inlineFonts: true,
    compress: true
  },

  plugins: [
    // CRITICAL: Force light mode on first visit (must run before colorMode initialization)
    { src: './plugins/force-light-mode-first-visit.client.ts', mode: 'client' },
    // Core plugins - minimal loading for fast startup
    { src: './plugins/icon-compat.ts' },
    { src: './plugins/uicon-proxy.ts' },
    { src: './plugins/ui-titlebase-global.ts' },
    { src: './plugins/lazyimage-alias.ts' },
    { src: './plugins/sharp-platform-fix.server.ts', mode: 'server' },
    { src: './plugins/sharp-warning-handler.server.ts', mode: 'server' },
    { src: './plugins/vue-i18n-wrapper.js' },
    { src: '@/plugins/fetch-wrapper.ts' },
    
    // Conditional plugins - only in production or when needed, heavily deferred
    ...(process.env.NODE_ENV === 'production' ? [
      { src: './plugins/resource-hints.ts', defer: true },
      { src: './plugins/performance-optimizer.client.ts', mode: 'client', defer: true },
      { src: './plugins/seo-optimizer.ts', defer: true },
      { src: '@/plugins/aos.ts', mode: 'client', defer: true },
      { src: './plugins/visitors.client.ts', mode: 'client', defer: true },
      // SUPER AGRESIF cache busting agar klien tidak pakai data lama
      { src: './plugins/super-aggressive-cache-buster.client.ts', mode: 'client', defer: true }
    ] : []),
    
    // PWA plugin
    ... (enablePWA ? [{ src: './plugins/pwa.client.ts', mode: 'client', defer: true }] : [])
  ],

  css: [
    './app/assets/css/mobile-full-width-force.css', // FORCE FULL WIDTH - LOAD FIRST!
    './app/assets/css/mobile-light-mode.css', // MOBILE LIGHT
    './app/assets/css/mobile-dark-mode.css', // MOBILE DARK
    './app/assets/css/mobile-responsive-v2-final.css', // MOBILE SPACING FIX V2
    './app/assets/css/mobile-header-fix.css', // 📱 MOBILE CLOCK & MENU RESPONSIVE FIX
    './app/assets/css/desktop-responsive.css', // DESKTOP
    './app/assets/css/desktop-banner-spacing.css', // 🎯 DESKTOP BANNER SPACING FIX
    '~/assets/css/main.css',
       // Essential CSS only - reduced for faster initial load
       './app/assets/css/super-keren-design.css',
      './app/assets/css/premium-enhancements.css',
      './app/assets/css/super-keren-floating-buttons.css',
      './app/assets/css/loading-screen-enhancements.css',
      './app/assets/css/blog-super-enhancements.css', // 🚀 NEW: Comprehensive blog enhancements
      './app/assets/css/blog-section-homepage.css', // 🎨 NEW: Blog section homepage styles
      './app/assets/css/dark-mode-burgundy.css', // 🎨 NEW: Burgundy Dark Mode - Super Keren!
      './app/assets/css/dark-mode-burgundy-components.css', // 🎨 NEW: Burgundy Component Styles
      './app/assets/css/dark-mode-index-page.css', // 🌙 NEW: Dark Mode untuk Homepage/Index Page - ALL DEVICES!
      './app/assets/css/dark-mode-complete-overrides.css', // 🌙 COMPLETE: Dark Mode Force Overrides - Semua Komponen!
      './app/assets/css/dark-mode-body-background.css', // 🌙 CRITICAL: Body & Main Background Fix!
      './app/assets/css/dark-mode-ultra-force-override.css', // 🌙 ULTRA: Highest Priority Override!
      './app/assets/css/dark-mode-simple-fix.css', // 🌙 SIMPLE FIX: Super Simple Override!
      './app/assets/css/dark-mode-mega-force.css', // 🌙 MEGA FORCE: ABSOLUTE LAST!
      './app/assets/css/dark-mode-global-fix.css', // 🌙 GLOBAL FIX: Force All Pages Dark!
      './app/assets/css/dark-mode-final-ultra-fix.css', // 🌙 FINAL ULTRA: ABSOLUTE ABSOLUTE LAST!
      './app/assets/css/dark-mode-nuclear-override.css', // ☢️ NUCLEAR: 702 MATCHES - OVERRIDE ALL!
      './app/assets/css/dark-mode-comprehensive-all-components.css', // 📦 COMPREHENSIVE: All Components Fixed!
      './app/assets/css/dark-mode-master-override-all.css', // 👑 MASTER: Ultimate Override - ABSOLUTE FINAL!
      './app/assets/css/remove-red-lines.css',
      // './app/assets/css/blog-cards-professional.css', // File tidak ada, di-comment
      // Defer other CSS to post-load
      ...(process.env.NODE_ENV === 'production' ? [
        '~/assets/css/custom-animations.css',
        '~/assets/css/responsive-fixes.css',
        './app/assets/css/components-enhanced.css',
        './app/assets/css/performance-optimizations.css'
      ] : [])
    ],

  fonts: {
    provider: 'google',
    defaults: {
      weights: [400, 600],
      subsets: ['latin'],
      fallbacks: {
        'sans-serif': ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto']
      }
    },
    providers: {
      bunny: false,
      fontsource: false,
      fontshare: false,
      googleicons: false,
      adobe: false
      // Note: Google Fonts warnings are suppressed via patches in nuxt.config.ts
    },
    families: [
      { name: 'Poppins', provider: 'google', weights: [400, 600], display: 'swap', preload: false },
      { name: 'Inter', provider: 'google', weights: [400], display: 'swap', preload: false }
    ],
    preload: false,
    prefetch: false,
    experimental: {
      processCSSVariables: false
    },
    // Fail gracefully if fonts can't be loaded (common on VPS without internet during build)
    fallback: true
  },

  image: {
    // Disable image optimization completely to avoid sharp warnings
    provider: 'none',
    // Disable sharp completely - set to false to prevent sharp from being loaded
    sharp: false,
    // Additional option to prevent sharp initialization
    providers: {},
    // Suppress all warnings from @nuxt/image - CRITICAL for production
    warnOnMissingSharp: false,
    // Allow remote images for NuxtImg optimization
    domains: [
      'jasapembayaran.com',
      'blog.jasapembayaran.com',
      'blog.jasapembayaran.online',
      'i0.wp.com', 'i1.wp.com', 'i2.wp.com',
      'secure.gravatar.com', 's.w.org',
      'image.pollinations.ai', 'picsum.photos', 'images.unsplash.com'
    ],
    screens: { 
      xs: 320,
      sm: 640, 
      md: 768, 
      lg: 1024, 
      xl: 1280, 
      xxl: 1536 
    },
    quality: 75,
    format: ['webp', 'jpg'],
    // Disable sharp completely to avoid sharp binaries warning
    sharp: false,
    // Enable image preloading
    preload: {
      maxAge: 7200, // 2 hours
      maxSize: 20 // 20 images max
    },
    // Densities for responsive images
    densities: [1, 2],
    // Enable lazy loading by default
    loading: 'lazy',
    // Progressive loading configuration
    placeholder: true,
    placeholderQuality: 10,
    presets: {
      og: { modifiers: { width: 1200, height: 630, fit: 'cover', format: 'webp', quality: 75 } },
      hero: { modifiers: { width: 1600, height: 900, fit: 'cover', format: 'webp', quality: 70 } },
      paypal: { modifiers: { width: 800, height: 600, fit: 'cover', format: 'webp', quality: 80 } },
      thumbnail: { modifiers: { width: 400, height: 300, fit: 'cover', format: 'webp', quality: 70 } }
    },
    // Optimize for Core Web Vitals
    densities: [1, 2],
    placeholder: 10,
    loading: 'lazy'
  },

  app: {
    pageTransition: false,
    layoutTransition: false,
    head: {
      htmlAttrs: { lang: 'id', translate: 'no', class: 'notranslate' },
      title: 'JasaPembayaran.com – Jasa PayPal Terpercaya',
      titleTemplate: '%s | JasaPembayaran.com',
      meta: [
        { charset: 'utf-8' },
        { name: 'google', content: 'notranslate' },
        { 'http-equiv': 'Content-Language', content: 'id-ID' },
        { name: 'description', content: 'Jasa PayPal terpercaya untuk isi saldo, bayar, dan kirim. Melayani BTC, TRC20, dan berbagai layanan digital. Cepat, aman, berpengalaman sejak 2011.' },
        { name: 'keywords', content: 'jasa paypal, jasa paypal terpercaya, jasa bayar paypal, jasa top up paypal, jasa isi saldo paypal, jasa transfer paypal, jasa kirim paypal, jasa deposit paypal, jasa perantara paypal, jasa pembayaran paypal, jasa bayar via paypal, jasa pembayaran via paypal, jasa topup saldo paypal, jasa paypal indonesia, jasa paypal murah, jasa paypal cepat, jasa paypal aman, jasa paypal 24 jam, jasa transfer trc20, jasa transfer btc, jasa bayar btc, jasa bayar trc20, jasa pembayaran online, jasa bayar skrill, jasa transfer skrill, jasa bitcoin, jasa kirim bitcoin, jasa bayar namecheap, jasa isi saldo namecheap, jasa topup saldo namecheap, jasa pembayaran ahrefs, jasa ahrefs, jasa bayar ahrefs, jasa pembayaran luar negeri' },
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
        { name: 'googlebot', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
        { name: 'bingbot', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
        { name: 'author', content: 'JasaPembayaran.com' },
        { name: 'publisher', content: 'JasaPembayaran.com' },
        { name: 'copyright', content: 'JasaPembayaran.com' },
        { name: 'theme-color', content: '#1D4ED8' },
        { name: 'msapplication-TileColor', content: '#1D4ED8' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'JasaPembayaran.com' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'application-name', content: 'JasaPembayaran.com' },
        { property: 'og:title', content: 'Jasa PayPal Terpercaya – JasaPembayaran.com' },
        { property: 'og:description', content: 'Jasa PayPal terpercaya untuk isi saldo, bayar, dan kirim. Melayani BTC, TRC20, dan berbagai layanan digital. Cepat, aman, berpengalaman sejak 2011.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://jasapembayaran.com' },
        { property: 'og:image', content: 'https://jasapembayaran.com/landing-page.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'JasaPembayaran.com - Jasa PayPal Terpercaya' },
        { property: 'og:site_name', content: 'JasaPembayaran.com' },
        { property: 'og:locale', content: 'id_ID' },
        { property: 'og:locale:alternate', content: 'en_US' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Jasa PayPal Terpercaya – JasaPembayaran.com' },
        { name: 'twitter:description', content: 'Jasa PayPal terpercaya untuk isi saldo, bayar, dan kirim. Melayani BTC, TRC20, dan berbagai layanan digital. Cepat, aman, berpengalaman sejak 2011.' },
        { name: 'twitter:image', content: 'https://jasapembayaran.com/landing-page.png' },
        { name: 'twitter:image:alt', content: 'JasaPembayaran.com - Jasa PayPal Terpercaya' },
        { name: 'twitter:site', content: '@jasapembayaran' },
        { name: 'twitter:creator', content: '@jasapembayaran' }
      ],
      link: [
        { rel: 'canonical', href: 'https://jasapembayaran.com' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/flag-icons@6.11.1/css/flag-icons.min.css' },
        // DNS prefetch for external domains
        { rel: 'dns-prefetch', href: '//cdn.jsdelivr.net' },
        { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
        { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
        { rel: 'dns-prefetch', href: '//blog.jasapembayaran.com' },
        // Preconnect to important third-party origins
        { rel: 'preconnect', href: 'https://cdn.jsdelivr.net', crossorigin: 'anonymous' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com', crossorigin: 'anonymous' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        // Preload critical resources only
        { rel: 'preload', href: '/favicon.ico', as: 'image', type: 'image/x-icon' },
        { rel: 'preload', href: '/images/slider/1-1723594725.jpg', as: 'image', fetchpriority: 'high' },
        // Apple touch icons
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#1D4ED8' }
      ]
    }
  },

  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'id',
    locales: [
      { code: 'id', iso: 'id-ID', name: 'Indonesia' },
      { code: 'en', iso: 'en-US', name: 'English' }
    ],
    detectBrowserLanguage: false,
    vueI18n: './i18n.config.ts'
  },

  site: { url: process.env.NUXT_SITE_URL || 'https://jasapembayaran.com' },

  devtools: {
    enabled: false
  },

  // Development server optimization
  devServer: {
    port: process.env.NUXT_DEV_PORT || process.env.PORT || 3000,
    host: process.env.NUXT_DEV_HOST || process.env.HOST || 'localhost',
    https: false
  },

  // Server configuration for production
  nitro: {
    port: process.env.NITRO_PORT || process.env.PORT || 3000,
    host: process.env.NITRO_HOST || process.env.HOST || '0.0.0.0',
    alias: {
      '#content/server': require.resolve('./server/stubs/content-server-stub.ts'),
      'flag-icons/css/flag-icons.min.css': flagIconsShimPathNorm,
      'flag-icons/css/flag-icons.css': flagIconsShimPathNorm
    },
    sourceMap: process.env.NODE_ENV === 'development',
    minify: process.env.NODE_ENV === 'production',
    // Disable asset compression to prevent ENOENT errors on Ubuntu
    compressPublicAssets: false,
    experimental: {
      wasm: false,
      payloadExtraction: false
    },
    // Optimize for production
    timing: false,
    // Enable prerendering for static assets
    prerender: {
      crawlLinks: false,
      failOnError: false
    },
    // Route rules untuk cache control dan fresh content
    routeRules: {
      // Homepage dan halaman utama - selalu fresh
      '/': {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      },
      // API routes - no cache
      '/api/**': {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      },
      // Static assets - short cache with revalidation
      '/_nuxt/**': {
        headers: {
          'Cache-Control': 'public, max-age=300, must-revalidate'
        }
      },
      // Version file - never cache
      '/_app_version.json': {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    }
  },

  // Runtime configuration
  runtimeConfig: {
    public: {
      port: process.env.PORT || 3000,
      host: process.env.HOST || '0.0.0.0'
    }
  },


  mdc: { highlight: { noApiRoute: false } },

  future: { compatibilityVersion: 4 },
  compatibilityDate: '2025-01-15',

  // Optimize icon rendering for faster startup
  icon: {
    serverBundle: process.env.NODE_ENV === 'production' ? 'remote' : 'local',
    clientBundle: 'auto',
    provider: 'iconify',
    fetchTimeout: 500
  },

  // Configure unplugin-icons (Nuxt module: 'unplugin-icons/nuxt')
  icons: {
    // Disable auto-install in dev to speed up startup
    autoInstall: process.env.NODE_ENV === 'production',
    // Use Vue 3 compiler
    compiler: 'vue3',
    // Base scale 1 (= 1em) for consistency
    scale: 1,
    // Reduce collection processing time
    collections: ['lucide', 'mdi', 'heroicons', 'fa-solid', 'simple-icons']
  },

  seo: {
    enabled: process.env.NODE_ENV === 'production',
    experimentalDevOptimization: true,
    cacheTtl: 7200,
    defer: false, // Disable defer for better performance with high memory
    lazyLoad: false, // Disable lazy load for better performance with high memory
    // Ensure dev (and undefined) skip heavy SEO optimizations
    skipOptimizations: process.env.NODE_ENV !== 'production',
    ogImage: {
      enabled: process.env.NODE_ENV === 'production',
      componentEnabled: true, // Enable OG image generation with high memory
      skipProcessing: false, // Enable processing with high memory
      cache: true, // Enable caching for better performance
      // Enhanced OG image configuration
      width: 1200,
      height: 630,
      quality: 80,
      format: 'webp'
    },
    // Enhanced SEO features
    redirectToCanonicalSiteUrl: true, // Enable with high memory
    fallbackTitle: 'JasaPembayaran.com – Jasa PayPal Terpercaya',
    fallbackDescription: 'Jasa PayPal terpercaya untuk isi saldo, bayar, dan kirim. Melayani BTC, TRC20, dan berbagai layanan digital. Cepat, aman, berpengalaman sejak 2011.'
  },

  schemaOrg: {
    identity: {
      '@type': 'LocalBusiness',
      name: 'JasaPembayaran.com',
      url: 'https://jasapembayaran.com',
      logo: 'https://jasapembayaran.com/logos/jasapembayaran.com.webp',
      image: 'https://jasapembayaran.com/landing-page.png',
      sameAs: [
        'https://testimonial.jasapembayaran.id',
        'https://upload.jasapembayaran.com'
      ],
      slogan: 'Jasa PayPal Terpercaya',
      knowsAbout: [
        'Jasa PayPal',
        'Jasa PayPal Terpercaya',
        'Jasa bayar PayPal',
        'Jasa top up PayPal',
        'Jasa isi saldo PayPal',
        'Jasa transfer PayPal',
        'Jasa kirim PayPal',
        'Jasa deposit PayPal',
        'Jasa perantara PayPal',
        'Jasa pembayaran online'
      ],
      makesOffer: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Jasa PayPal',
            serviceType: 'Jasa PayPal'
          },
          areaServed: 'ID',
          url: 'https://jasapembayaran.com'
        }
      ]
    },
    defaultLanguage: 'id-ID'
  },

  robots: {
    enabled: process.env.NODE_ENV === 'production',
    disallow: ['/admin', '/login', '/blog/preview'],
    allow: ['/', '/_nuxt/', '/api/sitemap*', '/api/robots*'],
    sitemap: [
      'https://jasapembayaran.com/sitemap.xml',
      'https://jasapembayaran.com/sitemap-dynamic.xml',
      'https://jasapembayaran.com/sitemap-blog.xml',
      'https://blog.jasapembayaran.com/sitemap_index.xml'
    ],
    debug: false,
    cacheTime: 86400,
    // Optimized rules for better SEO
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/_nuxt/', '/api/sitemap*', '/api/robots*'],
        disallow: ['/admin', '/login', '/blog/preview', '/sw.js', '/workbox-*.js']
      },
      {
        userAgent: 'Googlebot',
        allow: ['/']
      },
      {
        userAgent: 'Bingbot',
        allow: ['/']
      }
    ]
  },

  sitemap: {
    enabled: process.env.NODE_ENV === 'production',
    defaults: {
      priority: 0.7,
      changefreq: 'daily'
    },
    sitemaps: {
      'sitemap-dynamic.xml': {
        defaults: { lastmod: new Date().toISOString() },
        sources: ['/api/sitemap-dynamic']
      },
      'sitemap-blog.xml': {
        defaults: { lastmod: new Date().toISOString() },
        sources: ['/api/sitemap-dynamic']
      }
    },
    urls: [
      { url: '/', priority: 1.0, changefreq: 'daily' },
      { url: '/tentang-kami', priority: 0.9, changefreq: 'weekly' },
      { url: '/testimonials', priority: 0.8, changefreq: 'monthly' },
      { url: '/informasi/transaksi', priority: 0.8, changefreq: 'monthly' },
      { url: '/informasi/rekening', priority: 0.8, changefreq: 'monthly' },
      { url: '/bukti-transaksi', priority: 0.7, changefreq: 'monthly' },
      { url: '/blog', priority: 0.8, changefreq: 'weekly' }
    ],
    xsl: false,
    cacheTtl: 86400,
    runtimeCacheStorage: true, // Enable runtime cache with high memory
    autoLastmod: true, // Enable auto lastmod with high memory
    strictSlashes: false
  },

  // Add buildDir configuration to ensure proper directory creation
  buildDir: process.env.NUXT_BUILD_DIR || '.nuxt',
  output: {
    dir: process.env.NUXT_OUTPUT_DIR || '.output'
  },

  // Sharp library configuration - disabled to avoid warnings
  // Note: This is a duplicate config, main config is above
  image: {
    sharp: false,
    // Set environment variable to suppress sharp warnings
    ...(process.env.SUPPRESS_SHARP_WARNINGS === 'true' ? {} : {})
  },
  
  vite: {
    server: {
      // Increase timeout for development server
      hmr: {
        timeout: 300000 // 5 minutes
      },
      // Optimize for better performance
      watch: {
        usePolling: false,
        interval: 1000
      }
    },
    externals: {
      inline: ['vue-i18n', '@intlify/core-base', '@intlify/shared', '@intlify/message-compiler', '@intlify/devtools-if', '@intlify/vue-devtools', '@intlify/utils'],
      // Add cache-driver to externals to avoid resolution warnings
      external: ['cache-driver']
    },
    alias: {
      'cache-driver': 'unenv/runtime/node/cache-driver'
    },
    define: {
      __VUE_I18N_FULL_INSTALL__: 'true',
      __VUE_I18N_LEGACY_API__: 'false',
      __INTLIFY_PROD_DEVTOOLS__: 'false',
      __INTLIFY_JIT_COMPILATION__: 'false'
    },
    // Optimize build performance
    build: {
      // Disable esbuild CSS minification to avoid warnings with Tailwind classes
      // Use cssnano instead (configured in postcss)
      cssMinify: false,
      rollupOptions: {
        external: (id) => {
          // Exclude ONLY @nuxt/ui/dist/module.mjs from client bundle (not the entire @nuxt/ui)
          if (id.includes('@nuxt/ui/dist/module.mjs') && !id.includes('@nuxt/ui/dist/runtime')) {
            return true
          }
          return false
        },
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router']
            // Removed @nuxt/ui from manualChunks to avoid conflict
          }
        },
        onwarn(warning, warn) {
          // Suppress CSS syntax warnings for Tailwind classes with decimals (e.g., .py-0.5)
          if (warning.code === 'CSS_SYNTAX_ERROR' || (warning.message && warning.message.includes('Unexpected ".5"'))) {
            return
          }
          // Suppress Lightning CSS warnings about Tailwind classes (e.g., grid-cols-2)
          if (warning.message?.includes('is not recognized as a valid pseudo-class')) {
            return
          }
          // Suppress esbuild CSS minify warnings
          if (warning.plugin === 'vite:esbuild' && warning.message?.includes('css-syntax-error')) {
            return
          }
          // Suppress chunk size warnings (all variations)
          if (warning.code === 'PLUGIN_WARNING' || 
              warning.message?.includes('Some chunks are larger') || 
              warning.message?.includes('chunkSizeWarningLimit') ||
              warning.message?.includes('dynamic import()') ||
              warning.message?.includes('manualChunks')) {
            return
          }
          // Suppress esbuild warnings about @nuxt/vite-builder file:// URL resolution
          if (warning.message?.includes('could not be resolved') && 
              (warning.message?.includes('@nuxt/vite-builder') ||
               warning.message?.includes('vite-node.mjs') ||
               warning.message?.includes('client.manifest.mjs') ||
               warning.message?.includes('treating it as an external dependency'))) {
            return
          }
          // Suppress file:// URL resolution warnings
          if (warning.message?.includes('file://') && 
              warning.message?.includes('could not be resolved')) {
            return
          }
          // Suppress warnings about imported but could not be resolved
          if (warning.message?.includes('is imported by') && 
              warning.message?.includes('could not be resolved')) {
            return
          }
          // Suppress #app-manifest resolution errors (handled by plugin and stub)
          if (warning.message?.includes('#app-manifest') || 
              (warning.message?.includes('Failed to resolve import') && 
               warning.message?.includes('#app-manifest')) ||
              (warning.message?.includes('Pre-transform error') && 
               warning.message?.includes('#app-manifest'))) {
            return
          }
          warn(warning)
        }
      },
      // Disable chunk size warnings completely
      chunkSizeWarningLimit: Infinity
    }
  },
  
  typescript: {
    tsConfig: {
      compilerOptions: {
        target: 'ES2020',
        module: 'ES2020'
      }
    }
  },
  
  esbuild: {
    options: {
      target: 'es2020'
    }
  },
  
  serveStatic: process.env.NODE_ENV === 'development' ? false : 'node',
  prerender: false,
  
  storage: {
    redis: {
      driver: 'redis',
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      db: process.env.REDIS_DB || 0
    }
  },
  
  routeRules: {
    // Prevent service worker warnings in development
    '/sw.js': { 
      headers: { 'cache-control': 'no-cache' },
      prerender: false 
    },
    '/workbox-*.js': { 
      headers: { 'cache-control': 'no-cache' },
      prerender: false 
    },
    '/_nuxt/**': {
      headers: { 
        'cache-control': 'public, max-age=31536000, immutable',
        'x-robots-tag': 'noindex, nofollow'
      }
    },
    '/images/**': {
      headers: { 'cache-control': 'public, max-age=2592000, immutable' }
    },
    '/icons/**': {
      headers: { 'cache-control': 'public, max-age=2592000, immutable' }
    },
    '/fonts/**': {
      headers: { 'cache-control': 'public, max-age=31536000, immutable' }
    },
    '/sitemap.xml': {
      headers: { 'cache-control': 'public, max-age=86400, must-revalidate' }
    },
    '/sitemap-dynamic.xml': {
      headers: { 'cache-control': 'public, max-age=86400, must-revalidate' }
    },
    '/robots.txt': {
      headers: { 'cache-control': 'public, max-age=86400, must-revalidate' }
    },
    // Incremental Static Regeneration (ISR) for key pages
    '/': { isr: 600 },
    '/tentang-kami': { isr: 1800 },
    '/testimonials': { isr: 3600 },
    '/informasi/transaksi': { isr: 86400 },
    '/informasi/rekening': { isr: 86400 },
    '/bukti-transaksi': { isr: 86400 },
    '/blog/**': { isr: 900 },
    // API and protected areas: noindex and no-store
    '/api/**': {
      headers: { 
        'cache-control': 'no-store, max-age=0, must-revalidate',
        'x-robots-tag': 'noindex, nofollow'
      },
      prerender: false,
      // Prevent Vue Router from handling API routes
      ssr: false
    },
    // Allow specific API endpoints for SEO
    '/api/sitemap*': {
      headers: { 
        'cache-control': 'public, max-age=3600, must-revalidate',
        'content-type': 'application/xml'
      }
    },
    '/api/robots*': {
      headers: { 
        'cache-control': 'public, max-age=3600, must-revalidate',
        'content-type': 'text/plain'
      }
    },
    '/login': {
      headers: { 'x-robots-tag': 'noindex, nofollow' }
    },
    '/admin/**': {
      headers: { 'x-robots-tag': 'noindex, nofollow' }
    },
    '/blog/preview/**': {
      headers: { 'x-robots-tag': 'noindex, nofollow' }
    },
    '/**': {
      headers: { 
        'cache-control': 'no-store, no-cache, must-revalidate, max-age=0', 
        'pragma': 'no-cache',
        'expires': '0',
        'vary': 'Save-Data, Downlink, ECT', 
        'Accept-CH': 'Downlink, ECT',
        // Security headers
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        // Performance headers
        'X-DNS-Prefetch-Control': 'on',
        'X-Download-Options': 'noopen',
        // Force fresh content
        'Last-Modified': new Date().toUTCString()
      }
    }
  }
})

