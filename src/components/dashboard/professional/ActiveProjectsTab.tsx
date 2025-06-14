
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Eye, CheckCircle, Clock, Calendar, DollarSign, AlertTriangle, Upload } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import ProjectStatusBadge from '@/components/shared/ProjectStatusBadge';
import { useNavigate } from 'react-router-dom';

// Local interfaces for this component
interface Milestone {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  status: string | null;
  is_complete: boolean | null;
  project_id: string | null;
  created_by: string | null;
  created_at: string | null;
  updated_at: string | null;
  requires_deliverable: boolean | null;
}

interface ProjectWithMilestones {
  id: string;
  title: string;
  description: string | null;
  status: string | null;
  budget: number | null;
  timeline: string | null;
  created_at: string | null;
  updated_at: string | null;
  client_id: string | null;
  professional_id: string | null;
  category: string | null;
  location: string | null;
  urgency: string | null;
  requirements: string[] | null;
  recommended_skills: string[] | null;
  rich_description: string | null;
  scope: string | null;
  industry_specific_fields: any;
  location_coordinates: any;
  project_start_time: string | null;
  service_contract: string | null;
  contract_template_id: string | null;
  sla_terms: any;
  assigned_to: string | null;
  deadline: string | null;
  spent: number | null;
  milestones: Milestone[];
}

interface ActiveProjectsTabProps {
  userId: string;
  isLoading: boolean;
  projects: ProjectWithMilestones[];
  markProjectComplete: (projectId: string) => Promise<void>;
}

const ActiveProjectsTab: React.FC<ActiveProjectsTabProps> = ({
  userId,
  isLoading,
  projects,
  markProjectComplete
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [expandedProject, setExpandedProject] = useState<ProjectWithMilestones | null>(null);
  const [isSubmittingWork, setIsSubmittingWork] = useState(false);

  // Filter projects assigned to this professional
  const activeProjects = projects.filter(project => 
    project.professional_id === userId && 
    project.status && 
    ['assigned', 'in_progress', 'work_submitted'].includes(project.status)
  );

  const handleViewProject = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const handleSubmitWork = async (projectId: string) => {
    try {
      setIsSubmittingWork(true);

      const { error } = await supabase
        .from('projects')
        .update({
          status: 'work_submitted',
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)
        .eq('professional_id', userId);

      if (error) throw error;

      toast({
        title: "Work Submitted",
        description: "Your work has been submitted for client review."
      });

      // Refresh projects data would be handled by parent component
    } catch (error: any) {
      console.error('Error submitting work:', error);
      toast({
        title: "Error",
        description: "Failed to submit work. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingWork(false);
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'assigned':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'work_submitted':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (activeProjects.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Projects</h3>
          <p className="text-gray-600 mb-4">
            You don't have any active projects at the moment. Check available projects to apply for new work.
          </p>
          <Button onClick={() => navigate('/professional/marketplace')}>
            <Plus className="w-4 h-4 mr-2" />
            Find Projects
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Active Projects</h2>
        <Badge variant="secondary" className="px-3 py-1">
          {activeProjects.length} Active
        </Badge>
      </div>

      <div className="grid gap-6">
        {activeProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{project.title}</CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <ProjectStatusBadge status={project.status as any} showIcon={true} />
                    {project.urgency && (
                      <Badge variant="outline" className="text-xs">
                        {project.urgency} Priority
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                {project.budget && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">Budget:</span>
                    <span className="font-medium">${project.budget.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Timeline:</span>
                  <span className="font-medium">{project.timeline || 'Not specified'}</span>
                </div>
              </div>

              {/* Milestones Progress */}
              {project.milestones && project.milestones.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Milestones Progress</span>
                    <span>
                      {project.milestones.filter(m => m.is_complete).length} / {project.milestones.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(project.milestones.filter(m => m.is_complete).length / project.milestones.length) * 100}%`
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewProject(project.id)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>

                {project.status === 'in_progress' && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleSubmitWork(project.id)}
                    disabled={isSubmittingWork}
                    className="flex-1"
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    Submit Work
                  </Button>
                )}

                {project.status === 'work_submitted' && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Awaiting Review
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ActiveProjectsTab;
