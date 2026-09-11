import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, User, Search, CreditCard, Activity, LogOut, Lock, Briefcase, Server, FileText, DollarSign, MapPin, Radio } from 'lucide-react';
import { MobileGpsBeaconModal } from './MobileGpsBeaconModal';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { currentUser, logoutUser, liveGeo } = useAuth();
  const [showLocationModal, setShowLocationModal] = useState(false);

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

  navItems.push({ id: 'session', label: 'Security Health', icon: Lock });
  navItems.push({ id: 'profile', label: 'Profile', icon: User });

  const isPhotoAvatar = currentUser.avatar && (currentUser.avatar.startsWith('http') || currentUser.avatar.startsWith('data:'));

  return (
    <>
      <nav style={{
        background: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        padding: '0.75rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 4px 20px -5px rgba(0, 0, 0, 0.05)'
      }}>
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #059669, #10B981)',
            padding: '0.5rem',
            borderRadius: '10px',
            color: '#FFFFFF',
            display: 'flex',
            boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)'
          }}>
            <Shield style={{ width: '22px', height: '22px' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.3px' }}>
                TwinShield
              </span>
              <span style={{ 
                fontSize: '0.65rem', 
                background: '#ECFDF5', 
                color: '#059669', 
                padding: '2px 6px', 
                borderRadius: '4px', 
                fontWeight: 700,
                border: '1px solid #A7F3D0'
              }}>
                BANKING CORE
              </span>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block' }}>Zero-Trust Internal Workstation</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.25rem', background: '#F1F5F9', padding: '0.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
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
                  gap: '0.4rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
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

        {/* User Info Profile Badge, Working Location Pill & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          
          {/* Live Working Location Pill Button */}
          <button
            type="button"
            onClick={() => setShowLocationModal(true)}
            title="Click to view & calibrate physical working location"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.4rem 0.75rem',
              background: '#F0FDF4',
              borderRadius: '20px',
              border: '1.5px solid #86EFAC',
              boxShadow: '0 2px 6px rgba(16, 185, 129, 0.12)',
              cursor: 'pointer',
              color: '#166534',
              fontSize: '0.75rem',
              fontWeight: 700,
              transition: 'all 0.15s ease'
            }}
          >
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: '#10B981',
              boxShadow: '0 0 6px #10B981',
              display: 'inline-block'
            }} />
            <MapPin style={{ width: '13px', height: '13px', color: '#059669' }} />
            <span>
              {liveGeo?.city ? liveGeo.city.split(',')[0].split('(')[0].trim() : 'Chennai'}
              {liveGeo?.lat != null ? ` (${Number(liveGeo.lat).toFixed(2)}°, ${Number(liveGeo.lng).toFixed(2)}°)` : ''}
            </span>
          </button>

          {/* Authenticated Employee Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.4rem 0.85rem',
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '1.5px solid #059669',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)',
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
          </div>

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

      {/* Location & GPS Beacon Modal */}
      <MobileGpsBeaconModal isOpen={showLocationModal} onClose={() => setShowLocationModal(false)} />
    </>
  );
};
