import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectCreationWizard from '@/components/project/creation/ProjectCreationWizard';
import { ProjectData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CreateProjectTabProps {
  onProjectCreated: () => Promise<void>;
}

const CreateProjectTab: React.FC<CreateProjectTabProps> = ({ onProjectCreated }) => {
  const navigate = useNavigate();

  const handleProjectCreated = (projectData: ProjectData) => {
    console.log('Project created:', projectData);
    onProjectCreated();
  };

  const handleCancel = () => {
    // Just stay on the dashboard
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a New Project</CardTitle>
      </CardHeader>
      <CardContent>
        <ProjectCreationWizard
          onProjectCreated={handleProjectCreated}
          onCancel={handleCancel}
        />
      </CardContent>
    </Card>
  );
};

export default CreateProjectTab;
