# Configurable Weights & Thresholds for TwinShield Multi-Factor Risk Engine

class RiskConfig:
    def __init__(self):
        # Signal Weights (Maximum points out of 100)
        self.WEIGHT_ML_ANOMALY = 25.0
        self.WEIGHT_RBAC_VIOLATION = 22.0
        self.WEIGHT_RESOURCE_SENSITIVITY = 18.0
        self.WEIGHT_DEVICE_ANOMALY = 12.0
        self.WEIGHT_LOCATION_ANOMALY = 10.0
        self.WEIGHT_ACCESS_VELOCITY = 8.0
        self.WEIGHT_DATA_VOLUME = 8.0
        self.WEIGHT_ATTACK_SEQUENCE = 10.0
        self.WEIGHT_HISTORICAL_BEHAVIOR = 7.0

# Singleton configuration instance
risk_config = RiskConfig()
