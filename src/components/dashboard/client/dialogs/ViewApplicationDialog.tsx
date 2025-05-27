import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X, MessageSquare, Star, Calendar, DollarSign, Award } from "lucide-react";
import { Application } from '../../types';
import { getStatusBadgeClass } from '../../professional/applications/applicationUtils';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Application Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Project Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Project</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium">{project?.title || 'Unknown Project'}</h4>
              <p className="text-sm text-gray-600 mt-1">{project?.description}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="bg-gray-100">
                  Budget: ${project?.budget?.toLocaleString() || 'N/A'}
                </Badge>
                <Badge variant="outline" className="bg-gray-100">
                  Status: {project?.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Professional</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">
                    {professional ? 
                      `${professional.first_name} ${professional.last_name}` : 
                      'Unknown Applicant'}
                  </h4>
                  {professional?.rating && (
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">
                        {professional.rating.toFixed(1)} Rating
                      </span>
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onMessage(selectedApplication)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message
                </Button>
              </div>
              
              {professional?.skills && (
                <div className="mt-3">
                  <h5 className="text-sm font-medium text-gray-500 mb-1">Skills</h5>
                  <div className="flex flex-wrap gap-2">
                    {professional.skills.map((skill: string) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Application Details */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Application Details</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <DollarSign className="w-4 h-4 mr-1" />
                    Bid Amount
                  </div>
                  <p className="font-medium">
                    ${selectedApplication.bid_amount?.toLocaleString() || 'Same as project budget'}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    Availability
                  </div>
                  <p className="font-medium">
                    {selectedApplication.availability || 'Not specified'}
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <Award className="w-4 h-4 mr-1" />
                  Status
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(selectedApplication.status)}`}>
                  {selectedApplication.status}
                </span>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-1">Proposal Message</div>
                <p className="text-sm whitespace-pre-wrap bg-white p-3 rounded border">
                  {selectedApplication.proposal_message || selectedApplication.cover_letter || 'No proposal provided'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => onReject(selectedApplication)}
            className="text-red-600 border-red-200 hover:bg-red-50"
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewApplicationDialog;
