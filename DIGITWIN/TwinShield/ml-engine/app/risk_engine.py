from typing import List
from app.risk_config import risk_config
from app.attack_sequence import sequence_detector
from app.schemas import RiskCalculationRequest, RiskCalculationResponse, RiskFactor

class RiskEngineService:

    def calculate_risk(self, req: RiskCalculationRequest) -> RiskCalculationResponse:
        factors: List[RiskFactor] = []
        total_risk = 0.0

        # 1. ML Anomaly Score Signal (Max WEIGHT_ML_ANOMALY = 25.0 pts)
        ml_contrib = round(req.ml_anomaly_score * risk_config.WEIGHT_ML_ANOMALY, 1)
        if ml_contrib > 0:
            factors.append(RiskFactor(name="Behavioral ML Anomaly", contribution=ml_contrib))
            total_risk += ml_contrib

        # 2. RBAC Policy Violation Signal (Max WEIGHT_RBAC_VIOLATION = 22.0 pts)
        if req.is_rbac_violation:
            rbac_contrib = risk_config.WEIGHT_RBAC_VIOLATION
            factors.append(RiskFactor(name="Role Permission Violation", contribution=rbac_contrib))
            total_risk += rbac_contrib

        # 3. Resource Sensitivity Signal (Max WEIGHT_RESOURCE_SENSITIVITY = 18.0 pts)
        # Sensitivity ranges from 0 to 100
        sens_factor = min(1.0, req.resource_sensitivity / 100.0)
        sens_contrib = round(sens_factor * risk_config.WEIGHT_RESOURCE_SENSITIVITY, 1)
        if sens_contrib > 0:
            sens_name = "VIP Data Access" if req.resource_sensitivity >= 90 else "Sensitive Resource Access"
            factors.append(RiskFactor(name=sens_name, contribution=sens_contrib))
            total_risk += sens_contrib

        # 4. Device Anomaly Signal (Max WEIGHT_DEVICE_ANOMALY = 12.0 pts)
        if req.is_unknown_device:
            device_contrib = risk_config.WEIGHT_DEVICE_ANOMALY
            factors.append(RiskFactor(name="Unknown Device", contribution=device_contrib))
            total_risk += device_contrib

        # 5. Location Anomaly Signal (Max WEIGHT_LOCATION_ANOMALY = 10.0 pts)
        if req.is_unusual_location:
            loc_contrib = risk_config.WEIGHT_LOCATION_ANOMALY
            factors.append(RiskFactor(name="Unusual Location", contribution=loc_contrib))
            total_risk += loc_contrib

        # 6. Access Velocity Signal (Max WEIGHT_ACCESS_VELOCITY = 8.0 pts)
        # Normal velocity <= 10.0 req/min
        if req.api_velocity > 10.0:
            vel_factor = min(1.0, (req.api_velocity - 10.0) / 40.0)
            vel_contrib = round(vel_factor * risk_config.WEIGHT_ACCESS_VELOCITY, 1)
            if vel_contrib > 0:
                factors.append(RiskFactor(name="High API Request Velocity", contribution=vel_contrib))
                total_risk += vel_contrib

        # 7. Data Volume Signal (Max WEIGHT_DATA_VOLUME = 8.0 pts)
        # Normal volume <= 1 MB (1,000,000 bytes)
        if req.data_volume_bytes > 1000000:
            vol_mb = req.data_volume_bytes / 1000000.0
            vol_factor = min(1.0, vol_mb / 20.0) # Scales to 20MB
            vol_contrib = round(vol_factor * risk_config.WEIGHT_DATA_VOLUME, 1)
            if vol_contrib > 0:
                factors.append(RiskFactor(name="Large Data Exfiltration Volume", contribution=vol_contrib))
                total_risk += vol_contrib

        # 8. Attack Sequence Progression Signal (Max WEIGHT_ATTACK_SEQUENCE = 10.0 pts)
        seq_res = sequence_detector.detect_sequence(req.recent_activity_sequence)
        seq_factor = seq_res["sequence_score_factor"]
        seq_contrib = round(seq_factor * risk_config.WEIGHT_ATTACK_SEQUENCE, 1)
        if seq_contrib > 0:
            factors.append(RiskFactor(name=f"Attack Pattern Sequence ({seq_res['detected_stage']})", contribution=seq_contrib))
            total_risk += seq_contrib

        # 9. Historical Behavior Signal (Max WEIGHT_HISTORICAL_BEHAVIOR = 7.0 pts)
        if req.prior_risk_score > 60.0:
            hist_factor = min(1.0, (req.prior_risk_score - 60.0) / 30.0)
            hist_contrib = round(hist_factor * risk_config.WEIGHT_HISTORICAL_BEHAVIOR, 1)
            if hist_contrib > 0:
                factors.append(RiskFactor(name="Prior Suspicious Activity History", contribution=hist_contrib))
                total_risk += hist_contrib

        # Cap composite risk score strictly between 0.0 and 100.0
        final_risk_score = round(min(100.0, max(0.0, total_risk)), 1)

        # Risk Velocity (+%/min)
        risk_velocity = round(max(0.0, final_risk_score - req.prior_risk_score), 1)

        # Determine Adaptive Security Level & Recommended Action
        if final_risk_score > 95.0:
            level = "CRITICAL"
            recommended_action = "ISOLATE"
        elif final_risk_score >= 90.0:
            level = "STEP_UP_AUTHENTICATION"
            recommended_action = "REQUIRE_MFA"
        elif final_risk_score >= 80.0:
            level = "RESTRICTED"
            recommended_action = "BLOCK_SENSITIVE"
        elif final_risk_score >= 60.0:
            level = "ENHANCED_MONITORING"
            recommended_action = "LOG_ELEVATED"
        else:
            level = "NORMAL"
            recommended_action = "ALLOW"

        # Predicted threat type classification
        predicted_threat = "DATA_EXFILTRATION" if (req.data_volume_bytes > 5000000 or "Export" in seq_res["detected_stage"]) else "INSIDER_ANOMALY"
        if final_risk_score < 60.0:
            predicted_threat = "NONE"

        return RiskCalculationResponse(
            riskScore=final_risk_score,
            level=level,
            factors=factors,
            recommendedAction=recommended_action,
            predictedThreatType=predicted_threat,
            attackSequenceStage=seq_res["detected_stage"],
            riskVelocity=risk_velocity
        )

risk_engine_service = RiskEngineService()
