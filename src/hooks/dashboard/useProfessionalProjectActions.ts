
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useProfessionalProjectActions = (userId: string, fetchDashboardData: () => void) => {
  const { toast } = useToast();
  const [isApplying, setIsApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [bidAmount, setBidAmount] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [availability, setAvailability] = useState('');

  const handleApplyToProject = async () => {
    if (!selectedProject || !coverLetter.trim() || bidAmount === null) {
      toast({
        title: "Missing information",
        description: "Please provide both a bid amount and proposal message",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsApplying(true);
      
      // Check if project is still open before applying
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('status')
        .eq('id', selectedProject)
        .single();
        
      if (projectError) throw projectError;
      
      if (projectData.status !== 'open') {
        toast({
          title: "Project Unavailable",
          description: "This project is no longer accepting applications.",
          variant: "destructive"
        });
        setSelectedProject(null);
        setCoverLetter('');
        setBidAmount(null);
        setAvailability('');
        return;
      }
      
      const { data, error } = await supabase
        .from('applications')
        .insert([
          {
            project_id: selectedProject,
            professional_id: userId,
            cover_letter: coverLetter,
            bid_amount: bidAmount,
            proposal_message: coverLetter,
            availability: availability,
            status: 'pending'
          }
        ])
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully!"
      });
      
      // Reset form
      setCoverLetter('');
      setSelectedProject(null);
      setBidAmount(null);
      setAvailability('');
      
      // Refresh data
      fetchDashboardData();
      
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
