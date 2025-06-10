
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useProfessionalProfileActions = (userId: string, fetchDashboardData: () => void) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateProfile = async (data: { 
    skills?: string[];
    hourly_rate?: number;
    availability?: string;
    bio?: string;
    location?: string;
    show_email?: boolean;
    show_phone?: boolean;
    allow_messages?: boolean;
  }) => {
    try {
      setIsSubmitting(true);
      
      // Update profile with all provided fields
      const { data: updatedProfileInfo, error: profileUpdateError } = await supabase
        .from('profiles')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();
      
      if (profileUpdateError) throw profileUpdateError;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully!",
      });
      
      setIsEditing(false);
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isEditing,
    setIsEditing,
    isSubmitting,
    updateProfile
  };
};
