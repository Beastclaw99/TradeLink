
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyProjectStateProps {
  message?: string;
}

const EmptyProjectState: React.FC<EmptyProjectStateProps> = ({ 
  message = "You haven't created any projects yet. Start by posting your first project!" 
}) => {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Plus className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
        <p className="text-gray-500 mb-6">{message}</p>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Your First Project
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyProjectState;
