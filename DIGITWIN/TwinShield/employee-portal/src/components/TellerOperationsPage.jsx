import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DollarSign, CheckCircle2, FileText, CreditCard, ShieldCheck, ArrowUpRight, Search, User } from 'lucide-react';

export const TellerOperationsPage = () => {
  const { customers, depositCashToCustomer, clearChequeForCustomer, issueDebitCardForCustomer } = useAuth();
  
  // Cash Deposit Form State
  const [selectedCustId, setSelectedCustId] = useState(customers[0]?.id || 'CUST-8012');
  const [depositAmount, setDepositAmount] = useState('');
  const [depositNote, setDepositNote] = useState('Cash Deposit at Teller Desk');
  const [depositStatus, setDepositStatus] = useState('');

  // MICR Cheque Clearing State
  const [chequeCustId, setChequeCustId] = useState(customers[1]?.id || 'CUST-8013');
  const [chequeNo, setChequeNo] = useState('440812');
  const [drawerName, setDrawerName] = useState('HDFC Corp clearing');
  const [chequeAmount, setChequeAmount] = useState('150000');
  const [chequeStatus, setChequeStatus] = useState('');

  // EMV Debit Card Issuance State
  const [cardCustId, setCardCustId] = useState(customers[0]?.id || 'CUST-8012');
  const [cardType, setCardType] = useState('RuPay Platinum EMV');
  const [cardStatus, setCardStatus] = useState('');

  const handleDepositSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt <= 0) return;

    const result = depositCashToCustomer(selectedCustId, amt, depositNote);
    const target = customers.find(c => c.id === selectedCustId);
    
    setDepositStatus(`✅ Successfully deposited ₹${amt.toLocaleString('en-IN')} to ${target?.name || selectedCustId}! New Balance: ₹${result.newBalance.toLocaleString('en-IN')}`);
    setDepositAmount('');
    setTimeout(() => setDepositStatus(''), 6000);
  };

  const handleChequeSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(chequeAmount);
    if (isNaN(amt) || amt <= 0) return;

    const result = clearChequeForCustomer(chequeCustId, chequeNo, amt, drawerName);
    const target = customers.find(c => c.id === chequeCustId);

    setChequeStatus(`✅ MICR Cheque #${chequeNo} (₹${amt.toLocaleString('en-IN')}) Cleared for ${target?.name}! New Balance: ₹${result.newBalance.toLocaleString('en-IN')}`);
    setTimeout(() => setChequeStatus(''), 6000);
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();
    const result = issueDebitCardForCustomer(cardCustId, cardType);
    const target = customers.find(c => c.id === cardCustId);

    setCardStatus(`💳 ${cardType} Issued to ${target?.name}! Card No: ${result.cardNumber}`);
    setTimeout(() => setCardStatus(''), 6000);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign style={{ color: '#059669', width: '28px', height: '28px' }} />
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
              Retail Teller Operations Workbench
            </h1>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '0.25rem' }}>
            Live customer account deposits, MICR cheque clearance, and EMV debit card issuance desk.
          </p>
        </div>

        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#059669', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '6px 14px', borderRadius: '8px' }}>
          TELLER WINDOW #04 - ACTIVE LIVE
        </span>
      </div>

      {/* Live Customers Quick Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {customers.slice(0, 4).map((cust) => (
          <div key={cust.id} className="glass-card" style={{ padding: '1.25rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', fontFamily: 'monospace' }}>{cust.id}</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, background: cust.type.includes('VIP') ? '#FEF3C7' : '#EFF6FF', color: cust.type.includes('VIP') ? '#D97706' : '#2563EB', padding: '2px 8px', borderRadius: '4px' }}>
                {cust.category}
              </span>
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>{cust.name}</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669', marginTop: '0.35rem' }}>
              ₹{cust.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>
        ))}
      </div>

      {/* Main Operations Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* 1. Cash Deposit Desk */}
        <div className="glass-card" style={{ padding: '1.75rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.85rem' }}>
            <div style={{ background: '#ECFDF5', padding: '0.5rem', borderRadius: '8px' }}>
              <DollarSign style={{ color: '#059669', width: '22px', height: '22px' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>Over-the-Counter Cash Deposit</h2>
              <p style={{ fontSize: '0.78rem', color: '#64748B' }}>Deducts or deposits cash live into customer account balance.</p>
            </div>
          </div>

          {depositStatus && (
            <div style={{ padding: '0.75rem 1rem', background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#059669', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem' }}>
              {depositStatus}
            </div>
          )}

          <form onSubmit={handleDepositSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                Select Customer Account
              </label>
              <select
                value={selectedCustId}
                onChange={(e) => setSelectedCustId(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.id}) - Current: ₹{c.balance.toLocaleString('en-IN')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                Deposit Amount (Indian Rupee ₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 50000"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 700, color: '#059669' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                Transaction Remarks / Teller Memo
              </label>
              <input
                type="text"
                value={depositNote}
                onChange={(e) => setDepositNote(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem' }}
              />
            </div>

            <button
              type="submit"
              style={{
                marginTop: '0.5rem',
                padding: '0.8rem 1.5rem',
                background: 'linear-gradient(135deg, #10B981, #059669)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.9rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <ArrowUpRight style={{ width: '18px', height: '18px' }} /> Process Cash Deposit Live
            </button>
          </form>
        </div>

        {/* 2. MICR Cheque Clearing Desk */}
        <div className="glass-card" style={{ padding: '1.75rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.85rem' }}>
            <div style={{ background: '#EFF6FF', padding: '0.5rem', borderRadius: '8px' }}>
              <FileText style={{ color: '#2563EB', width: '22px', height: '22px' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>MICR Inward Cheque Clearance</h2>
              <p style={{ fontSize: '0.78rem', color: '#64748B' }}>Inward clearing settlement for intra-bank & inter-bank cheques.</p>
            </div>
          </div>

          {chequeStatus && (
            <div style={{ padding: '0.75rem 1rem', background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#2563EB', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem' }}>
              {chequeStatus}
            </div>
          )}

          <form onSubmit={handleChequeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                Beneficiary Account
              </label>
              <select
                value={chequeCustId}
                onChange={(e) => setChequeCustId(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.id}) - Current: ₹{c.balance.toLocaleString('en-IN')}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                  6-Digit MICR Cheque No.
                </label>
                <input
                  type="text"
                  value={chequeNo}
                  onChange={(e) => setChequeNo(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem', fontFamily: 'monospace' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                  Clearing Amount (₹)
                </label>
                <input
                  type="number"
                  value={chequeAmount}
                  onChange={(e) => setChequeAmount(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 700, color: '#2563EB' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                Drawee Bank / Payor Name
              </label>
              <input
                type="text"
                value={drawerName}
                onChange={(e) => setDrawerName(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem' }}
              />
            </div>

            <button
              type="submit"
              style={{
                marginTop: '0.5rem',
                padding: '0.8rem 1.5rem',
                background: '#2563EB',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.9rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <CheckCircle2 style={{ width: '18px', height: '18px' }} /> Execute Inward Cheque Clearing
            </button>
          </form>
        </div>

      </div>

      {/* 3. Debit Card Issuance Bar */}
      <div className="glass-card" style={{ padding: '1.75rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <CreditCard style={{ color: '#7C3AED', width: '24px', height: '24px' }} />
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>EMV Chip Debit Card Issuance Desk</h2>
            <p style={{ fontSize: '0.78rem', color: '#64748B' }}>Issue personalized EMV contactless debit cards to verified customers.</p>
          </div>
        </div>

        {cardStatus && (
          <div style={{ padding: '0.75rem 1rem', background: '#F3E8FF', border: '1px solid #DDD6FE', color: '#7C3AED', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem' }}>
            {cardStatus}
          </div>
        )}

        <form onSubmit={handleCardSubmit} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr auto', gap: '1rem', alignItems: 'flex-end' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>Target Customer</label>
            <select
              value={cardCustId}
              onChange={(e) => setCardCustId(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 700 }}
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.id})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>EMV Card Product Tier</label>
            <select
              value={cardType}
              onChange={(e) => setCardType(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 700 }}
            >
              <option value="RuPay Platinum EMV Contactless">RuPay Platinum EMV Contactless</option>
              <option value="Visa Signature International">Visa Signature International</option>
              <option value="Mastercard World Elite">Mastercard World Elite</option>
            </select>
          </div>

          <button
            type="submit"
            style={{
              padding: '0.75rem 1.4rem',
              background: '#7C3AED',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.88rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Issue EMV Card
          </button>
        </form>
      </div>

    </div>
  );
};
