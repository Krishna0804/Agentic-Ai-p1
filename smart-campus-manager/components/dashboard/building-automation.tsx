"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Thermometer,
  Lightbulb,
  Shield,
  Wifi,
  Volume2,
  Lock,
  Unlock,
  Power,
  Settings,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import { mockBuildings } from "@/lib/data/mock-campus-data"

interface BuildingSystem {
  id: string
  name: string
  type: "hvac" | "lighting" | "security" | "access" | "audio" | "network"
  status: "online" | "offline" | "maintenance"
  enabled: boolean
  value?: number
  unit?: string
  lastUpdate: Date
}

const buildingSystems: Record<string, BuildingSystem[]> = {
  "bld-001": [
    {
      id: "hvac-001",
      name: "Main HVAC System",
      type: "hvac",
      status: "online",
      enabled: true,
      value: 22,
      unit: "°C",
      lastUpdate: new Date(),
    },
    {
      id: "light-001",
      name: "Smart Lighting",
      type: "lighting",
      status: "online",
      enabled: true,
      value: 75,
      unit: "%",
      lastUpdate: new Date(),
    },
    {
      id: "sec-001",
      name: "Security System",
      type: "security",
      status: "online",
      enabled: true,
      lastUpdate: new Date(),
    },
    {
      id: "access-001",
      name: "Access Control",
      type: "access",
      status: "online",
      enabled: true,
      lastUpdate: new Date(),
    },
  ],
  "bld-002": [
    {
      id: "hvac-002",
      name: "Residence HVAC",
      type: "hvac",
      status: "online",
      enabled: true,
      value: 21,
      unit: "°C",
      lastUpdate: new Date(),
    },
    {
      id: "light-002",
      name: "Corridor Lighting",
      type: "lighting",
      status: "maintenance",
      enabled: false,
      value: 0,
      unit: "%",
      lastUpdate: new Date(),
    },
  ],
}

export function BuildingAutomation() {
  const [selectedBuilding, setSelectedBuilding] = useState(mockBuildings[0])
  const [systems, setSystems] = useState<BuildingSystem[]>(buildingSystems[selectedBuilding.id] || [])
  const [automationMode, setAutomationMode] = useState(true)

  const handleBuildingChange = (building: any) => {
    setSelectedBuilding(building)
    setSystems(buildingSystems[building.id] || [])
  }

  const handleSystemToggle = (systemId: string) => {
    setSystems((prev) =>
      prev.map((system) => (system.id === systemId ? { ...system, enabled: !system.enabled } : system)),
    )
  }

  const handleValueChange = (systemId: string, newValue: number[]) => {
    setSystems((prev) => prev.map((system) => (system.id === systemId ? { ...system, value: newValue[0] } : system)))
  }

  const getSystemIcon = (type: string) => {
    switch (type) {
      case "hvac":
        return <Thermometer className="w-5 h-5" />
      case "lighting":
        return <Lightbulb className="w-5 h-5" />
      case "security":
        return <Shield className="w-5 h-5" />
      case "access":
        return <Lock className="w-5 h-5" />
      case "audio":
        return <Volume2 className="w-5 h-5" />
      case "network":
        return <Wifi className="w-5 h-5" />
      default:
        return <Settings className="w-5 h-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-400"
      case "offline":
        return "text-red-400"
      case "maintenance":
        return "text-yellow-400"
      default:
        return "text-gray-400"
    }
  }

  const onlineSystems = systems.filter((s) => s.status === "online").length
  const totalSystems = systems.length
  const systemsHealth = totalSystems > 0 ? (onlineSystems / totalSystems) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Building Selection */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Building Operations Center</CardTitle>
          <CardDescription className="text-slate-400">Centralized control for smart building systems</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              {mockBuildings.map((building) => (
                <Button
                  key={building.id}
                  variant={selectedBuilding.id === building.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleBuildingChange(building)}
                  className={selectedBuilding.id === building.id ? "bg-blue-600" : ""}
                >
                  {building.name.split(" ")[0]}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-300">Automation Mode</span>
                <Switch checked={automationMode} onCheckedChange={setAutomationMode} />
              </div>
              <Badge variant="outline" className="border-green-500 text-green-400">
                {onlineSystems}/{totalSystems} Systems Online
              </Badge>
            </div>
          </div>

          {/* Building Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Building Status</p>
                  <p className="text-lg font-bold text-white">{selectedBuilding.status}</p>
                </div>
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Systems Health</p>
                  <p className="text-lg font-bold text-green-400">{systemsHealth.toFixed(0)}%</p>
                </div>
                <Progress value={systemsHealth} className="w-16 h-2" />
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Energy Rating</p>
                  <p className="text-lg font-bold text-blue-400">{selectedBuilding.energyRating}</p>
                </div>
                <Badge className="bg-blue-600">{selectedBuilding.energyRating}</Badge>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Last Inspection</p>
                  <p className="text-lg font-bold text-white">{selectedBuilding.lastInspection.toLocaleDateString()}</p>
                </div>
                <Settings className="w-6 h-6 text-slate-400" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="systems" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-slate-900/50 border border-slate-800">
          <TabsTrigger value="systems" className="data-[state=active]:bg-blue-600">
            System Control
          </TabsTrigger>
          <TabsTrigger value="automation" className="data-[state=active]:bg-blue-600">
            Automation Rules
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="data-[state=active]:bg-blue-600">
            Live Monitoring
          </TabsTrigger>
        </TabsList>

        <TabsContent value="systems" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Controls */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">System Controls</CardTitle>
                <CardDescription className="text-slate-400">Direct control of building systems</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systems.map((system) => (
                    <div key={system.id} className="p-4 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={getStatusColor(system.status)}>{getSystemIcon(system.type)}</div>
                          <div>
                            <h4 className="font-medium text-white">{system.name}</h4>
                            <p className="text-sm text-slate-400 capitalize">{system.type} system</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            className={
                              system.status === "online"
                                ? "bg-green-600"
                                : system.status === "maintenance"
                                  ? "bg-yellow-600"
                                  : "bg-red-600"
                            }
                          >
                            {system.status}
                          </Badge>
                          <Switch
                            checked={system.enabled}
                            onCheckedChange={() => handleSystemToggle(system.id)}
                            disabled={system.status !== "online"}
                          />
                        </div>
                      </div>

                      {system.value !== undefined && system.enabled && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400">
                              {system.type === "hvac" ? "Temperature" : "Intensity"}
                            </span>
                            <span className="text-white">
                              {system.value} {system.unit}
                            </span>
                          </div>
                          <Slider
                            value={[system.value]}
                            onValueChange={(value) => handleValueChange(system.id, value)}
                            max={system.type === "hvac" ? 30 : 100}
                            min={system.type === "hvac" ? 16 : 0}
                            step={1}
                            className="w-full"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-3 text-sm text-slate-400">
                        <span>Last updated: {system.lastUpdate.toLocaleTimeString()}</span>
                        <Button size="sm" variant="outline">
                          Configure
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
                <CardDescription className="text-slate-400">Common building operation shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button className="bg-blue-600 hover:bg-blue-700 h-16 flex-col">
                      <Power className="w-6 h-6 mb-1" />
                      <span className="text-sm">All Systems On</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex-col bg-transparent">
                      <Power className="w-6 h-6 mb-1" />
                      <span className="text-sm">Emergency Off</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex-col bg-transparent">
                      <Lock className="w-6 h-6 mb-1" />
                      <span className="text-sm">Lock Building</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex-col bg-transparent">
                      <Unlock className="w-6 h-6 mb-1" />
                      <span className="text-sm">Unlock All</span>
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-white">Preset Modes</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Thermometer className="w-4 h-4 mr-2" />
                        Energy Saving Mode
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Shield className="w-4 h-4 mr-2" />
                        Security Mode
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Settings className="w-4 h-4 mr-2" />
                        Maintenance Mode
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-600/10 border border-yellow-600/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      <h4 className="font-medium text-white">System Alert</h4>
                    </div>
                    <p className="text-sm text-slate-300">
                      Corridor lighting in Residence Hall requires maintenance attention.
                    </p>
                    <Button size="sm" className="mt-2 bg-yellow-600 hover:bg-yellow-700">
                      Schedule Maintenance
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Automation Rules</CardTitle>
              <CardDescription className="text-slate-400">Configure intelligent building automation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mock automation rules */}
                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">Energy Optimization</h4>
                    <Switch checked={true} />
                  </div>
                  <p className="text-sm text-slate-400 mb-3">
                    Automatically adjust HVAC and lighting based on occupancy and time of day
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-slate-400">Trigger: Occupancy sensors</span>
                    <span className="text-slate-400">Action: Adjust temperature ±2°C</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">Security Protocol</h4>
                    <Switch checked={true} />
                  </div>
                  <p className="text-sm text-slate-400 mb-3">
                    Automatically lock all access points and enable security systems after hours
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-slate-400">Trigger: 10:00 PM daily</span>
                    <span className="text-slate-400">Action: Lock doors, enable cameras</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">Maintenance Alerts</h4>
                    <Switch checked={false} />
                  </div>
                  <p className="text-sm text-slate-400 mb-3">
                    Generate maintenance requests when system performance drops below threshold
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-slate-400">Trigger: Performance &lt; 80%</span>
                    <span className="text-slate-400">Action: Create maintenance ticket</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Settings className="w-4 h-4 mr-2" />
                  Create New Rule
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Live System Monitoring</CardTitle>
              <CardDescription className="text-slate-400">Real-time status of all building systems</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {systems.map((system) => (
                  <div key={system.id} className="p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={getStatusColor(system.status)}>{getSystemIcon(system.type)}</div>
                        <h4 className="font-medium text-white text-sm">{system.name}</h4>
                      </div>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          system.status === "online" ? "bg-green-500" : "bg-red-500"
                        } animate-pulse`}
                      ></div>
                    </div>

                    {system.value !== undefined && (
                      <div className="mb-2">
                        <p className="text-2xl font-bold text-white">
                          {system.value} {system.unit}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{system.status}</span>
                      <span>{system.lastUpdate.toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
