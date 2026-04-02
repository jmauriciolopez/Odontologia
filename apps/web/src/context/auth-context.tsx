import React, { createContext, useContext, useState, useEffect } from 'react';
import { httpClient } from '../lib/Httpclient';

interface AuthContextType {
  user: any;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(() => {
    const t = localStorage.getItem('token');
    return (t === 'undefined' || t === 'null') ? null : t;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token && token !== 'undefined' && token !== 'null') {
        try {
          const userData = localStorage.getItem('user');
          if (userData && userData !== 'undefined' && userData !== 'null') {
            setUser(JSON.parse(userData));
          }
        } catch (error) {
          console.error('[AuthContext] initAuth error:', error);
          logout();
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, [token]);

  const login = (newToken: string, newUser: any) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    setIsLoading(false);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
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
