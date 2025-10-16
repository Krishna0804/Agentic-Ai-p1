"""
LangGraph AI Agent System for Smart Campus Management
This script sets up the core AI agent architecture using LangGraph
"""

import json
import asyncio
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
from enum import Enum

# Mock LangGraph implementation (in real scenario, use: from langgraph import StateGraph, END)
class StateGraph:
    def __init__(self):
        self.nodes = {}
        self.edges = {}
        self.entry_point = None
    
    def add_node(self, name: str, func):
        self.nodes[name] = func
        return self
    
    def add_edge(self, from_node: str, to_node: str):
        if from_node not in self.edges:
            self.edges[from_node] = []
        self.edges[from_node].append(to_node)
        return self
    
    def set_entry_point(self, node: str):
        self.entry_point = node
        return self
    
    def compile(self):
        return CompiledGraph(self.nodes, self.edges, self.entry_point)

class CompiledGraph:
    def __init__(self, nodes, edges, entry_point):
        self.nodes = nodes
        self.edges = edges
        self.entry_point = entry_point
    
    async def ainvoke(self, state):
        current_node = self.entry_point
        while current_node:
            if current_node in self.nodes:
                state = await self.nodes[current_node](state)
                # Simple routing logic
                if current_node in self.edges:
                    current_node = self.edges[current_node][0]
                else:
                    break
            else:
                break
        return state

END = "END"

# Agent State Management
@dataclass
class CampusAgentState:
    """State management for the campus AI agent"""
    sensor_data: Dict[str, Any]
    maintenance_requests: List[Dict[str, Any]]
    energy_data: Dict[str, Any]
    alerts: List[Dict[str, Any]]
    recommendations: List[Dict[str, Any]]
    current_task: Optional[str]
    context: Dict[str, Any]
    timestamp: datetime

class AgentTask(Enum):
    MONITOR_SENSORS = "monitor_sensors"
    PREDICT_MAINTENANCE = "predict_maintenance"
    OPTIMIZE_ENERGY = "optimize_energy"
    GENERATE_ALERTS = "generate_alerts"
    PROVIDE_RECOMMENDATIONS = "provide_recommendations"

class SmartCampusAgent:
    """Main AI agent for smart campus management"""
    
    def __init__(self):
        self.graph = self._build_agent_graph()
        self.state_history = []
        
    def _build_agent_graph(self) -> StateGraph:
        """Build the LangGraph workflow for campus management"""
        
        workflow = StateGraph()
        
        # Add nodes for different agent capabilities
        workflow.add_node("sensor_monitor", self._monitor_sensors)
        workflow.add_node("maintenance_predictor", self._predict_maintenance)
        workflow.add_node("energy_optimizer", self._optimize_energy)
        workflow.add_node("alert_generator", self._generate_alerts)
        workflow.add_node("recommendation_engine", self._generate_recommendations)
        workflow.add_node("decision_maker", self._make_decisions)
        
        # Define the workflow edges
        workflow.set_entry_point("sensor_monitor")
        workflow.add_edge("sensor_monitor", "maintenance_predictor")
        workflow.add_edge("maintenance_predictor", "energy_optimizer")
        workflow.add_edge("energy_optimizer", "alert_generator")
        workflow.add_edge("alert_generator", "recommendation_engine")
        workflow.add_edge("recommendation_engine", "decision_maker")
        workflow.add_edge("decision_maker", END)
        
        return workflow.compile()
    
    async def _monitor_sensors(self, state: CampusAgentState) -> CampusAgentState:
        """Monitor IoT sensor data and detect anomalies"""
        print(f"[Agent] Monitoring sensors at {datetime.now()}")
        
        # Simulate sensor data analysis
        sensor_anomalies = []
        
        for sensor_id, data in state.sensor_data.items():
            if self._detect_sensor_anomaly(data):
                sensor_anomalies.append({
                    "sensor_id": sensor_id,
                    "anomaly_type": "threshold_exceeded",
                    "severity": "medium",
                    "timestamp": datetime.now().isoformat()
                })
        
        state.context["sensor_anomalies"] = sensor_anomalies
        state.current_task = AgentTask.MONITOR_SENSORS.value
        
        return state
    
    async def _predict_maintenance(self, state: CampusAgentState) -> CampusAgentState:
        """Predict maintenance needs using ML algorithms"""
        print(f"[Agent] Predicting maintenance needs")
        
        # Simulate predictive maintenance analysis
        maintenance_predictions = []
        
        # Mock equipment health analysis
        equipment_data = [
            {"id": "eq-001", "health_score": 75, "type": "hvac"},
            {"id": "eq-002", "health_score": 45, "type": "elevator"},
            {"id": "eq-003", "health_score": 90, "type": "generator"}
        ]
        
        for equipment in equipment_data:
            if equipment["health_score"] < 60:
                days_to_failure = max(1, (equipment["health_score"] - 20) // 5)
                maintenance_predictions.append({
                    "equipment_id": equipment["id"],
                    "predicted_failure_date": (datetime.now() + timedelta(days=days_to_failure)).isoformat(),
                    "confidence": 0.85,
                    "recommended_action": f"Schedule preventive maintenance for {equipment['type']}",
                    "priority": "high" if days_to_failure <= 7 else "medium"
                })
        
        state.context["maintenance_predictions"] = maintenance_predictions
        state.current_task = AgentTask.PREDICT_MAINTENANCE.value
        
        return state
    
    async def _optimize_energy(self, state: CampusAgentState) -> CampusAgentState:
        """Optimize energy consumption across campus"""
        print(f"[Agent] Optimizing energy consumption")
        
        # Simulate energy optimization analysis
        energy_optimizations = []
        
        for building_id, energy_data in state.energy_data.items():
            current_consumption = energy_data.get("current_consumption", 1000)
            
            # Identify optimization opportunities
            if current_consumption > 1200:  # High consumption threshold
                potential_savings = current_consumption * 0.15  # 15% potential savings
                energy_optimizations.append({
                    "building_id": building_id,
                    "current_consumption": current_consumption,
                    "potential_savings": potential_savings,
                    "recommendations": [
                        "Adjust HVAC temperature setpoints",
                        "Implement smart lighting schedules",
                        "Optimize equipment runtime"
                    ],
                    "estimated_cost_savings": potential_savings * 0.15  # $0.15 per kWh
                })
        
        state.context["energy_optimizations"] = energy_optimizations
        state.current_task = AgentTask.OPTIMIZE_ENERGY.value
        
        return state
    
    async def _generate_alerts(self, state: CampusAgentState) -> CampusAgentState:
        """Generate alerts based on analysis results"""
        print(f"[Agent] Generating alerts")
        
        alerts = []
        
        # Generate alerts from sensor anomalies
        for anomaly in state.context.get("sensor_anomalies", []):
            alerts.append({
                "id": f"alert-{len(alerts) + 1}",
                "type": "sensor_anomaly",
                "severity": anomaly["severity"],
                "title": f"Sensor Anomaly Detected",
                "message": f"Sensor {anomaly['sensor_id']} showing abnormal readings",
                "timestamp": anomaly["timestamp"],
                "actions": ["Investigate sensor", "Check equipment status"]
            })
        
        # Generate alerts from maintenance predictions
        for prediction in state.context.get("maintenance_predictions", []):
            alerts.append({
                "id": f"alert-{len(alerts) + 1}",
                "type": "maintenance_prediction",
                "severity": "critical" if prediction["priority"] == "high" else "warning",
                "title": "Maintenance Required",
                "message": f"Equipment {prediction['equipment_id']} requires attention",
                "timestamp": datetime.now().isoformat(),
                "actions": [prediction["recommended_action"]]
            })
        
        state.alerts.extend(alerts)
        state.current_task = AgentTask.GENERATE_ALERTS.value
        
        return state
    
    async def _generate_recommendations(self, state: CampusAgentState) -> CampusAgentState:
        """Generate actionable recommendations"""
        print(f"[Agent] Generating recommendations")
        
        recommendations = []
        
        # Energy optimization recommendations
        for optimization in state.context.get("energy_optimizations", []):
            recommendations.append({
                "id": f"rec-{len(recommendations) + 1}",
                "type": "energy_optimization",
                "title": "Energy Consumption Optimization",
                "description": f"Reduce energy consumption in building {optimization['building_id']}",
                "impact": "high",
                "estimated_savings": optimization["estimated_cost_savings"],
                "actions": optimization["recommendations"],
                "priority": 8
            })
        
        # Maintenance recommendations
        for prediction in state.context.get("maintenance_predictions", []):
            recommendations.append({
                "id": f"rec-{len(recommendations) + 1}",
                "type": "maintenance",
                "title": "Preventive Maintenance",
                "description": f"Schedule maintenance for equipment {prediction['equipment_id']}",
                "impact": "critical" if prediction["priority"] == "high" else "medium",
                "actions": [prediction["recommended_action"]],
                "priority": 9 if prediction["priority"] == "high" else 6
            })
        
        state.recommendations.extend(recommendations)
        state.current_task = AgentTask.PROVIDE_RECOMMENDATIONS.value
        
        return state
    
    async def _make_decisions(self, state: CampusAgentState) -> CampusAgentState:
        """Make autonomous decisions based on analysis"""
        print(f"[Agent] Making autonomous decisions")
        
        decisions = []
        
        # Auto-approve low-risk recommendations
        for rec in state.recommendations:
            if rec["type"] == "energy_optimization" and rec["impact"] != "critical":
                decisions.append({
                    "recommendation_id": rec["id"],
                    "decision": "auto_approved",
                    "reason": "Low risk energy optimization",
                    "timestamp": datetime.now().isoformat()
                })
        
        # Flag high-priority items for human review
        critical_alerts = [alert for alert in state.alerts if alert["severity"] == "critical"]
        if critical_alerts:
            decisions.append({
                "type": "human_review_required",
                "reason": f"{len(critical_alerts)} critical alerts require immediate attention",
                "alert_ids": [alert["id"] for alert in critical_alerts]
            })
        
        state.context["decisions"] = decisions
        
        return state
    
    def _detect_sensor_anomaly(self, sensor_data: Dict[str, Any]) -> bool:
        """Simple anomaly detection logic"""
        # Mock anomaly detection - in real scenario, use ML models
        value = sensor_data.get("value", 0)
        sensor_type = sensor_data.get("type", "")
        
        thresholds = {
            "temperature": {"min": 15, "max": 30},
            "humidity": {"min": 20, "max": 80},
            "energy": {"min": 0, "max": 2500}
        }
        
        if sensor_type in thresholds:
            threshold = thresholds[sensor_type]
            return value < threshold["min"] or value > threshold["max"]
        
        return False
    
    async def process_campus_data(self, sensor_data: Dict, energy_data: Dict) -> Dict[str, Any]:
        """Main entry point for processing campus data"""
        
        # Initialize agent state
        initial_state = CampusAgentState(
            sensor_data=sensor_data,
            maintenance_requests=[],
            energy_data=energy_data,
            alerts=[],
            recommendations=[],
            current_task=None,
            context={},
            timestamp=datetime.now()
        )
        
        # Run the agent workflow
        final_state = await self.graph.ainvoke(initial_state)
        
        # Store state history
        self.state_history.append(final_state)
        
        # Return results
        return {
            "alerts": final_state.alerts,
            "recommendations": final_state.recommendations,
            "context": final_state.context,
            "timestamp": final_state.timestamp.isoformat()
        }

# Example usage and testing
async def main():
    """Test the smart campus agent"""
    
    # Initialize the agent
    agent = SmartCampusAgent()
    
    # Mock sensor data
    sensor_data = {
        "sensor-001": {"type": "temperature", "value": 35, "unit": "°C"},  # Anomaly - too hot
        "sensor-002": {"type": "humidity", "value": 45, "unit": "%"},
        "sensor-003": {"type": "energy", "value": 1800, "unit": "kWh"}
    }
    
    # Mock energy data
    energy_data = {
        "bld-001": {"current_consumption": 1350, "baseline": 1200},
        "bld-002": {"current_consumption": 980, "baseline": 1000}
    }
    
    # Process the data
    print("Starting Smart Campus AI Agent...")
    results = await agent.process_campus_data(sensor_data, energy_data)
    
    # Display results
    print("\n=== AGENT RESULTS ===")
    print(f"Generated {len(results['alerts'])} alerts")
    print(f"Generated {len(results['recommendations'])} recommendations")
    
    print("\nAlerts:")
    for alert in results['alerts']:
        print(f"  - {alert['severity'].upper()}: {alert['title']}")
    
    print("\nRecommendations:")
    for rec in results['recommendations']:
        print(f"  - {rec['type']}: {rec['title']}")
    
    print(f"\nProcessing completed at: {results['timestamp']}")

if __name__ == "__main__":
    asyncio.run(main())
