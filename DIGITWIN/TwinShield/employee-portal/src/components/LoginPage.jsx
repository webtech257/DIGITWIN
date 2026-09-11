import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, KeyRound, ArrowRight, UserCheck, AlertCircle, User, MapPin, RefreshCw, Smartphone, CheckCircle, Bell, Copy, Check } from 'lucide-react';

export const LoginPage = ({ onLoginSuccess }) => {
  const { loginUser, personas, liveGeo } = useAuth();
  const [step, setStep] = useState(1); // Step 1: Password, Step 2: MFA OTP
  const [selectedPersonaId, setSelectedPersonaId] = useState('EMP1024');
  const [password, setPassword] = useState('TwinShield@2026');
  const [error, setError] = useState('');

  // Authentic Real-Time MFA State
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const inputRefs = useRef([]);

  const employeeList = (personas && personas.length > 0) ? personas : [];
  const selectedPersona = employeeList.find((p) => p.id === selectedPersonaId) || employeeList[0] || {
    id: 'EMP1024',
    name: 'Malavika',
    email: 'malavika@twinshield-bank.internal',
    avatar: '👩‍💼',
    roleName: 'Customer Service Representative',
    department: 'Retail Banking'
  };

  const handleSelectPersona = (id) => {
    setSelectedPersonaId(id);
    setError('');
  };

  const generateAndDispatchOtp = () => {
    const freshCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(freshCode);
    setOtpDigits(['', '', '', '', '', '']);
    setTimerSeconds(60);
    setCanResend(false);
    setError('');
    setCopied(false);
    
    // Auto-focus first digit input box
    setTimeout(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, 120);
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter your account password.');
      return;
    }
    setError('');
    setStep(2);
    generateAndDispatchOtp();
  };

  // Real-time 60s countdown timer
  useEffect(() => {
    if (step !== 2) return;
    if (timerSeconds <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        if (prev <= 45) {
          setCanResend(true);
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step, timerSeconds]);

  // Handle individual OTP digit change
  const handleDigitChange = (index, value) => {
    const val = value.replace(/\D/g, '');
    const nextDigits = [...otpDigits];
    
    if (!val) {
      nextDigits[index] = '';
      setOtpDigits(nextDigits);
      return;
    }

    nextDigits[index] = val.slice(-1);
    setOtpDigits(nextDigits);

    // Auto-advance to next box
    if (index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace keyboard navigation
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle clipboard paste (e.g. pasting "749102")
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim().replace(/\D/g, '');
    if (pasteData.length >= 6) {
      const digits = pasteData.slice(0, 6).split('');
      setOtpDigits(digits);
      if (inputRefs.current[5]) {
        inputRefs.current[5].focus();
      }
    }
  };

  // Copy code helper from simulated SMS notification
  const handleCopyCode = () => {
    if (!generatedOtp) return;
    navigator.clipboard.writeText(generatedOtp);
    setCopied(true);
    // Also auto-populate digits for convenience
    setOtpDigits(generatedOtp.split(''));
    setTimeout(() => setCopied(false), 3000);
  };

  // Submit Step 2: Real OTP validation against generated code
  const handleStep2Submit = (e) => {
    e.preventDefault();
    const enteredCode = otpDigits.join('');

    if (enteredCode.length < 6) {
      setError('Please enter the complete 6-digit verification code.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    if (timerSeconds <= 0) {
      setError('This verification code has expired. Please click "Resend Code" to generate a new one.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    if (enteredCode !== generatedOtp) {
      setError('Invalid verification passcode. Please check the code sent to your registered device.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      loginUser(selectedPersonaId);
      if (onLoginSuccess) onLoginSuccess();
    }, 400);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
      padding: '1.5rem',
      position: 'relative'
    }}>
      {/* Floating Simulated Bank SMS / Authenticator Toast (Real-time Simulation) */}
      {step === 2 && generatedOtp && (
        <div className="animate-fade-in" style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          maxWidth: '420px',
          width: '90%',
          background: 'rgba(15, 23, 42, 0.96)',
          backdropFilter: 'blur(16px)',
          border: '1.5px solid #334155',
          borderRadius: '16px',
          padding: '1rem 1.25rem',
          color: '#FFFFFF',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)',
          zIndex: 9999
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981', fontSize: '0.8rem', fontWeight: 800 }}>
              <Smartphone style={{ width: '16px', height: '16px' }} />
              <span>SMS SECURITY CODE DISPATCHED</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontFamily: 'monospace' }}>Just Now</span>
          </div>

          <p style={{ fontSize: '0.82rem', color: '#E2E8F0', margin: '0 0 0.75rem 0', lineHeight: 1.45 }}>
            <strong>[TwinShield Bank]</strong> Your 6-digit identity verification passcode is:
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '10px',
            padding: '0.6rem 1rem'
          }}>
            <span style={{ fontSize: '1.45rem', fontWeight: 900, letterSpacing: '6px', color: '#34D399', fontFamily: 'monospace' }}>
              {generatedOtp}
            </span>

            <button
              type="button"
              onClick={handleCopyCode}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '5px 10px',
                borderRadius: '6px',
                background: copied ? '#059669' : '#1E293B',
                color: '#FFFFFF',
                border: '1px solid #475569',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {copied ? <Check style={{ width: '13px', height: '13px' }} /> : <Copy style={{ width: '13px', height: '13px' }} />}
              {copied ? 'Filled!' : 'Fill Code'}
            </button>
          </div>

          <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '0.65rem' }}>
            📲 Sent to registered mobile: +91 98401 ••••• and email: {selectedPersona.email}
          </div>
        </div>
      )}

      {/* Main Login Card */}
      <div className="glass-card animate-fade-in" style={{
        maxWidth: '580px',
        width: '100%',
        padding: '2.25rem',
        background: '#FFFFFF',
        border: '1.5px solid #E2E8F0',
        borderRadius: '20px',
        boxShadow: '0 20px 45px rgba(15, 23, 42, 0.09)'
      }}>
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'linear-gradient(135deg, #10B981, #059669)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem auto',
            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
          }}>
            <Shield style={{ width: '30px', height: '30px', color: '#FFFFFF' }} />
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.2rem' }}>Apex Financial Bank</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B' }}>Zero-Trust Identity & Access Verification Portal</p>
        </div>

        {/* Clean Automated Network Telemetry Badge (No Manual Calibration Controls) */}
        <div style={{
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '10px',
          padding: '0.65rem 0.9rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin style={{ width: '16px', height: '16px', color: '#059669' }} />
            <span style={{ fontSize: '0.78rem', color: '#475569' }}>
              Connected Network: <strong style={{ color: '#0F172A' }}>{liveGeo?.city || 'Chennai, India'}</strong>
            </span>
          </div>
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '12px',
            background: '#ECFDF5',
            color: '#059669',
            border: '1px solid #A7F3D0',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <CheckCircle style={{ width: '12px', height: '12px' }} /> Automated Zero-Trust Active
          </span>
        </div>

        {/* Step Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', fontWeight: 700, color: step === 1 ? '#059669' : '#64748B' }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: step === 1 ? '#059669' : '#E2E8F0', color: step === 1 ? '#FFF' : '#64748B', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>1</span>
            Account Authentication
          </div>
          <div style={{ width: '30px', height: '1px', background: '#CBD5E1' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', fontWeight: 700, color: step === 2 ? '#059669' : '#64748B' }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: step === 2 ? '#059669' : '#E2E8F0', color: step === 2 ? '#FFF' : '#64748B', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>2</span>
            Real-Time Multi-Factor (MFA)
          </div>
        </div>

        {error && (
          <div className="animate-fade-in" style={{
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
            <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
            {error}
          </div>
        )}

        {/* STEP 1: Persona & Password */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Select Target Employee Account
                </label>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#059669' }}>
                  {employeeList.length} Accounts Synchronized
                </span>
              </div>

              {/* Persona Cards List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '220px', overflowY: 'auto', paddingRight: '4px', marginBottom: '1rem' }}>
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
                        borderRadius: '10px',
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
                          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: isSelected ? '#059669' : '#0F172A' }}>
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
                  Selected User: <strong style={{ color: '#0F172A' }}>{selectedPersona.name}</strong> (<code style={{ color: '#2563EB', fontWeight: 700 }}>{selectedPersona.id}</code>)
                </span>
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: '4px', border: '1px solid #A7F3D0' }}>
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
                fontWeight: 700,
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
              Continue to Multi-Factor Verification
              <ArrowRight style={{ width: '16px', height: '16px' }} />
            </button>
          </form>
        )}

        {/* STEP 2: Real-Time Multi-Factor Authentication (MFA) */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} className={isShaking ? 'animate-shake' : ''}>
            {/* Target Persona Card */}
            <div style={{
              background: '#F8FAFC',
              padding: '0.9rem 1.1rem',
              borderRadius: '10px',
              border: '1px solid #E2E8F0',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.8rem' }}>{selectedPersona.avatar || '👨‍💼'}</span>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>{selectedPersona.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{selectedPersona.email}</div>
                </div>
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: '4px', border: '1px solid #A7F3D0' }}>
                {selectedPersona.roleName}
              </span>
            </div>

            {/* Instruction Banner */}
            <div style={{
              background: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: '10px',
              padding: '0.85rem 1rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.65rem'
            }}>
              <Bell style={{ width: '18px', height: '18px', color: '#2563EB', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.8rem', color: '#1E40AF', lineHeight: 1.45 }}>
                A 6-digit cryptographic security code was dispatched to your registered banking device. Enter the code below to complete sign in.
              </div>
            </div>

            {/* 6 Individual Auto-Advancing Digit Input Boxes */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <KeyRound style={{ width: '14px', height: '14px', color: '#059669' }} />
                  Enter 6-Digit MFA Passcode
                </label>
                
                {/* 60-Second Real-Time Countdown Timer */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: timerSeconds > 10 ? '#059669' : '#DC2626'
                }}>
                  <span>Code expires in:</span>
                  <span style={{
                    fontFamily: 'monospace',
                    fontSize: '0.88rem',
                    background: timerSeconds > 10 ? '#ECFDF5' : '#FEF2F2',
                    padding: '2px 7px',
                    borderRadius: '4px',
                    border: `1px solid ${timerSeconds > 10 ? '#A7F3D0' : '#FCA5A5'}`
                  }}>
                    {timerSeconds}s
                  </span>
                </div>
              </div>

              {/* Digit Boxes */}
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }} onPaste={handlePaste}>
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    style={{
                      width: '58px',
                      height: '62px',
                      textAlign: 'center',
                      fontSize: '1.6rem',
                      fontWeight: 800,
                      fontFamily: 'monospace',
                      borderRadius: '10px',
                      border: digit ? '2px solid #059669' : '1.5px solid #CBD5E1',
                      background: digit ? '#F0FDF4' : '#FFFFFF',
                      color: '#0F172A',
                      outline: 'none',
                      boxShadow: digit ? '0 0 0 3px rgba(16, 185, 129, 0.15)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Resend Code & Back Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  padding: '0.55rem 1rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  background: '#F1F5F9',
                  color: '#475569',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                ← Back
              </button>

              <button
                type="button"
                disabled={!canResend}
                onClick={generateAndDispatchOtp}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.55rem 1rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  background: canResend ? '#ECFDF5' : '#F8FAFC',
                  color: canResend ? '#059669' : '#94A3B8',
                  border: `1px solid ${canResend ? '#A7F3D0' : '#E2E8F0'}`,
                  borderRadius: '6px',
                  cursor: canResend ? 'pointer' : 'not-allowed'
                }}
              >
                <RefreshCw style={{ width: '13px', height: '13px', animation: canResend ? 'none' : 'spin 2s linear infinite' }} />
                {canResend ? 'Resend Security Code' : `Resend available in ${Math.max(0, timerSeconds - 45)}s`}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '0.85rem',
                background: 'linear-gradient(135deg, #10B981, #059669)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.95rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                border: 'none',
                cursor: isSubmitting ? 'wait' : 'pointer',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}
            >
              <UserCheck style={{ width: '18px', height: '18px' }} />
              {isSubmitting ? 'Authenticating Zero-Trust Session...' : 'Verify Passcode & Enter Bank'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
