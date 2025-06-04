
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Application } from '../types';
import ApplicationsTable from './applications/ApplicationsTable';
import ViewApplicationDialog from './applications/ViewApplicationDialog';
import WithdrawApplicationDialog from './applications/WithdrawApplicationDialog';
import { useApplications } from './applications/useApplications';

interface ApplicationsTabProps {
  isLoading: boolean;
  applications: Application[];
  userId: string;
}

const ApplicationsTab: React.FC<ApplicationsTabProps> = ({ isLoading, applications, userId }) => {
  const { toast } = useToast();
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    localApplications, 
    localIsLoading, 
    updateLocalApplications,
    withdrawApplication 
  } = useApplications(applications, isLoading);
  
  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
    setViewDialogOpen(true);
  };
  
  const handleWithdrawInitiate = (application: Application) => {
    setSelectedApplication(application);
    setWithdrawDialogOpen(true);
  };
  
  const handleWithdrawApplication = async () => {
    if (!selectedApplication) return;
    
    try {
      setIsProcessing(true);
      setError(null);
      
      await withdrawApplication(selectedApplication.id, userId);
      
      setWithdrawDialogOpen(false);
      
    } catch (error: any) {
      console.error('Error withdrawing application:', error);
      setError(error.message || 'Failed to withdraw application');
      toast({
        title: "Error",
        description: "Failed to withdraw application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Your Applications</h2>
      
      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {localIsLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-ttc-blue-700 mr-2" />
          <span>Loading your applications...</span>
        </div>
      ) : (
        <ApplicationsTable 
          applications={localApplications}
          onViewApplication={handleViewApplication}
          onWithdrawInitiate={handleWithdrawInitiate}
        />
      )}
      
      {/* Dialogs */}
      <ViewApplicationDialog 
        open={viewDialogOpen} 
        onOpenChange={setViewDialogOpen}
        application={selectedApplication}
        onWithdraw={handleWithdrawInitiate}
      />
      
      <WithdrawApplicationDialog 
        open={withdrawDialogOpen} 
        onOpenChange={setWithdrawDialogOpen}
        isProcessing={isProcessing}
        onConfirm={handleWithdrawApplication}
      />
    </>
  );
};

export default ApplicationsTab;
