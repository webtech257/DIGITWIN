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

    private final Map<String, Double> sessionRiskMap = new java.util.concurrent.ConcurrentHashMap<>();

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

    public void resetSessionRisk(String sessionId) {
        if (sessionId != null) {
            String clean = sessionId.replaceAll("(?i)SESS-", "").replaceAll("(?i)-ISOLATED", "").replaceAll("(?i)-ALPHA", "").replaceAll("(?i)-LIVE", "").trim();
            sessionRiskMap.remove(sessionId);
            sessionRiskMap.keySet().removeIf(k -> 
                k.equalsIgnoreCase(sessionId) || 
                k.contains(sessionId) || 
                (!clean.isEmpty() && k.toUpperCase().contains(clean.toUpperCase()))
            );
        }
    }

    public void resetSessionRiskForEmployee(String employeeId) {
        if (employeeId != null) {
            String eid = employeeId.trim().toUpperCase();
            sessionRiskMap.keySet().removeIf(k -> k.toUpperCase().contains(eid));
        }
    }

    public double getSessionRiskScore(String sessionId) {
        if (sessionId == null) return 0.0;
        return sessionRiskMap.getOrDefault(sessionId, 0.0);
    }

    public List<EmployeeActivity> getAllActivities() {
        return activityRepository.findAll();
    }

    public EmployeeActivity logActivity(ActivityRequestDTO dto) {
        // Fetch or create Role
        Role defaultRole = roleRepository.findById("ROLE_CUST_SERVICE")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_CUST_SERVICE", "Customer Service Representative", "Default representative role")));

        // Fetch or auto-create synthetic employee
        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseGet(() -> {
                    String initialName = "EMP1024".equalsIgnoreCase(dto.getEmployeeId()) ? "Malavika" : ("Employee " + dto.getEmployeeId());
                    Employee defaultEmp = new Employee(
                        dto.getEmployeeId(),
                        initialName,
                        dto.getEmployeeId().toLowerCase() + "@twinshield-bank.internal",
                        "Retail Banking",
                        defaultRole,
                        "ACTIVE"
                    );
                    return employeeRepository.save(defaultEmp);
                });

        String effectiveSessionId = (dto.getSessionId() != null && !dto.getSessionId().isBlank())
                ? dto.getSessionId()
                : "SESS-" + dto.getEmployeeId() + "-ALPHA";

        Session session = sessionRepository.findById(effectiveSessionId)
                .orElseGet(() -> {
                    Session newSession = new Session(
                        effectiveSessionId,
                        employee,
                        dto.getIpAddress() != null ? dto.getIpAddress() : "192.168.1.45",
                        dto.getLocationCity() != null ? dto.getLocationCity() : "Chennai",
                        dto.getDeviceFingerprint() != null ? dto.getDeviceFingerprint() : "BANK-PC-" + dto.getEmployeeId() + "-HASH",
                        "Mozilla/5.0 (Windows NT 10.0)",
                        "ACTIVE"
                    );
                    return sessionRepository.save(newSession);
                });

        String effectiveResourceId = (dto.getResourceId() != null && !dto.getResourceId().isBlank())
                ? dto.getResourceId()
                : "/api/v1/customer/profile";

        Resource resource = resourceRepository.findById(effectiveResourceId)
                .orElseGet(() -> {
                    String resIdLower = effectiveResourceId.toLowerCase();
                    boolean isDecoy = resIdLower.contains("decoy");
                    boolean isVipOrReport = resIdLower.contains("vip") || resIdLower.contains("reports") || resIdLower.contains("manager");
                    int sensitivity = isDecoy ? 100 : (isVipOrReport ? 95 : 50);
                    Resource defaultRes = new Resource(
                        effectiveResourceId,
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
            boolean isDecoy = Boolean.TRUE.equals(dto.getIsDecoy()) ||
                    (resource.getIsDecoy() != null && resource.getIsDecoy()) ||
                    (dto.getResourceId() != null && (dto.getResourceId().toLowerCase().contains("decoy") || dto.getResourceId().toLowerCase().contains("honey")));

            String sessId = session.getSessionId();
            double priorRiskScore = sessionRiskMap.getOrDefault(sessId, 0.0);

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
                double mlAnomalyScore = (isRbacViolation || isDecoy) ? 0.75 : (dto.getRecordsAccessed() > 100 ? 0.60 : 0.05);
                riskReq.put("ml_anomaly_score", mlAnomalyScore);
                riskReq.put("is_rbac_violation", isRbacViolation);
                riskReq.put("resource_sensitivity", resource.getSensitivityScore() != null ? resource.getSensitivityScore() : (isRbacViolation ? 95 : 30));
                riskReq.put("is_unknown_device", !session.getDeviceFingerprint().contains("BANK-PC"));
                riskReq.put("is_unusual_location", "Foreign IP / Remote".equalsIgnoreCase(session.getLocationCity()));
                riskReq.put("api_velocity", dto.getRecordsAccessed() > 50 ? 35.0 : 4.0);
                riskReq.put("data_volume_bytes", dto.getDataVolumeBytes());
                riskReq.put("recent_activity_sequence", Arrays.asList(dto.getActionType(), resource.getName()));
                riskReq.put("prior_risk_score", priorRiskScore);

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
                    riskScore = 50.0;
                } else if (dto.getRecordsAccessed() > 100) {
                    riskScore = 35.0;
                } else {
                    riskScore = 5.0;
                }
            }

            if (isRbacViolation && !isDecoy) {
                if (!reasons.contains("Role Permission Violation")) {
                    reasons.add("Role Permission Violation");
                }
                // Accumulate risk for RBAC violations: 1st = 35%, 2nd = 70%, 3rd = 100%
                riskScore = Math.min(100.0, priorRiskScore + 35.0);
                if (riskScore >= 100.0) {
                    level = "CRITICAL";
                    recommendedAction = "ISOLATE";
                } else if (riskScore >= 70.0) {
                    level = "RESTRICTED";
                    recommendedAction = "BLOCK_SENSITIVE";
                } else {
                    level = "ELEVATED";
                    recommendedAction = "BLOCK_SENSITIVE";
                }
            } else if (!isDecoy) {
                // For other non-decoy activities, accumulate prior risk if elevated
                if (priorRiskScore > 0) {
                    riskScore = Math.min(100.0, priorRiskScore + (riskScore > 10.0 ? (riskScore * 0.3) : 0.0));
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

            // Save updated cumulative risk score for this session
            sessionRiskMap.put(sessId, riskScore);

            String severity = "LOW";
            if (riskScore >= 85.0) severity = "CRITICAL";
            else if (riskScore >= 70.0) severity = "HIGH";
            else if (riskScore >= 50.0) severity = "MEDIUM";

            String eventType = isDecoy ? "DECOY_RESOURCE_ACCESS" : (isRbacViolation ? "RBAC_VIOLATION" : "RESOURCE_ACCESS");
            String description = String.format("%s on %s (Risk Score: %.1f%%)", dto.getActionType(), resource.getId(), riskScore);

            // 2. Persist SecurityEvent to Database
            SecurityEvent event = new SecurityEvent(session, employee, eventType, severity, description);
            securityEventRepository.save(event);

            // 3. Automated Isolation ONLY if Risk >= 100% or Decoy Access
            String sessionStatus = "ACTIVE";
            if (riskScore >= 100.0 || isDecoy) {
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
