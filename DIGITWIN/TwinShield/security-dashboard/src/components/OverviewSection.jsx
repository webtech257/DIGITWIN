import React from 'react';
import { useSOC } from '../context/SOCContext';
import { Users, Monitor, AlertTriangle, ShieldAlert, Lock } from 'lucide-react';
import { EmployeeLocationMap } from './EmployeeLocationMap';

export const OverviewSection = () => {
  const { stats } = useSOC();

  const cards = [
    {
      label: 'Total Employees',
      value: stats.totalEmployees.toLocaleString(),
      icon: Users,
      color: '#2563EB',
      glassBg: 'rgba(219, 234, 254, 0.5)',
      border: 'rgba(147, 197, 253, 0.85)',
      glow: 'rgba(37, 99, 235, 0.22)'
    },
    {
      label: 'Active Sessions',
      value: stats.activeSessions.toLocaleString(),
      icon: Monitor,
      color: '#059669',
      glassBg: 'rgba(209, 250, 229, 0.5)',
      border: 'rgba(110, 231, 183, 0.85)',
      glow: 'rgba(5, 150, 105, 0.22)'
    },
    {
      label: 'Suspicious Sessions',
      value: stats.suspiciousSessions.toLocaleString(),
      icon: AlertTriangle,
      color: '#D97706',
      glassBg: 'rgba(254, 243, 199, 0.5)',
      border: 'rgba(252, 211, 77, 0.85)',
      glow: 'rgba(217, 119, 6, 0.22)'
    },
    {
      label: 'Critical Threats',
      value: stats.criticalThreats.toLocaleString(),
      icon: ShieldAlert,
      color: '#DC2626',
      glassBg: 'rgba(254, 226, 226, 0.5)',
      border: 'rgba(252, 165, 165, 0.85)',
      glow: 'rgba(220, 38, 38, 0.25)'
    },
    {
      label: 'Isolated Sessions',
      value: stats.isolatedSessions.toLocaleString(),
      icon: Lock,
      color: '#7C3AED',
      glassBg: 'rgba(237, 233, 254, 0.5)',
      border: 'rgba(216, 180, 254, 0.85)',
      glow: 'rgba(124, 58, 237, 0.22)'
    }
  ];

  return (
    <div>
      {/* Top KPI Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="soc-card"
              style={{
                padding: '1.35rem 1.4rem',
                background: 'rgba(255, 255, 255, 0.42)',
                backdropFilter: 'blur(24px) saturate(200%)',
                WebkitBackdropFilter: 'blur(24px) saturate(200%)',
                border: '1.5px solid rgba(255, 255, 255, 0.85)',
                borderLeft: `4.5px solid ${card.color}`,
                borderRadius: '16px',
                boxShadow: `0 20px 40px -12px ${card.glow}, inset 0 1px 2px 0 rgba(255, 255, 255, 0.95)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer'
              }}
            >
              <div>
                <div style={{ fontSize: '0.72rem', color: '#475569', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.6px' }}>
                  {card.label}
                </div>
                <div className="font-mono" style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', marginTop: '0.2rem', letterSpacing: '-0.5px' }}>
                  {card.value}
                </div>
              </div>

              <div style={{
                background: card.glassBg,
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                padding: '0.7rem',
                borderRadius: '14px',
                border: `1.5px solid ${card.border}`,
                boxShadow: `0 6px 16px ${card.glow}, inset 0 1px 1px rgba(255, 255, 255, 0.8)`
              }}>
                <Icon style={{ color: card.color, width: '24px', height: '24px' }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Interactive Live Employee GIS Location Map */}
      <EmployeeLocationMap />
    </div>
  );
};
