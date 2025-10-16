"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle, Clock, Zap, Thermometer, Shield, Bell, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CampusAlert {
  id: string
  type: "critical" | "warning" | "info" | "maintenance"
  category: "energy" | "security" | "hvac" | "maintenance" | "iot" | "system"
  title: string
  description: string
  location: string
  timestamp: Date
  status: "active" | "acknowledged" | "resolved"
  priority: "high" | "medium" | "low"
  source: string
  actionRequired?: string
}

// Mock real-time alerts data
const generateMockAlerts = (): CampusAlert[] => [
  {
    id: "alert-001",
    type: "critical",
    category: "energy",
    title: "High Energy Consumption Detected",
    description: "Building A is consuming 45% more energy than normal baseline",
    location: "Engineering Building A - Floor 3",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    status: "active",
    priority: "high",
    source: "Energy Management System",
    actionRequired: "Check HVAC system efficiency",
  },
  {
    id: "alert-002",
    type: "warning",
    category: "hvac",
    title: "Temperature Anomaly",
    description: "Room temperature exceeds optimal range (78°F detected, target: 72°F)",
    location: "Library - Study Hall B",
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    status: "acknowledged",
    priority: "medium",
    source: "HVAC Sensor Network",
  },
  {
    id: "alert-003",
    type: "maintenance",
    category: "maintenance",
    title: "Predictive Maintenance Alert",
    description: "Air filter replacement recommended based on usage patterns",
    location: "Student Center - HVAC Unit 4",
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    status: "active",
    priority: "medium",
    source: "AI Maintenance Predictor",
    actionRequired: "Schedule filter replacement within 48 hours",
  },
  {
    id: "alert-004",
    type: "warning",
    category: "security",
    title: "Unusual Access Pattern",
    description: "Multiple failed access attempts detected at secure entrance",
    location: "Research Lab - Building C",
    timestamp: new Date(Date.now() - 35 * 60 * 1000),
    status: "active",
    priority: "high",
    source: "Security System",
  },
  {
    id: "alert-005",
    type: "info",
    category: "iot",
    title: "Sensor Battery Low",
    description: "IoT sensor battery level below 15%",
    location: "Dormitory A - Room 204",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    status: "resolved",
    priority: "low",
    source: "IoT Sensor Network",
  },
  {
    id: "alert-006",
    type: "critical",
    category: "system",
    title: "Network Connectivity Issue",
    description: "Campus network experiencing intermittent connectivity issues",
    location: "IT Infrastructure - Main Server Room",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    status: "acknowledged",
    priority: "high",
    source: "Network Monitoring System",
    actionRequired: "Contact IT support immediately",
  },
]

const getAlertIcon = (type: CampusAlert["type"], category: CampusAlert["category"]) => {
  if (type === "critical") return <AlertTriangle className="h-4 w-4 text-red-500" />
  if (category === "energy") return <Zap className="h-4 w-4 text-yellow-500" />
  if (category === "hvac") return <Thermometer className="h-4 w-4 text-blue-500" />
  if (category === "security") return <Shield className="h-4 w-4 text-purple-500" />
  if (category === "maintenance") return <Clock className="h-4 w-4 text-orange-500" />
  return <Bell className="h-4 w-4 text-gray-500" />
}

const getAlertBadgeVariant = (type: CampusAlert["type"]) => {
  switch (type) {
    case "critical":
      return "destructive"
    case "warning":
      return "secondary"
    case "maintenance":
      return "outline"
    default:
      return "default"
  }
}

const getStatusBadgeVariant = (status: CampusAlert["status"]) => {
  switch (status) {
    case "active":
      return "destructive"
    case "acknowledged":
      return "secondary"
    case "resolved":
      return "default"
    default:
      return "outline"
  }
}

function AlertsPanel() {
  const [alerts, setAlerts] = useState<CampusAlert[]>(generateMockAlerts())
  const [selectedAlert, setSelectedAlert] = useState<CampusAlert | null>(null)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update alert statuses or add new alerts
      setAlerts((prev) => {
        const updated = [...prev]
        if (Math.random() > 0.7) {
          // Randomly acknowledge or resolve an active alert
          const activeAlerts = updated.filter((a) => a.status === "active")
          if (activeAlerts.length > 0) {
            const randomAlert = activeAlerts[Math.floor(Math.random() * activeAlerts.length)]
            const alertIndex = updated.findIndex((a) => a.id === randomAlert.id)
            if (alertIndex !== -1) {
              updated[alertIndex] = {
                ...updated[alertIndex],
                status: Math.random() > 0.5 ? "acknowledged" : "resolved",
              }
            }
          }
        }
        return updated
      })
    }, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const activeAlerts = alerts.filter((a) => a.status === "active")
  const acknowledgedAlerts = alerts.filter((a) => a.status === "acknowledged")
  const resolvedAlerts = alerts.filter((a) => a.status === "resolved")
  const criticalAlerts = alerts.filter((a) => a.type === "critical" && a.status === "active")

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === alertId ? { ...alert, status: "acknowledged" as const } : alert)),
    )
  }

  const handleResolveAlert = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, status: "resolved" as const } : alert)))
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

  const AlertCard = ({ alert }: { alert: CampusAlert }) => (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        alert.type === "critical" ? "border-red-200 dark:border-red-800" : ""
      } ${selectedAlert?.id === alert.id ? "ring-2 ring-blue-500" : ""}`}
      onClick={() => setSelectedAlert(alert)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            {getAlertIcon(alert.type, alert.category)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-sm truncate">{alert.title}</h4>
                <Badge variant={getAlertBadgeVariant(alert.type)} className="text-xs">
                  {alert.type}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{alert.description}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="truncate">{alert.location}</span>
                <span>{formatTimeAgo(alert.timestamp)}</span>
              </div>
            </div>
          </div>
          <Badge variant={getStatusBadgeVariant(alert.status)} className="text-xs">
            {alert.status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <Alert className="border-red-200 dark:border-red-800">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription>
            <strong>
              {criticalAlerts.length} critical alert{criticalAlerts.length > 1 ? "s" : ""}
            </strong>{" "}
            require immediate attention
          </AlertDescription>
        </Alert>
      )}

      {/* Alert Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-red-500">{activeAlerts.length}</p>
                <p className="text-xs text-muted-foreground">Active Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold text-yellow-500">{acknowledgedAlerts.length}</p>
                <p className="text-xs text-muted-foreground">Acknowledged</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-green-500">{resolvedAlerts.length}</p>
                <p className="text-xs text-muted-foreground">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-red-500">{criticalAlerts.length}</p>
                <p className="text-xs text-muted-foreground">Critical</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Campus Alerts</CardTitle>
              <CardDescription>Real-time monitoring and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="active" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="active">Active ({activeAlerts.length})</TabsTrigger>
                  <TabsTrigger value="acknowledged">Acknowledged ({acknowledgedAlerts.length})</TabsTrigger>
                  <TabsTrigger value="resolved">Resolved ({resolvedAlerts.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="active" className="mt-4">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {activeAlerts.map((alert) => (
                        <AlertCard key={alert.id} alert={alert} />
                      ))}
                      {activeAlerts.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">No active alerts</p>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="acknowledged" className="mt-4">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {acknowledgedAlerts.map((alert) => (
                        <AlertCard key={alert.id} alert={alert} />
                      ))}
                      {acknowledgedAlerts.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">No acknowledged alerts</p>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="resolved" className="mt-4">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {resolvedAlerts.map((alert) => (
                        <AlertCard key={alert.id} alert={alert} />
                      ))}
                      {resolvedAlerts.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">No resolved alerts</p>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Alert Details Panel */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Alert Details</CardTitle>
              {selectedAlert && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4"
                  onClick={() => setSelectedAlert(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {selectedAlert ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {getAlertIcon(selectedAlert.type, selectedAlert.category)}
                    <Badge variant={getAlertBadgeVariant(selectedAlert.type)}>{selectedAlert.type}</Badge>
                    <Badge variant={getStatusBadgeVariant(selectedAlert.status)}>{selectedAlert.status}</Badge>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">{selectedAlert.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{selectedAlert.description}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="font-medium">{selectedAlert.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Source:</span>
                      <span className="font-medium">{selectedAlert.source}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Priority:</span>
                      <Badge
                        variant={
                          selectedAlert.priority === "high"
                            ? "destructive"
                            : selectedAlert.priority === "medium"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {selectedAlert.priority}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span className="font-medium">{formatTimeAgo(selectedAlert.timestamp)}</span>
                    </div>
                  </div>

                  {selectedAlert.actionRequired && (
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Action Required:</p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">{selectedAlert.actionRequired}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {selectedAlert.status === "active" && (
                      <Button size="sm" variant="outline" onClick={() => handleAcknowledgeAlert(selectedAlert.id)}>
                        Acknowledge
                      </Button>
                    )}
                    {selectedAlert.status !== "resolved" && (
                      <Button size="sm" onClick={() => handleResolveAlert(selectedAlert.id)}>
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">Select an alert to view details</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AlertsPanel
export { AlertsPanel }
