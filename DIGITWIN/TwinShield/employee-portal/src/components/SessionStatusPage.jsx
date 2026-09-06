import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Monitor, Wifi, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';

export const SessionStatusPage = () => {
  const { currentUser, session } = useAuth();

  const empId = currentUser?.id || session?.employeeId || 'EMP1024';
  const sessionId = session?.sessionId && !session.sessionId.includes('undefined') ? session.sessionId : `SESS-${empId}-ALPHA`;
  const ipAddress = session?.ipAddress || '192.168.1.104';
  const locationCity = session?.locationCity || 'Chennai (HQ Branch)';
  const deviceFingerprint = session?.deviceFingerprint || `DEV-FIN-${empId}-WIN11`;
  const loginTime = session?.loginTime || 'Today (18:00 IST)';
  const status = session?.status || 'ACTIVE';
  const riskScore = typeof session?.riskScore === 'number' ? session.riskScore : 0.0;

  return (
    <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '880px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
          Active Session Security Health Inspector
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748B' }}>
          Zero-Trust session telemetry, client IP verification, and continuous behavioral device fingerprinting.
        </p>
      </div>

      <div className="glass-card" style={{ padding: '2.25rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}>
        
        {/* Session Token Header Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '1.25rem', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ background: '#ECFDF5', padding: '0.65rem', borderRadius: '12px', border: '1px solid #A7F3D0' }}>
              <Lock style={{ color: '#059669', width: '26px', height: '26px' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Session Token ID</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#2563EB', fontFamily: 'monospace', marginTop: '0.1rem' }}>
                {sessionId}
              </div>
            </div>
          </div>

          <span style={{
            fontSize: '0.85rem',
            fontWeight: 800,
            padding: '6px 16px',
            borderRadius: '20px',
            background: status === 'ISOLATED' ? '#FEF2F2' : '#ECFDF5',
            color: status === 'ISOLATED' ? '#DC2626' : '#059669',
            border: status === 'ISOLATED' ? '1px solid #FCA5A5' : '1px solid #A7F3D0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <CheckCircle2 style={{ width: '16px', height: '16px' }} /> SESSION {status}
          </span>
        </div>

        {/* Telemetry Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem', marginBottom: '1.75rem' }}>
          
          {/* Client IP Address Box */}
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem', color: '#64748B', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>
              <Wifi style={{ width: '16px', height: '16px', color: '#2563EB' }} /> Client IP Address
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', fontFamily: 'monospace' }}>
              {ipAddress}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, marginTop: '0.25rem' }}>
              📍 {locationCity}
            </div>
          </div>

          {/* Device Fingerprint Box */}
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem', color: '#64748B', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>
              <Monitor style={{ width: '16px', height: '16px', color: '#7C3AED' }} /> Hardware Device Fingerprint
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', fontFamily: 'monospace' }}>
              {deviceFingerprint}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.25rem' }}>
              Trusted Corporate Workstation
            </div>
          </div>

          {/* Continuous Risk Score Box */}
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem', color: '#64748B', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>
              <Activity style={{ width: '16px', height: '16px', color: '#D97706' }} /> Risk Assessment Score
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: riskScore >= 70 ? '#DC2626' : (riskScore >= 50 ? '#2563EB' : '#059669') }}>
              {riskScore.toFixed(1)}%
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.25rem' }}>
              ML Behavioral Digital Twin
            </div>
          </div>

        </div>

        {/* Footer Info Bar */}
        <div style={{ paddingTop: '1.25rem', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748B' }}>
          <span>Session Started: <strong style={{ color: '#0F172A' }}>{loginTime}</strong></span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ShieldCheck style={{ color: '#059669', width: '16px', height: '16px' }} />
            Security Protocol: <strong style={{ color: '#059669' }}>Zero-Trust Continuous Telemetry</strong>
          </span>
        </div>

      </div>
    </div>
  );
};
