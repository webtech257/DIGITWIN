import React, { useState } from 'react';
import { useAuth, SYNTHETIC_PERSONAS } from '../context/AuthContext';
import { Shield, Lock, KeyRound, ArrowRight, UserCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export const LoginPage = ({ onLoginSuccess }) => {
  const { loginUser } = useAuth();
  const [step, setStep] = useState(1); // Step 1: Password, Step 2: MFA OTP
  const [selectedPersonaId, setSelectedPersonaId] = useState('EMP1024');
  const [password, setPassword] = useState('TwinShield@2026');
  const [mfaCode, setMfaCode] = useState('');
  const [error, setError] = useState('');

  const selectedPersona = SYNTHETIC_PERSONAS.find((p) => p.id === selectedPersonaId) || SYNTHETIC_PERSONAS[0];

  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    setError('');
    setStep(2); // Proceed to MFA verification
  };

  const handleStep2Submit = (e) => {
    e.preventDefault();
    if (!mfaCode || mfaCode.length < 6) {
      setError('Please enter a valid 6-digit MFA passcode.');
      return;
    }
    setError('');
    loginUser(selectedPersonaId);
    if (onLoginSuccess) onLoginSuccess();
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'radial-gradient(circle at top, #1E293B 0%, #0F172A 100%)',
      padding: '1.5rem'
    }}>
      <div className="glass-card animate-fade-in" style={{
        maxWidth: '540px',
        width: '100%',
        padding: '2.5rem',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'linear-gradient(135deg, #10B981, #059669)',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
          }}>
            <Shield style={{ width: '30px', height: '30px', color: '#FFFFFF' }} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.25rem' }}>Apex Financial Bank</h2>
          <p style={{ fontSize: '0.875rem', color: '#94A3B8' }}>Zero-Trust Identity & Telemetry Portal</p>
        </div>

        {/* Step Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 600, color: step === 1 ? '#34D399' : '#64748B' }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: step === 1 ? '#10B981' : '#334155', color: '#FFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>1</span>
            Password Verification
          </div>
          <div style={{ width: '30px', height: '1px', background: '#334155' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 600, color: step === 2 ? '#34D399' : '#64748B' }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: step === 2 ? '#10B981' : '#334155', color: '#FFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>2</span>
            MFA Authentication
          </div>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#F87171',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle style={{ width: '16px', height: '16px' }} />
            {error}
          </div>
        )}

        {/* STEP 1: Persona & Password */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '0.75rem' }}>
                Select Employee Persona
              </label>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {SYNTHETIC_PERSONAS.map((persona) => {
                  const isSelected = selectedPersonaId === persona.id;
                  return (
                    <div
                      key={persona.id}
                      onClick={() => setSelectedPersonaId(persona.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.8rem 1rem',
                        borderRadius: '8px',
                        background: isSelected ? 'rgba(16, 185, 129, 0.12)' : '#0F172A',
                        border: isSelected ? '1.5px solid #10B981' : '1px solid #334155',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.4rem' }}>{persona.avatar}</span>
                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#F8FAFC' }}>{persona.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                            ID: <code style={{ color: '#10B981' }}>{persona.id}</code> • {persona.department}
                          </div>
                        </div>
                      </div>

                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '10px',
                        background: persona.roleId === 'ROLE_ADMIN' ? 'rgba(139, 92, 246, 0.2)' : persona.roleId === 'ROLE_MANAGER' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                        color: persona.roleId === 'ROLE_ADMIN' ? '#A78BFA' : persona.roleId === 'ROLE_MANAGER' ? '#60A5FA' : '#34D399'
                      }}>
                        {persona.roleName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.5rem' }}>
                <Lock style={{ width: '14px', height: '14px', color: '#10B981' }} />
                Account Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '0.95rem',
                  background: '#0F172A',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#F8FAFC'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.85rem',
                background: 'linear-gradient(135deg, #10B981, #059669)',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '0.95rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Continue to Multi-Factor Authentication (MFA)
              <ArrowRight style={{ width: '16px', height: '16px' }} />
            </button>
          </form>
        )}

        {/* STEP 2: Multi-Factor Authentication (MFA) */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit}>
            <div style={{
              background: '#0F172A',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid #334155',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem'
            }}>
              <span style={{ fontSize: '2rem' }}>{selectedPersona.avatar}</span>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#F8FAFC' }}>{selectedPersona.name}</div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{selectedPersona.email}</div>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.5rem' }}>
                <KeyRound style={{ width: '14px', height: '14px', color: '#10B981' }} />
                6-Digit Authenticator OTP Code
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  fontSize: '1.3rem',
                  fontFamily: 'monospace',
                  letterSpacing: '6px',
                  textAlign: 'center',
                  background: '#0F172A',
                  border: '1.5px solid #10B981',
                  borderRadius: '8px',
                  color: '#F8FAFC'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setMfaCode('123456')}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  fontSize: '0.78rem',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#34D399',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                ⚡ Auto-Fill MFA OTP (123456)
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.78rem',
                  background: '#1E293B',
                  color: '#94A3B8',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Back
              </button>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.85rem',
                background: 'linear-gradient(135deg, #10B981, #059669)',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '0.95rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <UserCheck style={{ width: '18px', height: '18px' }} />
              Verify MFA & Complete Sign-In
            </button>
          </form>
        )}

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: '#64748B' }}>
          🔒 Enforced by Zero-Trust Multi-Factor Authentication & Telemetry Engine
        </div>
      </div>
    </div>
  );
};
