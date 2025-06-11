import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<'professional' | 'client' | null>(null);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Fetch user type and skills
    const fetchUserData = async () => {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('account_type, skills')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
        return;
      }

      setUserType(profile.account_type);
      if (profile.skills) {
        setUserSkills(profile.skills);
      }
    };

    fetchUserData();
    fetchProjects();
    
    // Show success message if redirected from project creation
    if (location.state?.message) {
      toast({
        title: "Success",
        description: location.state.message
      });
    }
  }, [location.state, toast, user, navigate]);
  
  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('projects')
        .select(`
          *,
          client:profiles!projects_client_id_fkey(
            first_name,
            last_name,
            profile_image,
            rating,
            total_reviews
          ),
          milestones:project_milestones(*),
          deliverables:project_deliverables(*),
          applications:project_applications(*)
        `)
        .eq('status', 'open');

      // Apply filters if they exist
      if (categoryFilter && categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }

      if (locationFilter && locationFilter !== 'all') {
        query = query.ilike('location', `%${locationFilter}%`);
      }

      if (budgetFilter && budgetFilter !== 'any') {
        switch (budgetFilter) {
          case 'under5k':
            query = query.lt('budget', 5000);
            break;
          case '5k-10k':
            query = query.gte('budget', 5000).lte('budget', 10000);
            break;
          case 'over10k':
            query = query.gt('budget', 10000);
            break;
        }
      }

      // Add sorting
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
        
      if (error) throw error;
      
      const typedProjects: Project[] = data?.map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        category: project.category,
        budget: project.budget,
        expected_timeline: project.expected_timeline,
        location: project.location,
        urgency: project.urgency,
        requirements: project.requirements,
        recommended_skills: project.recommended_skills,
        status: project.status,
        created_at: project.created_at,
        updated_at: project.updated_at,
        client_id: project.client_id,
        assigned_to: project.assigned_to,
        professional_id: project.professional_id,
        contract_template_id: project.contract_template_id,
        deadline: project.deadline,
        industry_specific_fields: project.industry_specific_fields,
        location_coordinates: project.location_coordinates,
        project_start_time: project.project_start_time,
        rich_description: project.rich_description,
        scope: project.scope,
        service_contract: project.service_contract,
        sla_terms: project.sla_terms,
        client: project.client,
        milestones: project.milestones,
        deliverables: project.deliverables,
        applications: project.applications
      })) || [];
      
      setProjects(typedProjects);
    } catch (error) {
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
    if (!user) {
      navigate('/login');
      return;
    }

    if (userType === 'client') {
      navigate('/client/create-project');
    } else {
      toast({
        title: "Access Denied",
        description: "Only clients can post new projects.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Layout>
      <HeroSection 
        onPostProject={handlePostProject}
        title={userType === 'professional' ? "Find Projects" : "Project Marketplace"}
        description={userType === 'professional' 
          ? "Browse and apply to projects that match your skills and expertise"
          : "Browse available projects or post your own project to find the right professional"
        }
        showPostButton={userType === 'client'}
      />
      
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
            userType={userType}
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
            userType={userType}
            userSkills={userSkills}
          />
        </div>
      </section>

      {userType === 'client' && (
        <CTASection onPostProject={handlePostProject} />
      )}
    </Layout>
  );
};

export default ProjectMarketplace;
