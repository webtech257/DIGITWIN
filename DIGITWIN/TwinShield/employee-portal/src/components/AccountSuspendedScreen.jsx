import React from 'react';
import { UserX, ShieldX } from 'lucide-react';

export const AccountSuspendedScreen = ({ currentUser }) => {
  return (
    <div className="animate-fade-in" style={{
      minHeight: '100vh',
      background: '#09050A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div className="glass-card" style={{
        maxWidth: '560px',
        width: '100%',
        padding: '3rem 2.5rem',
        border: '2px solid rgba(147, 51, 234, 0.6)',
        boxShadow: '0 0 40px rgba(147, 51, 234, 0.2)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '76px',
          height: '76px',
          background: 'rgba(147, 51, 234, 0.15)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto',
          border: '2px solid #9333EA'
        }}>
          <UserX style={{ width: '38px', height: '38px', color: '#A855F7' }} />
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.5rem' }}>
          Account Permanently Suspended
        </h1>

        <p style={{ fontSize: '0.9rem', color: '#94A3B8', marginBottom: '1.75rem', lineHeight: '1.6' }}>
          The employee account for <strong style={{ color: '#C084FC' }}>{currentUser?.name} ({currentUser?.id})</strong> has been permanently disabled in the zero-trust identity directory by the Security Administrator.
        </p>

        <div style={{
          background: '#120A1C',
          padding: '1rem 1.25rem',
          borderRadius: '8px',
          border: '1px solid #3B0764',
          color: '#E9D5FF',
          fontSize: '0.82rem',
          textAlign: 'left'
        }}>
          <div><strong>Reason:</strong> Malicious Insider Threat & Data Exfiltration Activity</div>
          <div style={{ marginTop: '0.4rem' }}><strong>Status:</strong> DELETED / REVOKED IN IDENTITY PROVIDER</div>
        </div>
      </div>
    </div>
  );
};
