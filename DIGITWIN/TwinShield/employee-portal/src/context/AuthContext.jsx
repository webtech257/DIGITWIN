import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const DEFAULT_PERSONAS = [
  {
    id: 'EMP1024',
    name: 'John Doe',
    email: 'john.doe@twinshield-bank.internal',
    department: 'Retail Banking',
    roleId: 'ROLE_CUST_SERVICE',
    roleName: 'Customer Service Representative',
    permissions: ['customer:read', 'transaction:read'],
    avatar: '',
    normalStartHour: '09:00',
    normalEndHour: '18:00',
    phone: '+91 98765 10240',
    location: 'Chennai HQ - Window #04'
  },
  {
    id: 'EMP2031',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@twinshield-bank.internal',
    department: 'Branch Operations',
    roleId: 'ROLE_MANAGER',
    roleName: 'Branch Manager',
    permissions: ['customer:read', 'transaction:read', 'reports:read', 'vip:read'],
    avatar: '',
    normalStartHour: '08:30',
    normalEndHour: '19:00',
    phone: '+91 98765 20310',
    location: 'Chennai HQ - Executive Suite'
  },
  {
    id: 'EMP5099',
    name: 'Alex Vance',
    email: 'alex.vance@twinshield-bank.internal',
    department: 'IT Security & Admin',
    roleId: 'ROLE_ADMIN',
    roleName: 'System Administrator',
    permissions: ['customer:read', 'transaction:read', 'reports:read', 'vip:read', 'admin:manage'],
    avatar: '',
    normalStartHour: '09:00',
    normalEndHour: '18:00',
    phone: '+91 98765 50990',
    location: 'SOC Core Command Center'
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

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('twinshield_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.id) return parsed;
      } catch (e) {}
    }
    return DEFAULT_PERSONAS[0];
  });
  const [session, setSession] = useState(null);
  const [lastDeniedAction, setLastDeniedAction] = useState(null);
  const [personas, setPersonas] = useState(DEFAULT_PERSONAS);

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

  // Real-time tab-to-tab sync listener
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'twinshield_customers' && e.newValue) {
        try { setCustomers(JSON.parse(e.newValue)); } catch (err) {}
      }
      if (e.key === 'twinshield_transactions' && e.newValue) {
        try { setTransactions(JSON.parse(e.newValue)); } catch (err) {}
      }
      if (e.key === 'twinshield_user' && e.newValue) {
        try { setCurrentUser(JSON.parse(e.newValue)); } catch (err) {}
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
                permissions: roleId === 'ROLE_ADMIN' ? ['customer:read', 'transaction:read', 'reports:read', 'vip:read', 'admin:manage'] : roleId === 'ROLE_MANAGER' ? ['customer:read', 'transaction:read', 'reports:read', 'vip:read'] : ['customer:read', 'transaction:read'],
                avatar: roleId === 'ROLE_ADMIN' ? '👨‍💻' : (eName.toLowerCase().includes('sarah') || eName.toLowerCase().includes('priya') || eName.toLowerCase().includes('nishanthi') || eName.toLowerCase().includes('malavika')) ? '👩‍💼' : '👨‍💼',
                normalStartHour: '09:00',
                normalEndHour: '18:00'
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
      ipAddress: '192.168.1.104',
      locationCity: 'Chennai (HQ Branch)',
      deviceFingerprint: `DEV-FIN-${empId}-WIN11`,
      loginTime: 'Today (18:00 IST)'
    };
  };

  const initSession = (user) => {
    setSession(createDefaultSession(user));
  };

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
                ipAddress: baseSess.ipAddress || '192.168.1.104',
                locationCity: baseSess.locationCity || 'Chennai (HQ Branch)',
                deviceFingerprint: baseSess.deviceFingerprint || `DEV-FIN-${empId}-WIN11`,
                loginTime: baseSess.loginTime || 'Today (18:00 IST)'
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
  }, [currentUser, session?.sessionId]);

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
    localStorage.setItem('twinshield_user', JSON.stringify(userObj));
    initSession(userObj);
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setSession(null);
    localStorage.removeItem('twinshield_user');
  };

  const updateUserProfile = async (updatedFields) => {
    if (!currentUser) return;
    const mergedUser = { ...currentUser, ...updatedFields };
    setCurrentUser(mergedUser);
    localStorage.setItem('twinshield_user', JSON.stringify(mergedUser));

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

    const txnId = `TXN-${Math.floor(100000 + Math.random() * 899999)}`;
    const targetCust = customers.find((c) => c.id === customerId) || { name: 'Bank Customer' };

    const newTxn = {
      id: txnId,
      customerName: targetCust.name,
      customerId: customerId,
      type: 'CARD_ISSUANCE',
      amount: 0.00,
      date: `Today ${timeStr}`,
      status: 'Completed',
      channel: `EMV Debit Card (${cardType} - ${cardNum})`
    };

    setTransactions((prev) => {
      const updated = [newTxn, ...prev];
      localStorage.setItem('twinshield_transactions', JSON.stringify(updated));
      return updated;
    });
    recordActivityToBackend('/api/v1/teller/card-issuance', 'CARD_ISSUANCE', 1, false);
    return { txnId, cardNumber: cardNum };
  };

  const signOffWireTransfer = (wireId, customerId, amountNum) => {
    const txnId = `TXN-${Math.floor(100000 + Math.random() * 899999)}`;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setCustomers((prev) => {
      const updated = prev.map((c) => (c.id === customerId ? { ...c, balance: Math.max(0, c.balance - amountNum) } : c));
      localStorage.setItem('twinshield_customers', JSON.stringify(updated));
      return updated;
    });

    const targetCust = customers.find((c) => c.id === customerId) || { name: 'Corporate Account' };

    const newTxn = {
      id: txnId,
      customerName: targetCust.name,
      customerId: customerId,
      type: 'WIRE_TRANSFER_APPROVAL',
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

  const recordActivityToBackend = async (resourceId, actionType, recordsAccessed = 1, isDecoy = false) => {
    if (!currentUser) return;
    const isDenied = !hasPermission(resourceId);
    const targetSessionId = session?.sessionId || `SESS-${currentUser.id}-ALPHA`;

    try {
      const payload = {
        sessionId: targetSessionId,
        employeeId: currentUser.id,
        resourceId: resourceId,
        actionType: actionType,
        recordsAccessed: recordsAccessed,
        dataVolumeBytes: recordsAccessed * 3000,
        isRbacViolation: isDenied
      };

      await fetch('http://localhost:8080/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (isDecoy) {
        setSession((prev) => prev ? { ...prev, status: 'ISOLATED' } : { sessionId: targetSessionId, employeeId: currentUser.id, status: 'ISOLATED', employeeStatus: 'ACTIVE' });
      }
    } catch (err) {
      console.warn('Backend activity post warning:', err.message);
    }
  };

  const verifyAndCompleteMfa = async (code) => {
    const targetSessionId = session?.sessionId || `SESS-${currentUser?.id}-ALPHA`;
    try {
      const res = await fetch(`http://localhost:8080/api/isolation/restore/${targetSessionId}?notes=MFA_PASSED_BY_EMPLOYEE`, {
        method: 'POST'
      });
      if (res.ok) {
        setSession((prev) => prev ? { ...prev, status: 'ACTIVE' } : null);
        return true;
      }
    } catch (err) {
      console.warn('Restore session error:', err.message);
    }
    setSession((prev) => prev ? { ...prev, status: 'ACTIVE' } : null);
    return true;
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      session,
      personas,
      customers,
      transactions,
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
      verifyAndCompleteMfa
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
    updateUserProfile: () => {},
    hasPermission: () => false
  };
};
