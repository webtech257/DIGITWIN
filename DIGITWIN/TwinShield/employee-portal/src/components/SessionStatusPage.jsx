import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Monitor, Wifi, CheckCircle2 } from 'lucide-react';

export const SessionStatusPage = () => {
  const { currentUser, session } = useAuth();

  if (!currentUser || !session) return null;

  return (
    <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '850px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F8FAFC' }}>Active Session Security Health</h1>
        <p style={{ fontSize: '0.875rem', color: '#94A3B8' }}>Zero-Trust session telemetry & device verification inspector.</p>
      </div>

      <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.6rem', borderRadius: '10px' }}>
              <Lock style={{ color: '#10B981', width: '24px', height: '24px' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Session Token</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#60A5FA', fontFamily: 'monospace' }}>{session.sessionId}</div>
            </div>
          </div>

          <span style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            padding: '4px 12px',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.2)',
            color: '#34D399',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            <CheckCircle2 style={{ width: '14px', height: '14px' }} /> SESSION {session.status}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div style={{ background: '#0F172A', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', color: '#94A3B8', fontSize: '0.75rem' }}>
              <Wifi style={{ width: '14px', height: '14px' }} /> Client IP Address
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#F8FAFC', fontFamily: 'monospace' }}>{session.ipAddress} ({session.locationCity})</div>
          </div>

          <div style={{ background: '#0F172A', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', color: '#94A3B8', fontSize: '0.75rem' }}>
              <Monitor style={{ width: '14px', height: '14px' }} /> Hardware Device Fingerprint
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#F8FAFC', fontFamily: 'monospace' }}>{session.deviceFingerprint}</div>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #334155', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94A3B8' }}>
          <span>Session Started: <strong style={{ color: '#F8FAFC' }}>{session.loginTime}</strong></span>
          <span>Security Protocol: <strong style={{ color: '#10B981' }}>Zero-Trust Continuous Risk Evaluation</strong></span>
        </div>
      </div>
    </div>
  );
};
