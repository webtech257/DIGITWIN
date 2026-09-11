import React from 'react';
import { useSOC } from '../context/SOCContext';
import { Shield, Activity, Radio, Users, Eye, Zap, AlertTriangle, Lock, FileText, CheckCircle2, UserCog, Globe } from 'lucide-react';

export const SOCNavbar = ({ activeTab, setActiveTab }) => {
  const { stats } = useSOC();

  const modules = [
    {
      category: 'MONITORING',
      items: [
        { id: 'overview', label: 'Global Overview', icon: Globe },
        { id: 'feed', label: 'Live Threat Feed', icon: Radio },
        { id: 'employee-risk', label: 'Employee Risk', icon: Users }
      ]
    },
    {
      category: 'IDENTITY & TWIN',
      items: [
        { id: 'employee-mgmt', label: 'Employee Admin', icon: UserCog },
        { id: 'digital-twin', label: 'Digital Twin', icon: Eye },
        { id: 'prediction', label: 'Attack Prediction', icon: Zap }
      ]
    },
    {
      category: 'RESPONSE & AUDIT',
      items: [
        { id: 'investigation', label: 'Investigation', icon: AlertTriangle },
        { id: 'isolation', label: 'Isolation', icon: Lock },
        { id: 'audit', label: 'Audit Logs', icon: FileText }
      ]
    }
  ];

  return (
    <header style={{
      background: 'rgba(255, 255, 255, 0.65)',
      backdropFilter: 'blur(20px) saturate(190%)',
      WebkitBackdropFilter: 'blur(20px) saturate(190%)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.8)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.05)'
    }}>
      {/* Top Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.65rem 1.5rem',
        borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
        background: 'transparent'
      }}>
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #DC2626, #991B1B)',
            padding: '0.5rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)'
          }}>
            <Shield style={{ color: '#FFFFFF', width: '20px', height: '20px' }} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>TwinShield SOC</span>
              <span style={{
                fontSize: '0.62rem',
                fontWeight: 700,
                padding: '2px 6px',
                background: '#FEF2F2',
                color: '#DC2626',
                borderRadius: '4px',
                border: '1px solid #FCA5A5',
                letterSpacing: '0.5px'
              }}>
                CONTROL PLANE
              </span>
            </div>
          </div>
        </div>

        {/* System Telemetry & Status Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.78rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#059669', background: 'rgba(236, 253, 245, 0.8)', padding: '0.35rem 0.8rem', borderRadius: '20px', border: '1px solid #A7F3D0', backdropFilter: 'blur(8px)' }}>
            <span className="pulse-led" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
            <span style={{ fontWeight: 600 }}>WebSocket Live Stream</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#2563EB', background: 'rgba(239, 246, 255, 0.8)', padding: '0.35rem 0.8rem', borderRadius: '20px', border: '1px solid #BFDBFE', backdropFilter: 'blur(8px)' }}>
            <CheckCircle2 style={{ width: '14px', height: '14px' }} />
            <span style={{ fontWeight: 600 }}>Engine Version 0.7.0</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Bar with Module Groups */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0.45rem 1.5rem',
        gap: '1.25rem',
        background: 'rgba(255, 255, 255, 0.35)',
        overflowX: 'auto'
      }}>
        {modules.map((mod, modIdx) => (
          <div key={mod.category} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {modIdx > 0 && <div style={{ width: '1px', height: '22px', background: 'rgba(226, 232, 240, 0.8)', margin: '0 0.5rem' }} />}
            
            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.8px', textTransform: 'uppercase', marginRight: '0.2rem' }}>
              {mod.category}
            </div>

            <div style={{ display: 'flex', gap: '0.35rem' }}>
              {mod.items.map((item) => {
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
                      padding: '0.4rem 0.75rem',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#DC2626' : '#475569',
                      background: isActive ? 'rgba(254, 242, 242, 0.85)' : 'transparent',
                      border: isActive ? '1px solid #FCA5A5' : '1px solid transparent',
                      boxShadow: isActive ? '0 2px 8px rgba(220, 38, 38, 0.12)' : 'none',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <Icon style={{ width: '14px', height: '14px', color: isActive ? '#DC2626' : '#64748B' }} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </header>
  );
};
