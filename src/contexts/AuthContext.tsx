import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, getCurrentUser, setCurrentUser, login as authLogin, register as authRegister, logout as authLogout, incrementImageCount, upgradeToPremium as authUpgrade } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => { success: boolean; message: string };
  register: (email: string, password: string, name: string) => { success: boolean; message: string };
  logout: () => void;
  incrementImages: () => void;
  upgradeToPremium: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  };

  useEffect(() => {
    refreshUser();
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string) => {
    const result = authLogin(email, password);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return { success: result.success, message: result.message };
  };

  const register = (email: string, password: string, name: string) => {
    const result = authRegister(email, password, name);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return { success: result.success, message: result.message };
  };

  const logout = () => {
    authLogout();
    setUser(null);
  };

  const incrementImages = () => {
    if (user) {
      const updatedUser = incrementImageCount(user.id);
      if (updatedUser) {
        setUser(updatedUser);
      }
    }
  };

  const upgradeToPremium = () => {
    if (user) {
      const updatedUser = authUpgrade(user.id);
      if (updatedUser) {
        setUser(updatedUser);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, incrementImages, upgradeToPremium, refreshUser }}>
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
