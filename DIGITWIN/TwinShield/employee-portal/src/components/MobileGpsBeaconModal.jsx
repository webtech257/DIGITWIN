import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, MapPin, Navigation, RefreshCw, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const formatCoordinates = (geo) => {
  if (geo?.lat == null || geo?.lng == null) return 'Not shared';
  return `${Number(geo.lat).toFixed(6)}°, ${Number(geo.lng).toFixed(6)}°`;
};

export const MobileGpsBeaconModal = ({ isOpen, onClose }) => {
  const { liveGeo, updateLocationManually } = useAuth();
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

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
          // A reverse-geocoding failure must not discard a valid device reading.
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
        setError(geoError.message || 'Location permission was not granted.');
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="location-verification-title" style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15, 23, 42, 0.65)', display: 'grid', placeItems: 'center', padding: '1rem' }}>
      <section style={{ width: 'min(100%, 560px)', borderRadius: '16px', overflow: 'hidden', background: '#FFFFFF', boxShadow: '0 24px 60px rgba(15, 23, 42, 0.3)' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.1rem 1.25rem', borderBottom: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ display: 'grid', placeItems: 'center', width: 38, height: 38, borderRadius: 10, background: '#EFF6FF', color: '#2563EB' }}><MapPin size={20} /></div>
            <div>
              <h2 id="location-verification-title" style={{ margin: 0, color: '#0F172A', fontSize: '1rem' }}>Device location verification</h2>
              <p style={{ margin: '0.15rem 0 0', color: '#64748B', fontSize: '0.75rem' }}>Uses browser Location Services after your permission.</p>
            </div>
          </div>
          <button type="button" aria-label="Close location verification" onClick={onClose} style={{ border: 'none', background: 'transparent', color: '#64748B', cursor: 'pointer', padding: 6 }}><X size={20} /></button>
        </header>

        <div style={{ padding: '1.25rem' }}>
          <div style={{ padding: '1rem', borderRadius: 10, background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'grid', gap: '0.55rem', fontSize: '0.83rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}><span style={{ color: '#64748B' }}>Status</span><strong style={{ color: liveGeo?.isPrecise ? '#047857' : '#92400E' }}>{liveGeo?.isPrecise ? 'Verified device location' : 'Location not shared'}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}><span style={{ color: '#64748B' }}>Coordinates</span><span style={{ color: '#0F172A', fontFamily: 'monospace' }}>{formatCoordinates(liveGeo)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}><span style={{ color: '#64748B' }}>Accuracy</span><span style={{ color: '#0F172A' }}>{liveGeo?.accuracyMeters != null ? `±${liveGeo.accuracyMeters} m` : 'Unavailable'}</span></div>
          </div>

          <p style={{ margin: '1rem 0', color: '#475569', fontSize: '0.8rem', lineHeight: 1.5 }}>
            Network/IP information is retained only for connection security. It is never converted into a street-level device location.
          </p>

          {error && <div role="alert" style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem', borderRadius: 8, background: '#FEF2F2', color: '#B91C1C', fontSize: '0.8rem' }}><AlertCircle size={16} />{error}</div>}
          {success && <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem', borderRadius: 8, background: '#ECFDF5', color: '#047857', fontSize: '0.8rem' }}><CheckCircle2 size={16} />{success}</div>}
        </div>

        <footer style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', padding: '1rem 1.25rem', borderTop: '1px solid #E2E8F0' }}>
          <button type="button" onClick={onClose} style={{ padding: '0.55rem 0.85rem', border: '1px solid #CBD5E1', borderRadius: 8, background: '#FFFFFF', color: '#334155', cursor: 'pointer', fontWeight: 700 }}>Close</button>
          <button type="button" onClick={requestDeviceLocation} disabled={isRequesting} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 0.85rem', border: 'none', borderRadius: 8, background: '#2563EB', color: '#FFFFFF', cursor: isRequesting ? 'wait' : 'pointer', fontWeight: 700, opacity: isRequesting ? 0.7 : 1 }}>
            {isRequesting ? <RefreshCw size={16} /> : <Navigation size={16} />}{isRequesting ? 'Verifying…' : 'Verify device location'}
          </button>
        </footer>
      </section>
    </div>
  );
};
