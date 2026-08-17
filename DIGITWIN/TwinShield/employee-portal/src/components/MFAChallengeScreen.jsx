import React, { useState } from 'react';
import { KeyRound, ShieldCheck } from 'lucide-react';

export const MFAChallengeScreen = ({ currentUser, onCompleteMfa }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passcode || passcode.length < 6) {
      setError('Please enter a valid 6-digit MFA passcode.');
      return;
    }
    setError('');
    await onCompleteMfa(passcode);
  };

  return (
    <div className="animate-fade-in" style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at center, #1E1B10 0%, #0F0E0A 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div className="glass-card" style={{
        maxWidth: '560px',
        width: '100%',
        padding: '3rem 2.5rem',
        border: '2px solid rgba(245, 158, 11, 0.6)',
        boxShadow: '0 0 40px rgba(245, 158, 11, 0.2)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '76px',
          height: '76px',
          background: 'rgba(245, 158, 11, 0.15)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto',
          border: '2px solid #F59E0B'
        }}>
          <KeyRound style={{ width: '38px', height: '38px', color: '#FBBF24' }} />
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.5rem' }}>
          Mandatory Step-Up MFA Challenge
        </h1>

        <p style={{ fontSize: '0.9rem', color: '#94A3B8', marginBottom: '1.75rem', lineHeight: '1.5' }}>
          SOC Security Administrator requested mandatory re-authentication verification for <strong style={{ color: '#FBBF24' }}>{currentUser?.name}</strong>.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', color: '#CBD5E1', fontWeight: 600, marginBottom: '0.5rem' }}>
              6-Digit Authenticator Passcode
            </label>
            <input
              type="text"
              maxLength={6}
              placeholder="e.g. 123456"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                fontSize: '1.25rem',
                fontFamily: 'monospace',
                letterSpacing: '6px',
                textAlign: 'center',
                background: '#0F172A',
                border: '1.5px solid #334155',
                borderRadius: '8px',
                color: '#F8FAFC'
              }}
            />
            {error && <div style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '0.4rem' }}>{error}</div>}
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.85rem',
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              color: '#FFFFFF',
              fontWeight: 700,
              borderRadius: '8px',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <ShieldCheck style={{ width: '18px', height: '18px' }} />
            Verify MFA Passcode & Restore Session
          </button>
        </form>

        <button
          onClick={() => onCompleteMfa('123456')}
          style={{
            marginTop: '1.25rem',
            background: 'transparent',
            border: 'none',
            color: '#60A5FA',
            fontSize: '0.8rem',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          Auto-fill Demo Passcode (123456)
        </button>
      </div>
    </div>
  );
};
