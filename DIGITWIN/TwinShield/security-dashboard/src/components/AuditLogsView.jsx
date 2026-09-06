import React from 'react';
import { useSOC } from '../context/SOCContext';
import { FileText } from 'lucide-react';

export const AuditLogsView = () => {
  const { auditLogs } = useSOC();

  return (
    <div className="soc-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
        <FileText style={{ color: '#059669', width: '20px', height: '20px' }} />
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>Immutable Security Audit Trail</h2>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>
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
              <tr key={log.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td className="font-mono" style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#2563EB', fontWeight: 600 }}>#{log.id}</td>
                <td className="font-mono" style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#64748B' }}>{log.timestamp}</td>
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', fontWeight: 600, color: '#0F172A' }}>{log.actor}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <code style={{ fontSize: '0.78rem', color: '#059669', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                    {log.action}
                  </code>
                </td>
                <td className="font-mono" style={{ padding: '0.75rem 1rem', fontSize: '0.82rem', color: '#334155' }}>{log.target}</td>
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.82rem', color: '#64748B' }}>{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
