import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Database } from '@/integrations/supabase/types';
import ProjectStatusBadge from '@/components/shared/ProjectStatusBadge';
import { Edit, Trash2, Eye, Users, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

type Project = Database['public']['Tables']['projects']['Row'];
type Application = Database['public']['Tables']['applications']['Row'];
type ProjectStatus = Database['public']['Enums']['project_status_enum'];
type ApplicationStatus = Database['public']['Enums']['application_status'];

interface ProjectCardProps {
  project: Project;
  applications: Application[];
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  onStatusUpdate?: () => void; // Add callback for status updates
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  applications, 
  onEdit, 
  onDelete,
  onStatusUpdate
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isPublishing, setIsPublishing] = useState(false);
  
  const projectApplications = applications.filter(app => app.project_id === project.id);
  const pendingApplications = projectApplications.filter(app => app.status === 'pending' as ApplicationStatus);
  const acceptedApplication = projectApplications.find(app => app.status === 'accepted' as ApplicationStatus);

  const handleViewDetails = () => {
    navigate(`/projects/${project.id}`);
  };

  const handleViewApplications = () => {
    navigate(`/client/projects/${project.id}/applications`);
  };

  // Handle publishing project (draft -> open) with proper validation
  const handlePublishProject = async () => {
    try {
      setIsPublishing(true);

      // Validate required fields
      const missingFields = [];
      if (!project.title) missingFields.push('title');
      if (!project.description) missingFields.push('description');
      if (!project.budget || project.budget <= 0) missingFields.push('budget');
      if (!project.timeline) missingFields.push('timeline');

      if (missingFields.length > 0) {
        toast({
          title: "Missing Required Fields",
          description: `Please complete the following required fields: ${missingFields.join(', ')}`,
          variant: "destructive"
        });
        return;
      }

      // Update project status to 'open'
      const { error } = await supabase
        .from('projects')
        .update({ status: 'open' })
        .eq('id', project.id);

      if (error) {
        console.error('Error publishing project:', error);
        throw error;
      }

      toast({
        title: "Project Published",
        description: "Your project is now visible on the marketplace."
      });

      // Call the status update callback to refresh data
      if (onStatusUpdate) {
        onStatusUpdate();
      }

    } catch (error: any) {
      console.error('Error publishing project:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to publish project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleEdit = () => {
    // Store the project data in localStorage for the wizard to use
    localStorage.setItem('editProjectData', JSON.stringify(project));
    navigate('/client/create-project?mode=edit');
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{project.title}</CardTitle>
            <ProjectStatusBadge status={project.status || 'open' as ProjectStatus} showIcon={true} />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
        
        <div className="space-y-2 mb-4">
          {project.budget && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Budget:</span>
              <span className="font-medium">${project.budget.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total Applications:</span>
            <span className="font-medium">{projectApplications.length}</span>
          </div>
          {pendingApplications.length > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Pending Review:</span>
              <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                {pendingApplications.length}
              </Badge>
            </div>
          )}
          {acceptedApplication && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Assigned Professional:</span>
              <span className="font-medium">
                {acceptedApplication.professional_id}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleViewDetails}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Button>
          
          {project.status === 'open' as ProjectStatus && (
            <Button 
              variant="default" 
              size="sm"
              onClick={handleViewApplications}
              className="flex-1"
            >
              <Users className="h-4 w-4 mr-1" />
              View Applications
            </Button>
          )}

          {/* Publish button - only show for draft projects */}
          {project.status === 'draft' as ProjectStatus && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="default" 
                  size="sm"
                  className="flex-1"
                  disabled={isPublishing}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  {isPublishing ? 'Publishing...' : 'Publish'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Publish Project</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to publish this project? Once published, it will be visible to professionals and they can start submitting applications. Make sure all project details (title, description, budget, and timeline) are complete.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handlePublishProject}>
                    Publish Project
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleEdit}
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDelete(project.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
