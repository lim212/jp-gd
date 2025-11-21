// plugins/popup-ab-testing.client.ts
// A/B testing system for popup design and behavior optimization

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  // Prevent multiple initializations
  if ((window as any).__jpPopupABTestingInitialized) return
  ;(window as any).__jpPopupABTestingInitialized = true

  class PopupABTestingSystem {
    private experiments: Record<string, any> = {}
    private userVariants: Record<string, string> = {}
    private testResults: Record<string, any> = {}

    constructor() {
      this.initializeExperiments()
      this.loadUserVariants()
      this.initializeTesting()
    }

    private initializeExperiments() {
      // Experiment 1: Popup Design
      this.experiments.popupDesign = {
        name: 'Popup Design Optimization',
        description: 'Test different popup designs for better conversion',
        variants: {
          A: {
            name: 'Default Design',
            description: 'Current popup design with gradient background',
            config: {
              background: 'linear-gradient(135deg, #22c55e, #06b6d4)',
              borderRadius: '24px',
              animation: 'jp-pop',
              buttonStyle: 'gradient'
            }
          },
          B: {
            name: 'Minimal Design',
            description: 'Clean minimal design with subtle shadows',
            config: {
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '16px',
              animation: 'jp-fade',
              buttonStyle: 'solid'
            }
          },
          C: {
            name: 'Dark Design',
            description: 'Dark theme with neon accents',
            config: {
              background: 'linear-gradient(135deg, #1e293b, #334155)',
              borderRadius: '20px',
              animation: 'jp-slide',
              buttonStyle: 'neon'
            }
          }
        },
        trafficAllocation: {
          A: 0.4, // 40%
          B: 0.3, // 30%
          C: 0.3  // 30%
        }
      }

      // Experiment 2: Button Text
      this.experiments.buttonText = {
        name: 'Button Text Optimization',
        description: 'Test different button text for better click-through rates',
        variants: {
          A: {
            name: 'Current Text',
            description: 'Current button text',
            config: {
              text: '🔄 Perbarui Sekarang',
              color: '#ffffff'
            }
          },
          B: {
            name: 'Action-Oriented',
            description: 'More action-oriented text',
            config: {
              text: '🚀 Update & Reload',
              color: '#ffffff'
            }
          },
          C: {
            name: 'Benefit-Focused',
            description: 'Text focusing on benefits',
            config: {
              text: '✨ Dapatkan Fitur Baru',
              color: '#ffffff'
            }
          }
        },
        trafficAllocation: {
          A: 0.33,
          B: 0.33,
          C: 0.34
        }
      }

      // Experiment 3: Countdown Duration
      this.experiments.countdownDuration = {
        name: 'Countdown Duration Optimization',
        description: 'Test different countdown durations for better user experience',
        variants: {
          A: {
            name: 'Current Duration',
            description: 'Current 25-second countdown',
            config: {
              duration: 25,
              autoTrigger: true
            }
          },
          B: {
            name: 'Shorter Duration',
            description: '15-second countdown for faster updates',
            config: {
              duration: 15,
              autoTrigger: true
            }
          },
          C: {
            name: 'Longer Duration',
            description: '35-second countdown for more user control',
            config: {
              duration: 35,
              autoTrigger: true
            }
          }
        },
        trafficAllocation: {
          A: 0.4,
          B: 0.3,
          C: 0.3
        }
      }
    }

    private loadUserVariants() {
      try {
        const stored = localStorage.getItem('jp-ab-testing-variants')
        if (stored) {
          this.userVariants = JSON.parse(stored)
        }
      } catch (error) {
        console.warn('Failed to load A/B testing variants:', error)
      }

      try {
        const stored = localStorage.getItem('jp-ab-testing-results')
        if (stored) {
          this.testResults = JSON.parse(stored)
        }
      } catch (error) {
        console.warn('Failed to load A/B testing results:', error)
      }
    }

    private saveUserVariants() {
      try {
        localStorage.setItem('jp-ab-testing-variants', JSON.stringify(this.userVariants))
      } catch (error) {
        console.warn('Failed to save A/B testing variants:', error)
      }
    }

    private saveTestResults() {
      try {
        localStorage.setItem('jp-ab-testing-results', JSON.stringify(this.testResults))
      } catch (error) {
        console.warn('Failed to save A/B testing results:', error)
      }
    }

    private initializeTesting() {
      // Assign variants for new users
      Object.keys(this.experiments).forEach(experimentId => {
        if (!this.userVariants[experimentId]) {
          this.userVariants[experimentId] = this.assignVariant(experimentId)
        }
      })

      this.saveUserVariants()
    }

    private assignVariant(experimentId: string): string {
      const experiment = this.experiments[experimentId]
      const random = Math.random()
      let cumulative = 0

      for (const [variantId, allocation] of Object.entries(experiment.trafficAllocation)) {
        cumulative += allocation
        if (random <= cumulative) {
          console.log(`🧪 A/B Test: Assigned variant ${variantId} for experiment ${experimentId}`)
          return variantId
        }
      }

      // Fallback to first variant
      return Object.keys(experiment.variants)[0]
    }

    // Public methods
    getVariant(experimentId: string): string {
      return this.userVariants[experimentId] || 'A'
    }

    getVariantConfig(experimentId: string): any {
      const variantId = this.getVariant(experimentId)
      const experiment = this.experiments[experimentId]
      return experiment?.variants[variantId]?.config || null
    }

    trackEvent(experimentId: string, event: string, data?: any) {
      if (!this.testResults[experimentId]) {
        this.testResults[experimentId] = {
          variant: this.getVariant(experimentId),
          events: {},
          startTime: Date.now()
        }
      }

      if (!this.testResults[experimentId].events[event]) {
        this.testResults[experimentId].events[event] = []
      }

      this.testResults[experimentId].events[event].push({
        timestamp: Date.now(),
        data: data || {}
      })

      this.saveTestResults()

      console.log(`🧪 A/B Test Event: ${experimentId}.${event}`, {
        variant: this.getVariant(experimentId),
        data
      })
    }

    getExperimentResults(experimentId: string) {
      return this.testResults[experimentId] || null
    }

    getAllResults() {
      return this.testResults
    }

    // Apply A/B test configurations to popup
    applyPopupConfig() {
      const designConfig = this.getVariantConfig('popupDesign')
      const buttonConfig = this.getVariantConfig('buttonText')
      const countdownConfig = this.getVariantConfig('countdownDuration')

      // Store configurations globally for popup system to use
      ;(window as any).jpABTestConfig = {
        design: designConfig,
        button: buttonConfig,
        countdown: countdownConfig
      }

      console.log('🧪 A/B Test configurations applied:', {
        design: this.getVariant('popupDesign'),
        button: this.getVariant('buttonText'),
        countdown: this.getVariant('countdownDuration')
      })
    }

    // Create A/B test dashboard
    createDashboard() {
      const dashboard = document.createElement('div')
      dashboard.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: rgba(255,255,255,0.95);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(226,232,240,0.8);
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        z-index: 2147483646;
        max-width: 400px;
        max-height: 80vh;
        overflow-y: auto;
        animation: slideInLeft 0.3s ease-out;
      `

      dashboard.innerHTML = `
        <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 16px;">
          <h3 style="margin: 0; color: #1e293b; font-size: 18px;">🧪 A/B Testing Dashboard</h3>
          <button onclick="this.parentElement.parentElement.remove();" style="
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #64748b;
          ">×</button>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 16px;">
          ${Object.keys(this.experiments).map(experimentId => {
            const experiment = this.experiments[experimentId]
            const variant = this.getVariant(experimentId)
            const results = this.getExperimentResults(experimentId)
            
            return `
              <div style="border: 1px solid rgba(226,232,240,0.8); border-radius: 8px; padding: 12px;">
                <div style="font-weight: 600; margin-bottom: 8px; color: #1e293b;">${experiment.name}</div>
                <div style="font-size: 12px; color: #64748b; margin-bottom: 8px;">${experiment.description}</div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 12px; color: #64748b;">Variant:</span>
                  <span style="font-weight: 600; color: #3b82f6;">${variant}</span>
                  <span style="font-size: 12px; color: #64748b;">(${experiment.variants[variant].name})</span>
                </div>
                ${results ? `
                  <div style="margin-top: 8px; font-size: 12px; color: #64748b;">
                    Events: ${Object.keys(results.events).length}
                  </div>
                ` : ''}
              </div>
            `
          }).join('')}
        </div>
        
        <div style="margin-top: 16px; display: flex; gap: 8px;">
          <button onclick="window.jpABTesting.exportResults();" style="
            flex: 1;
            padding: 8px 12px;
            border: 1px solid rgba(59,130,246,0.3);
            border-radius: 6px;
            background: rgba(59,130,246,0.1);
            color: #3b82f6;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
          ">Export Results</button>
          <button onclick="window.jpABTesting.resetTests();" style="
            flex: 1;
            padding: 8px 12px;
            border: 1px solid rgba(239,68,68,0.3);
            border-radius: 6px;
            background: rgba(239,68,68,0.1);
            color: #ef4444;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
          ">Reset Tests</button>
        </div>
      `

      // Add CSS animation
      if (!document.querySelector('#jp-ab-testing-styles')) {
        const style = document.createElement('style')
        style.id = 'jp-ab-testing-styles'
        style.textContent = `
          @keyframes slideInLeft {
            from { transform: translateX(-100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `
        document.head.appendChild(style)
      }

      document.body.appendChild(dashboard)
      return dashboard
    }

    exportResults() {
      const data = {
        userVariants: this.userVariants,
        testResults: this.testResults,
        experiments: this.experiments,
        exportTime: new Date().toISOString()
      }

      const dataStr = JSON.stringify(data, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      
      const link = document.createElement('a')
      link.href = URL.createObjectURL(dataBlob)
      link.download = `ab-testing-results-${new Date().toISOString().split('T')[0]}.json`
      link.click()

      console.log('🧪 A/B Testing results exported')
    }

    resetTests() {
      this.userVariants = {}
      this.testResults = {}
      this.initializeTesting()
      this.saveUserVariants()
      this.saveTestResults()

      console.log('🧪 A/B Testing reset - new variants assigned')

      if ((window as any).jpNotify) {
        ;(window as any).jpNotify.success(
          'A/B Tests Reset',
          'Semua test telah direset dan variant baru telah ditetapkan.',
          3000
        )
      }
    }
  }

  // Initialize A/B testing system
  const abTestingSystem = new PopupABTestingSystem()
  ;(window as any).jpABTesting = abTestingSystem

  // Apply A/B test configurations
  abTestingSystem.applyPopupConfig()

  // Add global methods
  ;(window as any).jpABTesting = {
    getVariant: (experimentId: string) => abTestingSystem.getVariant(experimentId),
    getVariantConfig: (experimentId: string) => abTestingSystem.getVariantConfig(experimentId),
    trackEvent: (experimentId: string, event: string, data?: any) => abTestingSystem.trackEvent(experimentId, event, data),
    getResults: (experimentId: string) => abTestingSystem.getExperimentResults(experimentId),
    getAllResults: () => abTestingSystem.getAllResults(),
    showDashboard: () => abTestingSystem.createDashboard(),
    exportResults: () => abTestingSystem.exportResults(),
    resetTests: () => abTestingSystem.resetTests()
  }

  console.log('🧪 A/B Testing System initialized:', {
    experiments: Object.keys(abTestingSystem.experiments).length,
    userVariants: abTestingSystem.userVariants,
    config: (window as any).jpABTestConfig
  })
})
