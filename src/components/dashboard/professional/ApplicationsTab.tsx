
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Eye, X } from "lucide-react";
import { Application } from '../types';
import { Link } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';

interface ApplicationsTabProps {
  isLoading: boolean;
  applications: Application[];
  userId: string;
}

const ApplicationsTab: React.FC<ApplicationsTabProps> = ({ isLoading, applications, userId }) => {
  const { toast } = useToast();
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
    setViewDialogOpen(true);
  };
  
  const handleWithdrawInitiate = (application: Application) => {
    setSelectedApplication(application);
    setWithdrawDialogOpen(true);
  };
  
  const handleWithdrawApplication = async () => {
    if (!selectedApplication) return;
    
    try {
      setIsProcessing(true);
      
      const { error } = await supabase
        .from('applications')
        .update({ status: 'withdrawn' })
        .eq('id', selectedApplication.id)
        .eq('professional_id', userId);
      
      if (error) throw error;
      
      toast({
        title: "Application Withdrawn",
        description: "Your application has been withdrawn successfully."
      });
      
      setWithdrawDialogOpen(false);
      
      // Update the local application state
      const updatedApplications = applications.map(app => {
        if (app.id === selectedApplication.id) {
          return { ...app, status: 'withdrawn' };
        }
        return app;
      });
      
      // This will trigger a re-render with updated data
      // The parent component should handle fetching updated applications
      
    } catch (error: any) {
      console.error('Error withdrawing application:', error);
      toast({
        title: "Error",
        description: "Failed to withdraw application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const getStatusBadgeClass = (status: string | null) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Your Applications</h2>
      {isLoading ? (
        <p>Loading your applications...</p>
      ) : applications.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 mx-auto text-ttc-neutral-400" />
          <p className="mt-4 text-ttc-neutral-600">You haven't applied to any projects yet.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              const featuredTab = document.querySelector('[data-value="featured"]');
              if (featuredTab) {
                (featuredTab as HTMLElement).click();
              }
            }}
          >
            Browse Available Projects
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Applied On</TableHead>
              <TableHead>Your Bid</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map(app => (
              <TableRow key={app.id}>
                <TableCell className="font-medium">
                  <Link to={`/projects/${app.project_id}`} className="text-ttc-blue-700 hover:underline">
                    {app.project?.title || 'Unknown Project'}
                  </Link>
                </TableCell>
                <TableCell>{new Date(app.created_at || '').toLocaleDateString()}</TableCell>
                <TableCell>${app.bid_amount || app.project?.budget || 'N/A'}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(app.status)}`}>
                    {app.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={() => handleViewApplication(app)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {app.status === 'pending' && (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 hover:bg-red-50" 
                        onClick={() => handleWithdrawInitiate(app)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
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
                <p>{selectedApplication.project?.title}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(selectedApplication.status)}`}>
                  {selectedApplication.status}
                </span>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Your Bid</h3>
                <p>${selectedApplication.bid_amount || selectedApplication.project?.budget || 'N/A'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Your Proposal</h3>
                <p className="text-sm whitespace-pre-wrap">{selectedApplication.proposal_message || selectedApplication.cover_letter || 'No proposal provided'}</p>
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
              <Button 
                variant="destructive" 
                onClick={() => {
                  setViewDialogOpen(false);
                  handleWithdrawInitiate(selectedApplication);
                }}
              >
                Withdraw Application
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Withdraw Confirmation Dialog */}
      <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to withdraw your application? This action cannot be undone, but you can reapply to the project.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setWithdrawDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={handleWithdrawApplication}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Withdraw Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApplicationsTab;
