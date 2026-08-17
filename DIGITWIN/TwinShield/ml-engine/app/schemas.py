from pydantic import BaseModel, Field
from typing import List, Optional

class ActivityFeatures(BaseModel):
    login_hour: int = Field(..., description="Hour of day (0-23)", example=14)
    login_frequency: int = Field(default=1, description="Number of logins in last 24h", example=2)
    device_change: int = Field(default=0, description="0 = Known device, 1 = Unknown device", example=0)
    location_change: int = Field(default=0, description="0 = Normal location, 1 = Unusual location", example=0)
    resource_access_count: int = Field(default=1, description="Number of records accessed", example=25)
    vip_access: int = Field(default=0, description="0 = Standard, 1 = VIP data access", example=0)
    transaction_count: int = Field(default=0, description="Number of transaction queries", example=5)
    download_volume: int = Field(default=0, description="Downloaded data volume in bytes", example=150000)
    api_frequency: float = Field(default=1.0, description="API requests per minute", example=4.5)
    role_violation_count: int = Field(default=0, description="Number of RBAC policy violations", example=0)
    session_duration: int = Field(default=30, description="Active session duration in minutes", example=120)

class AnalysisResponse(BaseModel):
    anomaly_score: float = Field(..., description="Normalized anomaly score between 0.0 (Normal) and 1.0 (Critical Anomaly)")
    anomaly: bool = Field(..., description="True if activity represents a high-risk anomaly")
    reasons: List[str] = Field(..., description="Human-readable explainable factors contributing to anomaly score")

class RiskCalculationRequest(BaseModel):
    employee_id: str = Field(..., example="EMP1024")
    session_id: str = Field(..., example="SESS-1024-ALPHA")
    ml_anomaly_score: float = Field(default=0.0, description="Score from ML model (0.0 to 1.0)", example=0.63)
    is_rbac_violation: bool = Field(default=False, example=True)
    resource_sensitivity: int = Field(default=30, description="Resource sensitivity (0 to 100)", example=90)
    is_unknown_device: bool = Field(default=False, example=True)
    is_unusual_location: bool = Field(default=False, example=True)
    api_velocity: float = Field(default=1.0, description="API calls per minute", example=45.0)
    data_volume_bytes: int = Field(default=0, description="Data volume in bytes", example=25000000)
    recent_activity_sequence: List[str] = Field(default=[], example=["Unusual Login", "VIP Customer Access", "Export Attempt"])
    prior_risk_score: float = Field(default=0.0, description="Previous session risk score for velocity calculation", example=75.0)

class RiskFactor(BaseModel):
    name: str
    contribution: float

class RiskCalculationResponse(BaseModel):
    riskScore: float = Field(..., description="Composite Risk Score between 0.0 and 100.0%")
    level: str = Field(..., description="NORMAL, ENHANCED_MONITORING, RESTRICTED, STEP_UP_AUTHENTICATION, or CRITICAL")
    factors: List[RiskFactor] = Field(..., description="List of contributing risk factors and their exact point values")
    recommendedAction: str = Field(..., description="ALLOW, LOG_ELEVATED, BLOCK_SENSITIVE, REQUIRE_MFA, or ISOLATE")
    predictedThreatType: str = Field(default="NONE", description="Type of threat identified from attack sequence")
    attackSequenceStage: str = Field(default="None", description="Current stage in the attack progression chain")
    riskVelocity: float = Field(default=0.0, description="Rate of change in risk score (+%/min)")
