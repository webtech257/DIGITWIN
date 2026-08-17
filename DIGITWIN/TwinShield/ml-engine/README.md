# TwinShield Machine Learning & Behavioral Anomaly Engine (Day 6)

Python FastAPI microservice using `scikit-learn` IsolationForest for explainable behavioral anomaly detection.

---

## 📌 Feature Matrix (11 Input Dimensions)
1. `login_hour`: Hour of day (0-23)
2. `login_frequency`: Login count in last 24h
3. `device_change`: 0 = Known device, 1 = Unknown hardware device
4. `location_change`: 0 = Normal office location, 1 = Unusual IP / Remote
5. `resource_access_count`: Total database records accessed
6. `vip_access`: 0 = Standard data, 1 = VIP confidential data
7. `transaction_count`: Transaction query count
8. `download_volume`: Total data volume downloaded (bytes)
9. `api_frequency`: API requests per minute
10. `role_violation_count`: RBAC policy violation count
11. `session_duration`: Session duration in minutes

---

## 🚀 How to Run locally
```bash
cd TwinShield/ml-engine
python -m app.model # Train IsolationForest model & save pkl
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 📡 API Endpoint
`POST /analyze`

### Example Request Payload
```json
{
  "login_hour": 2,
  "login_frequency": 8,
  "device_change": 1,
  "location_change": 1,
  "resource_access_count": 300,
  "vip_access": 1,
  "transaction_count": 150,
  "download_volume": 15000000,
  "api_frequency": 35.0,
  "role_violation_count": 2,
  "session_duration": 45
}
```

### Example Response Payload
```json
{
  "anomaly_score": 0.91,
  "anomaly": true,
  "reasons": [
    "Unusual login time (02:00 AM)",
    "Unknown device detected",
    "Unusual network location / foreign IP",
    "High access volume (300 records)",
    "VIP confidential customer record access",
    "Large download volume (15.0 MB)",
    "RBAC policy violation attempted (2 instances)",
    "Abnormal API call velocity (35.0 req/min)"
  ]
}
```
