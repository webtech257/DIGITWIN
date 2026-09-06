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
      <div className="glass-card" style={{ padding: '2.5rem', border: '1.5px solid #FCA5A5', background: '#FFFFFF' }}>
        
        <div style={{
          width: '72px',
          height: '72px',
          background: '#FEF2F2',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto',
          border: '2px solid #FCA5A5'
        }}>
          <ShieldAlert style={{ width: '38px', height: '38px', color: '#DC2626' }} />
        </div>

        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
          Access Restricted by Policy Engine
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '1.5rem' }}>
          Your role (<strong style={{ color: '#DC2626' }}>{currentUser?.roleName}</strong>) does not hold permission <code>{deniedDetails?.requiredPermission}</code> required to access this resource.
        </p>

        <div style={{
          background: '#FEF2F2',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid #FCA5A5',
          marginBottom: '1.5rem',
          textAlign: 'left',
          fontSize: '0.8rem',
          color: '#334155'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#D97706', fontWeight: 600, marginBottom: '0.5rem' }}>
            <AlertTriangle style={{ width: '15px', height: '15px' }} /> Security Event Dispatch Status
          </div>
          <div>Resource Endpoint: <code style={{ color: '#2563EB', fontWeight: 600 }}>{deniedDetails?.resourceId}</code></div>
          <div>Action Requested: <strong style={{ color: '#0F172A' }}>{deniedDetails?.actionName}</strong></div>
          <div style={{ color: '#059669', marginTop: '0.4rem', fontWeight: 600 }}>✓ Policy violation logged to Security Control Plane risk engine</div>
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
            gap: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
          }}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          Return to Dashboard
        </button>

      </div>
    </div>
  );
};
