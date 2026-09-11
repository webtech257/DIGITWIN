import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSOC } from '../context/SOCContext';
import { OverviewSection } from './OverviewSection';
import { 
  Globe, 
  MapPin, 
  Activity, 
  RefreshCw, 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Radio, 
  Lock, 
  Key, 
  Maximize2, 
  Minimize2, 
  Sliders, 
  Crosshair, 
  Wifi, 
  AlertTriangle, 
  Compass, 
  Layers, 
  Clock, 
  Navigation,
  Eye,
  KeyRound,
  CheckCircle2,
  X
} from 'lucide-react';

// Tile layer endpoints (Normal Google Maps roadmap, Google Satellite, SOC Dark)
const TILE_CONFIGS = {
  'google-normal': {
    name: 'Normal Google Maps',
    url: 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    options: {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; Google Maps'
    }
  },
  'google-satellite': {
    name: 'Google Satellite Hybrid',
    url: 'https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    options: {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; Google Maps'
    }
  },
  'google-dark': {
    name: 'Cyber SOC Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    options: {
      maxZoom: 19,
      subdomains: 'abcd',
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    }
  }
};

// Official SOC Cyber Dark Google Maps Theme
const SOC_MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#090d16' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#090d16' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#1e293b' }, { weight: 1.5 }] },
  { featureType: 'administrative.province', elementType: 'geometry.stroke', stylers: [{ color: '#1e293b' }, { weight: 0.8 }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#cbd5e1' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#64748b' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#090d16' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#64748b' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2563eb' }, { lightness: -40 }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1e293b' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#040711' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#38bdf8' }] }
];

// Corporate branch geofences around main banking hubs
const CORPORATE_BRANCHES = [
  { id: 'HQ', name: 'Chennai Central HQ & Core Banking Desk', lat: 13.0827, lng: 80.2707, radiusMeters: 3500 },
  { id: 'TECH', name: 'Guindy Tech Park Operations Hub', lat: 12.9815, lng: 80.2180, radiusMeters: 2500 },
  { id: 'SOC', name: 'Nungambakkam SOC Command Facility', lat: 13.0524, lng: 80.2508, radiusMeters: 2000 }
];

// Dynamically map real GPS coordinates to 2D Radar HUD percentage positions
const getRadarCoordinates = (lat, lng) => {
  if (!lat || !lng) return { left: '50%', top: '50%' };
  const minLng = 68.0, maxLng = 88.0;
  const minLat = 8.0, maxLat = 30.0;
  const left = Math.min(Math.max(((lng - minLng) / (maxLng - minLng)) * 100, 15), 85);
  const top = Math.min(Math.max((1 - (lat - minLat) / (maxLat - minLat)) * 100, 15), 85);
  return { left: `${left.toFixed(1)}%`, top: `${top.toFixed(1)}%` };
};

export const GlobalOverviewView = () => {
  const { 
    employees, 
    isolatedSessions, 
    handleRestoreSession, 
    handleRequireMFA, 
    handleDisableAccount,
    telemetryRefreshRate,
    setTelemetryRefreshRate,
    lastTelemetrySyncTime,
    refreshLocations
  } = useSOC();

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [mapMode, setMapMode] = useState('google-normal'); // 'google-normal' | 'google-satellite' | 'google-dark' | 'radar-hud'
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'RISK' | 'ISOLATED'
  const [countdown, setCountdown] = useState(telemetryRefreshRate || 5);
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [mapsLoaded, setMapsLoaded] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [telemetryLogs, setTelemetryLogs] = useState([]);

  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersLayerGroupRef = useRef(null);
  const geofencesLayerGroupRef = useRef(null);

  // Filtered employees according to filter chip
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      if (filterStatus === 'ONLINE') return emp.isOnline;
      if (filterStatus === 'ACTIVE') return emp.isOnline && (emp.status === 'NORMAL' || emp.status === 'ACTIVE');
      if (filterStatus === 'RISK') return emp.isOnline && emp.riskScore >= 60 && emp.status !== 'ISOLATED';
      if (filterStatus === 'ISOLATED') return emp.status === 'ISOLATED' || emp.status === 'SUSPENDED';
      if (filterStatus === 'OFFLINE') return !emp.isOnline;
      return true;
    });
  }, [employees, filterStatus]);

  // Telemetry countdown timer effect
  useEffect(() => {
    if (telemetryRefreshRate <= 0) return;
    setCountdown(telemetryRefreshRate);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return telemetryRefreshRate;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [telemetryRefreshRate, lastTelemetrySyncTime]);

  // Log incoming telemetry coordinates into the live feed ticker for ONLINE users only
  useEffect(() => {
    const onlineList = employees.filter((e) => e.isOnline && e.geo && e.geo.lat);
    if (onlineList.length > 0) {
      const now = new Date().toLocaleTimeString();
      const newEntries = onlineList.map((e) => ({
        id: `${e.id}-${Date.now()}-${Math.random()}`,
        time: now,
        empId: e.id,
        name: e.name,
        lat: e.geo.lat,
        lng: e.geo.lng,
        city: e.geo.city || 'Chennai',
        risk: e.riskScore || 0,
        status: e.status || 'NORMAL',
        isAnomaly: e.geo?.isImpossibleTravel || false
      }));

      setTelemetryLogs((prev) => [...newEntries, ...prev].slice(0, 20));
    }
  }, [lastTelemetrySyncTime, employees]);

  // --- INITIALIZE LEAFLET MAP (Google Maps Standard / Satellite / Dark) ---
  useEffect(() => {
    if (!mapRef.current) return;

    if (!leafletMapRef.current) {
      // Find active online user to center map, or default to Chennai
      const firstTarget = employees.find((e) => e.isOnline && e.geo?.lat);
      const centerLat = firstTarget?.geo?.lat || 13.0827;
      const centerLng = firstTarget?.geo?.lng || 80.2707;
      const initialZoom = firstTarget ? 13 : 11;

      const map = L.map(mapRef.current, {
        center: [centerLat, centerLng],
        zoom: initialZoom,
        zoomControl: true,
        attributionControl: true
      });

      const config = TILE_CONFIGS['google-normal'];
      const tileLayer = L.tileLayer(config.url, config.options).addTo(map);
      tileLayerRef.current = tileLayer;

      const geofencesGroup = L.layerGroup().addTo(map);
      const markersGroup = L.layerGroup().addTo(map);
      geofencesLayerGroupRef.current = geofencesGroup;
      markersLayerGroupRef.current = markersGroup;

      leafletMapRef.current = map;
      setMapsLoaded(true);
    }

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // --- UPDATE TILE LAYER ON MAP MODE SWITCH ---
  useEffect(() => {
    if (!leafletMapRef.current || !tileLayerRef.current) return;
    if (mapMode === 'radar-hud') return;

    const config = TILE_CONFIGS[mapMode] || TILE_CONFIGS['google-normal'];
    tileLayerRef.current.setUrl(config.url);
    tileLayerRef.current.options.subdomains = config.options.subdomains;
    tileLayerRef.current.options.maxZoom = config.options.maxZoom;

    setTimeout(() => {
      leafletMapRef.current?.invalidateSize();
    }, 150);
  }, [mapMode]);

  // --- UPDATE MAP MARKERS & GEOFENCES FOR ONLINE USERS ONLY ---
  useEffect(() => {
    if (!leafletMapRef.current || !markersLayerGroupRef.current || !geofencesLayerGroupRef.current) return;
    if (mapMode === 'radar-hud') return;

    const map = leafletMapRef.current;
    const markersGroup = markersLayerGroupRef.current;
    const geofencesGroup = geofencesLayerGroupRef.current;

    markersGroup.clearLayers();
    geofencesGroup.clearLayers();

    // 1. Draw Corporate Branch Geofence Perimeters
    CORPORATE_BRANCHES.forEach((branch) => {
      const circle = L.circle([branch.lat, branch.lng], {
        radius: branch.radiusMeters,
        color: '#0284C7',
        fillColor: '#38BDF8',
        fillOpacity: 0.08,
        weight: 1.5,
        dashArray: '5, 5'
      });
      circle.bindTooltip(`<b>${branch.name}</b><br/>Perimeter: ${branch.radiusMeters / 1000}km`, {
        direction: 'top'
      });
      geofencesGroup.addLayer(circle);
    });

    // 2. Add Employee Markers ONLY for actively online sessions
    const onlineList = filteredEmployees.filter((emp) => emp.isOnline && emp.geo && emp.geo.lat);

    onlineList.forEach((emp) => {
      const lat = emp.geo.lat;
      const lng = emp.geo.lng;
      const isIsolated = emp.status === 'ISOLATED' || emp.status === 'SUSPENDED';
      const isRisk = (emp.riskScore || 0) >= 70;
      
      const glowColor = isIsolated ? '#EF4444' : isRisk ? '#F59E0B' : '#10B981';
      const badgeBg = isIsolated ? '#7F1D1D' : isRisk ? '#78350F' : '#064E3B';
      const badgeText = `${emp.riskScore || 0}%`;

      const customIcon = L.divIcon({
        className: 'twinshield-live-pin',
        html: `
          <div style="position: relative; cursor: pointer; display: flex; flex-direction: column; align-items: center;">
            <!-- Radar Ping Wave -->
            <div style="position: absolute; top: 12px; left: 50%; transform: translate(-50%, -50%); width: 44px; height: 44px; border-radius: 50%; background: ${glowColor}; opacity: 0.4; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite; pointer-events: none;"></div>
            
            <!-- Live Core Pin -->
            <div style="position: relative; z-index: 10; background: #0F172A; border: 2.5px solid ${glowColor}; box-shadow: 0 0 16px ${glowColor}, 0 4px 12px rgba(0,0,0,0.5); padding: 5px 12px; border-radius: 24px; color: #FFFFFF; font-weight: 700; font-size: 12px; white-space: nowrap; display: flex; align-items: center; gap: 6px;">
              <span style="width: 9px; height: 9px; border-radius: 50%; background: ${glowColor}; box-shadow: 0 0 8px ${glowColor}"></span>
              <span style="letter-spacing: 0.3px;">${emp.name}</span>
              <span style="background: ${badgeBg}; color: ${glowColor}; padding: 1px 6px; border-radius: 10px; font-size: 10px; font-weight: 800;">${badgeText}</span>
            </div>

            <!-- Coordinate Tag -->
            <div style="margin-top: 4px; font-family: monospace; font-size: 10px; color: #F1F5F9; background: rgba(15, 23, 42, 0.92); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.25); white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.5);">
              ${lat.toFixed(4)}°, ${lng.toFixed(4)}° &bull; ${emp.geo.city || 'Live Device'}
            </div>

            <!-- Pin Anchor Needle -->
            <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 7px solid ${glowColor}; margin-top: -2px;"></div>
          </div>
        `,
        iconSize: [140, 60],
        iconAnchor: [70, 30]
      });

      const marker = L.marker([lat, lng], { icon: customIcon });
      marker.on('click', () => {
        setSelectedEmployee(emp);
      });
      markersGroup.addLayer(marker);

      // If Impossible Travel Anomaly is detected, draw animated vector polyline
      if (emp.geo?.isImpossibleTravel && emp.geo?.baselineLat) {
        const polyline = L.polyline([
          [emp.geo.baselineLat, emp.geo.baselineLng],
          [lat, lng]
        ], {
          color: '#EF4444',
          weight: 3.5,
          dashArray: '8, 8',
          opacity: 0.9
        });
        polyline.bindTooltip(`⚠️ Impossible Travel Anomaly: ${emp.geo.city || 'External'}`, {
          permanent: true,
          direction: 'center'
        });
        markersGroup.addLayer(polyline);
      }
    });

    // Auto-pan to first online user smoothly
    if (onlineList.length > 0) {
      map.panTo([onlineList[0].geo.lat, onlineList[0].geo.lng], { animate: true });
    }
  }, [filteredEmployees, lastTelemetrySyncTime, mapMode]);

  const handleManualSync = () => {
    setIsSyncing(true);
    refreshLocations();
    setTimeout(() => setIsSyncing(false), 600);
  };

  // Convert decimal degrees to Degrees Minutes Seconds (DMS) string
  const toDMS = (val, isLat) => {
    const absVal = Math.abs(val);
    const degrees = Math.floor(absVal);
    const minutesNotTruncated = (absVal - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(1);
    const direction = isLat ? (val >= 0 ? 'N' : 'S') : (val >= 0 ? 'E' : 'W');
    return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* 1. TOP KPI METRIC CARDS */}
      <OverviewSection />

      {/* 2. MAIN GEO-TRACKING COMMAND CENTER CONTAINER */}
      <div 
        className="glass-card"
        style={{
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(24px) saturate(200%)',
          borderRadius: '16px',
          border: '1.5px solid rgba(226, 232, 240, 0.9)',
          boxShadow: '0 20px 45px -15px rgba(15, 23, 42, 0.08)',
          overflow: 'hidden'
        }}
      >
        {/* Map Header Toolbar */}
        <div style={{
          padding: '1.1rem 1.5rem',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.95))',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* Left Title & Status Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #0EA5E9, #0284C7)',
              padding: '0.55rem',
              borderRadius: '10px',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Globe style={{ width: '22px', height: '22px' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.3px', margin: 0 }}>
                  Global Employee Geo-Intelligence & Location Command Center
                </h2>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: '#ECFDF5',
                  color: '#059669',
                  border: '1px solid #A7F3D0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}>
                  <span className="pulse-led" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
                  REAL-TIME GPS TELEMETRY
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '2px 0 0 0' }}>
                Streaming live coordinates, digital twin network footprints, geofence perimeters, and UEBA impossible travel alerts.
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Auto-Refresh Cadence Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#F8FAFC', padding: '0.35rem 0.65rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.78rem' }}>
              <Clock style={{ width: '13px', height: '13px', color: '#64748B' }} />
              <span style={{ color: '#475569', fontWeight: 600 }}>Sync Every:</span>
              <select 
                value={telemetryRefreshRate}
                onChange={(e) => setTelemetryRefreshRate(Number(e.target.value))}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontWeight: 700,
                  color: '#2563EB',
                  cursor: 'pointer',
                  fontSize: '0.78rem'
                }}
              >
                <option value={3}>3 Seconds (High Speed)</option>
                <option value={5}>5 Seconds (Recommended)</option>
                <option value={10}>10 Seconds</option>
                <option value={30}>30 Seconds</option>
                <option value={0}>Paused</option>
              </select>
              {telemetryRefreshRate > 0 && (
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  color: '#0284C7',
                  background: '#E0F2FE',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  marginLeft: '0.2rem'
                }}>
                  {countdown}s
                </span>
              )}
            </div>

            {/* Manual Sync Now Button */}
            <button
              onClick={handleManualSync}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                background: '#EFF6FF',
                color: '#2563EB',
                border: '1px solid #BFDBFE'
              }}
            >
              <RefreshCw style={{ width: '13px', height: '13px', animation: isSyncing ? 'spin 0.6s linear infinite' : 'none' }} />
              Sync Now
            </button>

            {/* Map Mode Selector */}
            <div style={{ display: 'flex', background: '#F1F5F9', padding: '3px', borderRadius: '8px', border: '1px solid #E2E8F0', gap: '2px' }}>
              <button
                onClick={() => setMapMode('google-normal')}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: mapMode === 'google-normal' ? 700 : 500,
                  background: mapMode === 'google-normal' ? '#2563EB' : 'transparent',
                  color: mapMode === 'google-normal' ? '#FFFFFF' : '#475569',
                  boxShadow: mapMode === 'google-normal' ? '0 1px 3px rgba(37, 99, 235, 0.3)' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                🗺️ Normal Google Maps
              </button>
              <button
                onClick={() => setMapMode('google-satellite')}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: mapMode === 'google-satellite' ? 700 : 500,
                  background: mapMode === 'google-satellite' ? '#2563EB' : 'transparent',
                  color: mapMode === 'google-satellite' ? '#FFFFFF' : '#475569',
                  boxShadow: mapMode === 'google-satellite' ? '0 1px 3px rgba(37, 99, 235, 0.3)' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                🛰️ Satellite
              </button>
              <button
                onClick={() => setMapMode('google-dark')}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: mapMode === 'google-dark' ? 700 : 500,
                  background: mapMode === 'google-dark' ? '#2563EB' : 'transparent',
                  color: mapMode === 'google-dark' ? '#FFFFFF' : '#475569',
                  boxShadow: mapMode === 'google-dark' ? '0 1px 3px rgba(37, 99, 235, 0.3)' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                🌌 SOC Dark
              </button>
              <button
                onClick={() => setMapMode('radar-hud')}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: mapMode === 'radar-hud' ? 700 : 500,
                  background: mapMode === 'radar-hud' ? '#0F172A' : 'transparent',
                  color: mapMode === 'radar-hud' ? '#38BDF8' : '#64748B',
                  boxShadow: mapMode === 'radar-hud' ? '0 1px 3px rgba(15, 23, 42, 0.3)' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                📡 Radar HUD
              </button>
            </div>

            {/* API Key Modal Button */}
            <button
              onClick={() => setShowKeyModal(true)}
              title="Configure Google Maps API Key"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.45rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 600,
                background: apiKey ? '#F0FDF4' : '#FFFBEB',
                color: apiKey ? '#166534' : '#B45309',
                border: apiKey ? '1px solid #BBF7D0' : '1px solid #FDE68A'
              }}
            >
              <KeyRound style={{ width: '13px', height: '13px' }} />
              {apiKey ? 'API Key Active' : 'Configure Key'}
            </button>
          </div>
        </div>

        {/* Filter Chips Bar */}
        <div style={{
          padding: '0.65rem 1.5rem',
          background: '#F8FAFC',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Filter Telemetry:
            </span>
            {[
              { id: 'ALL', label: `All (${employees.length})` },
              { id: 'ONLINE', label: `🟢 Live Online (${employees.filter(e => e.isOnline).length})` },
              { id: 'OFFLINE', label: `⚪ Offline (${employees.filter(e => !e.isOnline).length})` },
              { id: 'RISK', label: `⚠️ Elevated Risk (${employees.filter(e => e.riskScore >= 60 && e.status !== 'ISOLATED').length})` },
              { id: 'ISOLATED', label: `🔴 Quarantined (${employees.filter(e => e.status === 'ISOLATED' || e.status === 'SUSPENDED').length})` }
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => setFilterStatus(chip.id)}
                style={{
                  padding: '0.25rem 0.65rem',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: filterStatus === chip.id ? 700 : 500,
                  background: filterStatus === chip.id ? '#2563EB' : '#FFFFFF',
                  color: filterStatus === chip.id ? '#FFFFFF' : '#475569',
                  border: filterStatus === chip.id ? '1px solid #2563EB' : '1px solid #CBD5E1',
                  boxShadow: filterStatus === chip.id ? '0 2px 6px rgba(37, 99, 235, 0.25)' : 'none'
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: '#64748B' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></span>
              Normal Campus (&lt;50% Risk)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }}></span>
              Elevated Risk (&ge;60% Risk)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }}></span>
              Quarantined / Impossible Travel
            </span>
          </div>
        </div>

        {/* 3. INTERACTIVE MAP VIEWPORT */}
        <div style={{ position: 'relative', width: '100%', height: '560px', background: '#F1F5F9' }}>
          
          {/* Real Interactive Map Canvas (Normal Google Maps / Satellite / SOC Dark) */}
          <div 
            ref={mapRef} 
            style={{ 
              width: '100%', 
              height: '100%', 
              display: mapMode === 'radar-hud' ? 'none' : 'block',
              zIndex: 1
            }} 
          />

          {/* Radar HUD Vector Mode Canvas (Only displayed when user explicitly selects Radar HUD) */}
          {mapMode === 'radar-hud' && (
            <div style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              background: 'radial-gradient(ellipse at center, #0F172A 0%, #060911 100%)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Cyber Radar Grid Background */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `
                  linear-gradient(rgba(56, 189, 248, 0.07) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(56, 189, 248, 0.07) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
                pointerEvents: 'none'
              }} />

              {/* Concentric Radar Distance Rings */}
              <div style={{ position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', border: '1px dashed rgba(56, 189, 248, 0.2)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', width: '420px', height: '420px', borderRadius: '50%', border: '1px dashed rgba(56, 189, 248, 0.15)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', width: '680px', height: '680px', borderRadius: '50%', border: '1px solid rgba(56, 189, 248, 0.1)', pointerEvents: 'none' }} />

              {/* Radar Sweeping Beam */}
              <div style={{
                position: 'absolute',
                width: '700px',
                height: '700px',
                borderRadius: '50%',
                background: 'conic-gradient(from 0deg, rgba(14, 165, 233, 0.25) 0deg, transparent 60deg, transparent 360deg)',
                animation: 'spin 8s linear infinite',
                pointerEvents: 'none'
              }} />

              {/* Dynamic Geofence & Live Online Ping Zones (SVG Overlay) */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                <defs>
                  <radialGradient id="branchGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#0284C7" stopOpacity="0.0" />
                  </radialGradient>
                  <radialGradient id="livePingGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
                  </radialGradient>
                </defs>

                {/* Live Online Ping Radii */}
                {filteredEmployees.filter(e => e.isOnline && e.geo && e.geo.lat).map(emp => {
                  const pos = getRadarCoordinates(emp.geo?.lat, emp.geo?.lng);
                  return (
                    <g key={`live-ring-${emp.id}`}>
                      <circle cx={pos.left} cy={pos.top} r="65" fill="url(#livePingGlow)" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4 3" />
                      <text x={pos.left} y={`calc(${pos.top} + 45px)`} fill="#10B981" fontSize="11" fontWeight="700" textAnchor="middle" opacity="0.95">
                        {emp.geo?.city ? `${emp.geo.city.toUpperCase()} LIVE SECTOR` : 'LIVE ONLINE SECTOR'}
                      </text>
                    </g>
                  );
                })}

                {/* Impossible Travel Vector Arc (if anomaly exists) */}
                {filteredEmployees.filter(e => e.isOnline && e.geo?.isImpossibleTravel).map(emp => {
                  const pos = getRadarCoordinates(emp.geo?.lat, emp.geo?.lng);
                  return (
                    <g key={`anomaly-arc-${emp.id}`}>
                      <path
                        d={`M 61% 77% Q 40% 35% ${pos.left} ${pos.top}`}
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="2.5"
                        strokeDasharray="6 4"
                      />
                      <circle cx={pos.left} cy={pos.top} r="6" fill="#EF4444" />
                      <text x="26%" y="27%" fill="#EF4444" fontSize="11" fontWeight="800">
                        ⚠️ IMPOSSIBLE TRAVEL ANOMALY: {emp.geo?.city?.toUpperCase() || 'EXTERNAL'}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Notice if No Employees are Currently Online */}
              {filteredEmployees.filter(e => e.isOnline && e.geo && e.geo.lat).length === 0 && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  background: 'rgba(15, 23, 42, 0.88)',
                  padding: '1.5rem 2.5rem',
                  borderRadius: '14px',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
                  zIndex: 25
                }}>
                  <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>📡</div>
                  <div style={{ color: '#F8FAFC', fontSize: '0.95rem', fontWeight: 800, letterSpacing: '0.05em' }}>
                    NO LIVE SESSIONS DETECTED
                  </div>
                  <div style={{ color: '#94A3B8', fontSize: '0.78rem', marginTop: '0.35rem', maxWidth: '320px', lineHeight: 1.4 }}>
                    Employees must be logged into the <span style={{ color: '#38BDF8', fontWeight: 600 }}>Employee Portal (port 5173)</span> to transmit real-time GPS coordinates.
                  </div>
                </div>
              )}

              {/* Interactive Markers in Radar HUD Mode - ONLY FOR ONLINE SESSIONS */}
              <div style={{ position: 'absolute', inset: 0 }}>
                {filteredEmployees.filter(e => e.isOnline && e.geo && e.geo.lat).map((emp) => {
                  const isIsolated = emp.status === 'ISOLATED' || emp.status === 'SUSPENDED';
                  const isRisk = emp.riskScore >= 70;
                  const isAnomaly = emp.geo?.isImpossibleTravel;

                  const { left: leftPercent, top: topPercent } = getRadarCoordinates(emp.geo?.lat, emp.geo?.lng);
                  const glowColor = isIsolated ? '#EF4444' : isRisk ? '#F59E0B' : '#10B981';

                  return (
                    <div
                      key={emp.id}
                      onClick={() => setSelectedEmployee(emp)}
                      style={{
                        position: 'absolute',
                        left: leftPercent,
                        top: topPercent,
                        transform: 'translate(-50%, -50%)',
                        cursor: 'pointer',
                        zIndex: 20
                      }}
                    >
                      {/* Pulsating Radar Ping Wave */}
                      <div style={{
                        position: 'absolute',
                        inset: -16,
                        borderRadius: '50%',
                        border: `2px solid ${glowColor}`,
                        animation: 'pulseGlow 2s infinite ease-out',
                        opacity: 0.7,
                        pointerEvents: 'none'
                      }} />

                      {/* Marker Core */}
                      <div style={{
                        background: '#0F172A',
                        padding: '0.35rem 0.65rem',
                        borderRadius: '24px',
                        border: `2px solid ${glowColor}`,
                        boxShadow: `0 0 20px ${glowColor}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        color: '#FFFFFF',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        whiteSpace: 'nowrap'
                      }}>
                        <span style={{
                          width: '9px',
                          height: '9px',
                          borderRadius: '50%',
                          background: glowColor,
                          boxShadow: `0 0 8px ${glowColor}`
                        }}></span>
                        <span>{emp.name}</span>
                        <span style={{
                          fontSize: '0.65rem',
                          padding: '1px 5px',
                          borderRadius: '10px',
                          background: isIsolated ? '#7F1D1D' : isRisk ? '#78350F' : '#064E3B',
                          color: glowColor
                        }}>
                          {emp.riskScore || 0}%
                        </span>
                      </div>

                      {/* Coordinates Mini Tag */}
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        marginTop: '4px',
                        fontSize: '0.62rem',
                        fontFamily: 'monospace',
                        color: '#94A3B8',
                        background: 'rgba(15, 23, 42, 0.85)',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        border: '1px solid rgba(148, 163, 184, 0.2)',
                        whiteSpace: 'nowrap'
                      }}>
                        {emp.geo?.lat?.toFixed(4)}°, {emp.geo?.lng?.toFixed(4)}° &bull; {emp.geo?.city || 'Live Device'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Overlay Notice for Radar Mode */}
              <div style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(10px)',
                padding: '0.6rem 0.9rem',
                borderRadius: '8px',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#38BDF8',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Crosshair style={{ width: '15px', height: '15px' }} />
                <span>Zero-Trust Vector Radar Active &bull; Corporate Geofences Armed</span>
              </div>
            </div>
          )}

          {/* 4. SELECTED EMPLOYEE DOSSIER INSPECTOR DRAWER (Overlay on Map) */}
          {selectedEmployee && (
            <div 
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '360px',
                maxHeight: 'calc(100% - 32px)',
                background: 'rgba(15, 23, 42, 0.94)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                borderRadius: '14px',
                border: `1.5px solid ${selectedEmployee.status === 'ISOLATED' ? '#EF4444' : selectedEmployee.riskScore >= 70 ? '#F59E0B' : '#38BDF8'}`,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                color: '#FFFFFF',
                padding: '1.25rem',
                zIndex: 40,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.9rem',
                overflowY: 'auto'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #1E293B, #0F172A)',
                    border: '1px solid #334155',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem'
                  }}>
                    👨‍💼
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#F8FAFC' }}>
                      {selectedEmployee.name}
                    </h3>
                    <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                      {selectedEmployee.role} &bull; <span className="font-mono" style={{ color: '#38BDF8' }}>{selectedEmployee.id}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedEmployee(null)}
                  style={{
                    background: 'transparent',
                    color: '#94A3B8',
                    padding: '4px',
                    borderRadius: '6px'
                  }}
                >
                  <X style={{ width: '16px', height: '16px' }} />
                </button>
              </div>

              {/* Status & Risk Meters */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.65rem',
                background: 'rgba(30, 41, 59, 0.7)',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(51, 65, 85, 0.8)'
              }}>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>
                    Online Status
                  </div>
                  <div style={{
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    marginTop: '2px',
                    color: !selectedEmployee.isOnline ? '#94A3B8' : selectedEmployee.status === 'ISOLATED' ? '#EF4444' : selectedEmployee.riskScore >= 70 ? '#F59E0B' : '#10B981',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}>
                    <span style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: !selectedEmployee.isOnline ? '#64748B' : selectedEmployee.status === 'ISOLATED' ? '#EF4444' : selectedEmployee.riskScore >= 70 ? '#F59E0B' : '#10B981',
                      boxShadow: selectedEmployee.isOnline ? '0 0 6px #10B981' : 'none'
                    }}></span>
                    {!selectedEmployee.isOnline ? 'OFFLINE (NO ACTIVE SESSION)' : selectedEmployee.status === 'ISOLATED' ? 'QUARANTINED' : selectedEmployee.riskScore >= 70 ? 'ELEVATED RISK' : 'LIVE ONLINE'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.68rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>
                    Risk Score
                  </div>
                  <div className="font-mono" style={{
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    color: selectedEmployee.riskScore >= 75 ? '#EF4444' : selectedEmployee.riskScore >= 50 ? '#F59E0B' : '#10B981'
                  }}>
                    {selectedEmployee.riskScore || 0}%
                  </div>
                </div>
              </div>

              {/* Exact Coordinates Section */}
              <div style={{
                background: 'rgba(30, 41, 59, 0.5)',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(51, 65, 85, 0.6)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: '#38BDF8', fontWeight: 800, textTransform: 'uppercase' }}>
                  <Compass style={{ width: '13px', height: '13px' }} />
                  Device Coordinates
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                  <span style={{ color: '#94A3B8' }}>Latitude:</span>
                  <span className="font-mono" style={{ color: selectedEmployee.isOnline && selectedEmployee.geo?.lat ? '#F1F5F9' : '#64748B', fontWeight: 700 }}>
                    {selectedEmployee.isOnline && selectedEmployee.geo?.lat != null ? `${selectedEmployee.geo.lat.toFixed(6)}°` : (selectedEmployee.isOnline ? 'UNAVAILABLE (Location not shared)' : 'OFFLINE (No Device Session)')}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                  <span style={{ color: '#94A3B8' }}>Longitude:</span>
                  <span className="font-mono" style={{ color: selectedEmployee.isOnline && selectedEmployee.geo?.lng ? '#F1F5F9' : '#64748B', fontWeight: 700 }}>
                    {selectedEmployee.isOnline && selectedEmployee.geo?.lng != null ? `${selectedEmployee.geo.lng.toFixed(6)}°` : (selectedEmployee.isOnline ? 'UNAVAILABLE (Location not shared)' : 'OFFLINE (No Device Session)')}
                  </span>
                </div>

                {selectedEmployee.isOnline && selectedEmployee.geo?.lat != null && selectedEmployee.geo?.lng != null && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', borderTop: '1px dashed #334155', paddingTop: '4px' }}>
                    <span style={{ color: '#64748B' }}>DMS Format:</span>
                    <span className="font-mono" style={{ color: '#CBD5E1' }}>
                      {toDMS(selectedEmployee.geo.lat, true)}, {toDMS(selectedEmployee.geo.lng, false)}
                    </span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                  <span style={{ color: '#94A3B8' }}>City & Sector:</span>
                  <span style={{ color: '#F1F5F9', fontWeight: 600 }}>
                    {selectedEmployee.isOnline ? (selectedEmployee.geo?.city || selectedEmployee.location || 'Live Device Location') : 'Disconnected (Offline)'}
                  </span>
                </div>

                {/* Geofence Status Badge */}
                <div style={{
                  marginTop: '4px',
                  padding: '5px 8px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: !selectedEmployee.isOnline
                    ? '#1E293B'
                    : selectedEmployee.geo?.geofenceStatus === 'UNAUTHORIZED_PERIMETER' || selectedEmployee.geo?.isImpossibleTravel
                    ? '#7F1D1D'
                    : selectedEmployee.status === 'ISOLATED'
                    ? '#451A03'
                    : '#064E3B',
                  color: !selectedEmployee.isOnline
                    ? '#94A3B8'
                    : selectedEmployee.geo?.geofenceStatus === 'UNAUTHORIZED_PERIMETER' || selectedEmployee.geo?.isImpossibleTravel
                    ? '#FCA5A5'
                    : selectedEmployee.status === 'ISOLATED'
                    ? '#FCD34D'
                    : '#A7F3D0'
                }}>
                  <Shield style={{ width: '12px', height: '12px' }} />
                  {!selectedEmployee.isOnline
                    ? '⚪ Device Inactive (No Signal)'
                    : selectedEmployee.geo?.isImpossibleTravel 
                    ? '⚠️ Outside Geofence (Impossible Travel)' 
                    : selectedEmployee.status === 'ISOLATED'
                    ? '🔒 Locked in Quarantine Isolation'
                    : '✓ Within Authorized Perimeter'}
                </div>
              </div>

              {/* Hardware & Network Footprint */}
              <div style={{ fontSize: '0.74rem', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Hardware Device:</span>
                  <span className="font-mono" style={{ color: '#E2E8F0' }}>{selectedEmployee.device || `BANK-PC-${selectedEmployee.id}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>IP Address:</span>
                  <span className="font-mono" style={{ color: selectedEmployee.isOnline ? '#38BDF8' : '#64748B' }}>
                    {selectedEmployee.isOnline ? (selectedEmployee.geo?.ipAddress || 'Detecting...') : 'Offline'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Session State:</span>
                  <span style={{ color: selectedEmployee.isOnline ? '#10B981' : '#64748B', fontWeight: 600 }}>
                    {selectedEmployee.isOnline ? 'Active Real-Time Stream' : 'No Active Session'}
                  </span>
                </div>
              </div>

              {/* Quick SOC Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.4rem' }}>
                {selectedEmployee.status === 'ISOLATED' ? (
                  <button
                    onClick={() => handleRestoreSession(selectedEmployee.sessionId, selectedEmployee.id)}
                    style={{
                      padding: '0.55rem',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      background: '#059669',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
                    }}
                  >
                    <ShieldCheck style={{ width: '14px', height: '14px' }} />
                    Restore Session (Unquarantine)
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleRequireMFA(selectedEmployee.sessionId, selectedEmployee.id)}
                      style={{
                        padding: '0.5rem',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        background: '#1E293B',
                        color: '#38BDF8',
                        border: '1px solid #0284C7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <Key style={{ width: '14px', height: '14px' }} />
                      Enforce Step-Up MFA
                    </button>

                    <button
                      onClick={() => handleDisableAccount(selectedEmployee.id)}
                      style={{
                        padding: '0.5rem',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        background: '#7F1D1D',
                        color: '#FCA5A5',
                        border: '1px solid #DC2626',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <Lock style={{ width: '14px', height: '14px' }} />
                      Isolate & Suspend Employee
                    </button>
                  </>
                )}
              </div>

            </div>
          )}

          {/* Mandatory Google Maps Attribution per Platform Terms */}
          <div style={{
            position: 'absolute',
            bottom: '8px',
            right: '12px',
            fontSize: '0.7rem',
            color: 'rgba(255, 255, 255, 0.7)',
            pointerEvents: 'none',
            zIndex: 10
          }}>
            Google Maps
          </div>
        </div>

        {/* 5. LIVE COORDINATES & UEBA TELEMETRY STREAM TICKER */}
        <div style={{
          padding: '0.75rem 1.5rem',
          background: '#0F172A',
          color: '#E2E8F0',
          borderTop: '1px solid rgba(51, 65, 85, 0.7)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.75rem',
          overflowX: 'auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38BDF8', fontWeight: 800, whiteSpace: 'nowrap' }}>
            <Activity style={{ width: '14px', height: '14px' }} />
            GPS TELEMETRY FEED:
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', whiteSpace: 'nowrap' }}>
            {telemetryLogs.slice(0, 5).map((log) => (
              <div key={log.id} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'monospace' }}>
                <span style={{ color: '#64748B' }}>[{log.time}]</span>
                <span style={{ color: log.isAnomaly ? '#EF4444' : '#F8FAFC', fontWeight: 600 }}>{log.empId}</span>
                <span style={{ color: '#94A3B8' }}>{log.city}</span>
                <span style={{ color: '#38BDF8' }}>({log.lat.toFixed(4)}°, {log.lng.toFixed(4)}°)</span>
                <span style={{
                  fontSize: '0.65rem',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  fontWeight: 700,
                  background: log.status === 'ISOLATED' ? '#7F1D1D' : log.risk >= 60 ? '#78350F' : '#064E3B',
                  color: log.status === 'ISOLATED' ? '#EF4444' : log.risk >= 60 ? '#F59E0B' : '#10B981'
                }}>
                  {log.status === 'ISOLATED' ? 'QUARANTINE' : `RISK ${log.risk}%`}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* API Key Settings Modal */}
      {showKeyModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            maxWidth: '500px',
            width: '100%',
            padding: '1.75rem',
            boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ background: '#EFF6FF', padding: '0.5rem', borderRadius: '8px', color: '#2563EB' }}>
                  <KeyRound style={{ width: '20px', height: '20px' }} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                  Google Maps API Configuration
                </h3>
              </div>
              <button onClick={() => setShowKeyModal(false)} style={{ background: 'transparent', color: '#64748B' }}>
                <X style={{ width: '18px', height: '18px' }} />
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
              Enter your Google Maps Platform API key to render full satellite imagery and vector roadmaps. When running in local prototype mode, the integrated <strong>Cyber Radar HUD</strong> vector map works out-of-the-box with zero configuration.
            </p>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                Google Maps API Key
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.85rem',
                  fontFamily: 'monospace'
                }}
              />
              <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block', marginTop: '4px' }}>
                You can also set <code>VITE_GOOGLE_MAPS_API_KEY</code> in <code>.env</code>.
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                onClick={() => setShowKeyModal(false)}
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  background: '#F1F5F9',
                  color: '#475569'
                }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowKeyModal(false);
                  if (apiKey) setMapMode('google-dark');
                }}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  background: '#2563EB',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                }}
              >
                Save &amp; Apply
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
