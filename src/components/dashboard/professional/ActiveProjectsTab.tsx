import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/useToast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { Project } from '@/components/dashboard/types';

interface ActiveProjectsTabProps {
  professionalId: string;
}

export const ActiveProjectsTab: React.FC<ActiveProjectsTabProps> = ({ professionalId }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchActiveProjects = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          client:profiles!projects_client_id_fkey(*)
        `)
        .eq('assigned_to', professionalId)
        .in('status', ['assigned', 'in_progress', 'review']);

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching active projects:', error);
      toast({
        title: 'Error',
        description: 'Failed to load active projects',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveProjects();
  }, [professionalId]);

  const handleStatusUpdate = async (projectId: string, newStatus: Project['status']) => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', projectId);

      if (error) throw error;

      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, status: newStatus } : p))
      );

      toast({
        title: 'Success',
        description: 'Project status updated successfully',
      });
    } catch (error) {
      console.error('Error updating project status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update project status',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No active projects found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{project.title}</CardTitle>
              <Badge
                variant={
                  project.status === 'review'
                    ? 'destructive'
                    : project.status === 'in_progress'
                    ? 'default'
                    : 'secondary'
                }
              >
                {project.status.replace('_', ' ')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Client</p>
                <p>{(project as any).client?.first_name} {(project as any).client?.last_name}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p className="text-sm">{project.description}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Budget</p>
                <p>${project.budget}</p>
              </div>

              <div className="flex gap-2">
                {project.status === 'assigned' && (
                  <Button
                    onClick={() => handleStatusUpdate(project.id, 'in_progress')}
                    variant="default"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Start Project
                  </Button>
                )}
                {project.status === 'in_progress' && (
                  <Button
                    onClick={() => handleStatusUpdate(project.id, 'review')}
                    variant="default"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit for Review
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ActiveProjectsTab;
