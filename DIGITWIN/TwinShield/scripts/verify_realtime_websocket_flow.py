import json
import sys
import time
import urllib.request

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BACKEND_URL = "http://localhost:8080"

def send_activity(resourceId, actionType, recordsAccessed, isRbacViolation=False):
    payload = {
        "sessionId": "SESS-1024-ALPHA",
        "employeeId": "EMP1024",
        "resourceId": resourceId,
        "actionType": actionType,
        "recordsAccessed": recordsAccessed,
        "dataVolumeBytes": recordsAccessed * 3000,
        "isRbacViolation": isRbacViolation
    }
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(f"{BACKEND_URL}/api/activities", data=data, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

def test_realtime_flow():
    print("=" * 80)
    print(" ⚡ TWINSHIELD REAL-TIME WEBSOCKET PIPELINE VERIFICATION")
    print("=" * 80)

    print("\n1. Step 1: Normal Customer Access")
    res1 = send_activity("/api/v1/customer/profile", "SEARCH_CUSTOMER", 15, False)
    print(f"   --> Activity Logged: ID={res1.get('id')}, Resource={res1.get('resource').get('id')}")
    time.sleep(1.0)

    print("\n2. Step 2: Restricted VIP Resource Access")
    res2 = send_activity("/api/v1/vip/customers", "VIEW_VIP_PROFILE", 25, False)
    print(f"   --> Activity Logged: ID={res2.get('id')}, Resource={res2.get('resource').get('id')}")
    time.sleep(1.0)

    print("\n3. Step 3: RBAC Permission Violation Attempt")
    res3 = send_activity("/api/v1/reports/manager-summary", "VIEW_MANAGER_REPORT", 50, True)
    print(f"   --> Activity Logged: ID={res3.get('id')}, Resource={res3.get('resource').get('id')}")
    time.sleep(1.0)

    print("\n4. Step 4: Synthetic Decoy Access & Critical Threshold Crossing (>95%)")
    res4 = send_activity("/api/v1/decoy/vip-customer-internal-001", "EXPORT_PAYLOAD", 300, True)
    print(f"   --> Activity Logged: ID={res4.get('id')}, Resource={res4.get('resource').get('id')}")
    time.sleep(1.0)

    print("\n" + "=" * 80)
    print(" 🟢 VERIFICATION COMPLETE: ALL ACTIVITIES SENT TO REAL-TIME WEBSOCKET PIPELINE")
    print("=" * 80)

if __name__ == "__main__":
    test_realtime_flow()
