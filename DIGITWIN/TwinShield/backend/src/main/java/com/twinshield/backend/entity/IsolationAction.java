package com.twinshield.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "isolation_actions")
public class IsolationAction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "incident_id")
    private Incident incident;

    @Column(name = "trigger_risk_score", nullable = false)
    private Double triggerRiskScore;

    @Column(name = "isolation_reason", columnDefinition = "TEXT", nullable = false)
    private String isolationReason;

    @Column(name = "isolated_at", updatable = false)
    private LocalDateTime isolatedAt;

    @Column(name = "status", length = 20)
    private String status = "ISOLATED"; // ISOLATED, RESTORED, STEP_UP_MFA, ACCOUNT_DISABLED

    @Column(name = "resolved_by", length = 100)
    private String resolvedBy;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "resolution_notes", columnDefinition = "TEXT")
    private String resolutionNotes;

    public IsolationAction() {
        this.isolatedAt = LocalDateTime.now();
    }

    public IsolationAction(Session session, Employee employee, Incident incident, Double triggerRiskScore, String isolationReason, String status) {
        this.session = session;
        this.employee = employee;
        this.incident = incident;
        this.triggerRiskScore = triggerRiskScore;
        this.isolationReason = isolationReason;
        this.status = status != null ? status : "ISOLATED";
        this.isolatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Session getSession() { return session; }
    public void setSession(Session session) { this.session = session; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public Incident getIncident() { return incident; }
    public void setIncident(Incident incident) { this.incident = incident; }

    public Double getTriggerRiskScore() { return triggerRiskScore; }
    public void setTriggerRiskScore(Double triggerRiskScore) { this.triggerRiskScore = triggerRiskScore; }

    public String getIsolationReason() { return isolationReason; }
    public void setIsolationReason(String isolationReason) { this.isolationReason = isolationReason; }

    public LocalDateTime getIsolatedAt() { return isolatedAt; }
    public void setIsolatedAt(LocalDateTime isolatedAt) { this.isolatedAt = isolatedAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getResolvedBy() { return resolvedBy; }
    public void setResolvedBy(String resolvedBy) { this.resolvedBy = resolvedBy; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }

    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }
}
