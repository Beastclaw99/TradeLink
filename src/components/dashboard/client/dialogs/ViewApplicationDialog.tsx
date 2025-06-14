
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Calendar, Clock, User } from 'lucide-react';
import { Application } from '@/types/database';

interface ViewApplicationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  application: Application | null;
  onAccept?: () => void;
  onReject?: () => void;
  isProcessing?: boolean;
}

const ViewApplicationDialog: React.FC<ViewApplicationDialogProps> = ({
  isOpen,
  onOpenChange,
  application,
  onAccept,
  onReject,
  isProcessing = false
}) => {
  if (!application) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Application Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Application Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Status</span>
            <Badge variant={application.status === 'pending' ? 'secondary' : 'default'}>
              {application.status}
            </Badge>
          </div>

          {/* Professional Information */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <User className="h-5 w-5 text-gray-400" />
                <span className="font-medium">Professional ID: {application.professional_id}</span>
              </div>
            </CardContent>
          </Card>

          {/* Application Details */}
          <div className="space-y-4">
            {application.bid_amount && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">Proposed Amount:</span>
                <span className="font-medium">${application.bid_amount.toLocaleString()}</span>
              </div>
            )}

            {application.availability && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">Availability:</span>
                <span className="font-medium">{application.availability}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Applied:</span>
              <span className="font-medium">
                {application.created_at ? new Date(application.created_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>

          {/* Cover Letter */}
          {application.cover_letter && (
            <div>
              <h4 className="font-medium mb-2">Cover Letter</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {application.cover_letter}
                </p>
              </div>
            </div>
          )}

          {/* Proposal Message */}
          {application.proposal_message && (
            <div>
              <h4 className="font-medium mb-2">Proposal</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {application.proposal_message}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {application.status === 'pending' && (onAccept || onReject) && (
            <div className="flex gap-3 pt-4 border-t">
              {onReject && (
                <Button
                  variant="outline"
                  onClick={onReject}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  Reject
                </Button>
              )}
              {onAccept && (
                <Button
                  onClick={onAccept}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  Accept Application
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewApplicationDialog;
