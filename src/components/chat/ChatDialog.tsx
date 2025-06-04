
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  recipient_id: string;
}

export const ChatDialog: React.FC<ChatDialogProps> = ({
  open,
  onOpenChange,
  title,
  recipient_id
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Start a conversation with this user
          </DialogDescription>
        </DialogHeader>
        <div className="p-4">
          <p className="text-gray-600">Chat functionality will be implemented here.</p>
          <p className="text-sm text-gray-500 mt-2">Recipient ID: {recipient_id}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
