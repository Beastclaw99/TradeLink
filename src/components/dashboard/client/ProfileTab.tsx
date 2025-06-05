
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
      
      // Cast the database profile to our ProfileData type with proper type casting
      const typedProfileData: ProfileData = {
        ...profileData,
        bio: profileData.bio || null,
        location: profileData.location || null,
        phone: profileData.phone || null,
        email: profileData.email || null,
        hourly_rate: profileData.hourly_rate || null,
        availability: (profileData.availability as 'available' | 'busy' | 'unavailable') || null,
        skills: profileData.skills || null,
        certifications: profileData.certifications || null,
        completed_projects: profileData.completed_projects || null,
        response_rate: profileData.response_rate || null,
        on_time_completion: profileData.on_time_completion || null,
        profile_visibility: profileData.profile_visibility ?? true,
        show_email: profileData.show_email ?? true,
        show_phone: profileData.show_phone ?? true,
        allow_messages: profileData.allow_messages ?? true,
        profile_image: profileData.profile_image || null,
        verification_status: (profileData.verification_status as 'unverified' | 'pending' | 'verified') || null,
        years_experience: profileData.years_experience || null,
        rating: profileData.rating || null,
        portfolio_images: profileData.portfolio_images || null,
      };
      
      setProfileData(typedProfileData);
      
      // Fetch projects if client
      if (profileData.account_type === 'client') {
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .eq('client_id', userId);
        
        if (projectsError) throw projectsError;
        
        // Transform projects to match Project interface
        const transformedProjects: Project[] = (projectsData || []).map(project => ({
          id: project.id,
          title: project.title,
          description: project.description,
          category: project.category,
          budget: project.budget,
          expected_timeline: project.expected_timeline,
          location: project.location,
          urgency: project.urgency,
          requirements: project.requirements,
          required_skills: project.recommended_skills || null, // Map recommended_skills to required_skills
          status: project.status,
          created_at: project.created_at,
          updated_at: project.updated_at,
          client_id: project.client_id,
          assigned_to: project.assigned_to,
          professional_id: project.professional_id,
          contract_template_id: project.contract_template_id,
          deadline: project.deadline,
          industry_specific_fields: project.industry_specific_fields,
          location_coordinates: project.location_coordinates,
          project_start_time: project.project_start_time,
          rich_description: project.rich_description,
          scope: project.scope,
          service_contract: project.service_contract,
          sla_terms: project.sla_terms
        }));
        
        setProjects(transformedProjects);
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
