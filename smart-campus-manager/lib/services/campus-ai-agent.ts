// TypeScript interface for the AI Agent System
import type { MaintenancePrediction, EnergyPrediction, Alert, OptimizationRecommendation } from "@/lib/types/campus"

export interface AgentState {
  sensor_data: Record<string, any>
  maintenance_requests: any[]
  energy_data: Record<string, any>
  alerts: Alert[]
  recommendations: OptimizationRecommendation[]
  current_task: string | null
  context: Record<string, any>
  timestamp: string
}

export interface AgentResults {
  alerts: Alert[]
  recommendations: OptimizationRecommendation[]
  maintenance_predictions: MaintenancePrediction[]
  energy_predictions: EnergyPrediction[]
  context: Record<string, any>
  timestamp: string
  processing_time: number
}

export class CampusAIAgentService {
  private static instance: CampusAIAgentService
  private isProcessing = false
  private lastResults: AgentResults | null = null

  static getInstance(): CampusAIAgentService {
    if (!CampusAIAgentService.instance) {
      CampusAIAgentService.instance = new CampusAIAgentService()
    }
    return CampusAIAgentService.instance
  }

  async processCampusData(sensorData: Record<string, any>, energyData: Record<string, any>): Promise<AgentResults> {
    if (this.isProcessing) {
      throw new Error("Agent is already processing data")
    }

    this.isProcessing = true
    const startTime = Date.now()

    try {
      // Simulate AI agent processing (in production, this would call the Python LangGraph agent)
      const results = await this.simulateAgentProcessing(sensorData, energyData)

      this.lastResults = {
        ...results,
        processing_time: Date.now() - startTime,
      }

      return this.lastResults
    } finally {
      this.isProcessing = false
    }
  }

  private async simulateAgentProcessing(
    sensorData: Record<string, any>,
    energyData: Record<string, any>,
  ): Promise<Omit<AgentResults, "processing_time">> {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const alerts: Alert[] = []
    const recommendations: OptimizationRecommendation[] = []
    const maintenancePredictions: MaintenancePrediction[] = []
    const energyPredictions: EnergyPrediction[] = []

    // Analyze sensor data for anomalies
    Object.entries(sensorData).forEach(([sensorId, data]) => {
      if (this.detectAnomalies(data)) {
        alerts.push({
          id: `alert-${Date.now()}-${sensorId}`,
          type: "environmental",
          severity: "warning",
          title: "Sensor Anomaly Detected",
          message: `Sensor ${sensorId} showing abnormal readings`,
          source: { type: "sensor", id: sensorId },
          buildingId: data.buildingId || "unknown",
          timestamp: new Date(),
          acknowledged: false,
          resolved: false,
          actions: ["Investigate sensor", "Check calibration", "Verify equipment status"],
        })
      }
    })

    // Analyze energy data for optimization opportunities
    Object.entries(energyData).forEach(([buildingId, data]) => {
      const consumption = data.current_consumption || 0
      if (consumption > 1200) {
        recommendations.push({
          id: `rec-${Date.now()}-${buildingId}`,
          type: "energy",
          title: "Energy Optimization Opportunity",
          description: `Building ${buildingId} showing high energy consumption`,
          impact: "medium",
          estimatedSavings: consumption * 0.15 * 0.15, // 15% savings at $0.15/kWh
          implementationCost: 5000,
          paybackPeriod: 8,
          priority: 7,
          buildingIds: [buildingId],
          status: "pending",
        })

        energyPredictions.push({
          buildingId,
          predictedDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          predictedConsumption: consumption * 0.95, // 5% reduction predicted
          confidence: 0.82,
          factors: ["Weather forecast", "Occupancy patterns", "Equipment efficiency"],
          recommendations: ["Adjust HVAC schedules", "Implement smart lighting"],
        })
      }
    })

    // Generate maintenance predictions
    const equipmentHealthScores = [
      { id: "eq-001", health: 75, type: "hvac" },
      { id: "eq-002", health: 45, type: "elevator" },
      { id: "eq-003", health: 90, type: "generator" },
    ]

    equipmentHealthScores.forEach((equipment) => {
      if (equipment.health < 60) {
        const daysToFailure = Math.max(1, (equipment.health - 20) / 5)

        maintenancePredictions.push({
          equipmentId: equipment.id,
          predictedFailureDate: new Date(Date.now() + daysToFailure * 24 * 60 * 60 * 1000),
          confidence: 0.85,
          riskLevel: daysToFailure <= 7 ? "critical" : "medium",
          recommendedAction: `Schedule preventive maintenance for ${equipment.type}`,
          estimatedCost: equipment.type === "elevator" ? 2500 : 800,
          factors: ["Vibration analysis", "Temperature readings", "Usage patterns"],
        })

        alerts.push({
          id: `alert-maint-${Date.now()}-${equipment.id}`,
          type: "maintenance",
          severity: daysToFailure <= 7 ? "critical" : "warning",
          title: "Equipment Maintenance Required",
          message: `${equipment.type} (${equipment.id}) predicted to fail in ${Math.round(daysToFailure)} days`,
          source: { type: "equipment", id: equipment.id },
          buildingId: "bld-001", // Mock building assignment
          timestamp: new Date(),
          acknowledged: false,
          resolved: false,
          actions: [`Schedule maintenance for ${equipment.type}`, "Order replacement parts", "Notify maintenance team"],
        })
      }
    })

    return {
      alerts,
      recommendations,
      maintenance_predictions: maintenancePredictions,
      energy_predictions: energyPredictions,
      context: {
        sensor_anomalies: alerts.filter((a) => a.type === "environmental").length,
        energy_optimizations: recommendations.filter((r) => r.type === "energy").length,
        maintenance_predictions: maintenancePredictions.length,
        processing_status: "completed",
      },
      timestamp: new Date().toISOString(),
    }
  }

  private detectAnomalies(sensorData: any): boolean {
    const value = sensorData.value || 0
    const type = sensorData.type || ""

    const thresholds = {
      temperature: { min: 15, max: 30 },
      humidity: { min: 20, max: 80 },
      energy: { min: 0, max: 2500 },
      air_quality: { min: 0, max: 300 },
    }

    if (type in thresholds) {
      const threshold = thresholds[type as keyof typeof thresholds]
      return value < threshold.min || value > threshold.max
    }

    return false
  }

  getLastResults(): AgentResults | null {
    return this.lastResults
  }

  isCurrentlyProcessing(): boolean {
    return this.isProcessing
  }
}
