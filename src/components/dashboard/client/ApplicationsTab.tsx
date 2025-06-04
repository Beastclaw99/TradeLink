import React, { useState } from 'react';
import { Application } from '../types';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import ViewApplicationDialog from './dialogs/ViewApplicationDialog';
import ActionConfirmationDialog from './dialogs/ActionConfirmationDialog';
import PendingApplicationsTable from './tables/PendingApplicationsTable';
import PastApplicationsTable from './tables/PastApplicationsTable';
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

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
  const navigate = useNavigate();
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

  const handleMessage = (application: Application) => {
    if (!application.professional_id) return;
    
    // Navigate to messages with the professional
    navigate(`/messages?recipient=${application.professional_id}&project=${application.project_id}`);
  };
  
  const handleConfirmAction = async () => {
    if (!selectedApplication || !actionType) return;
    
    try {
      setIsProcessing(true);
      
      const newStatus = actionType === 'accept' ? 'accepted' : 'rejected';
      
      await handleApplicationUpdate(
        selectedApplication.id,
        newStatus,
        selectedApplication.project_id,
        selectedApplication.professional_id
      );
      
      toast({
        title: `Application ${actionType === 'accept' ? 'Accepted' : 'Rejected'}`,
        description: `The application has been ${actionType === 'accept' ? 'accepted' : 'rejected'} successfully.`
      });
      
      setActionDialogOpen(false);
      setViewDialogOpen(false);
      
    } catch (error: any) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: "Failed to update application status. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const pastApplications = applications.filter(app => app.status !== 'pending');
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Applications to Your Projects</h2>
        <Button
          variant="outline"
          onClick={() => navigate('/messages')}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          View All Messages
        </Button>
      </div>

      {isLoading ? (
        <p>Loading applications...</p>
      ) : (
        <>
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Pending Applications ({pendingApplications.length})</h3>
            {pendingApplications.length === 0 ? (
              <p className="text-gray-500">No pending applications to review.</p>
            ) : (
              <PendingApplicationsTable 
                applications={pendingApplications}
                projects={projects}
                onViewApplication={handleViewApplication}
                onActionInitiate={handleActionInitiate}
              />
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Past Applications ({pastApplications.length})</h3>
            {pastApplications.length === 0 ? (
              <p className="text-gray-500">No past applications to display.</p>
            ) : (
              <PastApplicationsTable 
                applications={pastApplications}
                projects={projects}
                onViewApplication={handleViewApplication}
              />
            )}
          </div>
        </>
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
        onMessage={handleMessage}
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
