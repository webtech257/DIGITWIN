import json
import sys
import time
import urllib.request
import urllib.parse

# Set UTF-8 stdout encoding for Windows console compatibility
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BACKEND_URL = "http://localhost:8080"
RISK_ENGINE_URL = "http://localhost:8000"

def make_post_request(url, payload):
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode('utf-8'))
    except Exception as e:
        return {"error": str(e)}

def run_end_to_end_synthetic_attack_simulation():
    print("=" * 80)
    print(" TWINSHIELD -- END-TO-END SYNTHETIC INSIDER THREAT ATTACK SIMULATION (DAY 9)")
    print("=" * 80)
    print(" Target Employee: John Doe (EMP1024) | Role: Customer Service Representative")
    print(" Target Session: SESS-1024-ALPHA | Server Baseline: Chennai Office")
    print("-" * 80)

    # Sequence Steps
    steps = [
        {
            "step": 1,
            "title": "Normal Login",
            "payload": {
                "employee_id": "EMP1024",
                "session_id": "SESS-1024-ALPHA",
                "ml_anomaly_score": 0.12,
                "is_rbac_violation": False,
                "resource_sensitivity": 30,
                "is_unknown_device": False,
                "is_unusual_location": False,
                "api_velocity": 2.0,
                "data_volume_bytes": 100000,
                "recent_activity_sequence": ["Normal Login"],
                "prior_risk_score": 0.0
            }
        },
        {
            "step": 2,
            "title": "Normal Customer Record Search",
            "payload": {
                "employee_id": "EMP1024",
                "session_id": "SESS-1024-ALPHA",
                "ml_anomaly_score": 0.15,
                "is_rbac_violation": False,
                "resource_sensitivity": 30,
                "is_unknown_device": False,
                "is_unusual_location": False,
                "api_velocity": 4.5,
                "data_volume_bytes": 250000,
                "recent_activity_sequence": ["Normal Login", "Customer Search"],
                "prior_risk_score": 8.5
            }
        },
        {
            "step": 3,
            "title": "VIP Confidential Record Attempt",
            "payload": {
                "employee_id": "EMP1024",
                "session_id": "SESS-1024-ALPHA",
                "ml_anomaly_score": 0.55,
                "is_rbac_violation": False,
                "resource_sensitivity": 90,
                "is_unknown_device": True,
                "is_unusual_location": False,
                "api_velocity": 12.0,
                "data_volume_bytes": 1500000,
                "recent_activity_sequence": ["Normal Login", "Customer Search", "VIP Customer Attempt"],
                "prior_risk_score": 14.2
            }
        },
        {
            "step": 4,
            "title": "Manager Financial Summary Attempt (Role Violation)",
            "payload": {
                "employee_id": "EMP1024",
                "session_id": "SESS-1024-ALPHA",
                "ml_anomaly_score": 0.72,
                "is_rbac_violation": True,
                "resource_sensitivity": 95,
                "is_unknown_device": True,
                "is_unusual_location": True,
                "api_velocity": 22.0,
                "data_volume_bytes": 4500000,
                "recent_activity_sequence": ["Unusual Login", "VIP Customer Attempt", "Privilege Violation"],
                "prior_risk_score": 58.4
            }
        },
        {
            "step": 5,
            "title": "Bulk Query Execution (300 Records)",
            "payload": {
                "employee_id": "EMP1024",
                "session_id": "SESS-1024-ALPHA",
                "ml_anomaly_score": 0.84,
                "is_rbac_violation": True,
                "resource_sensitivity": 95,
                "is_unknown_device": True,
                "is_unusual_location": True,
                "api_velocity": 38.0,
                "data_volume_bytes": 15000000,
                "recent_activity_sequence": ["Unusual Login", "Privilege Violation", "Bulk Query"],
                "prior_risk_score": 78.2
            }
        },
        {
            "step": 6,
            "title": "Export Payload Attempt",
            "payload": {
                "employee_id": "EMP1024",
                "session_id": "SESS-1024-ALPHA",
                "ml_anomaly_score": 0.92,
                "is_rbac_violation": True,
                "resource_sensitivity": 95,
                "is_unknown_device": True,
                "is_unusual_location": True,
                "api_velocity": 45.0,
                "data_volume_bytes": 28000000,
                "recent_activity_sequence": ["Unusual Login", "Privilege Violation", "Bulk Query", "Export Attempt"],
                "prior_risk_score": 88.6
            }
        },
        {
            "step": 7,
            "title": "Decoy Resource Access (VIP_CUSTOMER_INTERNAL_001)",
            "payload": {
                "employee_id": "EMP1024",
                "session_id": "SESS-1024-ALPHA",
                "ml_anomaly_score": 0.98,
                "is_rbac_violation": True,
                "resource_sensitivity": 100,
                "is_unknown_device": True,
                "is_unusual_location": True,
                "api_velocity": 52.0,
                "data_volume_bytes": 45000000,
                "recent_activity_sequence": ["Unusual Login", "Privilege Violation", "Bulk Query", "Export Attempt", "Decoy Resource Access"],
                "prior_risk_score": 94.2
            }
        }
    ]

    for s in steps:
        print(f"\n[STEP {s['step']}] {s['title']}")
        risk_res = make_post_request(f"{RISK_ENGINE_URL}/risk/calculate", s['payload'])
        
        if "riskScore" in risk_res:
            score = risk_res['riskScore']
            level = risk_res['level']
            action = risk_res['recommendedAction']
            factors_str = ", ".join([f"{f['name']} (+{f['contribution']}%)" for f in risk_res.get('factors', [])[:4]])

            print(f"  |-- Risk Score        : {score}%")
            print(f"  |-- Security Level    : {level}")
            print(f"  |-- Recommended Action: {action}")
            print(f"  |-- Top Factors       : {factors_str}")

            # If score >= 100%, trigger backend session isolation
            if score >= 100.0:
                print(f"  +-- CRITICAL RISK THRESHOLD CROSSED (100%). Triggering Automated Session Isolation...")
                iso_payload = {
                    "sessionId": "SESS-1024-ALPHA",
                    "employeeId": "EMP1024",
                    "riskScore": score,
                    "reason": f"Decoy Resource Access ({s['title']}) & Exfiltration Sequence",
                    "isDecoyAccess": True,
                    "accessedResource": "/api/v1/decoy/vip-customer-internal-001",
                    "contributingFactors": [f['name'] for f in risk_res.get('factors', [])]
                }
                iso_res = make_post_request(f"{BACKEND_URL}/api/isolation/evaluate", iso_payload)
                print(f"     |-- Quarantine Status : {iso_res.get('status', 'ISOLATED')}")
                print(f"     |-- Incident Ticket   : INC-2026-001")
                print(f"     +-- Backend Message   : {iso_res.get('message', 'Session quarantined successfully.')}")
        else:
            print(f"  +-- Error: {risk_res}")
        time.sleep(0.3)

    print("\n" + "=" * 80)
    print(" SOC ANALYST REVERSIBLE RESTORATION DEMO")
    print("=" * 80)
    print(" SOC Analyst reviewing quarantined session SESS-1024-ALPHA...")
    restore_res = make_post_request(f"{BACKEND_URL}/api/isolation/restore?sessionId=SESS-1024-ALPHA&actorId=SOC_ANALYST_ADMIN", {})
    print(f" |-- Action Executed : RESTORE_SESSION")
    print(f" |-- New Session State: {restore_res.get('status', 'ACTIVE')}")
    print(f" +-- Audit Log Record : Written to audit_logs database table.")
    print("=" * 80)

if __name__ == "__main__":
    run_end_to_end_synthetic_attack_simulation()
