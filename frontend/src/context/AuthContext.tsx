import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthResponse } from '../types';
import { authApi } from '../api/auth';
import type { LoginPayload, RegisterPayload } from '../api/auth';
import { formatApiError } from '../api/client';
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

  // Rehydrate auth state & verify token with backend /auth/me on app start
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
          // Fetch fresh user info from backend /auth/me
          const meData = await authApi.getMe();
          const updatedUser: User = {
            id: user?.id || 0,
            email: meData.email,
            full_name: meData.full_name,
          };
          setUser(updatedUser);
          localStorage.setItem('kb_user', JSON.stringify(updatedUser));
        } catch {
          // If /auth/me fails (token expired/invalid), clear session
          localStorage.removeItem('kb_auth_token');
          localStorage.removeItem('kb_user');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const handleAuthSuccess = (data: AuthResponse, email: string, userResponse?: User) => {
    const token = data.access_token;
    setToken(token);
    localStorage.setItem('kb_auth_token', token);

    const userObj: User = userResponse || {
      id: 0,
      email: email,
      full_name: data.full_name || email.split('@')[0],
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
      const msg = formatApiError(err);
      toast.error(msg);
      throw err;
    }
  };

  const register = async (payload: RegisterPayload) => {
    try {
      const userResponse = await authApi.register(payload);
      // Auto login after registration to obtain access token
      const loginResponse = await authApi.login({
        email: payload.email,
        password: payload.password,
      });
      handleAuthSuccess(loginResponse, payload.email, userResponse);
      toast.success('Account created successfully!');
    } catch (err: any) {
      const msg = formatApiError(err);
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
