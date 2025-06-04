import React, { useState } from 'react';
import BasicDetailsStep from './steps/BasicDetailsStep';
import RequirementsStep from './steps/RequirementsStep';
import BudgetTimelineStep from './steps/BudgetTimelineStep';
import MilestonesDeliverablesStep from './steps/MilestonesDeliverablesStep';
import ServiceContractStep from './steps/ServiceContractStep';
import ReviewStep from './steps/ReviewStep';
import { ProjectData } from './types';

interface ProjectCreationWizardProps {
  onProjectCreated: (projectData: ProjectData) => void;
  onCancel: () => void;
}

const initialProjectData: ProjectData = {
  title: '',
  description: '',
  category: '',
  requiredSkills: [],
  budget: 0,
  timeline: '',
  milestones: [],
  termsAndConditions: false,
  location: '',
  expectedTimeline: '',
  urgency: 'low',
};

const ProjectCreationWizard: React.FC<ProjectCreationWizardProps> = ({
  onProjectCreated,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState<ProjectData>(initialProjectData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDataUpdate = (newData: Partial<ProjectData>) => {
    setProjectData({ ...projectData, ...newData });
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    onProjectCreated(projectData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicDetailsStep
            data={projectData}
            onUpdate={handleDataUpdate}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <RequirementsStep
            data={projectData}
            onUpdate={handleDataUpdate}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <BudgetTimelineStep
            data={projectData}
            onUpdate={handleDataUpdate}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <MilestonesDeliverablesStep
            data={projectData}
            onUpdate={handleDataUpdate}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <ServiceContractStep
            data={projectData}
            onUpdate={handleDataUpdate}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 6:
        return (
          <ReviewStep
            data={projectData}
            onUpdate={handleDataUpdate}
            onSubmit={handleSubmit}
            onBack={handleBack}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Create a New Project</h2>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${(currentStep / 6) * 100}%` }}></div>
        </div>
        <p className="text-gray-600">Step {currentStep} of 6</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border p-6">
        {renderStep()}
      </div>
    </div>
  );
};

export default ProjectCreationWizard;
