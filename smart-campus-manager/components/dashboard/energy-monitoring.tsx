"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Zap, TrendingUp, TrendingDown, DollarSign, Leaf } from "lucide-react"
import { mockEnergyData, mockBuildings } from "@/lib/data/mock-campus-data"

const energyTrendData = [
  { time: "00:00", consumption: 800, cost: 120 },
  { time: "04:00", consumption: 600, cost: 90 },
  { time: "08:00", consumption: 1200, cost: 180 },
  { time: "12:00", consumption: 1400, cost: 210 },
  { time: "16:00", consumption: 1300, cost: 195 },
  { time: "20:00", consumption: 1100, cost: 165 },
]

const consumptionBreakdown = [
  { name: "HVAC", value: 45, color: "#3b82f6" },
  { name: "Lighting", value: 25, color: "#10b981" },
  { name: "Equipment", value: 20, color: "#f59e0b" },
  { name: "Other", value: 10, color: "#8b5cf6" },
]

export function EnergyMonitoring() {
  const [selectedPeriod, setSelectedPeriod] = useState("24h")

  const totalConsumption = mockEnergyData.reduce((sum, data) => sum + data.totalConsumption, 0)
  const totalCost = mockEnergyData.reduce((sum, data) => sum + data.cost, 0)
  const totalCarbon = mockEnergyData.reduce((sum, data) => sum + data.carbonFootprint, 0)

  return (
    <div className="space-y-6">
      {/* Energy Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Consumption</p>
                <p className="text-2xl font-bold text-white">{totalConsumption.toLocaleString()}</p>
                <p className="text-xs text-slate-400">kWh</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingDown className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-500">-5.2%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Energy Cost</p>
                <p className="text-2xl font-bold text-white">${totalCost.toFixed(0)}</p>
                <p className="text-xs text-slate-400">USD</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingDown className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-500">-3.1%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Carbon Footprint</p>
                <p className="text-2xl font-bold text-white">{totalCarbon.toFixed(0)}</p>
                <p className="text-xs text-slate-400">kg CO₂</p>
              </div>
              <Leaf className="w-8 h-8 text-green-500" />
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingDown className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-500">-7.8%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Efficiency Score</p>
                <p className="text-2xl font-bold text-white">87</p>
                <p className="text-xs text-slate-400">out of 100</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-500">+2.3%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Energy Consumption Trend */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Energy Consumption Trend</CardTitle>
                <CardDescription className="text-slate-400">Real-time energy usage across campus</CardDescription>
              </div>
              <div className="flex gap-2">
                {["24h", "7d", "30d"].map((period) => (
                  <Button
                    key={period}
                    variant={selectedPeriod === period ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPeriod(period)}
                    className={selectedPeriod === period ? "bg-blue-600" : ""}
                  >
                    {period}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={energyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
                <Area type="monotone" dataKey="consumption" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Consumption Breakdown */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Consumption Breakdown</CardTitle>
            <CardDescription className="text-slate-400">Energy usage by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={consumptionBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {consumptionBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              {consumptionBreakdown.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-slate-300">{item.name}</span>
                  <span className="text-sm text-white ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Building Energy Performance */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Building Energy Performance</CardTitle>
          <CardDescription className="text-slate-400">
            Individual building consumption and efficiency ratings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockBuildings.map((building) => {
              const energyData = mockEnergyData.find((e) => e.buildingId === building.id)
              const consumption = energyData?.totalConsumption || 0
              const efficiency = building.energyRating === "A" ? 90 : building.energyRating === "B" ? 75 : 60

              return (
                <div key={building.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-600/20 rounded-lg">
                      <Zap className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{building.name}</h4>
                      <p className="text-sm text-slate-400">{building.type}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-slate-400">Consumption</p>
                      <p className="font-medium text-white">{consumption} kWh</p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-slate-400">Efficiency</p>
                      <div className="flex items-center gap-2">
                        <Progress value={efficiency} className="w-16 h-2" />
                        <Badge
                          className={
                            building.energyRating === "A"
                              ? "bg-green-600"
                              : building.energyRating === "B"
                                ? "bg-yellow-600"
                                : "bg-red-600"
                          }
                        >
                          {building.energyRating}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
