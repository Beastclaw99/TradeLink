import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProfileData } from '@/components/profile/types';
import { Project } from '../types';
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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
}: ProfileTabProps) => {
  const navigateHook = useNavigate();
  const navigate = propNavigate || navigateHook;
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(propProfileData || null);
  const [projects, setProjects] = useState<Project[]>(propProjects || []);
  
  useEffect(() => {
    if (propProfileData) setProfileData(propProfileData);
    if (propProjects) setProjects(propProjects);
  }, [propProfileData, propProjects]);
  
  useEffect(() => {
    if (!userId) {
      setError('User ID is required to load profile information');
      return;
    }
    if (!propProfileData || !propProjects) {
      fetchData();
    }
  }, [userId]);
  
  const fetchData = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) {
        console.error('Profile fetch error:', profileError);
        throw new Error('Failed to load profile information. Please try again.');
      }
      
      if (!profileData) {
        throw new Error('Profile not found. Please complete your profile setup.');
      }
      
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
        profile_image_url: profileData.profile_image_url || '',
        verification_status: (profileData.verification_status as 'unverified' | 'pending' | 'verified') || null,
        years_of_experience: profileData.years_of_experience || null,
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
        
        if (projectsError) {
          console.error('Projects fetch error:', projectsError);
          throw new Error('Failed to load projects information. Please try again.');
        }
        
        // Transform projects to match Project interface
        const transformedProjects: Project[] = (projectsData || []).map((project: any) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          category: project.category,
          budget: project.budget,
          expected_timeline: project.expected_timeline,
          location: project.location,
          urgency: project.urgency,
          requirements: project.requirements,
          recommended_skills: project.recommended_skills || null,
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
          sla_terms: project.sla_terms,
          spent: project.spent || 0
        }));
        
        setProjects(transformedProjects);
      }
      
    } catch (error: any) {
      console.error('Error fetching profile data:', error);
      setError(error.message || 'An unexpected error occurred while loading profile information');
      toast({
        title: "Error",
        description: error.message || 'An unexpected error occurred while loading profile information',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <p className="text-gray-600">Loading profile information...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <Button 
          onClick={fetchData} 
          variant="outline" 
          className="mt-2"
        >
          Try Again
        </Button>
      </Alert>
    );
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
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Profile Information</AlertTitle>
          <AlertDescription>
            Your profile information could not be found. Please complete your profile setup.
          </AlertDescription>
          <Button 
            onClick={() => navigate('/profile/edit')} 
            variant="outline" 
            className="mt-2"
          >
            Complete Profile
          </Button>
        </Alert>
      )}
    </>
  );
};

export default ProfileTab;
