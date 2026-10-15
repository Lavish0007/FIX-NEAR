import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApiError, authService } from '../services/api';
import type { AuthResponse } from '../services/api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  city: string;
  createdAt?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, city?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const readStoredUser = (): UserProfile | null => {
  const saved = localStorage.getItem('fixnear_user');
  if (!saved) return null;

  try {
    return JSON.parse(saved) as UserProfile;
  } catch {
    localStorage.removeItem('fixnear_user');
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(readStoredUser);
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('fixnear_token');
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Theme state: dark / light
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('fixnear_theme');
    if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    // Apply theme class to document root
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('fixnear_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const clearSession = () => {
    localStorage.removeItem('fixnear_token');
    localStorage.removeItem('fixnear_user');
    setToken(null);
    setUser(null);
  };

  const storeAuthenticatedSession = (data: AuthResponse) => {
    if (
      data?.success !== true ||
      typeof data.token !== 'string' ||
      !data.token ||
      !data.user ||
      typeof data.user.id !== 'string' ||
      typeof data.user.email !== 'string'
    ) {
      throw new Error('The server returned an invalid authentication response. Please try again.');
    }

    localStorage.setItem('fixnear_token', data.token);
    localStorage.setItem('fixnear_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  useEffect(() => {
    window.addEventListener('fixnear:auth-invalid', clearSession);
    return () => window.removeEventListener('fixnear:auth-invalid', clearSession);
  }, []);

  // Verify stored session on mount
  useEffect(() => {
    const verifySession = async () => {
      const savedToken = localStorage.getItem('fixnear_token');
      if (!savedToken) {
        localStorage.removeItem('fixnear_user');
        setUser(null);
        setToken(null);
        setLoading(false);
        return;
      }

      try {
        const res = await authService.getMe();
        if (res.success && res.user) {
          setUser(res.user);
          localStorage.setItem('fixnear_user', JSON.stringify(res.user));
        } else {
          clearSession();
        }
      } catch (error) {
        if (error instanceof ApiError && (error.status === 401 || error.status === 404)) {
          clearSession();
        }
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await authService.login({ email, password });
    storeAuthenticatedSession(data);
  };

  const signup = async (name: string, email: string, password: string, city?: string) => {
    const data = await authService.signup({ name, email, password, city });
    storeAuthenticatedSession(data);
  };

  const logout = () => {
    clearSession();
  };

  const refreshUser = async () => {
    try {
      const res = await authService.getMe();
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('fixnear_user', JSON.stringify(res.user));
      }
    } catch (err) {
      console.error('Error refreshing user:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        theme,
        toggleTheme,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
