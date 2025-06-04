import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Project } from '@/components/dashboard/types';
import { ProjectCard } from '@/components/shared/ProjectCard';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Search } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

const ProjectMarketplace: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const { data: projectsData, error } = await supabase
          .from('projects')
          .select('*');

        if (error) {
          console.error('Error fetching projects:', error);
          return;
        }
        
        const validStatuses = ['open', 'applied', 'assigned', 'in-progress', 'submitted', 'revision', 'completed', 'paid', 'archived', 'disputed'] as const;
        
        const transformedProjects = (projectsData || []).map(project => ({
          ...project,
          client_id: project.client_id || '',
          description: project.description || '',
          category: project.category || '',
          location: project.location || '',
          expected_timeline: project.expected_timeline || '',
          urgency: project.urgency || '',
          status: validStatuses.includes(project.status as any) ? project.status : 'open' as const,
          created_at: project.created_at || new Date().toISOString(),
          updated_at: project.updated_at || new Date().toISOString()
        }));
        
        setProjects(transformedProjects);

      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold mb-4">Project Marketplace</h1>

        {/* Search Input */}
        <div className="mb-6">
          <Label htmlFor="search" className="sr-only">
            Search projects
          </Label>
          <div className="relative">
            <Input
              type="search"
              id="search"
              placeholder="Search for projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[30vh]">
            <Button variant="ghost" className="gap-2">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading projects...
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {filteredProjects.length === 0 && !isLoading && (
          <div className="text-gray-500 text-center mt-4">
            No projects found matching your search criteria.
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProjectMarketplace;

import { Loader2 } from 'lucide-react';
