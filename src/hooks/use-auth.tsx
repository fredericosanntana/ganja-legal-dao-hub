
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';
import { User } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, username: string) => Promise<any>;
  signOut: () => Promise<any>;
  logout: () => Promise<any>; // Alias for signOut for consistency
  refreshUser: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        if (currentSession?.user) {
          // Fetch full user data including votes, subscription, etc.
          const { data: userData, error } = await supabase
            .from('users')
            .select(`
              *,
              votes(*),
              vote_credits(*)
            `)
            .eq('id', currentSession.user.id)
            .single();
          
          if (!error && userData) {
            // Transform the raw data into our User type
            setUser({
              id: currentSession.user.id,
              email: userData.email,
              username: userData.username,
              is_admin: userData.is_admin,
              created_at: userData.created_at,
              updated_at: userData.updated_at,
              votes: userData.votes || [],
              vote_credits: userData.vote_credits || { total_credits: 0 },
              subscription: userData.subscription
            });
          } else {
            // Fallback to basic user data if detailed fetch fails
            setUser({
              id: currentSession.user.id,
              email: currentSession.user.email || '',
              username: '',
              is_admin: false,
              created_at: '',
              updated_at: '',
              votes: [],
              vote_credits: { total_credits: 0 },
              subscription: undefined
            });
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      if (currentSession?.user) {
        // Fetch full user data including votes, subscription, etc.
        const { data: userData, error } = await supabase
          .from('users')
          .select(`
            *,
            votes(*),
            vote_credits(*)
          `)
          .eq('id', currentSession.user.id)
          .single();
        
        if (!error && userData) {
          // Transform the raw data into our User type
          setUser({
            id: currentSession.user.id,
            email: userData.email,
            username: userData.username,
            is_admin: userData.is_admin,
            created_at: userData.created_at,
            updated_at: userData.updated_at,
            votes: userData.votes || [],
            vote_credits: userData.vote_credits || { total_credits: 0 },
            subscription: userData.subscription
          });
        } else {
          // Fallback to basic user data if detailed fetch fails
          setUser({
            id: currentSession.user.id,
            email: currentSession.user.email || '',
            username: '',
            is_admin: false,
            created_at: '',
            updated_at: '',
            votes: [],
            vote_credits: { total_credits: 0 },
            subscription: undefined
          });
        }
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshUser = async () => {
    try {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
      }
      return data.user;
    } catch (error) {
      console.error('Error refreshing user:', error);
      return null;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      // Step 1: Create the auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          }
        }
      });

      if (error) throw error;

      // Step 2: Create the public user record (this would typically be handled by a trigger on auth.users)
      // In a real implementation with proper triggers, this would be redundant
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              username: username,
              email: email,
              password: '[PROTECTED]', // Don't store actual password; auth handles this
              is_admin: false
            }
          ]);

        if (profileError) {
          console.error('Error creating user profile:', profileError);
          // Consider handling this error, possibly by cleaning up the auth user
        }
      }

      return data;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };
  
  // Add logout as alias for signOut to address the error
  const logout = signOut;

  const value = {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    isLoading: loading,
    signIn,
    signUp,
    signOut,
    logout,
    refreshUser
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
