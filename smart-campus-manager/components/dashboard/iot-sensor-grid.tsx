"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Activity, Thermometer, Droplets, Zap, Wind, Eye, Wifi, Battery, CheckCircle } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { mockSensors } from "@/lib/data/mock-campus-data"

// Mock real-time sensor readings
const generateMockReading = (sensorType: string) => {
  const baseValues = {
    temperature: { min: 18, max: 26, unit: "°C" },
    humidity: { min: 30, max: 70, unit: "%" },
    occupancy: { min: 0, max: 1, unit: "boolean" },
    energy: { min: 50, max: 2000, unit: "kWh" },
    air_quality: { min: 0, max: 500, unit: "AQI" },
    water_flow: { min: 0, max: 100, unit: "L/min" },
    vibration: { min: 0, max: 10, unit: "mm/s" },
    light: { min: 0, max: 1000, unit: "lux" },
  }

  const config = baseValues[sensorType as keyof typeof baseValues] || baseValues.temperature
  const value = Math.random() * (config.max - config.min) + config.min

  return {
    value: Math.round(value * 100) / 100,
    unit: config.unit,
    timestamp: new Date(),
    quality: Math.random() > 0.95 ? "poor" : "good",
  }
}

export function IoTSensorGrid() {
  const [sensors, setSensors] = useState(mockSensors)
  const [selectedSensor, setSelectedSensor] = useState(mockSensors[0])
  const [sensorReadings, setSensorReadings] = useState<Record<string, any>>({})
  const [historicalData, setHistoricalData] = useState<any[]>([])

  // Simulate real-time sensor updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newReadings: Record<string, any> = {}
      sensors.forEach((sensor) => {
        newReadings[sensor.id] = generateMockReading(sensor.type)
      })
      setSensorReadings(newReadings)
    }, 3000)

    return () => clearInterval(interval)
  }, [sensors])

  // Generate historical data for selected sensor
  useEffect(() => {
    const generateHistoricalData = () => {
      const data = []
      for (let i = 23; i >= 0; i--) {
        const time = new Date()
        time.setHours(time.getHours() - i)
        const reading = generateMockReading(selectedSensor.type)
        data.push({
          time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          value: reading.value,
          timestamp: time,
        })
      }
      return data
    }

    setHistoricalData(generateHistoricalData())
  }, [selectedSensor])

  const getSensorIcon = (type: string) => {
    switch (type) {
      case "temperature":
        return <Thermometer className="w-5 h-5" />
      case "humidity":
        return <Droplets className="w-5 h-5" />
      case "energy":
        return <Zap className="w-5 h-5" />
      case "occupancy":
        return <Eye className="w-5 h-5" />
      case "air_quality":
        return <Wind className="w-5 h-5" />
      default:
        return <Activity className="w-5 h-5" />
    }
  }

  const getSensorStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-400"
      case "inactive":
        return "text-gray-400"
      case "maintenance":
        return "text-yellow-400"
      case "error":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const getReadingQualityColor = (quality: string) => {
    switch (quality) {
      case "good":
        return "text-green-400"
      case "fair":
        return "text-yellow-400"
      case "poor":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const activeSensors = sensors.filter((s) => s.status === "active").length
  const totalSensors = sensors.length
  const avgBattery =
    sensors.filter((s) => s.batteryLevel).reduce((sum, s) => sum + (s.batteryLevel || 0), 0) /
    sensors.filter((s) => s.batteryLevel).length

  return (
    <div className="space-y-6">
      {/* IoT Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Active Sensors</p>
                <p className="text-2xl font-bold text-green-400">{activeSensors}</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-2">
              <Progress value={(activeSensors / totalSensors) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Network Status</p>
                <p className="text-2xl font-bold text-blue-400">Online</p>
              </div>
              <Wifi className="w-8 h-8 text-blue-500" />
            </div>
            <div className="flex items-center gap-1 mt-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-500">99.8% uptime</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Avg Battery</p>
                <p className="text-2xl font-bold text-yellow-400">{avgBattery.toFixed(0)}%</p>
              </div>
              <Battery className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="mt-2">
              <Progress value={avgBattery} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Data Quality</p>
                <p className="text-2xl font-bold text-green-400">95%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <div className="flex items-center gap-1 mt-2">
              <Activity className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-500">Excellent</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sensor Grid */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">IoT Sensor Network</CardTitle>
            <CardDescription className="text-slate-400">Real-time sensor status and readings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
              {sensors.map((sensor) => {
                const reading = sensorReadings[sensor.id]
                return (
                  <div
                    key={sensor.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:bg-slate-800/50 ${
                      selectedSensor.id === sensor.id ? "border-blue-500 bg-slate-800/50" : "border-slate-700"
                    }`}
                    onClick={() => setSelectedSensor(sensor)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`${getSensorStatusColor(sensor.status)}`}>{getSensorIcon(sensor.type)}</div>
                        <div>
                          <h4 className="font-medium text-white capitalize">{sensor.type} Sensor</h4>
                          <p className="text-sm text-slate-400">{sensor.id}</p>
                        </div>
                      </div>
                      <Badge
                        className={
                          sensor.status === "active"
                            ? "bg-green-600"
                            : sensor.status === "maintenance"
                              ? "bg-yellow-600"
                              : "bg-red-600"
                        }
                      >
                        {sensor.status}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {reading && (
                          <div>
                            <p className="text-sm text-slate-400">Current Reading</p>
                            <p className="text-white font-medium">
                              {reading.value} {reading.unit}
                            </p>
                          </div>
                        )}

                        {sensor.batteryLevel && (
                          <div>
                            <p className="text-sm text-slate-400">Battery</p>
                            <div className="flex items-center gap-2">
                              <Progress value={sensor.batteryLevel} className="w-12 h-2" />
                              <span className="text-white text-sm">{sensor.batteryLevel}%</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-slate-400">Location</p>
                        <p className="text-white text-sm">Floor {sensor.location.floor}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Sensor Details */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Sensor Details</CardTitle>
            <CardDescription className="text-slate-400">
              {selectedSensor ? `${selectedSensor.type} sensor monitoring` : "Select a sensor to view details"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedSensor && (
              <div className="space-y-6">
                {/* Current Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-400">Sensor Type</p>
                    <p className="text-white capitalize">{selectedSensor.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Status</p>
                    <Badge
                      className={
                        selectedSensor.status === "active"
                          ? "bg-green-600"
                          : selectedSensor.status === "maintenance"
                            ? "bg-yellow-600"
                            : "bg-red-600"
                      }
                    >
                      {selectedSensor.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Manufacturer</p>
                    <p className="text-white">{selectedSensor.manufacturer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Model</p>
                    <p className="text-white">{selectedSensor.model}</p>
                  </div>
                </div>

                {/* Current Reading */}
                {sensorReadings[selectedSensor.id] && (
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <h4 className="font-medium text-white mb-2">Current Reading</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-blue-400">
                          {sensorReadings[selectedSensor.id].value} {sensorReadings[selectedSensor.id].unit}
                        </p>
                        <p className="text-sm text-slate-400">
                          Last updated: {sensorReadings[selectedSensor.id].timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      <Badge className={getReadingQualityColor(sensorReadings[selectedSensor.id].quality)}>
                        {sensorReadings[selectedSensor.id].quality} quality
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Historical Chart */}
                <div>
                  <h4 className="font-medium text-white mb-4">24-Hour Trend</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={historicalData}>
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
                      <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Calibrate
                  </Button>
                  <Button size="sm" variant="outline">
                    View History
                  </Button>
                  <Button size="sm" variant="outline">
                    Configure
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
