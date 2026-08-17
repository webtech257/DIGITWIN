import os
import random
import pandas as pd
import numpy as np

def generate_synthetic_dataset(filename="synthetic_activity_dataset.csv", num_samples=1200):
    np.random.seed(42)
    random.seed(42)

    data = []
    
    # 1. Normal Banking Employee Activity (approx 90% of dataset)
    num_normal = int(num_samples * 0.9)
    for _ in range(num_normal):
        row = {
            "login_hour": random.randint(9, 17), # Normal business hours 9 AM - 5 PM
            "login_frequency": random.randint(1, 4),
            "device_change": 0, # Known device
            "location_change": 0, # Office network / Known city
            "resource_access_count": random.randint(5, 30), # Normal daily count
            "vip_access": 0, # No VIP access
            "transaction_count": random.randint(2, 20),
            "download_volume": random.randint(50000, 500000), # 50KB to 500KB
            "api_frequency": round(random.uniform(1.0, 8.0), 2),
            "role_violation_count": 0,
            "session_duration": random.randint(30, 480), # 30 mins to 8 hours
            "is_anomaly": 0
        }
        data.append(row)

    # 2. Synthetic Insider Threat Anomalies (approx 10% of dataset)
    num_anomalies = num_samples - num_normal
    for _ in range(num_anomalies):
        row = {
            "login_hour": random.choice([1, 2, 3, 4, 23]), # Off-hours 11 PM - 4 AM
            "login_frequency": random.randint(8, 25),
            "device_change": random.choice([0, 1, 1]), # High likelihood of unknown device
            "location_change": random.choice([0, 1, 1]), # High likelihood of unusual IP
            "resource_access_count": random.randint(150, 600), # Bulk customer query
            "vip_access": random.choice([0, 1, 1]), # VIP lookup
            "transaction_count": random.randint(50, 300),
            "download_volume": random.randint(5000000, 50000000), # 5MB to 50MB bulk exfiltration
            "api_frequency": round(random.uniform(15.0, 80.0), 2),
            "role_violation_count": random.randint(1, 5), # RBAC policy violation
            "session_duration": random.randint(5, 120),
            "is_anomaly": 1
        }
        data.append(row)

    df = pd.DataFrame(data)
    
    output_dir = os.path.dirname(filename)
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir, exist_ok=True)
        
    df.to_csv(filename, index=False)
    print(f"Generated synthetic dataset with {len(df)} records saved to {filename}")
    return df

if __name__ == "__main__":
    generate_synthetic_dataset()
