// plugins/push-notification-update.client.ts
// Push notification system for proactive update notifications

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  // Prevent multiple initializations
  if ((window as any).__jpPushNotificationInitialized) return
  ;(window as any).__jpPushNotificationInitialized = true

  class PushNotificationUpdateSystem {
    private registration: ServiceWorkerRegistration | null = null
    private isSupported = false
    private permissionStatus: NotificationPermission = 'default'

    constructor() {
      this.initializePushNotifications()
    }

    private async initializePushNotifications() {
      // Check if push notifications are supported
      if (!('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.log('🔔 Push notifications not supported in this browser')
        return
      }

      this.isSupported = true
      this.permissionStatus = Notification.permission

      // Request permission if not granted
      if (this.permissionStatus === 'default') {
        await this.requestPermission()
      }

      // Register service worker for push notifications
      if (this.permissionStatus === 'granted') {
        await this.registerServiceWorker()
      }
    }

    private async requestPermission(): Promise<boolean> {
      try {
        this.permissionStatus = await Notification.requestPermission()
        
        if (this.permissionStatus === 'granted') {
          console.log('🔔 Push notification permission granted')
          
          // Show success notification
          if ((window as any).jpNotify) {
            ;(window as any).jpNotify.success(
              'Notifikasi Diaktifkan',
              'Anda akan menerima notifikasi saat ada pembaruan website.',
              5000
            )
          }
          
          return true
        } else {
          console.log('🔔 Push notification permission denied')
          
          // Show info notification
          if ((window as any).jpNotify) {
            ;(window as any).jpNotify.info(
              'Notifikasi Tidak Diaktifkan',
              'Anda dapat mengaktifkan notifikasi di pengaturan browser untuk mendapatkan pemberitahuan update.',
              8000
            )
          }
          
          return false
        }
      } catch (error) {
        console.warn('Failed to request notification permission:', error)
        return false
      }
    }

    private async registerServiceWorker(): Promise<void> {
      try {
        this.registration = await navigator.serviceWorker.register('/sw-push.js', {
          scope: '/'
        })

        console.log('🔔 Service worker registered for push notifications:', this.registration.scope)

        // Listen for service worker updates
        this.registration.addEventListener('updatefound', () => {
          const newWorker = this.registration!.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('🔔 New service worker installed, showing update notification')
                this.showUpdateNotification()
              }
            })
          }
        })

      } catch (error) {
        console.warn('Failed to register service worker for push notifications:', error)
      }
    }

    async showUpdateNotification(): Promise<void> {
      if (!this.isSupported || this.permissionStatus !== 'granted') {
        return
      }

      try {
        const notification = new Notification('🚀 Website Diperbarui!', {
          body: 'Klik untuk memuat versi terbaru dengan fitur dan perbaikan baru.',
          icon: '/favicon-32x32.png',
          badge: '/favicon-16x16.png',
          tag: 'website-update',
          requireInteraction: true,
          actions: [
            {
              action: 'update',
              title: '🔄 Perbarui Sekarang',
              icon: '/favicon-16x16.png'
            },
            {
              action: 'later',
              title: '⏰ Nanti Saja',
              icon: '/favicon-16x16.png'
            }
          ]
        })

        // Handle notification click
        notification.onclick = () => {
          window.focus()
          notification.close()
          
          // Trigger popup reload system
          if ((window as any).jpForceReload) {
            ;(window as any).jpForceReload({
              clearCache: true,
              showNotification: true,
              delay: 500
            })
          } else {
            window.location.reload()
          }
        }

        // Handle notification actions
        notification.addEventListener('action', (event) => {
          if (event.action === 'update') {
            window.focus()
            notification.close()
            
            // Trigger popup reload system
            if ((window as any).jpForceReload) {
              ;(window as any).jpForceReload({
                clearCache: true,
                showNotification: true,
                delay: 500
              })
            } else {
              window.location.reload()
            }
          } else if (event.action === 'later') {
            notification.close()
            
            // Show reminder notification after 5 minutes
            setTimeout(() => {
              this.showReminderNotification()
            }, 5 * 60 * 1000)
          }
        })

        // Auto-close after 30 seconds
        setTimeout(() => {
          notification.close()
        }, 30000)

      } catch (error) {
        console.warn('Failed to show push notification:', error)
      }
    }

    private showReminderNotification(): void {
      if (!this.isSupported || this.permissionStatus !== 'granted') {
        return
      }

      try {
        const notification = new Notification('⏰ Peringatan Update', {
          body: 'Website masih menunggu untuk diperbarui. Klik untuk memuat versi terbaru.',
          icon: '/favicon-32x32.png',
          tag: 'update-reminder',
          requireInteraction: false
        })

        notification.onclick = () => {
          window.focus()
          notification.close()
          window.location.reload()
        }

        // Auto-close after 15 seconds
        setTimeout(() => {
          notification.close()
        }, 15000)

      } catch (error) {
        console.warn('Failed to show reminder notification:', error)
      }
    }

    // Method to manually trigger update notification
    async triggerUpdateNotification(): Promise<void> {
      await this.showUpdateNotification()
    }

    // Check if push notifications are available
    isAvailable(): boolean {
      return this.isSupported && this.permissionStatus === 'granted'
    }

    // Get permission status
    getPermissionStatus(): NotificationPermission {
      return this.permissionStatus
    }

    // Request permission manually
    async requestPermissionManually(): Promise<boolean> {
      return await this.requestPermission()
    }
  }

  // Initialize push notification system
  const pushNotificationSystem = new PushNotificationUpdateSystem()
  ;(window as any).jpPushNotifications = pushNotificationSystem

  // Integrate with existing popup system
  if ((window as any).jpPopupController) {
    const originalCanShowPopup = (window as any).jpPopupController.canShowPopup.bind((window as any).jpPopupController)
    
    ;(window as any).jpPopupController.canShowPopup = function() {
      const canShow = originalCanShowPopup()
      
      // If popup is blocked but push notifications are available, use push notification
      if (!canShow && pushNotificationSystem.isAvailable()) {
        console.log('🔔 Using push notification instead of popup')
        pushNotificationSystem.triggerUpdateNotification()
        return false // Don't show popup, use push notification instead
      }
      
      return canShow
    }
  }

  // Show permission request after 10 seconds if not granted
  setTimeout(() => {
    if (!pushNotificationSystem.isAvailable() && pushNotificationSystem.getPermissionStatus() === 'default') {
      if ((window as any).jpNotify) {
        ;(window as any).jpNotify.info(
          'Aktifkan Notifikasi',
          'Aktifkan notifikasi untuk mendapatkan pemberitahuan update website secara real-time.',
          10000
        )
      }
    }
  }, 10000)

  console.log('🔔 Push Notification Update System initialized:', {
    supported: pushNotificationSystem.isAvailable(),
    permission: pushNotificationSystem.getPermissionStatus()
  })
})
