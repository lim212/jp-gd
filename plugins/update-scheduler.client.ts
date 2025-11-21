// plugins/update-scheduler.client.ts
// Scheduler system for planned updates and maintenance windows

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  // Prevent multiple initializations
  if ((window as any).__jpUpdateSchedulerInitialized) return
  ;(window as any).__jpUpdateSchedulerInitialized = true

  class UpdateSchedulerSystem {
    private scheduledUpdates: any[] = []
    private maintenanceWindows: any[] = []
    private isMaintenanceMode = false
    private schedulerInterval: number | null = null

    constructor() {
      this.loadScheduledUpdates()
      this.initializeScheduler()
    }

    private loadScheduledUpdates() {
      try {
        const stored = localStorage.getItem('jp-scheduled-updates')
        if (stored) {
          this.scheduledUpdates = JSON.parse(stored)
        }
      } catch (error) {
        console.warn('Failed to load scheduled updates:', error)
      }

      try {
        const stored = localStorage.getItem('jp-maintenance-windows')
        if (stored) {
          this.maintenanceWindows = JSON.parse(stored)
        }
      } catch (error) {
        console.warn('Failed to load maintenance windows:', error)
      }
    }

    private saveScheduledUpdates() {
      try {
        localStorage.setItem('jp-scheduled-updates', JSON.stringify(this.scheduledUpdates))
      } catch (error) {
        console.warn('Failed to save scheduled updates:', error)
      }
    }

    private saveMaintenanceWindows() {
      try {
        localStorage.setItem('jp-maintenance-windows', JSON.stringify(this.maintenanceWindows))
      } catch (error) {
        console.warn('Failed to save maintenance windows:', error)
      }
    }

    private initializeScheduler() {
      // Check for scheduled updates every minute
      this.schedulerInterval = window.setInterval(() => {
        this.checkScheduledUpdates()
        this.checkMaintenanceWindows()
      }, 60000)

      // Check immediately
      this.checkScheduledUpdates()
      this.checkMaintenanceWindows()
    }

    private checkScheduledUpdates() {
      const now = Date.now()
      
      this.scheduledUpdates = this.scheduledUpdates.filter(update => {
        if (update.scheduledTime <= now && !update.executed) {
          this.executeScheduledUpdate(update)
          return false // Remove executed update
        }
        return true
      })

      this.saveScheduledUpdates()
    }

    private checkMaintenanceWindows() {
      const now = Date.now()
      
      this.maintenanceWindows.forEach(window => {
        if (now >= window.startTime && now <= window.endTime && !window.notified) {
          this.showMaintenanceNotification(window)
          window.notified = true
        }
      })

      this.saveMaintenanceWindows()
    }

    private executeScheduledUpdate(update: any) {
      console.log('⏰ Executing scheduled update:', update)
      
      // Show scheduled update notification
      this.showScheduledUpdateNotification(update)
      
      // Mark as executed
      update.executed = true
      update.executedAt = Date.now()
    }

    private showScheduledUpdateNotification(update: any) {
      const notification = document.createElement('div')
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #f59e0b, #ef4444);
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        z-index: 2147483647;
        max-width: 350px;
        animation: slideInRight 0.3s ease-out;
      `

      notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
          <span style="font-size: 20px;">⏰</span>
          <span style="font-weight: 600; font-size: 16px;">Update Terjadwal</span>
        </div>
        <div style="font-size: 14px; margin-bottom: 12px; opacity: 0.9;">
          ${update.message || 'Update terjadwal telah tiba. Klik untuk memuat versi terbaru.'}
        </div>
        <div style="display: flex; gap: 8px;">
          <button onclick="this.parentElement.parentElement.remove(); window.location.reload();" style="
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            flex: 1;
          ">
            🔄 Update Sekarang
          </button>
          <button onclick="this.parentElement.parentElement.remove();" style="
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            color: white;
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
          ">
            ⏰ Nanti
          </button>
        </div>
      `

      // Add CSS animation
      if (!document.querySelector('#jp-scheduler-styles')) {
        const style = document.createElement('style')
        style.id = 'jp-scheduler-styles'
        style.textContent = `
          @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `
        document.head.appendChild(style)
      }

      document.body.appendChild(notification)

      // Auto-remove after 30 seconds
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 30000)
    }

    private showMaintenanceNotification(maintenanceWindow: any) {
      const notification = document.createElement('div')
      notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        z-index: 2147483647;
        text-align: center;
        animation: slideUp 0.3s ease-out;
      `

      const endTime = new Date(maintenanceWindow.endTime).toLocaleString()
      
      notification.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 8px;">
          <span style="font-size: 20px;">🔧</span>
          <span style="font-weight: 600; font-size: 16px;">Maintenance Window</span>
        </div>
        <div style="font-size: 14px; margin-bottom: 8px; opacity: 0.9;">
          ${maintenanceWindow.message || 'Website sedang dalam mode maintenance.'}
        </div>
        <div style="font-size: 12px; opacity: 0.8;">
          Selesai pada: ${endTime}
        </div>
      `

      // Add CSS animation
      if (!document.querySelector('#jp-scheduler-styles')) {
        const style = document.createElement('style')
        style.id = 'jp-scheduler-styles'
        style.textContent = `
          @keyframes slideUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `
        document.head.appendChild(style)
      }

      document.body.appendChild(notification)

      // Auto-remove when maintenance window ends
      const remainingTime = maintenanceWindow.endTime - Date.now()
      if (remainingTime > 0) {
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification)
          }
        }, remainingTime)
      }
    }

    // Public methods
    scheduleUpdate(scheduledTime: number, message?: string) {
      const update = {
        id: Date.now().toString(),
        scheduledTime,
        message: message || 'Update terjadwal telah tiba.',
        created: Date.now(),
        executed: false
      }

      this.scheduledUpdates.push(update)
      this.saveScheduledUpdates()

      console.log('⏰ Update scheduled:', update)
      return update.id
    }

    scheduleUpdateIn(minutes: number, message?: string) {
      const scheduledTime = Date.now() + (minutes * 60 * 1000)
      return this.scheduleUpdate(scheduledTime, message)
    }

    cancelScheduledUpdate(updateId: string) {
      this.scheduledUpdates = this.scheduledUpdates.filter(update => update.id !== updateId)
      this.saveScheduledUpdates()
      console.log('⏰ Scheduled update cancelled:', updateId)
    }

    addMaintenanceWindow(startTime: number, endTime: number, message?: string) {
      const window = {
        id: Date.now().toString(),
        startTime,
        endTime,
        message: message || 'Website sedang dalam mode maintenance.',
        notified: false
      }

      this.maintenanceWindows.push(window)
      this.saveMaintenanceWindows()

      console.log('🔧 Maintenance window added:', window)
      return window.id
    }

    removeMaintenanceWindow(windowId: string) {
      this.maintenanceWindows = this.maintenanceWindows.filter(window => window.id !== windowId)
      this.saveMaintenanceWindows()
      console.log('🔧 Maintenance window removed:', windowId)
    }

    getScheduledUpdates() {
      return this.scheduledUpdates.filter(update => !update.executed)
    }

    getMaintenanceWindows() {
      return this.maintenanceWindows
    }

    isInMaintenanceMode(): boolean {
      const now = Date.now()
      return this.maintenanceWindows.some(window => 
        now >= window.startTime && now <= window.endTime
      )
    }

    // Cleanup
    destroy() {
      if (this.schedulerInterval) {
        clearInterval(this.schedulerInterval)
        this.schedulerInterval = null
      }
    }
  }

  // Initialize scheduler system
  const schedulerSystem = new UpdateSchedulerSystem()
  ;(window as any).jpUpdateScheduler = schedulerSystem

  // Integrate with existing systems
  if ((window as any).jpPopupController) {
    const originalCanShowPopup = (window as any).jpPopupController.canShowPopup.bind((window as any).jpPopupController)
    
    ;(window as any).jpPopupController.canShowPopup = function() {
      const canShow = originalCanShowPopup()
      
      // Don't show popup during maintenance
      if (schedulerSystem.isInMaintenanceMode()) {
        console.log('🔧 Maintenance mode active - popup blocked')
        return false
      }
      
      return canShow
    }
  }

  // Add global methods for manual scheduling
  ;(window as any).jpScheduler = {
    scheduleUpdate: (time: number, message?: string) => schedulerSystem.scheduleUpdate(time, message),
    scheduleUpdateIn: (minutes: number, message?: string) => schedulerSystem.scheduleUpdateIn(minutes, message),
    cancelUpdate: (id: string) => schedulerSystem.cancelScheduledUpdate(id),
    addMaintenance: (start: number, end: number, message?: string) => schedulerSystem.addMaintenanceWindow(start, end, message),
    removeMaintenance: (id: string) => schedulerSystem.removeMaintenanceWindow(id),
    getScheduled: () => schedulerSystem.getScheduledUpdates(),
    getMaintenance: () => schedulerSystem.getMaintenanceWindows(),
    isMaintenance: () => schedulerSystem.isInMaintenanceMode()
  }

  // Example: Schedule an update in 5 minutes (for testing)
  // schedulerSystem.scheduleUpdateIn(5, 'Update test terjadwal dalam 5 menit')

  console.log('⏰ Update Scheduler System initialized:', {
    scheduledUpdates: schedulerSystem.getScheduledUpdates().length,
    maintenanceWindows: schedulerSystem.getMaintenanceWindows().length,
    isMaintenanceMode: schedulerSystem.isInMaintenanceMode()
  })
})
