import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/components/dashboard/types';
import { Application } from '@/components/dashboard/types';

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalApplications: number;
  totalEarnings: number;
  averageRating: number;
}

interface Activity {
  id: string;
  type: 'project' | 'application' | 'payment' | 'review' | 'message' | 'alert';
  title: string;
  description: string;
  timestamp: string;
  link?: string;
}

interface ProfessionalDashboardData {
  projects: Project[];
  applications: Application[];
  stats: DashboardStats;
  recentActivity: Activity[];
  profileData: any;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

export const useProfessionalDashboard = (professionalId: string): ProfessionalDashboardData => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalApplications: 0,
    totalEarnings: 0,
    averageRating: 0
  });
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [profileData, setProfileData] = useState<any>(null);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch professional profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', professionalId)
        .single();

      if (profileError) throw profileError;
      setProfileData(profile);

      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('professional_id', professionalId)
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;
      setProjects(projectsData || []);

      // Fetch applications
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('applications')
        .select('*')
        .eq('professional_id', professionalId)
        .order('created_at', { ascending: false });

      if (applicationsError) throw applicationsError;
      setApplications(applicationsData || []);

      // Calculate stats
      const totalProjects = projectsData?.length || 0;
      const activeProjects = projectsData?.filter(p => p.status === 'in_progress').length || 0;
      const completedProjects = projectsData?.filter(p => p.status === 'completed').length || 0;
      const totalApplications = applicationsData?.length || 0;

      // Calculate total earnings
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('amount')
        .eq('professional_id', professionalId)
        .eq('status', 'completed');

      if (paymentsError) throw paymentsError;
      const totalEarnings = payments?.reduce((sum, p) => sum + p.amount, 0) || 0;

      // Calculate average rating
      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('rating')
        .eq('professional_id', professionalId);

      if (reviewsError) throw reviewsError;
      const averageRating = reviews?.length
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

      setStats({
        totalProjects,
        activeProjects,
        completedProjects,
        totalApplications,
        totalEarnings,
        averageRating
      });

      // Fetch recent activity
      const { data: activityData, error: activityError } = await supabase
        .from('activity_log')
        .select('*')
        .eq('user_id', professionalId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (activityError) throw activityError;
      setRecentActivity(activityData || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load dashboard data');
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (professionalId) {
      fetchDashboardData();
    }
  }, [professionalId]);

  return {
    projects,
    applications,
    stats,
    recentActivity,
    profileData,
    isLoading,
    error,
    refreshData: fetchDashboardData
  };
};
