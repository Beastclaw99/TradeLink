
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import ProjectForm from '@/components/shared/forms/ProjectForm';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const CreateProject: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (formData: any) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a project.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Convert budget range to numeric value for storage
      let budgetValue = 0;
      switch (formData.budget) {
        case 'under-1000':
          budgetValue = 500;
          break;
        case '1000-5000':
          budgetValue = 3000;
          break;
        case '5000-10000':
          budgetValue = 7500;
          break;
        case '10000-25000':
          budgetValue = 17500;
          break;
        case 'over-25000':
          budgetValue = 30000;
          break;
        default:
          budgetValue = 0;
      }

      console.log('Creating project with data:', {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        budget: budgetValue,
        expected_timeline: formData.expected_timeline,
        location: formData.location,
        urgency: formData.urgency,
        requirements: formData.requirements,
        required_skills: formData.required_skills,
        client_id: user.id,
        status: 'open'
      });

      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            budget: budgetValue,
            expected_timeline: formData.expected_timeline,
            location: formData.location,
            urgency: formData.urgency,
            requirements: formData.requirements,
            required_skills: formData.required_skills,
            client_id: user.id,
            status: 'open'
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Project created successfully:', data);

      toast({
        title: "Project Created",
        description: "Your project has been created successfully and is now visible to professionals!"
      });

      // Redirect to project marketplace to see the new project
      navigate('/project-marketplace', { 
        state: { 
          message: 'Project created successfully! Your project is now visible to professionals.' 
        } 
      });

    } catch (error: any) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create project. Please try again.",
        variant: "destructive"
      });
    }
  };

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

        <div className="max-w-4xl mx-auto">
          <ProjectForm 
            onSubmit={handleSubmit}
            onCancel={() => navigate('/dashboard')}
          />
        </div>
      </div>
    </Layout>
  );
};

export default CreateProject;
