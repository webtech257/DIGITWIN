package com.twinshield.backend.dto;

public class ActivityRequestDTO {

    private String sessionId;
    private String employeeId;
    private String resourceId;
    private String actionType;
    private Integer recordsAccessed;
    private Long dataVolumeBytes;
    
    // Day 5 Behavioral Parameters
    private Integer loginHour;
    private String ipAddress;
    private String deviceFingerprint;
    private String locationCity;
    private Boolean isRbacViolation;

    public ActivityRequestDTO() {}

    public ActivityRequestDTO(String sessionId, String employeeId, String resourceId, String actionType, Integer recordsAccessed, Long dataVolumeBytes) {
        this.sessionId = sessionId;
        this.employeeId = employeeId;
        this.resourceId = resourceId;
        this.actionType = actionType;
        this.recordsAccessed = recordsAccessed;
        this.dataVolumeBytes = dataVolumeBytes;
    }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getResourceId() { return resourceId; }
    public void setResourceId(String resourceId) { this.resourceId = resourceId; }

    public String getActionType() { return actionType; }
    public void setActionType(String actionType) { this.actionType = actionType; }

    public Integer getRecordsAccessed() { return recordsAccessed; }
    public void setRecordsAccessed(Integer recordsAccessed) { this.recordsAccessed = recordsAccessed; }

    public Long getDataVolumeBytes() { return dataVolumeBytes; }
    public void setDataVolumeBytes(Long dataVolumeBytes) { this.dataVolumeBytes = dataVolumeBytes; }

    public Integer getLoginHour() { return loginHour; }
    public void setLoginHour(Integer loginHour) { this.loginHour = loginHour; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getDeviceFingerprint() { return deviceFingerprint; }
    public void setDeviceFingerprint(String deviceFingerprint) { this.deviceFingerprint = deviceFingerprint; }

    public String getLocationCity() { return locationCity; }
    public void setLocationCity(String locationCity) { this.locationCity = locationCity; }

    public Boolean getIsRbacViolation() { return isRbacViolation; }
    public void setIsRbacViolation(Boolean isRbacViolation) { this.isRbacViolation = isRbacViolation; }
}
