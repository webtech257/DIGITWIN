import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth, DEFAULT_PERSONAS } from '../context/AuthContext';
import { User, ShieldCheck, Clock, Monitor, Key, Check, Edit3, X, Phone, MapPin, Mail, Upload, Camera, Lock } from 'lucide-react';

export const ProfilePage = () => {
  const { currentUser, updateUserProfile } = useAuth();

  // Robust defensive fallbacks
  const user = currentUser && currentUser.id ? currentUser : DEFAULT_PERSONAS[0];

  const empId = user.id || 'EMP1024';
  const name = user.name || 'Malavika';
  const roleName = user.roleName || 'Customer Service Representative';
  const department = user.department || 'Retail Banking';
  const email = user.email || `${empId.toLowerCase()}@twinshield-bank.internal`;
  const avatar = user.avatar || '';
  const startHour = user.normalStartHour || '09:00';
  const endHour = user.normalEndHour || '18:00';
  const phone = user.phone || '+91 98765 10240';
  const location = user.location || 'Chennai HQ - Desk #04 (SOC Designated)';

  const permissions = Array.isArray(user.permissions) && user.permissions.length > 0
    ? user.permissions
    : ['customer:read', 'transaction:read'];

  // Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editDept, setEditDept] = useState(department);
  const [editEmail, setEditEmail] = useState(email);
  const [editPhone, setEditPhone] = useState(phone);
  const [editAvatar, setEditAvatar] = useState(avatar);
  const [saveToast, setSaveToast] = useState('');

  const handleOpenModal = () => {
    setEditName(name);
    setEditDept(department);
    setEditEmail(email);
    setEditPhone(phone);
    setEditAvatar(avatar);
    setIsModalOpen(true);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUserProfile({
      name: editName,
      department: editDept,
      email: editEmail,
      phone: editPhone,
      avatar: editAvatar
    });
    setIsModalOpen(false);
    setSaveToast('✅ Profile photo & contact details updated successfully!');
    setTimeout(() => setSaveToast(''), 5000);
  };

  const isPhotoAvatar = avatar && (avatar.startsWith('data:image') || avatar.startsWith('http'));
  const isEditPhotoAvatar = editAvatar && (editAvatar.startsWith('data:image') || editAvatar.startsWith('http'));

  return (
    <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '980px', margin: '0 auto' }}>
      
      {/* Header Bar */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
            Employee Identity Profile
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748B' }}>
            Banking employee credentials, photo ID & digital twin baseline parameters.
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          style={{
            padding: '0.65rem 1.25rem',
            background: 'linear-gradient(135deg, #059669, #047857)',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.88rem',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem'
          }}
        >
          <Camera style={{ width: '16px', height: '16px' }} /> Upload Photo / Edit Profile
        </button>
      </div>

      {saveToast && (
        <div style={{ padding: '0.85rem 1.25rem', background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#059669', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          {saveToast}
        </div>
      )}

      {/* Main Profile Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        
        {/* Left Column: Photo & Core Badges */}
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px' }}>
          
          {/* Profile Photo Display */}
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            {isPhotoAvatar ? (
              <img
                src={avatar}
                alt={name}
                style={{
                  width: '108px',
                  height: '108px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #059669',
                  boxShadow: '0 6px 16px rgba(5, 150, 105, 0.2)'
                }}
              />
            ) : (
              <div style={{ background: '#F8FAFC', width: '108px', height: '108px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #CBD5E1', color: '#64748B', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)' }}>
                <User style={{ width: '52px', height: '52px', color: '#059669' }} />
              </div>
            )}
            
            <button
              onClick={handleOpenModal}
              title="Upload New Profile Photo"
              style={{
                position: 'absolute',
                bottom: '2px',
                right: '2px',
                background: '#059669',
                color: '#FFFFFF',
                border: '2px solid #FFFFFF',
                borderRadius: '50%',
                padding: '6px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Camera style={{ width: '14px', height: '14px' }} />
            </button>
          </div>

          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>{name}</h2>
          <p style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 700, marginTop: '0.25rem' }}>{roleName}</p>
          
          <div style={{ width: '100%', borderTop: '1px solid #E2E8F0', marginTop: '1.5rem', paddingTop: '1rem', textAlign: 'left' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Employee ID</div>
            <div style={{ fontSize: '0.95rem', color: '#0F172A', fontWeight: 800, fontFamily: 'monospace', marginBottom: '0.75rem' }}>{empId}</div>

            <div style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Department</div>
            <div style={{ fontSize: '0.9rem', color: '#0F172A', fontWeight: 700, marginBottom: '0.75rem' }}>{department}</div>

            <div style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Email Address</div>
            <div style={{ fontSize: '0.85rem', color: '#2563EB', fontWeight: 600 }}>{email}</div>
          </div>
        </div>

        {/* Right Column: Contact Details, SOC Designated Location, RBAC & Digital Twin Baseline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Contact & Workstation Card */}
          <div className="glass-card" style={{ padding: '1.5rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Phone style={{ color: '#2563EB', width: '20px', height: '20px' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>Workstation & Contact Profile</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: '#F8FAFC', padding: '0.85rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Direct Phone Line</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', marginTop: '0.2rem', fontFamily: 'monospace' }}>
                  {phone}
                </div>
              </div>

              {/* READ-ONLY SOC DESIGNATED WORKSTATION LOCATION */}
              <div style={{ background: '#FEF3C7', padding: '0.85rem', borderRadius: '10px', border: '1px solid #FDE68A' }}>
                <div style={{ fontSize: '0.72rem', color: '#D97706', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem', textTransform: 'uppercase' }}>
                  <Lock style={{ width: '13px', height: '13px' }} /> SOC Security Designated Location
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#92400E', marginTop: '0.2rem' }}>
                  📍 {location}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#B45309', marginTop: '0.15rem' }}>
                  Protected Policy Parameter (SOC Admin Only)
                </div>
              </div>
            </div>
          </div>

          {/* RBAC Permissions Box */}
          <div className="glass-card" style={{ padding: '1.5rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Key style={{ color: '#059669', width: '20px', height: '20px' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>Assigned RBAC Permissions</h3>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              {permissions.map((perm) => (
                <div key={perm} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.85rem',
                  background: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  borderRadius: '6px',
                  color: '#059669',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}>
                  <Check style={{ width: '14px', height: '14px' }} />
                  <code>{perm}</code>
                </div>
              ))}
            </div>
          </div>

          {/* Behavioral Digital Twin Baseline Box */}
          <div className="glass-card" style={{ padding: '1.5rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Clock style={{ color: '#2563EB', width: '20px', height: '20px' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>Behavioral Digital Twin Baseline</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Working Hours Baseline</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginTop: '0.25rem' }}>
                  {startHour} – {endHour} IST
                </div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Recognized Device</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#2563EB', marginTop: '0.25rem', fontFamily: 'monospace' }}>
                  BANK-PC-{empId}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* --- EDIT PROFILE GLASS MODAL --- */}
      {isModalOpen && createPortal(
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(15, 23, 42, 0.35)',
          backdropFilter: 'blur(16px)',
          padding: '1.5rem'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(30px) saturate(200%)',
            border: '1.5px solid rgba(255, 255, 255, 0.9)',
            borderRadius: '20px',
            padding: '2rem',
            width: '100%',
            maxWidth: '580px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.15)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>Upload Profile Photo & Details</h2>
                <p style={{ fontSize: '0.8rem', color: '#64748B' }}>Update employee credentials for ID: {empId}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748B', padding: '0.4rem', borderRadius: '50%' }}
              >
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Photo Upload Section */}
              <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '14px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A', display: 'block', marginBottom: '0.75rem' }}>
                  📸 Profile Photo Upload (PNG, JPG, WEBP)
                </label>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem' }}>
                  {isEditPhotoAvatar ? (
                    <img
                      src={editAvatar}
                      alt="Preview"
                      style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #059669' }}
                    />
                  ) : (
                    <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #CBD5E1' }}>
                      <User style={{ width: '36px', height: '36px', color: '#059669' }} />
                    </div>
                  )}

                  <div style={{ textAlign: 'left' }}>
                    <label style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.6rem 1.25rem',
                      background: 'linear-gradient(135deg, #059669, #047857)',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)'
                    }}>
                      <Upload style={{ width: '15px', height: '15px' }} /> Upload Photo File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                    <p style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.35rem' }}>
                      Select a PNG, JPG, or WEBP photo from your computer.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.7rem', background: 'rgba(255,255,255,0.7)', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>Department</label>
                  <input
                    type="text"
                    value={editDept}
                    onChange={(e) => setEditDept(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem', background: 'rgba(255,255,255,0.7)', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 600 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>Direct Phone</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem', background: 'rgba(255,255,255,0.7)', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem', fontFamily: 'monospace' }}
                  />
                </div>
              </div>

              {/* READ-ONLY SOC DESIGNATED NOTICE */}
              <div style={{ padding: '0.75rem 1rem', background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock style={{ width: '16px', height: '16px', color: '#D97706', flexShrink: 0 }} />
                <div style={{ fontSize: '0.78rem', color: '#92400E', fontWeight: 600 }}>
                  <strong>Workstation / Branch Location:</strong> {location} (SOC Designated — Cannot be altered by employee).
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', background: 'rgba(255,255,255,0.7)', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 600 }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ flex: 1, padding: '0.75rem', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '8px', fontWeight: 700, color: '#475569', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '0.75rem', background: 'linear-gradient(135deg, #059669, #047857)', border: 'none', borderRadius: '8px', fontWeight: 800, color: '#FFFFFF', cursor: 'pointer', boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)' }}
                >
                  Save Profile Updates
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
