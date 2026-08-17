import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, CreditCard, Download, ShieldAlert, CheckCircle } from 'lucide-react';

const SYNTHETIC_TRANSACTIONS = [
  { id: 'TXN-901', sender: 'John Doe', recipient: 'Anita Sharma', amount: '$450.00', date: '2026-08-14 14:22', status: 'COMPLETED' },
  { id: 'TXN-902', sender: 'Robert Chen', recipient: 'Apex Brokerage', amount: '$12,000.00', date: '2026-08-14 15:10', status: 'COMPLETED' },
  { id: 'TXN-903', sender: 'David Miller', recipient: 'Victor Vance', amount: '$85,000.00', date: '2026-08-14 16:05', status: 'FLAGGED_REVIEW' }
];

export const TransactionSearchPage = ({ triggerDeniedAction }) => {
  const { currentUser, hasPermission, recordActivityToBackend } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const handleBulkExport = () => {
    // Bulk export requires 'reports:read' or 'admin:manage'
    if (!hasPermission('reports:read')) {
      triggerDeniedAction(
        '/api/v1/reports/manager-summary',
        'Attempted Unauthorized Bulk Transaction Data Export',
        'reports:read'
      );
      return;
    }

    recordActivityToBackend('/api/v1/reports/manager-summary', 'EXPORT', 300, false);
    alert('Bulk Export Processed Successfully (Synthetic Sample Downloaded)');
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F8FAFC' }}>Transaction Ledger Query</h1>
          <p style={{ fontSize: '0.875rem', color: '#94A3B8' }}>Synthetic banking wire transactions & customer transfer logs.</p>
        </div>

        <button
          onClick={handleBulkExport}
          style={{
            padding: '0.6rem 1.1rem',
            background: hasPermission('reports:read') ? 'linear-gradient(135deg, #10B981, #059669)' : 'rgba(239, 68, 68, 0.15)',
            color: hasPermission('reports:read') ? '#FFFFFF' : '#F87171',
            borderRadius: '6px',
            fontSize: '0.85rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            border: hasPermission('reports:read') ? 'none' : '1px solid rgba(239, 68, 68, 0.3)'
          }}
        >
          <Download style={{ width: '16px', height: '16px' }} />
          Bulk Data Export (Sensitivity 95)
        </button>
      </div>

      <div className="glass-card" style={{ padding: '0.75rem 1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Search style={{ color: '#94A3B8', width: '20px', height: '20px' }} />
        <input
          type="text"
          placeholder="Filter by transaction ID or party..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ background: 'transparent', border: 'none', color: '#F8FAFC', width: '100%', fontSize: '0.95rem' }}
        />
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#0F172A', borderBottom: '1px solid #334155', color: '#94A3B8', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '1rem' }}>TXN ID</th>
              <th style={{ padding: '1rem' }}>Sender</th>
              <th style={{ padding: '1rem' }}>Recipient</th>
              <th style={{ padding: '1rem' }}>Amount</th>
              <th style={{ padding: '1rem' }}>Date/Time</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {SYNTHETIC_TRANSACTIONS.map((txn) => (
              <tr key={txn.id} style={{ borderBottom: '1px solid #334155' }}>
                <td style={{ padding: '1rem', fontWeight: 600, fontFamily: 'monospace', color: '#60A5FA' }}>{txn.id}</td>
                <td style={{ padding: '1rem', color: '#F8FAFC' }}>{txn.sender}</td>
                <td style={{ padding: '1rem', color: '#F8FAFC' }}>{txn.recipient}</td>
                <td style={{ padding: '1rem', fontWeight: 600, color: '#10B981' }}>{txn.amount}</td>
                <td style={{ padding: '1rem', color: '#94A3B8', fontSize: '0.85rem' }}>{txn.date}</td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: '10px',
                    background: txn.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: txn.status === 'COMPLETED' ? '#34D399' : '#FBBF24'
                  }}>
                    {txn.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
