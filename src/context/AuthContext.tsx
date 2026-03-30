import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import i18n from 'i18next';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('crm_token'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('crm_token', token);
    } else {
      localStorage.removeItem('crm_token');
    }
  }, [token]);

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

  const login = (newToken: string) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, login, logout }}>
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
