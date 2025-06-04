
import React, { useState } from 'react';
import BasicDetailsStep from './steps/BasicDetailsStep';
import RequirementsStep from './steps/RequirementsStep';
import BudgetTimelineStep from './steps/BudgetTimelineStep';
import MilestonesDeliverablesStep from './steps/MilestonesDeliverablesStep';
import ServiceContractStep from './steps/ServiceContractStep';
import ReviewStep from './steps/ReviewStep';
import { ProjectData } from '@/types';

interface ProjectCreationWizardProps {
  onProjectCreated: (projectData: ProjectData) => void;
  onCancel: () => void;
}

const initialProjectData: ProjectData = {
  title: '',
  description: '',
  category: '',
  budget: 0,
  timeline: '',
  milestones: [],
  location: '',
  expectedTimeline: '',
  urgency: 'low',
  recommended_skills: [],
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
          />
        );
      case 2:
        return (
          <RequirementsStep
            data={projectData}
            onUpdate={handleDataUpdate}
          />
        );
      case 3:
        return (
          <BudgetTimelineStep
            data={projectData}
            onUpdate={handleDataUpdate}
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
          />
        );
      case 6:
        return (
          <ReviewStep
            data={projectData}
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
        
        {currentStep < 4 && (
          <div className="flex justify-between mt-6">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Back
              </button>
            )}
            
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ml-auto"
            >
              Next
            </button>
          </div>
        )}

        {currentStep === 5 && (
          <div className="flex justify-between mt-6">
            <button
              onClick={handleBack}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Back
            </button>
            
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Review Project
            </button>
          </div>
        )}

        {currentStep === 6 && (
          <div className="flex justify-between mt-6">
            <button
              onClick={handleBack}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Back
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating Project...' : 'Create Project'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCreationWizard;
