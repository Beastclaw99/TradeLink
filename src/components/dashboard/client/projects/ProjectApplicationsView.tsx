import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Application } from '../../types';
import { Star, MessageSquare, User, Calendar, DollarSign } from 'lucide-react';
import ViewApplicationDialog from '../dialogs/ViewApplicationDialog';
import ActionConfirmationDialog from '../dialogs/ActionConfirmationDialog';
import { useToast } from "@/components/ui/use-toast";
import ApplicationCard from '@/components/shared/cards/ApplicationCard';
import { Database } from '@/integrations/supabase/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

type Project = Database['public']['Tables']['projects']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface ProjectApplicationsViewProps {
  project: Project;
  applications: Application[];
  professionals: Profile[];
  onApplicationUpdate: (
    applicationId: string,
    newStatus: string,
    projectId: string,
    professionalId: string
  ) => Promise<void>;
}

const ProjectApplicationsView: React.FC<ProjectApplicationsViewProps> = ({
  project,
  applications,
  professionals,
  onApplicationUpdate
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'accept' | 'reject' | null>(null);

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
    setIsViewDialogOpen(true);
  };

  const handleApplicationAction = async (application: Application, action: 'accept' | 'reject') => {
    if (!application.professional_id) {
      toast({
        title: "Error",
        description: "Professional ID is missing from the application.",
        variant: "destructive"
      });
      return;
    }

    try {
      await onApplicationUpdate(
        application.id,
        action === 'accept' ? 'accepted' : 'rejected',
        project.id,
        application.professional_id
      );

      toast({
        title: "Application Updated",
        description: `Application has been ${action}ed.`
      });

      setIsConfirmDialogOpen(false);
      setIsViewDialogOpen(false);
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: "Failed to update application. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleConfirmAction = async () => {
    if (!selectedApplication || !actionType) return;
    await handleApplicationAction(selectedApplication, actionType);
  };

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const acceptedApplications = applications.filter(app => app.status === 'accepted');
  const rejectedApplications = applications.filter(app => app.status === 'rejected');

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Applications for {project.title}</h2>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back to Projects
        </Button>
      </div>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No applications yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {pendingApplications.length > 0 && (
        <div>
              <h3 className="text-lg font-semibold mb-4">Pending Applications</h3>
            <div className="grid gap-4">
                {pendingApplications.map(application => {
                  const professional = professionals.find(p => p.id === application.professional_id);
                  return (
                    <ApplicationCard
                      key={application.id}
                      application={application}
                      project={project}
                      professional={professional}
                      onViewDetails={handleViewDetails}
                      onAccept={(app) => {
                        setSelectedApplication(app);
                        setActionType('accept');
                        setIsConfirmDialogOpen(true);
                      }}
                      onReject={(app) => {
                        setSelectedApplication(app);
                        setActionType('reject');
                        setIsConfirmDialogOpen(true);
                      }}
                    />
                  );
                })}
                        </div>
                            </div>
                          )}

          {acceptedApplications.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Accepted Applications</h3>
              <div className="grid gap-4">
                {acceptedApplications.map(application => {
                  const professional = professionals.find(p => p.id === application.professional_id);
                  return (
                    <ApplicationCard
                      key={application.id}
                      application={application}
                      project={project}
                      professional={professional}
                      onViewDetails={handleViewDetails}
                    />
                  );
                })}
                        </div>
                      </div>
          )}

          {rejectedApplications.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Rejected Applications</h3>
              <div className="grid gap-4">
                {rejectedApplications.map(application => {
                  const professional = professionals.find(p => p.id === application.professional_id);
                  return (
                    <ApplicationCard
                      key={application.id}
                      application={application}
                      project={project}
                      professional={professional}
                      onViewDetails={handleViewDetails}
                    />
                  );
                })}
                      </div>
                    </div>
          )}
                        </div>
      )}

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                      <div>
                  <h3 className="font-semibold">{project.title}</h3>
                  <p className="text-sm text-gray-500">
                    Applied on {new Date(selectedApplication.created_at).toLocaleDateString()}
                        </p>
                      </div>
                <Badge variant="outline">
                  {selectedApplication.status}
                </Badge>
                    </div>

              <div>
                <h4 className="font-medium mb-2">Cover Letter</h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {selectedApplication.cover_letter}
                      </p>
                    </div>

              {selectedApplication.proposal_message && (
                <div>
                  <h4 className="font-medium mb-2">Proposal Message</h4>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {selectedApplication.proposal_message}
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Bid Amount</p>
                  <p className="text-lg">${selectedApplication.bid_amount?.toLocaleString()}</p>
                </div>
                {selectedApplication.status === 'pending' && (
                  <div className="space-x-2">
                      <Button
                        variant="outline"
                      onClick={() => {
                        setActionType('reject');
                        setIsConfirmDialogOpen(true);
                      }}
                      >
                        Reject
                      </Button>
                      <Button
                      onClick={() => {
                        setActionType('accept');
                        setIsConfirmDialogOpen(true);
                      }}
                      >
                        Accept
                      </Button>
                    </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to {actionType} this application?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
              Cancel
            </Button>
                      <Button
              variant={actionType === 'accept' ? 'default' : 'destructive'}
              onClick={handleConfirmAction}
                      >
              {actionType === 'accept' ? 'Accept' : 'Reject'}
                      </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectApplicationsView; 