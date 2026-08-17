# TwinShield System Architecture

## Overview Architecture

TwinShield enforces strict separation between the **Application Plane** (Employee Banking Portal) and the **Security Control Plane** (SOC Security Operations Dashboard & Risk Engine).

```
                      +-----------------------------------+
                      |      EMPLOYEE APPLICATION PLANE   |
                      |                                   |
                      |   [ Bank Employee Portal (React) ]|
                      +-----------------+-----------------+
                                        |
                                        v
                      +-----------------+-----------------+
                      |    [ Spring Boot Backend API ]    |
                      +-----------------+-----------------+
                                        |
                                        | Security Events (Real-Time)
                                        v
+---------------------------------------+---------------------------------------+
|                       SECURITY CONTROL PLANE                                  |
|                                                                               |
|   +---------------------+     +-----------------------+     +-------------+   |
|   |  Event Collector &  | --> | Behavioral Digital    | --> |  Policy &   |   |
|   |  Stream Processor   |     | Twin Profile Baseline |     | Role Engine |   |
|   +---------------------+     +-----------------------+     +------+------+   |
|                                                                    |          |
|   +---------------------+     +-----------------------+            v          |
|   | Automated Session   | <-- | Predictive Threat &   | <-- +-------------+   |
|   | Isolation Engine    |     | Risk Engine (Python)  |     | Anomaly ML  |   |
|   +----------+----------+     +-----------------------+     +-------------+   |
|              |                                                                |
|              v                                                                |
|   +----------+------------------------------------------------------------+   |
|   |              [ Security Operations Dashboard (React) ]                |   |
|   +-----------------------------------------------------------------------+   |
+-------------------------------------------------------------------------------+
```

## Adaptive Risk Response Levels

| Risk Score | Mode / Action Level | System Action |
|---|---|---|
| **0 - 60%** | **Normal** | Standard access allowed; routine security event logging |
| **60 - 80%** | **Enhanced Monitoring** | Elevated logging; increased baseline deviation tracking |
| **80 - 90%** | **Restricted Mode** | Sensitive actions (data export, VIP lookup) blocked; audit warning |
| **90 - 95%** | **Step-Up Authentication** | Re-authentication / MFA check required to proceed |
| **> 95%** | **Critical Threat (Isolation)** | Automated session token quarantine, real-time alert to SOC |
