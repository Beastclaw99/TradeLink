import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { Application, Project } from '@/types';

interface ApplicationCardProps {
  application: Application;
  project: Project;
  onViewDetails: () => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  project,
  onViewDetails
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{project.title}</CardTitle>
            <CardDescription>
              Applied on {format(new Date(application.created_at), 'PPP')}
            </CardDescription>
          </div>
          <Badge variant={application.status === 'pending' ? 'default' : application.status === 'accepted' ? 'secondary' : 'destructive'}>
            {application.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {application.proposal_message || application.cover_letter || 'No proposal provided'}
        </p>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          onClick={onViewDetails}
          className="w-full"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}; 