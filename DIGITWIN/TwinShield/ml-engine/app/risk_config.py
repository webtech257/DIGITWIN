# Configurable Weights & Thresholds for TwinShield Multi-Factor Risk Engine

class RiskConfig:
    def __init__(self):
        # Signal Weights (Maximum points summing to 100.0%)
        self.WEIGHT_ML_ANOMALY = 22.0
        self.WEIGHT_RBAC_VIOLATION = 20.0
        self.WEIGHT_RESOURCE_SENSITIVITY = 16.0
        self.WEIGHT_DEVICE_ANOMALY = 10.0
        self.WEIGHT_LOCATION_ANOMALY = 8.0
        self.WEIGHT_ACCESS_VELOCITY = 8.0
        self.WEIGHT_DATA_VOLUME = 8.0
        self.WEIGHT_ATTACK_SEQUENCE = 4.0
        self.WEIGHT_HISTORICAL_BEHAVIOR = 4.0

# Singleton configuration instance
risk_config = RiskConfig()
