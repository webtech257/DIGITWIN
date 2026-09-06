import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { UserPlus, X, User, Mail, Building2, Shield, Clock, Laptop, Sparkles } from 'lucide-react';

export const EmployeeProvisioningModal = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [empId, setEmpId] = useState(`EMP${Math.floor(1000 + Math.random() * 8999)}`);
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Retail Banking Operations');
  const [roleId, setRoleId] = useState('ROLE_CUST_SERVICE');
  const [startHour, setStartHour] = useState('09:00');
  const [endHour, setEndHour] = useState('17:00');
  const [device, setDevice] = useState(`BANK-PC-${empId}`);
  const [status, setStatus] = useState('ACTIVE');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    if (val.trim()) {
      const slug = val.trim().toLowerCase().replace(/\s+/g, '.');
      setEmail(`${slug}@twinshield-bank.internal`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        id: empId,
        name: name.trim(),
        email: email || `${empId.toLowerCase()}@twinshield-bank.internal`,
        department,
        roleId,
        normalStartHour: startHour,
        normalEndHour: endHour,
        device,
        status
      });
      onClose();
    } catch (err) {
      console.error('Failed to provision employee:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalContent = (
    <div style={{
      position: 'fixed',
      inset: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 999999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(16px) saturate(190%)',
      WebkitBackdropFilter: 'blur(16px) saturate(190%)',
      padding: '1.5rem',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      
      {/* TRUE FROSTED GLASSMORMIC CARD */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.55)',
        backdropFilter: 'blur(35px) saturate(220%)',
        WebkitBackdropFilter: 'blur(35px) saturate(220%)',
        borderRadius: '24px',
        border: '1.5px solid rgba(255, 255, 255, 0.85)',
        boxShadow: '0 30px 60px -12px rgba(16, 185, 129, 0.25), 0 18px 40px rgba(31, 38, 135, 0.12), inset 0 1px 2px 0 rgba(255, 255, 255, 0.95)',
        width: '100%',
        maxWidth: '720px',
        maxHeight: '92vh',
        overflowY: 'auto',
        padding: '2.5rem',
        position: 'relative'
      }}>
        
        {/* Frosted Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.75rem',
            right: '1.75rem',
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.9)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#475569',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
            transition: 'all 0.2s ease'
          }}
        >
          <X style={{ width: '20px', height: '20px' }} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1.5px solid rgba(255, 255, 255, 0.7)', paddingBottom: '1.5rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)',
            flexShrink: 0
          }}>
            <UserPlus style={{ color: '#FFFFFF', width: '26px', height: '26px' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
              Provision Bank Employee Identity
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#475569', marginTop: '0.2rem', fontWeight: 500 }}>
              Formally configure RBAC roles, identity details, and digital twin telemetry parameters.
            </p>
          </div>
        </div>

        {/* Translucent Glass Inputs Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
          
          {/* Field 1 & 2: Name & ID */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.15rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.45rem' }}>
                <User style={{ width: '15px', height: '15px', color: '#059669' }} /> Full Employee Name <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Nishanthi Subbiah"
                value={name}
                onChange={handleNameChange}
                required
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  background: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(10px)',
                  border: '1.5px solid rgba(255, 255, 255, 0.9)',
                  borderRadius: '12px',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  color: '#0F172A',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E293B', display: 'block', marginBottom: '0.45rem' }}>
                Employee ID
              </label>
              <input
                type="text"
                value={empId}
                onChange={(e) => setEmpId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  background: 'rgba(238, 242, 255, 0.85)',
                  backdropFilter: 'blur(10px)',
                  border: '1.5px solid rgba(199, 210, 254, 0.9)',
                  borderRadius: '12px',
                  fontSize: '0.92rem',
                  fontFamily: 'monospace',
                  fontWeight: 800,
                  color: '#2563EB',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Field 3 & 4: Email & Department */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.15rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.45rem' }}>
                <Mail style={{ width: '15px', height: '15px', color: '#2563EB' }} /> Corporate Work Email
              </label>
              <input
                type="email"
                placeholder="e.g. nishanthi@twinshield-bank.internal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  background: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(10px)',
                  border: '1.5px solid rgba(255, 255, 255, 0.9)',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  color: '#0F172A',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.45rem' }}>
                <Building2 style={{ width: '15px', height: '15px', color: '#D97706' }} /> Bank Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  background: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(10px)',
                  border: '1.5px solid rgba(255, 255, 255, 0.9)',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  color: '#0F172A',
                  fontWeight: 700,
                  outline: 'none'
                }}
              >
                <option value="Retail Banking Operations">Retail Banking Operations</option>
                <option value="Branch Management & Credit">Branch Management & Credit</option>
                <option value="IT Systems & Security">IT Systems & Security</option>
                <option value="Compliance & AML Regulatory Audit">Compliance & AML Regulatory Audit</option>
              </select>
            </div>
          </div>

          {/* Field 5: Assigned RBAC Role */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.45rem' }}>
              <Shield style={{ width: '15px', height: '15px', color: '#059669' }} /> Assigned Operational RBAC Role <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                background: 'rgba(236, 253, 245, 0.85)',
                backdropFilter: 'blur(10px)',
                border: '1.5px solid rgba(167, 243, 208, 0.9)',
                borderRadius: '12px',
                fontSize: '0.92rem',
                fontWeight: 800,
                color: '#059669',
                outline: 'none'
              }}
            >
              <option value="ROLE_CUST_SERVICE">Retail Teller / Customer Service (ROLE_CUST_SERVICE)</option>
              <option value="ROLE_MANAGER">Branch Operations Manager (ROLE_MANAGER)</option>
              <option value="ROLE_ADMIN">IT Systems & Security Administrator (ROLE_ADMIN)</option>
              <option value="ROLE_COMPLIANCE">Compliance Officer (ROLE_COMPLIANCE)</option>
            </select>
          </div>

          {/* Field 6 & 7: Working Hours & Device Fingerprint */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.15rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.45rem' }}>
                <Clock style={{ width: '15px', height: '15px', color: '#2563EB' }} /> Working Hours Baseline (IST)
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="text"
                  value={startHour}
                  onChange={(e) => setStartHour(e.target.value)}
                  placeholder="09:00"
                  style={{ width: '50%', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.7)', border: '1.5px solid rgba(255, 255, 255, 0.9)', borderRadius: '10px', fontSize: '0.88rem', textAlign: 'center', fontWeight: 700 }}
                />
                <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 700 }}>to</span>
                <input
                  type="text"
                  value={endHour}
                  onChange={(e) => setEndHour(e.target.value)}
                  placeholder="17:00"
                  style={{ width: '50%', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.7)', border: '1.5px solid rgba(255, 255, 255, 0.9)', borderRadius: '10px', fontSize: '0.88rem', textAlign: 'center', fontWeight: 700 }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.45rem' }}>
                <Laptop style={{ width: '15px', height: '15px', color: '#7C3AED' }} /> Primary Device Fingerprint
              </label>
              <input
                type="text"
                value={device}
                onChange={(e) => setDevice(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(10px)',
                  border: '1.5px solid rgba(255, 255, 255, 0.9)',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontFamily: 'monospace',
                  fontWeight: 700
                }}
              />
            </div>
          </div>

          {/* Frosted Glass Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.25rem', paddingTop: '1.5rem', borderTop: '1.5px solid rgba(255, 255, 255, 0.7)' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.85rem 1.6rem',
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(10px)',
                color: '#475569',
                border: '1.5px solid rgba(255, 255, 255, 0.9)',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '0.85rem 2rem',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)'
              }}
            >
              <Sparkles style={{ width: '18px', height: '18px' }} />
              {isSubmitting ? 'Provisioning...' : 'Provision Employee & Sync Baseline'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
