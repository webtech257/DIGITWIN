import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, CreditCard, ShieldAlert, FileText, Lock, CheckCircle, ArrowUpRight, User } from 'lucide-react';

export const DashboardPage = ({ setActiveTab, triggerDeniedAction }) => {
  const { currentUser, session, hasPermission } = useAuth();

  const riskScore = session?.riskScore != null ? Number(session.riskScore) : 0.0;
  const sessionStatus = session?.status || 'ACTIVE';

  const getSecurityStatusBadge = () => {
    if (sessionStatus === 'ISOLATED' || riskScore >= 100.0) {
      return {
        label: `CRITICAL ISOLATED (${riskScore.toFixed(1)}%)`,
        color: '#DC2626',
        icon: <Lock style={{ width: '14px', height: '14px' }} />
      };
    }
    if (riskScore >= 85.0) {
      return {
        label: `HIGH RISK (${riskScore.toFixed(1)}%)`,
        color: '#DC2626',
        icon: <ShieldAlert style={{ width: '14px', height: '14px' }} />
      };
    }
    if (riskScore >= 70.0) {
      return {
        label: `RESTRICTED (${riskScore.toFixed(1)}%)`,
        color: '#D97706',
        icon: <ShieldAlert style={{ width: '14px', height: '14px' }} />
      };
    }
    if (riskScore >= 50.0) {
      return {
        label: `MONITORING (${riskScore.toFixed(1)}%)`,
        color: '#2563EB',
        icon: <ShieldAlert style={{ width: '14px', height: '14px' }} />
      };
    }
    return {
      label: `NORMAL (${riskScore.toFixed(1)}%)`,
      color: '#059669',
      icon: <CheckCircle style={{ width: '14px', height: '14px' }} />
    };
  };

  const badge = getSecurityStatusBadge();

  return (
    <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Welcome Banner */}
      <div className="glass-card" style={{
        padding: '1.5rem 1.75rem',
        marginBottom: '2rem',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #FFFFFF, #F8FAFC)',
        border: '1px solid #E2E8F0',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {currentUser?.avatar && (currentUser.avatar.startsWith('data:image') || currentUser.avatar.startsWith('http')) ? (
            <img src={currentUser.avatar} alt="Profile" style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #2563EB' }} />
          ) : (
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #BFDBFE' }}>
              <User style={{ color: '#2563EB', width: '28px', height: '28px' }} />
            </div>
          )}
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.3px' }}>
              Welcome back, {currentUser?.name || 'Malavika'}
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.15rem' }}>
              {currentUser?.department || 'Retail Banking'} • Role: <strong style={{ color: '#059669' }}>{currentUser?.roleName || 'Customer Service Representative'}</strong>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.95)', padding: '0.75rem 1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0', textAlign: 'right', boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)' }}>
            <div style={{ fontSize: '0.7rem', color: '#475569', textTransform: 'uppercase', fontWeight: 700 }}>Active Session ID</div>
            <div style={{ fontSize: '0.88rem', color: '#2563EB', fontFamily: 'monospace', fontWeight: 800 }}>{session?.sessionId || `SESS-${currentUser?.id || 'EMP1024'}-ACTIVE`}</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.95)', padding: '0.75rem 1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0', textAlign: 'right', boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)' }}>
            <div style={{ fontSize: '0.7rem', color: '#475569', textTransform: 'uppercase', fontWeight: 700 }}>Security Status</div>
            <div style={{ fontSize: '0.88rem', color: badge.color, fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'flex-end' }}>
              {badge.icon} {badge.label}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Tiles */}
      <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0F172A', marginBottom: '1rem' }}>Core Banking Services</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>

        {/* Customer Search Tile */}
        <div
          onClick={() => setActiveTab('customers')}
          className="glass-card"
          style={{ padding: '1.25rem', cursor: 'pointer', transition: 'transform 0.2s ease', borderLeft: '4px solid #059669' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div style={{ background: '#ECFDF5', padding: '0.6rem', borderRadius: '8px' }}>
              <Users style={{ color: '#059669', width: '22px', height: '22px' }} />
            </div>
            <span style={{ fontSize: '0.7rem', background: '#ECFDF5', color: '#059669', padding: '2px 8px', borderRadius: '10px', fontWeight: 600, border: '1px solid #A7F3D0' }}>ALLOWED</span>
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A', marginBottom: '0.25rem' }}>Customer Profiles</h3>
          <p style={{ fontSize: '0.8rem', color: '#64748B' }}>Search standard banking customer records and personal info.</p>
        </div>

        {/* Transaction Query Tile */}
        <div
          onClick={() => setActiveTab('transactions')}
          className="glass-card"
          style={{ padding: '1.25rem', cursor: 'pointer', transition: 'transform 0.2s ease', borderLeft: '4px solid #2563EB' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div style={{ background: '#EFF6FF', padding: '0.6rem', borderRadius: '8px' }}>
              <CreditCard style={{ color: '#2563EB', width: '22px', height: '22px' }} />
            </div>
            <span style={{ fontSize: '0.7rem', background: '#EFF6FF', color: '#2563EB', padding: '2px 8px', borderRadius: '10px', fontWeight: 600, border: '1px solid #BFDBFE' }}>ALLOWED</span>
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A', marginBottom: '0.25rem' }}>Transaction Query</h3>
          <p style={{ fontSize: '0.8rem', color: '#64748B' }}>Lookup account transfers, wire logs, and transaction status.</p>
        </div>

        {/* VIP Vault Access (Restricted for Customer Service) */}
        <div
          onClick={() => triggerDeniedAction('/api/v1/vip/customers', 'VIP Customer Vault Access', 'vip:read')}
          className="glass-card"
          style={{ padding: '1.25rem', cursor: 'pointer', transition: 'transform 0.2s ease', borderLeft: '4px solid #D97706' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div style={{ background: '#FEF3C7', padding: '0.6rem', borderRadius: '8px' }}>
              <ShieldAlert style={{ color: '#D97706', width: '22px', height: '22px' }} />
            </div>
            <span style={{
              fontSize: '0.7rem',
              background: hasPermission('vip:read') ? '#ECFDF5' : '#FEF2F2',
              color: hasPermission('vip:read') ? '#059669' : '#DC2626',
              border: hasPermission('vip:read') ? '1px solid #A7F3D0' : '1px solid #FCA5A5',
              padding: '2px 8px',
              borderRadius: '10px',
              fontWeight: 600
            }}>
              {hasPermission('vip:read') ? 'ALLOWED' : 'RESTRICTED (VIP)'}
            </span>
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A', marginBottom: '0.25rem' }}>VIP Customer Vault</h3>
          <p style={{ fontSize: '0.8rem', color: '#64748B' }}>High-net-worth confidential records (Sensitivity 90).</p>
        </div>

        {/* Manager Summary Report Tile */}
        <div
          onClick={() => triggerDeniedAction('/api/v1/reports/manager-summary', 'Manager Financial Audit Report', 'reports:read')}
          className="glass-card"
          style={{ padding: '1.25rem', cursor: 'pointer', transition: 'transform 0.2s ease', borderLeft: '4px solid #7C3AED' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div style={{ background: '#F3E8FF', padding: '0.6rem', borderRadius: '8px' }}>
              <FileText style={{ color: '#7C3AED', width: '22px', height: '22px' }} />
            </div>
            <span style={{
              fontSize: '0.7rem',
              background: hasPermission('reports:read') ? '#ECFDF5' : '#FEF2F2',
              color: hasPermission('reports:read') ? '#059669' : '#DC2626',
              border: hasPermission('reports:read') ? '1px solid #A7F3D0' : '1px solid #FCA5A5',
              padding: '2px 8px',
              borderRadius: '10px',
              fontWeight: 600
            }}>
              {hasPermission('reports:read') ? 'ALLOWED' : 'RESTRICTED (REPORT)'}
            </span>
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A', marginBottom: '0.25rem' }}>Manager Audit Report</h3>
          <p style={{ fontSize: '0.8rem', color: '#64748B' }}>Internal financial audit summaries (Sensitivity 95).</p>
        </div>

      </div>

      {/* Behavioral Digital Twin Info Box */}
      <div className="glass-card" style={{ padding: '1.5rem', border: '1px dashed #A7F3D0', background: '#F0FDF4' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <Lock style={{ color: '#059669', width: '20px', height: '20px' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A' }}>TwinShield Behavioral Baseline Active</h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
          Every action performed in this portal is evaluated in real-time against your learned working behavior profile
          (Working hours: <code style={{ color: '#059669', fontWeight: 600 }}>{currentUser.normalStartHour || '09:00'} - {currentUser.normalEndHour || '18:00'}</code>, Typical device: <code style={{ color: '#2563EB', fontWeight: 600 }}>BANK-PC-{currentUser.id}</code>).
          Unauthorized accesses will be denied and logged immediately for security risk scoring.
        </p>
      </div>
    </div>
  );
};
