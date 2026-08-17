import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, ShieldCheck, Clock, Monitor, Key, Check } from 'lucide-react';

export const ProfilePage = () => {
  const { currentUser, session } = useAuth();

  if (!currentUser) return null;

  return (
    <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F8FAFC' }}>Employee Identity Profile</h1>
        <p style={{ fontSize: '0.875rem', color: '#94A3B8' }}>Synthetic banking employee credentials & behavioral digital twin baseline parameters.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        
        {/* Left Column: Avatar Card */}
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem', background: '#0F172A', width: '96px', height: '96px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #334155' }}>
            {currentUser.avatar}
          </div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#F8FAFC' }}>{currentUser.name}</h2>
          <p style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: 600, marginTop: '0.25rem' }}>{currentUser.roleName}</p>
          
          <div style={{ width: '100%', borderTop: '1px solid #334155', marginTop: '1.5rem', paddingTop: '1rem', textAlignment: 'left', textAlign: 'left' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Employee ID</div>
            <div style={{ fontSize: '0.9rem', color: '#F8FAFC', fontWeight: 600, marginBottom: '0.75rem' }}>{currentUser.id}</div>

            <div style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Department</div>
            <div style={{ fontSize: '0.9rem', color: '#F8FAFC', fontWeight: 600, marginBottom: '0.75rem' }}>{currentUser.department}</div>

            <div style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Email Address</div>
            <div style={{ fontSize: '0.85rem', color: '#60A5FA' }}>{currentUser.email}</div>
          </div>
        </div>

        {/* Right Column: RBAC & Digital Twin Baseline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* RBAC Permissions Box */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Key style={{ color: '#10B981', width: '20px', height: '20px' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#F8FAFC' }}>Assigned RBAC Permissions</h3>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              {currentUser.permissions.map((perm) => (
                <div key={perm} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.8rem',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '6px',
                  color: '#34D399',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}>
                  <Check style={{ width: '14px', height: '14px' }} />
                  <code>{perm}</code>
                </div>
              ))}
            </div>
          </div>

          {/* Behavioral Digital Twin Baseline Box */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Clock style={{ color: '#3B82F6', width: '20px', height: '20px' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#F8FAFC' }}>Behavioral Digital Twin Baseline</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: '#0F172A', padding: '0.85rem', borderRadius: '8px', border: '1px solid #334155' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Working Hours Baseline</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#F8FAFC', marginTop: '0.25rem' }}>
                  {currentUser.normalStartHour} – {currentUser.normalEndHour} IST
                </div>
              </div>

              <div style={{ background: '#0F172A', padding: '0.85rem', borderRadius: '8px', border: '1px solid #334155' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Recognized Device</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#60A5FA', marginTop: '0.25rem' }}>
                  BANK-PC-{currentUser.id}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
