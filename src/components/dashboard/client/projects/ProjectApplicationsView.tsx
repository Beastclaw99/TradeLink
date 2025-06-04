import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Application } from '../../types';
import { Star, MessageSquare, User, Calendar, DollarSign } from 'lucide-react';
import ViewApplicationDialog from '../dialogs/ViewApplicationDialog';
import ActionConfirmationDialog from '../dialogs/ActionConfirmationDialog';
import { useToast } from "@/components/ui/use-toast";

interface ProjectApplicationsViewProps {
  project: any;
  applications: Application[];
  onApplicationUpdate: (
    applicationId: string,
    newStatus: string,
    projectId: string,
    professionalId: string
  ) => Promise<void>;
}

const ProjectApplicationsView: React.FC<ProjectApplicationsViewProps> = ({
  project,
  applications,
  onApplicationUpdate
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'accept' | 'reject' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
    setViewDialogOpen(true);
  };

  const handleActionInitiate = (application: Application, action: 'accept' | 'reject') => {
    setSelectedApplication(application);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const handleMessage = (application: Application) => {
    if (!application.professional_id) return;
    navigate(`/messages?recipient=${application.professional_id}&project=${project.id}`);
  };

  const handleConfirmAction = async () => {
    if (!selectedApplication || !actionType) return;

    try {
      setIsProcessing(true);

      const newStatus = actionType === 'accept' ? 'accepted' : 'rejected';

      await onApplicationUpdate(
        selectedApplication.id,
        newStatus,
        selectedApplication.project_id,
        selectedApplication.professional_id
      );

      toast({
        title: `Application ${actionType === 'accept' ? 'Accepted' : 'Rejected'}`,
        description: `The application has been ${actionType === 'accept' ? 'accepted' : 'rejected'} successfully.`
      });

      setActionDialogOpen(false);
      setViewDialogOpen(false);

    } catch (error: any) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: "Failed to update application status. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const otherApplications = applications.filter(app => app.status !== 'pending');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{project.title}</h2>
          <p className="text-gray-600">Review applications for this project</p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back to Projects
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Pending Applications */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Pending Applications ({pendingApplications.length})
          </h3>
          {pendingApplications.length === 0 ? (
            <p className="text-gray-500">No pending applications to review.</p>
          ) : (
            <div className="grid gap-4">
              {pendingApplications.map(application => (
                <Card key={application.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-500" />
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {application.professional?.first_name} {application.professional?.last_name}
                          </h4>
                          {application.professional?.rating && (
                            <div className="flex items-center mt-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600 ml-1">
                                {application.professional.rating.toFixed(1)} Rating
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMessage(application)}
                        >
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Message
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewApplication(application)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <DollarSign className="w-4 h-4 mr-1" />
                          Bid Amount
                        </div>
                        <p className="font-medium">
                          ${application.bid_amount?.toLocaleString() || 'Same as project budget'}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          Availability
                        </div>
                        <p className="font-medium">
                          {application.availability || 'Not specified'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {application.proposal_message || application.cover_letter || 'No proposal provided'}
                      </p>
                    </div>

                    <div className="mt-4 flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleActionInitiate(application, 'reject')}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleActionInitiate(application, 'accept')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Accept
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Other Applications */}
        {otherApplications.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Other Applications ({otherApplications.length})
            </h3>
            <div className="grid gap-4">
              {otherApplications.map(application => (
                <Card key={application.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-500" />
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {application.professional?.first_name} {application.professional?.last_name}
                          </h4>
                          <Badge variant="outline" className="mt-1">
                            {application.status}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewApplication(application)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* View Application Dialog */}
      <ViewApplicationDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        selectedApplication={selectedApplication}
        projects={[project]}
        onAccept={(app) => {
          setViewDialogOpen(false);
          handleActionInitiate(app, 'accept');
        }}
        onReject={(app) => {
          setViewDialogOpen(false);
          handleActionInitiate(app, 'reject');
        }}
        onMessage={handleMessage}
      />

      {/* Action Confirmation Dialog */}
      <ActionConfirmationDialog
        open={actionDialogOpen}
        onOpenChange={setActionDialogOpen}
        actionType={actionType}
        isProcessing={isProcessing}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
};

export default ProjectApplicationsView; 