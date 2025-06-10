import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X, MessageSquare, Star, Calendar, DollarSign, Award, User, Briefcase } from "lucide-react";
import { Application } from '../../types';
import { getStatusBadgeClass } from '../../professional/applications/applicationUtils';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';

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
  onMessage
}) => {
  if (!selectedApplication) return null;

  const project = projects.find(p => p.id === selectedApplication.project_id);
  const professional = selectedApplication.professional;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Application Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Professional Information */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      {professional?.first_name} {professional?.last_name}
                    </h3>
                    <Badge variant="secondary">
                      {selectedApplication.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Applied {formatDistanceToNow(new Date(selectedApplication.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Information */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{project?.title}</h3>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Bid Amount: ${selectedApplication.bid_amount}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Availability: {selectedApplication.availability}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Details */}
          <div className="space-y-4">
            <h4 className="font-semibold">Cover Letter</h4>
            <Card>
              <CardContent className="p-6">
                <p className="whitespace-pre-wrap">{selectedApplication.cover_letter}</p>
              </CardContent>
            </Card>

            {selectedApplication.proposal_message && (
              <>
                <h4 className="font-semibold">Proposal Message</h4>
                <Card>
                  <CardContent className="p-6">
                    <p className="whitespace-pre-wrap">{selectedApplication.proposal_message}</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            variant="outline"
            onClick={() => onMessage(selectedApplication)}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Message Professional
          </Button>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => onReject(selectedApplication)}
              className="text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button
              onClick={() => onAccept(selectedApplication)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="w-4 h-4 mr-2" />
              Accept
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewApplicationDialog;
