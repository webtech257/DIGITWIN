import json
import sys
import urllib.request
import urllib.parse

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BACKEND_URL = "http://localhost:8080"
RISK_ENGINE_URL = "http://localhost:8000"

def get(url):
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

def post(url, payload):
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

def run_test_suite():
    passed = 0
    failed = 0

    print("=" * 80)
    print(" 🧪 TWINSHIELD DAY 10 FULL SYSTEM INTEGRATION TEST SUITE")
    print("=" * 80)

    # 1. Independent Service Verification
    print("\n--- [1/6] Independent Service Verification ---")
    try:
        b_res = get(f"{BACKEND_URL}/api/employees")
        print(f"  [PASS] Spring Boot Backend API (/api/employees): {len(b_res)} employees loaded.")
        passed += 1
    except Exception as e:
        print(f"  [FAIL] Spring Boot Backend: {e}")
        failed += 1

    try:
        m_res = get(f"{RISK_ENGINE_URL}/")
        print(f"  [PASS] Python FastAPI ML Engine (/): Engine={m_res.get('engine')}, Version={m_res.get('version')}.")
        passed += 1
    except Exception as e:
        print(f"  [FAIL] Python FastAPI ML Engine: {e}")
        failed += 1

    # 2. Behavioral Digital Twin Baseline Evaluation API
    print("\n--- [2/6] Behavioral Digital Twin Engine (/api/digital-twins/evaluate) ---")
    try:
        twin_payload = {
            "employeeId": "EMP1024",
            "loginHour": 14,
            "deviceFingerprint": "BANK-PC-1024",
            "locationCity": "Chennai",
            "recordsAccessed": 15,
            "resourceId": "/api/v1/customer/profile",
            "isRbacViolation": False
        }
        twin_res = post(f"{BACKEND_URL}/api/digital-twins/evaluate", twin_payload)
        assert twin_res["totalDeviationsCount"] == 0
        print(f"  [PASS] Digital Twin Evaluation (Normal Activity): Deviations={twin_res['totalDeviationsCount']}, Summary='{twin_res['anomalySummary']}'")
        passed += 1
    except Exception as e:
        print(f"  [FAIL] Digital Twin Evaluation: {e}")
        failed += 1

    # 3. IsolationForest Anomaly Engine API
    print("\n--- [3/6] Python ML Anomaly Detection (/analyze) ---")
    try:
        ml_payload = {
            "login_hour": 2,
            "login_frequency": 12,
            "device_change": 1,
            "location_change": 1,
            "resource_access_count": 300,
            "vip_access": 1,
            "transaction_count": 120,
            "download_volume": 25000000,
            "api_frequency": 45.0,
            "role_violation_count": 3,
            "session_duration": 45
        }
        ml_res = post(f"{RISK_ENGINE_URL}/analyze", ml_payload)
        assert ml_res["anomaly"] == True
        print(f"  [PASS] ML IsolationForest (/analyze): AnomalyScore={ml_res['anomaly_score']}, Anomaly={ml_res['anomaly']}, ReasonsCount={len(ml_res['reasons'])}")
        passed += 1
    except Exception as e:
        print(f"  [FAIL] ML IsolationForest: {e}")
        failed += 1

    # 4. Multi-Factor Risk & Attack Sequence API
    print("\n--- [4/6] Multi-Factor Risk Engine (/risk/calculate) ---")
    try:
        risk_payload = {
            "employee_id": "EMP1024",
            "session_id": "SESS-1024-ALPHA",
            "ml_anomaly_score": 0.95,
            "is_rbac_violation": True,
            "resource_sensitivity": 95,
            "is_unknown_device": True,
            "is_unusual_location": True,
            "api_velocity": 45.0,
            "data_volume_bytes": 25000000,
            "recent_activity_sequence": ["Unusual Login", "Privilege Violation", "Bulk Query", "Export Attempt"],
            "prior_risk_score": 88.0
        }
        risk_res = post(f"{RISK_ENGINE_URL}/risk/calculate", risk_payload)
        assert risk_res["riskScore"] >= 95.0
        assert risk_res["level"] == "CRITICAL"
        assert risk_res["recommendedAction"] == "ISOLATE"
        print(f"  [PASS] Risk Engine (/risk/calculate): Score={risk_res['riskScore']}%, Level={risk_res['level']}, Action={risk_res['recommendedAction']}, Velocity={risk_res['riskVelocity']}%/min")
        passed += 1
    except Exception as e:
        print(f"  [FAIL] Risk Engine: {e}")
        failed += 1

    # 5. Automated Session Isolation & Recovery APIs
    print("\n--- [5/6] Automated Session Isolation & Reversible Recovery (/api/isolation) ---")
    try:
        iso_payload = {
            "sessionId": "SESS-1024-ALPHA",
            "employeeId": "EMP1024",
            "riskScore": 97.6,
            "reason": "Synthetic End-to-End Integration Verification Test",
            "isDecoyAccess": True,
            "accessedResource": "/api/v1/decoy/vip-customer-internal-001",
            "contributingFactors": ["Role Permission Violation", "Decoy Honey Resource Access"]
        }
        iso_res = post(f"{BACKEND_URL}/api/isolation/evaluate", iso_payload)
        assert iso_res["isolated"] == True
        assert iso_res["status"] == "ISOLATED"
        print(f"  [PASS] Automated Session Isolation (/api/isolation/evaluate): Status={iso_res['status']}, Incident={iso_res['incidentCode']}")
        passed += 1

        restore_res = post(f"{BACKEND_URL}/api/isolation/restore?sessionId=SESS-1024-ALPHA&actorId=SOC_ANALYST", {})
        assert restore_res["success"] == True
        assert restore_res["status"] == "ACTIVE"
        print(f"  [PASS] Reversible Session Restoration (/api/isolation/restore): Status={restore_res['status']}")
        passed += 1
    except Exception as e:
        print(f"  [FAIL] Session Isolation/Restoration: {e}")
        failed += 1

    # 6. Database Persistence & Audit Log Verification
    print("\n--- [6/6] Database Persistence & Security Audit Trail ---")
    try:
        sec_events = get(f"{BACKEND_URL}/api/security-events")
        incidents = get(f"{BACKEND_URL}/api/incidents")
        print(f"  [PASS] Database Persistence Verified: SecurityEventsCount={len(sec_events)}, IncidentsCount={len(incidents)}.")
        passed += 1
    except Exception as e:
        print(f"  [FAIL] Database Persistence: {e}")
        failed += 1

    print("\n" + "=" * 80)
    print(f" SUMMARY: {passed} TESTS PASSED | {failed} TESTS FAILED")
    print("=" * 80)

if __name__ == "__main__":
    run_test_suite()
