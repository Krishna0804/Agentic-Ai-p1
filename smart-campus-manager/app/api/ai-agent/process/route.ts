import { type NextRequest, NextResponse } from "next/server"
import { CampusAIAgentService } from "@/lib/services/campus-ai-agent"

export async function POST(request: NextRequest) {
  try {
    const { sensorData, energyData } = await request.json()

    if (!sensorData || !energyData) {
      return NextResponse.json({ error: "Missing required data: sensorData and energyData" }, { status: 400 })
    }

    const agentService = CampusAIAgentService.getInstance()

    // Check if agent is already processing
    if (agentService.isCurrentlyProcessing()) {
      return NextResponse.json({ error: "AI Agent is currently processing another request" }, { status: 429 })
    }

    const results = await agentService.processCampusData(sensorData, energyData)

    return NextResponse.json({
      success: true,
      data: results,
    })
  } catch (error) {
    console.error("AI Agent processing error:", error)
    return NextResponse.json({ error: "Failed to process campus data" }, { status: 500 })
  }
}
