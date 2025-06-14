import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Check, Save } from 'lucide-react';
import { ProjectData } from './types';
import BasicDetailsStep from './steps/BasicDetailsStep';
import RecommendedSkillsStep from './steps/RecommendedSkillsStep';
import BudgetTimelineStep from './steps/BudgetTimelineStep';
import MilestonesDeliverablesStep from './steps/MilestonesDeliverablesStep';
import ServiceContractStep from './steps/ServiceContractStep';
import ReviewStep from './steps/ReviewStep';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

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
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(() => {
    // Initialize from URL query param if available
    const params = new URLSearchParams(location.search);
    const step = params.get('step');
    return step ? parseInt(step, 10) : 1;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [projectData, setProjectData] = useState<ProjectData>(() => {
    // Try to load draft data from localStorage
    const savedDraft = localStorage.getItem('projectDraft');
    if (savedDraft) {
      return JSON.parse(savedDraft);
    }
    return {
      title: '',
      description: '',
      category: '',
      location: '',
      recommended_skills: [],
      budget: 0,
      timeline: '',
      urgency: '',
      milestones: [],
      deliverables: [],
      service_contract: '',
      requirements: [],
      rich_description: '',
      expected_timeline: '',
      scope: '',
      industry_specific_fields: null,
      location_coordinates: null,
      contract_template_id: '',
      payment_required: true,
      payment_due_date: '',
      project_start_time: '',
      client_id: user?.id,
      sla_terms: null
    };
  });

  // Auto-save draft when project data changes
  useEffect(() => {
    const saveDraft = async () => {
      if (!user?.id) return;
      
      try {
        setIsSavingDraft(true);
        
        // Save to localStorage
        localStorage.setItem('projectDraft', JSON.stringify(projectData));
        
        // Save to database if we have a draft ID
        const draftId = localStorage.getItem('projectDraftId');
        if (draftId) {
          const { error } = await supabase
            .from('projects')
            .update({
              ...projectData,
              status: 'draft',
              updated_at: new Date().toISOString()
            })
            .eq('id', draftId);
            
          if (error) throw error;
        }
      } catch (error) {
        console.error('Error auto-saving draft:', error);
      } finally {
        setIsSavingDraft(false);
      }
    };

    // Debounce auto-save
    const timeoutId = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timeoutId);
  }, [projectData, user?.id]);

  // Update URL when step changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.set('step', currentStep.toString());
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }, [currentStep, location.pathname, navigate]);

  const handleUpdateData = (updates: Partial<ProjectData>) => {
    console.log('Updating project data:', updates);
    setProjectData(prev => {
      const newData = { ...prev, ...updates };
      console.log('New project data:', newData);
      return newData;
    });
  };

  const handleNext = () => {
    console.log('Current step:', currentStep, 'Project data:', projectData);
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to save a draft.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSavingDraft(true);

      // Check if we already have a draft
      const draftId = localStorage.getItem('projectDraftId');
      let projectId = draftId;

      if (!draftId) {
        // Create new draft
        const { data: project, error: projectError } = await supabase
          .from('projects')
          .insert([{
            ...projectData,
            status: 'draft',
            client_id: user.id
          }])
          .select()
          .single();

        if (projectError) throw projectError;
        projectId = project.id;
        localStorage.setItem('projectDraftId', projectId);
      } else {
        // Update existing draft
        const { error: updateError } = await supabase
          .from('projects')
          .update({
            ...projectData,
            status: 'draft',
            updated_at: new Date().toISOString()
          })
          .eq('id', draftId);

        if (updateError) throw updateError;
      }

      toast({
        title: "Draft Saved",
        description: "Your project draft has been saved successfully."
      });

    } catch (error: any) {
      console.error('Error saving draft:', error);
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSavingDraft(false);
    }
  };

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
    if (!projectData.title?.trim()) {
      toast({
        title: "Missing Required Field",
        description: "Project title is required.",
        variant: "destructive"
      });
      return;
    }

    if (!projectData.description?.trim()) {
      toast({
        title: "Missing Required Field",
        description: "Project description is required.",
        variant: "destructive"
      });
      return;
    }

    if (!projectData.budget || projectData.budget <= 0) {
      toast({
        title: "Missing Required Field",
        description: "Project budget must be greater than 0.",
        variant: "destructive"
      });
      return;
    }

    if (!projectData.timeline?.trim()) {
      toast({
        title: "Missing Required Field",
        description: "Project timeline is required.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Get draft ID if exists
      const draftId = localStorage.getItem('projectDraftId');
      let projectId = draftId;

      if (!draftId) {
        // Create new project as draft first
        const { data: project, error: projectError } = await supabase
          .from('projects')
          .insert([{
            ...projectData,
            status: 'draft',
            client_id: user.id,
            budget: Number(projectData.budget), // Ensure budget is a number
            timeline: projectData.timeline || projectData.expected_timeline // Use either timeline field
          }])
          .select()
          .single();

        if (projectError) throw projectError;
        projectId = project.id;

        // Then update to open status
        const { error: updateError } = await supabase
          .from('projects')
          .update({
            status: 'open',
            updated_at: new Date().toISOString()
          })
          .eq('id', projectId);

        if (updateError) throw updateError;
      } else {
        // Update draft to open project
        const { error: updateError } = await supabase
          .from('projects')
          .update({
            ...projectData,
            status: 'open',
            updated_at: new Date().toISOString(),
            budget: Number(projectData.budget), // Ensure budget is a number
            timeline: projectData.timeline || projectData.expected_timeline // Use either timeline field
          })
          .eq('id', draftId);

        if (updateError) throw updateError;
      }

      // Create milestones if any
      if (projectData.milestones && projectData.milestones.length > 0) {
        const milestonesData = projectData.milestones.map(milestone => ({
          title: milestone.title,
          description: milestone.description || '',
          due_date: milestone.dueDate,
          status: milestone.status as 'not_started' | 'in_progress' | 'completed' | 'on_hold' | 'overdue',
          requires_deliverable: milestone.requires_deliverable || false,
          project_id: projectId,
          created_by: user.id,
          is_complete: false
        }));

        const { error: milestonesError } = await supabase
          .from('project_milestones')
          .insert(milestonesData);

        if (milestonesError) throw milestonesError;
      }

      // Create project-level deliverables if any
      if (projectData.deliverables && projectData.deliverables.length > 0) {
        const deliverablesData = projectData.deliverables.map(deliverable => ({
          description: deliverable.description,
          deliverable_type: deliverable.deliverable_type,
          content: deliverable.content || '',
          file_url: deliverable.file_url || '',
          project_id: projectId,
          uploaded_by: user.id
        }));

        const { error: deliverablesError } = await supabase
          .from('project_deliverables')
          .insert(deliverablesData);

        if (deliverablesError) throw deliverablesError;
      }

      // Clear draft data
      localStorage.removeItem('projectDraft');
      localStorage.removeItem('projectDraftId');

      toast({
        title: "Project Created Successfully",
        description: "Your project has been posted and is now available for professionals to apply."
      });

      navigate('/dashboard?tab=projects&created=true');

    } catch (error: any) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive"
      });
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

  const isLastStep = currentStep === STEPS.length;
  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create New Project</CardTitle>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Step {currentStep} of {STEPS.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
          
          {/* Steps indicator */}
          <div className="flex justify-between mt-4">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.id < currentStep 
                    ? 'bg-green-500 text-white' 
                    : step.id === currentStep
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.id < currentStep ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <span className={`text-xs mt-1 ${
                  step.id <= currentStep ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {getCurrentStepComponent()}
          
          <div className="flex justify-between pt-6 border-t">
            <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
              
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={isSavingDraft}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSavingDraft ? 'Saving...' : 'Save Draft'}
              </Button>
            </div>
            
            {isLastStep ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? 'Creating...' : 'Create Project'}
                <Check className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectCreationWizard;
