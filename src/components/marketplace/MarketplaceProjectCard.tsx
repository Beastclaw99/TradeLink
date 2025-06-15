
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProjectDetailsModal from './ProjectDetailsModal';

interface DatabaseProject {
  id: string;
  title: string;
  description: string | null;
  client_id: string | null;
  professional_id: string | null;
  status: string | null;
  budget: number | null;
  timeline: string | null;
  location: string | null;
  category: string | null;
  urgency: string | null;
  created_at: string | null;
  updated_at: string | null;
  assigned_to: string | null;
  deadline: string | null;
  spent: number | null;
  requirements: string[] | null;
  recommended_skills: string[] | null;
  rich_description: string | null;
  scope: string | null;
  industry_specific_fields: any;
  location_coordinates: any;
  project_start_time: string | null;
  service_contract: string | null;
  contract_template_id: string | null;
  sla_terms: any;
  client?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    profile_image_url: string | null;
    rating: number | null;
    completed_projects: number | null;
  };
  professional?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    profile_image_url: string | null;
    rating: number | null;
    completed_projects: number | null;
  };
}

interface ProjectCardProps {
  project: DatabaseProject | any;
  onClick?: () => void;
}

const MarketplaceProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onClick
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModalOpen(true);
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: string | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <Card
        className="cursor-pointer transition-all hover:shadow-md"
        onClick={onClick}
      >
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="line-clamp-2">{project.title}</CardTitle>
              <CardDescription className="mt-1">
                Posted {formatDate(project.created_at)}
              </CardDescription>
            </div>
            <Badge variant={project.urgency === 'high' ? 'destructive' : 'default'}>
              {project.urgency || 'Normal'} Priority
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 line-clamp-3">
              {project.description}
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Budget:</span>
                <p className="text-gray-600">{formatCurrency(project.budget)}</p>
              </div>
              <div>
                <span className="font-medium">Timeline:</span>
                <p className="text-gray-600">{project.timeline || 'N/A'}</p>
              </div>
              <div>
                <span className="font-medium">Location:</span>
                <p className="text-gray-600">{project.location || 'Remote'}</p>
              </div>
              <div>
                <span className="font-medium">Status:</span>
                <p className="text-gray-600">{project.status || 'Open'}</p>
              </div>
            </div>
            {project.requirements && project.requirements.length > 0 && (
              <div>
                <span className="text-sm font-medium">Required Skills:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.requirements.map((skill: string, index: number) => (
                    <Badge
                      key={index}
                      variant="outline"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="default" size="sm" onClick={handleViewDetails}>
            View Details
          </Button>
        </CardFooter>
      </Card>
      <ProjectDetailsModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        project={project}
      />
    </>
  );
};

export default MarketplaceProjectCard;
