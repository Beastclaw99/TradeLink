
import { Badge } from "@/components/ui/badge";
import { statusColors } from './utils';

interface ProjectStatusBadgeProps {
  status: string;
}

export const ProjectStatusBadge: React.FC<ProjectStatusBadgeProps> = ({ status }) => (
  <Badge 
    variant="secondary" 
    className={`${statusColors[status as keyof typeof statusColors]?.bg || 'bg-gray-100'} ${statusColors[status as keyof typeof statusColors]?.text || 'text-gray-800'}`}
  >
    {status?.replace(/_/g, ' ') || 'Open'}
  </Badge>
);
