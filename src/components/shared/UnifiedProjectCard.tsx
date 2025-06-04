
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, MapPin, Clock, Tag } from 'lucide-react';
import { Project } from '@/components/dashboard/types';

interface UnifiedProjectCardProps {
  project: Project;
  onClick?: () => void;
  variant?: 'card' | 'list';
  showActions?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

const UnifiedProjectCard: React.FC<UnifiedProjectCardProps> = ({ 
  project, 
  onClick, 
  variant = 'card',
  showActions = true,
  actionLabel = 'View Details',
  onAction
}) => {
  const statusColors = {
    open: 'bg-green-100 text-green-800 border-green-200',
    in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-gray-100 text-gray-800 border-gray-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200'
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatCurrency = (amount: number | undefined) => {
    if (!amount || isNaN(amount)) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getClientName = () => {
    if (project.client?.first_name && project.client?.last_name) {
      return `${project.client.first_name} ${project.client.last_name}`;
    }
    return 'Unknown Client';
  };

  if (variant === 'list') {
    return (
      <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary" className="bg-ttc-blue-50 text-ttc-blue-700">
                Project
              </Badge>
              <Badge className={statusColors[project.status as keyof typeof statusColors] || statusColors.open}>
                {project.status || 'Open'}
              </Badge>
            </div>
            
            <h3 className="text-lg font-semibold mb-1">{project.title}</h3>
            
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <MapPin size={14} className="mr-1" /> {project.location || 'Location not specified'}
              <span className="mx-2">|</span>
              <span>Posted by: <span className="font-medium">{getClientName()}</span></span>
            </div>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {project.description}
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span className="font-semibold">{formatCurrency(project.budget)}</span>
              </div>
              
              <div className="flex items-center text-ttc-neutral-700">
                <Clock size={16} className="mr-1 text-ttc-blue-700" />
                <span>
                  {project.created_at ? formatDate(project.created_at) : 'Recent'}
                </span>
              </div>
            </div>
            
            {showActions && (
              <Button 
                variant="outline" 
                className="border-ttc-blue-700 text-ttc-blue-700 hover:bg-ttc-blue-50 whitespace-nowrap"
                onClick={onAction || onClick}
              >
                {actionLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant="secondary" className="bg-ttc-blue-50 text-ttc-blue-700 mb-2">
            Project
          </Badge>
          <Badge className={statusColors[project.status as keyof typeof statusColors] || statusColors.open}>
            {project.status || 'Open'}
          </Badge>
        </div>
        <CardTitle className="text-lg">{project.title}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <MapPin size={14} /> {project.location || 'Location not specified'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-4">
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
          {project.description}
        </p>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <span className="font-semibold">{formatCurrency(project.budget)}</span>
          </div>
          
          <div className="flex items-center text-ttc-neutral-700">
            <Clock size={16} className="mr-1 text-ttc-blue-700" />
            <span>
              {project.created_at ? formatDate(project.created_at) : 'Recent'}
            </span>
          </div>
          
          <div className="flex items-center text-ttc-neutral-700">
            <Tag size={16} className="mr-1 text-ttc-blue-700" />
            <span>Fixed Price</span>
          </div>
        </div>
      </CardContent>
      
      {showActions && (
        <CardFooter className="pt-0 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Posted by: <span className="font-medium">{getClientName()}</span>
          </div>
          <Button 
            variant="outline" 
            className="border-ttc-blue-700 text-ttc-blue-700 hover:bg-ttc-blue-50"
            onClick={onAction || onClick}
          >
            {actionLabel}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default UnifiedProjectCard;
