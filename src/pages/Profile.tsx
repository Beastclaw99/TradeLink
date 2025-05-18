
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import Layout from '@/components/layout/Layout';
import { Loader2 } from 'lucide-react';
import ClientProfile from '@/components/profile/ClientProfile';
import ProfessionalProfile from '@/components/profile/ProfessionalProfile';

const Profile = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // If no userId is provided, use the current user's ID
  const profileId = userId || user?.id;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!profileId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', profileId)
          .single();
        
        if (error) throw error;
        
        setProfile(data);
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [profileId]);

  // If not logged in and trying to access own profile, redirect to login
  if (!user && !userId) {
    return <Navigate to="/login" />;
  }

  // Display loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="container-custom py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-ttc-blue-700" />
            <span className="ml-2 text-lg">Loading profile...</span>
          </div>
        </div>
      </Layout>
    );
  }

  // Display error state
  if (error || !profile) {
    return (
      <Layout>
        <div className="container-custom py-8">
          <div className="bg-red-50 border border-red-200 p-4 rounded-md">
            <p className="text-red-700">
              {error || "Profile not found"}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        
        {profile.account_type === 'client' ? (
          <ClientProfile profile={profile} isOwnProfile={profileId === user?.id} />
        ) : profile.account_type === 'professional' ? (
          <ProfessionalProfile profile={profile} isOwnProfile={profileId === user?.id} />
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
            <p className="text-yellow-700">
              Unknown account type.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Profile;
