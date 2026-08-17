import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, User, Search, CreditCard, Activity, LogOut, Lock } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { currentUser, session, logoutUser } = useAuth();

  if (!currentUser) return null;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'customers', label: 'Customer Search', icon: Search },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'session', label: 'Session Health', icon: Lock }
  ];

  return (
    <nav style={{
      background: '#1E293B',
      borderBottom: '1px solid #334155',
      padding: '0.75rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setActiveTab('dashboard')}>
        <div style={{
          background: 'linear-gradient(135deg, #10B981, #059669)',
          padding: '0.5rem',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Shield style={{ color: '#ffffff', width: '22px', height: '22px' }} />
        </div>
        <div>
          <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#F8FAFC', letterSpacing: '-0.5px' }}>Apex Bank</span>
          <span style={{ fontSize: '0.75rem', color: '#10B981', marginLeft: '0.5rem', fontWeight: 600, padding: '2px 6px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '4px' }}>EMPLOYEE PORTAL</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
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
                padding: '0.5rem 0.9rem',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#10B981' : '#94A3B8',
                background: isActive ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                border: isActive ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent'
              }}
            >
              <Icon style={{ width: '16px', height: '16px' }} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* User Info & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.35rem 0.75rem',
          background: '#0F172A',
          borderRadius: '20px',
          border: '1px solid #334155'
        }}>
          <span style={{ fontSize: '1.2rem' }}>{currentUser.avatar}</span>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#F8FAFC' }}>{currentUser.name}</span>
            <span style={{ fontSize: '0.68rem', color: '#10B981', fontWeight: 500 }}>{currentUser.roleName}</span>
          </div>
        </div>

        <button
          onClick={logoutUser}
          title="Switch User / Logout"
          style={{
            padding: '0.5rem',
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#EF4444',
            borderRadius: '6px',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <LogOut style={{ width: '16px', height: '16px' }} />
        </button>
      </div>
    </nav>
  );
};
