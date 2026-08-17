import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, CreditCard, ShieldAlert, FileText, Lock, CheckCircle, ArrowUpRight } from 'lucide-react';

export const DashboardPage = ({ setActiveTab, triggerDeniedAction }) => {
  const { currentUser, session } = useAuth();

  if (!currentUser) return null;

  return (
    <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Welcome Banner */}
      <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '2rem' }}>{currentUser.avatar}</span>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F8FAFC' }}>Welcome back, {currentUser.name}</h1>
              <p style={{ fontSize: '0.875rem', color: '#94A3B8' }}>{currentUser.department} • Assigned Role: <strong style={{ color: '#10B981' }}>{currentUser.roleName}</strong></p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ background: '#0F172A', padding: '0.75rem 1.25rem', borderRadius: '8px', border: '1px solid #334155', textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Active Session ID</div>
            <div style={{ fontSize: '0.85rem', color: '#60A5FA', fontFamily: 'monospace', fontWeight: 600 }}>{session?.sessionId}</div>
          </div>
          <div style={{ background: '#0F172A', padding: '0.75rem 1.25rem', borderRadius: '8px', border: '1px solid #334155', textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Security Status</div>
            <div style={{ fontSize: '0.85rem', color: '#34D399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'flex-end' }}>
              <CheckCircle style={{ width: '14px', height: '14px' }} /> NORMAL (0-60%)
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Tiles */}
      <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#F8FAFC', marginBottom: '1rem' }}>Core Banking Services</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        
        {/* Customer Search Tile */}
        <div
          onClick={() => setActiveTab('customers')}
          className="glass-card"
          style={{ padding: '1.25rem', cursor: 'pointer', transition: 'transform 0.2s ease', borderLeft: '4px solid #10B981' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.6rem', borderRadius: '8px' }}>
              <Users style={{ color: '#10B981', width: '22px', height: '22px' }} />
            </div>
            <span style={{ fontSize: '0.7rem', background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>ALLOWED</span>
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#F8FAFC', marginBottom: '0.25rem' }}>Customer Profiles</h3>
          <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Search standard banking customer records and personal info.</p>
        </div>

        {/* Transaction Query Tile */}
        <div
          onClick={() => setActiveTab('transactions')}
          className="glass-card"
          style={{ padding: '1.25rem', cursor: 'pointer', transition: 'transform 0.2s ease', borderLeft: '4px solid #3B82F6' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '0.6rem', borderRadius: '8px' }}>
              <CreditCard style={{ color: '#3B82F6', width: '22px', height: '22px' }} />
            </div>
            <span style={{ fontSize: '0.7rem', background: 'rgba(59, 130, 246, 0.2)', color: '#60A5FA', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>ALLOWED</span>
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#F8FAFC', marginBottom: '0.25rem' }}>Transaction Query</h3>
          <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Lookup account transfers, wire logs, and transaction status.</p>
        </div>

        {/* VIP Vault Access (Restricted for Customer Service) */}
        <div
          onClick={() => triggerDeniedAction('/api/v1/vip/customers', 'VIP Customer Vault Access', 'vip:read')}
          className="glass-card"
          style={{ padding: '1.25rem', cursor: 'pointer', transition: 'transform 0.2s ease', borderLeft: '4px solid #F59E0B' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '0.6rem', borderRadius: '8px' }}>
              <ShieldAlert style={{ color: '#F59E0B', width: '22px', height: '22px' }} />
            </div>
            <span style={{
              fontSize: '0.7rem',
              background: currentUser.permissions.includes('vip:read') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              color: currentUser.permissions.includes('vip:read') ? '#34D399' : '#F87171',
              padding: '2px 8px',
              borderRadius: '10px',
              fontWeight: 600
            }}>
              {currentUser.permissions.includes('vip:read') ? 'ALLOWED' : 'RESTRICTED (VIP)'}
            </span>
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#F8FAFC', marginBottom: '0.25rem' }}>VIP Customer Vault</h3>
          <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>High-net-worth confidential records (Sensitivity 90).</p>
        </div>

        {/* Manager Summary Report Tile */}
        <div
          onClick={() => triggerDeniedAction('/api/v1/reports/manager-summary', 'Manager Financial Audit Report', 'reports:read')}
          className="glass-card"
          style={{ padding: '1.25rem', cursor: 'pointer', transition: 'transform 0.2s ease', borderLeft: '4px solid #8B5CF6' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.15)', padding: '0.6rem', borderRadius: '8px' }}>
              <FileText style={{ color: '#8B5CF6', width: '22px', height: '22px' }} />
            </div>
            <span style={{
              fontSize: '0.7rem',
              background: currentUser.permissions.includes('reports:read') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              color: currentUser.permissions.includes('reports:read') ? '#34D399' : '#F87171',
              padding: '2px 8px',
              borderRadius: '10px',
              fontWeight: 600
            }}>
              {currentUser.permissions.includes('reports:read') ? 'ALLOWED' : 'RESTRICTED (REPORT)'}
            </span>
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#F8FAFC', marginBottom: '0.25rem' }}>Manager Audit Report</h3>
          <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Internal financial audit summaries (Sensitivity 95).</p>
        </div>

      </div>

      {/* Behavioral Digital Twin Info Box */}
      <div className="glass-card" style={{ padding: '1.5rem', border: '1px dashed rgba(16, 185, 129, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <Lock style={{ color: '#10B981', width: '20px', height: '20px' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#F8FAFC' }}>TwinShield Behavioral Baseline Active</h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.6 }}>
          Every action performed in this portal is evaluated in real-time against your learned working behavior profile
          (Working hours: <code style={{ color: '#10B981' }}>{currentUser.normalStartHour} - {currentUser.normalEndHour}</code>, Typical device: <code style={{ color: '#60A5FA' }}>BANK-PC-{currentUser.id}</code>).
          Unauthorized accesses will be denied and logged immediately for security risk scoring.
        </p>
      </div>
    </div>
  );
};
