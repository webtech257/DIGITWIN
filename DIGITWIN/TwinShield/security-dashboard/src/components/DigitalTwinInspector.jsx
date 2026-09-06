import React from 'react';
import { useSOC } from '../context/SOCContext';
import { Eye, User, Clock, Monitor, Wifi, AlertTriangle, CheckCircle } from 'lucide-react';

export const DigitalTwinInspector = () => {
  const { employees, selectedEmployeeId, setSelectedEmployeeId } = useSOC();
  
  const selectedEmp = (employees && employees.length > 0)
    ? (employees.find((e) => e.id === selectedEmployeeId) || employees[0])
    : null;

  if (!selectedEmp) {
    return (
      <div className="soc-card" style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>
        No employee twin data available for inspection.
      </div>
    );
  }

  const expected = selectedEmp.expectedBehavior || {
    workingHours: '09:00 - 18:00 IST',
    device: selectedEmp.device || `BANK-PC-${selectedEmp.id}`,
    location: selectedEmp.location || 'Chennai Office',
    avgDailyAccesses: 25,
    typicalResources: '/api/v1/customer/profile, /api/v1/transactions/search'
  };

  const current = selectedEmp.currentBehavior || {
    loginTime: '10:00 AM (Normal)',
    device: `${selectedEmp.device || 'BANK-PC-' + selectedEmp.id} (Known)`,
    location: `${selectedEmp.location || 'Chennai Office'} (Normal)`,
    accessesCount: 15,
    resourceAccessed: '/api/v1/customer/profile'
  };

  const riskScore = Number(selectedEmp.riskScore || 0);
  const isHighRisk = riskScore >= 75;

  const currentLoginTime = current.loginTime || '10:00 AM (Normal)';
  const currentDevice = current.device || selectedEmp.device || `BANK-PC-${selectedEmp.id}`;
  const currentLocation = current.location || selectedEmp.location || 'Chennai Office';
  const currentAccessVolume = current.accessesCount ?? current.accessVolume ?? 15;
  const currentResource = current.resourceAccessed || current.accessedResources || '/api/v1/customer/profile';

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
          <User style={{ color: '#2563EB', width: '20px', height: '20px' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>
            Select Target Employee Twin to Inspect:
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

      {/* Twin Inspector Card */}
      <div className="soc-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid rgba(226, 232, 240, 0.8)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(243, 232, 255, 0.8)', padding: '0.65rem', borderRadius: '10px', border: '1px solid #DDD6FE' }}>
              <Eye style={{ color: '#7C3AED', width: '24px', height: '24px' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.3px' }}>Behavioral Digital Twin Comparative Inspection</h2>
              <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.15rem' }}>
                Inspecting Twin for: <strong style={{ color: '#0F172A' }}>{selectedEmp.name}</strong> (<code style={{ color: '#2563EB', fontWeight: 700 }}>{selectedEmp.id}</code>) • {selectedEmp.role}
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'right', background: 'rgba(255, 255, 255, 0.6)', padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.9)' }}>
            <div style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Composite Risk Score</div>
            <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: isHighRisk ? '#DC2626' : '#059669' }}>
              {riskScore.toFixed(1)}%
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

          {/* Expected Behavior Box */}
          <div style={{ background: 'rgba(236, 253, 245, 0.65)', backdropFilter: 'blur(12px)', padding: '1.35rem', borderRadius: '12px', border: '1.5px solid #A7F3D0', boxShadow: '0 8px 20px rgba(5, 150, 105, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <CheckCircle style={{ width: '18px', height: '18px' }} /> Expected Learned Baseline
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem' }}>
              <div>
                <span style={{ color: '#475569', fontWeight: 500 }}>Working Hours Baseline:</span>
                <div className="font-mono" style={{ color: '#0F172A', fontWeight: 700, marginTop: '0.15rem' }}>{expected.workingHours || '09:00 - 18:00 IST'}</div>
              </div>

              <div>
                <span style={{ color: '#475569', fontWeight: 500 }}>Recognized Hardware Device:</span>
                <div className="font-mono" style={{ color: '#2563EB', fontWeight: 700, marginTop: '0.15rem' }}>{expected.device || selectedEmp.device}</div>
              </div>

              <div>
                <span style={{ color: '#475569', fontWeight: 500 }}>Network Location Baseline:</span>
                <div className="font-mono" style={{ color: '#0F172A', fontWeight: 700, marginTop: '0.15rem' }}>{expected.location || selectedEmp.location}</div>
              </div>

              <div>
                <span style={{ color: '#475569', fontWeight: 500 }}>Avg Daily Record Accesses:</span>
                <div className="font-mono" style={{ color: '#0F172A', fontWeight: 700, marginTop: '0.15rem' }}>{expected.avgDailyAccesses || 25} records / day</div>
              </div>

              <div>
                <span style={{ color: '#475569', fontWeight: 500 }}>Typical Allowed Resources:</span>
                <div className="font-mono" style={{ color: '#059669', fontSize: '0.8rem', fontWeight: 700, marginTop: '0.15rem' }}>
                  {expected.typicalResources || '/api/v1/customer/profile'}
                </div>
              </div>
            </div>
          </div>

          {/* Current Session Behavior Box */}
          <div style={{
            background: isHighRisk ? 'rgba(254, 242, 242, 0.65)' : 'rgba(248, 250, 252, 0.65)',
            backdropFilter: 'blur(12px)',
            padding: '1.35rem',
            borderRadius: '12px',
            border: isHighRisk ? '1.5px solid #FCA5A5' : '1.5px solid #CBD5E1',
            boxShadow: isHighRisk ? '0 8px 20px rgba(220, 38, 38, 0.08)' : '0 8px 20px rgba(15, 23, 42, 0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isHighRisk ? '#DC2626' : '#2563EB', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <AlertTriangle style={{ width: '18px', height: '18px' }} /> Live Session Telemetry
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem' }}>
              <div>
                <span style={{ color: '#475569', fontWeight: 500 }}>Login Timestamp:</span>
                <div className="font-mono" style={{ color: String(currentLoginTime).includes('Off-hours') ? '#DC2626' : '#0F172A', fontWeight: 700, marginTop: '0.15rem' }}>
                  {currentLoginTime}
                </div>
              </div>

              <div>
                <span style={{ color: '#475569', fontWeight: 500 }}>Device Fingerprint:</span>
                <div className="font-mono" style={{ color: String(currentDevice).includes('Unknown') ? '#DC2626' : '#2563EB', fontWeight: 700, marginTop: '0.15rem' }}>
                  {currentDevice}
                </div>
              </div>

              <div>
                <span style={{ color: '#475569', fontWeight: 500 }}>Current Location:</span>
                <div className="font-mono" style={{ color: String(currentLocation).includes('Unusual') ? '#DC2626' : '#0F172A', fontWeight: 700, marginTop: '0.15rem' }}>
                  {currentLocation}
                </div>
              </div>

              <div>
                <span style={{ color: '#475569', fontWeight: 500 }}>Current Access Volume:</span>
                <div className="font-mono" style={{ color: (Number(currentAccessVolume) > 30) ? '#DC2626' : '#0F172A', fontWeight: 700, marginTop: '0.15rem' }}>
                  {currentAccessVolume} records / session
                </div>
              </div>

              <div>
                <span style={{ color: '#475569', fontWeight: 500 }}>Last Accessed Endpoint:</span>
                <div className="font-mono" style={{ color: String(currentResource).includes('VIP') || String(currentResource).includes('decoy') || String(currentResource).includes('VIOLATION') ? '#DC2626' : '#059669', fontSize: '0.8rem', fontWeight: 700, marginTop: '0.15rem' }}>
                  {currentResource}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
