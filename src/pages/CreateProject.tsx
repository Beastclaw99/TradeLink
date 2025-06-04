
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProjectCreationWizard from '@/components/project/creation/ProjectCreationWizard';
import { ProjectData } from '@/types';

const CreateProject: React.FC = () => {
  const navigate = useNavigate();

  const handleProjectCreated = (projectData: ProjectData) => {
    console.log('Project created:', projectData);
    navigate('/dashboard');
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <ProjectCreationWizard
          onProjectCreated={handleProjectCreated}
          onCancel={handleCancel}
        />
      </div>
    </Layout>
  );
};

export default CreateProject;
