package com.twinshield.backend.controller;

import com.twinshield.backend.dto.ActivityRequestDTO;
import com.twinshield.backend.dto.DigitalTwinComparisonDTO;
import com.twinshield.backend.entity.BehavioralDigitalTwinProfile;
import com.twinshield.backend.service.DigitalTwinService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/digital-twins")
@CrossOrigin(origins = "*")
public class DigitalTwinController {

    private final DigitalTwinService digitalTwinService;

    @Autowired
    public DigitalTwinController(DigitalTwinService digitalTwinService) {
        this.digitalTwinService = digitalTwinService;
    }

    @GetMapping("/{employeeId}")
    public ResponseEntity<BehavioralDigitalTwinProfile> getProfile(@PathVariable String employeeId) {
        return digitalTwinService.getProfileByEmployeeId(employeeId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/evaluate")
    public ResponseEntity<DigitalTwinComparisonDTO> evaluateActivity(@RequestBody ActivityRequestDTO activityRequest) {
        DigitalTwinComparisonDTO comparison = digitalTwinService.evaluateBehavior(activityRequest);
        return ResponseEntity.ok(comparison);
    }
}
