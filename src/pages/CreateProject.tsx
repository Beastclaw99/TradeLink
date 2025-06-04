import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import ProjectCreationWizard from '@/components/project/creation/ProjectCreationWizard';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const CreateProject: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <Layout>
      <div className="container-custom py-8">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
          <p className="text-gray-600 mt-2">
            Post your project and connect with qualified professionals on ProLinkTT. 
            Fill out all the details to help professionals understand your requirements.
          </p>
        </div>

        <ProjectCreationWizard />
      </div>
    </Layout>
  );
};

export default CreateProject;
