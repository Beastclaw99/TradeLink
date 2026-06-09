
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

// Temporary bypass while Supabase access is unavailable — set to false to restore auth
export const BYPASS_AUTH = true;

const MOCK_USER = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'dev@tradelink.local',
  user_metadata: { account_type: 'client' },
  app_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
} as User;

const MOCK_SESSION = {
  access_token: 'bypass',
  refresh_token: 'bypass',
  expires_in: 3600,
  token_type: 'bearer',
  user: MOCK_USER,
} as Session;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(BYPASS_AUTH ? MOCK_USER : null);
  const [session, setSession] = useState<Session | null>(BYPASS_AUTH ? MOCK_SESSION : null);
  const [isLoading, setIsLoading] = useState(!BYPASS_AUTH);
  const { toast } = useToast();

  useEffect(() => {
    if (BYPASS_AUTH) {
      return;
    }

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
        
        if (event === 'SIGNED_OUT') {
          toast({
            title: "Logged out",
            description: "You have been logged out successfully."
          });
        } else if (event === 'SIGNED_IN') {
          toast({
            title: "Logged in",
            description: "Welcome to Trade Link!"
          });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const signOut = async () => {
    if (BYPASS_AUTH) {
      toast({
        title: "Auth bypassed",
        description: "Sign out is disabled while auth bypass is active.",
      });
      return;
    }

    setIsLoading(true);
    try {
      await supabase.auth.signOut({ scope: 'global' });
      
      // Clean up auth state in localStorage
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      setIsLoading(false);
    }
  };

  // Alias logout to signOut for compatibility
  const logout = signOut;

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signOut, logout }}>
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
