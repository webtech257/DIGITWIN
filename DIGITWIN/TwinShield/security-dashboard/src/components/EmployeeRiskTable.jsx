import React from 'react';
import { useSOC } from '../context/SOCContext';
import { Users, Eye, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';

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
          <Users style={{ color: '#3B82F6', width: '20px', height: '20px' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC' }}>Employee Risk Assessment Leaderboard</h2>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#0B132B', borderBottom: '1px solid #1E293B', color: '#64748B', fontSize: '0.72rem', textTransform: 'uppercase' }}>
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
                    borderBottom: '1px solid #1E293B',
                    background: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
                  }}
                >
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#F8FAFC' }}>{emp.name}</div>
                    <div className="font-mono" style={{ fontSize: '0.75rem', color: '#60A5FA' }}>{emp.id} • {emp.department}</div>
                  </td>

                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: '#CBD5E1' }}>
                    {emp.role}
                  </td>

                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div className="font-mono" style={{ fontSize: '1rem', fontWeight: 700, color: isIsolated ? '#EF4444' : isMonitor ? '#F59E0B' : '#10B981' }}>
                      {emp.riskScore}%
                    </div>
                  </td>

                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '12px',
                      background: isIsolated ? 'rgba(239, 68, 68, 0.2)' : isMonitor ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                      color: isIsolated ? '#F87171' : isMonitor ? '#FBBF24' : '#34D399',
                      border: isIsolated ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid transparent'
                    }}>
                      {emp.status}
                    </span>
                  </td>

                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', fontFamily: 'monospace', color: emp.currentThreat !== 'NONE' ? '#F87171' : '#64748B' }}>
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
                        background: 'rgba(59, 130, 246, 0.15)',
                        color: '#60A5FA',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem'
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
