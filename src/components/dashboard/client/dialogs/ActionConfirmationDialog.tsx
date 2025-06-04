
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ActionConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actionType: 'accept' | 'reject' | null;
  isProcessing: boolean;
  onConfirm: () => void;
}

const ActionConfirmationDialog: React.FC<ActionConfirmationDialogProps> = ({
  open,
  onOpenChange,
  actionType,
  isProcessing,
  onConfirm
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {actionType === 'accept' ? 'Accept Application' : 'Reject Application'}
          </DialogTitle>
          <DialogDescription>
            {actionType === 'accept' 
              ? 'Are you sure you want to accept this application? This will assign the professional to your project.'
              : 'Are you sure you want to reject this application?'
            }
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            className={actionType === 'accept' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing 
              ? "Processing..." 
              : actionType === 'accept' 
                ? "Accept Application" 
                : "Reject Application"
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActionConfirmationDialog;
