import { Database } from '@/integrations/supabase/types';

type Project = Database['public']['Tables']['projects']['Row'];

export const filterProjectsBySkills = (projects: Project[], userSkills: string[]): Project[] => {
  if (userSkills.length === 0) {
    return projects || [];
  }

  return projects.filter((project) => {
    if (!project) return false;
    
    const projectTitle = project.title || '';
    const projectDescription = project.description || '';
    const projectRequirements = project.requirements || [];
    
    return userSkills.some((skill) => {
      if (!skill) return false;
      
      const skillLower = skill.toLowerCase();
      return (
        projectRequirements.includes(skill) || 
        projectTitle.toLowerCase().includes(skillLower) ||
        projectDescription.toLowerCase().includes(skillLower)
      );
    });
  });
};
