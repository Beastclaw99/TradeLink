
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Clock } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description?: string;
  status: 'completed' | 'current' | 'pending';
}

interface ProgressIndicatorProps {
  steps: Step[];
  orientation?: 'horizontal' | 'vertical';
  showDescriptions?: boolean;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  orientation = 'horizontal',
  showDescriptions = false
}) => {
  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const currentStepIndex = steps.findIndex(step => step.status === 'current');
  const progress = completedSteps > 0 ? (completedSteps / steps.length) * 100 : 0;

  if (orientation === 'vertical') {
    return (
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              {step.status === 'completed' ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : step.status === 'current' ? (
                <Clock className="h-6 w-6 text-blue-600" />
              ) : (
                <Circle className="h-6 w-6 text-gray-400" />
              )}
              {index < steps.length - 1 && (
                <div className={`w-0.5 h-8 mt-2 ${
                  step.status === 'completed' ? 'bg-green-200' : 'bg-gray-200'
                }`} />
              )}
            </div>
            <div className="flex-1">
              <h4 className={`font-medium ${
                step.status === 'current' ? 'text-blue-600' : 
                step.status === 'completed' ? 'text-green-600' : 'text-gray-600'
              }`}>
                {step.title}
              </h4>
              {showDescriptions && step.description && (
                <p className="text-sm text-gray-500 mt-1">{step.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Progress value={progress} className="w-full" />
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-full mb-2">
              {step.status === 'completed' ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : step.status === 'current' ? (
                <Clock className="h-6 w-6 text-blue-600" />
              ) : (
                <Circle className="h-6 w-6 text-gray-400" />
              )}
            </div>
            <span className={`text-sm font-medium ${
              step.status === 'current' ? 'text-blue-600' : 
              step.status === 'completed' ? 'text-green-600' : 'text-gray-600'
            }`}>
              {step.title}
            </span>
            {showDescriptions && step.description && (
              <p className="text-xs text-gray-500 mt-1 max-w-20">{step.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
