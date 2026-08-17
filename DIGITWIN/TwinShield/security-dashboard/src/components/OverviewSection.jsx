import React from 'react';
import { useSOC } from '../context/SOCContext';
import { Users, Monitor, AlertTriangle, ShieldAlert, Lock } from 'lucide-react';

export const OverviewSection = () => {
  const { stats } = useSOC();

  const cards = [
    { label: 'Total Employees', value: stats.totalEmployees.toLocaleString(), icon: Users, color: '#3B82F6', border: '#1D4ED8' },
    { label: 'Active Sessions', value: stats.activeSessions.toLocaleString(), icon: Monitor, color: '#10B981', border: '#047857' },
    { label: 'Suspicious Sessions', value: stats.suspiciousSessions.toLocaleString(), icon: AlertTriangle, color: '#F59E0B', border: '#B45309' },
    { label: 'Critical Threats', value: stats.criticalThreats.toLocaleString(), icon: ShieldAlert, color: '#EF4444', border: '#B91C1C' },
    { label: 'Isolated Sessions', value: stats.isolatedSessions.toLocaleString(), icon: Lock, color: '#8B5CF6', border: '#6D28D9' }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="soc-card"
            style={{
              padding: '1.25rem',
              borderLeft: `4px solid ${card.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>
                {card.label}
              </div>
              <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 700, color: '#F8FAFC', marginTop: '0.25rem' }}>
                {card.value}
              </div>
            </div>

            <div style={{
              background: `rgba(255, 255, 255, 0.05)`,
              padding: '0.65rem',
              borderRadius: '10px',
              border: `1px solid ${card.border}`
            }}>
              <Icon style={{ color: card.color, width: '24px', height: '24px' }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
