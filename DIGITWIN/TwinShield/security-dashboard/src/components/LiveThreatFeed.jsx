import React from 'react';
import { useSOC } from '../context/SOCContext';
import { Radio } from 'lucide-react';

export const LiveThreatFeed = () => {
  const { threatEvents } = useSOC();

  return (
    <div className="soc-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Radio style={{ color: '#EF4444', width: '20px', height: '20px' }} className="pulse-led" />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC' }}>Live Security Event Stream</h2>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#10B981', background: 'rgba(16, 185, 129, 0.15)', padding: '3px 8px', borderRadius: '12px', fontWeight: 600 }}>
          Real-Time WebSocket Stream Active
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#0B132B', borderBottom: '1px solid #1E293B', color: '#64748B', fontSize: '0.72rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Timestamp</th>
              <th style={{ padding: '0.75rem 1rem' }}>Employee ID</th>
              <th style={{ padding: '0.75rem 1rem' }}>Security Event</th>
              <th style={{ padding: '0.75rem 1rem' }}>Severity</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Risk Score</th>
            </tr>
          </thead>
          <tbody>
            {threatEvents.map((ev) => {
              const isCritical = ev.severity === 'CRITICAL' || ev.riskScore > 90;
              const isHigh = ev.severity === 'HIGH' || ev.riskScore > 75;

              return (
                <tr key={ev.id} style={{ borderBottom: '1px solid #1E293B', transition: 'background 0.2s ease' }}>
                  <td className="font-mono" style={{ padding: '0.75rem 1rem', fontSize: '0.82rem', color: '#94A3B8' }}>
                    {ev.timestamp}
                  </td>
                  <td className="font-mono" style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', fontWeight: 600, color: '#60A5FA' }}>
                    {ev.employeeId}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#F8FAFC', fontWeight: 500 }}>
                    {ev.event}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '10px',
                      background: isCritical ? 'rgba(239, 68, 68, 0.2)' : isHigh ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                      color: isCritical ? '#F87171' : isHigh ? '#FBBF24' : '#60A5FA',
                      border: isCritical ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid transparent'
                    }}>
                      {ev.severity}
                    </span>
                  </td>
                  <td className="font-mono" style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700, color: isCritical ? '#EF4444' : isHigh ? '#F59E0B' : '#10B981' }}>
                    {ev.riskScore}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
