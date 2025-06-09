import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Project } from '@/types/project';

// Import the refactored components
import HeroSection from '@/components/marketplace/HeroSection';
import SearchFilters from '@/components/marketplace/SearchFilters';
import ViewModeToggle from '@/components/marketplace/ViewModeToggle';
import ProjectsDisplay from '@/components/marketplace/ProjectsDisplay';
import CTASection from '@/components/marketplace/CTASection';

const ProjectMarketplace: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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
    
    // Show success message if redirected from project creation
    if (location.state?.message) {
      toast({
        title: "Success",
        description: location.state.message
      });
    }
  }, [location.state, toast]);
  
  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      console.log('Fetching projects from database...');
      
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          client:profiles!projects_client_id_fkey(first_name, last_name, profile_image)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      
      console.log('Fetched projects:', data);
      
      // Ensure the data is properly typed as Project[]
      const typedProjects: Project[] = data?.map(project => ({
        id: project.id,
        client_id: project.client_id,
        title: project.title,
        description: project.description,
        category: project.category,
        location: project.location,
        budget: project.budget,
        timeline: project.timeline,
        urgency: project.urgency,
        requirements: project.requirements,
        skills_needed: project.skills_needed,
        status: project.status,
        assigned_to: project.assigned_to,
        professional_id: project.professional_id,
        payment_id: project.payment_id,
        payment_status: project.payment_status,
        payment_required: project.payment_required,
        payment_due_date: project.payment_due_date,
        created_at: project.created_at,
        updated_at: project.updated_at,
        client: project.client
      }));
      
      setProjects(typedProjects);
      console.log('Projects state updated with:', typedProjects.length, 'projects');
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
                          (project.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesCategory = categoryFilter === "" || categoryFilter === "all" || 
                           (project.category?.toLowerCase() === categoryFilter.toLowerCase() || false);
    
    const matchesLocation = locationFilter === "" || locationFilter === "all" || 
                           (project.location?.toLowerCase().includes(locationFilter.toLowerCase()) || false);
    
    let matchesBudget = true;
    const projectBudget = project.budget;
    if (projectBudget !== null && typeof projectBudget === 'number') {
      if (budgetFilter === "under5k") {
        matchesBudget = projectBudget < 5000;
      } else if (budgetFilter === "5k-10k") {
        matchesBudget = projectBudget >= 5000 && projectBudget <= 10000;
      } else if (budgetFilter === "over10k") {
        matchesBudget = projectBudget > 10000;
      }
    }
    
    return matchesSearch && matchesCategory && matchesLocation && matchesBudget;
  });

  const handlePostProject = () => {
    if (user) {
      navigate('/client/create-project');
    } else {
      navigate('/login');
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
