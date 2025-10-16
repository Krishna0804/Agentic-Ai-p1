// Core campus infrastructure types
export interface Building {
  id: string
  name: string
  type: "academic" | "residential" | "administrative" | "recreational" | "utility"
  location: {
    latitude: number
    longitude: number
  }
  floors: number
  totalArea: number // square meters
  constructionYear: number
  energyRating: "A" | "B" | "C" | "D" | "E"
  status: "operational" | "maintenance" | "offline"
  lastInspection: Date
}

export interface Room {
  id: string
  buildingId: string
  number: string
  type: "classroom" | "office" | "lab" | "dormitory" | "common" | "utility"
  capacity: number
  area: number
  hasHVAC: boolean
  hasSmartLighting: boolean
  occupancyStatus: "occupied" | "vacant" | "reserved"
}

// IoT Sensor types
export interface IoTSensor {
  id: string
  type: "temperature" | "humidity" | "occupancy" | "energy" | "air_quality" | "water_flow" | "vibration" | "light"
  location: {
    buildingId: string
    roomId?: string
    floor: number
    coordinates: { x: number; y: number }
  }
  status: "active" | "inactive" | "maintenance" | "error"
  batteryLevel?: number
  lastReading: Date
  calibrationDate: Date
  manufacturer: string
  model: string
}

export interface SensorReading {
  id: string
  sensorId: string
  timestamp: Date
  value: number
  unit: string
  quality: "good" | "fair" | "poor" | "error"
  metadata?: Record<string, any>
}

// Energy monitoring types
export interface EnergyConsumption {
  id: string
  buildingId: string
  timestamp: Date
  totalConsumption: number // kWh
  breakdown: {
    hvac: number
    lighting: number
    equipment: number
    other: number
  }
  cost: number
  carbonFootprint: number // kg CO2
}

export interface EnergyPrediction {
  buildingId: string
  predictedDate: Date
  predictedConsumption: number
  confidence: number
  factors: string[]
  recommendations: string[]
}

// Maintenance types
export interface MaintenanceTask {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high" | "critical"
  status: "scheduled" | "in-progress" | "completed" | "cancelled"
  type: "preventive" | "corrective" | "predictive" | "emergency"
  assignedTo?: string
  buildingId: string
  roomId?: string
  equipmentId?: string
  scheduledDate: Date
  completedDate?: Date
  estimatedDuration: number // hours
  actualDuration?: number
  cost?: number
  notes?: string
}

export interface Equipment {
  id: string
  name: string
  type: "hvac" | "elevator" | "generator" | "pump" | "lighting" | "security" | "network"
  buildingId: string
  roomId?: string
  manufacturer: string
  model: string
  serialNumber: string
  installationDate: Date
  warrantyExpiry?: Date
  status: "operational" | "maintenance" | "faulty" | "offline"
  lastMaintenance?: Date
  nextMaintenance?: Date
  healthScore: number // 0-100
  criticalityLevel: "low" | "medium" | "high" | "critical"
}

export interface MaintenancePrediction {
  equipmentId: string
  predictedFailureDate: Date
  confidence: number
  riskLevel: "low" | "medium" | "high" | "critical"
  recommendedAction: string
  estimatedCost: number
  factors: string[]
}

// Alert and notification types
export interface Alert {
  id: string
  type: "energy" | "maintenance" | "security" | "environmental" | "system"
  severity: "info" | "warning" | "error" | "critical"
  title: string
  message: string
  source: {
    type: "sensor" | "equipment" | "system" | "prediction"
    id: string
  }
  buildingId: string
  roomId?: string
  timestamp: Date
  acknowledged: boolean
  acknowledgedBy?: string
  acknowledgedAt?: Date
  resolved: boolean
  resolvedAt?: Date
  actions: string[]
}

// Analytics and reporting types
export interface CampusMetrics {
  timestamp: Date
  totalEnergyConsumption: number
  totalCarbonFootprint: number
  averageOccupancy: number
  maintenanceEfficiency: number
  costSavings: number
  sustainabilityScore: number
  buildingPerformance: Record<string, number>
}

export interface OptimizationRecommendation {
  id: string
  type: "energy" | "maintenance" | "space" | "sustainability"
  title: string
  description: string
  impact: "low" | "medium" | "high"
  estimatedSavings: number
  implementationCost: number
  paybackPeriod: number // months
  priority: number
  buildingIds: string[]
  status: "pending" | "approved" | "implemented" | "rejected"
}
