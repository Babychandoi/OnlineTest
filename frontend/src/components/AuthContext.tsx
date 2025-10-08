import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { checkToken } from '../services/service';
import { tryRefreshToken } from '../services/axioisClient';
import { toast } from 'react-toastify';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string, refreshToken: string) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const refreshAuth = async () => {
    const token = sessionStorage.getItem('access-token');
    
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await checkToken(token);
      if (response.code !== 200 || !response.data.valid) {
        const refreshed = await tryRefreshToken();
        if (!refreshed) {
          sessionStorage.clear();
          setIsAuthenticated(false);
          toast.info("Hết hạn đăng nhập");
          return;
        }
      }
      
      setIsAuthenticated(true);
    } catch (error) {
      sessionStorage.clear();
      setIsAuthenticated(false);
    }
  };

  const login = async (token: string, refreshToken: string) => {
    sessionStorage.setItem('access-token', token);
    sessionStorage.setItem('refresh-token', refreshToken);
    await refreshAuth();
  };

  const logout = () => {
    sessionStorage.clear();
    setIsAuthenticated(false);
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated,  login, logout, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

