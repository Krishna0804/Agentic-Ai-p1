"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Play, Pause, RefreshCw, CheckCircle, AlertCircle, Clock } from "lucide-react"
import type { AgentResults } from "@/lib/services/campus-ai-agent"

interface AIAgentPanelProps {
  onResultsUpdate?: (results: AgentResults) => void
}

export function AIAgentPanel({ onResultsUpdate }: AIAgentPanelProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastResults, setLastResults] = useState<AgentResults | null>(null)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [autoMode, setAutoMode] = useState(false)

  // Simulate processing progress
  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setProcessingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + Math.random() * 15
        })
      }, 200)

      return () => clearInterval(interval)
    } else {
      setProcessingProgress(0)
    }
  }, [isProcessing])

  // Auto-processing mode
  useEffect(() => {
    if (autoMode && !isProcessing) {
      const interval = setInterval(() => {
        handleProcessData()
      }, 30000) // Process every 30 seconds

      return () => clearInterval(interval)
    }
  }, [autoMode, isProcessing])

  const handleProcessData = async () => {
    setIsProcessing(true)
    setProcessingProgress(0)

    try {
      // Mock sensor and energy data
      const sensorData = {
        "sensor-001": { type: "temperature", value: 28, buildingId: "bld-001" },
        "sensor-002": { type: "humidity", value: 65, buildingId: "bld-001" },
        "sensor-003": { type: "energy", value: 1350, buildingId: "bld-001" },
      }

      const energyData = {
        "bld-001": { current_consumption: 1350, baseline: 1200 },
        "bld-002": { current_consumption: 980, baseline: 1000 },
      }

      const response = await fetch("/api/ai-agent/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sensorData, energyData }),
      })

      if (!response.ok) {
        throw new Error("Failed to process data")
      }

      const result = await response.json()
      setLastResults(result.data)
      onResultsUpdate?.(result.data)
    } catch (error) {
      console.error("Processing error:", error)
    } finally {
      setIsProcessing(false)
      setProcessingProgress(100)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-600/20 rounded-lg">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-white">AI Agent Control Center</CardTitle>
              <CardDescription className="text-slate-400">LangGraph-powered campus intelligence</CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`${isProcessing ? "border-yellow-500 text-yellow-400" : "border-green-500 text-green-400"}`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                  Processing
                </>
              ) : (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Ready
                </>
              )}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Control Buttons */}
        <div className="flex items-center gap-3">
          <Button onClick={handleProcessData} disabled={isProcessing} className="bg-blue-600 hover:bg-blue-700">
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Analysis
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => setAutoMode(!autoMode)}
            className={autoMode ? "border-green-500 text-green-400" : ""}
          >
            {autoMode ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Auto Mode ON
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Auto Mode OFF
              </>
            )}
          </Button>
        </div>

        {/* Processing Progress */}
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Processing campus data...</span>
              <span className="text-sm text-slate-400">{Math.round(processingProgress)}%</span>
            </div>
            <Progress value={processingProgress} className="h-2" />
          </div>
        )}

        {/* Last Results Summary */}
        {lastResults && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-white">Last Analysis Results</h4>
              <div className="flex items-center gap-1 text-sm text-slate-400">
                <Clock className="w-4 h-4" />
                {formatTimestamp(lastResults.timestamp)}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-400" />
                  <span className="text-sm text-slate-300">Alerts</span>
                </div>
                <p className="text-xl font-bold text-white mt-1">{lastResults.alerts.length}</p>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-slate-300">Recommendations</span>
                </div>
                <p className="text-xl font-bold text-white mt-1">{lastResults.recommendations.length}</p>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-slate-300">Predictions</span>
                </div>
                <p className="text-xl font-bold text-white mt-1">{lastResults.maintenance_predictions.length}</p>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-slate-300">Process Time</span>
                </div>
                <p className="text-xl font-bold text-white mt-1">{lastResults.processing_time}ms</p>
              </div>
            </div>

            {/* Recent Alerts */}
            {lastResults.alerts.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-medium text-white">Recent Alerts</h5>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {lastResults.alerts.slice(0, 3).map((alert) => (
                    <div key={alert.id} className="flex items-center gap-3 p-2 bg-slate-800/30 rounded">
                      <AlertCircle
                        className={`w-4 h-4 ${
                          alert.severity === "critical"
                            ? "text-red-400"
                            : alert.severity === "warning"
                              ? "text-yellow-400"
                              : "text-blue-400"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{alert.title}</p>
                        <p className="text-xs text-slate-400 truncate">{alert.message}</p>
                      </div>
                      <Badge
                        className={`text-xs ${
                          alert.severity === "critical"
                            ? "bg-red-600"
                            : alert.severity === "warning"
                              ? "bg-yellow-600"
                              : "bg-blue-600"
                        }`}
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
