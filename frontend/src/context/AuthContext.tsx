import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthResponse } from '../types';
import { authApi } from '../api/auth';
import type { LoginPayload, RegisterPayload } from '../api/auth';
import { toast } from 'react-toastify';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Rehydrate auth state from localStorage on app start
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('kb_auth_token');
      const storedUser = localStorage.getItem('kb_user');

      if (storedToken) {
        setToken(storedToken);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            localStorage.removeItem('kb_user');
          }
        }

        try {
          const freshUser = await authApi.me();
          setUser(freshUser);
          localStorage.setItem('kb_user', JSON.stringify(freshUser));
        } catch {
          // Handled silently
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const handleAuthSuccess = (data: AuthResponse, email: string, nameFallback?: string) => {
    const token = data.access_token;
    setToken(token);
    localStorage.setItem('kb_auth_token', token);

    const userObj: User = data.user || {
      id: 1,
      email: email,
      full_name: nameFallback || email.split('@')[0],
    };

    setUser(userObj);
    localStorage.setItem('kb_user', JSON.stringify(userObj));
  };

  const login = async (payload: LoginPayload) => {
    try {
      const response = await authApi.login(payload);
      handleAuthSuccess(response, payload.email);
      toast.success('Successfully logged in! Welcome back.');
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.message || 'Login failed. Please check your credentials.';
      toast.error(msg);
      throw err;
    }
  };

  const register = async (payload: RegisterPayload) => {
    try {
      const response = await authApi.register(payload);
      handleAuthSuccess(response, payload.email, payload.full_name);
      toast.success('Account created successfully!');
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.message || 'Registration failed. Please try again.';
      toast.error(msg);
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('kb_auth_token');
    localStorage.removeItem('kb_user');
    toast.info('You have logged out.');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
