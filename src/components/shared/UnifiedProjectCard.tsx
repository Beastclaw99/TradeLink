import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, CheckCircle2, Link2, ListChecks, MessageSquare, User2 } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Task, Milestone } from '@/components/project/creation/types';

interface UnifiedProjectCardProps {
  project: any;
  view?: 'card' | 'list';
}

interface StatusConfig {
  label: string;
  variant: "default" | "secondary" | "success" | "destructive" | "outline";
}

interface Json {
  [key: string]: string | number | boolean | Json | Json[] | null;
}

const getStatusConfig = (status: string): StatusConfig => {
  switch (status) {
    case 'open':
      return { label: 'Open', variant: 'default' };
    case 'assigned':
      return { label: 'Assigned', variant: 'secondary' };
    case 'completed':
      return { label: 'Completed', variant: 'success' };
    case 'cancelled':
      return { label: 'Cancelled', variant: 'destructive' };
    default:
      return { label: 'Unknown', variant: 'outline' };
  }
};

const UnifiedProjectCard: React.FC<UnifiedProjectCardProps> = ({ project, view = 'card' }) => {
  const navigate = useNavigate();

  // Convert database milestones to Milestone type
  const milestones: Milestone[] = project.project_milestones?.map((dbMilestone: any) => {
    // Safe conversion of tasks from Json to Task[]
    let tasks: Task[] = [];
    if (Array.isArray(dbMilestone.tasks)) {
      tasks = dbMilestone.tasks.map((task: any) => {
        if (typeof task === 'object' && task !== null) {
          return {
            id: task.id || crypto.randomUUID(),
            title: task.title || '',
            description: task.description || '',
            completed: Boolean(task.completed),
            created_at: task.created_at || new Date().toISOString(),
            updated_at: task.updated_at || new Date().toISOString(),
            ...task
          };
        }
        return {
          id: crypto.randomUUID(),
          title: String(task),
          description: '',
          completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      });
    }

    return {
      id: dbMilestone.id,
      title: dbMilestone.title,
      description: dbMilestone.description || '',
      dueDate: dbMilestone.due_date,
      status: dbMilestone.status as Milestone['status'],
      requires_deliverable: Boolean(dbMilestone.requires_deliverable),
      tasks,
      deliverables: [],
      project_id: dbMilestone.project_id,
      created_by: dbMilestone.created_by,
      created_at: dbMilestone.created_at,
      updated_at: dbMilestone.updated_at,
      is_complete: Boolean(dbMilestone.is_complete),
      due_date: dbMilestone.due_date
    };
  }) || [];

  const statusConfig = getStatusConfig(project.status);

  const handleCardClick = () => {
    navigate(`/projects/${project.id}`);
  };

  const getProjectType = (): 'open' | 'applied' | 'assigned' | 'completed' => {
    if (project.assigned_to) return 'assigned';
    if (project.status === 'completed') return 'completed';
    if (project.applications && project.applications.length > 0) return 'applied';
    return 'open';
  };

  const projectType = getProjectType();

  return (
    <Card onClick={handleCardClick} className="hover:cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start">
          <Avatar className="w-10 h-10 mr-4">
            <AvatarImage src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${project.title}`} />
            <AvatarFallback>{project.title.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">{project.title}</h2>
            <p className="text-sm text-gray-500">{project.description}</p>
          </div>
        </div>
        <div className="mt-4">
          <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
          {projectType === 'applied' && (
            <Badge variant="secondary" className="ml-2">Applied</Badge>
          )}
          {projectType === 'assigned' && (
            <Badge variant="secondary" className="ml-2">Assigned</Badge>
          )}
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-gray-600 text-sm">
            <CalendarDays className="w-4 h-4 mr-2" />
            <span>{format(new Date(project.created_at), 'PPP')}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <User2 className="w-4 h-4 mr-2" />
            <span>{project.client_id}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Link2 className="w-4 h-4 mr-2" />
            <span>{project.location}</span>
          </div>
          {milestones.length > 0 && (
            <div className="flex items-center text-gray-600 text-sm">
              <ListChecks className="w-4 h-4 mr-2" />
              <span>{milestones.length} Milestone(s)</span>
            </div>
          )}
          {project.comments && project.comments.length > 0 && (
            <div className="flex items-center text-gray-600 text-sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              <span>{project.comments.length} Comments</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="px-4 py-2 bg-gray-50 border-t">
        <div className="flex items-center justify-between w-full">
          <span className="text-sm text-gray-700 font-medium">${project.budget?.toLocaleString()}</span>
          {project.status === 'completed' ? (
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          ) : (
            <Button size="sm">View Project</Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default UnifiedProjectCard;
