
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';
import { User } from '@/types/auth';
import { toast } from "sonner";

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
  checkSubscription: () => Promise<any>;
  createCheckoutSession: () => Promise<string | null>;
  openCustomerPortal: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to transform subscription data
  const transformSubscriptionData = (subscriptionData: any) => {
    if (!subscriptionData) return undefined;
    
    return {
      status: subscriptionData.status,
      plan: subscriptionData.payment_details || 'basic', // Default to 'basic' if not specified
      current_period_end: subscriptionData.expires_at || subscriptionData.updated_at,
      expires_at: subscriptionData.expires_at
    };
  };

  // Função para verificar assinatura no Stripe
  const checkSubscription = async () => {
    try {
      if (!session?.access_token) {
        console.error('Sem token de acesso para verificar assinatura');
        return null;
      }

      const { data, error } = await supabase.functions.invoke('check-subscription', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Erro ao verificar assinatura:', error);
        return null;
      }

      // Se a assinatura for verificada com sucesso, atualizar usuário
      if (data && user) {
        setUser({
          ...user,
          subscription: {
            status: data.subscribed ? 'active' : 'inactive',
            plan: data.subscription_tier,
            current_period_end: data.subscription_end,
            expires_at: data.subscription_end
          }
        });
      }

      return data;
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error);
      return null;
    }
  };

  // Função para criar sessão de checkout do Stripe
  const createCheckoutSession = async (): Promise<string | null> => {
    try {
      if (!session?.access_token) {
        toast.error("Você precisa estar logado para assinar");
        return null;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Erro ao criar checkout:', error);
        toast.error("Erro ao iniciar o checkout: " + error.message);
        return null;
      }

      return data.url;
    } catch (error) {
      console.error('Erro ao criar checkout:', error);
      toast.error("Erro ao iniciar o checkout");
      return null;
    }
  };

  // Função para abrir o portal de cliente do Stripe
  const openCustomerPortal = async (): Promise<string | null> => {
    try {
      if (!session?.access_token) {
        toast.error("Você precisa estar logado para gerenciar sua assinatura");
        return null;
      }

      const { data, error } = await supabase.functions.invoke('customer-portal', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Erro ao abrir portal de cliente:', error);
        toast.error("Erro ao abrir o portal de gestão de assinatura: " + error.message);
        return null;
      }

      return data.url;
    } catch (error) {
      console.error('Erro ao abrir portal de cliente:', error);
      toast.error("Erro ao abrir o portal de gestão de assinatura");
      return null;
    }
  };

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
              votes(*)
            `)
            .eq('id', currentSession.user.id)
            .single();
          
          // Separately fetch vote_credits to handle potential relation errors
          const { data: voteCreditsData } = await supabase
            .from('user_vote_credits')
            .select('*')
            .eq('user_id', currentSession.user.id)
            .single();
          
          // Separately fetch subscription data
          const { data: subscriptionData } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', currentSession.user.id)
            .single();
          
          if (!error && userData) {
            // Transform the raw data into our User type
            const userObj: User = {
              id: currentSession.user.id,
              email: userData.email,
              username: userData.username,
              is_admin: userData.is_admin,
              created_at: userData.created_at,
              updated_at: userData.updated_at,
              votes: userData.votes || [],
              vote_credits: voteCreditsData || { total_credits: 0 },
              subscription: transformSubscriptionData(subscriptionData)
            };
            setUser(userObj);
            
            // Verificar assinatura no Stripe depois de configurar usuário inicial
            if (event === 'SIGNED_IN') {
              setTimeout(() => {
                checkSubscription();
              }, 1000); // Pequeno delay para garantir que o token esteja disponível
            }
          } else {
            // Fallback to basic user data if detailed fetch fails
            const basicUser: User = {
              id: currentSession.user.id,
              email: currentSession.user.email || '',
              username: '',
              is_admin: false,
              created_at: '',
              updated_at: '',
              votes: [],
              vote_credits: { total_credits: 0 },
              subscription: undefined
            };
            setUser(basicUser);
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
            votes(*)
          `)
          .eq('id', currentSession.user.id)
          .single();
        
        // Separately fetch vote_credits to handle potential relation errors
        const { data: voteCreditsData } = await supabase
          .from('user_vote_credits')
          .select('*')
          .eq('user_id', currentSession.user.id)
          .single();
        
        // Separately fetch subscription data
        const { data: subscriptionData } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', currentSession.user.id)
          .single();
        
        if (!error && userData) {
          // Transform the raw data into our User type
          const userObj: User = {
            id: currentSession.user.id,
            email: userData.email,
            username: userData.username,
            is_admin: userData.is_admin,
            created_at: userData.created_at,
            updated_at: userData.updated_at,
            votes: userData.votes || [],
            vote_credits: voteCreditsData || { total_credits: 0 },
            subscription: transformSubscriptionData(subscriptionData)
          };
          setUser(userObj);
          
          // Verificar assinatura no Stripe depois de configurar usuário
          setTimeout(() => {
            checkSubscription();
          }, 1000); // Pequeno delay para garantir que o token esteja disponível
        } else {
          // Fallback to basic user data if detailed fetch fails
          const basicUser: User = {
            id: currentSession.user.id,
            email: currentSession.user.email || '',
            username: '',
            is_admin: false,
            created_at: '',
            updated_at: '',
            votes: [],
            vote_credits: { total_credits: 0 },
            subscription: undefined
          };
          setUser(basicUser);
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
        // Instead of directly setting the user data, we need to fetch the full user profile
        const { data: userData, error } = await supabase
          .from('users')
          .select(`
            *,
            votes(*)
          `)
          .eq('id', data.user.id)
          .single();
        
        // Separately fetch vote_credits
        const { data: voteCreditsData } = await supabase
          .from('user_vote_credits')
          .select('*')
          .eq('user_id', data.user.id)
          .single();
        
        // Separately fetch subscription data
        const { data: subscriptionData } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', data.user.id)
          .single();
        
        if (!error && userData) {
          const updatedUser: User = {
            id: data.user.id,
            email: userData.email,
            username: userData.username,
            is_admin: userData.is_admin,
            created_at: userData.created_at,
            updated_at: userData.updated_at,
            votes: userData.votes || [],
            vote_credits: voteCreditsData || { total_credits: 0 },
            subscription: transformSubscriptionData(subscriptionData)
          };
          
          setUser(updatedUser);
          
          // Verificar assinatura no Stripe
          await checkSubscription();
          
          return updatedUser;
        }
      }
      return null;
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
    refreshUser,
    checkSubscription,
    createCheckoutSession,
    openCustomerPortal
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
