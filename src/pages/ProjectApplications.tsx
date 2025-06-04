
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { ProjectApplicationsView } from '@/components/dashboard/client/projects/ProjectApplicationsView';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const ProjectApplications: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [project, setProject] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!projectId) return;
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch project details
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();
        
        if (projectError) throw projectError;
        setProject(projectData);
        
        // Fetch applications with professional details
        const { data: applicationsData, error: applicationsError } = await supabase
          .from('applications')
          .select(`
            *,
            professional:profiles!applications_professional_id_fkey(
              id,
              first_name,
              last_name,
              rating,
              skills
            )
          `)
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });
        
        if (applicationsError) throw applicationsError;
        setApplications(applicationsData || []);
        
      } catch (error: any) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load project applications. Please try again later.",
          variant: "destructive"
        });
        navigate('/client/dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [projectId, navigate, toast]);
  
  const handleApplicationUpdate = async (
    applicationId: string,
    newStatus: string,
    projectId: string,
    professionalId: string
  ) => {
    try {
      // Update application status
      const { error: applicationError } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);
      
      if (applicationError) throw applicationError;
      
      // If application was accepted, update project status
      if (newStatus === 'accepted') {
        const { error: projectError } = await supabase
          .from('projects')
          .update({ status: 'assigned' })
          .eq('id', projectId);
        
        if (projectError) throw projectError;
        
        // Update other applications to rejected
        const { error: rejectError } = await supabase
          .from('applications')
          .update({ status: 'rejected' })
          .eq('project_id', projectId)
          .neq('id', applicationId);
        
        if (rejectError) throw rejectError;
      }
      
      // Update local state
      setApplications(prev => prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: newStatus }
          : app
      ));
      
      // If application was accepted, update project status
      if (newStatus === 'accepted') {
        setProject(prev => ({ ...prev, status: 'assigned' }));
      }
      
    } catch (error: any) {
      console.error('Error updating application:', error);
      throw error;
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin w-8 h-8 border-4 border-ttc-blue-700 border-t-transparent rounded-full"></div>
          <span className="ml-2">Loading applications...</span>
        </div>
      </Layout>
    );
  }
  
  if (!project) {
    return (
      <Layout>
        <div className="container-custom py-8">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p>The project you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/client/dashboard')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container-custom py-8">
        <ProjectApplicationsView
          applications={applications}
          projects={[project]}
          onUpdate={() => {
            // Refresh the data when an update occurs
            window.location.reload();
          }}
        />
      </div>
    </Layout>
  );
};

export default ProjectApplications;
