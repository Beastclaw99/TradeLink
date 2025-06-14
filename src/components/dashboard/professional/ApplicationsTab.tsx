import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Database } from '@/integrations/supabase/types';
import ApplicationCard from '@/components/shared/cards/ApplicationCard';

type Project = Database['public']['Tables']['projects']['Row'];
type Application = Database['public']['Tables']['applications']['Row'];
type ApplicationStatus = Database['public']['Enums']['application_status'];

interface ApplicationsTabProps {
  isLoading: boolean;
  applications: Application[];
  projects: Project[];
  userId: string;
}

const ApplicationsTab: React.FC<ApplicationsTabProps> = ({
  isLoading,
  applications = [],
  projects = [],
  userId
}) => {
  const { toast } = useToast();
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const handleViewDetails = (application: Application) => {
    if (!application?.id) return;
    setSelectedApplication(application);
    setIsViewDialogOpen(true);
  };

  const handleWithdraw = async (application: Application) => {
    if (!application?.id) return;
    
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: 'withdrawn' })
        .eq('id', application.id);

      if (error) throw error;

      toast({
        title: "Application Withdrawn",
        description: "Your application has been withdrawn successfully.",
      });

      // Refresh the applications list
      window.location.reload();
    } catch (error) {
      console.error('Error withdrawing application:', error);
      toast({
        title: "Error",
        description: "Failed to withdraw application. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleConfirmWithdraw = async () => {
    if (!selectedApplication?.id) return;
    await handleWithdraw(selectedApplication);
    setIsConfirmDialogOpen(false);
    setIsViewDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">My Applications</h2>
        {!applications?.length ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No applications yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {applications.map((application) => {
              const project = projects?.find(p => p?.id === application?.project_id);
              
              return (
                <ApplicationCard
                  key={application?.id}
                  application={application}
                  project={project || undefined}
                  isProfessional={true}
                  onViewDetails={handleViewDetails}
                  onWithdraw={(app) => {
                    if (!app?.id) return;
                    setSelectedApplication(app);
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
                    {projects?.find(p => p?.id === selectedApplication?.project_id)?.title || 'Unknown Project'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Applied on {selectedApplication?.created_at ? new Date(selectedApplication.created_at).toLocaleDateString() : 'Unknown date'}
                  </p>
                </div>
                <Badge variant="outline">
                  {selectedApplication?.status || 'Unknown'}
                </Badge>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Cover Letter</h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {selectedApplication?.cover_letter || 'No cover letter provided'}
                </p>
              </div>

              {selectedApplication?.proposal_message && (
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
                  <p className="text-lg">
                    ${selectedApplication?.bid_amount?.toLocaleString() || '0'}
                  </p>
                </div>
                {selectedApplication?.status === 'pending' && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedApplication(selectedApplication);
                      setIsConfirmDialogOpen(true);
                    }}
                  >
                    Withdraw Application
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Withdrawal</DialogTitle>
            <DialogDescription>
              Are you sure you want to withdraw this application? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmWithdraw}>
              Confirm Withdrawal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationsTab;
