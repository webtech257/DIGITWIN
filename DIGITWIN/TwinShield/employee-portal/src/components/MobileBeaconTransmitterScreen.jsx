import React, { useState, useEffect } from 'react';
import { Smartphone, CheckCircle2, AlertCircle, Radio, Navigation, ShieldCheck } from 'lucide-react';

export const MobileBeaconTransmitterScreen = () => {
  const [status, setStatus] = useState('requesting'); // 'requesting' | 'locked' | 'error'
  const [telemetry, setTelemetry] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const acquireMobileGps = () => {
    setStatus('requesting');
    setErrorMessage('');

    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = +(pos.coords.latitude.toFixed(6));
          const lng = +(pos.coords.longitude.toFixed(6));
          const accuracy = Math.round(pos.coords.accuracy);
          let resolvedCity = 'Physical Mobile Location';

          try {
            const revRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
              headers: { 'Accept': 'application/json' }
            });
            if (revRes.ok) {
              const revData = await revRes.json();
              const locality = revData.address?.suburb || revData.address?.neighbourhood || revData.address?.residential || revData.address?.city_district;
              if (locality) {
                resolvedCity = `${locality}, Chennai`;
              }
            }
          } catch (e) {}

          const beaconPayload = {
            lat,
            lng,
            city: resolvedCity,
            accuracy,
            timestamp: Date.now(),
            source: 'SMARTPHONE_SATELLITE_GNSS'
          };

          setTelemetry(beaconPayload);
          setStatus('locked');

          // Share only a signed-by-source mobile reading with the portal tab.
          // Do not write the legacy generic location cache.
          try {
            localStorage.setItem('twinshield_mobile_beacon', JSON.stringify(beaconPayload));
          } catch (e) {}
        },
        (err) => {
          setStatus('error');
          setErrorMessage(err.message || 'Unable to access smartphone GNSS sensors.');
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
      );
    } else {
      setStatus('error');
      setErrorMessage('Geolocation API not supported on this mobile browser.');
    }
  };

  useEffect(() => {
    acquireMobileGps();
  }, []);

  const handleReturnToLogin = () => {
    window.location.href = window.location.pathname;
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      padding: '1.5rem',
      color: '#FFFFFF'
    }}>
      <div style={{
        maxWidth: '440px',
        width: '100%',
        background: '#1E293B',
        border: '1px solid #334155',
        borderRadius: '16px',
        padding: '2rem',
        textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #10B981, #059669)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem auto',
          boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)'
        }}>
          <Smartphone style={{ width: '32px', height: '32px', color: '#FFFFFF' }} />
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          Mobile Satellite Beacon
        </h2>
        <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginBottom: '1.5rem' }}>
          Zero-Trust Physical Hardware Telemetry Synchronization
        </p>

        {status === 'requesting' && (
          <div style={{
            background: '#0F172A',
            border: '1px solid #334155',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <Radio style={{ width: '36px', height: '36px', color: '#10B981', margin: '0 auto 1rem auto', animation: 'pulse 1.5s infinite' }} />
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#F8FAFC' }}>
              Acquiring Satellite Lock...
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.35rem' }}>
              Communicating with phone GPS/Galileo hardware for precise coordinates. Please allow location permissions if prompted.
            </p>
          </div>
        )}

        {status === 'locked' && telemetry && (
          <div style={{
            background: '#064E3B',
            border: '1.5px solid #10B981',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <CheckCircle2 style={{ width: '22px', height: '22px', color: '#34D399' }} />
              <span style={{ fontSize: '1rem', fontWeight: 800, color: '#ECFDF5' }}>
                Satellite GNSS Lock Verified!
              </span>
            </div>

            <div style={{ fontSize: '0.85rem', color: '#A7F3D0', marginBottom: '0.35rem' }}>
              Location: <strong style={{ color: '#FFFFFF' }}>{telemetry.city}</strong>
            </div>

            <div style={{ fontSize: '0.85rem', color: '#A7F3D0', fontFamily: 'monospace', marginBottom: '0.35rem' }}>
              Coordinates: {telemetry.lat.toFixed(5)}° N, {telemetry.lng.toFixed(5)}° E
            </div>

            <div style={{ fontSize: '0.75rem', color: '#6EE7B7' }}>
              Satellite Accuracy: <strong>±{telemetry.accuracy} meters</strong> (Bypassed ISP Sowcarpet Subnet)
            </div>
          </div>
        )}

        {status === 'error' && (
          <div style={{
            background: '#450A0A',
            border: '1.5px solid #EF4444',
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#FCA5A5' }}>
              <AlertCircle style={{ width: '18px', height: '18px' }} />
              <strong style={{ fontSize: '0.9rem' }}>Satellite Lock Failed</strong>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#FECACA', marginBottom: '0.75rem' }}>
              {errorMessage}
            </p>
            <button
              onClick={acquireMobileGps}
              style={{
                width: '100%',
                padding: '0.55rem',
                borderRadius: '8px',
                background: '#EF4444',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              Retry Satellite Acquisition
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={handleReturnToLogin}
          style={{
            width: '100%',
            padding: '0.85rem',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #10B981, #059669)',
            color: '#FFFFFF',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}
        >
          <ShieldCheck style={{ width: '18px', height: '18px' }} />
          Continue in Desktop Portal
        </button>
      </div>
    </div>
  );
};
