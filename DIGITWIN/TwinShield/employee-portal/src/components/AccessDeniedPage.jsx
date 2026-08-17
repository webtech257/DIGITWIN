import React, { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft, AlertTriangle } from 'lucide-react';

export const AccessDeniedPage = ({ deniedDetails, onBack }) => {
  const { currentUser, session, recordActivityToBackend } = useAuth();
  const hasRecordedRef = useRef(false);

  useEffect(() => {
    if (deniedDetails && session && currentUser && !hasRecordedRef.current) {
      hasRecordedRef.current = true;
      // Record Policy Violation event to Spring Boot Backend
      recordActivityToBackend(
        deniedDetails.resourceId || '/api/v1/unauthorized',
        'POLICY_VIOLATION_ATTEMPT',
        1,
        true
      );
    }
  }, [deniedDetails, session, currentUser, recordActivityToBackend]);


  return (
    <div className="animate-fade-in" style={{ padding: '3rem 1.5rem', maxWidth: '650px', margin: '0 auto', textAlign: 'center' }}>
      <div className="glass-card" style={{ padding: '2.5rem', border: '1.5px solid rgba(239, 68, 68, 0.4)' }}>
        
        <div style={{
          width: '72px',
          height: '72px',
          background: 'rgba(239, 68, 68, 0.15)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto',
          border: '2px solid rgba(239, 68, 68, 0.4)'
        }}>
          <ShieldAlert style={{ width: '38px', height: '38px', color: '#EF4444' }} />
        </div>

        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.5rem' }}>
          Access Restricted by Policy Engine
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#94A3B8', marginBottom: '1.5rem' }}>
          Your role (<strong style={{ color: '#F87171' }}>{currentUser?.roleName}</strong>) does not hold permission <code>{deniedDetails?.requiredPermission}</code> required to access this resource.
        </p>

        <div style={{
          background: '#0F172A',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid #334155',
          marginBottom: '1.5rem',
          textAlign: 'left',
          fontSize: '0.8rem',
          color: '#CBD5E1'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#F59E0B', fontWeight: 600, marginBottom: '0.5rem' }}>
            <AlertTriangle style={{ width: '15px', height: '15px' }} /> Security Event Dispatch Status
          </div>
          <div>Resource Endpoint: <code style={{ color: '#60A5FA' }}>{deniedDetails?.resourceId}</code></div>
          <div>Action Requested: <strong style={{ color: '#F8FAFC' }}>{deniedDetails?.actionName}</strong></div>
          <div style={{ color: '#10B981', marginTop: '0.4rem' }}>✓ Policy violation logged to Security Control Plane risk engine</div>
        </div>

        <button
          onClick={onBack}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #10B981, #059669)',
            color: '#FFFFFF',
            fontWeight: 600,
            borderRadius: '8px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          Return to Dashboard
        </button>

      </div>
    </div>
  );
};
