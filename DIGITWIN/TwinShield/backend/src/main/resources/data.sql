-- Initial Seed Data for TwinShield Spring Boot Backend (Day 9 Update)

INSERT IGNORE INTO roles (id, name, description, created_at) VALUES
('ROLE_CUST_SERVICE', 'Customer Service Representative', 'Frontline branch staff handling customer account queries.', CURRENT_TIMESTAMP),
('ROLE_MANAGER', 'Branch Manager', 'Managerial staff with elevated report access.', CURRENT_TIMESTAMP),
('ROLE_ADMIN', 'System Administrator', 'Full administrative control over employees, role provisioning, and security rules.', CURRENT_TIMESTAMP),
('ROLE_COMPLIANCE', 'Compliance Officer', 'Compliance audit and policy oversight role.', CURRENT_TIMESTAMP),
('ROLE_SECURITY_ANALYST', 'Security Operations Analyst', 'SOC analyst with threat monitoring & isolation control permissions.', CURRENT_TIMESTAMP);

INSERT IGNORE INTO resources (id, name, resource_type, sensitivity_score, is_decoy, description) VALUES
('/api/v1/customer/profile', 'Customer Profile Search', 'API', 30, FALSE, 'Normal customer profile lookup'),
('/api/v1/transactions/search', 'Transaction Query', 'API', 60, FALSE, 'Transaction history lookup'),
('/api/v1/vip/customers', 'VIP Customer Records', 'API', 90, FALSE, 'High-net-worth VIP accounts'),
('/api/v1/reports/manager-summary', 'Managerial Financial Summary', 'REPORT', 95, FALSE, 'Internal financial audit reports'),
('/api/v1/decoy/vip-customer-internal-001', 'VIP_CUSTOMER_INTERNAL_001', 'DECOY', 100, TRUE, 'Honey resource to detect unauthorized VIP exfiltration'),
('/api/v1/decoy/confidential-transaction-8821', 'CONFIDENTIAL_TRANSACTION_8821', 'DECOY', 100, TRUE, 'Synthetic honeypot transaction record'),
('/api/v1/decoy/manager-financial-report', 'MANAGER_FINANCIAL_REPORT', 'DECOY', 100, TRUE, 'Decoy executive financial summary report');

INSERT IGNORE INTO employees (id, name, email, department, role_id, status, created_at) VALUES
('EMP1024', 'Malavika', 'malavika@twinshield-bank.internal', 'Retail Banking', 'ROLE_CUST_SERVICE', 'ACTIVE', CURRENT_TIMESTAMP),
('EMP2031', 'Sarah Jenkins', 'sarah.jenkins@twinshield-bank.internal', 'Branch Operations', 'ROLE_MANAGER', 'ACTIVE', CURRENT_TIMESTAMP),
('EMP5099', 'Alex Vance', 'alex.vance@twinshield-bank.internal', 'IT Security & Admin', 'ROLE_ADMIN', 'ACTIVE', CURRENT_TIMESTAMP);

UPDATE employees SET name = 'Malavika', email = 'malavika@twinshield-bank.internal' WHERE id = 'EMP1024';

INSERT IGNORE INTO behavioral_digital_twin_profiles (employee_id, normal_start_hour, normal_end_hour, avg_daily_accesses, avg_session_duration_minutes, normal_location, known_devices, known_ip_ranges, typical_resources, last_baseline_update) VALUES
('EMP1024', 9, 18, 25, 480, 'Chennai', 'BANK-PC-1024', '192.168.1.0/24', '/api/v1/customer/profile, /api/v1/transactions/search', CURRENT_TIMESTAMP),
('EMP2031', 8, 19, 40, 540, 'Chennai', 'BANK-PC-2031', '192.168.1.0/24', '/api/v1/customer/profile, /api/v1/transactions/search, /api/v1/vip/customers', CURRENT_TIMESTAMP);

INSERT IGNORE INTO sessions (session_id, employee_id, ip_address, location_city, device_fingerprint, user_agent, login_time, last_activity_time, status) VALUES
('SESS-1024-ALPHA', 'EMP1024', '192.168.1.45', 'Chennai', 'BANK-PC-1024-HASH', 'Mozilla/5.0 (Windows NT 10.0)', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'ACTIVE');

INSERT IGNORE INTO security_events (id, session_id, employee_id, event_type, severity, description, created_at) VALUES
(1001, 'SESS-1024-ALPHA', 'EMP1024', 'VIP_ACCESS_ATTEMPT', 'HIGH', 'Employee attempted to access VIP record without prior approval.', CURRENT_TIMESTAMP);

INSERT IGNORE INTO incidents (id, incident_code, employee_id, session_id, predicted_threat_type, threat_confidence, risk_score_at_trigger, status, created_at) VALUES
(5001, 'INC-2026-001', 'EMP1024', 'SESS-1024-ALPHA', 'DATA_EXFILTRATION', 94.7, 97.6, 'OPEN', CURRENT_TIMESTAMP);

