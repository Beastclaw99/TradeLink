import { supabase } from '@/integrations/supabase/client';

export interface ProjectMember {
  id: string;
  role: 'client' | 'professional';
  user_id: string;
  project_id: string;
  created_at: string;
}

export async function getProjectMembers(projectId: string): Promise<ProjectMember[]> {
  const { data, error } = await supabase
    .from('project_members')
    .select('*')
    .eq('project_id', projectId);

  if (error) {
    console.error('Error fetching project members:', error);
    throw error;
  }

  return data || [];
} 