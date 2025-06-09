import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import BasicDetailsStep from './steps/BasicDetailsStep';
import RequirementsStep from './steps/RequirementsStep';
import BudgetTimelineStep from './steps/BudgetTimelineStep';
import MilestonesDeliverablesStep from './steps/MilestonesDeliverablesStep';
import ServiceContractStep from './steps/ServiceContractStep';
import ReviewStep from './steps/ReviewStep';
import { ProjectData } from './types';

const ProjectCreationWizard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
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
    service_contract: '',
    requirements: [],
    scope: '',
    industry_specific_fields: null,
    location_coordinates: null,
    deadline: '',
    project_start_time: '',
    rich_description: '',
    sla_terms: null
  });

  const steps = [
    { 
      number: 1, 
      title: 'Basic Details', 
      component: BasicDetailsStep,
      description: 'Project title, description, and category'
    },
    { 
      number: 2, 
      title: 'Recommended Skills', 
      component: RequirementsStep,
      description: 'Skills that would be helpful for your project'
    },
    { 
      number: 3, 
      title: 'Budget & Timeline', 
      component: BudgetTimelineStep,
      description: 'Set your budget and expected timeline'
    },
    { 
      number: 4, 
      title: 'Milestones & Deliverables', 
      component: MilestonesDeliverablesStep,
      description: 'Define project milestones and deliverables'
    },
    { 
      number: 5, 
      title: 'Service Contract', 
      component: ServiceContractStep,
      description: 'Review and accept the service agreement'
    },
    { 
      number: 6, 
      title: 'Review & Publish', 
      component: ReviewStep,
      description: 'Final review before publishing your project'
    }
  ];

  const getCurrentStepRequirements = () => {
    switch (currentStep) {
      case 1:
        return ['Project title', 'Description', 'Category', 'Location'];
      case 2:
        return ['Recommended skills (optional but helpful)'];
      case 3:
        return ['Budget amount', 'Timeline', 'Urgency level'];
      case 4:
        return ['Milestones (optional)', 'Deliverables (optional)'];
      case 5:
        return ['Service contract acceptance'];
      case 6:
        return ['Final review of all details'];
      default:
        return [];
    }
  };

  const isStepComplete = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return projectData.title && projectData.description && projectData.category && projectData.location;
      case 2:
        return true; // Skills are optional
      case 3:
        return projectData.budget > 0 && projectData.timeline && projectData.urgency;
      case 4:
        return true; // Milestones are optional
      case 5:
        return !!projectData.service_contract;
      case 6:
        return true;
      default:
        return false;
    }
  };

  const canProceedToNext = () => {
    return isStepComplete(currentStep);
  };

  const nextStep = () => {
    if (currentStep < steps.length && canProceedToNext()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDataUpdate = (stepData: Partial<ProjectData>) => {
    setProjectData(prev => ({ ...prev, ...stepData }));
  };

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create project
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert([{
          title: projectData.title,
          description: projectData.description,
          category: projectData.category,
          location: projectData.location,
          budget: projectData.budget,
          timeline: projectData.timeline,
          urgency: projectData.urgency,
          status: 'open',
          created_by: user.id,
          requirements: projectData.requirements || [],
          scope: projectData.scope,
          industry_specific_fields: projectData.industry_specific_fields,
          location_coordinates: projectData.location_coordinates,
          deadline: projectData.deadline,
          project_start_time: projectData.project_start_time,
          rich_description: projectData.rich_description,
          sla_terms: projectData.sla_terms
        }])
        .select()
        .single();

      if (projectError) throw projectError;

      // Create milestones
      if (projectData.milestones && projectData.milestones.length > 0) {
        const { error: milestonesError } = await supabase
          .from('project_milestones')
          .insert(
            projectData.milestones.map(milestone => ({
              title: milestone.title,
              description: milestone.description,
              due_date: milestone.dueDate,
              status: milestone.status,
              is_complete: milestone.progress === 100,
              project_id: project.id,
              created_by: user.id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }))
          );

        if (milestonesError) throw milestonesError;

        // Get the created milestones to get their IDs
        const { data: createdMilestones, error: fetchError } = await supabase
          .from('project_milestones')
          .select('id, title')
          .eq('project_id', project.id);

        if (fetchError) throw fetchError;

        // Create deliverables for each milestone
        for (const milestone of projectData.milestones) {
          const createdMilestone = createdMilestones.find(m => m.title === milestone.title);
          if (createdMilestone && milestone.deliverables && milestone.deliverables.length > 0) {
            const { error: deliverablesError } = await supabase
              .from('project_deliverables')
              .insert(
                milestone.deliverables.map(deliverable => ({
                  description: deliverable.description,
                  deliverable_type: deliverable.deliverable_type,
                  content: deliverable.content || null,
                  file_url: deliverable.deliverable_type === 'file' ? deliverable.content || '' : '',
                  milestone_id: createdMilestone.id,
                  project_id: project.id,
                  uploaded_by: user.id,
                  created_at: new Date().toISOString()
                }))
              );

            if (deliverablesError) throw deliverablesError;
          }
        }
      }

      toast({
        title: "Success",
        description: "Project created successfully!"
      });

      // Navigate to the project details page
      navigate(`/project/${project.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive"
      });
    }
  };

  const progress = (currentStep / steps.length) * 100;

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicDetailsStep data={projectData} onUpdate={handleDataUpdate} />;
      case 2:
        return <RequirementsStep data={projectData} onUpdate={handleDataUpdate} />;
      case 3:
        return <BudgetTimelineStep data={projectData} onUpdate={handleDataUpdate} />;
      case 4:
        return <MilestonesDeliverablesStep data={projectData} onUpdate={handleDataUpdate} />;
      case 5:
        return <ServiceContractStep data={projectData} onUpdate={handleDataUpdate} />;
      case 6:
        return <ReviewStep data={projectData} />;
      default:
        return <BasicDetailsStep data={projectData} onUpdate={handleDataUpdate} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create New Project</CardTitle>
          <div className="space-y-4">
            <Progress value={progress} className="w-full" />
            
            {/* Enhanced Step Indicators */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-xs">
              {steps.map((step) => (
                <div key={step.number} className="flex flex-col items-center space-y-1">
                  <div className="flex items-center">
                    {isStepComplete(step.number) ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : currentStep === step.number ? (
                      <Circle className="h-5 w-5 text-blue-500 fill-current" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-300" />
                    )}
                  </div>
                  <div className={`text-center ${currentStep === step.number ? 'font-medium text-blue-600' : 'text-gray-500'}`}>
                    <div className="font-medium">{step.title}</div>
                    <div className="text-xs opacity-75 hidden md:block">{step.description}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Current Step Info */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium">Step {currentStep}: {steps[currentStep - 1].title}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {steps[currentStep - 1].description}
                </div>
                <div className="mt-2">
                  <span className="text-sm font-medium">Required fields:</span>
                  <ul className="text-sm text-gray-600 mt-1">
                    {getCurrentStepRequirements().map((req, index) => (
                      <li key={index} className="flex items-center gap-1">
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </CardHeader>
        <CardContent>
          {renderCurrentStep()}
          
          <div className="flex justify-between items-center mt-8">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              ← Previous
            </Button>
            
            <div className="text-sm text-gray-500">
              Step {currentStep} of {steps.length}
            </div>
            
            {currentStep === steps.length ? (
              <Button onClick={handleSubmit} size="lg" className="px-8">
                🚀 Publish Project
              </Button>
            ) : (
              <Button 
                onClick={nextStep} 
                disabled={!canProceedToNext()}
                size="lg"
                className="px-8"
              >
                Next →
              </Button>
            )}
          </div>

          {!canProceedToNext() && currentStep !== steps.length && (
            <div className="mt-4 flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Please complete all required fields to continue</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectCreationWizard;
