import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, User, Search, CreditCard, Activity, LogOut, Lock, Briefcase, Server, FileText, DollarSign, Users, ChevronDown, UserPlus, CheckCircle2 } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { currentUser, logoutUser, loginUser, personas } = useAuth();
  const [showSwitchMenu, setShowSwitchMenu] = useState(false);
  const [customEmpId, setCustomEmpId] = useState('');
  const [customEmpName, setCustomEmpName] = useState('');
  const [customEmpRole, setCustomEmpRole] = useState('ROLE_CUST_SERVICE');

  if (!currentUser) return null;

  const role = currentUser.roleId || 'ROLE_CUST_SERVICE';

  let navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity }
  ];

  if (role === 'ROLE_MANAGER') {
    navItems.push({ id: 'manager-desk', label: 'Manager Operations', icon: Briefcase });
    navItems.push({ id: 'customers', label: 'Customer Search', icon: Search });
    navItems.push({ id: 'transactions', label: 'Transactions', icon: CreditCard });
  } else if (role === 'ROLE_ADMIN') {
    navItems.push({ id: 'admin-console', label: 'Admin System Console', icon: Server });
    navItems.push({ id: 'customers', label: 'Customer Search', icon: Search });
    navItems.push({ id: 'transactions', label: 'Transactions', icon: CreditCard });
  } else if (role === 'ROLE_COMPLIANCE') {
    navItems.push({ id: 'compliance-audit', label: 'AML Audit Workbench', icon: FileText });
    navItems.push({ id: 'transactions', label: 'Transactions', icon: CreditCard });
  } else {
    navItems.push({ id: 'teller-desk', label: 'Teller Workbench', icon: DollarSign });
    navItems.push({ id: 'customers', label: 'Customer Search', icon: Search });
    navItems.push({ id: 'transactions', label: 'Transactions', icon: CreditCard });
  }

  navItems.push({ id: 'employee-admin', label: 'Employee Admin', icon: Users });
  navItems.push({ id: 'profile', label: 'My Profile', icon: User });
  navItems.push({ id: 'session', label: 'Session Health', icon: Lock });

  const isPhotoAvatar = currentUser.avatar && (currentUser.avatar.startsWith('data:image') || currentUser.avatar.startsWith('http'));

  const handleSelectPersona = (p) => {
    loginUser(p);
    setShowSwitchMenu(false);
  };

  const handleOpenCustomEmployeeId = (e) => {
    e.preventDefault();
    if (!customEmpId.trim()) return;

    const formattedId = customEmpId.trim().toUpperCase().startsWith('EMP')
      ? customEmpId.trim().toUpperCase()
      : `EMP${customEmpId.trim()}`;

    const roleNameMap = {
      ROLE_ADMIN: 'System Administrator',
      ROLE_MANAGER: 'Branch Manager',
      ROLE_COMPLIANCE: 'Compliance Auditor',
      ROLE_CUST_SERVICE: 'Customer Service Representative'
    };

    const newEmpObj = {
      id: formattedId,
      name: customEmpName.trim() || `Employee ${formattedId}`,
      email: `${formattedId.toLowerCase()}@twinshield-bank.internal`,
      department: customEmpRole === 'ROLE_ADMIN' ? 'IT Security' : customEmpRole === 'ROLE_MANAGER' ? 'Branch Management' : 'Retail Banking',
      roleId: customEmpRole,
      roleName: roleNameMap[customEmpRole] || 'Customer Service Representative',
      permissions: customEmpRole === 'ROLE_ADMIN' ? ['customer:read', 'transaction:read', 'reports:read', 'vip:read', 'admin:manage'] : customEmpRole === 'ROLE_MANAGER' ? ['customer:read', 'transaction:read', 'reports:read', 'vip:read'] : ['customer:read', 'transaction:read'],
      normalStartHour: '09:00',
      normalEndHour: '18:00'
    };

    loginUser(newEmpObj);
    setCustomEmpId('');
    setCustomEmpName('');
    setShowSwitchMenu(false);
  };

  return (
    <nav style={{
      background: 'rgba(255, 255, 255, 0.75)',
      backdropFilter: 'blur(20px) saturate(190%)',
      WebkitBackdropFilter: 'blur(20px) saturate(190%)',
      borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
      padding: '0.65rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.05)'
    }}>
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setActiveTab('dashboard')}>
        <div style={{
          background: 'linear-gradient(135deg, #10B981, #059669)',
          padding: '0.5rem',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
        }}>
          <Shield style={{ color: '#ffffff', width: '22px', height: '22px' }} />
        </div>
        <div>
          <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.5px' }}>Apex Bank</span>
          <span style={{ fontSize: '0.72rem', color: '#059669', marginLeft: '0.5rem', fontWeight: 600, padding: '2px 6px', background: '#ECFDF5', borderRadius: '4px', border: '1px solid #A7F3D0' }}>
            {role === 'ROLE_ADMIN' ? 'ADMIN CONSOLE' : role === 'ROLE_MANAGER' ? 'MANAGER DESK' : role === 'ROLE_COMPLIANCE' ? 'COMPLIANCE AUDIT' : 'TELLER PORTAL'}
          </span>
        </div>
      </div>

      {/* Dynamic Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#059669' : '#475569',
                background: isActive ? '#ECFDF5' : 'transparent',
                border: isActive ? '1px solid #A7F3D0' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon style={{ width: '16px', height: '16px' }} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* User Info & Multi-Employee Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
        
        {/* Switcher Button */}
        <div
          onClick={() => setShowSwitchMenu(!showSwitchMenu)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.4rem 0.85rem',
            background: '#FFFFFF',
            borderRadius: '20px',
            border: '1.5px solid #059669',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          {isPhotoAvatar ? (
            <img
              src={currentUser.avatar}
              alt="Avatar"
              style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ background: '#ECFDF5', padding: '4px', borderRadius: '50%', border: '1px solid #A7F3D0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User style={{ width: '14px', height: '14px', color: '#059669' }} />
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A' }}>{currentUser.name}</span>
              <code style={{ fontSize: '0.7rem', color: '#2563EB', fontWeight: 800 }}>({currentUser.id})</code>
            </div>
            <span style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 700 }}>{currentUser.roleName}</span>
          </div>
          <ChevronDown style={{ width: '15px', height: '15px', color: '#64748B', marginLeft: '0.2rem' }} />
        </div>

        {/* Dropdown Menu for Multi-Employee Session Switcher */}
        {showSwitchMenu && (
          <div style={{
            position: 'absolute',
            top: '115%',
            right: 0,
            width: '340px',
            background: '#FFFFFF',
            borderRadius: '14px',
            border: '1.5px solid #CBD5E1',
            boxShadow: '0 12px 36px rgba(15, 23, 42, 0.18)',
            padding: '1.25rem',
            zIndex: 1000
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Multi-Employee Sessions</span>
              <span style={{ color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: '10px', border: '1px solid #A7F3D0' }}>
                {personas.length} Registered
              </span>
            </div>

            {/* List of Registered Employee Personas */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto', marginBottom: '1rem', paddingRight: '4px' }}>
              {personas.map((p) => {
                const isSelected = p.id === currentUser.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectPersona(p)}
                    style={{
                      padding: '0.6rem 0.85rem',
                      borderRadius: '8px',
                      background: isSelected ? '#ECFDF5' : '#F8FAFC',
                      border: isSelected ? '1.5px solid #059669' : '1px solid #E2E8F0',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: isSelected ? '#059669' : '#0F172A' }}>
                        {p.name} <code style={{ color: '#2563EB', fontSize: '0.75rem' }}>({p.id})</code>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{p.roleName}</div>
                    </div>
                    {isSelected && <CheckCircle2 style={{ width: '16px', height: '16px', color: '#059669' }} />}
                  </div>
                );
              })}
            </div>

            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '0.85rem', marginTop: '0.5rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <UserPlus style={{ width: '14px', height: '14px', color: '#2563EB' }} /> Open Any Custom Employee ID Session:
              </div>

              <form onSubmit={handleOpenCustomEmployeeId} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Enter Employee ID (e.g. EMP8842, EMP9012)..."
                  value={customEmpId}
                  onChange={(e) => setCustomEmpId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.8rem',
                    outline: 'none'
                  }}
                />
                <input
                  type="text"
                  placeholder="Employee Full Name (Optional)..."
                  value={customEmpName}
                  onChange={(e) => setCustomEmpName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.8rem',
                    outline: 'none'
                  }}
                />
                <select
                  value={customEmpRole}
                  onChange={(e) => setCustomEmpRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.45rem 0.65rem',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.78rem'
                  }}
                >
                  <option value="ROLE_CUST_SERVICE">Customer Service Rep (Teller)</option>
                  <option value="ROLE_MANAGER">Branch Manager</option>
                  <option value="ROLE_ADMIN">System Administrator</option>
                  <option value="ROLE_COMPLIANCE">AML Compliance Auditor</option>
                </select>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    background: '#2563EB',
                    color: '#FFFFFF',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    border: 'none',
                    cursor: 'pointer',
                    marginTop: '0.25rem'
                  }}
                >
                  Open & Switch To Session
                </button>
              </form>
            </div>

          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={logoutUser}
          title="Sign Out"
          style={{
            padding: '0.5rem',
            background: '#FEF2F2',
            color: '#DC2626',
            borderRadius: '6px',
            border: '1px solid #FCA5A5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <LogOut style={{ width: '16px', height: '16px' }} />
        </button>

      </div>
    </nav>
  );
};
