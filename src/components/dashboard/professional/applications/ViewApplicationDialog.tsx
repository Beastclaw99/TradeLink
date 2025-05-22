
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Application } from '../../types';
import { getStatusBadgeClass } from './applicationUtils';

interface ViewApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: Application | null;
  onWithdraw: (application: Application) => void;
}

const ViewApplicationDialog: React.FC<ViewApplicationDialogProps> = ({
  open,
  onOpenChange,
  application,
  onWithdraw
}) => {
  if (!application) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Application Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Project</h3>
            <p>{application.project?.title}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(application.status)}`}>
              {application.status}
            </span>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Your Bid</h3>
            <p>${application.bid_amount || application.project?.budget || 'N/A'}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Your Proposal</h3>
            <p className="text-sm whitespace-pre-wrap">{application.proposal_message || application.cover_letter || 'No proposal provided'}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Applied On</h3>
            <p>{new Date(application.created_at || '').toLocaleDateString()}</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          {application.status === 'pending' && (
            <Button 
              variant="destructive" 
              onClick={() => {
                onOpenChange(false);
                onWithdraw(application);
              }}
            >
              Withdraw Application
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewApplicationDialog;
