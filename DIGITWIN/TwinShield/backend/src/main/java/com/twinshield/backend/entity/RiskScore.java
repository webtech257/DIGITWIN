package com.twinshield.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "risk_scores")
public class RiskScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "behavior_anomaly_score")
    private Double behaviorAnomalyScore = 0.0;

    @Column(name = "role_violation_score")
    private Double roleViolationScore = 0.0;

    @Column(name = "resource_sensitivity_score")
    private Double resourceSensitivityScore = 0.0;

    @Column(name = "device_risk_score")
    private Double deviceRiskScore = 0.0;

    @Column(name = "location_risk_score")
    private Double locationRiskScore = 0.0;

    @Column(name = "risk_velocity")
    private Double riskVelocity = 0.0;

    @Column(name = "composite_risk_score", nullable = false)
    private Double compositeRiskScore;

    @Column(name = "evaluated_at", updatable = false)
    private LocalDateTime evaluatedAt;

    public RiskScore() {
        this.evaluatedAt = LocalDateTime.now();
    }

    public RiskScore(Session session, Employee employee, Double compositeRiskScore) {
        this.session = session;
        this.employee = employee;
        this.compositeRiskScore = compositeRiskScore;
        this.evaluatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Session getSession() { return session; }
    public void setSession(Session session) { this.session = session; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public Double getBehaviorAnomalyScore() { return behaviorAnomalyScore; }
    public void setBehaviorAnomalyScore(Double behaviorAnomalyScore) { this.behaviorAnomalyScore = behaviorAnomalyScore; }

    public Double getRoleViolationScore() { return roleViolationScore; }
    public void setRoleViolationScore(Double roleViolationScore) { this.roleViolationScore = roleViolationScore; }

    public Double getResourceSensitivityScore() { return resourceSensitivityScore; }
    public void setResourceSensitivityScore(Double resourceSensitivityScore) { this.resourceSensitivityScore = resourceSensitivityScore; }

    public Double getDeviceRiskScore() { return deviceRiskScore; }
    public void setDeviceRiskScore(Double deviceRiskScore) { this.deviceRiskScore = deviceRiskScore; }

    public Double getLocationRiskScore() { return locationRiskScore; }
    public void setLocationRiskScore(Double locationRiskScore) { this.locationRiskScore = locationRiskScore; }

    public Double getRiskVelocity() { return riskVelocity; }
    public void setRiskVelocity(Double riskVelocity) { this.riskVelocity = riskVelocity; }

    public Double getCompositeRiskScore() { return compositeRiskScore; }
    public void setCompositeRiskScore(Double compositeRiskScore) { this.compositeRiskScore = compositeRiskScore; }

    public LocalDateTime getEvaluatedAt() { return evaluatedAt; }
    public void setEvaluatedAt(LocalDateTime evaluatedAt) { this.evaluatedAt = evaluatedAt; }
}
