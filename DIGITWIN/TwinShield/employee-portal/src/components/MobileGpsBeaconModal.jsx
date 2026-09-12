import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, MapPin, Navigation, RefreshCw, X, Building2, ShieldAlert, Laptop } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const formatCoordinates = (geo) => {
  if (geo?.lat == null || geo?.lng == null) return 'Not shared';
  return `${Number(geo.lat).toFixed(6)}°, ${Number(geo.lng).toFixed(6)}°`;
};

const PRESET_LOCATIONS = [
  {
    id: 'chennai-hq',
    name: 'Chennai Central HQ (Retail Desk #04)',
    lat: 13.0827,
    lng: 80.2707,
    city: 'Chennai Central HQ - Retail Desk #04',
    accuracyMeters: 12,
    badge: 'Authorized Baseline',
    color: '#059669',
    icon: Building2
  },
  {
    id: 'guindy-ops',
    name: 'Guindy Operations Hub (Executive Suite)',
    lat: 12.9815,
    lng: 80.2180,
    city: 'Guindy Operations Hub - Executive Suite',
    accuracyMeters: 15,
    badge: 'Operations Campus',
    color: '#2563EB',
    icon: Building2
  },
  {
    id: 'soc-nungambakkam',
    name: 'Nungambakkam SOC (Security Terminal)',
    lat: 13.0524,
    lng: 80.2508,
    city: 'Nungambakkam SOC - Security Terminal',
    accuracyMeters: 10,
    badge: 'SOC Perimeter',
    color: '#7C3AED',
    icon: Laptop
  },
  {
    id: 'threat-london',
    name: 'Simulate Threat: London Canary Wharf (Impossible Travel)',
    lat: 51.5074,
    lng: -0.1278,
    city: 'Canary Wharf, London, UK',
    accuracyMeters: 25,
    badge: 'Breach Vector',
    color: '#DC2626',
    icon: ShieldAlert
  }
];

export const MobileGpsBeaconModal = ({ isOpen, onClose }) => {
  const { liveGeo, updateLocationManually } = useAuth();
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSelectPreset = (preset) => {
    setError('');
    updateLocationManually({
      lat: preset.lat,
      lng: preset.lng,
      city: preset.city,
      accuracyMeters: preset.accuracyMeters,
      isPrecise: true,
      locationSource: preset.id === 'threat-london' ? 'MANUAL' : 'DESIGNATED_CAMPUS'
    });
    setSuccess(`Active working location calibrated to ${preset.name}.`);
  };

  const requestDeviceLocation = () => {
    setError('');
    setSuccess('');
    if (!navigator.geolocation) {
      setError('This browser does not support Location Services.');
      return;
    }

    setIsRequesting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = Number(position.coords.latitude.toFixed(6));
        const lng = Number(position.coords.longitude.toFixed(6));
        const accuracyMeters = Math.round(position.coords.accuracy);
        let city = 'Precise device location';

        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
            headers: { Accept: 'application/json' }
          });
          if (response.ok) {
            const address = (await response.json()).address || {};
            city = address.suburb || address.neighbourhood || address.city_district || address.city || city;
          }
        } catch (_) {
          // Keep best effort city
        }

        updateLocationManually?.({
          lat,
          lng,
          city,
          accuracyMeters,
          isPrecise: true,
          locationSource: 'BROWSER_LOCATION'
        });
        setIsRequesting(false);
        setSuccess(`Device location verified (estimated accuracy ±${accuracyMeters} m).`);
      },
      (geoError) => {
        setIsRequesting(false);
        setError(`Browser location unavailable (${geoError.message || 'Permission denied'}). Preserving current campus baseline.`);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
    );
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="location-verification-title" style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15, 23, 42, 0.65)', display: 'grid', placeItems: 'center', padding: '1rem' }}>
      <section style={{ width: 'min(100%, 620px)', borderRadius: '16px', overflow: 'hidden', background: '#FFFFFF', boxShadow: '0 24px 60px rgba(15, 23, 42, 0.3)', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.1rem 1.25rem', borderBottom: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ display: 'grid', placeItems: 'center', width: 38, height: 38, borderRadius: 10, background: '#EFF6FF', color: '#2563EB' }}><MapPin size={20} /></div>
            <div>
              <h2 id="location-verification-title" style={{ margin: 0, color: '#0F172A', fontSize: '1.05rem', fontWeight: 800 }}>Employee Physical Location Calibration</h2>
              <p style={{ margin: '0.15rem 0 0', color: '#64748B', fontSize: '0.78rem' }}>TwinShield Behavioral Zero-Trust Geofence Synchronization</p>
            </div>
          </div>
          <button type="button" aria-label="Close location verification" onClick={onClose} style={{ border: 'none', background: 'transparent', color: '#64748B', cursor: 'pointer', padding: 6 }}><X size={20} /></button>
        </header>

        <div style={{ padding: '1.25rem', overflowY: 'auto' }}>
          {/* Active Status Display */}
          <div style={{ padding: '0.9rem 1.1rem', borderRadius: 12, background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'grid', gap: '0.55rem', fontSize: '0.84rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <span style={{ color: '#64748B', fontWeight: 600 }}>Active Working Location:</span>
              <strong style={{ color: '#0F172A' }}>{liveGeo?.city || 'Chennai Central HQ'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <span style={{ color: '#64748B', fontWeight: 600 }}>Live Coordinates:</span>
              <span style={{ color: '#2563EB', fontFamily: 'monospace', fontWeight: 700 }}>{formatCoordinates(liveGeo)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <span style={{ color: '#64748B', fontWeight: 600 }}>Zero-Trust Geofence Status:</span>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '12px',
                background: liveGeo?.lat && Math.abs(liveGeo.lat - 13.0827) > 3.0 ? '#FEF2F2' : '#ECFDF5',
                color: liveGeo?.lat && Math.abs(liveGeo.lat - 13.0827) > 3.0 ? '#DC2626' : '#059669',
                border: `1px solid ${liveGeo?.lat && Math.abs(liveGeo.lat - 13.0827) > 3.0 ? '#FCA5A5' : '#86EFAC'}`
              }}>
                {liveGeo?.lat && Math.abs(liveGeo.lat - 13.0827) > 3.0 ? '🚨 IMPOSSIBLE TRAVEL BREACH' : '✓ Authorized Corporate Perimeter'}
              </span>
            </div>
          </div>

          {/* Quick Presets Section */}
          <div style={{ marginTop: '1.25rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Select Designated Campus or Test Scenario:
            </div>
            <div style={{ display: 'grid', gap: '0.6rem' }}>
              {PRESET_LOCATIONS.map((preset) => {
                const IconComponent = preset.icon;
                const isCurrent = liveGeo?.lat != null && Math.abs(liveGeo.lat - preset.lat) < 0.005 && Math.abs(liveGeo.lng - preset.lng) < 0.005;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: `1.5px solid ${isCurrent ? preset.color : '#E2E8F0'}`,
                      background: isCurrent ? `${preset.color}0D` : '#FFFFFF',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${preset.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: preset.color }}>
                        <IconComponent size={17} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0F172A' }}>{preset.name}</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748B', fontFamily: 'monospace' }}>
                          {preset.lat.toFixed(4)}° N, {preset.lng.toFixed(4)}° E
                        </div>
                      </div>
                    </div>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: `${preset.color}15`,
                      color: preset.color
                    }}>
                      {isCurrent ? 'ACTIVE' : preset.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {error && <div role="alert" style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', padding: '0.75rem', borderRadius: 8, background: '#FEF2F2', color: '#B91C1C', fontSize: '0.8rem' }}><AlertCircle size={16} />{error}</div>}
          {success && <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', padding: '0.75rem', borderRadius: 8, background: '#ECFDF5', color: '#047857', fontSize: '0.8rem' }}><CheckCircle2 size={16} />{success}</div>}
        </div>

        <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.6rem', padding: '1rem 1.25rem', borderTop: '1px solid #E2E8F0', background: '#FAFAFA' }}>
          <button type="button" onClick={requestDeviceLocation} disabled={isRequesting} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 0.95rem', border: '1px solid #CBD5E1', borderRadius: 8, background: '#FFFFFF', color: '#0F172A', cursor: isRequesting ? 'wait' : 'pointer', fontWeight: 700, fontSize: '0.8rem', opacity: isRequesting ? 0.7 : 1 }}>
            {isRequesting ? <RefreshCw size={15} className="animate-spin" /> : <Navigation size={15} />}{isRequesting ? 'Detecting…' : 'Auto-Detect Browser GPS'}
          </button>
          <button type="button" onClick={onClose} style={{ padding: '0.55rem 1.1rem', border: 'none', borderRadius: 8, background: '#2563EB', color: '#FFFFFF', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' }}>Done</button>
        </footer>
      </section>
    </div>
  );
};
