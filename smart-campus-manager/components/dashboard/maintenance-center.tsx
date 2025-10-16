"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, User, AlertTriangle, CheckCircle, Wrench, TrendingUp, DollarSign } from "lucide-react"
import { mockMaintenanceTasks, mockEquipment } from "@/lib/data/mock-campus-data"
import type { MaintenanceTask, Equipment } from "@/lib/types/campus"

export function MaintenanceCenter() {
  const [tasks, setTasks] = useState<MaintenanceTask[]>(mockMaintenanceTasks)
  const [equipment, setEquipment] = useState<Equipment[]>(mockEquipment)
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null)

  // Calculate maintenance metrics
  const metrics = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t) => t.status === "completed").length,
    overdueTasks: tasks.filter((t) => t.scheduledDate < new Date() && t.status !== "completed").length,
    avgHealthScore: Math.round(equipment.reduce((sum, eq) => sum + eq.healthScore, 0) / equipment.length),
    criticalEquipment: equipment.filter((eq) => eq.criticalityLevel === "critical").length,
    totalMaintenanceCost: tasks.reduce((sum, task) => sum + (task.cost || 0), 0),
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-600"
      case "in-progress":
        return "bg-blue-600"
      case "scheduled":
        return "bg-yellow-600"
      case "cancelled":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-red-400 bg-red-600/20"
      case "high":
        return "text-orange-400 bg-orange-600/20"
      case "medium":
        return "text-yellow-400 bg-yellow-600/20"
      case "low":
        return "text-green-400 bg-green-600/20"
      default:
        return "text-gray-400 bg-gray-600/20"
    }
  }

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400"
    if (score >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <div className="space-y-6">
      {/* Maintenance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Tasks</p>
                <p className="text-2xl font-bold text-white">{metrics.totalTasks}</p>
              </div>
              <Wrench className="w-6 h-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Completed</p>
                <p className="text-2xl font-bold text-green-400">{metrics.completedTasks}</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Overdue</p>
                <p className="text-2xl font-bold text-red-400">{metrics.overdueTasks}</p>
              </div>
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Avg Health</p>
                <p className="text-2xl font-bold text-blue-400">{metrics.avgHealthScore}%</p>
              </div>
              <TrendingUp className="w-6 h-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Critical</p>
                <p className="text-2xl font-bold text-orange-400">{metrics.criticalEquipment}</p>
              </div>
              <AlertTriangle className="w-6 h-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Cost</p>
                <p className="text-2xl font-bold text-green-400">${metrics.totalMaintenanceCost}</p>
              </div>
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tasks" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-slate-900/50 border border-slate-800">
          <TabsTrigger value="tasks" className="data-[state=active]:bg-blue-600">
            Maintenance Tasks
          </TabsTrigger>
          <TabsTrigger value="equipment" className="data-[state=active]:bg-blue-600">
            Equipment Health
          </TabsTrigger>
          <TabsTrigger value="predictions" className="data-[state=active]:bg-blue-600">
            Predictions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Task List */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Maintenance Tasks</CardTitle>
                <CardDescription className="text-slate-400">
                  Current and scheduled maintenance activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all hover:bg-slate-800/50 ${
                        selectedTask?.id === task.id ? "border-blue-500 bg-slate-800/50" : "border-slate-700"
                      }`}
                      onClick={() => setSelectedTask(task)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-white">{task.title}</h4>
                        <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                      </div>

                      <p className="text-sm text-slate-400 mb-3">{task.description}</p>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                          <div className="flex items-center gap-1 text-slate-400">
                            <Calendar className="w-4 h-4" />
                            {task.scheduledDate.toLocaleDateString()}
                          </div>
                        </div>

                        {task.assignedTo && (
                          <div className="flex items-center gap-1 text-slate-400">
                            <User className="w-4 h-4" />
                            {task.assignedTo}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Task Details */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Task Details</CardTitle>
                <CardDescription className="text-slate-400">
                  {selectedTask ? "Detailed information and actions" : "Select a task to view details"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedTask ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-white mb-2">{selectedTask.title}</h4>
                      <p className="text-slate-300">{selectedTask.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-400">Priority</p>
                        <Badge className={getPriorityColor(selectedTask.priority)}>{selectedTask.priority}</Badge>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Status</p>
                        <Badge className={getStatusColor(selectedTask.status)}>{selectedTask.status}</Badge>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Type</p>
                        <p className="text-white capitalize">{selectedTask.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Assigned To</p>
                        <p className="text-white">{selectedTask.assignedTo || "Unassigned"}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-400">Scheduled Date</p>
                        <p className="text-white">{selectedTask.scheduledDate.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Estimated Duration</p>
                        <p className="text-white">{selectedTask.estimatedDuration} hours</p>
                      </div>
                    </div>

                    {selectedTask.cost && (
                      <div>
                        <p className="text-sm text-slate-400">Estimated Cost</p>
                        <p className="text-white">${selectedTask.cost}</p>
                      </div>
                    )}

                    <div className="flex gap-2 pt-4">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Update Status
                      </Button>
                      <Button size="sm" variant="outline">
                        Add Notes
                      </Button>
                      <Button size="sm" variant="outline">
                        Reschedule
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Wrench className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">Select a maintenance task to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="equipment" className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Equipment Health Monitoring</CardTitle>
              <CardDescription className="text-slate-400">
                Real-time health scores and maintenance schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {equipment.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-600/20 rounded-lg">
                        <Wrench className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{item.name}</h4>
                        <p className="text-sm text-slate-400">
                          {item.manufacturer} {item.model}
                        </p>
                        <p className="text-xs text-slate-500">Serial: {item.serialNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-slate-400">Health Score</p>
                        <div className="flex items-center gap-2">
                          <Progress value={item.healthScore} className="w-20 h-2" />
                          <span className={`font-medium ${getHealthScoreColor(item.healthScore)}`}>
                            {item.healthScore}%
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-slate-400">Status</p>
                        <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-slate-400">Criticality</p>
                        <Badge className={getPriorityColor(item.criticalityLevel)}>{item.criticalityLevel}</Badge>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-slate-400">Next Maintenance</p>
                        <p className="text-white text-sm">
                          {item.nextMaintenance?.toLocaleDateString() || "Not scheduled"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Predictive Maintenance</CardTitle>
              <CardDescription className="text-slate-400">
                AI-powered failure predictions and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mock predictions */}
                <div className="p-4 bg-red-600/10 border border-red-600/20 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                      <div>
                        <h4 className="font-medium text-white">Critical Prediction</h4>
                        <p className="text-sm text-slate-400">Elevator A - Residence Hall</p>
                      </div>
                    </div>
                    <Badge className="bg-red-600">High Risk</Badge>
                  </div>
                  <p className="text-slate-300 mb-3">
                    Predicted failure within 5-7 days based on vibration analysis and usage patterns.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-slate-400">
                        Confidence: <span className="text-white">87%</span>
                      </span>
                      <span className="text-slate-400">
                        Est. Cost: <span className="text-white">$2,500</span>
                      </span>
                    </div>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      Schedule Maintenance
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-yellow-600/10 border border-yellow-600/20 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Clock className="w-6 h-6 text-yellow-400" />
                      <div>
                        <h4 className="font-medium text-white">Medium Risk</h4>
                        <p className="text-sm text-slate-400">HVAC Unit - Engineering Complex</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-600">Medium Risk</Badge>
                  </div>
                  <p className="text-slate-300 mb-3">
                    Filter replacement recommended within 2 weeks. Performance degradation detected.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-slate-400">
                        Confidence: <span className="text-white">73%</span>
                      </span>
                      <span className="text-slate-400">
                        Est. Cost: <span className="text-white">$150</span>
                      </span>
                    </div>
                    <Button size="sm" variant="outline">
                      Review Recommendation
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-green-600/10 border border-green-600/20 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      <div>
                        <h4 className="font-medium text-white">Low Risk</h4>
                        <p className="text-sm text-slate-400">Generator - Sports Center</p>
                      </div>
                    </div>
                    <Badge className="bg-green-600">Low Risk</Badge>
                  </div>
                  <p className="text-slate-300 mb-3">
                    Equipment operating within normal parameters. Next scheduled maintenance in 3 months.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-slate-400">
                        Confidence: <span className="text-white">95%</span>
                      </span>
                      <span className="text-slate-400">
                        Health Score: <span className="text-white">90%</span>
                      </span>
                    </div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
