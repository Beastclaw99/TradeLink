import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, CheckCircle2, Link2, ListChecks, User2 } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Database } from '@/integrations/supabase/types';

type Project = Database['public']['Tables']['projects']['Row'];
type ProjectStatus = Database['public']['Enums']['project_status_enum'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface UnifiedProjectCardProps {
  project: Project;
  variant?: 'card' | 'list';
  userType: 'professional';
  userSkills?: string[];
  actionLabel?: string;
  onClick?: () => void;
  client?: Profile;
}

interface StatusConfig {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
}

const getStatusConfig = (status: ProjectStatus | null): StatusConfig => {
  switch (status) {
    case 'open':
      return { label: 'Open', variant: 'default' };
    case 'assigned':
      return { label: 'Assigned', variant: 'secondary' };
    case 'completed':
      return { label: 'Completed', variant: 'default' };
    case 'cancelled':
      return { label: 'Cancelled', variant: 'destructive' };
    case 'disputed':
      return { label: 'Disputed', variant: 'destructive' };
    case 'draft':
      return { label: 'Draft', variant: 'outline' };
    case 'in_progress':
      return { label: 'In Progress', variant: 'secondary' };
    case 'work_submitted':
      return { label: 'Work Submitted', variant: 'secondary' };
    case 'work_revision_requested':
      return { label: 'Revision Requested', variant: 'destructive' };
    case 'work_approved':
      return { label: 'Work Approved', variant: 'default' };
    case 'archived':
      return { label: 'Archived', variant: 'outline' };
    default:
      return { label: 'Unknown', variant: 'outline' };
  }
};

const UnifiedProjectCard: React.FC<UnifiedProjectCardProps> = ({ 
  project, 
  variant = 'card',
  userType,
  userSkills = [],
  actionLabel = "View Project",
  onClick,
  client
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
    return 'open';
  };

  const projectType = getProjectType();

  const projectSkills = project.requirements || [];
  const matchingSkills = projectSkills.filter((skill: string) => userSkills.includes(skill));
  const hasMatchingSkills = matchingSkills.length > 0;

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
            <span>{project.created_at ? format(new Date(project.created_at), 'PPP') : 'N/A'}</span>
          </div>
          {client && (
            <div className="flex items-center text-gray-600 text-sm">
              <User2 className="w-4 h-4 mr-2" />
              <span>{client.first_name} {client.last_name}</span>
            </div>
          )}
          <div className="flex items-center text-gray-600 text-sm">
            <Link2 className="w-4 h-4 mr-2" />
            <span>{project.location || 'Remote'}</span>
          </div>
        </div>
        {projectSkills.length > 0 && (
          <div className="mt-4">
            <span className="text-sm font-medium">Required Skills:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {projectSkills.map((skill: string, index: number) => (
                <Badge 
                  key={index}
                  variant={userSkills.includes(skill) ? 'default' : 'outline'}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="px-4 py-2 bg-gray-50 border-t">
        <div className="flex items-center justify-between w-full">
          <span className="text-sm text-gray-700 font-medium">
            {project.budget ? `$${project.budget.toLocaleString()}` : 'N/A'}
          </span>
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
