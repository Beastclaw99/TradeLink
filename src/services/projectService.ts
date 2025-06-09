
import { supabase } from '@/integrations/supabase/client';

export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: 'client' | 'professional';
  created_at: string;
}

export const getProjectMembers = async (projectId: string): Promise<ProjectMember[]> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        id,
        client_id,
        professional_id,
        assigned_to
      `)
      .eq('id', projectId)
      .single();

    if (error) throw error;

    const members: ProjectMember[] = [];
    
    if (data.client_id) {
      members.push({
        id: data.client_id,
        project_id: projectId,
        user_id: data.client_id,
        role: 'client',
        created_at: new Date().toISOString()
      });
    }

    if (data.professional_id || data.assigned_to) {
      const professionalId = data.professional_id || data.assigned_to;
      members.push({
        id: professionalId,
        project_id: projectId,
        user_id: professionalId,
        role: 'professional',
        created_at: new Date().toISOString()
      });
    }

    return members;
  } catch (error) {
    console.error('Error fetching project members:', error);
    return [];
  }
};
