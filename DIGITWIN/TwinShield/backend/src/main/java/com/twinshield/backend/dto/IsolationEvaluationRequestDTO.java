package com.twinshield.backend.dto;

import java.util.List;

public class IsolationEvaluationRequestDTO {

    private String sessionId;
    private String employeeId;
    private double riskScore;
    private String reason;
    private boolean isDecoyAccess;
    private String accessedResource;
    private List<String> contributingFactors;

    public IsolationEvaluationRequestDTO() {}

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public double getRiskScore() { return riskScore; }
    public void setRiskScore(double riskScore) { this.riskScore = riskScore; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public boolean isDecoyAccess() { return isDecoyAccess; }
    public void setDecoyAccess(boolean decoyAccess) { isDecoyAccess = decoyAccess; }

    public String getAccessedResource() { return accessedResource; }
    public void setAccessedResource(String accessedResource) { this.accessedResource = accessedResource; }

    public List<String> getContributingFactors() { return contributingFactors; }
    public void setContributingFactors(List<String> contributingFactors) { this.contributingFactors = contributingFactors; }
}
