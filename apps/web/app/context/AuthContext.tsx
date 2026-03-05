'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { API_CONFIG } from '@tikeo/utils';

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_tokens';
const USER_KEY = 'auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncFromStorage = useCallback(() => {
    try {
      const storedTokens = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (!storedTokens || !storedUser) {
        setTokens(null);
        setUser(null);
        return;
      }

      const parsedTokens: AuthTokens = JSON.parse(storedTokens);
      const parsedUser: AuthUser = JSON.parse(storedUser);

      if (!parsedTokens?.accessToken) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setTokens(null);
        setUser(null);
        return;
      }

      setTokens(parsedTokens);
      setUser(parsedUser);
    } catch {
      setTokens(null);
      setUser(null);
    }
  }, []);

  // Initialize auth state from localStorage on mount — validate token against API
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedTokens = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (!storedTokens || !storedUser) {
          setIsLoading(false);
          return;
        }

        const parsedTokens: AuthTokens = JSON.parse(storedTokens);
        const parsedUser: AuthUser = JSON.parse(storedUser);

        if (!parsedTokens?.accessToken) {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setIsLoading(false);
          return;
        }

        // Validate token against API — if 401, clear session
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-production-8ee0.up.railway.app/api/v1';
          const res = await fetch(`${apiUrl}/users/me`, {
            headers: { Authorization: `Bearer ${parsedTokens.accessToken}` },
          });

          if (res.ok) {
            // Token valid — update user data from API (fresh data)
            const freshUser = await res.json();
            const updatedUser: AuthUser = {
              id: freshUser.id || parsedUser.id,
              email: freshUser.email || parsedUser.email,
              firstName: freshUser.firstName || parsedUser.firstName,
              lastName: freshUser.lastName || parsedUser.lastName,
              avatar: freshUser.avatar || parsedUser.avatar,
              role: freshUser.role || parsedUser.role,
            };
            localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
            setTokens(parsedTokens);
            setUser(updatedUser);
          } else if (res.status === 401) {
            // Token expired or invalid — try refresh
            if (parsedTokens.refreshToken) {
              try {
                const refreshRes = await fetch(`${apiUrl}/auth/refresh`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ refreshToken: parsedTokens.refreshToken }),
                });
                if (refreshRes.ok) {
                  const data = await refreshRes.json();
                  const newTokens: AuthTokens = {
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                  };
                  localStorage.setItem(TOKEN_KEY, JSON.stringify(newTokens));
                  setTokens(newTokens);
                  setUser(parsedUser);
                } else {
                  // Refresh failed — clear session
                  localStorage.removeItem(TOKEN_KEY);
                  localStorage.removeItem(USER_KEY);
                }
              } catch {
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem(USER_KEY);
              }
            } else {
              // No refresh token — clear session
              localStorage.removeItem(TOKEN_KEY);
              localStorage.removeItem(USER_KEY);
            }
          } else {
            // Other error (network, 500...) — keep session to avoid false logout
            setTokens(parsedTokens);
            setUser(parsedUser);
          }
        } catch {
          // Network error — keep session (user might be offline)
          setTokens(parsedTokens);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    const handleAuthUpdated = () => syncFromStorage();
    const handleStorage = (e: StorageEvent) => {
      if (!e.key || e.key === TOKEN_KEY || e.key === USER_KEY) {
        syncFromStorage();
      }
    };

    window.addEventListener('auth-updated', handleAuthUpdated);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('auth-updated', handleAuthUpdated);
      window.removeEventListener('storage', handleStorage);
    };
  }, [syncFromStorage]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.toLowerCase().trim(), password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Échec de la connexion');
      }

      const data = await response.json();
      
      // Store tokens and user
      const newTokens: AuthTokens = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
      
      const newUser: AuthUser = {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        avatar: data.user.avatar,
        role: data.user.role,
      };

      localStorage.setItem(TOKEN_KEY, JSON.stringify(newTokens));
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));

      setTokens(newTokens);
      setUser(newUser);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.toLowerCase().trim(), password, firstName, lastName }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Échec de l'inscription");
      }

      const data = await response.json();

      // Store tokens and user
      const newTokens: AuthTokens = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };

      const newUser: AuthUser = {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        avatar: data.user.avatar,
        role: data.user.role,
      };

      localStorage.setItem(TOKEN_KEY, JSON.stringify(newTokens));
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));

      setTokens(newTokens);
      setUser(newUser);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setTokens(null);
    setUser(null);
  }, []);

  const refreshToken = useCallback(async () => {
    if (!tokens?.refreshToken) {
      logout();
      return;
    }

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: tokens.refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();

      const newTokens: AuthTokens = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };

      localStorage.setItem(TOKEN_KEY, JSON.stringify(newTokens));
      setTokens(newTokens);
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
    }
  }, [tokens?.refreshToken, logout]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user && !!tokens,
    login,
    register,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper hook to get the access token for API calls
export function useAuthToken() {
  const { isAuthenticated } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedTokens = localStorage.getItem(TOKEN_KEY);
    if (storedTokens) {
      const parsed: AuthTokens = JSON.parse(storedTokens);
      setToken(parsed.accessToken);
    }
  }, [isAuthenticated]);

  return token;
}

