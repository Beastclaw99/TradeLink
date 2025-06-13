import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import ClientDashboard from '@/components/dashboard/ClientDashboard';
import ProfessionalDashboard from '@/components/dashboard/ProfessionalDashboard';

const Dashboard: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accountType, setAccountType] = useState<'client' | 'professional' | null>(null);
  const location = useLocation();
  const activeTab = location.state?.activeTab || 'projects';

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        setIsLoadingProfile(true);
        setError(null);

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          throw new Error('Failed to load profile information. Please try again.');
        }

        if (!profileData) {
          // Create a new profile if one doesn't exist
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([
              {
                id: user.id,
                email: user.email,
                account_type: user.user_metadata?.account_type || 'client',
                created_at: new Date().toISOString(),
              }
            ])
            .select()
            .single();

          if (createError) {
            console.error('Profile creation error:', createError);
            throw new Error('Failed to create profile. Please try again.');
          }

          console.log('New profile created:', newProfile);
          setAccountType(newProfile.account_type);
        } else {
          console.log('Existing profile data:', profileData);
          setAccountType(profileData.account_type);
        }
      } catch (error: any) {
        console.error('Error in profile handling:', error);
        setError('Failed to load your profile. Please try again later.');
        toast({
          title: "Error",
          description: "Failed to load your profile. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (user) {
      fetchUserProfile();
    } else if (!isLoading) {
      setIsLoadingProfile(false);
    }
  }, [user, isLoading, toast]);

  const retryFetchProfile = async () => {
    setIsLoadingProfile(true);
    if (user) {
      try {
        setError(null);
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, account_type')
          .eq('id', user.id)
          .single();
        
        if (profileError) {
          console.error('Profile fetch error:', profileError);
          throw profileError;
        }
        
        if (!profileData) {
          // Profile doesn't exist, create it
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([
              {
                id: user.id,
                account_type: user.user_metadata?.account_type || 'client', // Use account type from metadata
                first_name: user.user_metadata?.full_name?.split(' ')[0] || null,
                last_name: user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || null,
                email: user.email
              }
            ])
            .select()
            .single();
          
          if (createError) {
            console.error('Profile creation error:', createError);
            throw createError;
          }
          
          console.log('Created new profile:', newProfile);
          setAccountType(newProfile.account_type);
        } else {
          console.log('Existing profile data:', profileData);
          setAccountType(profileData.account_type);
        }
      } catch (error: any) {
        console.error('Error retrying profile fetch:', error);
        setError('Failed to load your profile. Please try again later.');
        toast({
          title: "Error",
          description: "Failed to load your profile. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingProfile(false);
      }
    }
  };

  if (isLoading || isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {accountType === 'client' ? (
          <ClientDashboard userId={user.id} initialTab={activeTab} />
        ) : accountType === 'professional' ? (
          <ProfessionalDashboard userId={user.id} />
        ) : (
          <div>Loading dashboard...</div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
