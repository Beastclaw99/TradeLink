
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Application } from '../types';
import { supabase } from '@/integrations/supabase/client';
import ApplicationStatusTracker from './enhanced/ApplicationStatusTracker';
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
    updateLocalApplications 
  } = useApplications(applications || [], isLoading);
  
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
      
      const { error } = await supabase
        .from('applications')
        .update({ status: 'withdrawn' })
        .eq('id', selectedApplication.id)
        .eq('professional_id', userId);
      
      if (error) throw error;
      
      toast({
        title: "Application Withdrawn",
        description: "Your application has been withdrawn successfully."
      });
      
      setWithdrawDialogOpen(false);
      
      // Update the local application state
      const updatedApplications = localApplications.map(app => {
        if (app.id === selectedApplication.id) {
          return { ...app, status: 'withdrawn' };
        }
        return app;
      });
      
      updateLocalApplications(updatedApplications);
      
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
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Application Status</h2>
          <p className="text-gray-600">Track the progress of your project applications</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-800 p-4 rounded-md">
            {error}
          </div>
        )}
        
        {localIsLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-ttc-blue-700 mr-2" />
            <span>Loading your applications...</span>
          </div>
        ) : (
          <ApplicationStatusTracker 
            applications={localApplications}
            onViewApplication={handleViewApplication}
            onWithdrawApplication={handleWithdrawInitiate}
          />
        )}
      </div>
      
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
