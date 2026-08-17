from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import ActivityFeatures, AnalysisResponse, RiskCalculationRequest, RiskCalculationResponse
from app.anomaly_detector import anomaly_detector_service
from app.risk_engine import risk_engine_service

app = FastAPI(
    title="TwinShield ML & Security Risk Engine",
    description="Python FastAPI microservice for IsolationForest anomaly detection and multi-factor security risk scoring.",
    version="0.7.0-day7"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {
        "status": "ONLINE",
        "service": "TwinShield ML & Security Risk Engine",
        "engine": "Hybrid IsolationForest + Multi-Factor Risk Score Engine",
        "version": "0.7.0-day7"
    }

@app.post("/analyze", response_model=AnalysisResponse)
def analyze_activity(activity: ActivityFeatures):
    try:
        response = anomaly_detector_service.analyze_activity(activity)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ML Engine evaluation error: {str(e)}")

@app.post("/risk/calculate", response_model=RiskCalculationResponse)
def calculate_risk(request: RiskCalculationRequest):
    try:
        response = risk_engine_service.calculate_risk(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Risk Engine calculation error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=False)
