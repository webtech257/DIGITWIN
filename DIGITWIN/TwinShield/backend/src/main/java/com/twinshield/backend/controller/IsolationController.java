package com.twinshield.backend.controller;

import com.twinshield.backend.dto.IsolationEvaluationRequestDTO;
import com.twinshield.backend.service.IsolationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/isolation")
@CrossOrigin(origins = "*")
public class IsolationController {

    @Autowired
    private IsolationService isolationService;

    @PostMapping("/evaluate")
    public ResponseEntity<Map<String, Object>> evaluateIsolation(@RequestBody IsolationEvaluationRequestDTO request) {
        Map<String, Object> response = isolationService.evaluateAndProcessIsolation(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/restore")
    public ResponseEntity<Map<String, Object>> restoreSession(
            @RequestParam String sessionId,
            @RequestParam(required = false, defaultValue = "SOC_ANALYST") String actorId) {
        Map<String, Object> response = isolationService.restoreSession(sessionId, actorId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/require-mfa")
    public ResponseEntity<Map<String, Object>> requireMFA(
            @RequestParam String sessionId,
            @RequestParam(required = false, defaultValue = "SOC_ANALYST") String actorId) {
        Map<String, Object> response = isolationService.requireMFA(sessionId, actorId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/disable-account")
    public ResponseEntity<Map<String, Object>> disableAccount(
            @RequestParam String employeeId,
            @RequestParam(required = false, defaultValue = "SOC_ANALYST") String actorId) {
        Map<String, Object> response = isolationService.disableAccount(employeeId, actorId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status/{sessionId}")
    public ResponseEntity<Map<String, Object>> getSessionIsolationStatus(@PathVariable String sessionId) {
        Map<String, Object> response = isolationService.getSessionStatus(sessionId);
        return ResponseEntity.ok(response);
    }
}

