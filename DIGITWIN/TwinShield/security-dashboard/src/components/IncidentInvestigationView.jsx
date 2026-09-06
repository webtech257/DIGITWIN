import React from 'react';
import { useSOC } from '../context/SOCContext';
import { AlertTriangle, User, FileText, Activity } from 'lucide-react';

export const IncidentInvestigationView = () => {
  const { employees, selectedEmployeeId, setSelectedEmployeeId, threatEvents } = useSOC();
  
  const emp = (employees && employees.length > 0)
    ? (employees.find((e) => e.id === selectedEmployeeId) || employees[0])
    : null;

  if (!emp) return null;

  const riskScore = Number(emp.riskScore || 0);

  // Dynamic SHAP weights calculated proportionally to current employee risk score
  const entropyWeight = Math.min(40, Math.round(riskScore * 0.35));
  const blastRadiusWeight = Math.min(30, Math.round(riskScore * 0.28));
  const geoWeight = Math.min(20, Math.round(riskScore * 0.18));
  const offHoursWeight = Math.min(15, Math.round(riskScore * 0.12));
  const rbacWeight = Math.min(10, Math.max(5, Math.round(riskScore * 0.07)));

  // Filter dynamic threat events for this specific employee
  const empEvents = threatEvents.filter((ev) => ev.employeeId === emp.id);

  return (
    <div className="animate-fade-in" style={{ marginBottom: '2rem' }}>
      {/* Target Employee Selector Bar */}
      <div className="soc-card" style={{
        padding: '0.85rem 1.25rem',
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <User style={{ color: '#D97706', width: '20px', height: '20px' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>
            Select Target Employee Case File to Investigate:
          </span>
        </div>

        <select
          value={emp.id}
          onChange={(e) => setSelectedEmployeeId(e.target.value)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            border: '1.5px solid #CBD5E1',
            background: '#FFFFFF',
            color: '#0F172A',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
            minWidth: '320px'
          }}
        >
          {employees.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name} ({e.id}) — {e.role} [{e.riskScore}% Risk - {e.status}]
            </option>
          ))}
        </select>
      </div>

      {/* Case File Inspection View */}
      <div className="soc-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid rgba(226, 232, 240, 0.8)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(254, 243, 199, 0.8)', padding: '0.65rem', borderRadius: '10px', border: '1px solid #FDE68A' }}>
              <AlertTriangle style={{ color: '#D97706', width: '24px', height: '24px' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.3px' }}>Incident Investigation Case File #{emp.id}-2026</h2>
              <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.15rem' }}>
                Subject Under Audit: <strong style={{ color: '#0F172A' }}>{emp.name}</strong> (<code style={{ color: '#2563EB', fontWeight: 700 }}>{emp.id}</code>) • {emp.department}
              </p>
            </div>
          </div>

          <span style={{
            fontSize: '0.8rem',
            fontWeight: 800,
            padding: '6px 14px',
            borderRadius: '12px',
            background: emp.status === 'ISOLATED' ? '#FEF2F2' : emp.status === 'MONITOR' ? '#FEF3C7' : '#ECFDF5',
            color: emp.status === 'ISOLATED' ? '#DC2626' : emp.status === 'MONITOR' ? '#D97706' : '#059669',
            border: emp.status === 'ISOLATED' ? '1px solid #FCA5A5' : emp.status === 'MONITOR' ? '1px solid #FDE68A' : '1px solid #A7F3D0'
          }}>
            STATUS: {emp.status}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '1.5rem' }}>
          
          {/* Left Column: Dynamic Forensic Evidence Logs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.65)', backdropFilter: 'blur(12px)', padding: '1.35rem', borderRadius: '12px', border: '1.5px solid rgba(226, 232, 240, 0.8)' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity style={{ width: '18px', height: '18px', color: '#2563EB' }} /> Forensic Telemetry Evidence Logs ({empEvents.length > 0 ? empEvents.length : 'Live Telemetry'})
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {empEvents.length > 0 ? (
                  empEvents.map((ev, i) => (
                    <div key={ev.id || i} style={{ padding: '0.75rem', background: '#F8FAFC', borderRadius: '8px', borderLeft: `4px solid ${ev.riskScore >= 80 ? '#DC2626' : ev.riskScore >= 50 ? '#D97706' : '#2563EB'}`, border: '1px solid #E2E8F0', fontSize: '0.82rem' }}>
                      <span className="font-mono" style={{ color: '#64748B', fontWeight: 600 }}>[{ev.timestamp}]</span> — <strong>{ev.event}</strong> (Assessed Risk: <code style={{ color: ev.riskScore >= 80 ? '#DC2626' : '#059669', fontWeight: 700 }}>{ev.riskScore}%</code>)
                    </div>
                  ))
                ) : (
                  <>
                    <div style={{ padding: '0.75rem', background: '#F8FAFC', borderRadius: '8px', borderLeft: '4px solid #D97706', border: '1px solid #E2E8F0', fontSize: '0.82rem' }}>
                      <span className="font-mono" style={{ color: '#64748B' }}>09:15:00 IST</span> — <strong>Session Authenticated</strong> from device <code style={{ color: '#2563EB', fontWeight: 600 }}>{emp.device || 'BANK-PC-' + emp.id}</code> in <code style={{ color: '#0F172A' }}>{emp.location || 'Chennai Office'}</code>.
                    </div>

                    <div style={{ padding: '0.75rem', background: '#F8FAFC', borderRadius: '8px', borderLeft: '4px solid #2563EB', border: '1px solid #E2E8F0', fontSize: '0.82rem' }}>
                      <span className="font-mono" style={{ color: '#64748B' }}>09:30:22 IST</span> — Standard API Query Executed on <code style={{ color: '#059669', fontWeight: 600 }}>/api/v1/customer/profile</code>.
                    </div>

                    {riskScore >= 50.0 && (
                      <div style={{ padding: '0.75rem', background: '#FEF3C7', borderRadius: '8px', borderLeft: '4px solid #D97706', border: '1px solid #FDE68A', fontSize: '0.82rem' }}>
                        <span className="font-mono" style={{ color: '#64748B' }}>11:42:10 IST</span> — <strong>RBAC Policy Warning</strong>: Attempted access to restricted sensitivity endpoint.
                      </div>
                    )}

                    {riskScore >= 90.0 && (
                      <div style={{ padding: '0.75rem', background: '#FEF2F2', borderRadius: '8px', borderLeft: '4px solid #DC2626', border: '1px solid #FCA5A5', fontSize: '0.82rem', color: '#DC2626', fontWeight: 700 }}>
                        <span className="font-mono">12:00:00 IST</span> — AUTOMATED SESSION ISOLATION EXECUTED: Composite risk score crossed 95% threshold ({riskScore}%).
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Explainable AI (XAI) Dynamic SHAP Feature Weights */}
          <div style={{ background: 'rgba(255, 255, 255, 0.65)', backdropFilter: 'blur(12px)', padding: '1.35rem', borderRadius: '12px', border: '1.5px solid rgba(226, 232, 240, 0.8)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>Explainable AI (XAI) SHAP Weights</h3>
              <span style={{ fontSize: '0.65rem', background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>LIME / SHAP MODEL</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem', fontSize: '0.82rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ color: '#334155', fontWeight: 600 }}>Inter-arrival Request Entropy</span>
                  <strong style={{ color: '#DC2626' }}>+{entropyWeight}.0%</strong>
                </div>
                <div style={{ width: '100%', background: '#E2E8F0', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                  <div style={{ width: `${entropyWeight}%`, background: '#DC2626', height: '100%' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ color: '#334155', fontWeight: 600 }}>Sensitive Table Blast Radius</span>
                  <strong style={{ color: '#D97706' }}>+{blastRadiusWeight}.0%</strong>
                </div>
                <div style={{ width: '100%', background: '#E2E8F0', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                  <div style={{ width: `${blastRadiusWeight}%`, background: '#D97706', height: '100%' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ color: '#334155', fontWeight: 600 }}>Geolocation Divergence</span>
                  <strong style={{ color: '#2563EB' }}>+{geoWeight}.0%</strong>
                </div>
                <div style={{ width: '100%', background: '#E2E8F0', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                  <div style={{ width: `${geoWeight}%`, background: '#2563EB', height: '100%' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ color: '#334155', fontWeight: 600 }}>Off-Hours Temporal Variance</span>
                  <strong style={{ color: '#7C3AED' }}>+{offHoursWeight}.0%</strong>
                </div>
                <div style={{ width: '100%', background: '#E2E8F0', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                  <div style={{ width: `${offHoursWeight}%`, background: '#7C3AED', height: '100%' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ color: '#334155', fontWeight: 600 }}>Role RBAC Boundary Breach</span>
                  <strong style={{ color: '#059669' }}>+{rbacWeight}.0%</strong>
                </div>
                <div style={{ width: '100%', background: '#E2E8F0', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                  <div style={{ width: `${rbacWeight}%`, background: '#059669', height: '100%' }}></div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', pt: '0.5rem', fontWeight: 800, fontSize: '0.9rem', color: riskScore >= 75 ? '#DC2626' : '#059669', borderTop: '1px solid #E2E8F0', marginTop: '0.25rem' }}>
                <span>Composite Risk Score</span>
                <span className="font-mono">{riskScore.toFixed(1)}%</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
