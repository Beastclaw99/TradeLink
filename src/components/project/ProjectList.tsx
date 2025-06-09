import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { 
  Briefcase, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  DollarSign,
  MessageSquare
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  budget: number;
  created_at: string;
  deadline?: string;
  client?: {
    name: string;
    avatar_url?: string;
  };
  professional?: {
    name: string;
    avatar_url?: string;
  };
}

interface ProjectListProps {
  projects: Project[];
  onProjectUpdate?: () => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onProjectUpdate
}) => {
  const getStatusBadge = (status: Project['status']) => {
    const statusConfig = {
      open: {
        label: 'Open',
        icon: <Briefcase className="h-4 w-4" />,
        variant: 'default' as const
      },
      in_progress: {
        label: 'In Progress',
        icon: <Clock className="h-4 w-4" />,
        variant: 'secondary' as const
      },
      completed: {
        label: 'Completed',
        icon: <CheckCircle className="h-4 w-4" />,
        variant: 'outline' as const
      },
      cancelled: {
        label: 'Cancelled',
        icon: <AlertCircle className="h-4 w-4" />,
        variant: 'destructive' as const
      }
    };

    const config = statusConfig[status];
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {projects.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No projects found</p>
          </CardContent>
        </Card>
      ) : (
        projects.map((project) => (
          <Card key={project.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">
                {project.title}
              </CardTitle>
              {getStatusBadge(project.status)}
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                {project.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>${project.budget.toLocaleString()}</span>
                </div>
                {project.deadline && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Due {formatDistanceToNow(new Date(project.deadline), { addSuffix: true })}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span>Created {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}</span>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = `/projects/${project.id}`}
                >
                  View Details
                </Button>
                {project.status === 'open' && (
                  <Button
                    size="sm"
                    onClick={() => window.location.href = `/projects/${project.id}/apply`}
                  >
                    Apply Now
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}; 