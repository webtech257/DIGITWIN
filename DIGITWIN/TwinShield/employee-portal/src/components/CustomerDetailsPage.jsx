import React from 'react';
import { ArrowLeft, User, CreditCard, ShieldCheck } from 'lucide-react';

export const CustomerDetailsPage = ({ customer, onBack }) => {
  if (!customer) return null;

  return (
    <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <button
        onClick={onBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.5rem 0.9rem',
          background: '#1E293B',
          color: '#94A3B8',
          borderRadius: '6px',
          border: '1px solid #334155',
          marginBottom: '1.5rem',
          fontSize: '0.85rem'
        }}
      >
        <ArrowLeft style={{ width: '16px', height: '16px' }} />
        Back to Customer Search
      </button>

      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid #334155', pb: '1rem', paddingBottom: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#60A5FA', fontFamily: 'monospace', fontWeight: 600 }}>{customer.id}</span>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F8FAFC', marginTop: '0.25rem' }}>{customer.name}</h1>
          </div>
          <span style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            padding: '4px 10px',
            borderRadius: '12px',
            background: customer.type === 'VIP_CONFIDENTIAL' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
            color: customer.type === 'VIP_CONFIDENTIAL' ? '#FBBF24' : '#34D399'
          }}>
            {customer.type}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div style={{ background: '#0F172A', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Available Balance</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10B981', marginTop: '0.25rem' }}>{customer.balance}</div>
          </div>

          <div style={{ background: '#0F172A', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Resource Sensitivity Level</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F59E0B', marginTop: '0.25rem' }}>Score {customer.sensitivity} / 100</div>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <ShieldCheck style={{ color: '#10B981', width: '20px', height: '20px' }} />
          <span style={{ fontSize: '0.8rem', color: '#CBD5E1' }}>Access event logged to Spring Boot telemetry & audit trail.</span>
        </div>
      </div>
    </div>
  );
};
