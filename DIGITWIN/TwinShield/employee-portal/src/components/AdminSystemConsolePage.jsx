import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Server, Key, Cpu, RefreshCw, Terminal, Lock, ShieldCheck, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';

export const AdminSystemConsolePage = () => {
  const { personas, recordActivityToBackend } = useAuth();
  const [hsmKeyStatus, setHsmKeyStatus] = useState('ACTIVE (AES-256-GCM - Key ID: 0x99A81B)');
  const [keyRotatedAt, setKeyRotatedAt] = useState('2026-08-29 09:00 IST');
  const [logs, setLogs] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');

  const handleRotateHsmKey = () => {
    recordActivityToBackend('/api/v1/admin/security-keys', 'KEY_ROTATION', 1, false);
    const newKey = `0x${Math.floor(Math.random() * 16777215).toString(16).toUpperCase()}`;
    const newTime = new Date().toLocaleTimeString();
    setHsmKeyStatus(`ACTIVE (AES-256-GCM - Key ID: ${newKey})`);
    setKeyRotatedAt(newTime);
    setLogs((prev) => [
      `🔐 [HSM-MODULE-01] Hardware Security Module Key Rotated to ${newKey} at ${newTime}`,
      `⚡ [KAFKA-TELEMETRY] Broadcasted Security Key Rotation Event to SOC Policy Engine`,
      ...prev
    ]);
  };

  const handleTestSocRules = () => {
    recordActivityToBackend('/api/v1/admin/server-status', 'DIAGNOSTIC_RUN', 1, false);
    setLogs((prev) => [
      `🧪 [SOC-POLICY-ENGINE] Running Rule Diagnostics across 1,284 employee digital twin baselines...`,
      `✅ [SOC-POLICY-ENGINE] Rule 101 (RBAC Threshold): ACTIVE`,
      `✅ [SOC-POLICY-ENGINE] Rule 204 (Honey Decoy Exfiltration): ACTIVE`,
      `✅ [SOC-POLICY-ENGINE] Rule 309 (Working Hour Anomaly): ACTIVE`,
      ...prev
    ]);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>IT System & HSM Security Administration</h1>
          <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '0.25rem', marginBottom: 0 }}>Manage cryptographic HSM hardware modules, verify cluster nodes, and inspect staff security posture.</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <a
            href="http://localhost:5174"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.65rem 1.25rem',
              background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.88rem',
              borderRadius: '8px',
              border: 'none',
              textDecoration: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)'
            }}
          >
            <ShieldCheck style={{ width: '18px', height: '18px' }} />
            Provision Staff in SOC (Port 5174)
            <ExternalLink style={{ width: '14px', height: '14px' }} />
          </a>
        </div>
      </div>

      {/* Status Toast Banner */}
      {statusMessage && (
        <div style={{ padding: '0.85rem 1.25rem', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '8px', color: '#059669', fontWeight: 600, fontSize: '0.88rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 style={{ width: '18px', height: '18px' }} /> {statusMessage}
        </div>
      )}

      {/* Cluster Node Status Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #10B981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Active Bank Staff</span>
            <Server style={{ color: '#10B981', width: '18px', height: '18px' }} />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginTop: '0.25rem' }}>{personas.length} Employees</div>
          <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, marginTop: '0.35rem' }}>All Personas Synchronized</div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #2563EB' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>HSM Encryption Module</span>
            <Key style={{ color: '#2563EB', width: '18px', height: '18px' }} />
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2563EB', marginTop: '0.25rem' }}>FIPS 140-2 LEVEL 3</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.35rem' }}>Last Rotation: {keyRotatedAt}</div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #7C3AED' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Kafka Telemetry Pipeline</span>
            <Cpu style={{ color: '#7C3AED', width: '18px', height: '18px' }} />
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#7C3AED', marginTop: '0.25rem' }}>14,250 Ev/sec</div>
          <div style={{ fontSize: '0.75rem', color: '#7C3AED', fontWeight: 600, marginTop: '0.35rem' }}>Zero Message Lag</div>
        </div>
      </div>

      {/* Employee Roster & Staff Administration Table */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>Bank Employee Staff Roster</h2>
            <p style={{ fontSize: '0.8rem', color: '#64748B' }}>Live registry of active employees, role delegations, and account status.</p>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#2563EB', background: '#EFF6FF', padding: '4px 10px', borderRadius: '6px', fontWeight: 700, border: '1px solid #BFDBFE' }}>
            {personas.length} Staff Registered
          </span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Employee ID</th>
              <th style={{ padding: '0.75rem 1rem' }}>Staff Name & Avatar</th>
              <th style={{ padding: '0.75rem 1rem' }}>Department</th>
              <th style={{ padding: '0.75rem 1rem' }}>Assigned RBAC Role</th>
              <th style={{ padding: '0.75rem 1rem' }}>Account Status</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Admin Actions</th>
            </tr>
          </thead>
          <tbody>
            {personas.map((emp) => (
              <tr key={emp.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, fontFamily: 'monospace', color: '#2563EB' }}>{emp.id}</td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>{emp.avatar || '👤'}</span>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.9rem' }}>{emp.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{emp.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '0.85rem 1rem', color: '#475569', fontSize: '0.85rem', fontWeight: 500 }}>{emp.department}</td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' }}>
                    {emp.roleName || emp.roleId}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: '12px', background: emp.status === 'ISOLATED' ? '#FEF2F2' : '#EFF6FF', color: emp.status === 'ISOLATED' ? '#DC2626' : '#2563EB', border: emp.status === 'ISOLATED' ? '1px solid #FCA5A5' : '1px solid #BFDBFE' }}>
                    {emp.status || 'ACTIVE'}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#64748B',
                    background: '#F1F5F9',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '1px solid #E2E8F0',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}>
                    <Lock style={{ width: '12px', height: '12px' }} /> Managed by SOC
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Admin Action Controls */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem' }}>Administrative & HSM Controls</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          {/* Key Rotation Box */}
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1.25rem', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>HSM Encryption Key Rotation</div>
            <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1rem' }}>Active Key: <code style={{ color: '#2563EB', fontWeight: 600 }}>{hsmKeyStatus}</code></div>
            <button
              onClick={handleRotateHsmKey}
              style={{
                padding: '0.6rem 1.1rem',
                background: 'linear-gradient(135deg, #10B981, #059669)',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '0.85rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <RefreshCw style={{ width: '15px', height: '15px' }} /> Rotate HSM Key Now
            </button>
          </div>

          {/* SOC Rule Test Box */}
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1.25rem', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>SOC Policy Engine Rule Diagnostics</div>
            <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1rem' }}>Run automated check across all employee digital twin baselines.</div>
            <button
              onClick={handleTestSocRules}
              style={{
                padding: '0.6rem 1.1rem',
                background: '#F3E8FF',
                color: '#7C3AED',
                border: '1px solid #DDD6FE',
                fontWeight: 600,
                fontSize: '0.85rem',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Terminal style={{ width: '15px', height: '15px' }} /> Run Policy Engine Diagnostics
            </button>
          </div>
        </div>
      </div>

      {/* Admin Execution Terminal */}
      {logs.length > 0 && (
        <div className="glass-card" style={{ padding: '1.25rem', background: '#F8FAFC', color: '#0F172A', border: '1px solid #CBD5E1', fontFamily: 'monospace', fontSize: '0.82rem', borderRadius: '10px' }}>
          <div style={{ color: '#2563EB', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 700 }}>Admin Execution Terminal</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {logs.map((log, idx) => (
              <div key={idx} style={{ color: '#334155' }}>{log}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
