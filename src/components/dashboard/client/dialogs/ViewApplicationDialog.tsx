import React from 'react';
import { Application } from '../../types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquare, Check, X } from "lucide-react";

interface ViewApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedApplication: Application | null;
  projects: any[];
  onAccept: (application: Application) => void;
  onReject: (application: Application) => void;
  onMessage: (application: Application) => void;
}

const ViewApplicationDialog: React.FC<ViewApplicationDialogProps> = ({
  open,
  onOpenChange,
  selectedApplication,
  projects,
  onAccept,
  onReject,
  onMessage,
}) => {
  if (!selectedApplication) return null;

  const project = projects.find(p => p.id === selectedApplication.project_id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Application Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Project Information */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Project</h3>
            <p className="text-gray-600">{project?.title || 'Unknown Project'}</p>
          </div>

          {/* Professional Information */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Professional</h3>
            <p className="text-gray-600">{selectedApplication.professional_name || 'Unknown Professional'}</p>
          </div>

          {/* Application Message */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Message</h3>
            <p className="text-gray-600 whitespace-pre-wrap">
              {selectedApplication.message || 'No message provided.'}
            </p>
          </div>

          {/* Application Status */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Status</h3>
            <p className="text-gray-600 capitalize">{selectedApplication.status}</p>
          </div>

          {/* Action Buttons */}
          {selectedApplication.status === 'pending' && (
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => onMessage(selectedApplication)}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Message
              </Button>
              <Button
                variant="destructive"
                onClick={() => onReject(selectedApplication)}
              >
                <X className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button
                onClick={() => onAccept(selectedApplication)}
              >
                <Check className="w-4 h-4 mr-2" />
                Accept
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewApplicationDialog; 