import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Briefcase, CheckCircle2, ShieldAlert, ArrowUpRight, DollarSign, FileCheck, RefreshCw } from 'lucide-react';

export const ManagerOperationsPage = () => {
  const { customers, signOffWireTransfer, recordActivityToBackend } = useAuth();
  
  const [wireStatus, setWireStatus] = useState('');
  const [vaultStatus, setVaultStatus] = useState('');

  const [pendingWires, setPendingWires] = useState([
    { id: 'WIRE-8901', customerId: 'VIP-9001', customerName: 'Victor Vance (VIP)', amount: 5000000.00, destBank: 'HSBC London', status: 'PENDING_APPROVAL' },
    { id: 'WIRE-8902', customerId: 'CUST-8013', customerName: 'Anita Sharma', amount: 150000.00, destBank: 'ICICI Mumbai', status: 'PENDING_APPROVAL' }
  ]);

  const handleApproveWire = (wire) => {
    signOffWireTransfer(wire.id, wire.customerId, wire.amount);
    setPendingWires((prev) => prev.filter((w) => w.id !== wire.id));
    setWireStatus(`✅ Wire Transfer ${wire.id} (₹${wire.amount.toLocaleString('en-IN')}) for ${wire.customerName} Approved & Dispatched!`);
    setTimeout(() => setWireStatus(''), 6000);
  };

  const handleAudVault = () => {
    recordActivityToBackend('/api/v1/manager/vault-audit', 'VAULT_AUDIT', 1, false);
    setVaultStatus(`✅ Vault Cash Audit Completed at ${new Date().toLocaleTimeString()}! Cash Counted: ₹4,85,00,000.00 (Discrepancy: ₹0.00)`);
    setTimeout(() => setVaultStatus(''), 6000);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Briefcase style={{ color: '#2563EB', width: '28px', height: '28px' }} />
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
              Branch Operations Manager Workbench
            </h1>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '0.25rem' }}>
            High-value wire transfer sign-offs (₹50,000+), branch vault audit, and staff override permissions.
          </p>
        </div>

        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2563EB', background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '6px 14px', borderRadius: '8px' }}>
          MANAGER DESK #01 - AUTHORIZED
        </span>
      </div>

      {wireStatus && (
        <div style={{ padding: '0.85rem 1.25rem', background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#059669', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          {wireStatus}
        </div>
      )}

      {/* Wire Transfers Approvals Table */}
      <div className="glass-card" style={{ padding: '1.75rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>Pending High-Value Wire Sign-Offs</h2>
            <p style={{ fontSize: '0.8rem', color: '#64748B' }}>Requires Dual-Control Manager Sign-Off before RTGS/SWIFT dispatch.</p>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#D97706', background: '#FEF3C7', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>
            {pendingWires.length} Wires Awaiting Sign-Off
          </span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.85rem 1rem' }}>Wire Ref ID</th>
              <th style={{ padding: '0.85rem 1rem' }}>Customer Name</th>
              <th style={{ padding: '0.85rem 1rem' }}>Destination Bank</th>
              <th style={{ padding: '0.85rem 1rem' }}>Wire Amount (₹)</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Manager Sign-Off</th>
            </tr>
          </thead>
          <tbody>
            {pendingWires.map((wire) => (
              <tr key={wire.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '0.9rem 1rem', fontWeight: 800, fontFamily: 'monospace', color: '#2563EB' }}>{wire.id}</td>
                <td style={{ padding: '0.9rem 1rem', fontWeight: 700, color: '#0F172A' }}>{wire.customerName}</td>
                <td style={{ padding: '0.9rem 1rem', color: '#475569', fontSize: '0.88rem' }}>{wire.destBank}</td>
                <td style={{ padding: '0.9rem 1rem', fontWeight: 800, color: '#059669', fontSize: '1rem' }}>
                  ₹{wire.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td style={{ padding: '0.9rem 1rem', textAlign: 'right' }}>
                  <button
                    onClick={() => handleApproveWire(wire)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'linear-gradient(135deg, #10B981, #059669)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <FileCheck style={{ width: '16px', height: '16px' }} /> Authorize Wire
                  </button>
                </td>
              </tr>
            ))}
            {pendingWires.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#059669', fontWeight: 700 }}>
                  ✅ All pending wire transfers have been authorized and dispatched!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Vault Cash Audit Box */}
      <div className="glass-card" style={{ padding: '1.75rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>Branch Cash Vault Dual-Control Audit</h2>
            <p style={{ fontSize: '0.8rem', color: '#64748B' }}>Perform physical cash count verification and dual-custody vault lock check.</p>
          </div>
          <button
            onClick={handleAudVault}
            style={{
              padding: '0.75rem 1.4rem',
              background: '#2563EB',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.88rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <RefreshCw style={{ width: '16px', height: '16px' }} /> Run Vault Audit Now
          </button>
        </div>

        {vaultStatus && (
          <div style={{ padding: '0.75rem 1rem', background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#2563EB', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, marginTop: '1rem' }}>
            {vaultStatus}
          </div>
        )}
      </div>

    </div>
  );
};
