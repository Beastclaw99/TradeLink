import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ProjectDescriptionProps {
  description: string;
}

export const ProjectDescription: React.FC<ProjectDescriptionProps> = ({ description }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="prose max-w-none">
          {description}
        </div>
      </CardContent>
    </Card>
  );
}; 