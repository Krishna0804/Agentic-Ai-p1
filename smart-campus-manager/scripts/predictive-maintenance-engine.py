"""
Predictive Maintenance Engine for Smart Campus Management
Uses machine learning algorithms to predict equipment failures and optimize maintenance schedules
"""

import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
import json
import asyncio

# Mock scikit-learn implementation (in production, use: from sklearn.ensemble import RandomForestRegressor, IsolationForest)
class RandomForestRegressor:
    def __init__(self, n_estimators=100, random_state=42):
        self.n_estimators = n_estimators
        self.random_state = random_state
        self.is_fitted = False
    
    def fit(self, X, y):
        self.is_fitted = True
        return self
    
    def predict(self, X):
        if not self.is_fitted:
            raise ValueError("Model not fitted")
        # Mock predictions
        return np.random.uniform(0.1, 0.9, len(X))

class IsolationForest:
    def __init__(self, contamination=0.1, random_state=42):
        self.contamination = contamination
        self.random_state = random_state
        self.is_fitted = False
    
    def fit(self, X):
        self.is_fitted = True
        return self
    
    def predict(self, X):
        if not self.is_fitted:
            raise ValueError("Model not fitted")
        # Mock anomaly detection (-1 for anomaly, 1 for normal)
        return np.random.choice([-1, 1], len(X), p=[self.contamination, 1-self.contamination])

@dataclass
class EquipmentData:
    """Equipment sensor data and metadata"""
    equipment_id: str
    equipment_type: str
    age_years: float
    usage_hours: float
    temperature: float
    vibration: float
    pressure: float
    current_draw: float
    last_maintenance_days: int
    maintenance_history: List[Dict]
    failure_history: List[Dict]

@dataclass
class MaintenancePrediction:
    """Predictive maintenance result"""
    equipment_id: str
    failure_probability: float
    days_to_failure: int
    confidence_score: float
    risk_level: str
    recommended_actions: List[str]
    estimated_cost: float
    factors: List[str]

class PredictiveMaintenanceEngine:
    """Main predictive maintenance engine using ML algorithms"""
    
    def __init__(self):
        self.failure_model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.anomaly_detector = IsolationForest(contamination=0.1, random_state=42)
        self.is_trained = False
        self.feature_columns = [
            'age_years', 'usage_hours', 'temperature', 'vibration', 
            'pressure', 'current_draw', 'last_maintenance_days'
        ]
        
    def prepare_features(self, equipment_data: EquipmentData) -> np.ndarray:
        """Extract features from equipment data"""
        features = [
            equipment_data.age_years,
            equipment_data.usage_hours,
            equipment_data.temperature,
            equipment_data.vibration,
            equipment_data.pressure,
            equipment_data.current_draw,
            equipment_data.last_maintenance_days
        ]
        return np.array(features).reshape(1, -1)
    
    def train_models(self, historical_data: List[EquipmentData]) -> None:
        """Train the predictive models with historical data"""
        print("[Maintenance Engine] Training predictive models...")
        
        # Prepare training data
        X_train = []
        y_train = []
        
        for equipment in historical_data:
            features = self.prepare_features(equipment).flatten()
            X_train.append(features)
            
            # Mock target: failure probability based on equipment condition
            failure_prob = self._calculate_failure_probability(equipment)
            y_train.append(failure_prob)
        
        X_train = np.array(X_train)
        y_train = np.array(y_train)
        
        # Train failure prediction model
        self.failure_model.fit(X_train, y_train)
        
        # Train anomaly detection model
        self.anomaly_detector.fit(X_train)
        
        self.is_trained = True
        print(f"[Maintenance Engine] Models trained on {len(historical_data)} equipment records")
    
    def predict_maintenance(self, equipment_data: EquipmentData) -> MaintenancePrediction:
        """Generate maintenance prediction for equipment"""
        if not self.is_trained:
            # Use mock training data if not trained
            self._mock_training()
        
        features = self.prepare_features(equipment_data)
        
        # Predict failure probability
        failure_prob = self.failure_model.predict(features)[0]
        
        # Detect anomalies
        anomaly_score = self.anomaly_detector.predict(features)[0]
        is_anomaly = anomaly_score == -1
        
        # Calculate days to failure
        days_to_failure = self._calculate_days_to_failure(failure_prob, equipment_data)
        
        # Determine risk level
        risk_level = self._determine_risk_level(failure_prob, days_to_failure, is_anomaly)
        
        # Generate recommendations
        recommendations = self._generate_recommendations(equipment_data, risk_level, is_anomaly)
        
        # Estimate maintenance cost
        estimated_cost = self._estimate_maintenance_cost(equipment_data, risk_level)
        
        # Calculate confidence score
        confidence_score = self._calculate_confidence(equipment_data, failure_prob)
        
        # Identify contributing factors
        factors = self._identify_factors(equipment_data, is_anomaly)
        
        return MaintenancePrediction(
            equipment_id=equipment_data.equipment_id,
            failure_probability=failure_prob,
            days_to_failure=days_to_failure,
            confidence_score=confidence_score,
            risk_level=risk_level,
            recommended_actions=recommendations,
            estimated_cost=estimated_cost,
            factors=factors
        )
    
    def _calculate_failure_probability(self, equipment: EquipmentData) -> float:
        """Calculate failure probability based on equipment condition"""
        # Age factor (older equipment more likely to fail)
        age_factor = min(equipment.age_years / 20, 1.0)  # Normalize to 20 years
        
        # Usage factor
        usage_factor = min(equipment.usage_hours / 50000, 1.0)  # Normalize to 50k hours
        
        # Temperature stress factor
        temp_factor = max(0, (equipment.temperature - 25) / 50)  # Above 25°C increases risk
        
        # Vibration factor
        vibration_factor = min(equipment.vibration / 10, 1.0)  # Normalize to 10 mm/s
        
        # Maintenance factor (longer since last maintenance = higher risk)
        maintenance_factor = min(equipment.last_maintenance_days / 365, 1.0)  # Normalize to 1 year
        
        # Combine factors
        failure_prob = (age_factor * 0.3 + usage_factor * 0.25 + temp_factor * 0.2 + 
                       vibration_factor * 0.15 + maintenance_factor * 0.1)
        
        return min(max(failure_prob, 0.01), 0.99)  # Clamp between 1% and 99%
    
    def _calculate_days_to_failure(self, failure_prob: float, equipment: EquipmentData) -> int:
        """Estimate days until potential failure"""
        # Higher failure probability = fewer days to failure
        base_days = int((1 - failure_prob) * 365)  # Up to 1 year
        
        # Adjust based on equipment type
        type_multipliers = {
            'hvac': 1.2,
            'elevator': 0.8,
            'generator': 1.5,
            'pump': 1.0,
            'lighting': 2.0
        }
        
        multiplier = type_multipliers.get(equipment.equipment_type, 1.0)
        return max(1, int(base_days * multiplier))
    
    def _determine_risk_level(self, failure_prob: float, days_to_failure: int, is_anomaly: bool) -> str:
        """Determine risk level based on prediction results"""
        if is_anomaly or failure_prob > 0.8 or days_to_failure <= 7:
            return "critical"
        elif failure_prob > 0.6 or days_to_failure <= 30:
            return "high"
        elif failure_prob > 0.4 or days_to_failure <= 90:
            return "medium"
        else:
            return "low"
    
    def _generate_recommendations(self, equipment: EquipmentData, risk_level: str, is_anomaly: bool) -> List[str]:
        """Generate maintenance recommendations"""
        recommendations = []
        
        if risk_level == "critical":
            recommendations.extend([
                "Schedule immediate inspection",
                "Prepare replacement parts",
                "Consider temporary shutdown if safe",
                "Notify maintenance team urgently"
            ])
        elif risk_level == "high":
            recommendations.extend([
                "Schedule maintenance within 1 week",
                "Order replacement parts",
                "Increase monitoring frequency",
                "Plan for potential downtime"
            ])
        elif risk_level == "medium":
            recommendations.extend([
                "Schedule preventive maintenance",
                "Review maintenance procedures",
                "Monitor performance trends"
            ])
        else:
            recommendations.extend([
                "Continue regular monitoring",
                "Maintain current schedule"
            ])
        
        # Equipment-specific recommendations
        if equipment.equipment_type == "hvac":
            if equipment.temperature > 30:
                recommendations.append("Check cooling system efficiency")
            recommendations.append("Inspect and replace filters if needed")
        elif equipment.equipment_type == "elevator":
            recommendations.extend([
                "Inspect cables and pulleys",
                "Check safety systems",
                "Lubricate moving parts"
            ])
        elif equipment.equipment_type == "generator":
            recommendations.extend([
                "Test under load conditions",
                "Check fuel system",
                "Inspect electrical connections"
            ])
        
        if is_anomaly:
            recommendations.append("Investigate unusual sensor readings")
        
        return recommendations
    
    def _estimate_maintenance_cost(self, equipment: EquipmentData, risk_level: str) -> float:
        """Estimate maintenance cost based on equipment and risk level"""
        base_costs = {
            'hvac': 800,
            'elevator': 2500,
            'generator': 1500,
            'pump': 600,
            'lighting': 200
        }
        
        base_cost = base_costs.get(equipment.equipment_type, 1000)
        
        # Risk level multipliers
        risk_multipliers = {
            'critical': 2.5,
            'high': 1.8,
            'medium': 1.2,
            'low': 1.0
        }
        
        multiplier = risk_multipliers.get(risk_level, 1.0)
        
        # Age factor (older equipment costs more to maintain)
        age_multiplier = 1 + (equipment.age_years / 20)
        
        return base_cost * multiplier * age_multiplier
    
    def _calculate_confidence(self, equipment: EquipmentData, failure_prob: float) -> float:
        """Calculate confidence score for the prediction"""
        # Base confidence on data quality and equipment history
        base_confidence = 0.7
        
        # More maintenance history = higher confidence
        history_factor = min(len(equipment.maintenance_history) / 10, 0.2)
        
        # Consistent sensor readings = higher confidence
        sensor_consistency = 0.1  # Mock value
        
        # Equipment age factor (more data for older equipment)
        age_factor = min(equipment.age_years / 10, 0.1)
        
        confidence = base_confidence + history_factor + sensor_consistency + age_factor
        return min(confidence, 0.95)
    
    def _identify_factors(self, equipment: EquipmentData, is_anomaly: bool) -> List[str]:
        """Identify key factors contributing to the prediction"""
        factors = []
        
        if equipment.age_years > 10:
            factors.append("Equipment age")
        
        if equipment.usage_hours > 30000:
            factors.append("High usage hours")
        
        if equipment.temperature > 30:
            factors.append("Elevated temperature")
        
        if equipment.vibration > 5:
            factors.append("Excessive vibration")
        
        if equipment.last_maintenance_days > 180:
            factors.append("Overdue maintenance")
        
        if is_anomaly:
            factors.append("Anomalous sensor readings")
        
        if len(equipment.failure_history) > 2:
            factors.append("Previous failure history")
        
        return factors if factors else ["Normal operating conditions"]
    
    def _mock_training(self):
        """Mock training with synthetic data"""
        print("[Maintenance Engine] Using mock training data...")
        
        # Generate synthetic training data
        mock_data = []
        for i in range(100):
            equipment = EquipmentData(
                equipment_id=f"mock-{i}",
                equipment_type=np.random.choice(['hvac', 'elevator', 'generator', 'pump']),
                age_years=np.random.uniform(1, 20),
                usage_hours=np.random.uniform(1000, 50000),
                temperature=np.random.uniform(20, 40),
                vibration=np.random.uniform(0, 10),
                pressure=np.random.uniform(0, 100),
                current_draw=np.random.uniform(10, 100),
                last_maintenance_days=np.random.randint(1, 365),
                maintenance_history=[],
                failure_history=[]
            )
            mock_data.append(equipment)
        
        self.train_models(mock_data)
    
    def batch_predict(self, equipment_list: List[EquipmentData]) -> List[MaintenancePrediction]:
        """Generate predictions for multiple equipment items"""
        predictions = []
        
        for equipment in equipment_list:
            try:
                prediction = self.predict_maintenance(equipment)
                predictions.append(prediction)
            except Exception as e:
                print(f"[Maintenance Engine] Error predicting for {equipment.equipment_id}: {e}")
        
        return predictions
    
    def generate_maintenance_schedule(self, predictions: List[MaintenancePrediction]) -> Dict:
        """Generate optimized maintenance schedule"""
        schedule = {
            'immediate': [],
            'this_week': [],
            'this_month': [],
            'next_quarter': []
        }
        
        for prediction in predictions:
            if prediction.risk_level == 'critical' or prediction.days_to_failure <= 3:
                schedule['immediate'].append(prediction)
            elif prediction.days_to_failure <= 7:
                schedule['this_week'].append(prediction)
            elif prediction.days_to_failure <= 30:
                schedule['this_month'].append(prediction)
            else:
                schedule['next_quarter'].append(prediction)
        
        return schedule

# Example usage and testing
async def main():
    """Test the predictive maintenance engine"""
    
    # Initialize the engine
    engine = PredictiveMaintenanceEngine()
    
    # Mock equipment data
    equipment_data = [
        EquipmentData(
            equipment_id="eq-001",
            equipment_type="hvac",
            age_years=8.5,
            usage_hours=35000,
            temperature=32.5,
            vibration=3.2,
            pressure=85.0,
            current_draw=45.2,
            last_maintenance_days=120,
            maintenance_history=[{"date": "2024-01-15", "type": "filter_change"}],
            failure_history=[]
        ),
        EquipmentData(
            equipment_id="eq-002",
            equipment_type="elevator",
            age_years=12.0,
            usage_hours=45000,
            temperature=28.0,
            vibration=6.8,
            pressure=0,
            current_draw=78.5,
            last_maintenance_days=45,
            maintenance_history=[{"date": "2024-02-01", "type": "safety_inspection"}],
            failure_history=[{"date": "2023-08-15", "type": "cable_wear"}]
        )
    ]
    
    print("Starting Predictive Maintenance Engine...")
    
    # Generate predictions
    predictions = engine.batch_predict(equipment_data)
    
    # Display results
    print("\n=== MAINTENANCE PREDICTIONS ===")
    for prediction in predictions:
        print(f"\nEquipment: {prediction.equipment_id}")
        print(f"Risk Level: {prediction.risk_level.upper()}")
        print(f"Failure Probability: {prediction.failure_probability:.2%}")
        print(f"Days to Failure: {prediction.days_to_failure}")
        print(f"Confidence: {prediction.confidence_score:.2%}")
        print(f"Estimated Cost: ${prediction.estimated_cost:.2f}")
        print(f"Key Factors: {', '.join(prediction.factors)}")
        print(f"Recommendations: {', '.join(prediction.recommended_actions[:3])}")
    
    # Generate maintenance schedule
    schedule = engine.generate_maintenance_schedule(predictions)
    
    print("\n=== MAINTENANCE SCHEDULE ===")
    for period, items in schedule.items():
        if items:
            print(f"{period.upper()}: {len(items)} items")
            for item in items:
                print(f"  - {item.equipment_id} ({item.risk_level} risk)")

if __name__ == "__main__":
    asyncio.run(main())
