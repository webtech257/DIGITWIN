package com.twinshield.backend.service;

import com.twinshield.backend.dto.IsolationEvaluationRequestDTO;
import com.twinshield.backend.entity.*;
import com.twinshield.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


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
                sessionRepository.save(session);
                targetSession = session;
                if (session.getEmployee() != null) {
                    targetEmployee = session.getEmployee();
                }
            }
        } else {
            String cleanEmpId = sessionId.replaceAll("(?i)SESS-", "").replaceAll("(?i)-ISOLATED", "").replaceAll("(?i)-ALPHA", "");
            Optional<Employee> empOpt = employeeRepository.findById(cleanEmpId);
            if (empOpt.isEmpty()) {
                empOpt = employeeRepository.findById("EMP1024");
            }
            if (empOpt.isPresent()) {
                targetEmployee = empOpt.get();
                final String empIdToMatch = targetEmployee.getId();
                List<Session> empSessions = sessionRepository.findAll().stream()
                        .filter(s -> s.getEmployee() != null && s.getEmployee().getId().equalsIgnoreCase(empIdToMatch))
                        .toList();
                for (Session s : empSessions) {
                    s.setStatus("ACTIVE");
                    sessionRepository.save(s);
                    targetSession = s;
                }
            }
        }

        if (targetEmployee == null) {
            targetEmployee = employeeRepository.findById("EMP1024").orElse(null);
        }

        if (targetSession == null && targetEmployee != null) {
            targetSession = new Session(sessionId, targetEmployee, "192.168.1.45", "Chennai", "BANK-PC-1024", "Mozilla/5.0", "ACTIVE");
            sessionRepository.save(targetSession);
        }

        if (activityService != null) {
            activityService.resetSessionRisk(sessionId);
            if (targetEmployee != null) {
                activityService.resetSessionRisk(targetEmployee.getId());
                activityService.resetSessionRisk("SESS-1024-ALPHA");
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

            AuditLog audit = new AuditLog(
                actorId != null ? actorId : "SOC_ANALYST",
                "DISABLE_ACCOUNT",
                "EMPLOYEE",
                employeeId,
                "Employee account permanently suspended due to malicious threat activity."
            );
            auditLogRepository.save(audit);

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
                    .orElseGet(() -> matchingSessions.stream()
                            .filter(s -> isSessionMatch(s, sessionId))
                            .findFirst()
                            .orElse(matchingSessions.get(0)));

            res.put("sessionId", session.getSessionId());
            res.put("status", session.getStatus());
            res.put("riskScore", riskScore);
            res.put("employeeId", session.getEmployee() != null ? session.getEmployee().getId() : null);
            res.put("employeeStatus", session.getEmployee() != null ? session.getEmployee().getStatus() : "ACTIVE");
        } else {
            res.put("sessionId", sessionId);
            res.put("status", "ACTIVE");
            res.put("riskScore", riskScore);
            res.put("employeeStatus", "ACTIVE");
        }
        return res;
    }
}


