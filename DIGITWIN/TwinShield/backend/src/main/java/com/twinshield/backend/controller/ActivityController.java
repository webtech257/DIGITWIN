package com.twinshield.backend.controller;

import com.twinshield.backend.dto.ActivityRequestDTO;
import com.twinshield.backend.entity.EmployeeActivity;
import com.twinshield.backend.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/activities")
@CrossOrigin(origins = "*")
public class ActivityController {

    private final ActivityService activityService;

    @Autowired
    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @PostMapping
    public ResponseEntity<EmployeeActivity> logActivity(@RequestBody ActivityRequestDTO activityRequest) {
        EmployeeActivity loggedActivity = activityService.logActivity(activityRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(loggedActivity);
    }
}
