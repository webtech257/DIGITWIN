package com.twinshield.backend.service;

import com.twinshield.backend.dto.ActivityRequestDTO;
import com.twinshield.backend.dto.DigitalTwinComparisonDTO;
import com.twinshield.backend.entity.BehavioralDigitalTwinProfile;
import com.twinshield.backend.entity.Resource;
import com.twinshield.backend.repository.BehavioralDigitalTwinProfileRepository;
import com.twinshield.backend.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DigitalTwinService {

    private final BehavioralDigitalTwinProfileRepository profileRepository;
    private final ResourceRepository resourceRepository;

    @Autowired
    public DigitalTwinService(BehavioralDigitalTwinProfileRepository profileRepository,
                               ResourceRepository resourceRepository) {
        this.profileRepository = profileRepository;
        this.resourceRepository = resourceRepository;
    }

    public Optional<BehavioralDigitalTwinProfile> getProfileByEmployeeId(String employeeId) {
        return profileRepository.findById(employeeId);
    }

    public DigitalTwinComparisonDTO evaluateBehavior(ActivityRequestDTO activity) {
        String empId = activity.getEmployeeId();
        BehavioralDigitalTwinProfile profile = profileRepository.findById(empId)
                .orElse(new BehavioralDigitalTwinProfile(empId, 9, 18, 25, "Chennai", "BANK-PC-1024", "192.168.1.0/24", "/api/v1/customer/profile, /api/v1/transactions/search"));

        DigitalTwinComparisonDTO result = new DigitalTwinComparisonDTO();
        result.setEmployeeId(empId);

        List<String> deviations = new ArrayList<>();

        // 1. Login Hour Comparison
        result.setExpectedWorkingHours(profile.getNormalStartHour() + ":00 - " + profile.getNormalEndHour() + ":00 IST");
        Integer actualHour = activity.getLoginHour() != null ? activity.getLoginHour() : 14;
        result.setActualLoginHour(actualHour);

        boolean isOffHours = actualHour < profile.getNormalStartHour() || actualHour >= profile.getNormalEndHour();
        result.setLoginHourDeviation(isOffHours);
        if (isOffHours) {
          deviations.add("Unusual Login Time: " + actualHour + ":00 (Expected " + result.getExpectedWorkingHours() + ")");
        }

        // 2. Device Comparison
        result.setExpectedDevice(profile.getKnownDevices());
        String actualDevice = activity.getDeviceFingerprint() != null ? activity.getDeviceFingerprint() : "BANK-PC-1024-HASH";
        result.setActualDevice(actualDevice);

        boolean isUnknownDevice = profile.getKnownDevices() != null && !profile.getKnownDevices().contains(actualDevice.replace("-HASH", ""));
        result.setDeviceDeviation(isUnknownDevice);
        if (isUnknownDevice) {
          deviations.add("Unknown Hardware Device: " + actualDevice + " (Expected " + profile.getKnownDevices() + ")");
        }

        // 3. Location Comparison
        result.setExpectedLocation(profile.getNormalLocation());
        String actualLocation = activity.getLocationCity() != null ? activity.getLocationCity() : "Chennai";
        result.setActualLocation(actualLocation);

        boolean isUnusualLocation = !profile.getNormalLocation().equalsIgnoreCase(actualLocation);
        result.setLocationDeviation(isUnusualLocation);
        if (isUnusualLocation) {
          deviations.add("Unusual Network Location: " + actualLocation + " (Expected " + profile.getNormalLocation() + ")");
        }

        // 4. Data Access Volume Comparison
        result.setExpectedAvgAccessVolume(profile.getAvgDailyAccesses());
        Integer actualVolume = activity.getRecordsAccessed() != null ? activity.getRecordsAccessed() : 1;
        result.setActualAccessVolume(actualVolume);

        boolean isExcessiveVolume = actualVolume > (profile.getAvgDailyAccesses() * 3);
        result.setAccessVolumeDeviation(isExcessiveVolume);
        if (isExcessiveVolume) {
          deviations.add("Excessive Access Volume: " + actualVolume + " records (Expected avg " + profile.getAvgDailyAccesses() + ")");
        }

        // 5. Resource Sensitivity & Typical Resource Comparison
        String actualResource = activity.getResourceId() != null ? activity.getResourceId() : "/api/v1/customer/profile";
        result.setActualResourceAccessed(actualResource);
        result.setTypicalResources(profile.getTypicalResources());

        boolean isUnusualResource = profile.getTypicalResources() != null && !profile.getTypicalResources().contains(actualResource);
        result.setUnusualResourceDeviation(isUnusualResource);
        if (isUnusualResource) {
          deviations.add("Unusual Resource Access: " + actualResource);
        }

        // Resource Sensitivity Score Lookup
        Optional<Resource> resOpt = resourceRepository.findById(actualResource);
        int sensitivity = resOpt.map(Resource::getSensitivityScore).orElse(30);
        result.setResourceSensitivity(sensitivity);

        // 6. RBAC Violation Status
        boolean rbacViolated = Boolean.TRUE.equals(activity.getIsRbacViolation());
        result.setRbacViolation(rbacViolated);
        if (rbacViolated) {
          deviations.add("Role-Based Permission Violation Attempted");
        }

        // Summary Statistics
        result.setTotalDeviationsCount(deviations.size());
        result.setFlaggedDeviationsList(deviations);

        if (deviations.isEmpty()) {
          result.setAnomalySummary("NORMAL: Current activity strictly matches learned employee behavioral baseline.");
        } else {
          result.setAnomalySummary("DEVIATION DETECTED: Found " + deviations.size() + " behavioral anomalies compared against digital twin baseline.");
        }

        // SECURITY RULE: Baseline is NOT updated with suspicious activity!
        return result;
    }
}
