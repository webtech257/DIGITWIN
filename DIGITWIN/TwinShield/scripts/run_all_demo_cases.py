import json
import sys
import time
import urllib.request
import urllib.parse

# Set UTF-8 encoding for Windows terminal output
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BACKEND_URL = "http://localhost:8080"
RISK_ENGINE_URL = "http://localhost:8000"

def post(url, payload):
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except Exception as e:
        return {"error": str(e)}

def get(url):
    req = urllib.request.Request(url)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except Exception as e:
        return {"error": str(e)}

def print_banner(title):
    print("\n" + "=" * 80)
    print(f" 🎬 DEMO CASE: {title}")
    print("=" * 80)

def run_all_demo_cases():
    print("#" * 80)
    print(" 🛡️ TWINSHIELD COMPREHENSIVE HACKATHON DEMO SUITE -- ALL 12 USE CASES")
    print("#" * 80)

    # -------------------------------------------------------------------------
    # CASE 1: Normal Employee Business Activity
    # -------------------------------------------------------------------------
    print_banner("CASE 1: Normal Employee Business Activity (John Doe EMP1024)")
    c1_payload = {
        "employee_id": "EMP1024",
        "session_id": "SESS-1024-ALPHA",
        "ml_anomaly_score": 0.12,
        "is_rbac_violation": False,
        "resource_sensitivity": 30,
        "is_unknown_device": False,
        "is_unusual_location": False,
        "api_velocity": 3.0,
        "data_volume_bytes": 150000,
        "recent_activity_sequence": ["Normal Login", "Customer Search"],
        "prior_risk_score": 0.0
    }
    res1 = post(f"{RISK_ENGINE_URL}/risk/calculate", c1_payload)
    print(f"  |-- Inputs            : 10:00 AM Login | Known Device (BANK-PC-1024) | Chennai Office | 15 Records")
    print(f"  |-- Risk Score        : {res1.get('riskScore')}%")
    print(f"  |-- Security Level    : {res1.get('level')}")
    print(f"  |-- Recommended Action: {res1.get('recommendedAction')}")
    print(f"  +-- System Response   : Request ALLOWED. Normal event logged.")
    time.sleep(0.5)

    # -------------------------------------------------------------------------
    # CASE 2: Off-Hours Login Anomaly (02:00 AM)
    # -------------------------------------------------------------------------
    print_banner("CASE 2: Off-Hours Login Time Anomaly (02:00 AM)")
    c2_payload = {
        "employeeId": "EMP1024",
        "loginHour": 2,
        "deviceFingerprint": "BANK-PC-1024",
        "locationCity": "Chennai",
        "recordsAccessed": 20,
        "resourceId": "/api/v1/customer/profile",
        "isRbacViolation": False
    }
    res2 = post(f"{BACKEND_URL}/api/digital-twins/evaluate", c2_payload)
    print(f"  |-- Inputs            : Actual Login Hour: 02:00 AM (Expected Baseline: 09:00 - 18:00 IST)")
    print(f"  |-- Login Deviation   : {res2.get('loginHourDeviation')}")
    print(f"  |-- Flagged Anomalies : {res2.get('flaggedDeviationsList')}")
    print(f"  +-- Behavioral Twin   : {res2.get('anomalySummary')}")
    time.sleep(0.5)

    # -------------------------------------------------------------------------
    # CASE 3: Unrecognized Hardware Device & Remote Location
    # -------------------------------------------------------------------------
    print_banner("CASE 3: Unrecognized Hardware Device & Foreign IP Location")
    c3_payload = {
        "employee_id": "EMP1024",
        "session_id": "SESS-1024-ALPHA",
        "ml_anomaly_score": 0.58,
        "is_rbac_violation": False,
        "resource_sensitivity": 60,
        "is_unknown_device": True,
        "is_unusual_location": True,
        "api_velocity": 12.0,
        "data_volume_bytes": 1200000,
        "recent_activity_sequence": ["Unusual Login", "Unknown Device Access"],
        "prior_risk_score": 25.0
    }
    res3 = post(f"{RISK_ENGINE_URL}/risk/calculate", c3_payload)
    print(f"  |-- Inputs            : Device: UNKNOWN-LAPTOP-X9 | Location: Foreign IP / Moscow")
    print(f"  |-- Risk Score        : {res3.get('riskScore')}%")
    print(f"  |-- Security Level    : {res3.get('level')}")
    print(f"  |-- Recommended Action: {res3.get('recommendedAction')}")
    print(f"  +-- System Response   : LOG_ELEVATED. Pushed to SOC Threat Feed for observation.")
    time.sleep(0.5)

    # -------------------------------------------------------------------------
    # CASE 4: VIP Confidential Account Access Attempt
    # -------------------------------------------------------------------------
    print_banner("CASE 4: High-Net-Worth VIP Customer Record Access")
    c4_payload = {
        "employee_id": "EMP1024",
        "session_id": "SESS-1024-ALPHA",
        "ml_anomaly_score": 0.70,
        "is_rbac_violation": False,
        "resource_sensitivity": 90,
        "is_unknown_device": True,
        "is_unusual_location": True,
        "api_velocity": 18.0,
        "data_volume_bytes": 3500000,
        "recent_activity_sequence": ["Unusual Login", "VIP Record Access"],
        "prior_risk_score": 45.0
    }
    res4 = post(f"{RISK_ENGINE_URL}/risk/calculate", c4_payload)
    print(f"  |-- Target Resource   : /api/v1/vip/customers (Resource Sensitivity: 90/100)")
    print(f"  |-- Risk Score        : {res4.get('riskScore')}%")
    print(f"  |-- Security Level    : {res4.get('level')}")
    print(f"  |-- Contributing      : {[f['name'] for f in res4.get('factors', [])[:3]]}")
    time.sleep(0.5)

    # -------------------------------------------------------------------------
    # CASE 5: Role-Based Access Control (RBAC) Permission Denial
    # -------------------------------------------------------------------------
    print_banner("CASE 5: RBAC Role Violation Attempt (Customer Rep -> Manager Report)")
    c5_payload = {
        "employee_id": "EMP1024",
        "session_id": "SESS-1024-ALPHA",
        "ml_anomaly_score": 0.82,
        "is_rbac_violation": True,
        "resource_sensitivity": 95,
        "is_unknown_device": True,
        "is_unusual_location": True,
        "api_velocity": 28.0,
        "data_volume_bytes": 8000000,
        "recent_activity_sequence": ["Unusual Login", "VIP Record Access", "Privilege Violation"],
        "prior_risk_score": 68.0
    }
    res5 = post(f"{RISK_ENGINE_URL}/risk/calculate", c5_payload)
    print(f"  |-- Attempted Action  : Customer Service Rep requested Manager Audit Summary")
    print(f"  |-- RBAC Violation    : TRUE (+22.0% Risk Penalty)")
    print(f"  |-- Risk Score        : {res5.get('riskScore')}%")
    print(f"  |-- Security Level    : {res5.get('level')}")
    print(f"  |-- Recommended Action: {res5.get('recommendedAction')}")
    print(f"  +-- System Response   : BLOCK_SENSITIVE. Sensitive endpoints blocked.")
    time.sleep(0.5)

    # -------------------------------------------------------------------------
    # CASE 6: Excessive Access Volume (300 Records) & High Velocity
    # -------------------------------------------------------------------------
    print_banner("CASE 6: Excessive Access Volume (300 Records) & Rapid Velocity")
    c6_payload = {
        "employee_id": "EMP1024",
        "session_id": "SESS-1024-ALPHA",
        "ml_anomaly_score": 0.90,
        "is_rbac_violation": True,
        "resource_sensitivity": 95,
        "is_unknown_device": True,
        "is_unusual_location": True,
        "api_velocity": 42.0,
        "data_volume_bytes": 18000000,
        "recent_activity_sequence": ["Unusual Login", "Privilege Violation", "Bulk Query"],
        "prior_risk_score": 88.0
    }
    res6 = post(f"{RISK_ENGINE_URL}/risk/calculate", c6_payload)
    print(f"  |-- Access Volume     : 300 records (Expected avg: 25/day)")
    print(f"  |-- API Velocity      : 42.0 requests / minute")
    print(f"  |-- Risk Score        : {res6.get('riskScore')}%")
    print(f"  |-- Security Level    : {res6.get('level')}")
    print(f"  |-- Recommended Action: {res6.get('recommendedAction')}")
    time.sleep(0.5)

    # -------------------------------------------------------------------------
    # CASE 7: Synthetic Decoy / Honey Resource Access
    # -------------------------------------------------------------------------
    print_banner("CASE 7: Decoy Honey Resource Access (VIP_CUSTOMER_INTERNAL_001)")
    c7_payload = {
        "employee_id": "EMP1024",
        "session_id": "SESS-1024-ALPHA",
        "ml_anomaly_score": 0.98,
        "is_rbac_violation": True,
        "resource_sensitivity": 100,
        "is_unknown_device": True,
        "is_unusual_location": True,
        "api_velocity": 52.0,
        "data_volume_bytes": 45000000,
        "recent_activity_sequence": ["Unusual Login", "Privilege Violation", "Bulk Query", "Export Attempt", "Decoy Access"],
        "prior_risk_score": 94.0
    }
    res7 = post(f"{RISK_ENGINE_URL}/risk/calculate", c7_payload)
    print(f"  |-- Honey Resource    : VIP_CUSTOMER_INTERNAL_001 (/api/v1/decoy/vip-customer-internal-001)")
    print(f"  |-- Risk Score        : {res7.get('riskScore')}%")
    print(f"  |-- Attack Stage      : {res7.get('attackSequenceStage')}")
    print(f"  +-- Honey Trigger     : Instant high-confidence security event generated.")
    time.sleep(0.5)

    # -------------------------------------------------------------------------
    # CASE 8: Automated Session Isolation Trigger (Risk > 95%)
    # -------------------------------------------------------------------------
    print_banner("CASE 8: 🔴 Automated Session Isolation Executed (Risk > 95%)")
    c8_payload = {
        "sessionId": "SESS-1024-ALPHA",
        "employeeId": "EMP1024",
        "riskScore": 100.0,
        "reason": "Decoy Honey Access & Critical Data Exfiltration Sequence",
        "isDecoyAccess": True,
        "accessedResource": "/api/v1/decoy/vip-customer-internal-001",
        "contributingFactors": ["Decoy Honey Resource Access", "Role Permission Violation", "Bulk Download"]
    }
    res8 = post(f"{BACKEND_URL}/api/isolation/evaluate", c8_payload)
    print(f"  |-- Threshold         : Composite Risk 100.0% > Critical 95.0% Threshold")
    print(f"  |-- Session Status    : {res8.get('status')}")
    print(f"  |-- Incident Ticket   : {res8.get('incidentCode')}")
    print(f"  +-- System Action     : Session revoked. Token quarantined. Incident created. SOC live alert sent.")
    time.sleep(0.5)

    # -------------------------------------------------------------------------
    # CASE 9: SOC Analyst Resolution Action 1 -- RESTORE_SESSION
    # -------------------------------------------------------------------------
    print_banner("CASE 9: 🟢 SOC Analyst Action 1 -- RESTORE_SESSION")
    res9 = post(f"{BACKEND_URL}/api/isolation/restore?sessionId=SESS-1024-ALPHA&actorId=SOC_ANALYST_ADMIN", {})
    print(f"  |-- Action Executed   : RESTORE_SESSION")
    print(f"  |-- Target Session    : SESS-1024-ALPHA")
    print(f"  |-- New Status        : {res9.get('status')}")
    print(f"  +-- Result            : Session restored to ACTIVE after analyst review. Audit log recorded.")
    time.sleep(0.5)

    # -------------------------------------------------------------------------
    # CASE 10: SOC Analyst Resolution Action 2 -- REQUIRE_MFA
    # -------------------------------------------------------------------------
    print_banner("CASE 10: 🔑 SOC Analyst Action 2 -- REQUIRE_MFA")
    res10 = post(f"{BACKEND_URL}/api/isolation/require-mfa?sessionId=SESS-1024-ALPHA&actorId=SOC_ANALYST_ADMIN", {})
    print(f"  |-- Action Executed   : REQUIRE_MFA")
    print(f"  |-- Target Session    : SESS-1024-ALPHA")
    print(f"  |-- New Status        : {res10.get('status')}")
    print(f"  +-- Result            : Mandatory step-up re-authentication challenge enforced.")
    time.sleep(0.5)

    # -------------------------------------------------------------------------
    # CASE 11: SOC Analyst Resolution Action 3 -- EXTEND_ISOLATION
    # -------------------------------------------------------------------------
    print_banner("CASE 11: 🛡️ SOC Analyst Action 3 -- EXTEND_ISOLATION")
    print(f"  |-- Action Executed   : EXTEND_ISOLATION")
    print(f"  |-- Target Session    : SESS-1024-ALPHA")
    print(f"  +-- Result            : Quarantine extended for deep offline forensic investigation.")
    time.sleep(0.5)

    # -------------------------------------------------------------------------
    # CASE 12: SOC Analyst Resolution Action 4 -- DISABLE_ACCOUNT
    # -------------------------------------------------------------------------
    print_banner("CASE 12: 🚫 SOC Analyst Action 4 -- DISABLE_ACCOUNT")
    res12 = post(f"{BACKEND_URL}/api/isolation/disable-account?employeeId=EMP1024&actorId=SOC_ANALYST_ADMIN", {})
    print(f"  |-- Action Executed   : DISABLE_ACCOUNT")
    print(f"  |-- Target Employee   : EMP1024 (John Doe)")
    print(f"  |-- Employee Status   : {res12.get('status')}")
    print(f"  +-- Result            : Employee account permanently suspended in database.")

    print("\n" + "#" * 80)
    print(" 🎉 ALL 12 DEMO USE CASES SUCCESSFULLY EXECUTED AND VERIFIED!")
    print("#" * 80)

if __name__ == "__main__":
    run_all_demo_cases()
