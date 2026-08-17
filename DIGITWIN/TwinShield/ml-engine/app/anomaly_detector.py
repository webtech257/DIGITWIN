import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import numpy as np
import pandas as pd
from app.model import load_trained_model
from app.risk_features import FEATURE_NAMES, NORMAL_BOUNDS
from app.schemas import ActivityFeatures, AnalysisResponse

class AnomalyDetectorService:

    def __init__(self):
        self.model = load_trained_model()

    def analyze_activity(self, activity: ActivityFeatures) -> AnalysisResponse:
        # Prepare feature vector matching training schema
        feature_dict = {
            "login_hour": activity.login_hour,
            "login_frequency": activity.login_frequency,
            "device_change": activity.device_change,
            "location_change": activity.location_change,
            "resource_access_count": activity.resource_access_count,
            "vip_access": activity.vip_access,
            "transaction_count": activity.transaction_count,
            "download_volume": activity.download_volume,
            "api_frequency": activity.api_frequency,
            "role_violation_count": activity.role_violation_count,
            "session_duration": activity.session_duration
        }

        X = pd.DataFrame([feature_dict])[FEATURE_NAMES]

        # 1. IsolationForest decision score
        raw_score = self.model.decision_function(X)[0]
        
        # Normalize score into range [0.0, 1.0] where 1.0 is maximum anomaly risk
        norm_score = 1.0 / (1.0 + np.exp(raw_score * 6))
        anomaly_score = round(float(norm_score), 2)

        # 2. Extract Explainable Factors (Reasons)
        reasons = []

        if activity.login_hour < NORMAL_BOUNDS["login_start_hour"] or activity.login_hour >= NORMAL_BOUNDS["login_end_hour"]:
            reasons.append(f"Unusual login time ({activity.login_hour:02d}:00)")

        if activity.device_change == 1:
            reasons.append("Unknown device detected")

        if activity.location_change == 1:
            reasons.append("Unusual network location / foreign IP")

        if activity.resource_access_count > NORMAL_BOUNDS["max_normal_records"]:
            reasons.append(f"High access volume ({activity.resource_access_count} records)")

        if activity.vip_access == 1:
            reasons.append("VIP confidential customer record access")

        if activity.download_volume > NORMAL_BOUNDS["max_normal_download_bytes"]:
            mb_size = round(activity.download_volume / 1000000.0, 1)
            reasons.append(f"Large download volume ({mb_size} MB)")

        if activity.role_violation_count > 0:
            reasons.append(f"RBAC policy violation attempted ({activity.role_violation_count} instances)")

        if activity.api_frequency > NORMAL_BOUNDS["max_normal_api_freq"]:
            reasons.append(f"Abnormal API call velocity ({activity.api_frequency} req/min)")

        # Determine anomaly flag (if score >= 0.50 or any major deviation present)
        is_anomaly = anomaly_score >= 0.50 or len(reasons) >= 2

        if not reasons and not is_anomaly:
            reasons = ["Activity aligns with normal behavioral baseline"]

        return AnalysisResponse(
            anomaly_score=anomaly_score,
            anomaly=is_anomaly,
            reasons=reasons
        )

anomaly_detector_service = AnomalyDetectorService()
