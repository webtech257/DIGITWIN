import React from 'react';
import { useSOC } from '../context/SOCContext';
import { FileText, Terminal } from 'lucide-react';

export const AuditLogsView = () => {
  const { auditLogs } = useSOC();

  return (
    <div className="soc-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
        <FileText style={{ color: '#10B981', width: '20px', height: '20px' }} />
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC' }}>Immutable Security Audit Trail</h2>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#0B132B', borderBottom: '1px solid #1E293B', color: '#64748B', fontSize: '0.72rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.75rem 1rem' }}>ID</th>
              <th style={{ padding: '0.75rem 1rem' }}>Timestamp</th>
              <th style={{ padding: '0.75rem 1rem' }}>Actor</th>
              <th style={{ padding: '0.75rem 1rem' }}>Action Executed</th>
              <th style={{ padding: '0.75rem 1rem' }}>Target Entity</th>
              <th style={{ padding: '0.75rem 1rem' }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log) => (
              <tr key={log.id} style={{ borderBottom: '1px solid #1E293B' }}>
                <td className="font-mono" style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#60A5FA' }}>#{log.id}</td>
                <td className="font-mono" style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#94A3B8' }}>{log.timestamp}</td>
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', fontWeight: 600, color: '#F8FAFC' }}>{log.actor}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <code style={{ fontSize: '0.78rem', color: '#10B981', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                    {log.action}
                  </code>
                </td>
                <td className="font-mono" style={{ padding: '0.75rem 1rem', fontSize: '0.82rem', color: '#CBD5E1' }}>{log.target}</td>
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.82rem', color: '#94A3B8' }}>{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
