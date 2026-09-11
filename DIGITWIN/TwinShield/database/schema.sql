-- ============================================================================
-- TwinShield Platform Database Schema (MySQL Compatible - Day 2)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS twinshield_db;
USE twinshield_db;

-- 1. ROLES
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. PERMISSIONS
CREATE TABLE IF NOT EXISTS permissions (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    description TEXT
);

-- 3. ROLE_PERMISSIONS JUNCTION
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id VARCHAR(50) NOT NULL,
    permission_id VARCHAR(50) NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- 4. EMPLOYEES
CREATE TABLE IF NOT EXISTS employees (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    department VARCHAR(100) NOT NULL,
    role_id VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- 5. RESOURCES
CREATE TABLE IF NOT EXISTS resources (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    sensitivity_score INT NOT NULL DEFAULT 30,
    is_decoy BOOLEAN DEFAULT FALSE,
    description TEXT
);

-- 6. SESSIONS
CREATE TABLE IF NOT EXISTS sessions (
    session_id VARCHAR(100) PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    location_city VARCHAR(100),
    device_fingerprint VARCHAR(255) NOT NULL,
    user_agent TEXT,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- 7. EMPLOYEE ACTIVITIES
CREATE TABLE IF NOT EXISTS employee_activities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    employee_id VARCHAR(50) NOT NULL,
    resource_id VARCHAR(100) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    records_accessed INT DEFAULT 1,
    data_volume_bytes BIGINT DEFAULT 0,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(session_id),
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (resource_id) REFERENCES resources(id)
);

-- 8. BEHAVIORAL DIGITAL TWIN PROFILES
CREATE TABLE IF NOT EXISTS behavioral_digital_twin_profiles (
    employee_id VARCHAR(50) PRIMARY KEY,
    normal_start_hour INT DEFAULT 9,
    normal_end_hour INT DEFAULT 18,
    avg_daily_accesses INT DEFAULT 25,
    avg_session_duration_minutes INT DEFAULT 480,
    known_devices TEXT,
    known_ip_ranges TEXT,
    typical_resources TEXT,
    last_baseline_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- 9. SECURITY EVENTS
CREATE TABLE IF NOT EXISTS security_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    employee_id VARCHAR(50) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(session_id),
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- 10. RISK SCORES
CREATE TABLE IF NOT EXISTS risk_scores (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    employee_id VARCHAR(50) NOT NULL,
    behavior_anomaly_score DOUBLE DEFAULT 0.0,
    role_violation_score DOUBLE DEFAULT 0.0,
    resource_sensitivity_score DOUBLE DEFAULT 0.0,
    device_risk_score DOUBLE DEFAULT 0.0,
    location_risk_score DOUBLE DEFAULT 0.0,
    risk_velocity DOUBLE DEFAULT 0.0,
    composite_risk_score DOUBLE NOT NULL,
    evaluated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(session_id),
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- 11. INCIDENTS
CREATE TABLE IF NOT EXISTS incidents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    incident_code VARCHAR(50) NOT NULL UNIQUE,
    employee_id VARCHAR(50) NOT NULL,
    session_id VARCHAR(100) NOT NULL,
    predicted_threat_type VARCHAR(100) NOT NULL,
    threat_confidence DOUBLE NOT NULL,
    risk_score_at_trigger DOUBLE NOT NULL,
    status VARCHAR(20) DEFAULT 'OPEN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (session_id) REFERENCES sessions(session_id)
);

-- 12. ISOLATION ACTIONS
CREATE TABLE IF NOT EXISTS isolation_actions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    employee_id VARCHAR(50) NOT NULL,
    incident_id BIGINT,
    trigger_risk_score DOUBLE NOT NULL,
    isolation_reason TEXT NOT NULL,
    isolated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'ISOLATED',
    resolved_by VARCHAR(100),
    resolved_at TIMESTAMP NULL,
    resolution_notes TEXT,
    FOREIGN KEY (session_id) REFERENCES sessions(session_id),
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (incident_id) REFERENCES incidents(id)
);

-- 13. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    actor_id VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    target_entity VARCHAR(100) NOT NULL,
    target_entity_id VARCHAR(100) NOT NULL,
    details TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- SYNTHETIC SEED DATA (DAY 2)
-- ============================================================================

INSERT IGNORE INTO roles (id, name, description) VALUES
('ROLE_CUST_SERVICE', 'Customer Service Representative', 'Frontline branch staff handling customer account queries.'),
('ROLE_MANAGER', 'Branch Manager', 'Managerial staff with elevated report access.'),
('ROLE_SECURITY_ANALYST', 'Security Operations Analyst', 'SOC analyst with threat monitoring & isolation control permissions.');

INSERT IGNORE INTO resources (id, name, resource_type, sensitivity_score, is_decoy, description) VALUES
('/api/v1/customer/profile', 'Customer Profile Search', 'API', 30, FALSE, 'Normal customer profile lookup'),
('/api/v1/transactions/search', 'Transaction Query', 'API', 60, FALSE, 'Transaction history lookup'),
('/api/v1/vip/customers', 'VIP Customer Records', 'API', 90, FALSE, 'High-net-worth VIP accounts'),
('/api/v1/reports/manager-summary', 'Managerial Financial Summary', 'REPORT', 95, FALSE, 'Internal financial audit reports'),
('/api/v1/decoy/confidential-vip-001', 'Confidential VIP Vault Decoy', 'DECOY', 100, TRUE, 'Honey resource to detect unauthorized access');

INSERT IGNORE INTO employees (id, name, email, department, role_id, status) VALUES
('EMP1024', 'Malavika', 'malavika@twinshield-bank.internal', 'Retail Banking', 'ROLE_CUST_SERVICE', 'ACTIVE'),
('EMP2031', 'Sarah Jenkins (Synthetic)', 'sarah.jenkins@twinshield-bank.internal', 'Branch Operations', 'ROLE_MANAGER', 'ACTIVE');

INSERT IGNORE INTO behavioral_digital_twin_profiles (employee_id, normal_start_hour, normal_end_hour, avg_daily_accesses, avg_session_duration_minutes, known_devices, known_ip_ranges, typical_resources) VALUES
('EMP1024', 9, 18, 25, 480, '["BANK-PC-1024"]', '["192.168.1.0/24"]', '["/api/v1/customer/profile", "/api/v1/transactions/search"]');
