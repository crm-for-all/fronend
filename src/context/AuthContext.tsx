import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import i18n from 'i18next';

interface AuthContextType {
  token: string | null;
  orgId: string | null;
  isAuthenticated: boolean;
  login: (token: string, orgId?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('crm_token'));
  const [orgId, setOrgId] = useState<string | null>(localStorage.getItem('crm_org_id'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('crm_token', token);
    } else {
      localStorage.removeItem('crm_token');
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

  const login = (newToken: string, newOrgId?: string) => {
    localStorage.setItem('crm_token', newToken);
    setToken(newToken);
    if (newOrgId) {
      localStorage.setItem('crm_org_id', newOrgId);
      setOrgId(newOrgId);
    }
  };

  const logout = () => {
    localStorage.removeItem('crm_token');
    localStorage.removeItem('crm_org_id');
    setToken(null);
    setOrgId(null);
  };

  return (
    <AuthContext.Provider value={{ token, orgId, isAuthenticated: !!token, login, logout }}>
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
