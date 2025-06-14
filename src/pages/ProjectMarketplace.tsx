
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Import the refactored components
import HeroSection from '@/components/marketplace/HeroSection';
import SearchFilters from '@/components/marketplace/SearchFilters';
import ViewModeToggle from '@/components/marketplace/ViewModeToggle';
import ProjectsDisplay from '@/components/marketplace/ProjectsDisplay';
import CTASection from '@/components/marketplace/CTASection';

// Type that matches the actual database schema
type DatabaseProject = {
  id: string;
  title: string;
  description: string | null;
  client_id: string | null;
  professional_id: string | null;
  status: string | null;
  budget: number | null;
  timeline: string | null;
  location: string | null;
  category: string | null;
  urgency: string | null;
  created_at: string | null;
  updated_at: string | null;
  assigned_to: string | null;
  deadline: string | null;
  spent: number | null;
  requirements: string[] | null;
  recommended_skills: string[] | null;
  rich_description: string | null;
  scope: string | null;
  industry_specific_fields: any;
  location_coordinates: any;
  project_start_time: string | null;
  service_contract: string | null;
  contract_template_id: string | null;
  sla_terms: any;
  client?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    profile_image_url: string | null;
    rating: number | null;
    completed_projects: number | null;
  };
  professional?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    profile_image_url: string | null;
    rating: number | null;
    completed_projects: number | null;
  };
};

// Helper function to convert database project to expected Project type
const convertToProjectType = (dbProject: DatabaseProject): any => ({
  ...dbProject,
  expected_timeline: dbProject.timeline, // Map timeline to expected_timeline
  milestones: [],
  tasks: [],
  updates: [],
  applications: [],
  reviews: [],
  disputes: [],
  payments: [],
  invoices: [],
  project_messages: [],
  notifications: []
});

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
  const [rawProjects, setRawProjects] = useState<DatabaseProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<'professional' | 'client' | null>(null);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  
  // Convert projects to expected format
  const projects = rawProjects.map(convertToProjectType);

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
      
      // First fetch the projects with client and professional info
      let query = supabase
        .from('projects')
        .select(`
          *,
          client:profiles!projects_client_id_fkey(
            id,
            first_name,
            last_name,
            profile_image_url,
            rating,
            completed_projects
          ),
          professional:profiles!projects_professional_id_fkey(
            id,
            first_name,
            last_name,
            profile_image_url,
            rating,
            completed_projects
          )
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
      
      const { data: projectsData, error: projectsError } = await query;
        
      if (projectsError) throw projectsError;

      console.log('Fetched projects:', projectsData);
      setRawProjects(projectsData || []);
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
    navigate('/projects/new');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <HeroSection onPostProject={handlePostProject} />
        
        <div className="mt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
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
          </div>
          
          <ProjectsDisplay
            projects={filteredProjects}
            loading={loading}
            viewMode={viewMode}
            userType={userType || 'client'}
            userSkills={userSkills}
          />
        </div>
        
        <CTASection onPostProject={handlePostProject} />
      </div>
    </Layout>
  );
};

export default ProjectMarketplace;
