import React from 'react';
import { useSOC } from '../context/SOCContext';
import { Shield, Activity, Users, Lock, AlertTriangle, Eye, Zap, Radio, FileText } from 'lucide-react';

export const SOCNavbar = ({ activeTab, setActiveTab }) => {
  const { triggerSyntheticAttackDemo } = useSOC();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'feed', label: 'Live Threat Feed', icon: Radio },
    { id: 'employee-risk', label: 'Employee Risk', icon: Users },
    { id: 'digital-twin', label: 'Digital Twin', icon: Eye },
    { id: 'prediction', label: 'Attack Prediction', icon: Zap },
    { id: 'investigation', label: 'Investigation', icon: AlertTriangle },
    { id: 'isolation', label: 'Isolation Manager', icon: Lock },
    { id: 'audit', label: 'Audit Logs', icon: FileText }
  ];

  return (
    <header style={{
      background: '#0B132B',
      borderBottom: '1px solid #1E293B',
      padding: '0.75rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, #EF4444, #991B1B)',
          padding: '0.55rem',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(239, 68, 68, 0.4)'
        }}>
          <Shield style={{ color: '#FFFFFF', width: '22px', height: '22px' }} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.5px' }}>TwinShield SOC</span>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              padding: '2px 6px',
              background: 'rgba(239, 68, 68, 0.2)',
              color: '#F87171',
              borderRadius: '4px',
              border: '1px solid rgba(239, 68, 68, 0.4)'
            }}>
              CONTROL PLANE
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: '#10B981' }}>
            <span className="pulse-led" style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
            <span>WebSocket Live Stream Active</span>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', gap: '0.35rem' }}>
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
                gap: '0.45rem',
                padding: '0.45rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#F8FAFC' : '#94A3B8',
                background: isActive ? '#1E293B' : 'transparent',
                border: isActive ? '1px solid #334155' : '1px solid transparent'
              }}
            >
              <Icon style={{ width: '15px', height: '15px', color: isActive ? '#EF4444' : '#64748B' }} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Demo Attack Trigger */}
      <button
        onClick={triggerSyntheticAttackDemo}
        style={{
          padding: '0.5rem 0.9rem',
          background: 'linear-gradient(135deg, #EF4444, #B91C1C)',
          color: '#FFFFFF',
          borderRadius: '6px',
          fontSize: '0.8rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          boxShadow: '0 0 12px rgba(239, 68, 68, 0.4)'
        }}
      >
        <Zap style={{ width: '15px', height: '15px' }} />
        Simulate Synthetic Attack
      </button>
    </header>
  );
};
