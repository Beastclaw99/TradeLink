
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Import step components
import BasicDetailsStep from './steps/BasicDetailsStep';
import RecommendedSkillsStep from './steps/RecommendedSkillsStep';
import BudgetTimelineStep from './steps/BudgetTimelineStep';
import MilestonesDeliverablesStep from './steps/MilestonesDeliverablesStep';
import ServiceContractStep from './steps/ServiceContractStep';
import ReviewStep from './steps/ReviewStep';

// Import extracted hooks and components
import { useProjectData } from './hooks/useProjectData';
import { useWizardNavigation } from './hooks/useWizardNavigation';
import { useDraftOperations } from './hooks/useDraftOperations';
import { WizardHeader } from './components/WizardHeader';
import { NavigationButtons } from './components/NavigationButtons';

// Import utilities
import { validateProjectData } from './utils/validation';
import { transformProjectDataForDatabase } from './utils/dataTransformers';

const STEPS = [
  { id: 1, title: 'Basic Details', component: BasicDetailsStep },
  { id: 2, title: 'Recommended Skills', component: RecommendedSkillsStep },
  { id: 3, title: 'Budget & Timeline', component: BudgetTimelineStep },
  { id: 4, title: 'Milestones & Deliverables', component: MilestonesDeliverablesStep },
  { id: 5, title: 'Service Contract', component: ServiceContractStep },
  { id: 6, title: 'Review', component: ReviewStep }
];

const ProjectCreationWizard: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use extracted hooks
  const { projectData, handleUpdateData, isEditing } = useProjectData();
  const { 
    currentStep, 
    handleNext, 
    handlePrevious, 
    isLastStep, 
    progress, 
    STEPS: wizardSteps 
  } = useWizardNavigation(projectData);
  const { handleSaveDraft, isSavingDraft } = useDraftOperations();

  const handleSubmit = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create a project.",
        variant: "destructive"
      });
      return;
    }

    // Validate required fields
    const validationError = validateProjectData(projectData);
    if (validationError) {
      toast({
        title: "Missing Required Field",
        description: validationError,
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Get draft ID if exists
      const draftId = localStorage.getItem('projectDraftId');
      let projectId = draftId;

      // Prepare data for database
      const dbProjectData = transformProjectDataForDatabase(projectData, user.id, isEditing);

      if (isEditing) {
        // Update existing project
        const { error: updateError } = await supabase
          .from('projects')
          .update({
            ...dbProjectData,
            updated_at: new Date().toISOString()
          })
          .eq('id', projectData.id);

        if (updateError) {
          console.error('Error updating project:', updateError);
          throw updateError;
        }

        toast({
          title: "Project Updated",
          description: "Your project has been updated successfully."
        });

        // Clear edit data
        localStorage.removeItem('editProjectData');
      } else {
        // Create new project
        if (!draftId) {
          const { data: project, error: projectError } = await supabase
            .from('projects')
            .insert([dbProjectData])
            .select()
            .single();

          if (projectError) {
            console.error('Error creating project:', projectError);
            throw projectError;
          }
          
          projectId = project.id;
        } else {
          // Update existing draft
          const { error: updateError } = await supabase
            .from('projects')
            .update({
              ...dbProjectData,
              updated_at: new Date().toISOString()
            })
            .eq('id', draftId);

          if (updateError) {
            console.error('Error updating draft project:', updateError);
            throw updateError;
          }
        }

        // Clear draft data
        localStorage.removeItem('projectDraft');
        localStorage.removeItem('projectDraftId');

        toast({
          title: "Project Draft Created",
          description: "Your project has been saved as a draft. You can review and publish it from your dashboard."
        });
      }

      // Create milestones if any
      if (projectData.milestones && projectData.milestones.length > 0 && projectId) {
        const milestonesData = projectData.milestones.map(milestone => ({
          title: milestone.title.trim(),
          description: milestone.description?.trim() || '',
          due_date: milestone.dueDate || milestone.due_date,
          status: milestone.status as 'not_started' | 'in_progress' | 'completed' | 'on_hold' | 'overdue',
          requires_deliverable: milestone.requires_deliverable || false,
          project_id: projectId,
          created_by: user.id,
          is_complete: false
        }));

        const { error: milestonesError } = await supabase
          .from('project_milestones')
          .insert(milestonesData);

        if (milestonesError) {
          console.error('Error creating milestones:', milestonesError);
          throw milestonesError;
        }
      }

      // Create project-level deliverables if any
      if (projectData.deliverables && projectData.deliverables.length > 0 && projectId) {
        const deliverablesData = projectData.deliverables.map(deliverable => ({
          description: deliverable.description.trim(),
          deliverable_type: deliverable.deliverable_type || deliverable.type || 'document',
          content: deliverable.content?.trim() || '',
          file_url: deliverable.file_url?.trim() || '',
          project_id: projectId,
          uploaded_by: user.id
        }));

        const { error: deliverablesError } = await supabase
          .from('project_deliverables')
          .insert(deliverablesData);

        if (deliverablesError) {
          console.error('Error creating deliverables:', deliverablesError);
          throw deliverablesError;
        }
      }

      navigate('/dashboard?tab=projects');

    } catch (error: any) {
      console.error('Error creating/updating project:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create/update project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentStepComponent = () => {
    const step = STEPS.find(s => s.id === currentStep);
    if (!step) {
      console.error('Step not found:', currentStep);
      return null;
    }
    
    const Component = step.component;
    console.log('Rendering step component:', step.title, 'with data:', projectData);
    
    // Special handling for ReviewStep which doesn't need onUpdate
    if (step.id === 6) {
      return <Component data={projectData} onUpdate={handleUpdateData} />;
    }
    
    // All other steps need both data and onUpdate props
    return <Component data={projectData} onUpdate={handleUpdateData} />;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <WizardHeader
          isEditing={isEditing}
          currentStep={currentStep}
          progress={progress}
          steps={wizardSteps}
        />
        
        <CardContent className="space-y-6">
          {getCurrentStepComponent()}
          
          <NavigationButtons
            currentStep={currentStep}
            isLastStep={isLastStep}
            isSubmitting={isSubmitting}
            isSavingDraft={isSavingDraft}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSaveDraft={() => handleSaveDraft(projectData)}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectCreationWizard;
