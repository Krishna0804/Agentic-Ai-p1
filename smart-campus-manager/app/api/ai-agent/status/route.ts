import { NextResponse } from "next/server"
import { CampusAIAgentService } from "@/lib/services/campus-ai-agent"

export async function GET() {
  try {
    const agentService = CampusAIAgentService.getInstance()

    return NextResponse.json({
      isProcessing: agentService.isCurrentlyProcessing(),
      lastResults: agentService.getLastResults(),
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("AI Agent status error:", error)
    return NextResponse.json({ error: "Failed to get agent status" }, { status: 500 })
  }
}
