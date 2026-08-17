import React from 'react';
import { useSOC } from '../context/SOCContext';
import { Zap, ShieldAlert, TrendingUp, ArrowRight } from 'lucide-react';

export const AttackPredictionView = () => {
  const { employees, selectedEmployeeId } = useSOC();
  const selectedEmp = employees.find((e) => e.id === selectedEmployeeId) || employees[0];

  return (
    <div className="soc-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', borderBottom: '1px solid #1E293B', paddingBottom: '0.75rem' }}>
        <Zap style={{ color: '#EF4444', width: '22px', height: '22px' }} />
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC' }}>Predictive Insider Threat Progression</h2>
          <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>AI-assisted attack trajectory prediction & next stage classification for <code style={{ color: '#60A5FA' }}>{selectedEmp.id}</code>.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        
        <div style={{ background: '#0B132B', padding: '1rem', borderRadius: '8px', border: '1px solid #1E293B' }}>
          <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase' }}>Current Threat Classification</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#EF4444', marginTop: '0.25rem' }}>
            {selectedEmp.currentThreat}
          </div>
        </div>

        <div style={{ background: '#0B132B', padding: '1rem', borderRadius: '8px', border: '1px solid #1E293B' }}>
          <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase' }}>Predicted Next Threat</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F59E0B', marginTop: '0.25rem' }}>
            DATA_EXFILTRATION_BULK
          </div>
        </div>

        <div style={{ background: '#0B132B', padding: '1rem', borderRadius: '8px', border: '1px solid #1E293B' }}>
          <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase' }}>Prediction Confidence</div>
          <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10B981', marginTop: '0.25rem' }}>
            94.7%
          </div>
        </div>

      </div>

      {/* Attack Progression Timeline Steps */}
      <div style={{ background: '#0B132B', padding: '1.25rem', borderRadius: '8px', border: '1px solid #1E293B' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#F8FAFC', marginBottom: '1rem' }}>Attack Progression Trajectory</h3>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          
          <div style={{ background: '#1E293B', padding: '0.6rem 0.85rem', borderRadius: '6px', fontSize: '0.8rem', color: '#94A3B8', borderLeft: '3px solid #10B981' }}>
            1. Unusual Login
          </div>
          <ArrowRight style={{ width: '16px', height: '16px', color: '#475569' }} />

          <div style={{ background: '#1E293B', padding: '0.6rem 0.85rem', borderRadius: '6px', fontSize: '0.8rem', color: '#94A3B8', borderLeft: '3px solid #3B82F6' }}>
            2. Unusual Resource Access
          </div>
          <ArrowRight style={{ width: '16px', height: '16px', color: '#475569' }} />

          <div style={{ background: '#1E293B', padding: '0.6rem 0.85rem', borderRadius: '6px', fontSize: '0.8rem', color: '#F59E0B', borderLeft: '3px solid #F59E0B' }}>
            3. Privilege Violation
          </div>
          <ArrowRight style={{ width: '16px', height: '16px', color: '#475569' }} />

          <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '0.6rem 0.85rem', borderRadius: '6px', fontSize: '0.8rem', color: '#F87171', borderLeft: '3px solid #EF4444', fontWeight: 700 }}>
            4. Sensitive Data Access (CURRENT)
          </div>
          <ArrowRight style={{ width: '16px', height: '16px', color: '#EF4444' }} />

          <div style={{ background: '#0F172A', padding: '0.6rem 0.85rem', borderRadius: '6px', fontSize: '0.8rem', color: '#64748B', border: '1px dashed #EF4444' }}>
            5. Bulk Data Extraction (PREDICTED NEXT)
          </div>

        </div>
      </div>
    </div>
  );
};
