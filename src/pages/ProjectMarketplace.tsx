
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types';
import { Loader2 } from 'lucide-react';
import SearchFilters from '@/components/marketplace/SearchFilters';
import ProjectsDisplay from '@/components/marketplace/ProjectsDisplay';

const ProjectMarketplace: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

      // Transform projects with proper typing
      const validStatuses = ['open', 'applied', 'assigned', 'in-progress', 'submitted', 'revision', 'completed', 'paid', 'archived', 'disputed'] as const;
      
      const transformedProjects: Project[] = (data || []).map(project => ({
        ...project,
        client_id: project.client_id || null, // Handle null client_id from database
        status: validStatuses.includes(project.status as any) ? project.status as Project['status'] : 'open',
        created_at: project.created_at || new Date().toISOString(),
        updated_at: project.updated_at || project.created_at || new Date().toISOString(),
        client: project.client || null // Handle null client from database
      }));

      setProjects(transformedProjects);
      setFilteredProjects(transformedProjects);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleFilterChange = (filters: any) => {
    let filtered = [...projects];

    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(project => project.category === filters.category);
    }

    if (filters.budgetRange) {
      const [min, max] = filters.budgetRange;
      filtered = filtered.filter(project => {
        const budget = project.budget || 0;
        return budget >= min && budget <= max;
      });
    }

    if (filters.location) {
      filtered = filtered.filter(project => 
        project.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.search) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        project.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredProjects(filtered);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600">
            Error loading projects: {error}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Project Marketplace
          </h1>
          <p className="text-gray-600">
            Discover and apply to projects that match your skills.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <SearchFilters 
              onFilterChange={handleFilterChange}
            />
          </div>
          
          <div className="lg:col-span-3">
            <ProjectsDisplay 
              projects={filteredProjects}
              loading={loading}
              viewMode={viewMode}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectMarketplace;
