import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useEffect, useState } from 'react';

import { AuthState, User, LoginRequest, SignupRequest } from '@/types/auth';
import { trpcClient } from '@/lib/trpc';

const AUTH_TOKEN_KEY = 'nutrisnap-auth-token';
const USER_DATA_KEY = 'nutrisnap-user-data';

const [AuthProvider, useAuth] = createContextHook(() => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Load auth state on app start
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const [token, userData] = await Promise.all([
          AsyncStorage.getItem(AUTH_TOKEN_KEY),
          AsyncStorage.getItem(USER_DATA_KEY),
        ]);

        if (token && userData) {
          try {
            const user = JSON.parse(userData);
            // Verify token with backend
            const profile = await trpcClient.auth.profile.query({ token });
            
            setAuthState({
              user: profile,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error) {
            // Token is invalid, clear storage
            await Promise.all([
              AsyncStorage.removeItem(AUTH_TOKEN_KEY),
              AsyncStorage.removeItem(USER_DATA_KEY),
            ]);
            
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    loadAuthState();
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      const response = await trpcClient.auth.login.mutate(credentials);
      
      // Store auth data
      await Promise.all([
        AsyncStorage.setItem(AUTH_TOKEN_KEY, response.token),
        AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(response.user)),
      ]);

      setAuthState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (userData: SignupRequest): Promise<void> => {
    try {
      const response = await trpcClient.auth.signup.mutate(userData);
      
      // Store auth data
      await Promise.all([
        AsyncStorage.setItem(AUTH_TOKEN_KEY, response.token),
        AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(response.user)),
      ]);

      setAuthState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Clear stored auth data
      await Promise.all([
        AsyncStorage.removeItem(AUTH_TOKEN_KEY),
        AsyncStorage.removeItem(USER_DATA_KEY),
      ]);

      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getToken = async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  };

  return {
    ...authState,
    login,
    signup,
    logout,
    getToken,
  };
});

export { AuthProvider, useAuth };