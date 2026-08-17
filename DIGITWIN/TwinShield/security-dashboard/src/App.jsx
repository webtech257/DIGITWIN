import React, { useState } from 'react';
import { SOCProvider } from './context/SOCContext';
import { SOCNavbar } from './components/SOCNavbar';
import { OverviewSection } from './components/OverviewSection';
import { LiveThreatFeed } from './components/LiveThreatFeed';
import { EmployeeRiskTable } from './components/EmployeeRiskTable';
import { DigitalTwinInspector } from './components/DigitalTwinInspector';
import { AttackPredictionView } from './components/AttackPredictionView';
import { IncidentInvestigationView } from './components/IncidentInvestigationView';
import { IsolationManagementView } from './components/IsolationManagementView';
import { AuditLogsView } from './components/AuditLogsView';

const SOCDashboardContent = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const handleInspectEmployee = () => {
    setActiveTab('digital-twin');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#060B13' }}>
      <SOCNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        <OverviewSection />

        {activeTab === 'overview' && (
          <>
            <LiveThreatFeed />
            <EmployeeRiskTable onInspectEmployee={handleInspectEmployee} />
          </>
        )}

        {activeTab === 'feed' && <LiveThreatFeed />}
        {activeTab === 'employee-risk' && <EmployeeRiskTable onInspectEmployee={handleInspectEmployee} />}
        {activeTab === 'digital-twin' && <DigitalTwinInspector />}
        {activeTab === 'prediction' && <AttackPredictionView />}
        {activeTab === 'investigation' && <IncidentInvestigationView />}
        {activeTab === 'isolation' && <IsolationManagementView />}
        {activeTab === 'audit' && <AuditLogsView />}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <SOCProvider>
      <SOCDashboardContent />
    </SOCProvider>
  );
}
