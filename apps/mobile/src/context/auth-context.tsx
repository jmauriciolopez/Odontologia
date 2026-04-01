import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

interface AuthContextType {
  token: string | null;
  user: any | null;
  isLoading: boolean;
  login: (token: string, user: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const savedToken = await SecureStore.getItemAsync('auth_token');
        const savedUser = await SecureStore.getItemAsync('auth_user');
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.error('Error al cargar sesión:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadSession();
  }, []);

  const login = async (newToken: string, newUser: any) => {
    setToken(newToken);
    setUser(newUser);
    await SecureStore.setItemAsync('auth_token', newToken);
    await SecureStore.setItemAsync('auth_user', JSON.stringify(newUser));
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await SecureStore.deleteItemAsync('auth_token');
    await SecureStore.deleteItemAsync('auth_user');
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
