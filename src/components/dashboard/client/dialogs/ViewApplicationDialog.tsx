
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Application } from '../../types';
import { getStatusBadgeClass } from '../../professional/applications/applicationUtils';

interface ViewApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedApplication: Application | null;
  projects: any[];
  onAccept: (application: Application) => void;
  onReject: (application: Application) => void;
}

const ViewApplicationDialog: React.FC<ViewApplicationDialogProps> = ({
  open,
  onOpenChange,
  selectedApplication,
  projects,
  onAccept,
  onReject
}) => {
  if (!selectedApplication) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Application Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Project</h3>
            <p>{projects.find(p => p.id === selectedApplication.project_id)?.title || 'Unknown Project'}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Applicant</h3>
            <p>
              {selectedApplication.professional ? 
                `${selectedApplication.professional.first_name} ${selectedApplication.professional.last_name}` : 
                'Unknown Applicant'}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Bid Amount</h3>
            <p>${selectedApplication.bid_amount || 'Same as project budget'}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(selectedApplication.status)}`}>
              {selectedApplication.status}
            </span>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Proposal Message</h3>
            <p className="text-sm whitespace-pre-wrap">
              {selectedApplication.proposal_message || selectedApplication.cover_letter || 'No proposal provided'}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Applied On</h3>
            <p>{new Date(selectedApplication.created_at || '').toLocaleDateString()}</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          {selectedApplication.status === 'pending' && (
            <>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  onOpenChange(false);
                  onAccept(selectedApplication);
                }}
              >
                Accept
              </Button>
              <Button 
                variant="destructive"
                onClick={() => {
                  onOpenChange(false);
                  onReject(selectedApplication);
                }}
              >
                Reject
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewApplicationDialog;
