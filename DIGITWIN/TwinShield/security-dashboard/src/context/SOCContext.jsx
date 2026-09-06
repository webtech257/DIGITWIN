import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const SOCContext = createContext(null);

const parseRiskScoreFromDesc = (desc, severity) => {
  if (!desc) return severity === 'CRITICAL' ? 95.0 : 45.0;
  const match = desc.match(/Risk\s*Score:?\s*([\d.]+)/i) || desc.match(/(\d+(?:\.\d+)?)%/);
  if (match && match[1]) {
    const val = parseFloat(match[1]);
    if (!isNaN(val) && val > 0) return val;
  }
  return severity === 'CRITICAL' ? 95.0 : 45.0;
};


export const SOCProvider = ({ children }) => {
  const [stats, setStats] = useState({
    totalEmployees: 3,
    activeSessions: 3,
    suspiciousSessions: 0,
    criticalThreats: 0,
    isolatedSessions: 0
  });

  const [threatEvents, setThreatEvents] = useState([]);

  const [employees, setEmployees] = useState([
    {
      id: 'EMP1024',
      name: 'John Doe',
      role: 'Customer Service Representative',
      department: 'Retail Banking',
      riskScore: 0.0,
      status: 'NORMAL',
      currentThreat: 'NONE',
      sessionId: 'SESS-1024-ALPHA',
      device: 'BANK-PC-1024',
      location: 'Chennai Office',
      expectedBehavior: {
        workingHours: '09:00 - 18:00 IST',
        device: 'BANK-PC-1024',
        location: 'Chennai Office',
        avgDailyAccesses: 25,
        typicalResources: '/api/v1/customer/profile, /api/v1/transactions/search'
      },
      currentBehavior: {
        loginTime: '09:00 AM (Normal)',
        device: 'BANK-PC-1024 (Known)',
        location: 'Chennai Office (Normal)',
        accessesCount: 5,
        resourceAccessed: '/api/v1/customer/profile'
      }
    },
    {
      id: 'EMP2031',
      name: 'Sarah Jenkins',
      role: 'Branch Manager',
      department: 'Branch Operations',
      riskScore: 0.0,
      status: 'NORMAL',
      currentThreat: 'NONE',
      sessionId: 'SESS-2031-BETA',
      device: 'BANK-PC-2031',
      location: 'Chennai Office',
      expectedBehavior: {
        workingHours: '08:30 - 19:00 IST',
        device: 'BANK-PC-2031',
        location: 'Chennai Office',
        avgDailyAccesses: 40,
        typicalResources: '/api/v1/customer/profile, /api/v1/reports/manager-summary'
      },
      currentBehavior: {
        loginTime: '08:45 AM (Normal)',
        device: 'BANK-PC-2031 (Known)',
        location: 'Chennai Office (Normal)',
        accessesCount: 8,
        resourceAccessed: '/api/v1/reports/manager-summary'
      }
    },
    {
      id: 'EMP5099',
      name: 'Alex Vance',
      role: 'System Administrator',
      department: 'IT Security & Admin',
      riskScore: 0.0,
      status: 'NORMAL',
      currentThreat: 'NONE',
      sessionId: 'SESS-5099-GAMMA',
      device: 'ADMIN-PC-5099',
      location: 'Chennai Office',
      expectedBehavior: {
        workingHours: '09:00 - 18:00 IST',
        device: 'ADMIN-PC-5099',
        location: 'Chennai Office',
        avgDailyAccesses: 50,
        typicalResources: '/api/v1/customer/profile, /api/v1/reports/manager-summary'
      },
      currentBehavior: {
        loginTime: '09:00 AM (Normal)',
        device: 'ADMIN-PC-5099 (Known)',
        location: 'Chennai Office (Normal)',
        accessesCount: 12,
        resourceAccessed: '/api/v1/reports/manager-summary'
      }
    }
  ]);

  const [isolatedSessions, setIsolatedSessions] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState('EMP1024');
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef(null);

const formatTimestamp = (rawDate) => {
  if (!rawDate) return new Date().toLocaleTimeString();
  if (Array.isArray(rawDate)) {
    const [y, m, d, hh = 0, mm = 0, ss = 0] = rawDate;
    return new Date(y, m - 1, d, hh, mm, ss).toLocaleTimeString();
  }
  const parsed = new Date(rawDate);
  return isNaN(parsed.getTime()) ? new Date().toLocaleTimeString() : parsed.toLocaleTimeString();
};

  // --- 1. CONTINUOUS FAST POLL BACKUP ENGINE (EVERY 1.5 Seconds) ---
  useEffect(() => {
    const fetchLatestSecurityEvents = async () => {
      try {
        const [empRes, eventsRes, activitiesRes, isolationRes] = await Promise.all([
          fetch('http://localhost:8080/api/employees').catch(() => null),
          fetch('http://localhost:8080/api/security-events').catch(() => null),
          fetch('http://localhost:8080/api/activities').catch(() => null),
          fetch('http://localhost:8080/api/isolation/actions').catch(() => null)
        ]);

        let backendEmps = [];
        if (empRes && empRes.ok) {
          backendEmps = await empRes.json();
        }

        let eventsData = [];
        if (eventsRes && eventsRes.ok) {
          eventsData = await eventsRes.json();
        }

        let activitiesData = [];
        if (activitiesRes && activitiesRes.ok) {
          activitiesData = await activitiesRes.json();
        }

        let isolationActionsData = [];
        if (isolationRes && isolationRes.ok) {
          isolationActionsData = await isolationRes.json();
        }

        // Merge live backend isolation actions into isolatedSessions state
        if (Array.isArray(isolationActionsData) && isolationActionsData.length > 0) {
          setIsolatedSessions((prev) => {
            const map = new Map(prev.map((s) => [s.sessionId, s]));
            isolationActionsData.forEach((act) => {
              const sId = act.sessionId || `SESS-${act.employee?.id || 'EMP1024'}-LIVE`;
              const existing = map.get(sId);
              map.set(sId, {
                sessionId: sId,
                employeeId: act.employee?.id || 'EMP1024',
                employeeName: act.employee?.name || (act.employee?.id === 'EMP1024' ? 'John Doe (Synthetic)' : 'Bank Employee'),
                riskScore: act.riskScore != null ? act.riskScore : (existing?.riskScore || 96.5),
                reason: act.reason || existing?.reason || 'Zero-Trust Policy Anomaly Containment',
                isolatedAt: act.createdAt ? formatTimestamp(act.createdAt) : (existing?.isolatedAt || 'Just Now'),
                status: act.actionType || existing?.status || 'ISOLATED'
              });
            });
            return Array.from(map.values());
          });
        }

        // Count real backend access activities per employee
        const realActivityCounts = {};
        if (Array.isArray(activitiesData)) {
          activitiesData.forEach((act) => {
            const empId = act.employee?.id || act.employeeId || 'EMP1024';
            realActivityCounts[empId] = (realActivityCounts[empId] || 0) + 1;
          });
        }

        const formatted = (Array.isArray(eventsData) ? eventsData : []).map((ev, index) => {
          const rScore = parseRiskScoreFromDesc(ev.description, ev.severity);
          return {
            id: ev.id || `polled-${index}`,
            timestamp: formatTimestamp(ev.createdAt),
            employeeId: ev.employee?.id || 'EMP1024',
            event: `${ev.eventType}: ${ev.description || 'Access Request'}`,
            severity: ev.severity || (rScore > 90 ? 'CRITICAL' : rScore > 75 ? 'HIGH' : 'MEDIUM'),
            riskScore: rScore
          };
        });

        // Update Live Threat Feed Ticker
        if (formatted.length > 0) {
          setThreatEvents((prev) => {
            const mergedMap = new Map();
            formatted.forEach((item) => {
              const key = item.id ? String(item.id) : `${item.employeeId}-${item.timestamp}-${item.event}`;
              if (!mergedMap.has(key)) mergedMap.set(key, item);
            });
            prev.forEach((item) => {
              const key = item.id ? String(item.id) : `${item.employeeId}-${item.timestamp}-${item.event}`;
              const fingerprint = `${item.employeeId}-${item.timestamp}-${item.event}`;
              const exists = Array.from(mergedMap.values()).some(
                (existing) => `${existing.employeeId}-${existing.timestamp}-${existing.event}` === fingerprint
              );
              if (!exists && !mergedMap.has(key)) mergedMap.set(key, item);
            });
            return Array.from(mergedMap.values()).slice(0, 40);
          });
        }

        const latestPerEmp = {};
        formatted.forEach((ev) => {
          latestPerEmp[ev.employeeId] = ev;
        });

        // SINGLE ATOMIC STATE UPDATE FOR ALL EMPLOYEES
        setEmployees((prev) => {
          const existingMap = new Map(prev.map((e) => [e.id, e]));

          let mergedList = Array.isArray(backendEmps) && backendEmps.length > 0
            ? backendEmps.map((bEmp) => {
                const existing = existingMap.get(bEmp.id);
                if (existing) {
                  return {
                    ...existing,
                    name: bEmp.name || existing.name,
                    role: bEmp.role?.name || bEmp.roleName || existing.role,
                    department: bEmp.department || existing.department,
                    status: bEmp.status || existing.status
                  };
                }
                return {
                  id: bEmp.id,
                  name: bEmp.name,
                  role: bEmp.role?.name || 'Customer Service Representative',
                  department: bEmp.department || 'Retail Banking',
                  riskScore: 0.0,
                  status: bEmp.status || 'NORMAL',
                  currentThreat: 'NONE',
                  sessionId: `SESS-${bEmp.id}-LIVE`,
                  device: `BANK-PC-${bEmp.id}`,
                  location: 'Chennai Office',
                  expectedBehavior: {
                    workingHours: '09:00 - 18:00 IST',
                    device: `BANK-PC-${bEmp.id}`,
                    location: 'Chennai Office',
                    avgDailyAccesses: 25,
                    typicalResources: '/api/v1/customer/profile, /api/v1/transactions/search'
                  },
                  currentBehavior: {
                    loginTime: '10:00 AM (Normal)',
                    device: `BANK-PC-${bEmp.id} (Known)`,
                    location: 'Chennai Office (Normal)',
                    accessesCount: (realActivityCounts[bEmp.id] || 0) + 5,
                    resourceAccessed: '/api/v1/customer/profile'
                  }
                };
              })
            : prev;

          // Overlay live risk score and security event telemetry & ensure full digital twin properties
          return mergedList.map((emp) => {
            const latestEv = latestPerEmp[emp.id];
            const baseExpected = emp.expectedBehavior || {
              workingHours: '09:00 - 18:00 IST',
              device: emp.device || `BANK-PC-${emp.id}`,
              location: emp.location || 'Chennai Office',
              avgDailyAccesses: 25,
              typicalResources: '/api/v1/customer/profile, /api/v1/transactions/search'
            };

            // Dynamic accessesCount computed from real backend activities performed
            const dynamicAccesses = (realActivityCounts[emp.id] || 0) + 5;

            const baseCurrent = emp.currentBehavior || {
              loginTime: '10:00 AM (Normal)',
              device: `${emp.device || 'BANK-PC-' + emp.id} (Known)`,
              location: `${emp.location || 'Chennai Office'} (Normal)`,
              accessesCount: dynamicAccesses,
              resourceAccessed: '/api/v1/customer/profile'
            };

            if (latestEv) {
              const isRestoredEv = (latestEv.event || '').includes('RESTORE') || (latestEv.event || '').includes('RESOLVED');
              const latestRiskScore = isRestoredEv ? 0.0 : latestEv.riskScore;
              const newStatus = isRestoredEv ? 'NORMAL' : latestRiskScore >= 95.0 ? 'ISOLATED' : latestRiskScore >= 80.0 ? 'RESTRICTED' : latestRiskScore >= 60.0 ? 'MONITOR' : 'NORMAL';
              const newThreat = isRestoredEv ? 'NONE' : (latestEv.event || '').includes('RBAC') || (latestEv.event || '').includes('VIOLATION')
                ? 'ROLE_VIOLATION'
                : (latestEv.event || '').includes('DECOY')
                ? 'DECOY_EXFILTRATION'
                : latestRiskScore > 75
                ? 'UNUSUALLY_HIGH_ACCESS'
                : emp.currentThreat || 'NONE';

              return {
                ...emp,
                riskScore: latestRiskScore,
                status: newStatus,
                currentThreat: newThreat,
                device: emp.device || `BANK-PC-${emp.id}`,
                location: emp.location || 'Chennai Office',
                expectedBehavior: baseExpected,
                currentBehavior: {
                  ...baseCurrent,
                  resourceAccessed: latestEv.event,
                  accessesCount: dynamicAccesses
                }
              };
            }

            return {
              ...emp,
              riskScore: emp.riskScore != null ? emp.riskScore : 0.0,
              status: emp.status || 'NORMAL',
              currentThreat: emp.currentThreat || 'NONE',
              device: emp.device || `BANK-PC-${emp.id}`,
              location: emp.location || 'Chennai Office',
              expectedBehavior: baseExpected,
              currentBehavior: {
                ...baseCurrent,
                accessesCount: dynamicAccesses
              }
            };
          });
        });

        // Re-populate isolated sessions on page refresh/poll if any critical events exist
        formatted.filter((ev) => ev.riskScore >= 95.0 || ev.event.includes('ISOLATED')).forEach((criticalEv) => {
          setIsolatedSessions((prev) => {
            const existing = prev.find((s) => s.employeeId === criticalEv.employeeId || s.sessionId.includes(criticalEv.employeeId));
            if (existing) {
              return prev;
            }
            return [
              {
                sessionId: `SESS-${criticalEv.employeeId}-ISOLATED`,
                employeeId: criticalEv.employeeId,
                employeeName: criticalEv.employeeId === 'EMP1024' ? 'John Doe (Synthetic)' : criticalEv.employeeId,
                riskScore: criticalEv.riskScore,
                reason: `Automated Isolation: Risk Score ${criticalEv.riskScore}% crossed threshold. Event: ${criticalEv.event}`,
                isolatedAt: criticalEv.timestamp,
                status: 'ISOLATED'
              },
              ...prev
            ];
          });
        });
      } catch (err) {
        console.warn('Security events polling warning:', err.message);
      }
    };

    fetchLatestSecurityEvents();
    const interval = setInterval(fetchLatestSecurityEvents, 1500);

    return () => clearInterval(interval);
  }, []);

  // --- 2. REAL-TIME WEBSOCKET LISTENER ---
  useEffect(() => {
    let socket;
    let reconnectTimer;

    const connectWebSocket = () => {
      try {
        socket = new WebSocket('ws://localhost:8080/ws-direct');
        wsRef.current = socket;

        socket.onopen = () => {
          console.log('🟢 Security Dashboard Connected to Real-Time WebSocket (/ws-direct)');
          setWsConnected(true);
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('⚡ SOC Real-Time Security Event Received:', data);

            if (data.type === 'SECURITY_EVENT') {
              handleIncomingSecurityEvent(data);
            }
          } catch (err) {
            console.warn('Error parsing WS message:', err);
          }
        };

        socket.onclose = () => {
          setWsConnected(false);
          reconnectTimer = setTimeout(connectWebSocket, 3000);
        };

        socket.onerror = (err) => {
          console.warn('WebSocket connection error:', err);
          socket.close();
        };
      } catch (err) {
        setWsConnected(false);
        reconnectTimer = setTimeout(connectWebSocket, 3000);
      }
    };

    connectWebSocket();

    return () => {
      if (socket) socket.close();
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  }, []);

  // --- 3. HANDLE INCOMING REAL-TIME SECURITY EVENT & RE-CALCULATE REACT STATE ---
  const handleIncomingSecurityEvent = (data) => {
    const { employeeId, sessionId, eventType, riskScore, severity, status, resource, timestamp } = data;
    const wsTimestamp = timestamp || new Date().toLocaleTimeString();
    const newId = `ws-${Date.now()}-${Math.random()}`;

    // A. Update Live Threat Feed
    setThreatEvents((prev) => [
      {
        id: newId,
        timestamp: wsTimestamp,
        employeeId: employeeId || 'EMP1024',
        event: `${eventType}: ${resource || 'Access Request'}`,
        severity: severity || (riskScore > 90 ? 'CRITICAL' : riskScore > 70 ? 'HIGH' : 'MEDIUM'),
        riskScore: riskScore
      },
      ...prev.filter((ev) => ev.id !== newId)
    ].slice(0, 40));

    // B. Recalculate Employee Risk Leaderboard & Digital Twin Baseline
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === employeeId || (employeeId === 'EMP1024' && emp.id === 'EMP1024')) {
          const newStatus = status === 'ISOLATED' ? 'ISOLATED' : riskScore >= 80 ? 'RESTRICTED' : riskScore >= 60 ? 'MONITOR' : 'NORMAL';
          const newThreat = eventType.includes('RBAC') || eventType.includes('VIOLATION') ? 'ROLE_VIOLATION' : eventType.includes('DECOY') ? 'DECOY_EXFILTRATION' : riskScore > 75 ? 'UNUSUALLY_HIGH_ACCESS' : emp.currentThreat;

          return {
            ...emp,
            riskScore: riskScore,
            status: newStatus,
            currentThreat: newThreat,
            currentBehavior: {
              ...emp.currentBehavior,
              resourceAccessed: resource || emp.currentBehavior.resourceAccessed,
              accessesCount: emp.currentBehavior.accessesCount != null ? emp.currentBehavior.accessesCount : 5
            }
          };
        }
        return emp;
      })
    );

    // C. Recalculate Dashboard KPI Summary Cards
    setStats((prev) => {
      let isCritical = riskScore > 90;
      let isSuspicious = riskScore > 60;
      let isIsolated = status === 'ISOLATED';

      return {
        ...prev,
        suspiciousSessions: isSuspicious ? prev.suspiciousSessions + 1 : prev.suspiciousSessions,
        criticalThreats: isCritical ? prev.criticalThreats + 1 : prev.criticalThreats,
        isolatedSessions: isIsolated ? prev.isolatedSessions + 1 : prev.isolatedSessions
      };
    });

    // D. If session is isolated, update Isolated Sessions Manager panel
    if (status === 'ISOLATED' || riskScore >= 95.0) {
      setIsolatedSessions((prev) => [
        {
          sessionId: sessionId || `SESS-${employeeId}-ISOLATED`,
          employeeId: employeeId,
          employeeName: employeeId === 'EMP1024' ? 'John Doe (Synthetic)' : employeeId,
          riskScore: riskScore,
          reason: `Automated Isolation: Risk Score ${riskScore}% crossed threshold. Resource: ${resource}`,
          isolatedAt: wsTimestamp,
          status: 'ISOLATED'
        },
        ...prev.filter((s) => s.sessionId !== sessionId && s.employeeId !== employeeId)
      ]);

      setAuditLogs((prev) => [
        {
          id: Date.now(),
          timestamp: wsTimestamp,
          actor: 'SYSTEM_POLICY_ENGINE',
          action: 'AUTOMATED_SESSION_ISOLATION',
          target: `Session ${sessionId || employeeId}`,
          details: `Quarantined automatically. Risk Score ${riskScore}% > 95% threshold.`
        },
        ...prev
      ]);
    }
  };


  // SOC Administrator Actions
  const handleRestoreSession = async (sessionId, employeeId) => {
    const empId = employeeId || (sessionId && sessionId.includes('1024') ? 'EMP1024' : 'EMP1024');
    try {
      await Promise.all([
        fetch(`http://localhost:8080/api/isolation/restore?sessionId=${sessionId}&actorId=SOC_ANALYST`, { method: 'POST' }),
        fetch(`http://localhost:8080/api/isolation/restore?sessionId=SESS-1024-ALPHA&actorId=SOC_ANALYST`, { method: 'POST' }),
        fetch(`http://localhost:8080/api/isolation/restore?sessionId=${empId}&actorId=SOC_ANALYST`, { method: 'POST' })
      ]);
    } catch (e) {
      console.warn('Failed to restore session via API:', e);
    }

    setIsolatedSessions((prev) =>
      prev.map((s) => {
        if (s.employeeId === empId || s.sessionId === sessionId || (sessionId && sessionId.includes(s.employeeId))) {
          return { ...s, status: 'RESTORED' };
        }
        return s;
      })
    );

    setEmployees((prev) =>
      prev.map((e) => {
        if (e.id === empId || e.sessionId === sessionId || (sessionId && sessionId.includes(e.id))) {
          return {
            ...e,
            status: 'NORMAL',
            riskScore: 0.0,
            currentThreat: 'NONE'
          };
        }
        return e;
      })
    );

    // Clear critical events from threatEvents feed
    setThreatEvents((prev) =>
      prev.map((ev) => {
        if (ev.employeeId === empId || ev.employeeId === 'EMP1024') {
          return { ...ev, riskScore: 0.0, severity: 'LOW', event: 'RESTORE_SESSION: Session Restored by SOC Analyst' };
        }
        return ev;
      })
    );

    setAuditLogs((prev) => [
      {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        actor: 'SOC Analyst',
        action: 'RESTORE_SESSION',
        target: `Employee ${empId} (${sessionId})`,
        details: 'Session restored to ACTIVE after SOC analyst security review.'
      },
      ...prev
    ]);
  };

  const handleRequireMFA = async (sessionId, employeeId) => {
    const empId = employeeId || 'EMP1024';
    try {
      await fetch(`http://localhost:8080/api/isolation/require-mfa?sessionId=${sessionId}&actorId=SOC_ANALYST`, { method: 'POST' });
    } catch (e) {
      console.warn('Failed to require MFA via API:', e);
    }
    setIsolatedSessions((prev) => prev.map((s) => (s.sessionId === sessionId || s.employeeId === empId) ? { ...s, status: 'STEP_UP_MFA' } : s));
    setAuditLogs((prev) => [{ id: Date.now(), timestamp: new Date().toLocaleTimeString(), actor: 'SOC Analyst', action: 'REQUIRE_MFA', target: `Employee ${empId}`, details: 'Enforced mandatory step-up re-authentication' }, ...prev]);
  };

  const handleExtendIsolation = (sessionId) => {
    setAuditLogs((prev) => [{ id: Date.now(), timestamp: new Date().toLocaleTimeString(), actor: 'SOC Analyst', action: 'EXTEND_ISOLATION', target: `Session ${sessionId}`, details: 'Isolation extended for deep forensic audit' }, ...prev]);
  };

  const handleDisableAccount = async (sessionId, employeeId) => {
    const empId = employeeId || 'EMP1024';
    try {
      await fetch(`http://localhost:8080/api/isolation/disable-account?employeeId=${empId}&actorId=SOC_ANALYST`, { method: 'POST' });
    } catch (e) {
      console.warn('Failed to disable account via API:', e);
    }
    setIsolatedSessions((prev) => prev.map((s) => (s.sessionId === sessionId || s.employeeId === empId) ? { ...s, status: 'ACCOUNT_DISABLED' } : s));
    setEmployees((prev) => prev.map((e) => (e.id === empId || e.sessionId === sessionId) ? { ...e, status: 'SUSPENDED', riskScore: 100.0 } : e));
    setAuditLogs((prev) => [{ id: Date.now(), timestamp: new Date().toLocaleTimeString(), actor: 'SOC Analyst', action: 'DISABLE_ACCOUNT', target: `Employee ${empId}`, details: 'Account permanently suspended due to malicious threat' }, ...prev]);
  };


  // Synthetic Attack Trigger Simulator
  const triggerSyntheticAttackDemo = async () => {
    try {
      const payload = {
        sessionId: 'SESS-1024-ALPHA',
        employeeId: 'EMP1024',
        resourceId: '/api/v1/decoy/vip-customer-internal-001',
        actionType: 'EXPORT_PAYLOAD',
        recordsAccessed: 300,
        dataVolumeBytes: 45000000,
        isRbacViolation: true
      };

      await fetch('http://localhost:8080/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn('Attack demo trigger error:', err.message);
    }
  };

  return (
    <SOCContext.Provider value={{
      stats,
      threatEvents,
      employees,
      isolatedSessions,
      auditLogs,
      selectedEmployeeId,
      setSelectedEmployeeId,
      wsConnected,
      handleRestoreSession,
      handleRequireMFA,
      handleExtendIsolation,
      handleDisableAccount,
      triggerSyntheticAttackDemo
    }}>
      {children}
    </SOCContext.Provider>
  );
};

export const useSOC = () => useContext(SOCContext);
