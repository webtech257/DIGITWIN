import React from 'react';
import { useSOC } from '../context/SOCContext';
import { AlertTriangle } from 'lucide-react';

export const IncidentInvestigationView = () => {
  const { employees, selectedEmployeeId } = useSOC();
  const emp = employees.find((e) => e.id === selectedEmployeeId) || employees[0];

  return (
    <div className="soc-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #1E293B', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <AlertTriangle style={{ color: '#F59E0B', width: '22px', height: '22px' }} />
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC' }}>Incident Investigation Case File #INC-2026-001</h2>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Subject: <strong style={{ color: '#F8FAFC' }}>{emp.name}</strong> (<code style={{ color: '#60A5FA' }}>{emp.id}</code>)</p>
          </div>
        </div>

        <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.2)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
          {emp.status}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        {/* Left Column: Forensic Evidence Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ background: '#0B132B', padding: '1.25rem', borderRadius: '8px', border: '1px solid #1E293B' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#F8FAFC', marginBottom: '1rem' }}>Forensic Telemetry Evidence Logs</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ padding: '0.75rem', background: '#0F172A', borderRadius: '6px', borderLeft: '3px solid #F59E0B', fontSize: '0.82rem' }}>
                <span className="font-mono" style={{ color: '#64748B' }}>23:42:15 IST</span> — <strong>Unusual Off-Hours Login</strong> from <code style={{ color: '#F87171' }}>{emp.location}</code> using device <code style={{ color: '#F87171' }}>{emp.device}</code> (Baseline: 09:00 - 18:00 IST).
              </div>

              <div style={{ padding: '0.75rem', background: '#0F172A', borderRadius: '6px', borderLeft: '3px solid #8B5CF6', fontSize: '0.82rem' }}>
                <span className="font-mono" style={{ color: '#64748B' }}>23:43:08 IST</span> — Accessed <code style={{ color: '#FBBF24' }}>/api/v1/vip/customers</code>.
              </div>

              <div style={{ padding: '0.75rem', background: '#0F172A', borderRadius: '6px', borderLeft: '3px solid #EF4444', fontSize: '0.82rem' }}>
                <span className="font-mono" style={{ color: '#64748B' }}>23:44:20 IST</span> — <strong>Role Violation Attempt</strong>: Customer Service Rep attempted Manager Audit Report.
              </div>

              <div style={{ padding: '0.75rem', background: '#0F172A', borderRadius: '6px', borderLeft: '3px solid #EF4444', fontSize: '0.82rem' }}>
                <span className="font-mono" style={{ color: '#64748B' }}>23:45:50 IST</span> — Bulk customer query executed (<strong>300 records</strong> fetched in single API request).
              </div>

              <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.15)', borderRadius: '6px', borderLeft: '3px solid #EF4444', fontSize: '0.82rem', color: '#F87171', fontWeight: 600 }}>
                <span className="font-mono">23:47:00 IST</span> — AUTOMATED SESSION ISOLATION EXECUTED: Composite risk score crossed 95% threshold (97.6%).
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Explainable AI (XAI) SHAP Feature Importance Breakdown */}
        <div style={{ background: '#0B132B', padding: '1.25rem', borderRadius: '8px', border: '1px solid #1E293B' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#F8FAFC' }}>Explainable AI (XAI) SHAP Weights</h3>
            <span style={{ fontSize: '0.65rem', background: 'rgba(59, 130, 246, 0.2)', color: '#60A5FA', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>LIME / SHAP MODEL</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', fontSize: '0.82rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ color: '#CBD5E1' }}>Inter-arrival Request Entropy</span>
                <strong style={{ color: '#EF4444' }}>+34.0%</strong>
              </div>
              <div style={{ width: '100%', background: '#1E293B', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                <div style={{ width: '34%', background: '#EF4444', height: '100%' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ color: '#CBD5E1' }}>Sensitive Table Blast Radius</span>
                <strong style={{ color: '#F59E0B' }}>+28.0%</strong>
              </div>
              <div style={{ width: '100%', background: '#1E293B', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                <div style={{ width: '28%', background: '#F59E0B', height: '100%' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ color: '#CBD5E1' }}>Geolocation Divergence</span>
                <strong style={{ color: '#3B82F6' }}>+18.0%</strong>
              </div>
              <div style={{ width: '100%', background: '#1E293B', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                <div style={{ width: '18%', background: '#3B82F6', height: '100%' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ color: '#CBD5E1' }}>Off-Hours Temporal Variance</span>
                <strong style={{ color: '#8B5CF6' }}>+12.0%</strong>
              </div>
              <div style={{ width: '100%', background: '#1E293B', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                <div style={{ width: '12%', background: '#8B5CF6', height: '100%' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ color: '#CBD5E1' }}>Role RBAC Boundary Breach</span>
                <strong style={{ color: '#10B981' }}>+8.0%</strong>
              </div>
              <div style={{ width: '100%', background: '#1E293B', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                <div style={{ width: '8%', background: '#10B981', height: '100%' }}></div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', pt: '0.5rem', fontWeight: 700, fontSize: '0.9rem', color: '#EF4444', borderTop: '1px solid #1E293B', marginTop: '0.25rem' }}>
              <span>Total Composite Risk Score</span>
              <span className="font-mono">97.6%</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
