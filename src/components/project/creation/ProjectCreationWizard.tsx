import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { ProjectData } from './types';
import BasicDetailsStep from './steps/BasicDetailsStep';
import RequirementsStep from './steps/RequirementsStep';
import BudgetTimelineStep from './steps/BudgetTimelineStep';
import MilestonesDeliverablesStep from './steps/MilestonesDeliverablesStep';
import ServiceContractStep from './steps/ServiceContractStep';
import ReviewStep from './steps/ReviewStep';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const STEPS = [
  { id: 1, title: 'Basic Details', component: BasicDetailsStep },
  { id: 2, title: 'Requirements', component: RequirementsStep },
  { id: 3, title: 'Budget & Timeline', component: BudgetTimelineStep },
  { id: 4, title: 'Milestones & Deliverables', component: MilestonesDeliverablesStep },
  { id: 5, title: 'Service Contract', component: ServiceContractStep },
  { id: 6, title: 'Review', component: ReviewStep }
];

const ProjectCreationWizard: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectData, setProjectData] = useState<ProjectData>({
    title: '',
    description: '',
    category: '',
    location: '',
    recommendedSkills: [],
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
  });

  const handleUpdateData = (updates: Partial<ProjectData>) => {
    setProjectData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
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

    try {
      setIsSubmitting(true);

      // Create project
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert([{
          title: projectData.title,
          description: projectData.description,
          category: projectData.category,
          location: projectData.location,
          budget: projectData.budget,
          expected_timeline: projectData.timeline,
          urgency: projectData.urgency,
          requirements: projectData.requirements,
          rich_description: projectData.rich_description,
          scope: projectData.scope,
          service_contract: projectData.service_contract,
          industry_specific_fields: projectData.industry_specific_fields,
          location_coordinates: projectData.location_coordinates,
          contract_template_id: projectData.contract_template_id,
          payment_required: projectData.payment_required,
          payment_due_date: projectData.payment_due_date,
          project_start_time: projectData.project_start_time,
          client_id: user.id,
          sla_terms: projectData.sla_terms,
          status: 'open'
        }])
        .select()
        .single();

      if (projectError) throw projectError;

      // Create milestones if any
      if (projectData.milestones && projectData.milestones.length > 0) {
        const milestonesData = projectData.milestones.map(milestone => ({
          title: milestone.title,
          description: milestone.description || '',
          due_date: milestone.dueDate,
          status: milestone.status,
          requires_deliverable: milestone.requires_deliverable || false,
          tasks: milestone.tasks || [],
          project_id: project.id,
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
          project_id: project.id,
          uploaded_by: user.id
        }));

        const { error: deliverablesError } = await supabase
          .from('project_deliverables')
          .insert(deliverablesData);

        if (deliverablesError) throw deliverablesError;
      }

      toast({
        title: "Project Created Successfully",
        description: "Your project has been posted and is now available for professionals to apply."
      });

      navigate('/dashboard?tab=projects');

    } catch (error: any) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentStepComponent = () => {
    const step = STEPS.find(s => s.id === currentStep);
    if (!step) return null;
    const Component = step.component;
    
    // Special handling for ReviewStep which only needs data prop
    if (step.id === 6) {
      return <Component data={projectData} />;
    }
    
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
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            
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
