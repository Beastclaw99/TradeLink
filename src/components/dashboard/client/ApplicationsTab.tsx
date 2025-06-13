import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Application, Project } from '../types';
import ApplicationCard from '@/components/shared/cards/ApplicationCard';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ApplicationsTabProps {
  isLoading: boolean;
  applications: Application[];
  projects: Project[];
  professionals: Profile[];
  userId: string;
}

const ApplicationsTab: React.FC<ApplicationsTabProps> = ({
  isLoading,
  applications,
  projects,
  professionals,
  userId
}) => {
  const { toast } = useToast();
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'accept' | 'reject' | null>(null);

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
    setIsViewDialogOpen(true);
  };

  const handleApplicationUpdate = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Application Updated",
        description: `Application has been ${newStatus}.`,
      });

      // Refresh the applications list
      window.location.reload();
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: "Failed to update application. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleConfirmAction = async () => {
    if (!selectedApplication || !actionType) return;

    await handleApplicationUpdate(
      selectedApplication.id,
      actionType === 'accept' ? 'accepted' : 'rejected'
    );
    setIsConfirmDialogOpen(false);
    setIsViewDialogOpen(false);
  };

  if (isLoading) {
    return <div>Loading applications...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Applications</h2>
        {applications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No applications yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {applications.map((application) => {
    const project = projects.find(p => p.id === application.project_id);
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
        )}
      </div>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
          <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">
                    {projects.find(p => p.id === selectedApplication.project_id)?.title}
                  </h3>
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

export default ApplicationsTab;
