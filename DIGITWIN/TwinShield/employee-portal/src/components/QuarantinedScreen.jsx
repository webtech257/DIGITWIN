import React from 'react';
import { ShieldAlert, Lock, AlertTriangle, Radio } from 'lucide-react';

export const QuarantinedScreen = ({ session, currentUser }) => {
  return (
    <div className="animate-fade-in" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FEF2F2 0%, #F8FAFC 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div className="glass-card" style={{
        maxWidth: '720px',
        width: '100%',
        padding: '3rem 2.5rem',
        background: '#FFFFFF',
        border: '2px solid #FCA5A5',
        boxShadow: '0 20px 50px rgba(220, 38, 38, 0.12)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Top Warning Strip */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(90deg, #B91C1C, #DC2626, #B91C1C)',
          color: '#FFFFFF',
          fontSize: '0.75rem',
          fontWeight: 800,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          padding: '4px 0'
        }}>
          ⚠️ ZERO-TRUST AUTOMATED SESSION QUARANTINE ENFORCED ⚠️
        </div>

        <div style={{
          width: '84px',
          height: '84px',
          background: '#FEF2F2',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '1.5rem auto 1.5rem auto',
          border: '3px solid #DC2626',
          boxShadow: '0 8px 24px rgba(220, 38, 38, 0.25)'
        }}>
          <ShieldAlert style={{ width: '46px', height: '46px', color: '#DC2626' }} />
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
          Access Revoked — Session Quarantined
        </h1>

        <p style={{ fontSize: '1rem', color: '#64748B', marginBottom: '2rem', maxWidth: '580px', margin: '0 auto 2rem auto', lineHeight: '1.6' }}>
          Your session for <strong style={{ color: '#DC2626' }}>{currentUser?.name} ({currentUser?.id})</strong> was automatically revoked by the <strong style={{ color: '#0F172A' }}>TwinShield Policy Engine</strong> after crossing the <strong style={{ color: '#DC2626' }}>100% Critical Risk Threshold</strong>.
        </p>

        {/* Security Parameters Box */}
        <div style={{
          background: '#FEF2F2',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid #FCA5A5',
          textAlign: 'left',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', fontSize: '0.85rem' }}>
            <div>
              <div style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Target Session Token</div>
              <div style={{ color: '#2563EB', fontFamily: 'monospace', fontWeight: 700, fontSize: '0.95rem', marginTop: '0.2rem' }}>
                {session?.sessionId || 'SESS-1024-ALPHA'}
              </div>
            </div>

            <div>
              <div style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Assessed Composite Risk</div>
              <div style={{ color: '#DC2626', fontFamily: 'monospace', fontWeight: 800, fontSize: '1.1rem', marginTop: '0.2rem' }}>
                100.0% (CRITICAL THREAT)
              </div>
            </div>

            <div>
              <div style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Quarantine Trigger Reason</div>
              <div style={{ color: '#DC2626', fontWeight: 600, marginTop: '0.2rem' }}>
                Honey Decoy Vault Exfiltration & High Velocity RBAC Violation
              </div>
            </div>

            <div>
              <div style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>System Enforcement State</div>
              <div style={{ color: '#DC2626', fontWeight: 700, marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Lock style={{ width: '14px', height: '14px' }} /> ALL ENDPOINTS & VIEWS BLOCKED
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Administrator Authorization Polling Indicator */}
        <div style={{
          background: '#ECFDF5',
          border: '1px solid #A7F3D0',
          borderRadius: '10px',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          color: '#059669',
          fontSize: '0.88rem',
          fontWeight: 600
        }}>
          <Radio style={{ width: '20px', height: '20px', color: '#059669' }} className="pulse-led" />
          <span>Awaiting SOC Administrator Authorization from Security Dashboard...</span>
        </div>

        <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '1.5rem' }}>
          Once an administrator clicks <strong>Restore Session</strong> or <strong>Require MFA</strong> on the Security Control Plane, access will update automatically in real-time.
        </div>
      </div>
    </div>
  );
};
