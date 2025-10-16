"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Building2, Zap, Wrench, AlertTriangle, TrendingUp, Activity, Settings } from "lucide-react"
import { CampusOverview } from "./dashboard/campus-overview"
import { EnergyMonitoring } from "./dashboard/energy-monitoring"
import { MaintenanceCenter } from "./dashboard/maintenance-center"
import { IoTSensorGrid } from "./dashboard/iot-sensor-grid"
import { AlertsPanel } from "./dashboard/alerts-panel"
import { AnalyticsPanel } from "./dashboard/analytics-panel"
import { BuildingAutomation } from "./dashboard/building-automation"
import { AIAgentPanel } from "./ai-agent-panel"
import { NotificationCenter } from "./notification-center"
import type { AgentResults } from "@/lib/services/campus-ai-agent"
import { mockBuildings, mockAlerts, mockMaintenanceTasks } from "@/lib/data/mock-campus-data"

export function CampusDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [realTimeData, setRealTimeData] = useState({
    totalBuildings: mockBuildings.length,
    activeAlerts: mockAlerts.filter((alert) => !alert.resolved).length,
    pendingMaintenance: mockMaintenanceTasks.filter((task) => task.status !== "completed").length,
    energyEfficiency: 87,
  })
  const [agentResults, setAgentResults] = useState<AgentResults | null>(null)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData((prev) => ({
        ...prev,
        energyEfficiency: Math.max(75, Math.min(95, prev.energyEfficiency + (Math.random() - 0.5) * 2)),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleAgentResults = (results: AgentResults) => {
    setAgentResults(results)
    // Update real-time data based on agent results
    setRealTimeData((prev) => ({
      ...prev,
      activeAlerts: results.alerts.filter((alert) => !alert.resolved).length,
    }))
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">Smart Campus Manager</h1>
                <p className="text-sm text-slate-400">Agentic AI Infrastructure Management</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <NotificationCenter />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-300">AI Agent Active</span>
              </div>
              <Badge variant="outline" className="border-blue-500 text-blue-400">
                Live Monitoring
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-6 py-6">
        {/* Key Metrics Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Buildings</p>
                  <p className="text-2xl font-bold text-white">{realTimeData.totalBuildings}</p>
                </div>
                <Building2 className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Active Alerts</p>
                  <p className="text-2xl font-bold text-orange-400">{realTimeData.activeAlerts}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Pending Tasks</p>
                  <p className="text-2xl font-bold text-yellow-400">{realTimeData.pendingMaintenance}</p>
                </div>
                <Wrench className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Energy Efficiency</p>
                  <p className="text-2xl font-bold text-green-400">{realTimeData.energyEfficiency}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Agent Panel */}
        <div className="mb-6">
          <AIAgentPanel onResultsUpdate={handleAgentResults} />
        </div>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-slate-900/50 border border-slate-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
              <Building2 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="energy" className="data-[state=active]:bg-blue-600">
              <Zap className="w-4 h-4 mr-2" />
              Energy
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="data-[state=active]:bg-blue-600">
              <Wrench className="w-4 h-4 mr-2" />
              Maintenance
            </TabsTrigger>
            <TabsTrigger value="sensors" className="data-[state=active]:bg-blue-600">
              <Activity className="w-4 h-4 mr-2" />
              IoT Sensors
            </TabsTrigger>
            <TabsTrigger value="automation" className="data-[state=active]:bg-blue-600">
              <Settings className="w-4 h-4 mr-2" />
              Automation
            </TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-blue-600">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <CampusOverview />
          </TabsContent>

          <TabsContent value="energy" className="space-y-6">
            <EnergyMonitoring />
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-6">
            <MaintenanceCenter />
          </TabsContent>

          <TabsContent value="sensors" className="space-y-6">
            <IoTSensorGrid />
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
            <BuildingAutomation />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <AlertsPanel />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
