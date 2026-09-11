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

    @PostMapping(value = {"/restore", "/restore/{sessionId}"})
    public ResponseEntity<Map<String, Object>> restoreSession(
            @PathVariable(required = false) String sessionId,
            @RequestParam(name = "sessionId", required = false) String querySessionId,
            @RequestParam(required = false, defaultValue = "SOC_ANALYST") String actorId) {
        String effectiveSessionId = (sessionId != null && !sessionId.isEmpty()) ? sessionId : querySessionId;
        if (effectiveSessionId == null || effectiveSessionId.isEmpty()) {
            effectiveSessionId = "EMP1024";
        }
        Map<String, Object> response = isolationService.restoreSession(effectiveSessionId, actorId);
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

    @GetMapping("/actions")
    public ResponseEntity<java.util.List<Map<String, Object>>> getIsolationActions() {
        java.util.List<Map<String, Object>> response = isolationService.getRecentIsolationActions();
        return ResponseEntity.ok(response);
    }
}


