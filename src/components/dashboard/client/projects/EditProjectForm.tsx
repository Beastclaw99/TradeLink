
import React from 'react';
import { CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Project } from '../../types';

interface EditProjectFormProps {
  project: Project;
  editedProject: any;
  isSubmitting: boolean;
  onCancel: () => void;
  onSave: (updates: any) => Promise<void>;
  onFieldChange: (field: string, value: any) => void;
}

const EditProjectForm: React.FC<EditProjectFormProps> = ({
  project,
  editedProject,
  isSubmitting,
  onCancel,
  onSave,
  onFieldChange,
}) => {
  const handleSave = () => {
    onSave(editedProject);
  };

  return (
    <>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={editedProject?.title || ''}
            onChange={(e) => onFieldChange('title', e.target.value)}
            placeholder="Project title"
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={editedProject?.description || ''}
            onChange={(e) => onFieldChange('description', e.target.value)}
            placeholder="Project description"
            rows={4}
          />
        </div>
        
        <div>
          <Label htmlFor="budget">Budget</Label>
          <Input
            id="budget"
            type="number"
            value={editedProject?.budget || ''}
            onChange={(e) => onFieldChange('budget', parseFloat(e.target.value) || 0)}
            placeholder="Project budget"
          />
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardFooter>
    </>
  );
};

export default EditProjectForm;
