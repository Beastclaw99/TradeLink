import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { notificationService } from '@/services/notificationService';
import { Database } from '@/integrations/supabase/types';

type ProjectStatus = Database['public']['Enums']['project_status_enum'];
type ApplicationStatus = Database['public']['Enums']['application_status'];

export const useProfessionalProjectActions = (userId: string, fetchDashboardData: () => void) => {
  const { toast } = useToast();
  const [isApplying, setIsApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [bidAmount, setBidAmount] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [availability, setAvailability] = useState('');

  const handleApplyToProject = async () => {
    if (!selectedProject || !bidAmount || !coverLetter) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsApplying(true);

      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('budget, status')
        .eq('id', selectedProject)
        .single();

      if (projectError) throw projectError;

      if (projectData.status !== 'open' as ProjectStatus) {
        toast({
          title: "Error",
          description: "This project is no longer accepting applications",
          variant: "destructive"
        });
        return;
      }

      if (projectData.budget && bidAmount > projectData.budget * 1.5) {
        toast({
          title: "Warning",
          description: "Your bid is significantly higher than the project budget",
          variant: "destructive"
        });
      }

      const { error: applicationError } = await supabase
        .from('applications')
        .insert({
          project_id: selectedProject,
          professional_id: userId,
          bid_amount: bidAmount,
          cover_letter: coverLetter,
          availability: availability,
          status: 'pending' as ApplicationStatus,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (applicationError) throw applicationError;

      toast({
        title: "Success",
        description: "Your application has been submitted successfully",
      });

      // Reset form
      setSelectedProject(null);
      setBidAmount(null);
      setCoverLetter('');
      setAvailability('');

      // Refresh data
      await fetchDashboardData();
    } catch (error: any) {
      console.error('Error applying to project:', error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsApplying(false);
    }
  };

  const cancelApplication = () => {
    setSelectedProject(null);
    setCoverLetter('');
    setBidAmount(null);
    setAvailability('');
  };

  return {
    isApplying,
    coverLetter,
    setCoverLetter,
    bidAmount,
    setBidAmount,
    selectedProject,
    setSelectedProject,
    availability,
    setAvailability,
    handleApplyToProject,
    cancelApplication
  };
};
