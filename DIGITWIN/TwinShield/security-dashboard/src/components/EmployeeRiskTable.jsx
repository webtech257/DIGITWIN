import React from 'react';
import { useSOC } from '../context/SOCContext';
import { Users, Eye } from 'lucide-react';

export const EmployeeRiskTable = ({ onInspectEmployee }) => {
  const { employees, selectedEmployeeId, setSelectedEmployeeId } = useSOC();

  const handleSelect = (empId) => {
    setSelectedEmployeeId(empId);
    if (onInspectEmployee) onInspectEmployee(empId);
  };

  return (
    <div className="soc-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Users style={{ color: '#2563EB', width: '20px', height: '20px' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>Employee Risk Assessment Leaderboard</h2>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Employee ID & Name</th>
              <th style={{ padding: '0.75rem 1rem' }}>Role</th>
              <th style={{ padding: '0.75rem 1rem' }}>Risk Score</th>
              <th style={{ padding: '0.75rem 1rem' }}>Status</th>
              <th style={{ padding: '0.75rem 1rem' }}>Current Threat</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => {
              const isIsolated = emp.status === 'ISOLATED';
              const isMonitor = emp.status === 'MONITOR';
              const isSelected = emp.id === selectedEmployeeId;

              return (
                <tr
                  key={emp.id}
                  style={{
                    borderBottom: '1px solid #F1F5F9',
                    background: isSelected ? '#EFF6FF' : 'transparent'
                  }}
                >
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0F172A' }}>{emp.name}</div>
                    <div className="font-mono" style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 600 }}>{emp.id} • {emp.department}</div>
                  </td>

                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: '#334155' }}>
                    {emp.role}
                  </td>

                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div className="font-mono" style={{ fontSize: '1rem', fontWeight: 700, color: isIsolated ? '#DC2626' : isMonitor ? '#D97706' : '#059669' }}>
                      {emp.riskScore}%
                    </div>
                  </td>

                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '12px',
                      background: isIsolated ? '#FEF2F2' : isMonitor ? '#FEF3C7' : '#ECFDF5',
                      color: isIsolated ? '#DC2626' : isMonitor ? '#D97706' : '#059669',
                      border: isIsolated ? '1px solid #FCA5A5' : isMonitor ? '1px solid #FDE68A' : '1px solid #A7F3D0'
                    }}>
                      {emp.status}
                    </span>
                  </td>

                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', fontFamily: 'monospace', color: emp.currentThreat !== 'NONE' ? '#DC2626' : '#64748B', fontWeight: emp.currentThreat !== 'NONE' ? 600 : 400 }}>
                    {emp.currentThreat}
                  </td>

                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => handleSelect(emp.id)}
                      style={{
                        padding: '0.4rem 0.8rem',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        background: '#EFF6FF',
                        color: '#2563EB',
                        border: '1px solid #BFDBFE',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        cursor: 'pointer'
                      }}
                    >
                      <Eye style={{ width: '14px', height: '14px' }} />
                      Inspect Twin
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
