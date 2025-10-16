"use client"

export interface NotificationConfig {
  enableSound: boolean
  enableDesktop: boolean
  enableEmail: boolean
  criticalOnly: boolean
  quietHours: {
    enabled: boolean
    start: string
    end: string
  }
}

export interface CampusNotification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "error" | "success"
  timestamp: Date
  read: boolean
  actionUrl?: string
}

class NotificationService {
  private config: NotificationConfig = {
    enableSound: true,
    enableDesktop: true,
    enableEmail: false,
    criticalOnly: false,
    quietHours: {
      enabled: false,
      start: "22:00",
      end: "08:00",
    },
  }

  private notifications: CampusNotification[] = []
  private listeners: ((notifications: CampusNotification[]) => void)[] = []

  constructor() {
    // Request desktop notification permission
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission()
      }
    }

    // Load config from localStorage
    this.loadConfig()
  }

  private loadConfig() {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("campus-notification-config")
      if (saved) {
        this.config = { ...this.config, ...JSON.parse(saved) }
      }
    }
  }

  private saveConfig() {
    if (typeof window !== "undefined") {
      localStorage.setItem("campus-notification-config", JSON.stringify(this.config))
    }
  }

  private isQuietHours(): boolean {
    if (!this.config.quietHours.enabled) return false

    const now = new Date()
    const currentTime = now.getHours() * 100 + now.getMinutes()
    const startTime = Number.parseInt(this.config.quietHours.start.replace(":", ""))
    const endTime = Number.parseInt(this.config.quietHours.end.replace(":", ""))

    if (startTime > endTime) {
      // Quiet hours span midnight
      return currentTime >= startTime || currentTime <= endTime
    } else {
      return currentTime >= startTime && currentTime <= endTime
    }
  }

  private playNotificationSound() {
    if (!this.config.enableSound || this.isQuietHours()) return

    // Create a simple notification sound using Web Audio API
    if (typeof window !== "undefined" && "AudioContext" in window) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
      } catch (error) {
        console.warn("Could not play notification sound:", error)
      }
    }
  }

  private showDesktopNotification(notification: CampusNotification) {
    if (!this.config.enableDesktop || this.isQuietHours()) return
    if (typeof window === "undefined" || !("Notification" in window)) return
    if (Notification.permission !== "granted") return

    const desktopNotification = new Notification(notification.title, {
      body: notification.message,
      icon: "/favicon.ico",
      tag: notification.id,
      requireInteraction: notification.type === "error",
    })

    desktopNotification.onclick = () => {
      window.focus()
      if (notification.actionUrl) {
        window.location.href = notification.actionUrl
      }
      desktopNotification.close()
    }

    // Auto-close after 5 seconds for non-critical notifications
    if (notification.type !== "error") {
      setTimeout(() => desktopNotification.close(), 5000)
    }
  }

  public addNotification(notification: Omit<CampusNotification, "id" | "timestamp" | "read">) {
    const newNotification: CampusNotification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
    }

    // Check if we should show this notification based on config
    if (this.config.criticalOnly && notification.type !== "error") {
      return
    }

    this.notifications.unshift(newNotification)

    // Keep only last 100 notifications
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100)
    }

    // Trigger notifications
    this.playNotificationSound()
    this.showDesktopNotification(newNotification)

    // Notify listeners
    this.notifyListeners()

    return newNotification.id
  }

  public markAsRead(notificationId: string) {
    const notification = this.notifications.find((n) => n.id === notificationId)
    if (notification) {
      notification.read = true
      this.notifyListeners()
    }
  }

  public markAllAsRead() {
    this.notifications.forEach((n) => (n.read = true))
    this.notifyListeners()
  }

  public removeNotification(notificationId: string) {
    this.notifications = this.notifications.filter((n) => n.id !== notificationId)
    this.notifyListeners()
  }

  public clearAll() {
    this.notifications = []
    this.notifyListeners()
  }

  public getNotifications(): CampusNotification[] {
    return [...this.notifications]
  }

  public getUnreadCount(): number {
    return this.notifications.filter((n) => !n.read).length
  }

  public subscribe(listener: (notifications: CampusNotification[]) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener([...this.notifications]))
  }

  public updateConfig(newConfig: Partial<NotificationConfig>) {
    this.config = { ...this.config, ...newConfig }
    this.saveConfig()
  }

  public getConfig(): NotificationConfig {
    return { ...this.config }
  }

  // Simulate real-time campus alerts
  public startSimulation() {
    const alertTypes = [
      {
        type: "warning" as const,
        title: "Energy Spike Detected",
        message: "Building A showing 25% increase in power consumption",
      },
      {
        type: "info" as const,
        title: "Maintenance Scheduled",
        message: "HVAC system maintenance planned for tomorrow 2 AM",
      },
      {
        type: "error" as const,
        title: "Security Alert",
        message: "Unauthorized access attempt at Lab Building entrance",
      },
      {
        type: "success" as const,
        title: "System Optimized",
        message: "AI agent successfully optimized energy distribution",
      },
      {
        type: "warning" as const,
        title: "Sensor Offline",
        message: "Temperature sensor in Room 204 is not responding",
      },
    ]

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% chance every interval
        const alert = alertTypes[Math.floor(Math.random() * alertTypes.length)]
        this.addNotification(alert)
      }
    }, 15000) // Every 15 seconds

    return () => clearInterval(interval)
  }
}

// Export singleton instance
export const notificationService = new NotificationService()
