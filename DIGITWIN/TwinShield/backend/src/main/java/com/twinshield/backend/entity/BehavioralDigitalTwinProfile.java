package com.twinshield.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "behavioral_digital_twin_profiles")
public class BehavioralDigitalTwinProfile {

    @Id
    @Column(name = "employee_id", length = 50)
    private String employeeId;

    @Column(name = "normal_start_hour")
    private Integer normalStartHour = 9;

    @Column(name = "normal_end_hour")
    private Integer normalEndHour = 18;

    @Column(name = "avg_daily_accesses")
    private Integer avgDailyAccesses = 25;

    @Column(name = "avg_session_duration_minutes")
    private Integer avgSessionDurationMinutes = 480;

    @Column(name = "normal_location", length = 100)
    private String normalLocation = "Chennai";

    @Column(name = "known_devices", columnDefinition = "TEXT")
    private String knownDevices; // e.g. "BANK-PC-1024"

    @Column(name = "known_ip_ranges", columnDefinition = "TEXT")
    private String knownIpRanges; // e.g. "192.168.1.0/24"

    @Column(name = "typical_resources", columnDefinition = "TEXT")
    private String typicalResources; // e.g. "/api/v1/customer/profile, /api/v1/transactions/search"

    @Column(name = "last_baseline_update")
    private LocalDateTime lastBaselineUpdate;

    public BehavioralDigitalTwinProfile() {
        this.lastBaselineUpdate = LocalDateTime.now();
    }

    public BehavioralDigitalTwinProfile(String employeeId, Integer normalStartHour, Integer normalEndHour, Integer avgDailyAccesses, String normalLocation, String knownDevices, String knownIpRanges, String typicalResources) {
        this.employeeId = employeeId;
        this.normalStartHour = normalStartHour != null ? normalStartHour : 9;
        this.normalEndHour = normalEndHour != null ? normalEndHour : 18;
        this.avgDailyAccesses = avgDailyAccesses != null ? avgDailyAccesses : 25;
        this.normalLocation = normalLocation != null ? normalLocation : "Chennai";
        this.knownDevices = knownDevices;
        this.knownIpRanges = knownIpRanges;
        this.typicalResources = typicalResources;
        this.lastBaselineUpdate = LocalDateTime.now();
    }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public Integer getNormalStartHour() { return normalStartHour; }
    public void setNormalStartHour(Integer normalStartHour) { this.normalStartHour = normalStartHour; }

    public Integer getNormalEndHour() { return normalEndHour; }
    public void setNormalEndHour(Integer normalEndHour) { this.normalEndHour = normalEndHour; }

    public Integer getAvgDailyAccesses() { return avgDailyAccesses; }
    public void setAvgDailyAccesses(Integer avgDailyAccesses) { this.avgDailyAccesses = avgDailyAccesses; }

    public Integer getAvgSessionDurationMinutes() { return avgSessionDurationMinutes; }
    public void setAvgSessionDurationMinutes(Integer avgSessionDurationMinutes) { this.avgSessionDurationMinutes = avgSessionDurationMinutes; }

    public String getNormalLocation() { return normalLocation; }
    public void setNormalLocation(String normalLocation) { this.normalLocation = normalLocation; }

    public String getKnownDevices() { return knownDevices; }
    public void setKnownDevices(String knownDevices) { this.knownDevices = knownDevices; }

    public String getKnownIpRanges() { return knownIpRanges; }
    public void setKnownIpRanges(String knownIpRanges) { this.knownIpRanges = knownIpRanges; }

    public String getTypicalResources() { return typicalResources; }
    public void setTypicalResources(String typicalResources) { this.typicalResources = typicalResources; }

    public LocalDateTime getLastBaselineUpdate() { return lastBaselineUpdate; }
    public void setLastBaselineUpdate(LocalDateTime lastBaselineUpdate) { this.lastBaselineUpdate = lastBaselineUpdate; }
}
