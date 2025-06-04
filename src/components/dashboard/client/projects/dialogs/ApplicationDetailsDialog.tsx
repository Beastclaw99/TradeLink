
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { Application, Project } from '@/types';

interface ApplicationDetailsDialogProps {
  application: Application | null;
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  onReject: () => void;
  isSubmitting: boolean;
}

export const ApplicationDetailsDialog: React.FC<ApplicationDetailsDialogProps> = ({
  application,
  project,
  isOpen,
  onClose,
  onAccept,
  onReject,
  isSubmitting
}) => {
  if (!application || !project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Application Details</DialogTitle>
          <DialogDescription>
            Review the application for {project.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Project Details</h3>
              <p className="text-sm text-muted-foreground">{project.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Application Details</h3>
              <div className="mt-2 space-y-2">
                <p><strong>Status:</strong> <Badge variant={application.status === 'pending' ? 'default' : application.status === 'accepted' ? 'secondary' : 'destructive'}>{application.status}</Badge></p>
                <p><strong>Applied on:</strong> {format(new Date(application.created_at), 'PPP')}</p>
                <p><strong>Cover Letter:</strong></p>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{application.cover_letter || application.proposal_message || 'No message provided.'}</p>
                </div>
                {application.bid_amount && (
                  <p><strong>Bid Amount:</strong> ${application.bid_amount}</p>
                )}
              </div>
            </div>
          </div>

          {application.status === 'pending' && (
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Close
              </Button>
              <Button
                variant="destructive"
                onClick={onReject}
                disabled={isSubmitting}
              >
                Reject
              </Button>
              <Button
                onClick={onAccept}
                disabled={isSubmitting}
              >
                Accept
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
