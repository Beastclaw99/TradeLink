
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectsTab from './client/ProjectsTab';
import ApplicationsTab from './client/ApplicationsTab';
import CreateProjectTab from './client/CreateProjectTab';
import PaymentsTab from './client/PaymentsTab';
import { useClientDashboard } from '@/hooks/useClientDashboard';
import { Project } from './types';
import { supabase } from '@/integrations/supabase/client';
import { useProjectOperations } from '@/hooks/useProjectOperations';

interface ClientDashboardProps {
  userId: string;
  initialTab?: string;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ userId, initialTab = 'projects' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Use consolidated hook for all dashboard functionality
  const { 
    // Data
    projects, 
    applications, 
    reviews, 
    profile, 
    isLoading,
    error,
    
    // Project state
    selectedProject,
    setSelectedProject,
    editedProject,
    projectToDelete,
    isProjectSubmitting,
    
    // Review state
    projectToReview,
    reviewData,
    isReviewSubmitting,
    
    // Actions
    fetchDashboardData,
    handleApplicationUpdate,
    handleEditInitiate,
    handleEditCancel,
    handleUpdateProject,
    handleDeleteInitiate,
    handleDeleteCancel,
    handleDeleteProject,
    handleReviewInitiate,
    handleReviewCancel,
    handleReviewSubmit,
    setReviewData
  } = useClientDashboard(userId);

  // Add useProjectOperations for robust project detail fetching
  const { fetchProjectDetails } = useProjectOperations(userId, fetchDashboardData);

  // Task handling functions using the correct table structure
  const handleAddMilestone = async (projectId: string, milestone: any) => {
    try {
      const { data, error } = await supabase
        .from('project_milestones')
        .insert([{
          project_id: projectId,
          title: milestone.title,
          description: milestone.description,
          due_date: milestone.dueDate,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      // Add project update
      await supabase
        .from('project_updates')
        .insert([{
          project_id: projectId,
          update_type: 'schedule_updated',
          message: `New milestone added: ${milestone.title}`,
          user_id: userId
        }]);

      await fetchDashboardData();
      return data;
    } catch (error) {
      console.error('Error adding milestone:', error);
      throw error;
    }
  };

  const handleEditMilestone = async (projectId: string, milestoneId: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('project_milestones')
        .update({
          title: updates.title,
          description: updates.description,
          due_date: updates.dueDate,
          status: updates.status
        })
        .eq('id', milestoneId)
        .select()
        .single();

      if (error) throw error;

      // Add project update
      await supabase
        .from('project_updates')
        .insert([{
          project_id: projectId,
          update_type: 'schedule_updated',
          message: `Milestone updated: ${updates.title}`,
          user_id: userId
        }]);

      await fetchDashboardData();
      return data;
    } catch (error) {
      console.error('Error editing milestone:', error);
      throw error;
    }
  };

  const handleDeleteMilestone = async (projectId: string, milestoneId: string) => {
    try {
      const { error } = await supabase
        .from('project_milestones')
        .delete()
        .eq('id', milestoneId);

      if (error) throw error;

      // Add project update
      await supabase
        .from('project_updates')
        .insert([{
          project_id: projectId,
          update_type: 'schedule_updated',
          message: 'Milestone deleted',
          user_id: userId
        }]);

      await fetchDashboardData();
    } catch (error) {
      console.error('Error deleting milestone:', error);
      throw error;
    }
  };

  // Note: Since project_tasks table doesn't exist, we'll create placeholder functions
  // These would need to be implemented when the tasks functionality is added
  const handleAddTask = async (milestoneId: string, task: any) => {
    console.log('Add task functionality not implemented - project_tasks table does not exist');
    // This would be implemented when project_tasks table is created
    return Promise.resolve();
  };

  const handleUpdateTask = async (taskId: string, updates: any) => {
    console.log('Update task functionality not implemented - project_tasks table does not exist');
    // This would be implemented when project_tasks table is created
    return Promise.resolve();
  };

  const handleDeleteTask = async (taskId: string) => {
    console.log('Delete task functionality not implemented - project_tasks table does not exist');
    // This would be implemented when project_tasks table is created
    return Promise.resolve();
  };

  // Set the active tab based on initialTab prop
  useEffect(() => {
    if (initialTab && ['projects', 'applications', 'create', 'payments'].includes(initialTab)) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  
  // Props to pass to tab components
  const projectsTabProps = {
    isLoading,
    projects,
    applications,
    editProject: editedProject,
    projectToDelete,
    editedProject: {
      title: editedProject?.title || '',
      description: editedProject?.description || '',
      budget: editedProject?.budget?.toString() || ''
    },
    isSubmitting: isProjectSubmitting,
    setEditedProject: (project: { title: string; description: string; budget: string }) => {
      if (editedProject) {
        handleEditInitiate({
          ...editedProject,
          title: project.title,
          description: project.description,
          budget: parseFloat(project.budget)
        });
      }
    },
    handleEditInitiate,
    handleEditCancel,
    handleUpdateProject,
    handleDeleteInitiate,
    handleDeleteCancel,
    handleDeleteProject,
    selectedProject,
    setSelectedProject,
    handleAddMilestone,
    handleEditMilestone,
    handleDeleteMilestone,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
    // Use robust fetchProjectDetails
    fetchProjectDetails,
    error,
    onEditProject: handleEditInitiate,
    onDeleteProject: handleDeleteInitiate,
    profile
  };
  
  const applicationsTabProps = {
    isLoading,
    projects,
    applications,
    handleApplicationUpdate,
    profile
  };
  
  const paymentsTabProps = {
    isLoading,
    projects,
    reviews,
    applications,
    projectToReview: projectToReview ? projects.find((p: Project) => p.id === projectToReview.project_id) || null : null,
    reviewData: {
      rating: reviewData.rating,
      comment: reviewData.comment
    },
    isSubmitting: isReviewSubmitting,
    handleReviewInitiate: (project: Project) => {
      const application = applications.find((app: any) => app.project_id === project.id);
      if (application) {
        handleReviewInitiate(application);
      }
    },
    handleReviewCancel,
    handleReviewSubmit,
    setReviewData: (data: { rating: number; comment: string }) => {
      setReviewData({
        ...reviewData,
        rating: data.rating,
        comment: data.comment
      });
    }
  };
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-6">
        <TabsTrigger value="projects" data-value="projects">Your Projects</TabsTrigger>
        <TabsTrigger value="applications" data-value="applications">Applications</TabsTrigger>
        <TabsTrigger value="create" data-value="create">Post New Project</TabsTrigger>
        <TabsTrigger value="payments" data-value="payments">Payments</TabsTrigger>
      </TabsList>
      
      <TabsContent value="projects">
        <ProjectsTab {...projectsTabProps} />
      </TabsContent>
      
      <TabsContent value="applications">
        <ApplicationsTab {...applicationsTabProps} />
      </TabsContent>
      
      <TabsContent value="create">
        <CreateProjectTab />
      </TabsContent>
      
      <TabsContent value="payments">
        <PaymentsTab {...paymentsTabProps} />
      </TabsContent>
    </Tabs>
  );
};

export default ClientDashboard;
