import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Eye, CreditCard, ShieldAlert } from 'lucide-react';

export const CustomerSearchPage = ({ onSelectCustomer, triggerDeniedAction }) => {
  const { customers, hasPermission, recordActivityToBackend } = useAuth();
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

    recordActivityToBackend('/api/v1/customer/profile', 'READ', 1, false);
    onSelectCustomer(customer);
  };

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '1150px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
            Customer Account & Product Registry
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748B' }}>
            Live corporate banking customer search, active balance inquiry, and issued EMV debit cards.
          </p>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="glass-card" style={{ padding: '0.75rem 1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
        <Search style={{ color: '#64748B', width: '20px', height: '20px' }} />
        <input
          type="text"
          placeholder="Search by customer name or ID (e.g. Robert, VIP-9001)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#0F172A',
            width: '100%',
            fontSize: '0.95rem',
            outline: 'none'
          }}
        />
      </div>

      {/* Customer Roster Table */}
      <div className="glass-card" style={{ padding: '1.5rem', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.85rem 1rem' }}>Account No.</th>
              <th style={{ padding: '0.85rem 1rem' }}>Customer Name</th>
              <th style={{ padding: '0.85rem 1rem' }}>Account Tier</th>
              <th style={{ padding: '0.85rem 1rem' }}>Active EMV Cards</th>
              <th style={{ padding: '0.85rem 1rem' }}>Live Balance</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((cust) => {
              const isHoney = cust.type === 'DECOY_HONEY_TRAP';
              const isVip = cust.type === 'VIP_CONFIDENTIAL';
              const cardCount = cust.issuedCards ? cust.issuedCards.length : 0;

              return (
                <tr key={cust.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.9rem 1rem', fontWeight: 800, fontFamily: 'monospace', color: isHoney ? '#DC2626' : isVip ? '#D97706' : '#2563EB' }}>
                    {cust.id}
                  </td>
                  <td style={{ padding: '0.9rem 1rem', fontWeight: 700, color: '#0F172A' }}>
                    {cust.name}
                    {isHoney && <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', background: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5', padding: '2px 6px', borderRadius: '4px' }}>HONEY TRAP</span>}
                  </td>
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: isVip ? '#FEF3C7' : '#EFF6FF', color: isVip ? '#D97706' : '#2563EB', border: isVip ? '1px solid #FDE68A' : '1px solid #BFDBFE' }}>
                      {cust.category}
                    </span>
                  </td>
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: cardCount > 0 ? '#F3E8FF' : '#F1F5F9', color: cardCount > 0 ? '#7C3AED' : '#64748B', border: cardCount > 0 ? '1px solid #DDD6FE' : '1px solid #E2E8F0', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <CreditCard style={{ width: '14px', height: '14px' }} />
                      {cardCount > 0 ? `${cardCount} Card${cardCount > 1 ? 's' : ''} Issued` : 'No Active Cards'}
                    </span>
                  </td>
                  <td style={{ padding: '0.9rem 1rem', fontWeight: 800, color: '#059669', fontSize: '1rem' }}>
                    ₹{cust.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '0.9rem 1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => handleViewCustomer(cust)}
                      style={{
                        padding: '0.45rem 0.85rem',
                        background: isHoney ? '#FEF2F2' : '#F0FDF4',
                        color: isHoney ? '#DC2626' : '#059669',
                        border: isHoney ? '1px solid #FCA5A5' : '1px solid #A7F3D0',
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <Eye style={{ width: '14px', height: '14px' }} /> View Profile
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
