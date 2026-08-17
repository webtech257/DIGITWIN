# Definition of all 11 features analyzed by the TwinShield Anomaly Model

FEATURE_NAMES = [
    "login_hour",
    "login_frequency",
    "device_change",
    "location_change",
    "resource_access_count",
    "vip_access",
    "transaction_count",
    "download_volume",
    "api_frequency",
    "role_violation_count",
    "session_duration"
]

# Baseline normal bounds for explainable reason generation
NORMAL_BOUNDS = {
    "login_start_hour": 8,
    "login_end_hour": 18,
    "max_normal_records": 50,
    "max_normal_download_bytes": 1000000, # 1 MB
    "max_normal_api_freq": 12.0
}
