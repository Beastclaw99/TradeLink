
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Plus } from 'lucide-react';

interface EmptyProjectStateProps {
  message: string;
  showCreateButton?: boolean;
  onCreateClick?: () => void;
}

const EmptyProjectState: React.FC<EmptyProjectStateProps> = ({ 
  message, 
  showCreateButton = false,
  onCreateClick 
}) => {
  return (
    <div className="text-center py-8">
      <FileText className="w-12 h-12 mx-auto text-ttc-neutral-400" />
      <p className="mt-4 text-ttc-neutral-600">{message}</p>
      {showCreateButton && (
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={onCreateClick}
        >
          <Plus className="w-4 h-4 mr-2" /> Post New Project
        </Button>
      )}
    </div>
  );
};

export default EmptyProjectState;
