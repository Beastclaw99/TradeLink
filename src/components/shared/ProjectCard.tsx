
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
import { DollarSign, MapPin, Clock } from 'lucide-react';
import { Project } from '@/components/dashboard/types';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const statusColors = {
    open: 'bg-green-100 text-green-800 border-green-200',
    applied: 'bg-blue-100 text-blue-800 border-blue-200',
    assigned: 'bg-orange-100 text-orange-800 border-orange-200',
    'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
    submitted: 'bg-purple-100 text-purple-800 border-purple-200',
    revision: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    completed: 'bg-gray-100 text-gray-800 border-gray-200',
    paid: 'bg-green-100 text-green-800 border-green-200',
    archived: 'bg-gray-100 text-gray-800 border-gray-200',
    disputed: 'bg-red-100 text-red-800 border-red-200'
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'Budget not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-2">
          <Badge className={statusColors[project.status] || statusColors.open}>
            {project.status.replace('-', ' ')}
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
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-600">
              {formatCurrency(project.budget)}
            </span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Clock size={16} className="mr-1" />
            <span>
              {project.created_at ? formatDate(project.created_at) : 'Recent'}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          asChild
          variant="outline" 
          className="w-full border-blue-700 text-blue-700 hover:bg-blue-50"
        >
          <Link to={`/project/${project.id}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
