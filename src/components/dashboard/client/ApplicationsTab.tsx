
import React, { useState } from 'react';
import { Application } from '../types';
import { useToast } from "@/components/ui/use-toast";
import ViewApplicationDialog from './dialogs/ViewApplicationDialog';
import ActionConfirmationDialog from './dialogs/ActionConfirmationDialog';
import PendingApplicationsTable from './tables/PendingApplicationsTable';
import PastApplicationsTable from './tables/PastApplicationsTable';

interface ApplicationsTabProps {
  isLoading: boolean;
  projects: any[];
  applications: Application[];
  handleApplicationUpdate: (
    applicationId: string, 
    newStatus: string, 
    projectId: string, 
    professionalId: string
  ) => Promise<void>;
}

const ApplicationsTab: React.FC<ApplicationsTabProps> = ({ 
  isLoading, 
  projects, 
  applications, 
  handleApplicationUpdate 
}) => {
  const { toast } = useToast();
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'accept' | 'reject' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
    setViewDialogOpen(true);
  };
  
  const handleActionInitiate = (application: Application, action: 'accept' | 'reject') => {
    setSelectedApplication(application);
    setActionType(action);
    setActionDialogOpen(true);
  };
  
  const handleConfirmAction = async () => {
    if (!selectedApplication || !actionType) return;
    
    setIsProcessing(true);
    
    try {
      const newStatus = actionType === 'accept' ? 'accepted' : 'rejected';
      
      await handleApplicationUpdate(
        selectedApplication.id,
        newStatus,
        selectedApplication.project_id || '',
        selectedApplication.professional_id || ''
      );
      
      setActionDialogOpen(false);
      setActionType(null);
      
      toast({
        title: actionType === 'accept' ? "Application Accepted" : "Application Rejected",
        description: actionType === 'accept' 
          ? "The professional has been assigned to this project."
          : "The application has been rejected."
      });
      
    } catch (error) {
      console.error('Error processing application:', error);
      toast({
        title: "Error",
        description: "Failed to process the application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Applications to Your Projects</h2>
      {isLoading ? (
        <p>Loading applications...</p>
      ) : (
        <PendingApplicationsTable 
          applications={applications}
          projects={projects}
          onViewApplication={handleViewApplication}
          onActionInitiate={handleActionInitiate}
        />
      )}
      
      <h2 className="text-2xl font-bold mb-4 mt-8">Past Applications</h2>
      {!isLoading && (
        <PastApplicationsTable 
          applications={applications}
          projects={projects}
          onViewApplication={handleViewApplication}
        />
      )}
      
      {/* View Application Dialog */}
      <ViewApplicationDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        selectedApplication={selectedApplication}
        projects={projects}
        onAccept={(app) => {
          setViewDialogOpen(false);
          handleActionInitiate(app, 'accept');
        }}
        onReject={(app) => {
          setViewDialogOpen(false);
          handleActionInitiate(app, 'reject');
        }}
      />
      
      {/* Action Confirmation Dialog */}
      <ActionConfirmationDialog
        open={actionDialogOpen}
        onOpenChange={setActionDialogOpen}
        actionType={actionType}
        isProcessing={isProcessing}
        onConfirm={handleConfirmAction}
      />
    </>
  );
};

export default ApplicationsTab;
