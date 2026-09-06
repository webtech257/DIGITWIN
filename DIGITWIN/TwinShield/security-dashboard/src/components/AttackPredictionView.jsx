import React from 'react';
import { useSOC } from '../context/SOCContext';
import { Zap, ShieldAlert, ArrowRight, User } from 'lucide-react';

export const AttackPredictionView = () => {
  const { employees, selectedEmployeeId, setSelectedEmployeeId } = useSOC();
  
  const selectedEmp = (employees && employees.length > 0)
    ? (employees.find((e) => e.id === selectedEmployeeId) || employees[0])
    : null;

  if (!selectedEmp) return null;

  const riskScore = Number(selectedEmp.riskScore || 0);
  const isIsolated = selectedEmp.status === 'ISOLATED' || riskScore >= 95.0;
  const isHighRisk = riskScore >= 75.0;

  // Dynamic threat trajectory prediction based on risk score and current threat
  const getPredictedNextThreat = () => {
    if (isIsolated || riskScore >= 95.0) return 'SYSTEM_QUARANTINE_ENFORCED';
    if (riskScore >= 80.0) return 'DATA_EXFILTRATION_BULK';
    if (riskScore >= 50.0) return 'PRIVILEGE_CREEP_ESCALATION';
    return 'UNUSUALLY_HIGH_ACCESS_FREQUENCY';
  };

  const getPredictionConfidence = () => {
    if (riskScore >= 95.0) return '99.2%';
    if (riskScore >= 75.0) return '94.7%';
    if (riskScore >= 50.0) return '88.3%';
    return '91.5%';
  };

  const getCurrentStageIndex = () => {
    if (isIsolated || riskScore >= 95.0) return 4;
    if (riskScore >= 80.0) return 3;
    if (riskScore >= 50.0) return 2;
    if (riskScore >= 30.0) return 1;
    return 0;
  };

  const currentStage = getCurrentStageIndex();

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
          <User style={{ color: '#DC2626', width: '20px', height: '20px' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>
            Select Target Employee for Threat Prediction:
          </span>
        </div>

        <select
          value={selectedEmp.id}
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
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name} ({emp.id}) — {emp.role} [{emp.riskScore}% Risk - {emp.status}]
            </option>
          ))}
        </select>
      </div>

      {/* Main Prediction View */}
      <div className="soc-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid rgba(226, 232, 240, 0.8)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(254, 226, 226, 0.8)', padding: '0.65rem', borderRadius: '10px', border: '1px solid #FCA5A5' }}>
              <Zap style={{ color: '#DC2626', width: '24px', height: '24px' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.3px' }}>Predictive Insider Threat Trajectory Engine</h2>
              <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.15rem' }}>
                AI-assisted attack trajectory prediction & next stage classification for <strong style={{ color: '#0F172A' }}>{selectedEmp.name}</strong> (<code style={{ color: '#2563EB', fontWeight: 700 }}>{selectedEmp.id}</code>).
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>

          <div style={{ background: isHighRisk ? 'rgba(254, 242, 242, 0.65)' : 'rgba(239, 246, 255, 0.65)', backdropFilter: 'blur(12px)', padding: '1.1rem', borderRadius: '12px', border: isHighRisk ? '1.5px solid #FCA5A5' : '1.5px solid #BFDBFE' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Current Threat Classification</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: isHighRisk ? '#DC2626' : '#2563EB', marginTop: '0.25rem' }}>
              {selectedEmp.currentThreat || 'NONE'}
            </div>
          </div>

          <div style={{ background: 'rgba(254, 243, 199, 0.65)', backdropFilter: 'blur(12px)', padding: '1.1rem', borderRadius: '12px', border: '1.5px solid #FDE68A' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Predicted Next Threat</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#D97706', marginTop: '0.25rem' }}>
              {getPredictedNextThreat()}
            </div>
          </div>

          <div style={{ background: 'rgba(236, 253, 245, 0.65)', backdropFilter: 'blur(12px)', padding: '1.1rem', borderRadius: '12px', border: '1.5px solid #A7F3D0' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>AI Prediction Confidence</div>
            <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669', marginTop: '0.25rem' }}>
              {getPredictionConfidence()}
            </div>
          </div>

        </div>

        {/* Attack Progression Timeline Steps */}
        <div style={{ background: 'rgba(248, 250, 252, 0.7)', backdropFilter: 'blur(12px)', padding: '1.35rem', borderRadius: '12px', border: '1.5px solid rgba(226, 232, 240, 0.8)' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.25rem' }}>Attack Progression Trajectory Pipeline</h3>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>

            <div style={{
              background: currentStage >= 0 ? '#ECFDF5' : '#FFFFFF',
              padding: '0.65rem 0.9rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              color: currentStage >= 0 ? '#059669' : '#64748B',
              borderLeft: '4px solid #059669',
              border: '1px solid #A7F3D0',
              fontWeight: 700
            }}>
              1. Baseline Initialization
            </div>
            <ArrowRight style={{ width: '16px', height: '16px', color: '#94A3B8' }} />

            <div style={{
              background: currentStage >= 1 ? '#EFF6FF' : '#FFFFFF',
              padding: '0.65rem 0.9rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              color: currentStage >= 1 ? '#2563EB' : '#64748B',
              borderLeft: '4px solid #2563EB',
              border: currentStage >= 1 ? '1px solid #BFDBFE' : '1px solid #E2E8F0',
              fontWeight: currentStage >= 1 ? 700 : 500
            }}>
              2. Anomalous Access Pattern
            </div>
            <ArrowRight style={{ width: '16px', height: '16px', color: '#94A3B8' }} />

            <div style={{
              background: currentStage >= 2 ? '#FEF3C7' : '#FFFFFF',
              padding: '0.65rem 0.9rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              color: currentStage >= 2 ? '#D97706' : '#64748B',
              borderLeft: '4px solid #D97706',
              border: currentStage >= 2 ? '1px solid #FDE68A' : '1px solid #E2E8F0',
              fontWeight: currentStage >= 2 ? 700 : 500
            }}>
              3. Privilege Escalation Attempt
            </div>
            <ArrowRight style={{ width: '16px', height: '16px', color: '#94A3B8' }} />

            <div style={{
              background: currentStage >= 3 ? '#FEF2F2' : '#FFFFFF',
              padding: '0.65rem 0.9rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              color: currentStage >= 3 ? '#DC2626' : '#64748B',
              borderLeft: '4px solid #DC2626',
              border: currentStage >= 3 ? '1px solid #FCA5A5' : '1px solid #E2E8F0',
              fontWeight: currentStage >= 3 ? 700 : 500
            }}>
              4. Sensitive Vault Access ({currentStage === 3 ? 'CURRENT' : 'PASSED'})
            </div>
            <ArrowRight style={{ width: '16px', height: '16px', color: '#DC2626' }} />

            <div style={{
              background: currentStage >= 4 ? '#FEF2F2' : '#FFFFFF',
              padding: '0.65rem 0.9rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              color: currentStage >= 4 ? '#DC2626' : '#64748B',
              border: currentStage >= 4 ? '1.5px solid #DC2626' : '1px dashed #DC2626',
              fontWeight: 700
            }}>
              5. Automated Session Containment ({currentStage >= 4 ? 'ACTIVE' : 'PREDICTED NEXT'})
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
