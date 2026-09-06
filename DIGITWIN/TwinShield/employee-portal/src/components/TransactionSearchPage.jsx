import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Search, ArrowUpRight, CheckCircle2, ShieldAlert } from 'lucide-react';

export const TransactionSearchPage = () => {
  const { transactions } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = transactions.filter((t) =>
    t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>Transaction History Ticker</h1>
          <p style={{ fontSize: '0.875rem', color: '#64748B' }}>Live real-time feed of teller deposits, cheque settlements, and wire approvals.</p>
        </div>
        <span style={{ fontSize: '0.78rem', color: '#059669', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>
          LIVE FEED ACTIVE ({transactions.length} Records)
        </span>
      </div>

      {/* Filter Bar */}
      <div className="glass-card" style={{ padding: '0.75rem 1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
        <Search style={{ color: '#64748B', width: '20px', height: '20px' }} />
        <input
          type="text"
          placeholder="Filter by Customer Name, Transaction ID, or Type (e.g. Deposit, Cheque)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#0F172A',
            width: '100%',
            fontSize: '0.95rem',
            outline: 'none'
          }}
        />
      </div>

      {/* Transactions Roster Table */}
      <div className="glass-card" style={{ padding: '1.5rem', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.85rem 1rem' }}>Transaction ID</th>
              <th style={{ padding: '0.85rem 1rem' }}>Customer Name</th>
              <th style={{ padding: '0.85rem 1rem' }}>Type</th>
              <th style={{ padding: '0.85rem 1rem' }}>Channel / Memo</th>
              <th style={{ padding: '0.85rem 1rem' }}>Time</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((txn) => (
              <tr key={txn.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '0.9rem 1rem', fontWeight: 800, fontFamily: 'monospace', color: '#2563EB' }}>{txn.id}</td>
                <td style={{ padding: '0.9rem 1rem', fontWeight: 700, color: '#0F172A' }}>{txn.customerName}</td>
                <td style={{ padding: '0.9rem 1rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' }}>
                    {txn.type}
                  </span>
                </td>
                <td style={{ padding: '0.9rem 1rem', color: '#475569', fontSize: '0.85rem', fontWeight: 500 }}>{txn.channel}</td>
                <td style={{ padding: '0.9rem 1rem', color: '#64748B', fontSize: '0.8rem' }}>{txn.date}</td>
                <td style={{ padding: '0.9rem 1rem', textAlign: 'right', fontWeight: 800, color: '#059669', fontSize: '0.95rem' }}>
                  {txn.amount > 0 ? `₹${txn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹0.00'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
