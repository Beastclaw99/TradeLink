
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
  onConfirm,
}) => {
  if (!actionType) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {actionType === 'accept' ? 'Accept Application' : 'Reject Application'}
          </DialogTitle>
        </DialogHeader>
        
        <p className="text-gray-600">
          Are you sure you want to {actionType} this application?
          {actionType === 'accept' && ' This will assign the professional to the project.'}
        </p>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            variant={actionType === 'accept' ? 'default' : 'destructive'}
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : (actionType === 'accept' ? 'Accept' : 'Reject')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActionConfirmationDialog;
