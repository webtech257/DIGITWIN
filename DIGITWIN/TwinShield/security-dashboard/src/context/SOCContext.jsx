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
    totalEmployees: 1284,
    activeSessions: 943,
    suspiciousSessions: 17,
    criticalThreats: 4,
    isolatedSessions: 2
  });

  const [threatEvents, setThreatEvents] = useState([]);

  const [employees, setEmployees] = useState([
    {
      id: 'EMP1024',
      name: 'John Doe (Synthetic)',
      role: 'Customer Service Representative',
      department: 'Retail Banking',
      riskScore: 15.0,
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
        loginTime: '10:00 AM (Normal)',
        device: 'BANK-PC-1024 (Known)',
        location: 'Chennai Office (Normal)',
        accessesCount: 15,
        resourceAccessed: '/api/v1/customer/profile'
      }
    },
    {
      id: 'EMP2031',
      name: 'Sarah Jenkins (Synthetic)',
      role: 'Branch Manager',
      department: 'Branch Operations',
      riskScore: 78.4,
      status: 'MONITOR',
      currentThreat: 'PRIVILEGE_CREEP',
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
        loginTime: '09:15 AM (Normal)',
        device: 'BANK-PC-2031 (Known)',
        location: 'Chennai Office (Normal)',
        accessesCount: 45,
        resourceAccessed: '/api/v1/reports/manager-summary'
      }
    },
    {
      id: 'EMP3099',
      name: 'Alex Vance (Synthetic)',
      role: 'System Administrator',
      department: 'IT Infrastructure',
      riskScore: 22.0,
      status: 'NORMAL',
      currentThreat: 'NONE',
      sessionId: 'SESS-3099-GAMMA',
      device: 'ADMIN-PC-3099',
      location: 'Mumbai Data Center',
      expectedBehavior: {
        workingHours: '09:00 - 18:00 IST',
        device: 'ADMIN-PC-3099',
        location: 'Mumbai Data Center',
        avgDailyAccesses: 50,
        typicalResources: '/api/v1/customer/profile, /api/v1/reports/manager-summary'
      },
      currentBehavior: {
        loginTime: '09:30 AM (Normal)',
        device: 'ADMIN-PC-3099 (Known)',
        location: 'Mumbai Data Center (Normal)',
        accessesCount: 28,
        resourceAccessed: '/api/v1/reports/manager-summary'
      }
    },
    {
      id: 'EMP4088',
      name: 'Michael Chen (Synthetic)',
      role: 'Compliance Officer',
      department: 'Legal & Compliance',
      riskScore: 35.5,
      status: 'NORMAL',
      currentThreat: 'NONE',
      sessionId: 'SESS-4088-DELTA',
      device: 'COMPLIANCE-PC-4088',
      location: 'Bengaluru Office',
      expectedBehavior: {
        workingHours: '09:00 - 17:00 IST',
        device: 'COMPLIANCE-PC-4088',
        location: 'Bengaluru Office',
        avgDailyAccesses: 30,
        typicalResources: '/api/v1/customer/profile, /api/v1/reports/manager-summary'
      },
      currentBehavior: {
        loginTime: '08:45 AM (Normal)',
        device: 'COMPLIANCE-PC-4088 (Known)',
        location: 'Bengaluru Office (Normal)',
        accessesCount: 18,
        resourceAccessed: '/api/v1/customer/profile'
      }
    },
    {
      id: 'EMP5012',
      name: 'Priya Sharma (Synthetic)',
      role: 'Senior Teller',
      department: 'Treasury Operations',
      riskScore: 12.0,
      status: 'NORMAL',
      currentThreat: 'NONE',
      sessionId: 'SESS-5012-EPSILON',
      device: 'TELLER-PC-5012',
      location: 'Chennai Office',
      expectedBehavior: {
        workingHours: '08:00 - 16:00 IST',
        device: 'TELLER-PC-5012',
        location: 'Chennai Office',
        avgDailyAccesses: 20,
        typicalResources: '/api/v1/customer/profile, /api/v1/transactions/search'
      },
      currentBehavior: {
        loginTime: '08:05 AM (Normal)',
        device: 'TELLER-PC-5012 (Known)',
        location: 'Chennai Office (Normal)',
        accessesCount: 12,
        resourceAccessed: '/api/v1/transactions/search'
      }
    }
  ]);

  const [isolatedSessions, setIsolatedSessions] = useState([
    {
      sessionId: 'SESS-9942-OMEGA',
      employeeId: 'EMP8842',
      employeeName: 'David Wallace (Synthetic)',
      riskScore: 96.2,
      reason: 'Bulk Decoy Executive Vault Access & Privilege Abuse',
      isolatedAt: '08:12:10 IST',
      status: 'ISOLATED'
    },
    {
      sessionId: 'SESS-1024-ALPHA',
      employeeId: 'EMP1024',
      employeeName: 'John Doe (Synthetic)',
      riskScore: 97.6,
      reason: 'Automated Containment: Anomaly vector 97.6% crossed 95% threshold',
      isolatedAt: '23:47:00 IST',
      status: 'ISOLATED'
    }
  ]);

  const [auditLogs, setAuditLogs] = useState([
    { id: 1001, timestamp: '23:47:05', actor: 'SYSTEM (Zero-Trust Engine)', action: 'AUTOMATED_SESSION_ISOLATION', target: 'Session SESS-1024-ALPHA', details: 'Triggered by Risk Score 97.6% (>95% Critical Threshold)', hash: '0x7f8a3c9b2d1e4f5a' },
    { id: 1002, timestamp: '08:12:15', actor: 'SYSTEM (Zero-Trust Engine)', action: 'AUTOMATED_SESSION_ISOLATION', target: 'Session SESS-9942-OMEGA', details: 'Triggered by Decoy Honey Token Access', hash: '0x3e2b1c4a5f6d7e8f' },
    { id: 1003, timestamp: '08:15:22', actor: 'SOC Analyst (ID: SOC-04)', action: 'INVESTIGATION_FILE_OPENED', target: 'Incident INC-2026-001', details: 'Forensic telemetry audit initiated', hash: '0x9a8b7c6d5e4f3a2b' }
  ]);

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
        const eventsRes = await fetch('http://localhost:8080/api/security-events');
        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          if (Array.isArray(eventsData) && eventsData.length > 0) {
            const formatted = eventsData.map((ev, index) => {
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

            // Update Live Threat Feed Ticker (merge polled events with live WS events, deduplicated by fingerprint)
            setThreatEvents((prev) => {
              const mergedMap = new Map();
              // Polled events (newest first)
              formatted.forEach((item) => {
                const key = item.id ? String(item.id) : `${item.employeeId}-${item.timestamp}-${item.event}`;
                if (!mergedMap.has(key)) {
                  mergedMap.set(key, item);
                }
              });
              // Overlay live WS items from prev state if fingerprint not already present
              prev.forEach((item) => {
                const key = item.id ? String(item.id) : `${item.employeeId}-${item.timestamp}-${item.event}`;
                const fingerprint = `${item.employeeId}-${item.timestamp}-${item.event}`;
                const exists = Array.from(mergedMap.values()).some(
                  (existing) => `${existing.employeeId}-${existing.timestamp}-${existing.event}` === fingerprint
                );
                if (!exists && !mergedMap.has(key)) {
                  mergedMap.set(key, item);
                }
              });
              return Array.from(mergedMap.values()).slice(0, 40);
            });


            // Find newest event per employee (formatted is sorted newest-first)
            const latestPerEmp = {};
            formatted.forEach((ev) => {
              if (!latestPerEmp[ev.employeeId]) {
                latestPerEmp[ev.employeeId] = ev;
              }
            });

            setEmployees((prev) =>
              prev.map((emp) => {
                const latestEv = latestPerEmp[emp.id] || (emp.id === 'EMP1024' ? formatted[0] : null);
                if (latestEv) {
                  const latestRiskScore = latestEv.riskScore;
                  const newStatus = latestRiskScore >= 95.0 ? 'ISOLATED' : latestRiskScore >= 80.0 ? 'RESTRICTED' : latestRiskScore >= 60.0 ? 'MONITOR' : 'NORMAL';
                  const newThreat = latestEv.event.includes('RBAC') || latestEv.event.includes('VIOLATION')
                    ? 'ROLE_VIOLATION'
                    : latestEv.event.includes('DECOY')
                    ? 'DECOY_EXFILTRATION'
                    : latestRiskScore > 75
                    ? 'UNUSUALLY_HIGH_ACCESS'
                    : emp.currentThreat;

                  return {
                    ...emp,
                    riskScore: latestRiskScore,
                    status: newStatus,
                    currentThreat: newThreat,
                    currentBehavior: {
                      ...emp.currentBehavior,
                      resourceAccessed: latestEv.event,
                      accessesCount: emp.currentBehavior.accessesCount + 1
                    }
                  };
                }
                return emp;
              })
            );

            // Re-populate isolated sessions on page refresh/poll if any critical events exist
            formatted.filter((ev) => ev.riskScore >= 95.0 || ev.event.includes('ISOLATED')).forEach((criticalEv) => {
              setIsolatedSessions((prev) => {
                const existing = prev.find((s) => s.employeeId === criticalEv.employeeId || s.sessionId.includes(criticalEv.employeeId));
                if (existing) {
                  // Keep status if already modified by analyst (e.g. RESTORED, STEP_UP_MFA, ACCOUNT_DISABLED)
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

          }
        }
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
              accessesCount: emp.currentBehavior.accessesCount + 1
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
      await fetch(`http://localhost:8080/api/isolation/restore?sessionId=${sessionId}&actorId=SOC_ANALYST`, { method: 'POST' });
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
            riskScore: 15.0,
            currentThreat: 'NONE'
          };
        }
        return e;
      })
    );

    // Clear 100% critical events for this employee from threatEvents so polling won't re-isolate immediately
    setThreatEvents((prev) =>
      prev.map((ev) => {
        if (ev.employeeId === empId && (ev.riskScore >= 95.0 || ev.event.includes('ISOLATED') || ev.event.includes('DECOY'))) {
          return { ...ev, riskScore: 15.0, severity: 'LOW', event: ev.event.replace('DECOY_RESOURCE_ACCESS', 'RESOLVED_EVENT') };
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
