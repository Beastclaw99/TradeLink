
export const filterProjectsBySkills = (projects: any[], userSkills: string[]): any[] => {
  if (userSkills.length === 0) {
    return projects || [];
  }

  return projects.filter((project: any) => {
    if (!project) return false;
    
    const projTags = project.tags || [];
    const projectTitle = project.title || '';
    const projectDescription = project.description || '';
    
    return userSkills.some((skill: string) => {
      if (!skill) return false;
      
      const skillLower = skill.toLowerCase();
      return (
        projTags.includes(skill) || 
        projectTitle.toLowerCase().includes(skillLower) ||
        projectDescription.toLowerCase().includes(skillLower)
      );
    });
  });
};
