import { supabase } from '@/integrations/supabase/client';
import { ProfileData } from '@/components/profile/types';
import { useToast } from '@/components/ui/use-toast';

export const updateProfile = async (
  userId: string,
  updates: Partial<ProfileData>,
  toast: ReturnType<typeof useToast>['toast']
): Promise<boolean> => {
  try {
    // Validate required fields
    if (updates.first_name && !updates.first_name.trim()) {
      toast({
        title: "Error",
        description: "First name cannot be empty",
        variant: "destructive"
      });
      return false;
    }

    if (updates.last_name && !updates.last_name.trim()) {
      toast({
        title: "Error",
        description: "Last name cannot be empty",
        variant: "destructive"
      });
      return false;
    }

    // Validate email format if provided
    if (updates.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) {
      toast({
        title: "Error",
        description: "Invalid email format",
        variant: "destructive"
      });
      return false;
    }

    // Validate phone format if provided
    if (updates.phone && !/^\+?[\d\s-]{10,}$/.test(updates.phone)) {
      toast({
        title: "Error",
        description: "Invalid phone number format",
        variant: "destructive"
      });
      return false;
    }

    // Validate hourly rate if provided
    if (updates.hourly_rate !== undefined && updates.hourly_rate !== null) {
      if (isNaN(updates.hourly_rate) || updates.hourly_rate < 0) {
        toast({
          title: "Error",
          description: "Hourly rate must be a positive number",
          variant: "destructive"
        });
        return false;
      }
    }

    // Update profile in database
    const { error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw error;

    toast({
      title: "Success",
      description: "Profile updated successfully"
    });

    return true;
  } catch (error: any) {
    console.error('Error updating profile:', error);
    toast({
      title: "Error",
      description: error.message || "Failed to update profile",
      variant: "destructive"
    });
    return false;
  }
};

export const fetchProfile = async (
  userId: string,
  toast: ReturnType<typeof useToast>['toast']
): Promise<ProfileData | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    if (!data) {
      toast({
        title: "Error",
        description: "Profile not found",
        variant: "destructive"
      });
      return null;
    }

    return data as ProfileData;
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    toast({
      title: "Error",
      description: error.message || "Failed to fetch profile",
      variant: "destructive"
    });
    return null;
  }
}; 