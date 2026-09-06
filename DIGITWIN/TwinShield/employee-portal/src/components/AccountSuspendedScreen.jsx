import React from 'react';
import { UserX, ShieldX } from 'lucide-react';

export const AccountSuspendedScreen = ({ currentUser }) => {
  return (
    <div className="animate-fade-in" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F3E8FF 0%, #F8FAFC 100%)',
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
        border: '2px solid #C084FC',
        boxShadow: '0 20px 50px rgba(147, 51, 234, 0.12)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '76px',
          height: '76px',
          background: '#F3E8FF',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto',
          border: '2px solid #9333EA'
        }}>
          <UserX style={{ width: '38px', height: '38px', color: '#7C3AED' }} />
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
          Account Permanently Suspended
        </h1>

        <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '1.75rem', lineHeight: '1.6' }}>
          The employee account for <strong style={{ color: '#7C3AED' }}>{currentUser?.name} ({currentUser?.id})</strong> has been permanently disabled in the zero-trust identity directory by the Security Administrator.
        </p>

        <div style={{
          background: '#F3E8FF',
          padding: '1rem 1.25rem',
          borderRadius: '8px',
          border: '1px solid #DDD6FE',
          color: '#6B21A8',
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
