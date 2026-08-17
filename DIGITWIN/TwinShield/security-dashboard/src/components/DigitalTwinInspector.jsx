import React from 'react';
import { useSOC } from '../context/SOCContext';
import { Eye, Shield, Clock, Monitor, Wifi, AlertTriangle, CheckCircle } from 'lucide-react';

export const DigitalTwinInspector = () => {
  const { employees, selectedEmployeeId } = useSOC();
  const selectedEmp = employees.find((e) => e.id === selectedEmployeeId) || employees[0];

  if (!selectedEmp) return null;

  const expected = selectedEmp.expectedBehavior;
  const current = selectedEmp.currentBehavior;

  return (
    <div className="soc-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid #1E293B', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Eye style={{ color: '#8B5CF6', width: '22px', height: '22px' }} />
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC' }}>Behavioral Digital Twin Comparative Inspection</h2>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
              Target: <strong style={{ color: '#F8FAFC' }}>{selectedEmp.name}</strong> (<code style={{ color: '#60A5FA' }}>{selectedEmp.id}</code>) • {selectedEmp.role}
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase' }}>Composite Risk Score</div>
          <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: selectedEmp.riskScore > 90 ? '#EF4444' : '#10B981' }}>
            {selectedEmp.riskScore}%
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

        {/* Expected Behavior Box */}
        <div style={{ background: '#0B132B', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <CheckCircle style={{ width: '18px', height: '18px' }} /> Expected Learned Behavior
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: '#64748B' }}>Working Hours:</span>
              <div className="font-mono" style={{ color: '#F8FAFC', fontWeight: 600 }}>{expected.workingHours}</div>
            </div>

            <div>
              <span style={{ color: '#64748B' }}>Recognized Device:</span>
              <div className="font-mono" style={{ color: '#60A5FA', fontWeight: 600 }}>{expected.device}</div>
            </div>

            <div>
              <span style={{ color: '#64748B' }}>Network Location:</span>
              <div className="font-mono" style={{ color: '#F8FAFC', fontWeight: 600 }}>{expected.location}</div>
            </div>

            <div>
              <span style={{ color: '#64748B' }}>Avg Daily Access Volume:</span>
              <div className="font-mono" style={{ color: '#F8FAFC', fontWeight: 600 }}>{expected.avgDailyAccesses} records / day</div>
            </div>

            <div>
              <span style={{ color: '#64748B' }}>Typical Resources:</span>
              <div className="font-mono" style={{ color: '#34D399', fontSize: '0.78rem' }}>{expected.typicalResources}</div>
            </div>
          </div>
        </div>

        {/* Current Behavior Box */}
        <div style={{ background: '#0B132B', padding: '1.25rem', borderRadius: '8px', border: selectedEmp.riskScore > 80 ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid #1E293B' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: selectedEmp.riskScore > 80 ? '#EF4444' : '#60A5FA', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <AlertTriangle style={{ width: '18px', height: '18px' }} /> Current Session Behavior
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: '#64748B' }}>Login Timestamp:</span>
              <div className="font-mono" style={{ color: selectedEmp.currentBehavior.loginTime.includes('Off-hours') ? '#F87171' : '#F8FAFC', fontWeight: 600 }}>
                {current.loginTime}
              </div>
            </div>

            <div>
              <span style={{ color: '#64748B' }}>Device Fingerprint:</span>
              <div className="font-mono" style={{ color: current.device.includes('Unknown') ? '#F87171' : '#60A5FA', fontWeight: 600 }}>
                {current.device}
              </div>
            </div>

            <div>
              <span style={{ color: '#64748B' }}>Current Location:</span>
              <div className="font-mono" style={{ color: current.location.includes('Unusual') ? '#F87171' : '#F8FAFC', fontWeight: 600 }}>
                {current.location}
              </div>
            </div>

            <div>
              <span style={{ color: '#64748B' }}>Current Access Volume:</span>
              <div className="font-mono" style={{ color: current.accessesCount > 100 ? '#F87171' : '#F8FAFC', fontWeight: 600 }}>
                {current.accessesCount} records
              </div>
            </div>

            <div>
              <span style={{ color: '#64748B' }}>Accessed Resource:</span>
              <div className="font-mono" style={{ color: '#FBBF24', fontSize: '0.78rem' }}>{current.resourceAccessed}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
