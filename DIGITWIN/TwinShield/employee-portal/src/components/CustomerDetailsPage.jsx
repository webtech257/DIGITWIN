import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, ShieldCheck, CreditCard, Award, CheckCircle2, Calendar, FileText, ArrowUpRight } from 'lucide-react';

export const CustomerDetailsPage = ({ customer: initialCustomer, onBack }) => {
  const { customers, transactions } = useAuth();
  if (!initialCustomer) return null;

  // Always use live updated customer state matching ID
  const customer = customers.find((c) => c.id === initialCustomer.id) || initialCustomer;
  const customerTxns = transactions.filter((t) => t.customerId === customer.id);
  const cards = customer.issuedCards || [];

  return (
    <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '950px', margin: '0 auto' }}>
      
      {/* Light Frosted Back Button */}
      <button
        onClick={onBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.6rem 1.1rem',
          background: '#FFFFFF',
          color: '#334155',
          borderRadius: '8px',
          border: '1px solid #CBD5E1',
          marginBottom: '1.5rem',
          fontSize: '0.875rem',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)',
          transition: 'all 0.2s ease'
        }}
      >
        <ArrowLeft style={{ width: '16px', height: '16px', color: '#059669' }} />
        Back to Customer Search
      </button>

      {/* Main Customer Details Container */}
      <div className="glass-card" style={{ padding: '2.25rem', background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)', borderRadius: '16px', marginBottom: '2rem' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: '#2563EB', fontFamily: 'monospace', fontWeight: 800, background: '#EFF6FF', padding: '3px 8px', borderRadius: '4px', border: '1px solid #BFDBFE' }}>
              {customer.id}
            </span>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: '0.5rem', letterSpacing: '-0.5px' }}>
              {customer.name}
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.2rem' }}>
              Category: <strong style={{ color: '#334155' }}>{customer.category || customer.type}</strong>
            </p>
          </div>

          <span style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            padding: '6px 14px',
            borderRadius: '20px',
            background: customer.type === 'VIP_CONFIDENTIAL' ? '#FEF3C7' : customer.type === 'DECOY_HONEY_TRAP' ? '#FEF2F2' : '#ECFDF5',
            color: customer.type === 'VIP_CONFIDENTIAL' ? '#D97706' : customer.type === 'DECOY_HONEY_TRAP' ? '#DC2626' : '#059669',
            border: customer.type === 'VIP_CONFIDENTIAL' ? '1px solid #FDE68A' : customer.type === 'DECOY_HONEY_TRAP' ? '1px solid #FCA5A5' : '1px solid #A7F3D0'
          }}>
            {customer.type}
          </span>
        </div>

        {/* Crisp Light Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>
          
          {/* Available Balance Box */}
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
              <CreditCard style={{ width: '15px', height: '15px', color: '#059669' }} /> Live Account Balance
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#059669', marginTop: '0.4rem' }}>
              ₹{typeof customer.balance === 'number' ? customer.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : customer.balance}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.25rem' }}>Verified Live Core Banking Ledger</div>
          </div>

          {/* Sensitivity Level Box */}
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
              <Award style={{ width: '15px', height: '15px', color: '#D97706' }} /> Sensitivity Classification
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#D97706', marginTop: '0.4rem' }}>
              Score {customer.sensitivity || (customer.type === 'VIP_CONFIDENTIAL' ? 95 : 30)} / 100
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.25rem' }}>Zero-Trust Telemetry Risk Matrix</div>
          </div>

        </div>

        {/* --- DYNAMIC SECTION: ISSUED EMV DEBIT CARDS --- */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard style={{ color: '#7C3AED', width: '22px', height: '22px' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                Issued Active EMV Debit Cards ({cards.length})
              </h3>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7C3AED', background: '#F3E8FF', padding: '3px 10px', borderRadius: '6px', border: '1px solid #DDD6FE' }}>
              LIVE CARD REGISTRY
            </span>
          </div>

          {cards.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {cards.map((card, idx) => (
                <div key={idx} style={{
                  background: 'linear-gradient(135deg, #1E293B, #0F172A)',
                  color: '#FFFFFF',
                  padding: '1.25rem',
                  borderRadius: '14px',
                  boxShadow: '0 8px 20px rgba(15, 23, 42, 0.15)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Apex Bank EMV Debit
                    </span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, background: '#10B981', color: '#FFFFFF', padding: '2px 8px', borderRadius: '10px' }}>
                      {card.status || 'ACTIVE'}
                    </span>
                  </div>

                  <div style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '2px', fontFamily: 'monospace', color: '#F8FAFC', marginBottom: '0.75rem' }}>
                    {card.cardNumber}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.75rem', color: '#CBD5E1' }}>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: '#94A3B8', textTransform: 'uppercase' }}>Card Product Tier</div>
                      <div style={{ fontWeight: 700, color: '#38BDF8' }}>{card.cardType}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.65rem', color: '#94A3B8', textTransform: 'uppercase' }}>Issued Date</div>
                      <div style={{ fontWeight: 600 }}>{card.issuedDate}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '1.25rem', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', color: '#64748B', fontSize: '0.88rem', textTransform: 'center' }}>
              ℹ️ No debit cards issued to this account yet. Use the Teller Operations Workbench to issue a new EMV Card.
            </div>
          )}
        </div>

        {/* --- DYNAMIC SECTION: CUSTOMER TRANSACTION HISTORY --- */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText style={{ color: '#2563EB', width: '22px', height: '22px' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                Account Transaction Audit Ledger ({customerTxns.length})
              </h3>
            </div>
          </div>

          {customerTxns.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 0.85rem' }}>Txn Ref</th>
                  <th style={{ padding: '0.75rem 0.85rem' }}>Action Type</th>
                  <th style={{ padding: '0.75rem 0.85rem' }}>Channel / Note</th>
                  <th style={{ padding: '0.75rem 0.85rem' }}>Time</th>
                  <th style={{ padding: '0.75rem 0.85rem', textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {customerTxns.map((tx) => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '0.75rem 0.85rem', fontWeight: 800, fontFamily: 'monospace', color: '#2563EB', fontSize: '0.85rem' }}>{tx.id}</td>
                    <td style={{ padding: '0.75rem 0.85rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' }}>
                        {tx.type}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 0.85rem', fontSize: '0.82rem', color: '#475569' }}>{tx.channel}</td>
                    <td style={{ padding: '0.75rem 0.85rem', fontSize: '0.78rem', color: '#64748B' }}>{tx.date}</td>
                    <td style={{ padding: '0.75rem 0.85rem', textAlign: 'right', fontWeight: 800, color: '#059669', fontSize: '0.9rem' }}>
                      {tx.amount > 0 ? `₹${tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹0.00'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', color: '#64748B', fontSize: '0.85rem' }}>
              No recent teller or manager transactions logged for this account.
            </div>
          )}
        </div>

        {/* Security Telemetry Audit Banner */}
        <div style={{ padding: '1rem 1.25rem', background: '#ECFDF5', borderRadius: '10px', border: '1px solid #A7F3D0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldCheck style={{ color: '#059669', width: '22px', height: '22px', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#065F46' }}>Telemetry Event Dispatched</div>
            <div style={{ fontSize: '0.78rem', color: '#047857', marginTop: '0.1rem' }}>This profile access event has been logged to Spring Boot telemetry & SOC digital twin risk engine.</div>
          </div>
        </div>

      </div>
    </div>
  );
};
