import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Application } from '../types';
import ApplicationCard from '@/components/shared/cards/ApplicationCard';

interface ApplicationsTabProps {
  isLoading: boolean;
  applications: Application[];
  userId: string;
}

export const ApplicationsTab: React.FC<ApplicationsTabProps> = ({
  isLoading,
  applications,
  userId
}) => {
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleWithdraw = async () => {
    if (!selectedApplication) return;

    try {
      setIsSubmitting(true);

      // Check if the application is still pending
      const { data: currentApplication, error: fetchError } = await supabase
        .from('applications')
        .select('status')
        .eq('id', selectedApplication.id)
        .single();

      if (fetchError) throw fetchError;

      if (currentApplication.status !== 'pending') {
        toast({
          title: "Cannot Withdraw",
          description: "This application can no longer be withdrawn as it has already been processed.",
          variant: "destructive"
        });
        return;
      }

      // Update application status
      const { error: updateError } = await supabase
        .from('applications')
        .update({
          status: 'withdrawn',
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedApplication.id);

      if (updateError) throw updateError;

      toast({
        title: "Application Withdrawn",
        description: "Your application has been successfully withdrawn."
      });

      setIsWithdrawDialogOpen(false);
      setSelectedApplication(null);
      // Note: onUpdate removed as it's not needed in this refactored version
      window.location.reload(); // Simple refresh for now
    } catch (error: any) {
      console.error('Error withdrawing application:', error);
      toast({
        title: "Error",
        description: "Failed to withdraw application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'default';
      case 'accepted':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'withdrawn':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">You haven't submitted any applications yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              project={application.project}
              isProfessional={true}
              onWithdraw={() => {
                setSelectedApplication(application);
                setIsWithdrawDialogOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to withdraw your application for "{selectedApplication?.project?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsWithdrawDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleWithdraw}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Withdrawing...' : 'Withdraw Application'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationsTab;
