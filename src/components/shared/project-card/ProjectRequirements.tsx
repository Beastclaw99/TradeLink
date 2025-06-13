import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProjectRequirementsProps {
  requirements: string;
  recommendedSkills: string[];
}

export const ProjectRequirements: React.FC<ProjectRequirementsProps> = ({
  requirements,
  recommendedSkills
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="prose max-w-none">
            {requirements}
          </div>
          {recommendedSkills.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Recommended Skills</h4>
              <div className="flex flex-wrap gap-2">
                {recommendedSkills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 