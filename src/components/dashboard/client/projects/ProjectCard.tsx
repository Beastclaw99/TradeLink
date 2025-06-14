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
import { Edit, Trash2, Eye, Users, Upload, Calendar, DollarSign, MapPin, Clock, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { formatDateToLocale } from '@/utils/dateUtils';

type Project = Database['public']['Tables']['projects']['Row'];
type Application = Database['public']['Tables']['applications']['Row'];
type ProjectStatus = Database['public']['Enums']['project_status_enum'];
type ApplicationStatus = Database['public']['Enums']['application_status'];

interface ProjectCardProps {
  project: Project;
  applications: Application[];
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  onStatusUpdate?: () => void;
}

interface StatusConfig {
  label: string;
  variant: 'default' | 'secondary' | 'outline' | 'destructive';
  icon: React.ReactNode;
  color: string;
}

const getStatusConfig = (status: ProjectStatus | null): StatusConfig => {
  switch (status) {
    case 'open':
      return {
        label: 'Open',
        variant: 'default',
        icon: <Clock className="h-4 w-4 text-blue-600" />,
        color: 'bg-blue-100 text-blue-800 border-blue-200'
      };
    case 'assigned':
      return {
        label: 'Assigned',
        variant: 'secondary',
        icon: <Target className="h-4 w-4 text-purple-600" />,
        color: 'bg-purple-100 text-purple-800 border-purple-200'
      };
    case 'completed':
      return {
        label: 'Completed',
        variant: 'default',
        icon: <CheckCircle className="h-4 w-4 text-green-600" />,
        color: 'bg-green-100 text-green-800 border-green-200'
      };
    case 'cancelled':
      return {
        label: 'Cancelled',
        variant: 'destructive',
        icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
        color: 'bg-red-100 text-red-800 border-red-200'
      };
    case 'disputed':
      return {
        label: 'Disputed',
        variant: 'destructive',
        icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
        color: 'bg-red-100 text-red-800 border-red-200'
      };
    case 'draft':
      return {
        label: 'Draft',
        variant: 'outline',
        icon: <Clock className="h-4 w-4 text-gray-600" />,
        color: 'bg-gray-100 text-gray-800 border-gray-200'
      };
    case 'in_progress':
      return {
        label: 'In Progress',
        variant: 'secondary',
        icon: <Clock className="h-4 w-4 text-yellow-600" />,
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      };
    case 'work_submitted':
      return {
        label: 'Work Submitted',
        variant: 'secondary',
        icon: <Clock className="h-4 w-4 text-indigo-600" />,
        color: 'bg-indigo-100 text-indigo-800 border-indigo-200'
      };
    case 'work_revision_requested':
      return {
        label: 'Revision Requested',
        variant: 'destructive',
        icon: <AlertTriangle className="h-4 w-4 text-orange-600" />,
        color: 'bg-orange-100 text-orange-800 border-orange-200'
      };
    case 'work_approved':
      return {
        label: 'Work Approved',
        variant: 'default',
        icon: <CheckCircle className="h-4 w-4 text-green-600" />,
        color: 'bg-green-100 text-green-800 border-green-200'
      };
    case 'archived':
      return {
        label: 'Archived',
        variant: 'outline',
        icon: <Clock className="h-4 w-4 text-gray-600" />,
        color: 'bg-gray-100 text-gray-800 border-gray-200'
      };
    default:
      return {
        label: 'Unknown',
        variant: 'outline',
        icon: <AlertTriangle className="h-4 w-4 text-gray-600" />,
        color: 'bg-gray-100 text-gray-800 border-gray-200'
      };
  }
};

const getUrgencyColor = (urgency: string | null): string => {
  switch (urgency?.toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

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

  const statusConfig = getStatusConfig(project.status);

  const handleViewDetails = () => {
    navigate(`/projects/${project.id}`);
  };

  const handleViewApplications = () => {
    navigate(`/client/projects/${project.id}/applications`);
  };

  const handlePublishProject = async () => {
    try {
      setIsPublishing(true);

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
    localStorage.setItem('editProjectData', JSON.stringify(project));
    navigate('/create-project?mode=edit');
  };

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="text-xl">{project.title}</CardTitle>
              <div className="flex items-center gap-2">
                {statusConfig.icon}
                <Badge variant={statusConfig.variant} className={statusConfig.color}>
                  {statusConfig.label}
                </Badge>
                {project.urgency && (
                  <Badge className={`border ${getUrgencyColor(project.urgency)}`}>
                    {project.urgency} Priority
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDateToLocale(project.created_at)}
              </span>
              {project.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {project.location}
                </span>
              )}
              {project.budget && (
                <span className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  ${project.budget.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
        
        <div className="space-y-2 mb-4">
          {project.timeline && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Timeline:</span>
              <span className="font-medium">{project.timeline}</span>
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
