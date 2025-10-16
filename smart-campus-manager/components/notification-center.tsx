"use client"

import { useState, useEffect } from "react"
import { Bell, Settings, X, Check, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  notificationService,
  type CampusNotification,
  type NotificationConfig,
} from "@/lib/services/notification-service"

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<CampusNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [config, setConfig] = useState<NotificationConfig>(notificationService.getConfig())
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Subscribe to notifications
    const unsubscribe = notificationService.subscribe((newNotifications) => {
      setNotifications(newNotifications)
      setUnreadCount(notificationService.getUnreadCount())
    })

    // Start simulation
    const stopSimulation = notificationService.startSimulation()

    // Initial load
    setNotifications(notificationService.getNotifications())
    setUnreadCount(notificationService.getUnreadCount())

    return () => {
      unsubscribe()
      stopSimulation()
    }
  }, [])

  const handleMarkAsRead = (notificationId: string) => {
    notificationService.markAsRead(notificationId)
  }

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead()
  }

  const handleRemoveNotification = (notificationId: string) => {
    notificationService.removeNotification(notificationId)
  }

  const handleClearAll = () => {
    notificationService.clearAll()
  }

  const handleConfigUpdate = (updates: Partial<NotificationConfig>) => {
    const newConfig = { ...config, ...updates }
    setConfig(newConfig)
    notificationService.updateConfig(updates)
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - timestamp.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  const getNotificationIcon = (type: CampusNotification["type"]) => {
    switch (type) {
      case "error":
        return "🚨"
      case "warning":
        return "⚠️"
      case "success":
        return "✅"
      default:
        return "ℹ️"
    }
  }

  const getNotificationColor = (type: CampusNotification["type"]) => {
    switch (type) {
      case "error":
        return "text-red-500"
      case "warning":
        return "text-yellow-500"
      case "success":
        return "text-green-500"
      default:
        return "text-blue-500"
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Notification Bell */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500">
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                  <Check className="h-4 w-4" />
                </Button>
              )}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Notification Settings</DialogTitle>
                    <DialogDescription>Configure how you receive campus notifications</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enable-sound">Sound notifications</Label>
                      <Switch
                        id="enable-sound"
                        checked={config.enableSound}
                        onCheckedChange={(checked) => handleConfigUpdate({ enableSound: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enable-desktop">Desktop notifications</Label>
                      <Switch
                        id="enable-desktop"
                        checked={config.enableDesktop}
                        onCheckedChange={(checked) => handleConfigUpdate({ enableDesktop: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="critical-only">Critical alerts only</Label>
                      <Switch
                        id="critical-only"
                        checked={config.criticalOnly}
                        onCheckedChange={(checked) => handleConfigUpdate({ criticalOnly: checked })}
                      />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="quiet-hours">Quiet hours</Label>
                        <Switch
                          id="quiet-hours"
                          checked={config.quietHours.enabled}
                          onCheckedChange={(checked) =>
                            handleConfigUpdate({
                              quietHours: { ...config.quietHours, enabled: checked },
                            })
                          }
                        />
                      </div>
                      {config.quietHours.enabled && (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="quiet-start" className="text-xs">
                              Start
                            </Label>
                            <Input
                              id="quiet-start"
                              type="time"
                              value={config.quietHours.start}
                              onChange={(e) =>
                                handleConfigUpdate({
                                  quietHours: { ...config.quietHours, start: e.target.value },
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="quiet-end" className="text-xs">
                              End
                            </Label>
                            <Input
                              id="quiet-end"
                              type="time"
                              value={config.quietHours.end}
                              onChange={(e) =>
                                handleConfigUpdate({
                                  quietHours: { ...config.quietHours, end: e.target.value },
                                })
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <ScrollArea className="h-80">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">No notifications</div>
            ) : (
              <div className="p-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg mb-2 border transition-colors ${
                      notification.read ? "bg-muted/50 border-muted" : "bg-background border-gray-200 shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        <span className="text-sm">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-sm ${getNotificationColor(notification.type)}`}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{formatTimeAgo(notification.timestamp)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleRemoveNotification(notification.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          {notifications.length > 0 && (
            <div className="p-2 border-t">
              <Button variant="ghost" size="sm" className="w-full" onClick={handleClearAll}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
