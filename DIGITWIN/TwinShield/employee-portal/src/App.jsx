import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/LoginPage';
import { DashboardPage } from './components/DashboardPage';
import { ProfilePage } from './components/ProfilePage';
import { CustomerSearchPage } from './components/CustomerSearchPage';
import { CustomerDetailsPage } from './components/CustomerDetailsPage';
import { TransactionSearchPage } from './components/TransactionSearchPage';
import { SessionStatusPage } from './components/SessionStatusPage';
import { AccessDeniedPage } from './components/AccessDeniedPage';
import { QuarantinedScreen } from './components/QuarantinedScreen';
import { MFAChallengeScreen } from './components/MFAChallengeScreen';
import { AccountSuspendedScreen } from './components/AccountSuspendedScreen';
import { TellerOperationsPage } from './components/TellerOperationsPage';
import { ManagerOperationsPage } from './components/ManagerOperationsPage';
import { AdminSystemConsolePage } from './components/AdminSystemConsolePage';
import { ComplianceAuditPage } from './components/ComplianceAuditPage';
import { EmployeeManagementPage } from './components/EmployeeManagementPage';

const MainApp = () => {
  const { currentUser, session, verifyAndCompleteMfa } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [deniedDetails, setDeniedDetails] = useState(null);

  if (!currentUser) {
    return <LoginPage onLoginSuccess={() => setActiveTab('dashboard')} />;
  }

  // --- ZERO-TRUST ISOLATION & LOCKOUT ENFORCEMENT ---
  if (session?.employeeStatus === 'SUSPENDED') {
    return <AccountSuspendedScreen currentUser={currentUser} />;
  }

  if (session?.status === 'ISOLATED') {
    return <QuarantinedScreen session={session} currentUser={currentUser} />;
  }

  if (session?.status === 'STEP_UP_MFA') {
    return <MFAChallengeScreen session={session} currentUser={currentUser} onCompleteMfa={verifyAndCompleteMfa} />;
  }

  const triggerDeniedAction = (resourceId, actionName, requiredPermission) => {
    setDeniedDetails({ resourceId, actionName, requiredPermission });
    setActiveTab('denied');
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setActiveTab('customer-details');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'transparent' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main style={{ paddingBottom: '3rem' }}>
        {activeTab === 'dashboard' && (
          <DashboardPage setActiveTab={setActiveTab} triggerDeniedAction={triggerDeniedAction} />
        )}
        {activeTab === 'employee-admin' && (
          <EmployeeManagementPage />
        )}
        {activeTab === 'teller-desk' && (
          <TellerOperationsPage triggerDeniedAction={triggerDeniedAction} />
        )}
        {activeTab === 'manager-desk' && (
          <ManagerOperationsPage triggerDeniedAction={triggerDeniedAction} />
        )}
        {activeTab === 'admin-console' && (
          <AdminSystemConsolePage />
        )}
        {activeTab === 'compliance-audit' && (
          <ComplianceAuditPage />
        )}
        {activeTab === 'customers' && (
          <CustomerSearchPage onSelectCustomer={handleSelectCustomer} triggerDeniedAction={triggerDeniedAction} />
        )}
        {activeTab === 'customer-details' && (
          <CustomerDetailsPage customer={selectedCustomer} onBack={() => setActiveTab('customers')} />
        )}
        {activeTab === 'transactions' && (
          <TransactionSearchPage triggerDeniedAction={triggerDeniedAction} />
        )}
        {activeTab === 'profile' && <ProfilePage />}
        {activeTab === 'session' && <SessionStatusPage />}
        {activeTab === 'denied' && (
          <AccessDeniedPage deniedDetails={deniedDetails} onBack={() => setActiveTab('dashboard')} />
        )}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
