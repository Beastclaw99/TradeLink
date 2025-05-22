
import React from 'react';
import { Button } from "@/components/ui/button";

interface DashboardErrorProps {
  error: string;
  isLoading: boolean;
  onRetry: () => void;
}

const DashboardError: React.FC<DashboardErrorProps> = ({ 
  error, 
  isLoading, 
  onRetry 
}) => {
  return (
    <div className="bg-red-50 border border-red-200 p-4 rounded-md mb-6">
      <p className="text-red-700">{error}</p>
      <Button 
        onClick={onRetry} 
        variant="outline" 
        className="mt-2"
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Try Again"}
      </Button>
    </div>
  );
};

export default DashboardError;
