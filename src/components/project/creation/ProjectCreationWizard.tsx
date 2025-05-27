
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import BasicDetailsStep from './steps/BasicDetailsStep';
import RequirementsStep from './steps/RequirementsStep';
import BudgetTimelineStep from './steps/BudgetTimelineStep';
import ReviewStep from './steps/ReviewStep';
import { CheckCircle } from 'lucide-react';

interface ProjectData {
  title: string;
  description: string;
  category: string;
  location: string;
  requirements: string[];
  skills: string[];
  budget: number;
  timeline: string;
  urgency: string;
}

const ProjectCreationWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState<ProjectData>({
    title: '',
    description: '',
    category: '',
    location: '',
    requirements: [],
    skills: [],
    budget: 0,
    timeline: '',
    urgency: ''
  });

  const steps = [
    { number: 1, title: 'Basic Details', component: BasicDetailsStep },
    { number: 2, title: 'Requirements', component: RequirementsStep },
    { number: 3, title: 'Budget & Timeline', component: BudgetTimelineStep },
    { number: 4, title: 'Review', component: ReviewStep }
  ];

  const nextStep = () => {
    if (currentStep < steps.length) {
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

  const handleSubmit = () => {
    // TODO: Integrate with backend API to create project
    console.log('Creating project:', projectData);
    alert('Project created successfully! (Placeholder)');
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
        return <ReviewStep data={projectData} />;
      default:
        return <BasicDetailsStep data={projectData} onUpdate={handleDataUpdate} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create New Project</CardTitle>
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between text-sm text-gray-600">
              {steps.map((step) => (
                <div key={step.number} className="flex items-center">
                  {currentStep > step.number ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <span className={`w-4 h-4 rounded-full text-xs flex items-center justify-center mr-1 ${
                      currentStep === step.number ? 'bg-blue-500 text-white' : 'bg-gray-300'
                    }`}>
                      {step.number}
                    </span>
                  )}
                  <span className={currentStep === step.number ? 'font-medium' : ''}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderCurrentStep()}
          
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep === steps.length ? (
              <Button onClick={handleSubmit}>
                Create Project
              </Button>
            ) : (
              <Button onClick={nextStep}>
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectCreationWizard;
