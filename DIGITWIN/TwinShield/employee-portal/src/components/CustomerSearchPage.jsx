import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Users, ShieldAlert, Eye, Lock } from 'lucide-react';

const SYNTHETIC_CUSTOMERS = [
  { id: 'CUST-8012', name: 'Robert Chen', type: 'STANDARD', balance: '$12,450.00', status: 'Active', sensitivity: 30 },
  { id: 'CUST-8013', name: 'Anita Sharma', type: 'STANDARD', balance: '$45,800.00', status: 'Active', sensitivity: 30 },
  { id: 'CUST-8014', name: 'David Miller', type: 'STANDARD', balance: '$8,920.00', status: 'Active', sensitivity: 30 },
  { id: 'VIP-9001', name: 'Victor Vance (Executive)', type: 'VIP_CONFIDENTIAL', balance: '$8,450,000.00', status: 'Active', sensitivity: 90 },
  { id: 'VIP-9002', name: 'Elena Rostova (Global VIP)', type: 'VIP_CONFIDENTIAL', balance: '$14,200,000.00', status: 'Active', sensitivity: 90 },
  { id: 'DECOY-9999', name: '🚨 CONFIDENTIAL HONEY VAULT (DECOY TRAP)', type: 'DECOY_HONEY_TRAP', balance: '$999,999,999.00', status: 'TRAP_ACTIVE', sensitivity: 100 }
];

export const CustomerSearchPage = ({ onSelectCustomer, triggerDeniedAction }) => {
  const { currentUser, hasPermission, recordActivityToBackend } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const handleViewCustomer = (customer) => {
    if (customer.type === 'DECOY_HONEY_TRAP') {
      recordActivityToBackend('/api/v1/decoy/vip-customer-internal-001', 'EXPORT_PAYLOAD', 300, true);
      triggerDeniedAction(
        '/api/v1/decoy/vip-customer-internal-001',
        'CRITICAL DECOY HONEY TRAP ACCESS DETECTED (100% Risk Isolation)',
        'decoy:quarantine'
      );
      return;
    }

    if (customer.type === 'VIP_CONFIDENTIAL' && !hasPermission('vip:read')) {
      // Trigger Access Denied & send activity telemetry to backend
      triggerDeniedAction(
        '/api/v1/vip/customers',
        `Unauthorized VIP Lookup for ${customer.name} (${customer.id})`,
        'vip:read'
      );
      return;
    }

    // Normal allowed action
    recordActivityToBackend('/api/v1/customer/profile', 'READ', 1, false);
    onSelectCustomer(customer);
  };


  const filtered = SYNTHETIC_CUSTOMERS.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F8FAFC' }}>Customer Profile Search</h1>
          <p style={{ fontSize: '0.875rem', color: '#94A3B8' }}>Synthetic banking customer database & account lookup.</p>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="glass-card" style={{ padding: '0.75rem 1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Search style={{ color: '#94A3B8', width: '20px', height: '20px' }} />
        <input
          type="text"
          placeholder="Search by customer name or ID (e.g. Robert, VIP-9001)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#F8FAFC',
            width: '100%',
            fontSize: '0.95rem'
          }}
        />
      </div>

      {/* Customers Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#0F172A', borderBottom: '1px solid #334155', color: '#94A3B8', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '1rem' }}>Customer ID</th>
              <th style={{ padding: '1rem' }}>Name</th>
              <th style={{ padding: '1rem' }}>Account Type</th>
              <th style={{ padding: '1rem' }}>Sensitivity</th>
              <th style={{ padding: '1rem' }}>Balance</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((customer) => {
              const isVip = customer.type === 'VIP_CONFIDENTIAL';
              const canAccess = !isVip || hasPermission('vip:read');

              return (
                <tr key={customer.id} style={{ borderBottom: '1px solid #334155', transition: 'background 0.2s ease' }}>
                  <td style={{ padding: '1rem', fontWeight: 600, fontFamily: 'monospace', color: isVip ? '#F59E0B' : '#60A5FA' }}>
                    {customer.id}
                  </td>
                  <td style={{ padding: '1rem', color: '#F8FAFC', fontWeight: 500 }}>
                    {customer.name}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: '12px',
                      background: isVip ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.15)',
                      color: isVip ? '#FBBF24' : '#34D399'
                    }}>
                      {customer.type}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: '#94A3B8', fontSize: '0.85rem' }}>
                    Sensitivity {customer.sensitivity}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 600, color: '#F8FAFC' }}>
                    {customer.balance}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => handleViewCustomer(customer)}
                      style={{
                        padding: '0.4rem 0.85rem',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        background: canAccess ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: canAccess ? '#34D399' : '#F87171',
                        border: canAccess ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)'
                      }}
                    >
                      {canAccess ? <Eye style={{ width: '14px', height: '14px' }} /> : <Lock style={{ width: '14px', height: '14px' }} />}
                      {canAccess ? 'View Profile' : 'Restricted (VIP)'}
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
