// Auth Context Provider
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase, getCurrentUser, getSession } from '../services/supabase';
import { User, AuthState } from '../types';
import { saveData, getData, removeData } from '../utils/storage';
import { STORAGE_KEYS } from '../constants/config';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  skipLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Convert Supabase user to app User
  const convertSupabaseUser = (supabaseUser: SupabaseUser): User => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      displayName: supabaseUser.user_metadata?.display_name,
      avatarUrl: supabaseUser.user_metadata?.avatar_url,
      createdAt: supabaseUser.created_at,
      subscription: 'free', // Default, should be fetched from database
    };
  };

  // Initialize auth state
  useEffect(() => {
    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);

        if (session?.user) {
          const appUser = convertSupabaseUser(session.user);
          setUser(appUser);
          setIsAuthenticated(true);
          await saveData(STORAGE_KEYS.USER_DATA, appUser);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          await removeData(STORAGE_KEYS.USER_DATA);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);

      // Try to get existing session
      const session = await getSession();

      if (session?.user) {
        const appUser = convertSupabaseUser(session.user);
        setUser(appUser);
        setIsAuthenticated(true);
        await saveData(STORAGE_KEYS.USER_DATA, appUser);
      } else {
        // Check if user is in guest mode
        const isGuestMode = await getData<boolean>(STORAGE_KEYS.IS_GUEST_MODE);
        if (isGuestMode) {
          setIsAuthenticated(true);
          setUser(null);
        } else {
          // Try to load user from storage
          const cachedUser = await getData<User>(STORAGE_KEYS.USER_DATA);
          if (cachedUser) {
            setUser(cachedUser);
            setIsAuthenticated(true);
          }
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const appUser = convertSupabaseUser(data.user);
        setUser(appUser);
        setIsAuthenticated(true);
        await saveData(STORAGE_KEYS.USER_DATA, appUser);
        // Clear guest mode when user logs in with credentials
        await removeData(STORAGE_KEYS.IS_GUEST_MODE);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const appUser = convertSupabaseUser(data.user);
        setUser(appUser);
        setIsAuthenticated(true);
        await saveData(STORAGE_KEYS.USER_DATA, appUser);
        // Clear guest mode when user registers
        await removeData(STORAGE_KEYS.IS_GUEST_MODE);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setIsAuthenticated(false);
      await removeData(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const refreshSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) throw error;

      if (session?.user) {
        const appUser = convertSupabaseUser(session.user);
        setUser(appUser);
        setIsAuthenticated(true);
        await saveData(STORAGE_KEYS.USER_DATA, appUser);
      }
    } catch (error) {
      console.error('Refresh session error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'papyr://reset-password',
      });
      if (error) throw error;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  const skipLogin = async () => {
    // Set guest mode - user can use app without auth
    setIsAuthenticated(true);
    setUser(null);
    // Save guest mode flag to storage so it persists
    await saveData(STORAGE_KEYS.IS_GUEST_MODE, true);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    refreshSession,
    resetPassword,
    skipLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
