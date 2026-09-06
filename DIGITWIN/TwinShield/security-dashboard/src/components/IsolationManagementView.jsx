import React, { useState } from 'react';
import { useSOC } from '../context/SOCContext';
import { Lock, RefreshCw, Key, ShieldAlert, UserX, CheckCircle, Zap, ShieldCheck } from 'lucide-react';

export const IsolationManagementView = () => {
  const {
    isolatedSessions,
    handleRestoreSession,
    handleRequireMFA,
    handleExtendIsolation,
    handleDisableAccount,
    triggerSyntheticAttackDemo
  } = useSOC();

  const [toastMsg, setToastMsg] = useState('');

  const triggerAttackDemo = async () => {
    setToastMsg('⚡ Simulating decoy payload exfiltration & triggering automated 98.2% risk isolation...');
    await triggerSyntheticAttackDemo();
    setTimeout(() => setToastMsg(''), 5000);
  };

  return (
    <div className="soc-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ background: '#FEF2F2', padding: '0.5rem', borderRadius: '8px', border: '1px solid #FCA5A5' }}>
            <Lock style={{ color: '#DC2626', width: '22px', height: '22px' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>Automated Session Isolation Control Manager</h2>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Zap style={{ width: '12px', height: '12px' }} /> LIVE REST API & WEBSOCKET ENGINE
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.15rem' }}>
              Zero-Trust quarantined session management & real-time administrator resolution actions.
            </p>
          </div>
        </div>

        {/* Demo Attack Trigger */}
        <button
          onClick={triggerAttackDemo}
          style={{
            padding: '0.55rem 1.1rem',
            background: 'linear-gradient(135deg, #DC2626, #B91C1C)',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.8rem',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Zap style={{ width: '14px', height: '14px' }} /> Simulate High-Risk Quarantine Attack
        </button>
      </div>

      {toastMsg && (
        <div style={{ padding: '0.75rem 1rem', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          {toastMsg}
        </div>
      )}

      {/* Main Quarantined Sessions Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {isolatedSessions.length === 0 ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: '#059669', background: '#ECFDF5', borderRadius: '10px', border: '1px solid #A7F3D0', fontWeight: 700 }}>
            <ShieldCheck style={{ width: '32px', height: '32px', margin: '0 auto 0.5rem auto' }} />
            No active quarantined sessions. All employee digital twins operating within normal baseline parameters.
          </div>
        ) : (
          isolatedSessions.map((session) => {
            const statusStr = String(session.status || 'ISOLATED').toUpperCase();
            const isRestored = statusStr.includes('RESTORE');
            const isDisabled = statusStr.includes('DISABLE') || statusStr.includes('SUSPEND');
            const isMfa = statusStr.includes('MFA');
            const isExtended = statusStr.includes('EXTEND');

            return (
              <div
                key={session.sessionId}
                style={{
                  background: '#FFFFFF',
                  padding: '1.25rem',
                  borderRadius: '10px',
                  border: isRestored ? '1px solid #A7F3D0' : isDisabled ? '1.5px solid #DC2626' : isMfa ? '1px solid #BFDBFE' : '1.5px solid #FCA5A5',
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span className="font-mono" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#2563EB' }}>{session.sessionId}</span>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        padding: '3px 10px',
                        borderRadius: '12px',
                        background: isRestored ? '#ECFDF5' : isDisabled ? '#FEF2F2' : isMfa ? '#EFF6FF' : '#FEF2F2',
                        color: isRestored ? '#059669' : isDisabled ? '#991B1B' : isMfa ? '#2563EB' : '#DC2626',
                        border: isRestored ? '1px solid #A7F3D0' : isDisabled ? '1px solid #FCA5A5' : isMfa ? '1px solid #BFDBFE' : '1px solid #FCA5A5'
                      }}>
                        {isRestored ? '🟢 RESTORED (ACTIVE)' : isDisabled ? '💀 ACCOUNT SUSPENDED' : isMfa ? '🔵 STEP-UP MFA ENFORCED' : isExtended ? '🟠 ISOLATION EXTENDED' : '🔴 QUARANTINED (ISOLATED)'}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.88rem', color: '#0F172A', marginTop: '0.35rem' }}>
                      Target Employee: <strong>{session.employeeName || session.employeeId}</strong> (<code style={{ color: '#2563EB', fontWeight: 700 }}>{session.employeeId}</code>)
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Trigger Risk Score</div>
                    <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: isRestored ? '#059669' : '#DC2626' }}>
                      {typeof session.riskScore === 'number' ? session.riskScore.toFixed(1) : session.riskScore}%
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#334155', background: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  Isolation Telemetry: <strong style={{ color: isRestored ? '#059669' : '#DC2626' }}>{session.reason}</strong>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', marginLeft: '0.5rem' }}>(Timestamp: {session.isolatedAt})</span>
                </div>

                {/* Real-Time SOC Administrator Control Buttons */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => handleRestoreSession(session.sessionId, session.employeeId)}
                    disabled={isRestored}
                    style={{
                      padding: '0.55rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      background: '#ECFDF5',
                      color: '#059669',
                      border: '1px solid #A7F3D0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      cursor: isRestored ? 'default' : 'pointer',
                      opacity: isRestored ? 0.6 : 1,
                      boxShadow: isRestored ? 'none' : '0 2px 6px rgba(5, 150, 105, 0.15)'
                    }}
                  >
                    <RefreshCw style={{ width: '14px', height: '14px' }} />
                    {isRestored ? 'Session Restored' : 'Restore Session (Unquarantine)'}
                  </button>

                  <button
                    onClick={() => handleRequireMFA(session.sessionId, session.employeeId)}
                    disabled={isRestored || isMfa}
                    style={{
                      padding: '0.55rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      background: '#EFF6FF',
                      color: '#2563EB',
                      border: '1px solid #BFDBFE',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      cursor: (isRestored || isMfa) ? 'default' : 'pointer',
                      opacity: (isRestored || isMfa) ? 0.6 : 1
                    }}
                  >
                    <Key style={{ width: '14px', height: '14px' }} />
                    Require MFA Step-Up
                  </button>

                  <button
                    onClick={() => handleExtendIsolation(session.sessionId)}
                    disabled={isRestored}
                    style={{
                      padding: '0.55rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      background: '#FEF3C7',
                      color: '#D97706',
                      border: '1px solid #FDE68A',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      cursor: isRestored ? 'default' : 'pointer',
                      opacity: isRestored ? 0.6 : 1
                    }}
                  >
                    <ShieldAlert style={{ width: '14px', height: '14px' }} />
                    Extend Isolation Audit
                  </button>

                  <button
                    onClick={() => handleDisableAccount(session.sessionId, session.employeeId)}
                    disabled={isDisabled}
                    style={{
                      padding: '0.55rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      background: '#FEF2F2',
                      color: '#DC2626',
                      border: '1px solid #FCA5A5',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      cursor: isDisabled ? 'default' : 'pointer',
                      opacity: isDisabled ? 0.6 : 1
                    }}
                  >
                    <UserX style={{ width: '14px', height: '14px' }} />
                    {isDisabled ? 'Account Suspended' : 'Disable Employee Account'}
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
