package com.twinshield.backend.controller;

import com.twinshield.backend.entity.SecurityEvent;
import com.twinshield.backend.service.SecurityEventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/security-events")
@CrossOrigin(origins = "*")
public class SecurityEventController {

    private final SecurityEventService securityEventService;

    @Autowired
    public SecurityEventController(SecurityEventService securityEventService) {
        this.securityEventService = securityEventService;
    }

    @GetMapping
    public ResponseEntity<List<SecurityEvent>> getAllSecurityEvents() {
        return ResponseEntity.ok(securityEventService.getAllSecurityEvents());
    }
}
