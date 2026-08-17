package com.twinshield.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "incidents")
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "incident_code", nullable = false, unique = true, length = 50)
    private String incidentCode;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @Column(name = "predicted_threat_type", nullable = false, length = 100)
    private String predictedThreatType;

    @Column(name = "threat_confidence", nullable = false)
    private Double threatConfidence;

    @Column(name = "risk_score_at_trigger", nullable = false)
    private Double riskScoreAtTrigger;

    @Column(name = "status", length = 20)
    private String status = "OPEN";

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Incident() {
        this.createdAt = LocalDateTime.now();
    }

    public Incident(String incidentCode, Employee employee, Session session, String predictedThreatType, Double threatConfidence, Double riskScoreAtTrigger, String status) {
        this.incidentCode = incidentCode;
        this.employee = employee;
        this.session = session;
        this.predictedThreatType = predictedThreatType;
        this.threatConfidence = threatConfidence;
        this.riskScoreAtTrigger = riskScoreAtTrigger;
        this.status = status != null ? status : "OPEN";
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getIncidentCode() { return incidentCode; }
    public void setIncidentCode(String incidentCode) { this.incidentCode = incidentCode; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public Session getSession() { return session; }
    public void setSession(Session session) { this.session = session; }

    public String getPredictedThreatType() { return predictedThreatType; }
    public void setPredictedThreatType(String predictedThreatType) { this.predictedThreatType = predictedThreatType; }

    public Double getThreatConfidence() { return threatConfidence; }
    public void setThreatConfidence(Double threatConfidence) { this.threatConfidence = threatConfidence; }

    public Double getRiskScoreAtTrigger() { return riskScoreAtTrigger; }
    public void setRiskScoreAtTrigger(Double riskScoreAtTrigger) { this.riskScoreAtTrigger = riskScoreAtTrigger; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
