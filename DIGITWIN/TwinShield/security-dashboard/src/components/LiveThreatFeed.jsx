import React from 'react';
import { useSOC } from '../context/SOCContext';
import { Radio } from 'lucide-react';

export const LiveThreatFeed = () => {
  const { threatEvents } = useSOC();

  return (
    <div className="soc-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Radio style={{ color: '#DC2626', width: '20px', height: '20px' }} className="pulse-led" />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>Live Security Event Stream</h2>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#059669', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '3px 10px', borderRadius: '12px', fontWeight: 600 }}>
          Real-Time WebSocket Stream Active
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>
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
                <tr key={ev.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.2s ease' }}>
                  <td className="font-mono" style={{ padding: '0.75rem 1rem', fontSize: '0.82rem', color: '#64748B' }}>
                    {ev.timestamp}
                  </td>
                  <td className="font-mono" style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', fontWeight: 600, color: '#2563EB' }}>
                    {ev.employeeId}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#0F172A', fontWeight: 500 }}>
                    {ev.event}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '10px',
                      background: isCritical ? '#FEF2F2' : isHigh ? '#FEF3C7' : '#EFF6FF',
                      color: isCritical ? '#DC2626' : isHigh ? '#D97706' : '#2563EB',
                      border: isCritical ? '1px solid #FCA5A5' : isHigh ? '1px solid #FDE68A' : '1px solid #BFDBFE'
                    }}>
                      {ev.severity}
                    </span>
                  </td>
                  <td className="font-mono" style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700, color: isCritical ? '#DC2626' : isHigh ? '#D97706' : '#059669' }}>
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
