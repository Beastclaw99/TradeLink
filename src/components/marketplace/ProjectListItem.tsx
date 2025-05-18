
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, MapPin, Clock } from 'lucide-react';
import { Project } from '@/components/dashboard/types';

interface ProjectListItemProps {
  project: Project;
}

const ProjectListItem: React.FC<ProjectListItemProps> = ({ project }) => {
  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="bg-ttc-blue-50 text-ttc-blue-700">
              Project
            </Badge>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              {project.status || 'Open'}
            </Badge>
          </div>
          
          <h3 className="text-lg font-semibold mb-1">{project.title}</h3>
          
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <MapPin size={14} className="mr-1" /> Location
            <span className="mx-2">|</span>
            <span>Posted by: <span className="font-medium">
              {project.client?.first_name} {project.client?.last_name}
            </span></span>
          </div>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {project.description}
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
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
          </div>
          
          <Link to={`/project/${project.id}`}>
            <Button variant="outline" className="border-ttc-blue-700 text-ttc-blue-700 hover:bg-ttc-blue-50 whitespace-nowrap">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectListItem;
