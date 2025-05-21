
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X, Eye } from "lucide-react";
import { Application } from '../types';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogDescription
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Link } from 'react-router-dom';

interface ApplicationsTabProps {
  isLoading: boolean;
  projects: any[];
  applications: Application[];
  handleApplicationUpdate: (
    applicationId: string, 
    newStatus: string, 
    projectId: string, 
    professionalId: string
  ) => Promise<void>;
}

const ApplicationsTab: React.FC<ApplicationsTabProps> = ({ 
  isLoading, 
  projects, 
  applications, 
  handleApplicationUpdate 
}) => {
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
  
  const handleConfirmAction = async () => {
    if (!selectedApplication || !actionType) return;
    
    setIsProcessing(true);
    
    try {
      const newStatus = actionType === 'accept' ? 'accepted' : 'rejected';
      
      await handleApplicationUpdate(
        selectedApplication.id,
        newStatus,
        selectedApplication.project_id || '',
        selectedApplication.professional_id || ''
      );
      
      setActionDialogOpen(false);
      setActionType(null);
      
      toast({
        title: actionType === 'accept' ? "Application Accepted" : "Application Rejected",
        description: actionType === 'accept' 
          ? "The professional has been assigned to this project."
          : "The application has been rejected."
      });
      
    } catch (error) {
      console.error('Error processing application:', error);
      toast({
        title: "Error",
        description: "Failed to process the application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Applications to Your Projects</h2>
      {isLoading ? (
        <p>Loading applications...</p>
      ) : applications.filter(app => app.status === 'pending').length === 0 ? (
        <div className="text-center py-8">
          <p className="text-ttc-neutral-600">No pending applications at the moment.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Applicant</TableHead>
              <TableHead>Bid Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications
              .filter(app => app.status === 'pending')
              .map(app => {
                const project = projects.find(p => p.id === app.project_id);
                // Only show applications for projects that are still open
                if (!project || project.status !== 'open') return null;
                
                return (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">
                      <Link to={`/projects/${app.project_id}`} className="text-ttc-blue-700 hover:underline">
                        {project?.title || 'Unknown Project'}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {app.professional ? (
                        <Link to={`/professionals/${app.professional_id}`} className="text-ttc-blue-700 hover:underline">
                          {`${app.professional.first_name} ${app.professional.last_name}`}
                        </Link>
                      ) : (
                        'Unknown Applicant'
                      )}
                    </TableCell>
                    <TableCell>
                      ${app.bid_amount || project?.budget || 'N/A'}
                      {app.bid_amount && project?.budget && app.bid_amount < project.budget && (
                        <span className="ml-2 text-green-600 text-xs">
                          (${project.budget - app.bid_amount} less)
                        </span>
                      )}
                      {app.bid_amount && project?.budget && app.bid_amount > project.budget && (
                        <span className="ml-2 text-amber-600 text-xs">
                          (${app.bid_amount - project.budget} more)
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleViewApplication(app)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                          onClick={() => handleActionInitiate(app, 'accept')}
                        >
                          <Check className="w-4 h-4 mr-1" /> Accept
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                          onClick={() => handleActionInitiate(app, 'reject')}
                        >
                          <X className="w-4 h-4 mr-1" /> Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      )}
      
      <h2 className="text-2xl font-bold mb-4 mt-8">Past Applications</h2>
      {applications.filter(app => app.status !== 'pending').length === 0 ? (
        <div className="text-center py-8">
          <p className="text-ttc-neutral-600">No past applications.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Applicant</TableHead>
              <TableHead>Bid Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications
              .filter(app => app.status !== 'pending')
              .map(app => {
                const project = projects.find(p => p.id === app.project_id);
                
                return (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">
                      <Link to={`/projects/${app.project_id}`} className="text-ttc-blue-700 hover:underline">
                        {project?.title || 'Unknown Project'}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {app.professional ? (
                        <Link to={`/professionals/${app.professional_id}`} className="text-ttc-blue-700 hover:underline">
                          {`${app.professional.first_name} ${app.professional.last_name}`}
                        </Link>
                      ) : (
                        'Unknown Applicant'
                      )}
                    </TableCell>
                    <TableCell>${app.bid_amount || project?.budget || 'N/A'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        app.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                        app.status === 'withdrawn' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {app.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleViewApplication(app)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      )}
      
      {/* View Application Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          
          {selectedApplication && (
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
                <span className={`px-2 py-1 text-xs rounded-full ${
                  selectedApplication.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                  selectedApplication.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                  selectedApplication.status === 'withdrawn' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
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
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>Close</Button>
            {selectedApplication && selectedApplication.status === 'pending' && (
              <>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setViewDialogOpen(false);
                    handleActionInitiate(selectedApplication, 'accept');
                  }}
                >
                  Accept
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => {
                    setViewDialogOpen(false);
                    handleActionInitiate(selectedApplication, 'reject');
                  }}
                >
                  Reject
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
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
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>Cancel</Button>
            <Button 
              className={actionType === 'accept' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              onClick={handleConfirmAction}
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
    </>
  );
};

export default ApplicationsTab;
