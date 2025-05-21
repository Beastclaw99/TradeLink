
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

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant="secondary" className="bg-ttc-blue-50 text-ttc-blue-700 mb-2">
            Project
          </Badge>
          <Badge className="bg-green-100 text-green-800 border-green-200">
            {project.status || 'Open'}
          </Badge>
        </div>
        <CardTitle className="text-lg">{project.title}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <MapPin size={14} /> Location
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-4">
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
          {project.description}
        </p>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center text-ttc-neutral-700">
            <DollarSign size={16} className="mr-1 text-ttc-blue-700" />
            <span className="font-semibold">${project.budget}</span>
          </div>
          
          <div className="flex items-center text-ttc-neutral-700">
            <Clock size={16} className="mr-1 text-ttc-blue-700" />
            <span>
              {project.created_at 
                ? new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) 
                : 'Recent'}
            </span>
          </div>
          
          <div className="flex items-center text-ttc-neutral-700">
            <Tag size={16} className="mr-1 text-ttc-blue-700" />
            <span>Fixed Price</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Posted by: <span className="font-medium">
            {project.client?.first_name} {project.client?.last_name}
          </span>
        </div>
        {onClick ? (
          <Button 
            variant="outline" 
            className="border-ttc-blue-700 text-ttc-blue-700 hover:bg-ttc-blue-50"
            onClick={onClick}
          >
            View Details
          </Button>
        ) : (
          <Link to={`/project/${project.id}`}>
            <Button variant="outline" className="border-ttc-blue-700 text-ttc-blue-700 hover:bg-ttc-blue-50">
              View Details
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
