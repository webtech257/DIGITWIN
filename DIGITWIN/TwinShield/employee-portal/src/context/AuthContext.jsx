import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const DEFAULT_PERSONAS = [
  {
    id: 'EMP1024',
    name: 'Malavika',
    email: 'malavika@twinshield-bank.internal',
    department: 'Retail Banking',
    roleId: 'ROLE_CUST_SERVICE',
    roleName: 'Customer Service Representative',
    permissions: ['customer:read', 'transaction:read'],
    avatar: '👩‍💼',
    normalStartHour: '09:00',
    normalEndHour: '18:00',
    phone: '+91 98765 10240',
    location: 'Chennai Central HQ - Retail Desk #04'
  },
  {
    id: 'EMP2031',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@twinshield-bank.internal',
    department: 'Branch Operations',
    roleId: 'ROLE_MANAGER',
    roleName: 'Branch Manager',
    permissions: ['customer:read', 'transaction:read', 'reports:read', 'vip:read'],
    avatar: '👔',
    normalStartHour: '08:30',
    normalEndHour: '19:00',
    phone: '+91 98765 20310',
    location: 'Guindy Branch - Executive Suite'
  },
  {
    id: 'EMP5099',
    name: 'Alex Vance',
    email: 'alex.vance@twinshield-bank.internal',
    department: 'IT Security & Admin',
    roleId: 'ROLE_ADMIN',
    roleName: 'System Administrator',
    permissions: ['customer:read', 'transaction:read', 'reports:read', 'vip:read', 'admin:manage'],
    avatar: '🛡️',
    normalStartHour: '09:00',
    normalEndHour: '18:00',
    phone: '+91 98765 50990',
    location: 'Nungambakkam SOC - Security Terminal'
  }
];

export const INITIAL_CUSTOMERS = [
  {
    id: 'CUST-8012',
    name: 'Robert Chen',
    type: 'STANDARD',
    balance: 112450.00,
    status: 'Active',
    category: 'Standard Retail',
    email: 'robert.chen@email.com',
    phone: '+91 98765 43210',
    issuedCards: [
      { cardNumber: '4532 **** **** 8942', cardType: 'RuPay Platinum EMV Contactless', status: 'ACTIVE', issuedDate: '2026-08-01' }
    ]
  },
  {
    id: 'CUST-8013',
    name: 'Anita Sharma',
    type: 'STANDARD',
    balance: 445800.00,
    status: 'Active',
    category: 'Standard Retail',
    email: 'anita.sharma@email.com',
    phone: '+91 98123 76543',
    issuedCards: [
      { cardNumber: '5241 **** **** 3319', cardType: 'Visa Signature International', status: 'ACTIVE', issuedDate: '2026-07-15' }
    ]
  },
  {
    id: 'CUST-8014',
    name: 'David Miller',
    type: 'STANDARD',
    balance: 88920.00,
    status: 'Active',
    category: 'Standard Retail',
    email: 'david.m@email.com',
    phone: '+91 97654 32109',
    issuedCards: []
  },
  {
    id: 'VIP-9001',
    name: 'Victor Vance (Executive)',
    type: 'VIP_CONFIDENTIAL',
    balance: 84500000.00,
    status: 'Active',
    category: 'VIP Private Client',
    email: 'vvance@corporate-vance.com',
    phone: '+91 99999 88888',
    issuedCards: [
      { cardNumber: '4921 **** **** 0001', cardType: 'Mastercard World Elite', status: 'ACTIVE', issuedDate: '2026-06-10' }
    ]
  },
  {
    id: 'VIP-9002',
    name: 'Elena Rostova (Global VIP)',
    type: 'VIP_CONFIDENTIAL',
    balance: 142000000.00,
    status: 'Active',
    category: 'VIP Private Client',
    email: 'elena@rostova-global.org',
    phone: '+91 98888 77777',
    issuedCards: [
      { cardNumber: '4111 **** **** 9999', cardType: 'Visa Infinite Private Wealth', status: 'ACTIVE', issuedDate: '2026-05-20' }
    ]
  },
  {
    id: 'EXEC-9003',
    name: 'CEO Personal Account #9001 (Honey Resource Decoy Trap)',
    type: 'DECOY_HONEY_TRAP',
    balance: 254000000.00,
    status: 'Active',
    category: 'Executive Escrow (Honey Token)',
    email: 'ceo-secret@decoy-trap.internal',
    phone: '+91 90000 00000',
    issuedCards: []
  }
];

export const INITIAL_TRANSACTIONS = [
  { id: 'TXN-90124', customerName: 'Robert Chen', customerId: 'CUST-8012', type: 'CASH_DEPOSIT', amount: 25000.00, date: '2026-08-29 16:30', status: 'Completed', channel: 'Branch Teller Desk #04' },
  { id: 'TXN-90125', customerName: 'Anita Sharma', customerId: 'CUST-8013', type: 'CHEQUE_CLEARANCE', amount: 150000.00, date: '2026-08-29 15:45', status: 'Completed', channel: 'MICR Clearing House' },
  { id: 'TXN-90126', customerName: 'Victor Vance', customerId: 'VIP-9001', type: 'WIRE_TRANSFER', amount: 5000000.00, date: '2026-08-29 14:10', status: 'Completed', channel: 'Manager Wire Desk' }
];

// Employee designated corporate branch geolocation profiles
export const getCampusGeoForEmployee = (empId) => {
  const id = (empId || 'EMP1024').toUpperCase();
  if (id === 'EMP2031') {
    return {
      lat: 12.9815,
      lng: 80.2180,
      city: 'Guindy Operations Hub - Executive Suite',
      region: 'Tamil Nadu',
      country: 'India',
      ip: '192.168.1.145',
      isp: 'TwinShield Secure Banking Intranet',
      isRealDevice: true,
      accuracyMeters: 15,
      isPrecise: true,
      locationSource: 'DESIGNATED_CAMPUS'
    };
  }
  if (id === 'EMP5099') {
    return {
      lat: 13.0524,
      lng: 80.2508,
      city: 'Nungambakkam SOC - Security Terminal',
      region: 'Tamil Nadu',
      country: 'India',
      ip: '10.0.4.88',
      isp: 'SOC Isolated Command Network',
      isRealDevice: true,
      accuracyMeters: 10,
      isPrecise: true,
      locationSource: 'DESIGNATED_CAMPUS'
    };
  }
  return {
    lat: 13.0827,
    lng: 80.2707,
    city: 'Chennai Central HQ - Retail Desk #04',
    region: 'Tamil Nadu',
    country: 'India',
    ip: '192.168.1.104',
    isp: 'TwinShield Core Retail WAN',
    isRealDevice: true,
    accuracyMeters: 12,
    isPrecise: true,
    locationSource: 'DESIGNATED_CAMPUS'
  };
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    let savedUser = sessionStorage.getItem('twinshield_user');
    if (!savedUser) {
      // Migrate legacy localStorage if present
      savedUser = localStorage.getItem('twinshield_user');
      if (savedUser) {
        sessionStorage.setItem('twinshield_user', savedUser);
        try { localStorage.removeItem('twinshield_user'); } catch (e) {}
      }
    }
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.id) return parsed;
      } catch (e) {}
    }
    return null; // Require explicit login; do not set Malavika online by default
  });
  const [session, setSession] = useState(() => {
    const savedUser = sessionStorage.getItem('twinshield_user') || localStorage.getItem('twinshield_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.id) {
          return {
            sessionId: `SESS-${parsed.id}-ALPHA`,
            employeeId: parsed.id,
            status: 'ACTIVE',
            employeeStatus: 'ACTIVE',
            riskScore: 0.0,
            ipAddress: '192.168.1.104',
            locationCity: 'Chennai Central HQ',
            deviceFingerprint: 'DEV-FP-Chrome-Win64',
            loginTime: `Today (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST)`
          };
        }
      } catch (e) {}
    }
    return null;
  });
  const [lastDeniedAction, setLastDeniedAction] = useState(null);
  const [personas, setPersonas] = useState(DEFAULT_PERSONAS);
  const [sessionActionCount, setSessionActionCount] = useState(1);
  const [lastApiEndpoint, setLastApiEndpoint] = useState('/api/v1/customer/profile');

  // Real hardware device fingerprinting derived from genuine browser environment
  const getBrowserFingerprint = () => {
    try {
      const nav = typeof window !== 'undefined' ? window.navigator : null;
      const screen = typeof window !== 'undefined' ? window.screen : null;
      if (!nav) return 'DEV-FP-Chrome-Win64-8C-4a9f82';
      
      const ua = nav.userAgent || '';
      let browser = 'Chrome';
      if (ua.includes('Firefox')) browser = 'Firefox';
      else if (ua.includes('Edg')) browser = 'Edge';
      else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';

      const os = ua.includes('Win') ? 'Win64' : (ua.includes('Mac') ? 'macOS' : 'Linux');
      const cores = nav.hardwareConcurrency || 8;
      const res = screen ? `${screen.width}x${screen.height}` : '1920x1080';
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';

      let hash = 0;
      const str = `${browser}-${os}-${cores}-${res}-${tz}`;
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
      }
      const hex = Math.abs(hash).toString(16).padStart(8, '0');
      return `DEV-FP-${browser}-${os}-${cores}C-${hex}`;
    } catch (e) {
      return 'DEV-FP-Chrome-Win64-8C-4a9f82';
    }
  };

  // Immediate & persistent real employee geolocation state
  const [liveGeo, setLiveGeo] = useState(() => {
    try {
      const saved = localStorage.getItem('twinshield_live_geo');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.lat === 'number' && typeof parsed.lng === 'number' && parsed.city) {
          return parsed;
        }
      }
    } catch (e) {}

    let initialUser = DEFAULT_PERSONAS[0];
    try {
      const savedUser = sessionStorage.getItem('twinshield_user') || localStorage.getItem('twinshield_user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        if (u && u.id) initialUser = u;
      }
    } catch (e) {}

    const defaultCampus = getCampusGeoForEmployee(initialUser.id);
    try { localStorage.setItem('twinshield_live_geo', JSON.stringify(defaultCampus)); } catch (e) {}
    return defaultCampus;
  });

  // Automated network & browser location resolution with zero-fail fallback
  useEffect(() => {
    let active = true;

    const resolveLocation = async () => {
      // 1. Fetch public IP metadata if available for ISP & network verification
      try {
        const res = await fetch('https://ipwho.is/');
        if (res.ok) {
          const ipData = await res.json();
          if (ipData && ipData.success && active) {
            setLiveGeo((prev) => {
              const updated = {
                ...prev,
                ip: ipData.ip || prev.ip,
                isp: ipData.connection?.isp || prev.isp,
                region: ipData.region || prev.region,
                country: ipData.country || prev.country
              };
              try { localStorage.setItem('twinshield_live_geo', JSON.stringify(updated)); } catch (e) {}
              return updated;
            });
          }
        }
      } catch (err) {
        // Non-blocking IP metadata query
      }

      // 2. Gracefully attempt browser HTML5 Geolocation (fast, non-destructive)
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            if (!active) return;
            const lat = +(pos.coords.latitude.toFixed(6));
            const lng = +(pos.coords.longitude.toFixed(6));
            let resolvedCity = liveGeo?.city || 'Chennai Central Campus';

            try {
              const revRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
                headers: { 'Accept': 'application/json' }
              });
              if (revRes.ok) {
                const revData = await revRes.json();
                const locality = revData.address?.suburb || revData.address?.neighbourhood || revData.address?.residential || revData.address?.city_district || revData.address?.city;
                if (locality) {
                  resolvedCity = `${locality}, Chennai`;
                }
              }
            } catch (e) {}

            setLiveGeo((prev) => {
              const next = {
                ...prev,
                lat,
                lng,
                city: resolvedCity,
                accuracyMeters: Math.round(pos.coords.accuracy),
                isPrecise: true,
                locationSource: 'BROWSER_LOCATION'
              };
              try { localStorage.setItem('twinshield_live_geo', JSON.stringify(next)); } catch (e) {}
              return next;
            });
          },
          (geoErr) => {
            // Browser denied or timed out; preserve existing designated campus coordinates
            console.log('Browser GPS non-critical notice (using designated corporate campus):', geoErr.message);
          },
          { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
        );
      }
    };

    resolveLocation();

    // 3. Listen for cross-tab or mobile beacon sync events
    const handleStorage = (e) => {
      if (e.key === 'twinshield_mobile_beacon') {
        try {
          const parsed = JSON.parse(e.newValue || '{}');
          if (parsed && parsed.lat != null && parsed.lng != null) {
            setLiveGeo((prev) => {
              const next = { ...prev, ...parsed, isPrecise: true, locationSource: 'MOBILE_GPS' };
              try { localStorage.setItem('twinshield_live_geo', JSON.stringify(next)); } catch (err) {}
              return next;
            });
          }
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => { 
      active = false; 
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Update location manually (presets, GPS refresh, mobile beacon, or anomaly simulation)
  const updateLocationManually = (geoUpdate) => {
    setLiveGeo((prev) => {
      const next = {
        ...prev,
        ...geoUpdate,
        isPrecise: true,
        locationSource: geoUpdate.locationSource || 'MANUAL'
      };

      try {
        localStorage.setItem('twinshield_live_geo', JSON.stringify(next));
      } catch (e) {}

      // Immediately send heartbeat to backend to sync SOC map only if logged in
      if (currentUser?.id && session) {
        const targetSessionId = session.sessionId || `SESS-${currentUser.id}-ALPHA`;
        fetch('http://localhost:8080/api/sessions/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: targetSessionId,
            employeeId: currentUser.id,
            employeeName: currentUser.name,
            latitude: next.lat,
            longitude: next.lng,
            locationSource: next.locationSource,
            city: next.city,
            ipAddress: next.ip,
            deviceFingerprint: getBrowserFingerprint(),
            loginTime: session?.loginTime || `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST`,
            lastEndpoint: lastApiEndpoint,
            accessesCount: sessionActionCount,
            status: session?.status || 'ACTIVE',
            riskScore: session?.riskScore || 0.0
          })
        }).catch(() => {});
      }

      return next;
    });
  };

  // Persistent shared customers state across all browser tabs & sessions
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('twinshield_customers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_CUSTOMERS;
  });

  // Persistent shared transactions state across all browser tabs & sessions
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('twinshield_transactions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_TRANSACTIONS;
  });

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('twinshield_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('twinshield_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Real-time tab-to-tab sync listener for shared banking data (customers & transactions)
  // Note: twinshield_user is NOT synced here so each tab can maintain its own independent employee account
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'twinshield_customers' && e.newValue) {
        try { setCustomers(JSON.parse(e.newValue)); } catch (err) {}
      }
      if (e.key === 'twinshield_transactions' && e.newValue) {
        try { setTransactions(JSON.parse(e.newValue)); } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Dynamic poll for backend employees provisioned by SOC Admin
  useEffect(() => {
    const fetchBackendEmployees = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/employees');
        if (res.ok) {
          const empList = await res.json();
          if (Array.isArray(empList) && empList.length > 0) {
            const mapped = empList.map((e) => {
              const roleId = e.role?.id || 'ROLE_CUST_SERVICE';
              const roleName = e.role?.name || e.roleName || 'Customer Service Representative';
              const eName = e.name || 'Employee';
              return {
                id: e.id,
                name: eName,
                email: e.email || `${e.id.toLowerCase()}@twinshield-bank.internal`,
                department: e.department || 'Retail Banking',
                roleId: roleId,
                roleName: roleName,
                permissions: roleId === 'ROLE_ADMIN' ? ['customer:read', 'customer:write', 'transaction:read', 'transaction:write', 'reports:read', 'vip:read', 'admin:manage'] : roleId === 'ROLE_MANAGER' ? ['customer:read', 'transaction:read', 'reports:read', 'vip:read'] : ['customer:read', 'transaction:read'],
                avatar: roleId === 'ROLE_ADMIN' ? '🛡️' : (eName.toLowerCase().includes('sarah') || eName.toLowerCase().includes('priya') || eName.toLowerCase().includes('nishanthi') || eName.toLowerCase().includes('malavika')) ? '👩‍💼' : '👨‍💼',
                normalStartHour: '09:00',
                normalEndHour: '18:00',
                location: e.department ? `${e.department} Branch` : 'Chennai HQ'
              };
            });
            setPersonas(mapped);
          }
        }
      } catch (err) {
        console.warn('Backend employee poll warning:', err.message);
      }
    };

    fetchBackendEmployees();
    const interval = setInterval(fetchBackendEmployees, 2000);
    return () => clearInterval(interval);
  }, []);

  const createDefaultSession = (user) => {
    const empId = user && user.id ? user.id : 'EMP1024';
    return {
      sessionId: `SESS-${empId}-ALPHA`,
      employeeId: empId,
      status: 'ACTIVE',
      employeeStatus: 'ACTIVE',
      riskScore: 0.0,
      ipAddress: liveGeo.ip || '192.168.1.104',
      locationCity: liveGeo.city || 'Chennai Central HQ',
      deviceFingerprint: getBrowserFingerprint(),
      loginTime: `Today (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST)`
    };
  };

  const initSession = (user) => {
    setSession(createDefaultSession(user));
  };

  // Live session heartbeat to backend: registers real online status ONLY when user is logged in
  useEffect(() => {
    if (!currentUser || !currentUser.id || !session) return;
    const empId = currentUser.id;
    const targetSessionId = session.sessionId || `SESS-${empId}-ALPHA`;

    const sendHeartbeat = async () => {
      try {
        await fetch('http://localhost:8080/api/sessions/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: targetSessionId,
            employeeId: empId,
            employeeName: currentUser.name,
            latitude: liveGeo.lat,
            longitude: liveGeo.lng,
            locationSource: liveGeo.locationSource,
            city: liveGeo.city,
            ipAddress: liveGeo.ip,
            deviceFingerprint: getBrowserFingerprint(),
            loginTime: session?.loginTime || `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST`,
            lastEndpoint: lastApiEndpoint,
            accessesCount: sessionActionCount,
            status: session?.status || 'ACTIVE',
            riskScore: session?.riskScore || 0.0
          })
        });
      } catch (err) {}
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [currentUser, liveGeo, session?.status, session?.riskScore, session?.sessionId, lastApiEndpoint, sessionActionCount]);

  // Poll backend isolation status every 500ms and PRESERVE rich session fields
  useEffect(() => {
    if (!currentUser) return;
    const empId = currentUser.id || 'EMP1024';
    const targetSessionId = session?.sessionId || `SESS-${empId}-ALPHA`;

    const pollIsolationStatus = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/isolation/status/${targetSessionId}`);
        if (res.ok) {
          const data = await res.json();
          setSession((prev) => {
            const currentStatus = prev ? prev.status : 'ACTIVE';
            const backendStatus = data.status || 'ACTIVE';
            const currentEmpStatus = prev ? prev.employeeStatus : 'ACTIVE';
            const backendEmpStatus = data.employeeStatus || 'ACTIVE';
            const currentRiskScore = prev ? prev.riskScore : 0.0;
            const backendRiskScore = typeof data.riskScore === 'number' ? data.riskScore : 0.0;

            const baseSess = prev || createDefaultSession(currentUser);

            if (currentStatus !== backendStatus || currentEmpStatus !== backendEmpStatus || currentRiskScore !== backendRiskScore || !prev?.ipAddress) {
              return {
                ...baseSess,
                sessionId: targetSessionId,
                employeeId: empId,
                status: backendStatus,
                employeeStatus: backendEmpStatus,
                riskScore: backendRiskScore,
                ipAddress: baseSess.ipAddress || liveGeo.ip || '192.168.1.104',
                locationCity: baseSess.locationCity || liveGeo.city || 'Chennai Central HQ',
                deviceFingerprint: baseSess.deviceFingerprint || getBrowserFingerprint(),
                loginTime: baseSess.loginTime || `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST`
              };
            }
            return prev;
          });
        }
      } catch (err) {
        console.warn('Isolation poll silent notice:', err.message);
      }
    };

    pollIsolationStatus();
    const interval = setInterval(pollIsolationStatus, 500);
    return () => clearInterval(interval);
  }, [currentUser, session?.sessionId, liveGeo]);

  const loginUser = (userOrId) => {
    let userObj;
    if (typeof userOrId === 'string') {
      userObj = personas.find((p) => p.id === userOrId) || DEFAULT_PERSONAS.find((p) => p.id === userOrId) || {
        id: userOrId,
        name: `Employee ${userOrId}`,
        email: `${userOrId.toLowerCase()}@twinshield-bank.internal`,
        department: 'Retail Banking',
        roleId: 'ROLE_CUST_SERVICE',
        roleName: 'Customer Service Representative',
        permissions: ['customer:read', 'transaction:read']
      };
    } else {
      userObj = userOrId;
    }
    setCurrentUser(userObj);
    sessionStorage.setItem('twinshield_user', JSON.stringify(userObj));
    try { localStorage.removeItem('twinshield_user'); } catch (e) {}

    // Synchronize employee's designated branch location on persona switch
    const campusGeo = getCampusGeoForEmployee(userObj.id);
    updateLocationManually(campusGeo);

    initSession(userObj);
  };

  const logoutUser = () => {
    if (currentUser?.id) {
      const sId = session?.sessionId || `SESS-${currentUser.id}-ALPHA`;
      fetch(`http://localhost:8080/api/sessions/logout?employeeId=${currentUser.id}&sessionId=${sId}`, {
        method: 'POST'
      }).catch(() => {});
    }
    setCurrentUser(null);
    setSession(null);
    sessionStorage.removeItem('twinshield_user');
    try { localStorage.removeItem('twinshield_user'); } catch (e) {}
  };

  const updateUserProfile = async (updatedFields) => {
    if (!currentUser) return;
    const mergedUser = { ...currentUser, ...updatedFields };
    setCurrentUser(mergedUser);
    sessionStorage.setItem('twinshield_user', JSON.stringify(mergedUser));

    setPersonas((prev) =>
      prev.map((p) => (p.id === mergedUser.id ? { ...p, ...updatedFields } : p))
    );

    try {
      await fetch('http://localhost:8080/api/employees/create-or-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: mergedUser.id,
          name: mergedUser.name,
          email: mergedUser.email,
          department: mergedUser.department,
          roleId: mergedUser.roleId || 'ROLE_CUST_SERVICE'
        })
      });
    } catch (err) {
      console.warn('Backend profile sync warning:', err.message);
    }

    // Immediately send live heartbeat with new name to update SOC dashboard instantly
    try {
      const targetSessionId = session?.sessionId || `SESS-${mergedUser.id}-ALPHA`;
      await fetch('http://localhost:8080/api/sessions/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: targetSessionId,
          employeeId: mergedUser.id,
          employeeName: mergedUser.name,
          latitude: liveGeo.lat,
          longitude: liveGeo.lng,
          locationSource: liveGeo.locationSource,
          city: liveGeo.city,
          ipAddress: liveGeo.ip,
          deviceFingerprint: getBrowserFingerprint(),
          status: session?.status || 'ACTIVE',
          riskScore: session?.riskScore || 0.0
        })
      });
    } catch (e) {}
  };

  const deletePersona = async (empId) => {
    setPersonas((prev) => prev.filter((p) => p.id !== empId));
    try {
      await fetch(`http://localhost:8080/api/employees/${empId}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn('Backend delete persona error:', err);
    }
  };

  // --- LIVE BANKING WORK DESK ACTIONS ---
  const depositCashToCustomer = (customerId, amountNum, note) => {
    const txnId = `TXN-${Math.floor(100000 + Math.random() * 899999)}`;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setCustomers((prev) => {
      const updated = prev.map((c) => (c.id === customerId ? { ...c, balance: c.balance + amountNum } : c));
      localStorage.setItem('twinshield_customers', JSON.stringify(updated));
      return updated;
    });

    const targetCust = customers.find((c) => c.id === customerId) || { name: 'Bank Customer' };

    const newTxn = {
      id: txnId,
      customerName: targetCust.name,
      customerId: customerId,
      type: 'CASH_DEPOSIT',
      amount: amountNum,
      date: `Today ${timeStr}`,
      status: 'Completed',
      channel: `Teller Desk (${note || 'Cash Deposit'})`
    };

    setTransactions((prev) => {
      const updated = [newTxn, ...prev];
      localStorage.setItem('twinshield_transactions', JSON.stringify(updated));
      return updated;
    });
    recordActivityToBackend('/api/v1/teller/deposit', 'CASH_DEPOSIT', 1, false);
    return { txnId, newBalance: (targetCust.balance || 0) + amountNum };
  };

  const clearChequeForCustomer = (customerId, chequeNo, amountNum, drawerName) => {
    const txnId = `TXN-${Math.floor(100000 + Math.random() * 899999)}`;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setCustomers((prev) => {
      const updated = prev.map((c) => (c.id === customerId ? { ...c, balance: c.balance + amountNum } : c));
      localStorage.setItem('twinshield_customers', JSON.stringify(updated));
      return updated;
    });

    const targetCust = customers.find((c) => c.id === customerId) || { name: 'Bank Customer' };

    const newTxn = {
      id: txnId,
      customerName: targetCust.name,
      customerId: customerId,
      type: 'CHEQUE_CLEARANCE',
      amount: amountNum,
      date: `Today ${timeStr}`,
      status: 'Completed',
      channel: `MICR Clearing (Cheque #${chequeNo} from ${drawerName})`
    };

    setTransactions((prev) => {
      const updated = [newTxn, ...prev];
      localStorage.setItem('twinshield_transactions', JSON.stringify(updated));
      return updated;
    });
    recordActivityToBackend('/api/v1/teller/cheque-clearance', 'CHEQUE_CLEARANCE', 1, false);
    return { txnId, newBalance: (targetCust.balance || 0) + amountNum };
  };

  const issueDebitCardForCustomer = (customerId, cardType) => {
    const cardNum = `4532 **** **** ${Math.floor(1000 + Math.random() * 8999)}`;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const issueDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    setCustomers((prev) => {
      const updated = prev.map((c) =>
        c.id === customerId
          ? {
              ...c,
              issuedCards: [
                {
                  cardNumber: cardNum,
                  cardType: cardType,
                  status: 'ACTIVE',
                  issuedDate: `Today (${issueDate})`
                },
                ...(c.issuedCards || [])
              ]
            }
          : c
      );
      localStorage.setItem('twinshield_customers', JSON.stringify(updated));
      return updated;
    });

    recordActivityToBackend('/api/v1/customer/issue-card', 'DEBIT_CARD_ISSUANCE', 1, false);
    return { cardNum };
  };

  const signOffWireTransfer = (customerId, amountNum, wireId) => {
    const txnId = `TXN-${Math.floor(100000 + Math.random() * 899999)}`;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const targetCust = customers.find((c) => c.id === customerId) || { name: 'Corporate Client' };

    const newTxn = {
      id: txnId,
      customerName: targetCust.name,
      customerId: customerId,
      type: 'WIRE_TRANSFER',
      amount: amountNum,
      date: `Today ${timeStr}`,
      status: 'Signed Off',
      channel: `Manager Operations Desk (${wireId})`
    };

    setTransactions((prev) => {
      const updated = [newTxn, ...prev];
      localStorage.setItem('twinshield_transactions', JSON.stringify(updated));
      return updated;
    });
    recordActivityToBackend('/api/v1/manager/wire-approval', 'WIRE_SIGN_OFF', 1, false);
    return { txnId };
  };

  const hasPermission = (permission) => {
    if (!currentUser) return false;
    if (currentUser.roleId === 'ROLE_ADMIN') return true;
    return currentUser.permissions ? currentUser.permissions.includes(permission) : false;
  };

  const checkResourcePermission = (resourceId) => {
    if (!currentUser) return false;
    if (currentUser.roleId === 'ROLE_ADMIN') return true;
    const perms = currentUser.permissions || [];
    const r = (resourceId || '').toLowerCase();
    if (r.includes('decoy') || r.includes('honey')) return false;
    if (r.includes('vip')) return perms.includes('vip:read');
    if (r.includes('reports') || r.includes('manager')) return perms.includes('reports:read');
    if (r.includes('admin')) return perms.includes('admin:manage');
    if (r.includes('transaction')) return perms.includes('transaction:read');
    if (r.includes('customer') || r.includes('teller')) return perms.includes('customer:read');
    return true;
  };

  const recordActivityToBackend = async (resourceId, actionType, recordsAccessed = 1, isDecoy = false, forceViolation = false) => {
    if (!currentUser) return;
    const isDenied = forceViolation || actionType.includes('VIOLATION') || !checkResourcePermission(resourceId);
    const targetSessionId = session?.sessionId || `SESS-${currentUser.id}-ALPHA`;

    const nextCount = sessionActionCount + (recordsAccessed || 1);
    setSessionActionCount(nextCount);
    setLastApiEndpoint(resourceId);

    // Immediately dispatch heartbeat update so SOC updates instantly
    try {
      fetch('http://localhost:8080/api/sessions/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: targetSessionId,
          employeeId: currentUser.id,
          employeeName: currentUser.name,
          latitude: liveGeo.lat,
          longitude: liveGeo.lng,
          locationSource: liveGeo.locationSource,
          city: liveGeo.city,
          ipAddress: liveGeo.ip,
          deviceFingerprint: getBrowserFingerprint(),
          loginTime: session?.loginTime || `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST`,
          lastEndpoint: resourceId,
          accessesCount: nextCount,
          status: session?.status || 'ACTIVE',
          riskScore: session?.riskScore || 0.0
        })
      }).catch(() => {});
    } catch (e) {}

    try {
      const payload = {
        sessionId: targetSessionId,
        employeeId: currentUser.id,
        resourceId: resourceId,
        actionType: actionType,
        recordsAccessed: recordsAccessed,
        dataVolumeBytes: recordsAccessed * 3000,
        isRbacViolation: isDenied,
        isDecoy: isDecoy,
        ipAddress: liveGeo.ip || '192.168.1.104',
        locationCity: liveGeo.city || 'Chennai'
      };

      await fetch('http://localhost:8080/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (isDecoy) {
        setSession((prev) => prev ? { ...prev, status: 'ISOLATED', riskScore: 100.0 } : { sessionId: targetSessionId, employeeId: currentUser.id, status: 'ISOLATED', employeeStatus: 'ACTIVE', riskScore: 100.0 });
      } else {
        // Immediately fetch updated isolation and risk status from backend
        try {
          const statusRes = await fetch(`http://localhost:8080/api/isolation/status/${targetSessionId}`);
          if (statusRes.ok) {
            const data = await statusRes.json();
            setSession((prev) => ({
              ...(prev || createDefaultSession(currentUser)),
              status: data.status || 'ACTIVE',
              employeeStatus: data.employeeStatus || 'ACTIVE',
              riskScore: typeof data.riskScore === 'number' ? data.riskScore : (prev?.riskScore || 0.0)
            }));
          }
        } catch (statusErr) {}
      }
    } catch (err) {
      console.warn('Backend activity post warning:', err.message);
    }
  };

  const verifyAndCompleteMfa = async (code) => {
    const targetSessionId = session?.sessionId || `SESS-${currentUser?.id}-ALPHA`;
    try {
      const res = await fetch(`http://localhost:8080/api/isolation/restore?sessionId=${targetSessionId}&actorId=EMPLOYEE_MFA`, {
        method: 'POST'
      });
      if (res.ok) {
        setSession((prev) => prev ? { ...prev, status: 'ACTIVE', riskScore: 0.0 } : null);
        return true;
      }
    } catch (err) {
      console.warn('Restore session error:', err.message);
    }
    setSession((prev) => prev ? { ...prev, status: 'ACTIVE', riskScore: 0.0 } : null);
    return true;
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      session,
      personas,
      customers,
      transactions,
      liveGeo,
      loginUser,
      logoutUser,
      updateUserProfile,
      deletePersona,
      depositCashToCustomer,
      clearChequeForCustomer,
      issueDebitCardForCustomer,
      signOffWireTransfer,
      hasPermission,
      lastDeniedAction,
      setLastDeniedAction,
      recordActivityToBackend,
      verifyAndCompleteMfa,
      getBrowserFingerprint,
      sessionActionCount,
      lastApiEndpoint,
      updateLocationManually,
      setPreciseLocation: updateLocationManually
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context || {
    currentUser: null,
    session: null,
    personas: [],
    customers: [],
    transactions: [],
    liveGeo: null,
    updateUserProfile: () => {},
    hasPermission: () => false,
    updateLocationManually: () => {},
    setPreciseLocation: () => {}
  };
};
