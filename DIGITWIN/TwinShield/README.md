# 🛡️ TwinShield — Behavioral Digital Twin Insider Threat Platform

> **A Cloud-Integrated Behavioral Digital Twin Platform for Predictive Insider Threat Detection and Automated Session Isolation in Financial Systems**

---

## 📌 Project Overview

**TwinShield** is a cybersecurity platform designed for financial institutions to detect, predict, and respond to insider threats in real time.

The platform constructs a continuously evolving **Behavioral Digital Twin** for every employee. By analyzing live employee activity against learned behavioral baselines across 14 security dimensions, TwinShield detects subtle behavioral anomalies, calculates multi-factor security risk scores (0–100%), recognizes progressive attack sequences, and triggers **Automated Session Isolation** when composite risk crosses critical thresholds.

---

## 💡 Problem Statement

Traditional financial security models rely heavily on static Role-Based Access Control (RBAC) and perimeter security (firewalls, VPNs). However, insider threats (compromised credentials, rogue employees, privilege abuse) bypass perimeter controls because the attacker is already inside the network with valid credentials.

### Key Security Gaps Addressed:
1. **Valid Credentials Abuse**: An employee logged in during off-hours from an unknown device accessing bulk records violates no perimeter rule, but violates behavioral norms.
2. **Model Poisoning Risk**: Attackers gradually escalating access can poison traditional ML baselines if suspicious activity is automatically learned as "normal".
3. **Delayed Incident Response**: Manual security reviews take hours while exfiltration completes in minutes.

---

## 🏛️ System Architecture

TwinShield enforces **Dual-Plane Control Separation**:

```
                                TWINSHIELD PLATFORM ARCHITECTURE
                                
 ┌──────────────────────────────────────┐             ┌──────────────────────────────────────┐
 │       APPLICATION PLANE (PORT 5173)  │             │    SECURITY CONTROL PLANE (PORT 5174)│
 │   Employee Banking Web Application   │             │   SOC Security Operations Dashboard  │
 │ (Customer Search, Ledger, Persona)   │             │ (Live Stream, Threat Feed, Case File)│
 └──────────────────┬───────────────────┘             └──────────────────▲───────────────────┘
                    │                                                    │
                    │ HTTP Telemetry                                     │ Live Stream Stream
                    v                                                    │ (WebSocket / Auto-Poll)
 ┌───────────────────────────────────────────────────────────────────────┴───────────────────┐
 │                       TWINSHIELD CORE SECURITY ENGINE (PORT 8080)                         │
 │                           Spring Boot REST APIs & JPA Persistence                         │
 └──────────────────────────────────────┬────────────────────────────────────────────────────┘
                                        │
                                        │ Evaluation Request
                                        v
 ┌───────────────────────────────────────────────────────────────────────────────────────────┐
 │                    PYTHON ML & RISK CALCULATOR ENGINE (PORT 8000)                         │
 │          scikit-learn IsolationForest + 9-Signal Risk Engine + Attack Sequence            │
 └───────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

* **Frontend Applications**: React 18, Vite, Lucide Icons, Vanilla CSS (Dark High-Tech Banking System)
* **Backend Services**: Java 17, Spring Boot 3.2.3, Spring Data JPA, Hibernate ORM
* **Machine Learning Engine**: Python 3.11, FastAPI, `scikit-learn` (`IsolationForest`), `pandas`, `numpy`, `joblib`
* **Database & Persistence**: MySQL Relational Schema (H2 MySQL Compatibility Mode in memory)

---

## 📁 Repository Directory Structure

```
TwinShield/
├── backend/                             # Java 17 Spring Boot REST Backend
│   ├── src/main/java/com/twinshield/backend/
│   │   ├── controller/                  # REST Controllers (Employee, DigitalTwin, Isolation)
│   │   ├── dto/                         # Request & Response DTOs
│   │   ├── entity/                      # JPA Entities (Employee, Session, Incident, AuditLog)
│   │   ├── repository/                  # Spring Data Repositories
│   │   └── service/                     # Business Logic & Behavioral Digital Twin Engine
│   └── src/main/resources/
│       ├── application.properties       # Spring Boot Configuration
│       └── data.sql                     # Synthetic Database Seed Data
├── ml-engine/                           # Python FastAPI Machine Learning Microservice
│   ├── app/
│   │   ├── anomaly_detector.py          # IsolationForest Anomaly Engine & Reason Extractor
│   │   ├── attack_sequence.py           # Attack Sequence Progression Classifier
│   │   ├── main.py                      # FastAPI Endpoints (/analyze, /risk/calculate)
│   │   ├── model.py                     # IsolationForest Model Trainer
│   │   ├── risk_config.py               # Configurable 9-Signal Risk Weights
│   │   └── risk_engine.py               # Multi-Factor Risk Score Engine (0-100%)
│   ├── data/
│   │   ├── generate_data.py             # Synthetic Dataset Generator (1,200 records)
│   │   └── synthetic_activity_dataset.csv
│   ├── models/
│   │   └── isolation_forest.pkl         # Trained Model Artifact
│   └── requirements.txt
├── employee-portal/                     # Application Plane (React + Vite, Port 5173)
│   └── src/                             # Persona Switcher, Banking Pages, Access Denied
├── security-dashboard/                  # Security Control Plane (React + Vite, Port 5174)
│   └── src/                             # SOC Overview, Live Feed, Digital Twin, Isolation
├── database/
│   └── schema.sql                       # Relational Database Schema (13 Tables)
├── docs/
│   └── aws_deployment_plan.md           # Production AWS Cloud Deployment Architecture
└── scripts/
    ├── run_full_integration_test_suite.py # Complete System Integration Verification
    └── run_synthetic_attack_demo.py       # 15-Step Controlled Attack Simulation
```

---

## 🚀 How to Run Locally

### Prerequisites
* Java 17 (`OpenJDK 17`) & Maven 3.9+
* Python 3.11+
* Node.js 18+ & npm

### Step 1: Start Python ML & Risk Engine (Port 8000)
```bash
cd TwinShield/ml-engine
pip install -r requirements.txt
python app/model.py                      # Generates synthetic data & trains model
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Step 2: Start Spring Boot Backend (Port 8080)
```bash
cd TwinShield/backend
mvn spring-boot:run
```

### Step 3: Start Employee Banking Portal (Port 5173)
```bash
cd TwinShield/employee-portal
npm install
npx vite --port 5173
```

### Step 4: Start SOC Security Dashboard (Port 5174)
```bash
cd TwinShield/security-dashboard
npm install
npx vite --port 5174
```

---

## 🎬 15-Step End-to-End Demo Scenario

Run the automated demonstration script:
```bash
python TwinShield/scripts/run_synthetic_attack_demo.py
```

### Scenario Execution Flow:
1. **Normal Login**: `EMP1024` logs in at 10:00 AM from office PC $\rightarrow$ **Risk: 8.4%** (`ALLOW`)
2. **Normal Customer Search**: Queries 15 profiles $\rightarrow$ **Risk: 9.2%** (`ALLOW`)
3. **Unusual Off-Hours Login Attempt**: Login at 02:00 AM $\rightarrow$ Anomaly flagged
4. **Unknown Device Detected**: Unrecognized fingerprint `UNKNOWN-LAPTOP-X9` $\rightarrow$ Anomaly flagged
5. **VIP Customer Access**: Touches VIP record $\rightarrow$ **Risk: 43.0%** (`ALLOW`)
6. **Role Permission Violation**: Customer Service Rep attempts Manager Summary $\rightarrow$ **Risk: 88.3%** (`RESTRICTED`)
7. **Bulk Query Execution**: Fetches 300 records in single call $\rightarrow$ **Risk: 100.0%**
8. **Export Payload Attempt**: Data exfiltration action executed
9. **Increasing Risk Velocity**: Risk velocity leaps $+28.7\%/\text{min}$
10. **Predicted Attack Trajectory**: Attack Sequence stage identified as `Export Attempt`
11. **Risk Score Crosses 95% Threshold**: Composite score reaches `100.0%`
12. 🔴 **Automated Session Isolation Executed**: Session token revoked, status set to `ISOLATED`
13. **Live Dashboard Alert Stream**: Red threat ticker appears on SOC Dashboard
14. **Incident Case File Created**: Ticket `INC-2026-001` opened with forensic evidence
15. 🟢 **SOC Reversible Session Restoration**: Analyst clicks **Restore Session**, status reverts to `ACTIVE`

---

## 🔒 Security Features & Model Safeguards

1. **Model Poisoning Safeguard**: Suspicious or high-risk activities are **never** automatically added to an employee's behavioral baseline.
2. **Decoy Honey Resources**: Honey resources (`VIP_CUSTOMER_INTERNAL_001`, `CONFIDENTIAL_TRANSACTION_8821`, `MANAGER_FINANCIAL_REPORT`) trigger instant quarantine when accessed.
3. **Reversible Isolation**: Employee identities are never permanently deleted; session tokens are quarantined and can be restored by an analyst.
4. **Explainable AI (XAI)**: Every risk score includes an exact point-by-point factorization of contributing security factors.

---

## ⚠️ Prototype Limitations & Honest Disclaimers

> ⚠️ **Educational Prototype Notice**:
> * **ML Model Scope**: The `IsolationForest` model is an unsupervised student prototype trained on synthetic data. It is **not** a production-grade machine learning model.
> * **Threshold Disclaimer**: The `95.0%` critical isolation threshold is an illustrative design boundary for hackathon demonstration purposes and is **not** a scientifically validated security constant.
> * **Data Source**: This application strictly uses **synthetic banking data**. No real customer or bank records are used.

---

## 🔮 Future Improvements

1. Implementation of real-time WebSocket push notifications using STOMP / SockJS.
2. Federated learning for multi-branch financial baseline updates.
3. Integration with Cloud IAM / AWS KMS for hardware token revocation.
4. Advanced attack trajectory prediction using Graph Neural Networks (GNNs).
