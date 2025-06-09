import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Application } from '../types';
import { supabase } from '@/integrations/supabase/client';
import ApplicationStatusTracker from './enhanced/ApplicationStatusTracker';
import ViewApplicationDialog from './applications/ViewApplicationDialog';
import WithdrawApplicationDialog from './applications/WithdrawApplicationDialog';
import { useApplications } from './applications/useApplications';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ApplicationsTabProps {
  isLoading: boolean;
  applications: Application[];
  professionalId: string;
}

const ApplicationsTab: React.FC<ApplicationsTabProps> = ({ isLoading, applications, professionalId }) => {
  const { toast } = useToast();
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    localApplications, 
    localIsLoading, 
    updateLocalApplications 
  } = useApplications(applications || [], isLoading);
  
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
      setError(null);
      
      const { error } = await supabase
        .from('applications')
        .update({ status: 'withdrawn' })
        .eq('id', selectedApplication.id)
        .eq('professional_id', professionalId);
      
      if (error) throw error;
      
      toast({
        title: "Application Withdrawn",
        description: "Your application has been withdrawn successfully."
      });
      
      setWithdrawDialogOpen(false);
      
      // Update the local application state
      const updatedApplications = localApplications.map(app => {
        if (app.id === selectedApplication.id) {
          return { ...app, status: 'withdrawn' };
        }
        return app;
      });
      
      updateLocalApplications(updatedApplications);
      
    } catch (error: any) {
      console.error('Error withdrawing application:', error);
      setError(error.message || 'Failed to withdraw application');
      toast({
        title: "Error",
        description: "Failed to withdraw application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <p className="text-muted-foreground">No applications found.</p>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <div key={application.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold">{application.project.title}</h3>
                  <p className="text-sm text-muted-foreground">{application.project.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm">
                        Status:{' '}
                        <span className="font-medium capitalize">{application.status}</span>
                      </p>
                      <p className="text-sm">
                        Applied:{' '}
                        <span className="font-medium">
                          {new Date(application.created_at).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                    {application.status === 'pending' && (
                      <Button
                        variant="destructive"
                        onClick={() => handleWithdrawApplication()}
                      >
                        Withdraw Application
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Dialogs */}
      <ViewApplicationDialog 
        open={viewDialogOpen} 
        onOpenChange={setViewDialogOpen}
        application={selectedApplication}
        onWithdraw={handleWithdrawInitiate}
      />
      
      <WithdrawApplicationDialog 
        open={withdrawDialogOpen} 
        onOpenChange={setWithdrawDialogOpen}
        isProcessing={isProcessing}
        onConfirm={handleWithdrawApplication}
      />
    </div>
  );
};

export default ApplicationsTab;
