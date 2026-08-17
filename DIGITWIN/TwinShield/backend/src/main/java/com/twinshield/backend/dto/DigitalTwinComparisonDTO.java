package com.twinshield.backend.dto;

import java.util.ArrayList;
import java.util.List;

public class DigitalTwinComparisonDTO {

    private String employeeId;
    
    // Expected vs Actual Comparisons
    private String expectedWorkingHours;
    private Integer actualLoginHour;
    private boolean loginHourDeviation;

    private String expectedDevice;
    private String actualDevice;
    private boolean deviceDeviation;

    private String expectedLocation;
    private String actualLocation;
    private boolean locationDeviation;

    private Integer expectedAvgAccessVolume;
    private Integer actualAccessVolume;
    private boolean accessVolumeDeviation;

    private String typicalResources;
    private String actualResourceAccessed;
    private boolean unusualResourceDeviation;

    private boolean rbacViolation;
    private Integer resourceSensitivity;
    
    private int totalDeviationsCount;
    private List<String> flaggedDeviationsList = new ArrayList<>();
    private String anomalySummary;

    public DigitalTwinComparisonDTO() {}

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getExpectedWorkingHours() { return expectedWorkingHours; }
    public void setExpectedWorkingHours(String expectedWorkingHours) { this.expectedWorkingHours = expectedWorkingHours; }

    public Integer getActualLoginHour() { return actualLoginHour; }
    public void setActualLoginHour(Integer actualLoginHour) { this.actualLoginHour = actualLoginHour; }

    public boolean isLoginHourDeviation() { return loginHourDeviation; }
    public void setLoginHourDeviation(boolean loginHourDeviation) { this.loginHourDeviation = loginHourDeviation; }

    public String getExpectedDevice() { return expectedDevice; }
    public void setExpectedDevice(String expectedDevice) { this.expectedDevice = expectedDevice; }

    public String getActualDevice() { return actualDevice; }
    public void setActualDevice(String actualDevice) { this.actualDevice = actualDevice; }

    public boolean isDeviceDeviation() { return deviceDeviation; }
    public void setDeviceDeviation(boolean deviceDeviation) { this.deviceDeviation = deviceDeviation; }

    public String getExpectedLocation() { return expectedLocation; }
    public void setExpectedLocation(String expectedLocation) { this.expectedLocation = expectedLocation; }

    public String getActualLocation() { return actualLocation; }
    public void setActualLocation(String actualLocation) { this.actualLocation = actualLocation; }

    public boolean isLocationDeviation() { return locationDeviation; }
    public void setLocationDeviation(boolean locationDeviation) { this.locationDeviation = locationDeviation; }

    public Integer getExpectedAvgAccessVolume() { return expectedAvgAccessVolume; }
    public void setExpectedAvgAccessVolume(Integer expectedAvgAccessVolume) { this.expectedAvgAccessVolume = expectedAvgAccessVolume; }

    public Integer getActualAccessVolume() { return actualAccessVolume; }
    public void setActualAccessVolume(Integer actualAccessVolume) { this.actualAccessVolume = actualAccessVolume; }

    public boolean isAccessVolumeDeviation() { return accessVolumeDeviation; }
    public void setAccessVolumeDeviation(boolean accessVolumeDeviation) { this.accessVolumeDeviation = accessVolumeDeviation; }

    public String getTypicalResources() { return typicalResources; }
    public void setTypicalResources(String typicalResources) { this.typicalResources = typicalResources; }

    public String getActualResourceAccessed() { return actualResourceAccessed; }
    public void setActualResourceAccessed(String actualResourceAccessed) { this.actualResourceAccessed = actualResourceAccessed; }

    public boolean isUnusualResourceDeviation() { return unusualResourceDeviation; }
    public void setUnusualResourceDeviation(boolean unusualResourceDeviation) { this.unusualResourceDeviation = unusualResourceDeviation; }

    public boolean isRbacViolation() { return rbacViolation; }
    public void setRbacViolation(boolean rbacViolation) { this.rbacViolation = rbacViolation; }

    public Integer getResourceSensitivity() { return resourceSensitivity; }
    public void setResourceSensitivity(Integer resourceSensitivity) { this.resourceSensitivity = resourceSensitivity; }

    public int getTotalDeviationsCount() { return totalDeviationsCount; }
    public void setTotalDeviationsCount(int totalDeviationsCount) { this.totalDeviationsCount = totalDeviationsCount; }

    public List<String> getFlaggedDeviationsList() { return flaggedDeviationsList; }
    public void setFlaggedDeviationsList(List<String> flaggedDeviationsList) { this.flaggedDeviationsList = flaggedDeviationsList; }

    public String getAnomalySummary() { return anomalySummary; }
    public void setAnomalySummary(String anomalySummary) { this.anomalySummary = anomalySummary; }
}
