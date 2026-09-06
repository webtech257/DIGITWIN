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
      background: 'linear-gradient(135deg, #FEF3C7 0%, #F8FAFC 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div className="glass-card" style={{
        maxWidth: '560px',
        width: '100%',
        padding: '3rem 2.5rem',
        background: '#FFFFFF',
        border: '2px solid #FDE68A',
        boxShadow: '0 20px 50px rgba(245, 158, 11, 0.12)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '76px',
          height: '76px',
          background: '#FEF3C7',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto',
          border: '2px solid #D97706'
        }}>
          <KeyRound style={{ width: '38px', height: '38px', color: '#D97706' }} />
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
          Mandatory Step-Up MFA Challenge
        </h1>

        <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '1.75rem', lineHeight: '1.5' }}>
          SOC Security Administrator requested mandatory re-authentication verification for <strong style={{ color: '#D97706' }}>{currentUser?.name}</strong>.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', color: '#475569', fontWeight: 600, marginBottom: '0.5rem' }}>
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
                background: '#F8FAFC',
                border: '1.5.px solid #CBD5E1',
                borderRadius: '8px',
                color: '#0F172A'
              }}
            />
            {error && <div style={{ color: '#DC2626', fontSize: '0.8rem', marginTop: '0.4rem' }}>{error}</div>}
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
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
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
            color: '#2563EB',
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
