package com.twinshield.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.twinshield.backend.dto.ActivityRequestDTO;
import com.twinshield.backend.dto.IsolationEvaluationRequestDTO;
import com.twinshield.backend.entity.*;
import com.twinshield.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class ActivityService {

    private final EmployeeActivityRepository activityRepository;
    private final SessionRepository sessionRepository;
    private final EmployeeRepository employeeRepository;
    private final ResourceRepository resourceRepository;
    private final RoleRepository roleRepository;
    private final SecurityEventRepository securityEventRepository;
    private final IsolationService isolationService;
    private final WebSocketPublisherService webSocketPublisherService;
    private final RestTemplate restTemplate = new RestTemplate();

    private static final String PYTHON_RISK_ENGINE_URL = "http://localhost:8000/risk/calculate";

    @Autowired
    public ActivityService(EmployeeActivityRepository activityRepository,
                           SessionRepository sessionRepository,
                           EmployeeRepository employeeRepository,
                           ResourceRepository resourceRepository,
                           RoleRepository roleRepository,
                           SecurityEventRepository securityEventRepository,
                           IsolationService isolationService,
                           WebSocketPublisherService webSocketPublisherService) {
        this.activityRepository = activityRepository;
        this.sessionRepository = sessionRepository;
        this.employeeRepository = employeeRepository;
        this.resourceRepository = resourceRepository;
        this.roleRepository = roleRepository;
        this.securityEventRepository = securityEventRepository;
        this.isolationService = isolationService;
        this.webSocketPublisherService = webSocketPublisherService;
    }

    public EmployeeActivity logActivity(ActivityRequestDTO dto) {
        // Fetch or create Role
        Role defaultRole = roleRepository.findById("ROLE_CUST_SERVICE")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_CUST_SERVICE", "Customer Service Representative", "Default representative role")));

        // Fetch or auto-create synthetic employee
        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseGet(() -> {
                    Employee defaultEmp = new Employee(
                        dto.getEmployeeId(),
                        "John Doe (Synthetic)",
                        dto.getEmployeeId().toLowerCase() + "@twinshield-bank.internal",
                        "Retail Banking",
                        defaultRole,
                        "ACTIVE"
                    );
                    return employeeRepository.save(defaultEmp);
                });

        Session session = sessionRepository.findById(dto.getSessionId())
                .orElseGet(() -> {
                    Session newSession = new Session(
                        dto.getSessionId(),
                        employee,
                        dto.getIpAddress() != null ? dto.getIpAddress() : "192.168.1.45",
                        dto.getLocationCity() != null ? dto.getLocationCity() : "Chennai",
                        dto.getDeviceFingerprint() != null ? dto.getDeviceFingerprint() : "BANK-PC-" + dto.getEmployeeId() + "-HASH",
                        "Mozilla/5.0 (Windows NT 10.0)",
                        "ACTIVE"
                    );
                    return sessionRepository.save(newSession);
                });

        Resource resource = resourceRepository.findById(dto.getResourceId())
                .orElseGet(() -> {
                    String resIdLower = dto.getResourceId().toLowerCase();
                    boolean isDecoy = resIdLower.contains("decoy");
                    boolean isVipOrReport = resIdLower.contains("vip") || resIdLower.contains("reports") || resIdLower.contains("manager");
                    int sensitivity = isDecoy ? 100 : (isVipOrReport ? 95 : 50);
                    Resource defaultRes = new Resource(
                        dto.getResourceId(),
                        isDecoy ? "SYNTHETIC_HONEY_DECOY" : (isVipOrReport ? "Manager/VIP Endpoint" : "Banking Endpoint"),
                        "API",
                        sensitivity,
                        isDecoy,
                        "Banking resource endpoint"
                    );
                    return resourceRepository.save(defaultRes);
                });

        EmployeeActivity activity = new EmployeeActivity(
                session,
                employee,
                resource,
                dto.getActionType(),
                dto.getRecordsAccessed(),
                dto.getDataVolumeBytes()
        );
        EmployeeActivity savedActivity = activityRepository.save(activity);

        // --- REAL-TIME SECURITY EVALUATION & WEBSOCKET BROADCAST PIPELINE ---
        evaluateAndBroadcastRealTimeSecurityEvent(dto, session, employee, resource);

        return savedActivity;
    }

    private void evaluateAndBroadcastRealTimeSecurityEvent(ActivityRequestDTO dto, Session session, Employee employee, Resource resource) {
        try {
            boolean isRbacViolation = dto.getIsRbacViolation() != null ? dto.getIsRbacViolation() : false;
            boolean isDecoy = resource.getIsDecoy() != null && resource.getIsDecoy();

            double riskScore = 15.0;
            String level = "NORMAL";
            String recommendedAction = "ALLOW";
            String attackStage = "None";
            List<String> reasons = new ArrayList<>();

            // 1. Attempt Risk Calculation via Python ML Engine with Fallback
            try {
                Map<String, Object> riskReq = new HashMap<>();
                riskReq.put("employee_id", employee.getId());
                riskReq.put("session_id", session.getSessionId());
                riskReq.put("ml_anomaly_score", (isRbacViolation || isDecoy) ? 0.90 : (dto.getRecordsAccessed() > 100 ? 0.75 : 0.20));
                riskReq.put("is_rbac_violation", isRbacViolation);
                riskReq.put("resource_sensitivity", resource.getSensitivityScore() != null ? resource.getSensitivityScore() : (isRbacViolation ? 95 : 30));
                riskReq.put("is_unknown_device", !session.getDeviceFingerprint().contains("BANK-PC"));
                riskReq.put("is_unusual_location", "Foreign IP / Remote".equalsIgnoreCase(session.getLocationCity()));
                riskReq.put("api_velocity", dto.getRecordsAccessed() > 50 ? 35.0 : 4.0);
                riskReq.put("data_volume_bytes", dto.getDataVolumeBytes());
                riskReq.put("recent_activity_sequence", Arrays.asList(dto.getActionType(), resource.getName()));
                riskReq.put("prior_risk_score", 0.0);

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(riskReq, headers);

                @SuppressWarnings("unchecked")
                Map<String, Object> riskRes = restTemplate.postForObject(PYTHON_RISK_ENGINE_URL, requestEntity, Map.class);
                
                if (riskRes != null && riskRes.containsKey("riskScore")) {
                    riskScore = ((Number) riskRes.get("riskScore")).doubleValue();
                    level = (String) riskRes.getOrDefault("level", "NORMAL");
                    recommendedAction = (String) riskRes.getOrDefault("recommendedAction", "ALLOW");
                    attackStage = (String) riskRes.getOrDefault("attackSequenceStage", "None");
                    
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> factors = (List<Map<String, Object>>) riskRes.get("factors");
                    if (factors != null) {
                        for (Map<String, Object> f : factors) {
                            reasons.add((String) f.get("name"));
                        }
                    }
                }
            } catch (Exception mlEx) {
                // Fallback risk calculation if Python ML engine is unreachable
                System.err.println("Python ML Engine unreachable, using Java fallback calculation: " + mlEx.getMessage());
                if (isDecoy) {
                    riskScore = 100.0;
                } else if (isRbacViolation) {
                    riskScore = 88.5;
                } else if (dto.getRecordsAccessed() > 100) {
                    riskScore = 75.0;
                }
            }

            // Enforce appropriate high risk baseline for RBAC Policy Violations
            if (isRbacViolation) {
                int resSensitivity = resource.getSensitivityScore() != null ? resource.getSensitivityScore() : 95;
                double baseRbacRisk = resSensitivity >= 80 ? 88.5 : 78.0;
                riskScore = Math.max(riskScore, baseRbacRisk);
                if (!reasons.contains("Role Permission Violation")) {
                    reasons.add("Role Permission Violation");
                }
            }

            if (isDecoy) {
                riskScore = 100.0;
                level = "CRITICAL";
                recommendedAction = "ISOLATE";
                if (!reasons.contains("Decoy Honey Resource Access: " + resource.getId())) {
                    reasons.add("Decoy Honey Resource Access: " + resource.getId());
                }
            }

            String severity = "LOW";
            if (riskScore >= 85.0) severity = "CRITICAL";
            else if (riskScore >= 70.0) severity = "HIGH";
            else if (riskScore >= 50.0) severity = "MEDIUM";

            String eventType = isDecoy ? "DECOY_RESOURCE_ACCESS" : (isRbacViolation ? "RBAC_VIOLATION" : "RESOURCE_ACCESS");
            String description = String.format("%s on %s (Risk Score: %.1f%%)", dto.getActionType(), resource.getId(), riskScore);

            // 2. Persist SecurityEvent to Database
            SecurityEvent event = new SecurityEvent(session, employee, eventType, severity, description);
            securityEventRepository.save(event);

            // 3. Automated Isolation if Risk > 95%
            String sessionStatus = session.getStatus();
            if (riskScore >= 95.0 || isDecoy) {
                sessionStatus = "ISOLATED";
                IsolationEvaluationRequestDTO isoReq = new IsolationEvaluationRequestDTO();
                isoReq.setSessionId(session.getSessionId());
                isoReq.setEmployeeId(employee.getId());
                isoReq.setRiskScore(riskScore);
                isoReq.setReason(description);
                isoReq.setDecoyAccess(isDecoy);
                isoReq.setAccessedResource(resource.getId());
                isoReq.setContributingFactors(reasons);
                isolationService.evaluateAndProcessIsolation(isoReq);
            }

            // 4. Construct Real-Time WebSocket Event Payload
            Map<String, Object> broadcast = new HashMap<>();
            broadcast.put("type", "SECURITY_EVENT");
            broadcast.put("employeeId", employee.getId());
            broadcast.put("employeeName", employee.getName());
            broadcast.put("sessionId", session.getSessionId());
            broadcast.put("eventType", eventType);
            broadcast.put("riskScore", riskScore);
            broadcast.put("severity", severity);
            broadcast.put("level", level);
            broadcast.put("status", sessionStatus);
            broadcast.put("recommendedAction", recommendedAction);
            broadcast.put("resource", resource.getId());
            broadcast.put("reasons", reasons);
            broadcast.put("attackSequenceStage", attackStage);
            broadcast.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss")));

            // 5. Broadcast to Connected Security Dashboard Clients
            webSocketPublisherService.broadcastSecurityEvent(broadcast);

        } catch (Exception e) {
            System.err.println("Real-time pipeline evaluation error: " + e.getMessage());
        }
    }
}
