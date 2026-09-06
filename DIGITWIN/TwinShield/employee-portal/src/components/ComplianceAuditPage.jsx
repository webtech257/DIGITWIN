import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, FileText, AlertTriangle, CheckCircle, Search } from 'lucide-react';

const INITIAL_SAR_FILINGS = [
  { id: 'SAR-2026-081', customer: 'Victor Vance', reason: 'High-volume offshore cash structuring across 4 accounts', riskScore: 89.4, date: '2026-08-28', status: 'FILED_FINCEN' },
  { id: 'SAR-2026-082', customer: 'Elena Rostova', reason: 'Unusual rapid wire transfer velocity to unverified escrow', riskScore: 92.1, date: '2026-08-29', status: 'UNDER_REVIEW' }
];

export const ComplianceAuditPage = () => {
  const { recordActivityToBackend } = useAuth();
  const [sarList, setSarList] = useState(INITIAL_SAR_FILINGS);
  const [customerInput, setCustomerInput] = useState('');
  const [reasonInput, setReasonInput] = useState('');

  const handleFileNewSar = (e) => {
    e.preventDefault();
    if (!customerInput || !reasonInput) return;

    recordActivityToBackend('/api/v1/compliance/sar-filings', 'FILE_SAR', 1, false);

    const newSar = {
      id: `SAR-2026-0${sarList.length + 83}`,
      customer: customerInput,
      reason: reasonInput,
      riskScore: 95.0,
      date: new Date().toISOString().split('T')[0],
      status: 'FILED_FINCEN'
    };

    setSarList([newSar, ...sarList]);
    setCustomerInput('');
    setReasonInput('');
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0F172A' }}>Compliance & AML Regulatory Audit Workbench</h1>
          <p style={{ fontSize: '0.875rem', color: '#64748B' }}>Suspicious Activity Report (SAR) filing console, Anti-Money Laundering transaction auditing, and regulatory compliance.</p>
        </div>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#D97706', background: '#FEF3C7', border: '1px solid #FDE68A', padding: '4px 10px', borderRadius: '6px' }}>
          ROLE_COMPLIANCE AUDIT ACCESS
        </span>
      </div>

      {/* SAR Filing Form */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <FileText style={{ color: '#D97706', width: '22px', height: '22px' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>File Regulatory Suspicious Activity Report (SAR)</h2>
        </div>

        <form onSubmit={handleFileNewSar} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '1rem', alignItems: 'flex-end' }}>
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Subject Customer Name / ID</label>
            <input
              type="text"
              placeholder="e.g. Victor Vance (VIP-9001)"
              value={customerInput}
              onChange={(e) => setCustomerInput(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.88rem' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Suspicion Rationale & Pattern Description</label>
            <input
              type="text"
              placeholder="Describe suspicious wire pattern, structuring, or unexpected turnover..."
              value={reasonInput}
              onChange={(e) => setReasonInput(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.88rem' }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '0.7rem 1.1rem',
              background: 'linear-gradient(135deg, #D97706, #B45309)',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.88rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            File Official SAR Report
          </button>
        </form>
      </div>

      {/* Active SAR Filings Table */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem' }}>Filed Regulatory SAR Records</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.75rem 1rem' }}>SAR ID</th>
              <th style={{ padding: '0.75rem 1rem' }}>Subject Customer</th>
              <th style={{ padding: '0.75rem 1rem' }}>Suspicion Description</th>
              <th style={{ padding: '0.75rem 1rem' }}>AML Risk</th>
              <th style={{ padding: '0.75rem 1rem' }}>Filing Date</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Filing Status</th>
            </tr>
          </thead>
          <tbody>
            {sarList.map((sar) => (
              <tr key={sar.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, fontFamily: 'monospace', color: '#D97706' }}>{sar.id}</td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0F172A' }}>{sar.customer}</td>
                <td style={{ padding: '0.85rem 1rem', color: '#475569', fontSize: '0.85rem' }}>{sar.reason}</td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#DC2626' }}>{sar.riskScore}%</td>
                <td style={{ padding: '0.85rem 1rem', color: '#64748B', fontSize: '0.85rem' }}>{sar.date}</td>
                <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 8px', borderRadius: '10px', background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' }}>
                    {sar.status}
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
