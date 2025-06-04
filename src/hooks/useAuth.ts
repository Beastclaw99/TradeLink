import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

interface User extends Tables<'profiles'> {
  role: 'client' | 'professional' | 'admin';
}

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;

      if (authData.user) {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (profileError) throw profileError;

        // Determine user role from account_type
        const role = profileData.account_type === 'client' ? 'client' : 
                    profileData.account_type === 'professional' ? 'professional' : 'admin';

        setUser({
          ...profileData,
          role
        });
      }
    } catch (err) {
      throw new Error('Failed to login');
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (err) {
      throw new Error('Failed to logout');
    }
  }, []);

  // Check current session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (session?.user) {
          // Fetch user profile
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) throw profileError;

          // Determine user role from account_type
          const role = profileData.account_type === 'client' ? 'client' : 
                      profileData.account_type === 'professional' ? 'professional' : 'admin';

          setUser({
            ...profileData,
            role
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to check session'));
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
      } else if (session?.user) {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          setError(profileError);
          return;
        }

        // Determine user role from account_type
        const role = profileData.account_type === 'client' ? 'client' : 
                    profileData.account_type === 'professional' ? 'professional' : 'admin';

        setUser({
          ...profileData,
          role
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    isLoading,
    error,
    login,
    logout
  };
}; 