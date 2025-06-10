import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, DollarSign, User, Clock, Target } from "lucide-react";
import { Project } from '@/components/dashboard/types';
import { Milestone, Task } from '@/components/project/creation/types';
import { ProjectCardTabs } from './project-card/ProjectCardTabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface UnifiedProjectCardProps {
  project: Project;
  variant?: 'list' | 'card';
  onStatusChange?: (newStatus: string) => void;
  isProfessional?: boolean;
  onClick?: () => void;
  actionLabel?: string;
  isClient?: boolean;
  onMilestoneUpdate?: (milestoneId: string, updates: Partial<Milestone>) => Promise<void>;
  onMilestoneDelete?: (milestoneId: string) => Promise<void>;
  onTaskStatusUpdate?: (milestoneId: string, taskId: string, completed: boolean) => Promise<void>;
}

const UnifiedProjectCard: React.FC<UnifiedProjectCardProps> = ({
  project,
  variant = 'card',
  onStatusChange,
  isProfessional = false,
  onClick,
  actionLabel,
  isClient = false,
  onMilestoneUpdate,
  onMilestoneDelete,
  onTaskStatusUpdate
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('timeline');
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch milestones for this project
  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('project_milestones')
          .select('*')
          .eq('project_id', project.id)
          .order('due_date', { ascending: true });

        if (error) throw error;

        const formattedMilestones: Milestone[] = (data || []).map(milestone => {
          // Convert tasks from JSON to Task array
          let tasks: Task[] = [];
          if (milestone.tasks) {
            try {
              const tasksData = Array.isArray(milestone.tasks) ? milestone.tasks : JSON.parse(milestone.tasks);
              tasks = tasksData.map((task: any) => ({
                id: task.id || crypto.randomUUID(),
                title: task.title || '',
                description: task.description || '',
                completed: task.completed || false,
                created_at: task.created_at,
                updated_at: task.updated_at
              }));
            } catch (e) {
              console.warn('Failed to parse tasks for milestone:', milestone.id, e);
              tasks = [];
            }
          }

          return {
            id: milestone.id,
            title: milestone.title,
            description: milestone.description || '',
            dueDate: milestone.due_date,
            status: milestone.status as 'not_started' | 'in_progress' | 'completed' | 'on_hold',
            requires_deliverable: Boolean(milestone.requires_deliverable),
            tasks: tasks,
            deliverables: [],
            project_id: milestone.project_id,
            created_by: milestone.created_by,
            created_at: milestone.created_at,
            updated_at: milestone.updated_at,
            is_complete: Boolean(milestone.is_complete),
            due_date: milestone.due_date
          };
        });

        setMilestones(formattedMilestones);
      } catch (error) {
        console.error('Error fetching milestones:', error);
        toast({
          title: "Error",
          description: "Failed to load project milestones.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMilestones();
  }, [project.id, toast]);

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString();
  };

  if (variant === 'list') {
    return (
      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-lg">{project.title}</h3>
            <Badge className={getStatusColor(project.status)}>
              {project.status?.replace('_', ' ') || 'Open'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
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
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Posted {formatDate(project.created_at)}
            </span>
          </div>
          
          {project.description && (
            <p className="text-gray-700 text-sm line-clamp-2">{project.description}</p>
          )}
        </div>
        
        {onClick && (
          <Button onClick={onClick} variant="outline">
            {actionLabel || 'View Details'}
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
            <div className="flex items-center gap-2 mb-3">
              <Badge className={getStatusColor(project.status)}>
                {project.status?.replace('_', ' ') || 'Open'}
              </Badge>
              {project.urgency && (
                <Badge variant="outline">
                  {project.urgency} Priority
                </Badge>
              )}
            </div>
          </div>
          
          {onClick && (
            <Button onClick={onClick} variant="outline" size="sm">
              {actionLabel || 'View'}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {project.description && (
          <p className="text-gray-700">{project.description}</p>
        )}
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          {project.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>{project.location}</span>
            </div>
          )}
          
          {project.budget && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span>${project.budget.toLocaleString()}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>Posted {formatDate(project.created_at)}</span>
          </div>
          
          {project.expected_timeline && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>{project.expected_timeline}</span>
            </div>
          )}
          
          {project.client && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span>{project.client.first_name} {project.client.last_name}</span>
            </div>
          )}
          
          {milestones.length > 0 && (
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-gray-500" />
              <span>{milestones.length} milestone{milestones.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
        
        {project.requirements && project.requirements.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Requirements</h4>
            <ul className="list-disc pl-5 space-y-1">
              {project.requirements.slice(0, 3).map((req, index) => (
                <li key={index} className="text-sm text-gray-600">{req}</li>
              ))}
              {project.requirements.length > 3 && (
                <li className="text-sm text-gray-500">
                  +{project.requirements.length - 3} more requirements
                </li>
              )}
            </ul>
          </div>
        )}

        <ProjectCardTabs
          project={project}
          milestones={milestones}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isProfessional={isProfessional}
          isClient={isClient}
          onMilestoneUpdate={onMilestoneUpdate}
          onMilestoneDelete={onMilestoneDelete}
          onTaskStatusUpdate={onTaskStatusUpdate}
        />
      </CardContent>
    </Card>
  );
};

export default UnifiedProjectCard;
