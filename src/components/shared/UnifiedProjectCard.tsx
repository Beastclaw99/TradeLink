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
  variant?: 'card' | 'list';
  isProfessional?: boolean;
  actionLabel?: string;
  onClick?: () => void;
}

interface StatusConfig {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
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
      return { label: 'Completed', variant: 'default' }; // Changed from 'success' to 'default'
    case 'cancelled':
      return { label: 'Cancelled', variant: 'destructive' };
    default:
      return { label: 'Unknown', variant: 'outline' };
  }
};

const UnifiedProjectCard: React.FC<UnifiedProjectCardProps> = ({ 
  project, 
  variant = 'card',
  isProfessional = false,
  actionLabel = "View Project",
  onClick
}) => {
  const navigate = useNavigate();

  const statusConfig = getStatusConfig(project.status);

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/projects/${project.id}`);
    }
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
            <Button size="sm">{actionLabel}</Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default UnifiedProjectCard;
