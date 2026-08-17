import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Synthetic Employee Personas for Testing
export const SYNTHETIC_PERSONAS = [
  {
    id: 'EMP1024',
    name: 'John Doe (Synthetic)',
    email: 'john.doe@twinshield-bank.internal',
    department: 'Retail Banking',
    roleId: 'ROLE_CUST_SERVICE',
    roleName: 'Customer Service Representative',
    permissions: ['customer:read', 'transaction:read'],
    avatar: '👨‍💼',
    normalStartHour: '09:00',
    normalEndHour: '18:00'
  },
  {
    id: 'EMP2031',
    name: 'Sarah Jenkins (Synthetic)',
    email: 'sarah.jenkins@twinshield-bank.internal',
    department: 'Branch Operations',
    roleId: 'ROLE_MANAGER',
    roleName: 'Branch Manager',
    permissions: ['customer:read', 'transaction:read', 'reports:read', 'vip:read'],
    avatar: '👩‍💼',
    normalStartHour: '08:30',
    normalEndHour: '19:00'
  },
  {
    id: 'EMP3099',
    name: 'Alex Vance (Synthetic)',
    email: 'alex.vance@twinshield-bank.internal',
    department: 'IT Administration',
    roleId: 'ROLE_ADMIN',
    roleName: 'System Administrator',
    permissions: ['customer:read', 'transaction:read', 'reports:read', 'vip:read', 'admin:manage'],
    avatar: '👨‍💻',
    normalStartHour: '09:00',
    normalEndHour: '18:00'
  }
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [session, setSession] = useState(null);
  const [lastDeniedAction, setLastDeniedAction] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('twinshield_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
        initSession(parsed);
      } catch (e) {
        localStorage.removeItem('twinshield_user');
      }
    }
  }, []);

  const initSession = async (user) => {
    const targetSessionId = `SESS-${user.id}-ALPHA`;
    let initialStatus = 'ACTIVE';
    let initialEmpStatus = 'ACTIVE';

    try {
      const res = await fetch(`http://localhost:8080/api/isolation/status/${targetSessionId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.status) initialStatus = data.status;
        if (data.employeeStatus) initialEmpStatus = data.employeeStatus;
      }
    } catch (err) {
      console.warn('Backend status check warning:', err.message);
    }

    const sessionObj = {
      sessionId: targetSessionId,
      employeeId: user.id,
      ipAddress: '192.168.1.45',
      locationCity: 'Chennai',
      deviceFingerprint: `BANK-PC-${user.id}`,
      loginTime: new Date().toLocaleTimeString(),
      status: initialStatus,
      employeeStatus: initialEmpStatus
    };
    setSession(sessionObj);
  };

  const loginUser = async (employeeId) => {
    const persona = SYNTHETIC_PERSONAS.find((p) => p.id === employeeId) || SYNTHETIC_PERSONAS[0];
    setCurrentUser(persona);
    localStorage.setItem('twinshield_user', JSON.stringify(persona));
    await initSession(persona);
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setSession(null);
    localStorage.removeItem('twinshield_user');
  };


  const hasPermission = (permission) => {
    if (!currentUser) return false;
    return currentUser.permissions.includes(permission);
  };

  // Real-time backend session status sync engine (every 1 second)
  useEffect(() => {
    if (!session || !session.sessionId) return;

    const checkSessionStatus = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/isolation/status/${session.sessionId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status && data.status !== session.status) {
            console.log(`⚡ Session status updated from backend: ${session.status} -> ${data.status}`);
            setSession((prev) => (prev ? { ...prev, status: data.status, employeeStatus: data.employeeStatus } : prev));
          }
        }
      } catch (err) {
        console.warn('Session status poll warning:', err.message);
      }
    };

    checkSessionStatus();
    const interval = setInterval(checkSessionStatus, 1000);
    return () => clearInterval(interval);
  }, [session?.sessionId, session?.status]);

  const verifyAndCompleteMfa = async (passcode) => {
    if (!session) return;
    try {
      await fetch(`http://localhost:8080/api/isolation/restore?sessionId=${session.sessionId}&actorId=MFA_USER_VERIFIED`, {
        method: 'POST'
      });
      setSession((prev) => (prev ? { ...prev, status: 'ACTIVE' } : prev));
    } catch (e) {
      console.warn('MFA restore error:', e);
    }
  };

  // Record activity or policy violation event to Spring Boot backend
  const recordActivityToBackend = async (resourceId, actionType, recordsAccessed = 1, isDenied = false) => {
    if (!session || !currentUser) return;
    try {
      const payload = {
        sessionId: session.sessionId,
        employeeId: currentUser.id,
        resourceId: resourceId,
        actionType: actionType,
        recordsAccessed: recordsAccessed,
        dataVolumeBytes: recordsAccessed * 3000,
        isRbacViolation: isDenied
      };

      console.log('Sending Activity Payload to Spring Boot:', payload);

      const res = await fetch('http://localhost:8080/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (resourceId.includes('decoy') || (isDenied && (resourceId.includes('vip') || resourceId.includes('reports')))) {
        setSession((prev) => (prev ? { ...prev, status: 'ISOLATED' } : prev));
      }
    } catch (err) {
      console.warn('Backend activity post warning:', err.message);
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      session,
      loginUser,
      logoutUser,
      hasPermission,
      lastDeniedAction,
      setLastDeniedAction,
      recordActivityToBackend,
      verifyAndCompleteMfa
    }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
