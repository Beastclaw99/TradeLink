
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Project } from '@/components/dashboard/types';

// Import the refactored components
import HeroSection from '@/components/marketplace/HeroSection';
import SearchFilters from '@/components/marketplace/SearchFilters';
import ViewModeToggle from '@/components/marketplace/ViewModeToggle';
import ProjectsDisplay from '@/components/marketplace/ProjectsDisplay';
import CTASection from '@/components/marketplace/CTASection';

const ProjectMarketplace: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchProjects();
  }, []);
  
  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      // Fix the query by specifying the exact relationship
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          client:profiles!projects_client_id_fkey(first_name, last_name)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Ensure the data is properly typed as Project[]
      const typedProjects: Project[] = data?.map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        budget: project.budget,
        status: project.status,
        created_at: project.created_at,
        client_id: project.client_id,
        assigned_to: project.assigned_to,
        client: project.client
      })) || [];
      
      setProjects(typedProjects);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Filter logic
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === "" || categoryFilter === "all"; // We'll implement category later
    const matchesLocation = locationFilter === "" || locationFilter === "all"; // We'll implement location later
    let matchesBudget = true;
    
    if (budgetFilter === "under5k") {
      matchesBudget = project.budget !== null && project.budget < 5000;
    } else if (budgetFilter === "5k-10k") {
      matchesBudget = project.budget !== null && project.budget >= 5000 && project.budget <= 10000;
    } else if (budgetFilter === "over10k") {
      matchesBudget = project.budget !== null && project.budget > 10000;
    }
    
    return matchesSearch && matchesCategory && matchesLocation && matchesBudget;
  });

  const handlePostProject = () => {
    if (user) {
      navigate('/dashboard', { state: { activeTab: 'create' } });
    } else {
      navigate('/post-job');
    }
  };
  
  return (
    <Layout>
      <HeroSection onPostProject={handlePostProject} />
      
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <SearchFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            locationFilter={locationFilter}
            setLocationFilter={setLocationFilter}
            budgetFilter={budgetFilter}
            setBudgetFilter={setBudgetFilter}
            onFilterApply={fetchProjects}
          />
          
          <ViewModeToggle 
            viewMode={viewMode} 
            setViewMode={setViewMode} 
            projectCount={filteredProjects.length} 
          />
          
          <ProjectsDisplay 
            projects={filteredProjects} 
            loading={loading} 
            viewMode={viewMode} 
          />
        </div>
      </section>

      <CTASection onPostProject={handlePostProject} />
    </Layout>
  );
};

export default ProjectMarketplace;
