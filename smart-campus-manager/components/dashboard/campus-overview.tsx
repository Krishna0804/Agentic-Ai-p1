"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Building2, Thermometer, Droplets, Wind } from "lucide-react"
import { mockBuildings } from "@/lib/data/mock-campus-data"

export function CampusOverview() {
  const buildingStats = {
    operational: mockBuildings.filter((b) => b.status === "operational").length,
    maintenance: mockBuildings.filter((b) => b.status === "maintenance").length,
    offline: mockBuildings.filter((b) => b.status === "offline").length,
  }

  const totalArea = mockBuildings.reduce((sum, building) => sum + building.totalArea, 0)
  const avgEnergyRating = (mockBuildings.filter((b) => b.energyRating === "A").length / mockBuildings.length) * 100

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Campus Map Placeholder */}
      <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Campus Layout</CardTitle>
          <CardDescription className="text-slate-400">Interactive building status and sensor locations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative h-80 bg-slate-800 rounded-lg overflow-hidden">
            {/* Mock campus map */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800">
              {mockBuildings.map((building, index) => (
                <div
                  key={building.id}
                  className={`absolute w-16 h-12 rounded border-2 cursor-pointer transition-all hover:scale-110 ${
                    building.status === "operational"
                      ? "bg-green-600/20 border-green-500"
                      : building.status === "maintenance"
                        ? "bg-yellow-600/20 border-yellow-500"
                        : "bg-red-600/20 border-red-500"
                  }`}
                  style={{
                    left: `${20 + (index % 3) * 25}%`,
                    top: `${20 + Math.floor(index / 3) * 30}%`,
                  }}
                >
                  <div className="flex items-center justify-center h-full">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-slate-300 whitespace-nowrap">
                    {building.name.split(" ")[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-sm text-slate-300">Operational</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-sm text-slate-300">Maintenance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-sm text-slate-300">Offline</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Building Status */}
      <div className="space-y-6">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Building Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Operational</span>
              <Badge className="bg-green-600 text-white">{buildingStats.operational}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Maintenance</span>
              <Badge className="bg-yellow-600 text-white">{buildingStats.maintenance}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Offline</span>
              <Badge className="bg-red-600 text-white">{buildingStats.offline}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Campus Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-300">Total Area</span>
                <span className="text-sm text-white">{totalArea.toLocaleString()} m²</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-300">Energy Rating A</span>
                <span className="text-sm text-white">{avgEnergyRating.toFixed(0)}%</span>
              </div>
              <Progress value={avgEnergyRating} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-300">Avg Occupancy</span>
                <span className="text-sm text-white">73%</span>
              </div>
              <Progress value={73} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Environmental Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-slate-300">Temperature</span>
              </div>
              <span className="text-sm text-white">22°C</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-slate-300">Humidity</span>
              </div>
              <span className="text-sm text-white">45%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-slate-300">Air Quality</span>
              </div>
              <Badge className="bg-green-600 text-white">Good</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
