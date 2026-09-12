import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const SOCContext = createContext(null);

const parseRiskScoreFromDesc = (desc, severity) => {
  if (!desc) return severity === 'CRITICAL' ? 95.0 : 45.0;
  if (desc.includes('RESTORE') || desc.includes('RESOLVED') || desc.includes('Restored')) return 0.0;
  const match = desc.match(/Risk\s*Score:?\s*([\d.]+)/i) || desc.match(/(\d+(?:\.\d+)?)%/);
  if (match && match[1]) {
    const val = parseFloat(match[1]);
    if (!isNaN(val) && val >= 0) return val;
  }
  return severity === 'CRITICAL' ? 95.0 : 45.0;
};

export const FALLBACK_CAMPUS_GEO = {
  lat: null,
  lng: null,
  city: 'Offline / Standby',
  ipAddress: '192.168.1.104',
  isLiveDevice: false,
  geofenceStatus: 'OFFLINE',
  isImpossibleTravel: false,
  lastUpdated: 'Not Logged In'
};

export const SOCProvider = ({ children }) => {
  const [stats, setStats] = useState({
    totalEmployees: 3,
    activeSessions: 1,
    suspiciousSessions: 0,
    criticalThreats: 0,
    isolatedSessions: 0
  });

  const [threatEvents, setThreatEvents] = useState([]);
  const [telemetryRefreshRate, setTelemetryRefreshRate] = useState(5);
  const [lastTelemetrySyncTime, setLastTelemetrySyncTime] = useState(new Date());

  const [employees, setEmployees] = useState([
    {
      id: 'EMP1024',
      name: 'Malavika',
      role: 'Customer Service Representative',
      department: 'Retail Banking',
      riskScore: 0.0,
      status: 'NORMAL',
      onlineStatus: 'OFFLINE',
      isOnline: false,
      currentThreat: 'NONE',
      sessionId: 'SESS-1024-ALPHA',
      device: 'BANK-PC-1024',
      location: 'Chennai Central HQ - Retail Desk #04',
      geo: {
        lat: 13.0827,
        lng: 80.2707,
        city: 'Chennai Central HQ - Retail Desk #04',
        ipAddress: '192.168.1.104',
        isLiveDevice: false,
        geofenceStatus: 'AUTHORIZED_PERIMETER',
        isImpossibleTravel: false,
        lastUpdated: 'Designated Campus'
      },
      expectedBehavior: {
        workingHours: '09:00 - 18:00 IST',
        device: 'BANK-PC-1024',
        location: 'Chennai Central HQ',
        avgDailyAccesses: 25,
        typicalResources: '/api/v1/customer/profile, /api/v1/transactions/search'
      },
      currentBehavior: {
        loginTime: 'Not Logged In',
        device: 'BANK-PC-1024 (Known)',
        location: 'Offline / Standby',
        accessesCount: 0,
        resourceAccessed: 'None'
      }
    },
    {
      id: 'EMP2031',
      name: 'Sarah Jenkins',
      role: 'Branch Manager',
      department: 'Branch Operations',
      riskScore: 0.0,
      status: 'NORMAL',
      onlineStatus: 'OFFLINE',
      isOnline: false,
      currentThreat: 'NONE',
      sessionId: 'SESS-2031-BETA',
      device: 'BANK-PC-2031',
      location: 'Guindy Branch - Executive Suite',
      geo: {
        lat: 12.9815,
        lng: 80.2180,
        city: 'Guindy Branch - Executive Suite',
        ipAddress: '192.168.1.145',
        isLiveDevice: false,
        geofenceStatus: 'AUTHORIZED_PERIMETER',
        isImpossibleTravel: false,
        lastUpdated: 'Designated Campus'
      },
      expectedBehavior: {
        workingHours: '08:30 - 19:00 IST',
        device: 'BANK-PC-2031',
        location: 'Guindy Operations Hub',
        avgDailyAccesses: 40,
        typicalResources: '/api/v1/customer/profile, /api/v1/reports/manager-summary'
      },
      currentBehavior: {
        loginTime: 'Not Logged In',
        device: 'BANK-PC-2031 (Known)',
        location: 'Offline / Standby',
        accessesCount: 0,
        resourceAccessed: 'None'
      }
    },
    {
      id: 'EMP5099',
      name: 'Alex Vance',
      role: 'System Administrator',
      department: 'IT Security & Admin',
      riskScore: 0.0,
      status: 'NORMAL',
      onlineStatus: 'OFFLINE',
      isOnline: false,
      currentThreat: 'NONE',
      sessionId: 'SESS-5099-GAMMA',
      device: 'ADMIN-PC-5099',
      location: 'Nungambakkam SOC - Security Terminal',
      geo: {
        lat: 13.0524,
        lng: 80.2508,
        city: 'Nungambakkam SOC - Security Terminal',
        ipAddress: '10.0.4.88',
        isLiveDevice: false,
        geofenceStatus: 'AUTHORIZED_PERIMETER',
        isImpossibleTravel: false,
        lastUpdated: 'Designated Campus'
      },
      expectedBehavior: {
        workingHours: '09:00 - 18:00 IST',
        device: 'ADMIN-PC-5099',
        location: 'Nungambakkam SOC Command',
        avgDailyAccesses: 50,
        typicalResources: '/api/v1/customer/profile, /api/v1/reports/manager-summary, /api/v1/admin/system'
      },
      currentBehavior: {
        loginTime: 'Not Logged In',
        device: 'ADMIN-PC-5099 (Known)',
        location: 'Nungambakkam SOC Command (Normal)',
        accessesCount: 0,
        resourceAccessed: 'None'
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

  // --- 1. CONTINUOUS FAST POLL ENGINE (EVERY 1.5 Seconds) ---
  useEffect(() => {
    const fetchLatestSecurityEvents = async () => {
      try {
        const [empRes, eventsRes, activitiesRes, isolationRes, activeSessionsRes] = await Promise.all([
          fetch('http://localhost:8080/api/employees').catch(() => null),
          fetch('http://localhost:8080/api/security-events').catch(() => null),
          fetch('http://localhost:8080/api/activities').catch(() => null),
          fetch('http://localhost:8080/api/isolation/actions').catch(() => null),
          fetch('http://localhost:8080/api/sessions/active').catch(() => null)
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

        let activeSessionsData = [];
        if (activeSessionsRes && activeSessionsRes.ok) {
          activeSessionsData = await activeSessionsRes.json();
        }

        const activeSessionsMap = new Map();
        if (Array.isArray(activeSessionsData)) {
          activeSessionsData.forEach((s) => {
            if (s.employeeId) {
              activeSessionsMap.set(s.employeeId.toUpperCase(), s);
            }
          });
        }

        // Merge live backend isolation actions into isolatedSessions state
        if (Array.isArray(isolationActionsData)) {
          const mapped = isolationActionsData.map((act) => {
            const sId = act.sessionId || `SESS-${act.employeeId || 'EMP1024'}-LIVE`;
            return {
              sessionId: sId,
              employeeId: act.employeeId || 'EMP1024',
              employeeName: act.employeeName || (act.employeeId === 'EMP1024' ? 'Malavika' : 'Bank Employee'),
              riskScore: act.riskScore != null ? act.riskScore : 100.0,
              reason: act.reason || 'Zero-Trust Policy Anomaly Containment',
              isolatedAt: act.isolatedAt ? formatTimestamp(act.isolatedAt) : (act.createdAt ? formatTimestamp(act.createdAt) : 'Just Now'),
              status: act.status || 'ISOLATED'
            };
          });
          setIsolatedSessions(mapped);
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
          if (!latestPerEmp[ev.employeeId]) {
            latestPerEmp[ev.employeeId] = ev;
          }
        });

        // Update Employees State with real-time coordinates, session status & digital twin baseline
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
                const defaultCampusLat = bEmp.id === 'EMP2031' ? 12.9815 : bEmp.id === 'EMP5099' ? 13.0524 : 13.0827;
                const defaultCampusLng = bEmp.id === 'EMP2031' ? 80.2180 : bEmp.id === 'EMP5099' ? 80.2508 : 80.2707;
                const defaultCampusCity = bEmp.department ? `${bEmp.department} Branch` : 'Chennai Central Campus';

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
                  location: defaultCampusCity,
                  geo: {
                    lat: defaultCampusLat,
                    lng: defaultCampusLng,
                    city: defaultCampusCity,
                    ipAddress: '192.168.1.104',
                    isLiveDevice: false,
                    geofenceStatus: 'AUTHORIZED_PERIMETER',
                    isImpossibleTravel: false,
                    lastUpdated: 'Designated Campus'
                  },
                  expectedBehavior: {
                    workingHours: '09:00 - 18:00 IST',
                    device: `BANK-PC-${bEmp.id}`,
                    location: defaultCampusCity,
                    avgDailyAccesses: 25,
                    typicalResources: '/api/v1/customer/profile, /api/v1/transactions/search'
                  },
                  currentBehavior: {
                    loginTime: 'Not Logged In',
                    device: `BANK-PC-${bEmp.id} (Known)`,
                    location: `${defaultCampusCity} (Normal)`,
                    accessesCount: (realActivityCounts[bEmp.id] || 0),
                    resourceAccessed: 'None'
                  }
                };
              })
            : prev;

          // Overlay active online sessions & real-time GPS coordinates
          return mergedList.map((emp) => {
            const activeSession = activeSessionsMap.get(emp.id.toUpperCase());
            const isOnline = Boolean(activeSession);
            const isQuarantined = emp.status === 'ISOLATED' || emp.status === 'SUSPENDED';

            const resolvedName = activeSession?.employeeName || emp.name || emp.id;

            const defaultCampusLat = emp.id === 'EMP2031' ? 12.9815 : emp.id === 'EMP5099' ? 13.0524 : 13.0827;
            const defaultCampusLng = emp.id === 'EMP2031' ? 80.2180 : emp.id === 'EMP5099' ? 80.2508 : 80.2707;
            const defaultCampusCity = emp.id === 'EMP2031' ? 'Guindy Operations Hub' : emp.id === 'EMP5099' ? 'Nungambakkam SOC' : 'Chennai Central HQ';

            const defaultCampusGeo = {
              lat: defaultCampusLat,
              lng: defaultCampusLng,
              city: isOnline ? defaultCampusCity : `${defaultCampusCity} (Standby)`,
              ipAddress: emp.id === 'EMP5099' ? '10.0.4.88' : '192.168.1.104',
              isLiveDevice: isOnline,
              geofenceStatus: isOnline ? 'AUTHORIZED_PERIMETER' : 'AUTHORIZED_PERIMETER',
              isImpossibleTravel: false,
              lastUpdated: isOnline ? 'Designated Branch Campus' : 'Designated Campus'
            };

            const trustedSources = ['BROWSER_LOCATION', 'MOBILE_GPS', 'MANUAL', 'DESIGNATED_CAMPUS', 'IP_NETWORK'];
            const hasPreciseLocation = Boolean(
              activeSession &&
              typeof activeSession.latitude === 'number' &&
              typeof activeSession.longitude === 'number' &&
              !isNaN(activeSession.latitude) &&
              !isNaN(activeSession.longitude)
            );
            const liveLatVal = hasPreciseLocation ? activeSession.latitude : defaultCampusLat;
            const liveLngVal = hasPreciseLocation ? activeSession.longitude : defaultCampusLng;
            const liveCityName = activeSession?.city || defaultCampusCity;

            // Compute impossible travel divergence from baseline campus
            const baselineLat = defaultCampusLat;
            const baselineLng = defaultCampusLng;
            const isImpossibleTravel = (Math.abs(liveLatVal - baselineLat) > 3.0 || Math.abs(liveLngVal - baselineLng) > 3.0);

            let liveGeo = defaultCampusGeo;
            let locationStr = `${defaultCampusCity} (Offline)`;
            let onlineSt = isQuarantined ? 'OFFLINE_QUARANTINED' : isOnline ? 'ONLINE_ACTIVE' : 'OFFLINE';

            if (isOnline && activeSession) {
              liveGeo = {
                lat: liveLatVal,
                lng: liveLngVal,
                baselineLat: baselineLat,
                baselineLng: baselineLng,
                city: liveCityName,
                ipAddress: activeSession.ipAddress || '192.168.1.104',
                isLiveDevice: true,
                geofenceStatus: isQuarantined ? 'QUARANTINE_LOCKED' : (isImpossibleTravel ? 'IMPOSSIBLE_TRAVEL_BREACH' : 'AUTHORIZED_PERIMETER'),
                isImpossibleTravel: isImpossibleTravel,
                lastUpdated: `Live (${activeSession.secondsAgo || 0}s ago)`
              };
              locationStr = `${liveCityName} (${Number(liveLatVal).toFixed(4)}° N, ${Number(liveLngVal).toFixed(4)}° E)`;
              if (activeSession.riskScore >= 70 && !isQuarantined) {
                onlineSt = 'ELEVATED_RISK';
              }
            }

            const latestEv = latestPerEmp[emp.id];
            const baseExpected = emp.expectedBehavior || {
              workingHours: '09:00 - 18:00 IST',
              device: emp.device || `BANK-PC-${emp.id}`,
              location: defaultCampusGeo.city,
              avgDailyAccesses: 25,
              typicalResources: '/api/v1/customer/profile, /api/v1/transactions/search'
            };

            const dynamicAccesses = activeSession?.accessesCount != null
              ? activeSession.accessesCount
              : Math.max((realActivityCounts[emp.id] || 0) + (isOnline ? 1 : 0), emp.currentBehavior?.accessesCount || 0);

            let liveResource = (activeSession && activeSession.lastEndpoint) ? activeSession.lastEndpoint : '/api/v1/customer/profile';
            if (activeSession && activeSession.lastEndpoint) {
              liveResource = activeSession.lastEndpoint;
            } else if (latestEv) {
              const match = (latestEv.event || '').match(/(\/api\/v1\/[a-zA-Z0-9_\-\/]+)/);
              if (match && match[1]) {
                liveResource = match[1];
              }
            }

            const liveLoginTime = isOnline
              ? (activeSession.loginTime ? (activeSession.loginTime.includes('IST') || activeSession.loginTime.includes('Today') ? activeSession.loginTime : formatTimestamp(activeSession.loginTime) + ' (Live Session)') : 'Today (Live Session)')
              : 'Not Logged In';

            const liveDeviceStr = isOnline
              ? `${activeSession.deviceFingerprint || 'DEV-FP-Chrome-Win64'} (Online Live Device)`
              : `BANK-PC-${emp.id} (Offline)`;

            const dynamicCurrentBehavior = {
              loginTime: liveLoginTime,
              device: liveDeviceStr,
              location: isOnline ? locationStr : `${defaultCampusGeo.city} (Offline)`,
              accessesCount: dynamicAccesses,
              resourceAccessed: liveResource
            };

            if (latestEv) {
              const isRestoredEv = (latestEv.event || '').includes('RESTORE') || (latestEv.event || '').includes('RESOLVED');
              const isDisableEv = (latestEv.event || '').includes('DISABLE') || (latestEv.event || '').includes('SUSPEND');
              const latestRiskScore = isRestoredEv ? 0.0 : isDisableEv ? 100.0 : latestEv.riskScore;
              const isEmpSuspended = emp.status === 'SUSPENDED' || (latestEv.event || '').includes('DISABLE');
              const newStatus = isEmpSuspended ? 'SUSPENDED' : isRestoredEv ? 'NORMAL' : latestRiskScore >= 95.0 ? 'ISOLATED' : latestRiskScore >= 80.0 ? 'RESTRICTED' : latestRiskScore >= 60.0 ? 'MONITOR' : (emp.status || 'NORMAL');
              const newThreat = isRestoredEv ? 'NONE' : isDisableEv ? 'ACCOUNT_PERMANENTLY_DISABLED' : (latestEv.event || '').includes('RBAC') || (latestEv.event || '').includes('VIOLATION')
                ? 'ROLE_VIOLATION'
                : (latestEv.event || '').includes('DECOY')
                ? 'DECOY_EXFILTRATION'
                : latestRiskScore > 75
                ? 'UNUSUALLY_HIGH_ACCESS'
                : emp.currentThreat || 'NONE';

              return {
                ...emp,
                name: resolvedName,
                riskScore: latestRiskScore,
                status: newStatus,
                isOnline: isOnline,
                onlineStatus: newStatus === 'ISOLATED' || newStatus === 'SUSPENDED' ? 'OFFLINE_QUARANTINED' : onlineSt,
                currentThreat: newThreat,
                device: emp.device || `BANK-PC-${emp.id}`,
                location: locationStr,
                geo: liveGeo ? {
                  ...liveGeo,
                  geofenceStatus: newStatus === 'ISOLATED' ? 'QUARANTINE_LOCKED' : liveGeo.geofenceStatus
                } : defaultCampusGeo,
                expectedBehavior: baseExpected,
                currentBehavior: dynamicCurrentBehavior
              };
            }

            return {
              ...emp,
              name: resolvedName,
              riskScore: emp.riskScore != null ? emp.riskScore : 0.0,
              status: emp.status || 'NORMAL',
              isOnline: isOnline,
              onlineStatus: onlineSt,
              currentThreat: emp.currentThreat || 'NONE',
              device: emp.device || `BANK-PC-${emp.id}`,
              location: locationStr,
              geo: liveGeo || defaultCampusGeo,
              expectedBehavior: baseExpected,
              currentBehavior: dynamicCurrentBehavior
            };
          });
        });

        // Update overall platform statistics
        setStats((prev) => ({
          ...prev,
          totalEmployees: backendEmps.length > 0 ? backendEmps.length : prev.totalEmployees,
          activeSessions: activeSessionsMap.size,
          isolatedSessions: isolationActionsData.length,
          criticalThreats: formatted.filter((ev) => ev.severity === 'CRITICAL').length
        }));

        setLastTelemetrySyncTime(new Date());

      } catch (err) {
        console.warn('Security events polling warning:', err.message);
      }
    };

    fetchLatestSecurityEvents();
    const interval = setInterval(fetchLatestSecurityEvents, 1500);

    return () => clearInterval(interval);
  }, []);

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

  const refreshLocations = () => {
    setLastTelemetrySyncTime(new Date());
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
      telemetryRefreshRate,
      setTelemetryRefreshRate,
      lastTelemetrySyncTime,
      refreshLocations,
      handleRestoreSession,
      handleRequireMFA,
      handleExtendIsolation,
      handleDisableAccount
    }}>
      {children}
    </SOCContext.Provider>
  );
};

export const useSOC = () => useContext(SOCContext);
