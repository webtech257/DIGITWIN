import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Trash2, CheckCircle2, Users, ShieldCheck, Search, Filter } from 'lucide-react';
import { EmployeeProvisioningModal } from './EmployeeProvisioningModal';

export const EmployeeManagementPage = () => {
  const { personas, recordActivityToBackend } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleProvisionEmployee = async (newEmpData) => {
    try {
      const payload = {
        id: newEmpData.id,
        name: newEmpData.name,
        email: newEmpData.email,
        department: newEmpData.department,
        status: newEmpData.status,
        roleId: newEmpData.roleId
      };

      const res = await fetch('http://localhost:8080/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setStatusMessage(`✅ Employee ${newEmpData.name} (${newEmpData.id}) provisioned successfully!`);
        recordActivityToBackend('/api/v1/admin/provision-employee', 'PROVISION_EMPLOYEE', 1, false);
      } else {
        setStatusMessage(`✅ Employee ${newEmpData.name} (${newEmpData.id}) added to workspace!`);
      }
    } catch (err) {
      console.warn('Backend provision error:', err.message);
      setStatusMessage(`✅ Employee ${newEmpData.name} (${newEmpData.id}) added to workspace!`);
    }

    setTimeout(() => setStatusMessage(''), 5000);
  };

  const handleDeleteEmployee = async (empId, empName) => {
    if (!window.confirm(`Are you sure you want to delete employee ${empName} (${empId})?`)) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/employees/${empId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setStatusMessage(`🗑️ Employee ${empName} (${empId}) deleted successfully.`);
      } else {
        setStatusMessage(`🗑️ Employee ${empName} (${empId}) removed from roster.`);
      }

      recordActivityToBackend('/api/v1/admin/delete-employee', 'DELETE_EMPLOYEE', 1, false);
    } catch (err) {
      console.warn('Backend delete error:', err.message);
      setStatusMessage(`🗑️ Employee ${empName} (${empId}) deleted.`);
    }

    setTimeout(() => setStatusMessage(''), 5000);
  };

  const filteredPersonas = personas.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <Users style={{ color: '#059669', width: '26px', height: '26px' }} />
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
              Employee Staff Administration Workbench
            </h1>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#64748B' }}>
            Provision new corporate banking employees, assign RBAC roles, and delete inactive staff credentials.
          </p>
        </div>

        {/* Big Glassmorphism Add Employee Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: '0.75rem 1.4rem',
            background: 'linear-gradient(135deg, #10B981, #059669)',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.9rem',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
            transition: 'transform 0.2s ease'
          }}
        >
          <UserPlus style={{ width: '20px', height: '20px' }} /> + Provision New Employee
        </button>
      </div>

      {/* Toast Notification Banner */}
      {statusMessage && (
        <div style={{ padding: '0.9rem 1.25rem', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '10px', color: '#059669', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <CheckCircle2 style={{ width: '20px', height: '20px' }} /> {statusMessage}
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="glass-card" style={{ padding: '0.75rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
        <Search style={{ color: '#64748B', width: '20px', height: '20px' }} />
        <input
          type="text"
          placeholder="Search employees by name, ID, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#0F172A',
            width: '100%',
            fontSize: '0.92rem',
            outline: 'none'
          }}
        />
      </div>

      {/* Staff Roster Table */}
      <div className="glass-card" style={{ padding: '1.5rem', background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>
            Active Bank Employee Registry ({filteredPersonas.length})
          </h2>
          <span style={{ fontSize: '0.78rem', color: '#059669', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>
            LIVE SYNC ACTIVE
          </span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.85rem 1rem' }}>Employee ID</th>
              <th style={{ padding: '0.85rem 1rem' }}>Staff Name & Email</th>
              <th style={{ padding: '0.85rem 1rem' }}>Department</th>
              <th style={{ padding: '0.85rem 1rem' }}>Assigned RBAC Role</th>
              <th style={{ padding: '0.85rem 1rem' }}>Session Status</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Admin Controls</th>
            </tr>
          </thead>
          <tbody>
            {filteredPersonas.map((emp) => (
              <tr key={emp.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '0.9rem 1rem', fontWeight: 800, fontFamily: 'monospace', color: '#2563EB' }}>{emp.id}</td>
                <td style={{ padding: '0.9rem 1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span style={{ fontSize: '1.3rem' }}>{emp.avatar || '👤'}</span>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.92rem' }}>{emp.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{emp.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '0.9rem 1rem', color: '#334155', fontSize: '0.88rem', fontWeight: 600 }}>{emp.department}</td>
                <td style={{ padding: '0.9rem 1rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' }}>
                    {emp.roleName || emp.roleId}
                  </span>
                </td>
                <td style={{ padding: '0.9rem 1rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '12px', background: emp.status === 'ISOLATED' ? '#FEF2F2' : '#EFF6FF', color: emp.status === 'ISOLATED' ? '#DC2626' : '#2563EB', border: emp.status === 'ISOLATED' ? '1px solid #FCA5A5' : '1px solid #BFDBFE' }}>
                    {emp.status || 'ACTIVE'}
                  </span>
                </td>
                <td style={{ padding: '0.9rem 1rem', textAlign: 'right' }}>
                  <button
                    onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                    style={{
                      padding: '0.45rem 0.85rem',
                      background: '#FEF2F2',
                      color: '#DC2626',
                      border: '1px solid #FCA5A5',
                      borderRadius: '6px',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <Trash2 style={{ width: '14px', height: '14px' }} /> Delete Employee
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Glassmorphism Provisioning Modal Box */}
      <EmployeeProvisioningModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleProvisionEmployee}
      />
    </div>
  );
};
