import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Eye, Lock } from 'lucide-react';

const SYNTHETIC_CUSTOMERS = [
  { id: 'CUST-8012', name: 'Robert Chen', type: 'STANDARD', balance: '$12,450.00', status: 'Active', category: 'Standard Retail' },
  { id: 'CUST-8013', name: 'Anita Sharma', type: 'STANDARD', balance: '$45,800.00', status: 'Active', category: 'Standard Retail' },
  { id: 'CUST-8014', name: 'David Miller', type: 'STANDARD', balance: '$8,920.00', status: 'Active', category: 'Standard Retail' },
  { id: 'VIP-9001', name: 'Victor Vance (Executive)', type: 'VIP_CONFIDENTIAL', balance: '$8,450,000.00', status: 'Active', category: 'VIP Private Client' },
  { id: 'VIP-9002', name: 'Elena Rostova (Global VIP)', type: 'VIP_CONFIDENTIAL', balance: '$14,200,000.00', status: 'Active', category: 'VIP Private Client' },
  { id: 'EXEC-9003', name: 'CEO Personal Account #9001 (Honey Resource Decoy Trap)', type: 'DECOY_HONEY_TRAP', balance: '$25,400,000.00', status: 'Active', category: 'Executive Escrow (Honey Token)' }
];

export const CustomerSearchPage = ({ onSelectCustomer, triggerDeniedAction }) => {
  const { hasPermission, recordActivityToBackend } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const handleViewCustomer = (customer) => {
    if (customer.type === 'DECOY_HONEY_TRAP' || customer.id === 'EXEC-9003' || customer.id === 'DECOY-9999') {
      console.log('🚨 Decoy Honey Target Triggered!');
      recordActivityToBackend('/api/v1/decoy/vip-customer-internal-001', 'EXPORT_PAYLOAD', 300, true);
      return;
    }

    if (customer.type === 'VIP_CONFIDENTIAL' && !hasPermission('vip:read')) {
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
          <p style={{ fontSize: '0.875rem', color: '#94A3B8' }}>Corporate banking customer database & account lookup.</p>
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
              <th style={{ padding: '1rem' }}>Portfolio Tier</th>
              <th style={{ padding: '1rem' }}>Balance</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((customer) => {
              const isDecoy = customer.type === 'DECOY_HONEY_TRAP' || customer.id === 'EXEC-9003';
              const isVip = customer.type === 'VIP_CONFIDENTIAL' || isDecoy;
              // Decoy target MUST BE 100% accessible to entice attacker into clicking
              const canAccess = isDecoy ? true : (!isVip || hasPermission('vip:read'));

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
                      background: isDecoy ? 'rgba(239, 68, 68, 0.2)' : isVip ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.15)',
                      color: isDecoy ? '#F87171' : isVip ? '#FBBF24' : '#34D399'
                    }}>
                      {isDecoy ? 'HONEY_DECOY_TRAP' : customer.type}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: '#94A3B8', fontSize: '0.85rem' }}>
                    {customer.category}
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
                        border: canAccess ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                        cursor: 'pointer'
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
