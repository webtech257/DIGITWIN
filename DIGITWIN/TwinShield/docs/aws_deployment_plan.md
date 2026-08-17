# ☁️ TwinShield -- Production AWS Cloud Deployment Architecture Plan

This document outlines the production cloud deployment strategy for **TwinShield** on Amazon Web Services (AWS), transitioning the local prototype into a high-availability, enterprise-grade cloud security infrastructure.

---

## 1. Cloud Architecture Overview

```
                                  AWS CLOUD ARCHITECTURE
                                  
                            [ AWS CloudFront (CDN) / Route 53 ]
                                            │
                                  [ AWS WAF (DDoS / OWASP) ]
                                            │
               ┌────────────────────────────┴────────────────────────────┐
               │                                                         │
  [ Application ALB (Public) ]                              [ Control Plane ALB (Private VPC) ]
   (Port 443 -> 5173 / 8080)                                 (Port 443 -> 5174 / 8000)
               │                                                         │
               ▼                                                         ▼
┌──────────────────────────────────────┐                ┌──────────────────────────────────────┐
│ ECS Fargate App Cluster              │                │ ECS Fargate Security Cluster         │
│  ├── React Employee Portal Container │                │  ├── React SOC Dashboard Container   │
│  └── Spring Boot Backend Container   │                │  └── Python FastAPI ML Risk Engine   │
└──────────────────┬───────────────────┘                └──────────────────┬───────────────────┘
                   │                                                       │
                   └───────────────────────────┬───────────────────────────┘
                                               │
                         ┌─────────────────────┴─────────────────────┐
                         │                                           │
                         ▼                                           ▼
             [ Amazon RDS MySQL 8.0 ]                     [ Amazon ElastiCache Redis ]
              (Multi-AZ Production DB)                     (Session Tokens & Rate Limits)
```

---

## 2. Component Deployment Blueprint

### A. Compute Layer (Amazon ECS on AWS Fargate)
* **Serverless Container Execution**: Eliminates EC2 instance management and scales automatically based on API velocity and CPU/Memory utilization.
* **Service Separation**:
  * `twinshield-employee-portal`: Nginx alpine container hosting built Vite React app.
  * `twinshield-backend-service`: OpenJDK 17 Spring Boot microservice (2 vCPU, 4GB RAM).
  * `twinshield-ml-engine-service`: Python 3.11 FastAPI microservice with pre-loaded `isolation_forest.pkl` model artifact.
  * `twinshield-soc-dashboard`: Secure SOC Control Plane container isolated behind IP-restricted security groups.

### B. Relational & Caching Database Tier
* **Amazon RDS for MySQL 8.0 (Multi-AZ)**: High availability with primary/standby failover across two Availability Zones (AZs).
* **Storage Encryption**: KMS encrypted storage (`db.r6g.xlarge`) holding tables: `behavioral_digital_twin_profiles`, `incidents`, `isolation_actions`, and `audit_logs`.
* **Amazon ElastiCache for Redis**: In-memory caching layer for active session tokens, real-time risk scores, and IP rate limits.

### C. Networking & Zero-Trust Isolation
* **VPC Subnet Layout**:
  * **Public Subnet**: AWS ALB, NAT Gateways.
  * **Private App Subnet**: Spring Boot & FastAPI Fargate Tasks.
  * **Private Data Subnet**: Multi-AZ RDS & ElastiCache.
* **Security Groups**: Tight ingress rules restricting Python ML Engine (`port 8000`) to accept calls **only** from the Spring Boot task security group.

### D. Incident Notification & Event Streaming
* **Amazon Managed Streaming for Apache Kafka (MSK)** or **Amazon Kinesis**: Real-time event streaming replacing local HTTP polling, allowing sub-millisecond dashboard updates.
* **Amazon SNS / SES**: Sends instant SMS/Email notifications to SOC incident response leads when a session crosses the 95% critical risk threshold.

---

## 3. Security, Compliance & Monitoring

* **AWS KMS (Key Management Service)**: Enforces envelope encryption for data at rest across database tables and log buckets.
* **AWS IAM Role-Based Access Control**: Task IAM roles granting fine-grained permissions (no hardcoded AWS credentials).
* **Amazon CloudWatch & AWS SecurityHub**: Centralized log streaming, metrics alarm triggering, and threat detection compliance auditing.
