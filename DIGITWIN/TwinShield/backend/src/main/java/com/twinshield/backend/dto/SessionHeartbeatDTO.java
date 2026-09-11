package com.twinshield.backend.dto;

public class SessionHeartbeatDTO {

    private String sessionId;
    private String employeeId;
    private String employeeName;
    private Double latitude;
    private Double longitude;
    private String locationSource;
    private String city;
    private String ipAddress;
    private String deviceFingerprint;
    private String status;
    private Double riskScore;
    private String lastEndpoint;
    private Integer accessesCount;
    private String loginTime;

    public SessionHeartbeatDTO() {}

    public SessionHeartbeatDTO(String sessionId, String employeeId, String employeeName, Double latitude, Double longitude, String city, String ipAddress, String deviceFingerprint, String status, Double riskScore) {
        this.sessionId = sessionId;
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.latitude = latitude;
        this.longitude = longitude;
        this.city = city;
        this.ipAddress = ipAddress;
        this.deviceFingerprint = deviceFingerprint;
        this.status = status;
        this.riskScore = riskScore;
    }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getLocationSource() { return locationSource; }
    public void setLocationSource(String locationSource) { this.locationSource = locationSource; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getDeviceFingerprint() { return deviceFingerprint; }
    public void setDeviceFingerprint(String deviceFingerprint) { this.deviceFingerprint = deviceFingerprint; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getRiskScore() { return riskScore; }
    public void setRiskScore(Double riskScore) { this.riskScore = riskScore; }

    public String getLastEndpoint() { return lastEndpoint; }
    public void setLastEndpoint(String lastEndpoint) { this.lastEndpoint = lastEndpoint; }

    public Integer getAccessesCount() { return accessesCount; }
    public void setAccessesCount(Integer accessesCount) { this.accessesCount = accessesCount; }

    public String getLoginTime() { return loginTime; }
    public void setLoginTime(String loginTime) { this.loginTime = loginTime; }
}
