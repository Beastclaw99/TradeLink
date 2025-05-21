
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProfileData } from '@/components/profile/types';
import { Project } from '../types';

interface ProfileTabProps {
  navigate?: (path: string) => void;
  userId?: string;
  profileData?: ProfileData | null;
  projects?: Project[];
}

const ProfileTab: React.FC<ProfileTabProps> = ({ 
  profileData: propProfileData, 
  projects: propProjects, 
  navigate: propNavigate,
  userId
}) => {
  const navigateHook = useNavigate();
  const navigate = propNavigate || navigateHook;
  
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(propProfileData || null);
  const [projects, setProjects] = useState<Project[]>(propProjects || []);
  
  useEffect(() => {
    if (propProfileData) setProfileData(propProfileData);
    if (propProjects) setProjects(propProjects);
  }, [propProfileData, propProjects]);
  
  useEffect(() => {
    if (!userId) return;
    if (!propProfileData || !propProjects) {
      fetchData();
    }
  }, [userId]);
  
  const fetchData = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      
      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) throw profileError;
      setProfileData(profileData);
      
      // Fetch projects if client
      if (profileData.account_type === 'client') {
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .eq('client_id', userId);
        
        if (projectsError) throw projectsError;
        setProjects(projectsData || []);
      }
      
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <p>Loading profile information...</p>;
  }
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Profile</h2>
        <Button 
          onClick={() => navigate('/profile')}
          className="bg-ttc-blue-700 hover:bg-ttc-blue-800"
        >
          View Full Profile
        </Button>
      </div>
      
      {profileData ? (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p>{profileData.first_name} {profileData.last_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Account Type</h3>
                  <p className="capitalize">{profileData.account_type}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                  <p>{new Date(profileData.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Projects Posted</h3>
                  <p>{projects.length}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Active Projects</h3>
                  <p>{projects.filter(p => p.status === 'assigned').length}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Completed Projects</h3>
                  <p>{projects.filter(p => p.status === 'completed').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <p>No profile information available.</p>
      )}
    </>
  );
};

export default ProfileTab;
