package com.twinshield.backend.service;

import com.twinshield.backend.dto.IsolationEvaluationRequestDTO;
import com.twinshield.backend.entity.*;
import com.twinshield.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class IsolationService {

    private static final double CRITICAL_THRESHOLD = 100.0;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private SecurityEventRepository securityEventRepository;

    @Autowired
    private IncidentRepository incidentRepository;

    @Autowired
    private IsolationActionRepository isolationActionRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @org.springframework.context.annotation.Lazy
    @Autowired
    private ActivityService activityService;

    @Autowired
    private WebSocketPublisherService webSocketPublisherService;

    @Transactional
    public Map<String, Object> evaluateAndProcessIsolation(IsolationEvaluationRequestDTO req) {
        Map<String, Object> result = new HashMap<>();
        
        Optional<Session> sessionOpt = sessionRepository.findBySessionId(req.getSessionId());
        Session session = sessionOpt.orElseGet(() -> {
            Employee emp = employeeRepository.findById(req.getEmployeeId()).orElse(null);
            Session newSession = new Session(
                req.getSessionId(),
                emp,
                "192.168.1.45",
                "Chennai",
                "UNKNOWN-LAPTOP-X9",
                "Mozilla/5.0",
                "ACTIVE"
            );
            return sessionRepository.save(newSession);
        });

        Employee employee = session.getEmployee();
        double riskScore = req.getRiskScore();
        boolean shouldIsolate = riskScore >= CRITICAL_THRESHOLD || req.isDecoyAccess();

        if (shouldIsolate) {
            // 1. Mark session as ISOLATED & revoke active status across all employee sessions
            session.setStatus("ISOLATED");
            session.setLastActivityTime(LocalDateTime.now());
            sessionRepository.save(session);

            if (employee != null) {
                List<Session> empSessions = sessionRepository.findAll().stream()
                        .filter(s -> s.getEmployee() != null && s.getEmployee().getId().equalsIgnoreCase(employee.getId()))
                        .toList();
                for (Session s : empSessions) {
                    s.setStatus("ISOLATED");
                    s.setLastActivityTime(LocalDateTime.now());
                    sessionRepository.save(s);
                }
            }

            // 2. Create Security Incident
            String incidentCode = "INC-" + System.currentTimeMillis();
            String threatType = req.isDecoyAccess() ? "DECOY_RESOURCE_TRIGGER" : "AUTOMATED_SESSION_ISOLATION";
            Incident incident = new Incident(
                incidentCode,
                employee,
                session,
                threatType,
                100.0,
                riskScore,
                "OPEN"
            );
            incident = incidentRepository.save(incident);

            // 3. Create Isolation Action Record
            IsolationAction isolationAction = new IsolationAction(
                session, employee, incident, riskScore, req.getReason(), "ISOLATED"
            );
            isolationActionRepository.save(isolationAction);

            // 4. Generate Security Event
            SecurityEvent event = new SecurityEvent(
                session,
                employee,
                "AUTOMATED_SESSION_ISOLATION",
                "CRITICAL",
                "🔴 SESSION ISOLATED: Risk Score: " + riskScore + "% crossed critical threshold (" + CRITICAL_THRESHOLD + "%). Session revoked."
            );
            securityEventRepository.save(event);

            // 5. Record Audit Log
            AuditLog audit = new AuditLog(
                "SYSTEM_POLICY_ENGINE",
                "AUTOMATED_SESSION_ISOLATION",
                "SESSION",
                req.getSessionId(),
                "Session isolated automatically due to Risk Score " + riskScore + "%. Reason: " + req.getReason()
            );
            auditLogRepository.save(audit);

            // 6. Broadcast real-time WebSocket isolation event
            if (webSocketPublisherService != null) {
                Map<String, Object> broadcast = new HashMap<>();
                broadcast.put("type", "SECURITY_EVENT");
                broadcast.put("employeeId", employee != null ? employee.getId() : "EMP1024");
                broadcast.put("employeeName", employee != null ? employee.getName() : "Malavika");
                broadcast.put("sessionId", session.getSessionId());
                broadcast.put("eventType", "AUTOMATED_SESSION_ISOLATION");
                broadcast.put("riskScore", riskScore);
                broadcast.put("severity", "CRITICAL");
                broadcast.put("level", "CRITICAL");
                broadcast.put("status", "ISOLATED");
                broadcast.put("recommendedAction", "ISOLATE");
                broadcast.put("resource", req.getAccessedResource() != null ? req.getAccessedResource() : "ANOMALY_TRIGGER");
                broadcast.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss")));
                webSocketPublisherService.broadcastSecurityEvent(broadcast);
            }

            result.put("isolated", true);
            result.put("status", "ISOLATED");
            result.put("message", "Session quarantined successfully under Zero-Trust protocol.");
            result.put("incidentCode", incidentCode);
            result.put("riskScore", riskScore);
        } else {
            result.put("isolated", false);
            result.put("status", session.getStatus());
            result.put("message", "Risk score below critical threshold. Session active.");
            result.put("riskScore", riskScore);
        }

        return result;
    }

    private boolean isSessionMatch(Session s, String targetId) {
        if (s == null || targetId == null) return false;
        String tid = targetId.trim().toUpperCase();
        String sid = s.getSessionId() != null ? s.getSessionId().toUpperCase() : "";
        String eid = s.getEmployee() != null ? s.getEmployee().getId().toUpperCase() : "";
        String numOnlyTid = tid.replaceAll("[^0-9]", "");
        String numOnlyEid = eid.replaceAll("[^0-9]", "");
        String numOnlySid = sid.replaceAll("[^0-9]", "");

        return sid.equals(tid) ||
               eid.equals(tid) ||
               (!numOnlyTid.isEmpty() && (numOnlyEid.equals(numOnlyTid) || numOnlySid.equals(numOnlyTid))) ||
               (eid.length() > 0 && tid.contains(eid)) ||
               (tid.length() > 0 && sid.contains(tid));
    }

    @Transactional
    public Map<String, Object> restoreSession(String sessionId, String actorId) {
        Map<String, Object> res = new HashMap<>();
        
        List<Session> matchingSessions = sessionRepository.findAll().stream()
                .filter(s -> isSessionMatch(s, sessionId))
                .toList();

        Employee targetEmployee = null;
        Session targetSession = null;

        if (!matchingSessions.isEmpty()) {
            for (Session session : matchingSessions) {
                session.setStatus("ACTIVE");
                session.setLastActivityTime(LocalDateTime.now());
                sessionRepository.save(session);
                targetSession = session;
                if (session.getEmployee() != null) {
                    targetEmployee = session.getEmployee();
                }
            }
        }

        if (targetEmployee == null) {
            String cleanEmpId = sessionId.replaceAll("(?i)SESS-", "").replaceAll("(?i)-ISOLATED", "").replaceAll("(?i)-ALPHA", "").replaceAll("(?i)-LIVE", "");
            Optional<Employee> empOpt = employeeRepository.findById(cleanEmpId);
            if (empOpt.isPresent()) {
                targetEmployee = empOpt.get();
            } else {
                targetEmployee = employeeRepository.findAll().stream()
                        .filter(e -> e.getId().equalsIgnoreCase(cleanEmpId) || sessionId.toUpperCase().contains(e.getId().toUpperCase()))
                        .findFirst()
                        .orElse(null);
            }
            if (targetEmployee == null) {
                targetEmployee = employeeRepository.findById("EMP1024").orElse(null);
            }
        }

        // Restore target employee to ACTIVE in database as well
        if (targetEmployee != null) {
            targetEmployee.setStatus("ACTIVE");
            employeeRepository.save(targetEmployee);

            // Also ensure all sessions belonging to this employee are ACTIVE
            final String tid = targetEmployee.getId();
            List<Session> allEmpSessions = sessionRepository.findAll().stream()
                    .filter(s -> s.getEmployee() != null && s.getEmployee().getId().equalsIgnoreCase(tid))
                    .toList();
            for (Session s : allEmpSessions) {
                s.setStatus("ACTIVE");
                s.setLastActivityTime(LocalDateTime.now());
                sessionRepository.save(s);
                if (targetSession == null) targetSession = s;
            }

            // Update all isolation actions for this employee to RESTORED
            List<IsolationAction> actions = isolationActionRepository.findAll().stream()
                    .filter(ia -> (ia.getEmployee() != null && ia.getEmployee().getId().equalsIgnoreCase(tid))
                               || (ia.getSession() != null && isSessionMatch(ia.getSession(), sessionId)))
                    .toList();
            for (IsolationAction ia : actions) {
                ia.setStatus("RESTORED");
                ia.setResolvedBy(actorId != null ? actorId : "SOC_ANALYST");
                ia.setResolvedAt(LocalDateTime.now());
                ia.setResolutionNotes("Session restored to ACTIVE by SOC Analyst: " + actorId);
                isolationActionRepository.save(ia);
            }

            if (activityService != null) {
                activityService.resetSessionRisk(sessionId);
                activityService.resetSessionRiskForEmployee(tid);
                for (Session s : allEmpSessions) {
                    activityService.resetSessionRisk(s.getSessionId());
                }
            }
        }

        // Record RESTORE_SESSION SecurityEvent in DB so polling engine sees 0.0% risk score
        SecurityEvent event = new SecurityEvent(
            targetSession,
            targetEmployee,
            "RESTORE_SESSION",
            "INFO",
            "🟢 SESSION RESTORED: Risk Score: 0.0%. Access restored by " + (actorId != null ? actorId : "SOC_ANALYST")
        );
        securityEventRepository.save(event);

        AuditLog audit = new AuditLog(
            actorId != null ? actorId : "SOC_ANALYST",
            "RESTORE_SESSION",
            "SESSION",
            sessionId,
            "Session manually restored by SOC analyst after security review."
        );
        auditLogRepository.save(audit);

        // Broadcast real-time WebSocket restore event
        if (webSocketPublisherService != null) {
            Map<String, Object> broadcast = new HashMap<>();
            broadcast.put("type", "SECURITY_EVENT");
            broadcast.put("employeeId", targetEmployee != null ? targetEmployee.getId() : "EMP1024");
            broadcast.put("employeeName", targetEmployee != null ? targetEmployee.getName() : "Malavika");
            broadcast.put("sessionId", targetSession != null ? targetSession.getSessionId() : sessionId);
            broadcast.put("eventType", "RESTORE_SESSION");
            broadcast.put("riskScore", 0.0);
            broadcast.put("severity", "LOW");
            broadcast.put("level", "NORMAL");
            broadcast.put("status", "ACTIVE");
            broadcast.put("recommendedAction", "ALLOW");
            broadcast.put("resource", "SESSION_RESTORED");
            broadcast.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss")));
            webSocketPublisherService.broadcastSecurityEvent(broadcast);
        }

        res.put("success", true);
        res.put("status", "ACTIVE");
        res.put("message", "Session restored successfully.");

        return res;
    }

    @Transactional
    public Map<String, Object> requireMFA(String sessionId, String actorId) {
        Map<String, Object> res = new HashMap<>();
        List<Session> matchingSessions = sessionRepository.findAll().stream()
                .filter(s -> isSessionMatch(s, sessionId))
                .toList();

        if (!matchingSessions.isEmpty()) {
            for (Session session : matchingSessions) {
                session.setStatus("STEP_UP_MFA");
                sessionRepository.save(session);
            }
            res.put("success", true);
            res.put("status", "STEP_UP_MFA");
            res.put("message", "Step-up MFA enforced for session " + sessionId);
        } else {
            res.put("success", false);
            res.put("message", "Session ID not found.");
        }

        AuditLog audit = new AuditLog(
            actorId != null ? actorId : "SOC_ANALYST",
            "REQUIRE_MFA",
            "SESSION",
            sessionId,
            "Mandatory step-up MFA challenge enforced by SOC analyst."
        );
        auditLogRepository.save(audit);

        // Broadcast real-time WebSocket event
        if (webSocketPublisherService != null && !matchingSessions.isEmpty()) {
            Session s = matchingSessions.get(0);
            Map<String, Object> broadcast = new HashMap<>();
            broadcast.put("type", "SECURITY_EVENT");
            broadcast.put("employeeId", s.getEmployee() != null ? s.getEmployee().getId() : "EMP1024");
            broadcast.put("sessionId", s.getSessionId());
            broadcast.put("eventType", "REQUIRE_MFA");
            broadcast.put("riskScore", 75.0);
            broadcast.put("severity", "HIGH");
            broadcast.put("level", "ELEVATED");
            broadcast.put("status", "STEP_UP_MFA");
            broadcast.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss")));
            webSocketPublisherService.broadcastSecurityEvent(broadcast);
        }

        return res;
    }

    @Transactional
    public Map<String, Object> disableAccount(String employeeId, String actorId) {
        Map<String, Object> res = new HashMap<>();
        Optional<Employee> empOpt = employeeRepository.findById(employeeId);

        if (empOpt.isPresent()) {
            Employee emp = empOpt.get();
            emp.setStatus("SUSPENDED");
            employeeRepository.save(emp);

            // Update all sessions of this employee to SUSPENDED as well
            List<Session> empSessions = sessionRepository.findAll().stream()
                    .filter(s -> s.getEmployee() != null && s.getEmployee().getId().equalsIgnoreCase(emp.getId()))
                    .toList();
            for (Session s : empSessions) {
                s.setStatus("SUSPENDED");
                s.setLastActivityTime(LocalDateTime.now());
                sessionRepository.save(s);
            }

            Session mainSession = empSessions.isEmpty() ? null : empSessions.get(0);

            // Record IsolationAction
            IsolationAction action = new IsolationAction(
                mainSession,
                emp,
                null,
                100.0,
                "Employee account permanently suspended by SOC analyst: " + actorId,
                "ACCOUNT_DISABLED"
            );
            isolationActionRepository.save(action);

            // Record SecurityEvent
            SecurityEvent event = new SecurityEvent(
                mainSession,
                emp,
                "DISABLE_ACCOUNT",
                "CRITICAL",
                "💀 ACCOUNT SUSPENDED: Employee " + employeeId + " account disabled by " + (actorId != null ? actorId : "SOC_ANALYST")
            );
            securityEventRepository.save(event);

            AuditLog audit = new AuditLog(
                actorId != null ? actorId : "SOC_ANALYST",
                "DISABLE_ACCOUNT",
                "EMPLOYEE",
                employeeId,
                "Employee account permanently suspended due to malicious threat activity."
            );
            auditLogRepository.save(audit);

            // Broadcast real-time WebSocket event
            if (webSocketPublisherService != null) {
                Map<String, Object> broadcast = new HashMap<>();
                broadcast.put("type", "SECURITY_EVENT");
                broadcast.put("employeeId", employeeId);
                broadcast.put("employeeName", emp.getName());
                broadcast.put("sessionId", mainSession != null ? mainSession.getSessionId() : ("SESS-" + employeeId + "-LIVE"));
                broadcast.put("eventType", "DISABLE_ACCOUNT");
                broadcast.put("riskScore", 100.0);
                broadcast.put("severity", "CRITICAL");
                broadcast.put("level", "CRITICAL");
                broadcast.put("status", "SUSPENDED");
                broadcast.put("recommendedAction", "ACCOUNT_DISABLED");
                broadcast.put("resource", "IDENTITY_DIRECTORY");
                broadcast.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss")));
                webSocketPublisherService.broadcastSecurityEvent(broadcast);
            }

            res.put("success", true);
            res.put("status", "SUSPENDED");
            res.put("message", "Employee " + employeeId + " account disabled.");
        } else {
            res.put("success", false);
            res.put("message", "Employee ID not found.");
        }
        return res;
    }

    public Map<String, Object> getSessionStatus(String sessionId) {
        Map<String, Object> res = new HashMap<>();
        List<Session> matchingSessions = sessionRepository.findAll().stream()
                .filter(s -> isSessionMatch(s, sessionId))
                .toList();

        double riskScore = activityService != null ? activityService.getSessionRiskScore(sessionId) : 0.0;

        if (!matchingSessions.isEmpty()) {
            Session session = matchingSessions.stream()
                    .filter(s -> "ISOLATED".equalsIgnoreCase(s.getStatus()) || "STEP_UP_MFA".equalsIgnoreCase(s.getStatus()) || "SUSPENDED".equalsIgnoreCase(s.getStatus()))
                    .findFirst()
                    .orElseGet(() -> matchingSessions.get(0));

            Employee emp = session.getEmployee();
            String empStatus = emp != null && emp.getStatus() != null ? emp.getStatus() : "ACTIVE";
            String sessStatus = session.getStatus() != null ? session.getStatus() : "ACTIVE";

            // If employee account is suspended, session status is also effectively suspended
            if ("SUSPENDED".equalsIgnoreCase(empStatus)) {
                sessStatus = "SUSPENDED";
            } else if ("ISOLATED".equalsIgnoreCase(empStatus)) {
                sessStatus = "ISOLATED";
            } else if ("ACTIVE".equalsIgnoreCase(empStatus) && "ACTIVE".equalsIgnoreCase(session.getStatus())) {
                sessStatus = "ACTIVE";
            }

            res.put("sessionId", session.getSessionId());
            res.put("status", sessStatus);
            res.put("riskScore", riskScore);
            res.put("employeeId", emp != null ? emp.getId() : null);
            res.put("employeeStatus", empStatus);
        } else {
            // Check if sessionId maps to an employee directly
            String cleanEmpId = sessionId != null ? sessionId.replaceAll("(?i)SESS-", "").replaceAll("(?i)-ISOLATED", "").replaceAll("(?i)-ALPHA", "").replaceAll("(?i)-LIVE", "") : "";
            Optional<Employee> empOpt = employeeRepository.findById(cleanEmpId);
            if (empOpt.isPresent()) {
                Employee emp = empOpt.get();
                String empStatus = emp.getStatus() != null ? emp.getStatus() : "ACTIVE";
                res.put("sessionId", sessionId);
                res.put("status", "SUSPENDED".equalsIgnoreCase(empStatus) ? "SUSPENDED" : "ACTIVE");
                res.put("riskScore", riskScore);
                res.put("employeeId", emp.getId());
                res.put("employeeStatus", empStatus);
            } else {
                res.put("sessionId", sessionId);
                res.put("status", "ACTIVE");
                res.put("riskScore", riskScore);
                res.put("employeeStatus", "ACTIVE");
            }
        }
        return res;
    }

    public List<Map<String, Object>> getRecentIsolationActions() {
        List<Map<String, Object>> list = new ArrayList<>();
        Map<String, Map<String, Object>> activeMap = new LinkedHashMap<>();

        // 1. Gather active isolated or suspended sessions from sessionRepository
        List<Session> sessions = sessionRepository.findAll();
        for (Session s : sessions) {
            String sStatus = s.getStatus() != null ? s.getStatus().toUpperCase() : "ACTIVE";
            Employee emp = s.getEmployee();
            String eStatus = emp != null && emp.getStatus() != null ? emp.getStatus().toUpperCase() : "ACTIVE";

            if ("ISOLATED".equals(sStatus) || "STEP_UP_MFA".equals(sStatus) || "SUSPENDED".equals(sStatus) || "SUSPENDED".equals(eStatus) || "ISOLATED".equals(eStatus)) {
                String empKey = emp != null ? emp.getId() : s.getSessionId();
                Map<String, Object> item = new HashMap<>();
                item.put("sessionId", s.getSessionId());
                item.put("employeeId", emp != null ? emp.getId() : "EMP1024");
                item.put("employeeName", emp != null ? emp.getName() : "Employee");
                item.put("riskScore", 100.0);
                item.put("reason", "SUSPENDED".equals(eStatus) ? "Account suspended by SOC Administrator" : "Zero-Trust Automated Anomaly Containment");
                item.put("status", "SUSPENDED".equals(eStatus) ? "ACCOUNT_DISABLED" : sStatus);
                item.put("isolatedAt", s.getLastActivityTime() != null ? s.getLastActivityTime().toString() : LocalDateTime.now().toString());
                item.put("createdAt", s.getLastActivityTime() != null ? s.getLastActivityTime().toString() : LocalDateTime.now().toString());
                activeMap.put(empKey, item);
            }
        }

        // 2. Overlay recent IsolationAction records (most recent first)
        List<IsolationAction> actions = isolationActionRepository.findAll();
        for (IsolationAction act : actions) {
            String status = act.getStatus() != null ? act.getStatus().toUpperCase() : "ISOLATED";
            String sId = act.getSession() != null ? act.getSession().getSessionId() : ("SESS-" + (act.getEmployee() != null ? act.getEmployee().getId() : "EMP1024") + "-LIVE");
            String empKey = act.getEmployee() != null ? act.getEmployee().getId() : sId;

            // Only include non-restored actions
            if (!"RESTORED".equals(status)) {
                Map<String, Object> item = new HashMap<>();
                item.put("id", act.getId());
                item.put("sessionId", sId);
                item.put("employeeId", act.getEmployee() != null ? act.getEmployee().getId() : "EMP1024");
                item.put("employeeName", act.getEmployee() != null ? act.getEmployee().getName() : "Employee");
                item.put("riskScore", act.getTriggerRiskScore() != null ? act.getTriggerRiskScore() : 100.0);
                item.put("reason", act.getIsolationReason() != null ? act.getIsolationReason() : "Zero-Trust Policy Containment");
                item.put("status", status);
                item.put("isolatedAt", act.getIsolatedAt() != null ? act.getIsolatedAt().toString() : LocalDateTime.now().toString());
                item.put("createdAt", act.getIsolatedAt() != null ? act.getIsolatedAt().toString() : LocalDateTime.now().toString());
                activeMap.put(empKey, item);
            } else {
                // If action was restored, remove any isolated entry for this employee / session
                activeMap.remove(empKey);
                activeMap.remove(sId);
            }
        }

        // 3. Filter out any employee whose sessions are ALL active and employee status is ACTIVE
        activeMap.entrySet().removeIf(entry -> {
            String empId = (String) entry.getValue().get("employeeId");
            if (empId != null) {
                Employee emp = employeeRepository.findById(empId).orElse(null);
                if (emp != null && "ACTIVE".equalsIgnoreCase(emp.getStatus())) {
                    boolean hasQuarantinedSession = sessionRepository.findAll().stream()
                            .anyMatch(s -> s.getEmployee() != null && s.getEmployee().getId().equalsIgnoreCase(empId) &&
                                    ("ISOLATED".equalsIgnoreCase(s.getStatus()) || "SUSPENDED".equalsIgnoreCase(s.getStatus()) || "STEP_UP_MFA".equalsIgnoreCase(s.getStatus())));
                    return !hasQuarantinedSession;
                }
            }
            return false;
        });

        list.addAll(activeMap.values());
        return list;
    }
}



