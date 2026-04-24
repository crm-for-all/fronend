import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import i18n from 'i18next';
import { authApi } from '../api/auth';

interface AuthContextType {
  token: string | null;
  orgId: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  hasOrganizations: boolean | null;
  login: (token: string, organizations?: any[]) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('crm_token'));
  const [orgId, setOrgId] = useState<string | null>(localStorage.getItem('crm_org_id'));
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasOrganizations, setHasOrganizations] = useState<boolean | null>(null);

  useEffect(() => {
    if (token) {
      authApi.me().then(data => {
        const orgs = data.organizations || [];
        setHasOrganizations(orgs.length > 0);
        if (orgs.length > 0 && !orgId) {
          setOrgId(orgs[0].id);
        } else if (orgs.length === 0) {
          setOrgId(null);
        }
      }).catch(() => {
        logout();
      }).finally(() => {
        setIsInitializing(false);
      });
      localStorage.setItem('crm_token', token);
    } else {
      localStorage.removeItem('crm_token');
      setIsInitializing(false);
      setHasOrganizations(false);
    }
  }, [token]);

  useEffect(() => {
    if (orgId) {
      localStorage.setItem('crm_org_id', orgId);
    } else {
      localStorage.removeItem('crm_org_id');
    }
  }, [orgId]);

  useEffect(() => {
    const handleGlobalLogout = () => {
      setToken(null);
      window.dispatchEvent(new CustomEvent('app-error', {
        detail: i18n.t('session_expired')
      }));
    };
    window.addEventListener('app-logout', handleGlobalLogout);
    return () => window.removeEventListener('app-logout', handleGlobalLogout);
  }, []);

  const login = (newToken: string, organizations: any[] = []) => {
    localStorage.setItem('crm_token', newToken);
    setToken(newToken);
    setHasOrganizations(organizations.length > 0);
    
    if (organizations.length > 0) {
      const defaultOrgId = organizations[0].id;
      localStorage.setItem('crm_org_id', defaultOrgId);
      setOrgId(defaultOrgId);
    } else {
      setOrgId(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('crm_token');
    localStorage.removeItem('crm_org_id');
    setToken(null);
    setOrgId(null);
    setHasOrganizations(false);
  };

  return (
    <AuthContext.Provider value={{ token, orgId, isAuthenticated: !!token, isInitializing, hasOrganizations, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
