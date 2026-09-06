import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, KeyRound, ArrowRight, UserCheck, CheckCircle2, AlertCircle, User } from 'lucide-react';

export const LoginPage = ({ onLoginSuccess }) => {
  const { loginUser, personas } = useAuth();
  const [step, setStep] = useState(1); // Step 1: Password, Step 2: MFA OTP
  const [selectedPersonaId, setSelectedPersonaId] = useState('EMP1024');
  const [password, setPassword] = useState('TwinShield@2026');
  const [mfaCode, setMfaCode] = useState('');
  const [error, setError] = useState('');

  const employeeList = (personas && personas.length > 0) ? personas : [];
  const selectedPersona = employeeList.find((p) => p.id === selectedPersonaId) || employeeList[0] || {
    id: 'EMP1024',
    name: 'John Doe',
    email: 'john.doe@twinshield-bank.internal',
    avatar: '👨‍💼',
    roleName: 'Customer Service Representative',
    department: 'Retail Banking'
  };

  const handleSelectPersona = (id) => {
    setSelectedPersonaId(id);
    setError('');
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter your account password.');
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
      background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
      padding: '1.5rem'
    }}>
      <div className="glass-card animate-fade-in" style={{
        maxWidth: '540px',
        width: '100%',
        padding: '2.5rem',
        background: '#FFFFFF',
        border: '1.5px solid #E2E8F0',
        boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08)'
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
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>Apex Financial Bank</h2>
          <p style={{ fontSize: '0.875rem', color: '#64748B' }}>Zero-Trust Identity & Telemetry Portal</p>
        </div>

        {/* Step Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 600, color: step === 1 ? '#059669' : '#64748B' }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: step === 1 ? '#059669' : '#E2E8F0', color: step === 1 ? '#FFF' : '#64748B', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>1</span>
            Password Verification
          </div>
          <div style={{ width: '30px', height: '1px', background: '#CBD5E1' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 600, color: step === 2 ? '#059669' : '#64748B' }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: step === 2 ? '#059669' : '#E2E8F0', color: step === 2 ? '#FFF' : '#64748B', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>2</span>
            MFA Authentication
          </div>
        </div>

        {error && (
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#DC2626',
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Select Target Employee Persona
                </label>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#059669' }}>
                  {employeeList.length} Accounts Synchronized
                </span>
              </div>

              {/* Quick Selector Dropdown */}
              <select
                value={selectedPersonaId}
                onChange={(e) => handleSelectPersona(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  background: '#ECFDF5',
                  border: '1.5px solid #059669',
                  borderRadius: '8px',
                  color: '#0F172A',
                  cursor: 'pointer',
                  marginBottom: '1rem'
                }}
              >
                {employeeList.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.id}) — {emp.roleName} [{emp.department}]
                  </option>
                ))}
              </select>

              {/* Persona Cards List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '220px', overflowY: 'auto', paddingRight: '4px' }}>
                {employeeList.map((persona) => {
                  const isSelected = selectedPersonaId === persona.id;
                  return (
                    <div
                      key={persona.id}
                      onClick={() => handleSelectPersona(persona.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.8rem 1rem',
                        borderRadius: '8px',
                        background: isSelected ? '#ECFDF5' : '#F8FAFC',
                        border: isSelected ? '2px solid #059669' : '1px solid #E2E8F0',
                        boxShadow: isSelected ? '0 4px 12px rgba(16, 185, 129, 0.15)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.4rem' }}>{persona.avatar || '👨‍💼'}</span>
                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: isSelected ? '#059669' : '#0F172A' }}>
                            {persona.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                            ID: <code style={{ color: '#059669', fontWeight: 700 }}>{persona.id}</code> • {persona.department}
                          </div>
                        </div>
                      </div>

                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '3px 9px',
                        borderRadius: '10px',
                        background: persona.roleId === 'ROLE_ADMIN' ? '#F3E8FF' : persona.roleId === 'ROLE_MANAGER' ? '#EFF6FF' : '#ECFDF5',
                        color: persona.roleId === 'ROLE_ADMIN' ? '#7C3AED' : persona.roleId === 'ROLE_MANAGER' ? '#2563EB' : '#059669',
                        border: persona.roleId === 'ROLE_ADMIN' ? '1px solid #DDD6FE' : persona.roleId === 'ROLE_MANAGER' ? '1px solid #BFDBFE' : '1px solid #A7F3D0'
                      }}>
                        {persona.roleName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Persona Summary Pill */}
            <div style={{
              background: '#F8FAFC',
              border: '1px solid #CBD5E1',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <User style={{ color: '#059669', width: '18px', height: '18px' }} />
                <span style={{ fontSize: '0.82rem', color: '#475569' }}>
                  Logging in as: <strong style={{ color: '#0F172A' }}>{selectedPersona.name}</strong> (<code style={{ color: '#2563EB', fontWeight: 700 }}>{selectedPersona.id}</code>)
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: '4px', border: '1px solid #A7F3D0' }}>
                {selectedPersona.roleName}
              </span>
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>
                <Lock style={{ width: '14px', height: '14px', color: '#059669' }} />
                Account Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter account password"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '0.95rem',
                  background: '#F8FAFC',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  color: '#0F172A'
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
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
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
              background: '#F8FAFC',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem'
            }}>
              <span style={{ fontSize: '2rem' }}>{selectedPersona.avatar || '👨‍💼'}</span>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>{selectedPersona.name}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{selectedPersona.email}</div>
                <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, marginTop: '2px' }}>Role: {selectedPersona.roleName} ({selectedPersona.id})</div>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>
                <KeyRound style={{ width: '14px', height: '14px', color: '#059669' }} />
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
                  background: '#F8FAFC',
                  border: '1.5px solid #059669',
                  borderRadius: '8px',
                  color: '#0F172A'
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
                  background: '#ECFDF5',
                  color: '#059669',
                  border: '1px solid #A7F3D0',
                  borderRadius: '6px',
                  fontWeight: 600,
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
                  background: '#F1F5F9',
                  color: '#64748B',
                  border: '1px solid #CBD5E1',
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
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}
            >
              Verify & Complete Sign In
              <UserCheck style={{ width: '16px', height: '16px' }} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
