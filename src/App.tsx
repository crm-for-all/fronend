import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/UI/ToastProvider';

import Layout from './components/Layout/Layout';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

import CustomersDashboard from './pages/Dashboard/Customers';
import SettingsDashboard from './pages/Dashboard/Settings';
import Dashboard from './pages/Dashboard/Dashboard';
import Payments from './pages/Dashboard/Payments';
import Onboarding from './pages/Onboarding/Onboarding';

const ProtectedRoute = ({ children, allowWithoutOrg = false }: { children: React.ReactNode, allowWithoutOrg?: boolean }) => {
  const { isAuthenticated, isInitializing, hasOrganizations } = useAuth();
  
  if (isInitializing) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  if (!allowWithoutOrg && hasOrganizations === false) {
    return <Navigate to="/onboarding" replace />;
  }

  if (allowWithoutOrg && hasOrganizations === true) {
     return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/onboarding" element={
        <ProtectedRoute allowWithoutOrg>
          <Onboarding />
        </ProtectedRoute>
      } />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard/customers" element={
        <ProtectedRoute>
          <Layout>
            <CustomersDashboard />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard/payments" element={
        <ProtectedRoute>
          <Layout>
            <Payments />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard/settings" element={
        <ProtectedRoute>
          <Layout>
            <SettingsDashboard />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
