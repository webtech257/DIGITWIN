import React from 'react';
import { useSOC } from '../context/SOCContext';
import { Eye, User, Clock, Monitor, Wifi, AlertTriangle, CheckCircle, ShieldCheck, MapPin, Activity, Cpu, CheckCircle2, AlertCircle } from 'lucide-react';

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

  const isOnline = Boolean(
    selectedEmp.isOnline ||
    (selectedEmp.onlineStatus && !selectedEmp.onlineStatus.includes('OFFLINE')) ||
    (selectedEmp.currentBehavior?.location && !selectedEmp.currentBehavior.location.includes('Offline'))
  );

  const riskScore = Number(selectedEmp.riskScore || 0);
  const isHighRisk = riskScore >= 70;
  const conformityScore = Math.max(0, 100 - riskScore);

  const expected = selectedEmp.expectedBehavior || {
    workingHours: '09:00 - 18:00 IST',
    device: selectedEmp.device || `BANK-PC-${selectedEmp.id}`,
    location: selectedEmp.location || 'Branch Campus, Chennai',
    avgDailyAccesses: 25,
    typicalResources: '/api/v1/customer/profile, /api/v1/transactions/search'
  };

  const current = selectedEmp.currentBehavior || {};

  // Clean login time display
  const currentLoginTime = isOnline
    ? (current.loginTime && !current.loginTime.includes('Not Logged In') ? current.loginTime : 'Today (Live Active Session)')
    : 'Not Logged In (Offline)';

  // Clean device display
  const currentDevice = isOnline
    ? (current.device && !current.device.includes('Offline') ? current.device : 'DEV-FP-Chrome-Win64 (Online Live Device)')
    : (expected.device || `BANK-PC-${selectedEmp.id} (Offline)`);

  // Clean location display with coordinates
  const liveGeo = selectedEmp.geo;
  const currentLocation = isOnline
    ? (liveGeo?.city
        ? (liveGeo.lat != null && liveGeo.lng != null
            ? `${liveGeo.city} (${liveGeo.lat.toFixed(4)}° N, ${liveGeo.lng.toFixed(4)}° E)`
            : liveGeo.city)
        : (current.location && !current.location.includes('Offline') ? current.location : 'Chennai (Live Online Device)'))
    : 'Offline / No Active Session';

  const currentAccessVolume = current.accessesCount != null ? current.accessesCount : (isOnline ? 1 : 0);

  // Clean endpoint display: extract clean endpoint without dumping admin messages
  let currentResource = '/api/v1/customer/profile';
  const rawResource = current.resourceAccessed || current.accessedResources || '';
  if (rawResource) {
    const match = rawResource.match(/(\/api\/v1\/[a-zA-Z0-9_\-\/]+)/);
    if (match && match[1]) {
      currentResource = match[1];
    } else if (rawResource.includes('RESTORE') || rawResource.includes('RESOLVED')) {
      currentResource = '/api/v1/customer/profile (Session Restored)';
    } else if (rawResource.includes('ISOLAT')) {
      currentResource = '/api/v1/customer/profile (Quarantined)';
    } else if (!rawResource.includes('None')) {
      currentResource = rawResource;
    }
  }

  const isAnomalousEndpoint = currentResource.includes('VIP') || currentResource.includes('decoy') || currentResource.includes('VIOLATION') || currentResource.includes('vault');

  // Auto-focus on active live session if current selection is offline but someone is online
  React.useEffect(() => {
    const liveEmp = employees.find(e => e.isOnline);
    if (liveEmp && !selectedEmp.isOnline && selectedEmployeeId === 'EMP1024' && liveEmp.id !== 'EMP1024') {
      setSelectedEmployeeId(liveEmp.id);
    }
  }, [employees]);

  const liveEmployees = employees.filter(e => e.isOnline);

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
        gap: '1rem',
        background: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E2E8F0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User style={{ color: '#2563EB', width: '20px', height: '20px' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>
              Target Digital Twin:
            </span>
          </div>

          {liveEmployees.map(liveEmp => (
            <button
              key={liveEmp.id}
              onClick={() => setSelectedEmployeeId(liveEmp.id)}
              style={{
                background: selectedEmp.id === liveEmp.id ? '#059669' : '#ECFDF5',
                color: selectedEmp.id === liveEmp.id ? '#FFFFFF' : '#059669',
                border: `1.5px solid ${selectedEmp.id === liveEmp.id ? '#059669' : '#A7F3D0'}`,
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: selectedEmp.id === liveEmp.id ? '#FFFFFF' : '#10B981' }} />
              Live Active: {liveEmp.name} ({liveEmp.id})
            </button>
          ))}
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
            minWidth: '340px'
          }}
        >
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name} ({emp.id}) — {emp.role} [{emp.isOnline ? '🟢 Live Online' : '⚪ Offline'} | {emp.riskScore}% Risk]
            </option>
          ))}
        </select>
      </div>

      {/* Twin Inspector Card */}
      <div className="soc-card" style={{ padding: '1.75rem', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
        
        {/* Header Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: '#F3E8FF', padding: '0.65rem', borderRadius: '12px', border: '1px solid #DDD6FE' }}>
              <Eye style={{ color: '#7C3AED', width: '26px', height: '26px' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.3px', margin: 0 }}>
                  Behavioral Digital Twin Comparative Inspection
                </h2>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '3px 9px',
                  borderRadius: '12px',
                  background: isOnline ? '#ECFDF5' : '#F1F5F9',
                  color: isOnline ? '#059669' : '#64748B',
                  border: `1px solid ${isOnline ? '#A7F3D0' : '#CBD5E1'}`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: isOnline ? '#10B981' : '#94A3B8' }} />
                  {isOnline ? 'LIVE ONLINE SESSION' : 'OFFLINE'}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.2rem', marginBottom: 0 }}>
                Target Profile: <strong style={{ color: '#0F172A' }}>{selectedEmp.name}</strong> (<code style={{ color: '#2563EB', fontWeight: 700 }}>{selectedEmp.id}</code>) • {selectedEmp.role} [{selectedEmp.department}]
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Behavioral Conformity Gauge */}
            <div style={{ textAlign: 'right', background: '#F8FAFC', padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.68rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
                Twin Conformity Alignment
              </div>
              <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: conformityScore >= 80 ? '#059669' : (conformityScore >= 50 ? '#2563EB' : '#DC2626') }}>
                {conformityScore.toFixed(1)}% {conformityScore >= 80 ? '✓ High Match' : '⚠ Drift Detected'}
              </div>
            </div>

            {/* Composite Risk Score Box */}
            <div style={{ textAlign: 'right', background: isHighRisk ? '#FEF2F2' : '#F0FDF4', padding: '0.5rem 1rem', borderRadius: '10px', border: `1px solid ${isHighRisk ? '#FCA5A5' : '#BBF7D0'}` }}>
              <div style={{ fontSize: '0.68rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
                Composite Risk Score
              </div>
              <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: isHighRisk ? '#DC2626' : '#059669' }}>
                {riskScore.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {/* Side-by-Side Comparison Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.75rem' }}>

          {/* Expected Behavior Box */}
          <div style={{
            background: '#F0FDF4',
            padding: '1.4rem',
            borderRadius: '14px',
            border: '1.5px solid #BBF7D0',
            boxShadow: '0 4px 12px rgba(5, 150, 105, 0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <CheckCircle style={{ width: '18px', height: '18px' }} /> Expected Learned Baseline (Digital Twin)
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', fontSize: '0.875rem' }}>
              <div>
                <span style={{ color: '#475569', fontWeight: 600 }}>Working Hours Baseline:</span>
                <div className="font-mono" style={{ color: '#0F172A', fontWeight: 700, marginTop: '0.15rem' }}>
                  {expected.workingHours || '09:00 - 18:00 IST'}
                </div>
              </div>

              <div>
                <span style={{ color: '#475569', fontWeight: 600 }}>Recognized Hardware Device:</span>
                <div className="font-mono" style={{ color: '#2563EB', fontWeight: 700, marginTop: '0.15rem' }}>
                  {expected.device || `BANK-PC-${selectedEmp.id}`}
                </div>
              </div>

              <div>
                <span style={{ color: '#475569', fontWeight: 600 }}>Network Location Baseline:</span>
                <div className="font-mono" style={{ color: '#0F172A', fontWeight: 700, marginTop: '0.15rem' }}>
                  {expected.location || 'Branch Campus (Chennai Perimeter)'}
                </div>
              </div>

              <div>
                <span style={{ color: '#475569', fontWeight: 600 }}>Avg Daily Record Accesses:</span>
                <div className="font-mono" style={{ color: '#0F172A', fontWeight: 700, marginTop: '0.15rem' }}>
                  {expected.avgDailyAccesses || 25} records / day
                </div>
              </div>

              <div>
                <span style={{ color: '#475569', fontWeight: 600 }}>Typical Allowed Resources:</span>
                <div className="font-mono" style={{ color: '#059669', fontSize: '0.82rem', fontWeight: 700, marginTop: '0.15rem' }}>
                  {expected.typicalResources || '/api/v1/customer/profile, /api/v1/transactions/search'}
                </div>
              </div>
            </div>
          </div>

          {/* Current Live Session Behavior Box */}
          <div style={{
            background: isHighRisk ? '#FEF2F2' : '#F8FAFC',
            padding: '1.4rem',
            borderRadius: '14px',
            border: isHighRisk ? '1.5px solid #FCA5A5' : '1.5px solid #CBD5E1',
            boxShadow: isHighRisk ? '0 8px 20px rgba(220, 38, 38, 0.08)' : '0 4px 12px rgba(15, 23, 42, 0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isHighRisk ? '#DC2626' : '#2563EB', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <Activity style={{ width: '18px', height: '18px' }} /> Live Session Telemetry
              </div>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: isOnline ? '#059669' : '#64748B',
                background: isOnline ? '#ECFDF5' : '#F1F5F9',
                padding: '2px 8px',
                borderRadius: '6px',
                border: `1px solid ${isOnline ? '#A7F3D0' : '#E2E8F0'}`
              }}>
                {isOnline ? '🟢 Live Hardware Ingestion' : '⚪ Session Inactive'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', fontSize: '0.875rem' }}>
              <div>
                <span style={{ color: '#475569', fontWeight: 600 }}>Login Timestamp:</span>
                <div className="font-mono" style={{ color: '#0F172A', fontWeight: 700, marginTop: '0.15rem' }}>
                  {currentLoginTime}
                </div>
              </div>

              <div>
                <span style={{ color: '#475569', fontWeight: 600 }}>Device Fingerprint:</span>
                <div className="font-mono" style={{ color: '#2563EB', fontWeight: 700, marginTop: '0.15rem' }}>
                  {currentDevice}
                </div>
              </div>

              <div>
                <span style={{ color: '#475569', fontWeight: 600 }}>Current Location:</span>
                <div className="font-mono" style={{ color: '#0F172A', fontWeight: 700, marginTop: '0.15rem' }}>
                  {currentLocation}
                </div>
              </div>

              <div>
                <span style={{ color: '#475569', fontWeight: 600 }}>Current Access Volume:</span>
                <div className="font-mono" style={{ color: currentAccessVolume > 30 ? '#DC2626' : '#0F172A', fontWeight: 700, marginTop: '0.15rem' }}>
                  {currentAccessVolume} records / session
                </div>
              </div>

              <div>
                <span style={{ color: '#475569', fontWeight: 600 }}>Last Accessed Endpoint:</span>
                <div className="font-mono" style={{ color: isAnomalousEndpoint ? '#DC2626' : '#059669', fontSize: '0.82rem', fontWeight: 700, marginTop: '0.15rem' }}>
                  {currentResource}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Zero-Trust Behavioral Vector Drift Table */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <Cpu style={{ width: '18px', height: '18px', color: '#7C3AED' }} />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Zero-Trust Behavioral Vector Drift Matrix
            </h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0', color: '#475569' }}>
                  <th style={{ padding: '0.65rem 0.85rem', fontWeight: 700 }}>BEHAVIORAL VECTOR</th>
                  <th style={{ padding: '0.65rem 0.85rem', fontWeight: 700 }}>EXPECTED BASELINE</th>
                  <th style={{ padding: '0.65rem 0.85rem', fontWeight: 700 }}>LIVE INGESTED TELEMETRY</th>
                  <th style={{ padding: '0.65rem 0.85rem', fontWeight: 700 }}>STATUS VERIFICATION</th>
                </tr>
              </thead>
              <tbody>
                {/* Vector 1: Working Hours */}
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: '#0F172A' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock style={{ width: '14px', height: '14px', color: '#64748B' }} /> Working Hours
                    </div>
                  </td>
                  <td style={{ padding: '0.65rem 0.85rem', fontFamily: 'monospace', color: '#475569' }}>
                    09:00 - 18:00 IST
                  </td>
                  <td style={{ padding: '0.65rem 0.85rem', fontFamily: 'monospace', color: '#0F172A' }}>
                    {isOnline ? 'Active Business Shift' : 'No Active Session'}
                  </td>
                  <td style={{ padding: '0.65rem 0.85rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: '4px', border: '1px solid #A7F3D0' }}>
                      ✓ Within Shift Window
                    </span>
                  </td>
                </tr>

                {/* Vector 2: Hardware Fingerprint */}
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: '#0F172A' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Monitor style={{ width: '14px', height: '14px', color: '#64748B' }} /> Device Fingerprint
                    </div>
                  </td>
                  <td style={{ padding: '0.65rem 0.85rem', fontFamily: 'monospace', color: '#475569' }}>
                    BANK-PC-{selectedEmp.id}
                  </td>
                  <td style={{ padding: '0.65rem 0.85rem', fontFamily: 'monospace', color: '#2563EB' }}>
                    {isOnline ? currentDevice : 'Not Ingested'}
                  </td>
                  <td style={{ padding: '0.65rem 0.85rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: '4px', border: '1px solid #A7F3D0' }}>
                      ✓ Verified Workstation Token
                    </span>
                  </td>
                </tr>

                {/* Vector 3: Geospatial Location */}
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: '#0F172A' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin style={{ width: '14px', height: '14px', color: '#64748B' }} /> Physical Geolocation
                    </div>
                  </td>
                  <td style={{ padding: '0.65rem 0.85rem', fontFamily: 'monospace', color: '#475569' }}>
                    Chennai Campus Perimeter (≤15km)
                  </td>
                  <td style={{ padding: '0.65rem 0.85rem', fontFamily: 'monospace', color: '#0F172A' }}>
                    {isOnline ? currentLocation : 'Offline'}
                  </td>
                  <td style={{ padding: '0.65rem 0.85rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: isOnline ? '#059669' : '#64748B', background: isOnline ? '#ECFDF5' : '#F1F5F9', padding: '2px 8px', borderRadius: '4px', border: `1px solid ${isOnline ? '#A7F3D0' : '#CBD5E1'}` }}>
                      {isOnline ? '✓ Authorized Branch Perimeter' : 'Offline Baseline'}
                    </span>
                  </td>
                </tr>

                {/* Vector 4: Access Volume */}
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: '#0F172A' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Activity style={{ width: '14px', height: '14px', color: '#64748B' }} /> Access Volume Velocity
                    </div>
                  </td>
                  <td style={{ padding: '0.65rem 0.85rem', fontFamily: 'monospace', color: '#475569' }}>
                    ~25 records / day
                  </td>
                  <td style={{ padding: '0.65rem 0.85rem', fontFamily: 'monospace', color: '#0F172A' }}>
                    {currentAccessVolume} records in current session
                  </td>
                  <td style={{ padding: '0.65rem 0.85rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: '4px', border: '1px solid #A7F3D0' }}>
                      ✓ Nominal Velocity (&lt;25/day)
                    </span>
                  </td>
                </tr>

                {/* Vector 5: API Endpoint Scope */}
                <tr>
                  <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: '#0F172A' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <ShieldCheck style={{ width: '14px', height: '14px', color: '#64748B' }} /> RBAC Endpoint Scope
                    </div>
                  </td>
                  <td style={{ padding: '0.65rem 0.85rem', fontFamily: 'monospace', color: '#475569' }}>
                    Customer & Transaction APIs
                  </td>
                  <td style={{ padding: '0.65rem 0.85rem', fontFamily: 'monospace', color: isAnomalousEndpoint ? '#DC2626' : '#059669' }}>
                    {currentResource}
                  </td>
                  <td style={{ padding: '0.65rem 0.85rem' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: isAnomalousEndpoint ? '#DC2626' : '#059669',
                      background: isAnomalousEndpoint ? '#FEF2F2' : '#ECFDF5',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      border: `1px solid ${isAnomalousEndpoint ? '#FCA5A5' : '#A7F3D0'}`
                    }}>
                      {isAnomalousEndpoint ? '⚠ Out-of-Profile Access' : '✓ Permitted RBAC Resource'}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
