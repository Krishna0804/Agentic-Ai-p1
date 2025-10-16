import type { SensorReading, IoTSensor } from "@/lib/types/campus"

// Simulate real-time sensor data
export class SensorSimulator {
  private static instance: SensorSimulator
  private readings: Map<string, SensorReading[]> = new Map()
  private intervals: Map<string, NodeJS.Timeout> = new Map()

  static getInstance(): SensorSimulator {
    if (!SensorSimulator.instance) {
      SensorSimulator.instance = new SensorSimulator()
    }
    return SensorSimulator.instance
  }

  startSimulation(sensors: IoTSensor[]): void {
    sensors.forEach((sensor) => {
      this.simulateSensor(sensor)
    })
  }

  private simulateSensor(sensor: IoTSensor): void {
    const interval = setInterval(() => {
      const reading = this.generateReading(sensor)

      if (!this.readings.has(sensor.id)) {
        this.readings.set(sensor.id, [])
      }

      const sensorReadings = this.readings.get(sensor.id)!
      sensorReadings.push(reading)

      // Keep only last 100 readings per sensor
      if (sensorReadings.length > 100) {
        sensorReadings.shift()
      }
    }, this.getSimulationInterval(sensor.type))

    this.intervals.set(sensor.id, interval)
  }

  private generateReading(sensor: IoTSensor): SensorReading {
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

    const config = baseValues[sensor.type]
    const value = Math.random() * (config.max - config.min) + config.min

    // Add some realistic variations based on time of day
    const hour = new Date().getHours()
    let adjustedValue = value

    if (sensor.type === "occupancy") {
      // Higher occupancy during business hours
      adjustedValue = hour >= 8 && hour <= 18 ? (Math.random() > 0.3 ? 1 : 0) : Math.random() > 0.8 ? 1 : 0
    } else if (sensor.type === "energy") {
      // Higher energy consumption during business hours
      const multiplier = hour >= 8 && hour <= 18 ? 1.5 : 0.7
      adjustedValue = value * multiplier
    }

    return {
      id: `reading-${sensor.id}-${Date.now()}`,
      sensorId: sensor.id,
      timestamp: new Date(),
      value: Math.round(adjustedValue * 100) / 100,
      unit: config.unit,
      quality: Math.random() > 0.95 ? "poor" : "good",
    }
  }

  private getSimulationInterval(sensorType: string): number {
    const intervals = {
      temperature: 30000, // 30 seconds
      humidity: 30000,
      occupancy: 10000, // 10 seconds
      energy: 60000, // 1 minute
      air_quality: 60000,
      water_flow: 15000, // 15 seconds
      vibration: 5000, // 5 seconds
      light: 30000,
    }
    return intervals[sensorType as keyof typeof intervals] || 30000
  }

  getLatestReadings(sensorId: string, count = 10): SensorReading[] {
    const readings = this.readings.get(sensorId) || []
    return readings.slice(-count)
  }

  getAllLatestReadings(): Map<string, SensorReading> {
    const latest = new Map<string, SensorReading>()
    this.readings.forEach((readings, sensorId) => {
      if (readings.length > 0) {
        latest.set(sensorId, readings[readings.length - 1])
      }
    })
    return latest
  }

  stopSimulation(): void {
    this.intervals.forEach((interval) => clearInterval(interval))
    this.intervals.clear()
  }
}
