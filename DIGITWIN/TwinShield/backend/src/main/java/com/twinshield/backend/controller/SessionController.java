package com.twinshield.backend.controller;

import com.twinshield.backend.dto.SessionHeartbeatDTO;
import com.twinshield.backend.entity.Employee;
import com.twinshield.backend.entity.Session;
import com.twinshield.backend.repository.EmployeeRepository;
import com.twinshield.backend.repository.SessionRepository;
import com.twinshield.backend.service.IsolationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "*")
public class SessionController {

    private final SessionRepository sessionRepository;
    private final EmployeeRepository employeeRepository;
    private final IsolationService isolationService;

    // Concurrent in-memory registry of live device heartbeats: employeeId -> LiveSessionData
    private static final Map<String, Map<String, Object>> LIVE_HEARTBEATS = new ConcurrentHashMap<>();

    // Expiration threshold: heartbeats older than 60 seconds are considered OFFLINE
    private static final long HEARTBEAT_EXPIRATION_MS = 60000;

    @Autowired
    public SessionController(SessionRepository sessionRepository,
                             EmployeeRepository employeeRepository,
                             IsolationService isolationService) {
        this.sessionRepository = sessionRepository;
        this.employeeRepository = employeeRepository;
        this.isolationService = isolationService;
    }

    /**
     * Ingests real-time device heartbeat from active browser sessions
     */
    @PostMapping("/heartbeat")
    public ResponseEntity<Map<String, Object>> recordHeartbeat(@RequestBody SessionHeartbeatDTO dto) {
        Map<String, Object> response = new HashMap<>();

        if (dto == null || dto.getEmployeeId() == null || dto.getEmployeeId().isBlank()) {
            response.put("error", "employeeId is required");
            return ResponseEntity.badRequest().body(response);
        }

        String empId = dto.getEmployeeId().trim().toUpperCase();
        String sessionId = (dto.getSessionId() != null && !dto.getSessionId().isBlank())
                ? dto.getSessionId().trim()
                : "SESS-" + empId + "-LIVE";

        long nowMs = System.currentTimeMillis();

        // 1. Fetch employee
        Employee employee = employeeRepository.findById(empId).orElse(null);

        // 2. Fetch or create Session in DB
        Session session = sessionRepository.findById(sessionId).orElseGet(() -> {
            Session s = new Session();
            s.setSessionId(sessionId);
            s.setEmployee(employee);
            s.setIpAddress(dto.getIpAddress() != null ? dto.getIpAddress() : "127.0.0.1");
            s.setLocationCity(dto.getCity() != null ? dto.getCity() : "Live Device Location");
            s.setDeviceFingerprint(dto.getDeviceFingerprint() != null ? dto.getDeviceFingerprint() : "DEV-BROWSER-" + empId);
            s.setUserAgent("Browser Client Live Device");
            s.setStatus("ACTIVE");
            return s;
        });

        // 3. Update coordinates and telemetry
        // A null coordinate is meaningful: it clears stale IP-derived or
        // previously cached coordinates when precise location is unavailable.
        session.setLatitude(dto.getLatitude());
        session.setLongitude(dto.getLongitude());
        if (dto.getCity() != null && !dto.getCity().isBlank()) {
            session.setLocationCity(dto.getCity());
        }
        if (dto.getIpAddress() != null && !dto.getIpAddress().isBlank()) {
            session.setIpAddress(dto.getIpAddress());
        }
        if (dto.getDeviceFingerprint() != null && !dto.getDeviceFingerprint().isBlank()) {
            session.setDeviceFingerprint(dto.getDeviceFingerprint());
        }
        if (session.getLoginTime() == null) {
            session.setLoginTime(LocalDateTime.now());
        }
        session.setLastActivityTime(LocalDateTime.now());

        // Respect existing ISOLATED, SUSPENDED, or STEP_UP_MFA status, otherwise ACTIVE
        Map<String, Object> isoStatus = isolationService.getSessionStatus(sessionId);
        String currentStatus = (String) isoStatus.getOrDefault("status", "ACTIVE");
        if ("ISOLATED".equalsIgnoreCase(currentStatus) || "SUSPENDED".equalsIgnoreCase(currentStatus) || "STEP_UP_MFA".equalsIgnoreCase(currentStatus)) {
            session.setStatus(currentStatus);
        } else {
            session.setStatus("ACTIVE");
        }

        try {
            sessionRepository.save(session);
        } catch (Exception ex) {
            // Concurrent save race condition protection
        }

        // 4. Update in-memory live registry
        String empName = (dto.getEmployeeName() != null && !dto.getEmployeeName().isBlank())
                ? dto.getEmployeeName()
                : (employee != null ? employee.getName() : empId);

        if (employee != null && dto.getEmployeeName() != null && !dto.getEmployeeName().isBlank() && !dto.getEmployeeName().equals(employee.getName())) {
            employee.setName(dto.getEmployeeName());
            try { employeeRepository.save(employee); } catch (Exception e) {}
        }

        String deviceFp = (dto.getDeviceFingerprint() != null && !dto.getDeviceFingerprint().isBlank())
                ? dto.getDeviceFingerprint()
                : (session.getDeviceFingerprint() != null ? session.getDeviceFingerprint() : "DEV-FP-Chrome-Win64");

        String loginTimeStr = (dto.getLoginTime() != null && !dto.getLoginTime().isBlank())
                ? dto.getLoginTime()
                : (session.getLoginTime() != null ? session.getLoginTime().toString() : LocalDateTime.now().toString());

        String lastEndpoint = (dto.getLastEndpoint() != null && !dto.getLastEndpoint().isBlank())
                ? dto.getLastEndpoint()
                : "/api/v1/customer/profile";

        int accesses = (dto.getAccessesCount() != null && dto.getAccessesCount() > 0)
                ? dto.getAccessesCount()
                : 1;

        Double lat = session.getLatitude();
        Double lng = session.getLongitude();
        String city = session.getLocationCity() != null ? session.getLocationCity() : (dto.getCity() != null ? dto.getCity() : "Location not shared");
        String ip = session.getIpAddress() != null ? session.getIpAddress() : (dto.getIpAddress() != null ? dto.getIpAddress() : "127.0.0.1");
        String statusStr = session.getStatus() != null ? session.getStatus() : "ACTIVE";
        Object riskScoreVal = isoStatus.getOrDefault("riskScore", dto.getRiskScore() != null ? dto.getRiskScore() : 0.0);
        if (riskScoreVal == null) riskScoreVal = 0.0;

        Map<String, Object> liveData = new HashMap<>();
        liveData.put("sessionId", sessionId);
        liveData.put("employeeId", empId);
        liveData.put("employeeName", empName);
        liveData.put("role", employee != null && employee.getRole() != null ? employee.getRole().getName() : "Staff");
        liveData.put("department", employee != null ? employee.getDepartment() : "Retail Banking");
        liveData.put("latitude", lat);
        liveData.put("longitude", lng);
        // Older heartbeats have no provenance and must never be treated as GPS.
        liveData.put("locationSource", dto.getLocationSource() != null ? dto.getLocationSource() : "UNVERIFIED");
        liveData.put("city", city);
        liveData.put("ipAddress", ip);
        liveData.put("deviceFingerprint", deviceFp);
        liveData.put("loginTime", loginTimeStr);
        liveData.put("lastEndpoint", lastEndpoint);
        liveData.put("accessesCount", accesses);
        liveData.put("status", statusStr);
        liveData.put("riskScore", riskScoreVal);
        liveData.put("lastHeartbeatMs", nowMs);
        liveData.put("isLiveDevice", true);

        LIVE_HEARTBEATS.put(empId, liveData);

        response.put("success", true);
        response.put("status", session.getStatus());
        response.put("employeeId", empId);
        response.put("sessionId", sessionId);
        response.put("timestamp", nowMs);

        return ResponseEntity.ok(response);
    }

    /**
     * Returns currently online active sessions that sent a heartbeat within the expiration window
     */
    @GetMapping("/active")
    public ResponseEntity<List<Map<String, Object>>> getActiveOnlineSessions() {
        long nowMs = System.currentTimeMillis();
        List<Map<String, Object>> activeList = new ArrayList<>();

        // Prune stale sessions and collect active ones
        LIVE_HEARTBEATS.entrySet().removeIf(entry -> {
            Map<String, Object> data = entry.getValue();
            Long lastMs = (Long) data.get("lastHeartbeatMs");
            return lastMs == null || (nowMs - lastMs) > HEARTBEAT_EXPIRATION_MS;
        });

        for (Map<String, Object> entry : LIVE_HEARTBEATS.values()) {
            Long lastMs = (Long) entry.get("lastHeartbeatMs");
            long secondsAgo = lastMs != null ? Math.max(0, (nowMs - lastMs) / 1000) : 0;

            String empId = (String) entry.get("employeeId");
            String sessId = (String) entry.get("sessionId");

            // Refresh status from isolation service in case of recent quarantine
            Map<String, Object> iso = isolationService.getSessionStatus(sessId);
            String liveStatus = (String) iso.getOrDefault("status", entry.get("status"));
            Double liveRisk = (Double) iso.getOrDefault("riskScore", entry.get("riskScore"));

            Map<String, Object> item = new HashMap<>(entry);
            item.put("status", liveStatus);
            item.put("riskScore", liveRisk);
            item.put("secondsAgo", secondsAgo);
            item.put("isOnline", true);

            activeList.add(item);
        }

        return ResponseEntity.ok(activeList);
    }

    /**
     * Marks a session as offline immediately upon user logout or persona switch
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logoutSession(
            @RequestParam(required = false) String employeeId,
            @RequestParam(required = false) String sessionId) {
        
        Map<String, Object> res = new HashMap<>();

        if (employeeId != null && !employeeId.isBlank()) {
            String emp = employeeId.trim().toUpperCase();
            LIVE_HEARTBEATS.remove(emp);
        }

        if (sessionId != null && !sessionId.isBlank()) {
            LIVE_HEARTBEATS.entrySet().removeIf(e -> sessionId.equalsIgnoreCase((String) e.getValue().get("sessionId")));
            sessionRepository.findBySessionId(sessionId).ifPresent(s -> {
                s.setStatus("OFFLINE");
                s.setLastActivityTime(LocalDateTime.now());
                sessionRepository.save(s);
            });
        }

        res.put("success", true);
        res.put("message", "Session set to OFFLINE");
        return ResponseEntity.ok(res);
    }
}
