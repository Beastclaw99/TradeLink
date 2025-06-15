
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Check, Save } from 'lucide-react';

interface NavigationButtonsProps {
  currentStep: number;
  isLastStep: boolean;
  isSubmitting: boolean;
  isSavingDraft: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
  onSubmit: () => void;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStep,
  isLastStep,
  isSubmitting,
  isSavingDraft,
  onPrevious,
  onNext,
  onSaveDraft,
  onSubmit
}) => {
  return (
    <div className="flex justify-between pt-6 border-t">
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        
        <Button
          variant="outline"
          onClick={onSaveDraft}
          disabled={isSavingDraft}
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {isSavingDraft ? 'Saving...' : 'Save Draft'}
        </Button>
      </div>
      
      {isLastStep ? (
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          {isSubmitting ? 'Creating...' : 'Create Project'}
          <Check className="w-4 h-4" />
        </Button>
      ) : (
        <Button
          onClick={onNext}
          className="flex items-center gap-2"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};
