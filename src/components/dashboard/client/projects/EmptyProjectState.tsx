
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

export interface EmptyProjectStateProps {
  message?: string;
  onCreateProject?: () => void;
  showCreateButton?: boolean;
  onCreateClick?: () => void;
}

const EmptyProjectState: React.FC<EmptyProjectStateProps> = ({ 
  message = "No projects found. Create your first project to get started!",
  onCreateProject,
  showCreateButton = false,
  onCreateClick
}) => {
  const handleCreateClick = onCreateClick || onCreateProject;

  return (
    <Card className="text-center py-12">
      <CardContent>
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          {(showCreateButton || onCreateProject) && handleCreateClick && (
            <Button onClick={handleCreateClick} className="bg-ttc-blue-700 hover:bg-ttc-blue-800">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Project
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyProjectState;
