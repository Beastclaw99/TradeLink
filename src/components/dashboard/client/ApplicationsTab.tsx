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
  onApplicationUpdate: (applicationId: string, status: string) => Promise<void>;
}

const ApplicationsTab: React.FC<ApplicationsTabProps> = ({
  isLoading,
  applications,
  projects,
  professionals,
  onApplicationUpdate
}) => {
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
    setIsViewDialogOpen(true);
  };

  const handleApplicationUpdate = async (applicationId: string, status: string) => {
    try {
      await onApplicationUpdate(applicationId, status);
      toast({
        title: "Application Updated",
        description: `Application has been ${status}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update application. Please try again.",
        variant: "destructive",
      });
    }
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
                  onAccept={(app) => handleApplicationUpdate(app.id, 'accepted')}
                  onReject={(app) => handleApplicationUpdate(app.id, 'rejected')}
                />
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Review the full application details
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Cover Letter</h3>
                <p className="text-sm text-gray-600">
                  {selectedApplication.cover_letter || selectedApplication.proposal_message || 'No cover letter provided'}
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Bid Amount</h3>
                <p className="text-sm text-gray-600">
                  ${selectedApplication.bid_amount?.toLocaleString() || 'Not specified'}
                </p>
              </div>
              {selectedApplication.availability && (
                <div>
                  <h3 className="font-medium mb-2">Availability</h3>
                  <p className="text-sm text-gray-600">
                    {selectedApplication.availability}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationsTab;
