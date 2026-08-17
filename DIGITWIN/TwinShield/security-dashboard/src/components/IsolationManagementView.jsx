import React from 'react';
import { useSOC } from '../context/SOCContext';
import { Lock, RefreshCw, Key, ShieldAlert, UserX, CheckCircle } from 'lucide-react';

export const IsolationManagementView = () => {
  const {
    isolatedSessions,
    handleRestoreSession,
    handleRequireMFA,
    handleExtendIsolation,
    handleDisableAccount
  } = useSOC();

  return (
    <div className="soc-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid #1E293B', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Lock style={{ color: '#EF4444', width: '22px', height: '22px' }} />
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC' }}>Automated Session Isolation Control Manager</h2>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Zero-Trust quarantined session management & administrator resolution actions.</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {isolatedSessions.map((session) => {
          const isRestored = session.status === 'RESTORED';
          const isDisabled = session.status === 'ACCOUNT_DISABLED';
          const isMfa = session.status === 'STEP_UP_MFA';

          return (
            <div
              key={session.sessionId}
              style={{
                background: '#0B132B',
                padding: '1.25rem',
                borderRadius: '8px',
                border: isRestored ? '1px solid rgba(16, 185, 129, 0.4)' : isDisabled ? '1px solid rgba(239, 68, 68, 0.6)' : '1px solid rgba(239, 68, 68, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span className="font-mono" style={{ fontSize: '1rem', fontWeight: 700, color: '#60A5FA' }}>{session.sessionId}</span>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '10px',
                      background: isRestored ? 'rgba(16, 185, 129, 0.2)' : isDisabled ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)',
                      color: isRestored ? '#34D399' : isDisabled ? '#F87171' : '#F87171'
                    }}>
                      {session.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: '#F8FAFC', marginTop: '0.25rem' }}>
                    Target Employee: <strong>{session.employeeName}</strong> (<code style={{ color: '#60A5FA' }}>{session.employeeId}</code>)
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Trigger Risk Score</div>
                  <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#EF4444' }}>{session.riskScore}%</div>
                </div>
              </div>

              <div style={{ fontSize: '0.82rem', color: '#CBD5E1', background: '#0F172A', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #1E293B' }}>
                Isolation Reason: <strong style={{ color: '#F87171' }}>{session.reason}</strong> (Quarantined at {session.isolatedAt})
              </div>

              {/* Action Control Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleRestoreSession(session.sessionId, session.employeeId)}
                  disabled={isRestored}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#34D399',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    opacity: isRestored ? 0.5 : 1
                  }}
                >
                  <RefreshCw style={{ width: '14px', height: '14px' }} />
                  Restore Session
                </button>

                <button
                  onClick={() => handleRequireMFA(session.sessionId, session.employeeId)}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    background: 'rgba(59, 130, 246, 0.2)',
                    color: '#60A5FA',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Key style={{ width: '14px', height: '14px' }} />
                  Require MFA
                </button>


                <button
                  onClick={() => handleExtendIsolation(session.sessionId)}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    background: 'rgba(245, 158, 11, 0.2)',
                    color: '#FBBF24',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <ShieldAlert style={{ width: '14px', height: '14px' }} />
                  Extend Isolation
                </button>

                <button
                  onClick={() => handleDisableAccount(session.sessionId, session.employeeId)}
                  disabled={isDisabled}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    background: 'rgba(239, 68, 68, 0.2)',
                    color: '#F87171',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    opacity: isDisabled ? 0.5 : 1
                  }}
                >
                  <UserX style={{ width: '14px', height: '14px' }} />
                  Disable Account
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
