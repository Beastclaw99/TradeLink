
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Check } from 'lucide-react';

interface WizardHeaderProps {
  isEditing: boolean;
  currentStep: number;
  progress: number;
  steps: Array<{ id: number; title: string }>;
}

export const WizardHeader: React.FC<WizardHeaderProps> = ({
  isEditing,
  currentStep,
  progress,
  steps
}) => {
  return (
    <CardHeader>
      <CardTitle className="text-2xl text-center">
        {isEditing ? 'Edit Project' : 'Create New Project'}
      </CardTitle>
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Step {currentStep} of {steps.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>
      
      {/* Steps indicator */}
      <div className="flex justify-between mt-4">
        {steps.map((step, index) => (
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
  );
};
