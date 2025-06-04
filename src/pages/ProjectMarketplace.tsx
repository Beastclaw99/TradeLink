
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import ProjectsDisplay from '@/components/marketplace/ProjectsDisplay';
import SearchFilters from '@/components/marketplace/SearchFilters';
import { Project } from '@/types';

const ProjectMarketplace: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          client:profiles!projects_client_id_fkey(first_name, last_name)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedProjects: Project[] = (data || []).map(project => ({
        id: project.id,
        title: project.title || '',
        description: project.description,
        budget: project.budget,
        status: (project.status as Project['status']) || 'open',
        client_id: project.client_id || '',
        created_at: project.created_at || new Date().toISOString(),
        updated_at: project.updated_at || project.created_at || new Date().toISOString(),
        assigned_to: project.assigned_to,
        location: project.location,
        deadline: project.deadline,
        required_skills: project.required_skills,
        professional_id: project.professional_id,
        project_start_time: project.project_start_time,
        category: project.category,
        expected_timeline: project.expected_timeline,
        urgency: project.urgency,
        requirements: project.requirements,
        scope: project.scope,
        service_contract: project.service_contract,
        client: project.client ? {
          first_name: project.client.first_name,
          last_name: project.client.last_name
        } : undefined
      }));

      setProjects(transformedProjects);
      setFilteredProjects(transformedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: any) => {
    let filtered = projects;

    if (filters.search) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        (project.description && project.description.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }

    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(project => project.category === filters.category);
    }

    if (filters.location) {
      filtered = filtered.filter(project =>
        project.location && project.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.minBudget) {
      filtered = filtered.filter(project => project.budget && project.budget >= filters.minBudget);
    }

    if (filters.maxBudget) {
      filtered = filtered.filter(project => project.budget && project.budget <= filters.maxBudget);
    }

    setFilteredProjects(filtered);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Project Marketplace</h1>
          <p className="text-gray-600">
            Find exciting projects that match your skills and interests
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <SearchFilters onFilterChange={handleFilterChange} />
          </div>
          
          <div className="lg:w-3/4">
            <ProjectsDisplay projects={filteredProjects} loading={loading} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectMarketplace;
