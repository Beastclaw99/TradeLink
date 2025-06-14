import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatDate } from '@/utils/dateUtils';

// Type that matches the actual database schema
interface DatabaseProjectWithClient {
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
  client: {
    first_name: string | null;
    last_name: string | null;
  } | null;
}

// Helper function to convert database project to expected Project type
const convertToProjectType = (dbProject: DatabaseProjectWithClient): any => ({
  ...dbProject,
  urgency: dbProject.urgency as 'high' | 'low' | 'normal' | null,
  recommended_skills: dbProject.requirements || [],
  project_start_time: null,
  rich_description: null,
  service_contract: null,
  client: dbProject.client,
  spent: dbProject.spent || 0,
  milestones: [],
  updates: [],
  applications: [],
  reviews: [],
  disputes: [],
  invoices: [],
  messages: [],
  notifications: []
});

const ProfessionalProjectMarketplace: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");
  const [rawProjects, setRawProjects] = useState<DatabaseProjectWithClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [userSkills, setUserSkills] = useState<string[]>([]);

  // Convert projects to expected format
  const projects = rawProjects.map(convertToProjectType);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Fetch user's skills
    const fetchUserSkills = async () => {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('skills')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user skills:', error);
        return;
      }

      if (profile?.skills) {
        setUserSkills(profile.skills);
      }
    };

    fetchUserSkills();
    fetchProjects();
  }, [user, navigate]);

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
      
      console.log('Fetched projects for professional marketplace:', data);
      setRawProjects(data as DatabaseProjectWithClient[] || []);
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

    // Filter by matching skills if user has skills
    let matchesSkills = true;
    if (userSkills.length > 0 && project.recommended_skills) {
      const projectSkills = Array.isArray(project.recommended_skills) 
        ? project.recommended_skills 
        : JSON.parse(project.recommended_skills) as string[];
      const hasMatchingSkills = projectSkills.some(skill => userSkills.includes(skill));
      if (!hasMatchingSkills) return false;
    }
    
    return matchesSearch && matchesCategory && matchesLocation && matchesBudget && matchesSkills;
  });

  const formatBudget = (budget: number | null | undefined) => {
    if (budget === null || budget === undefined) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(budget);
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <Layout>
      <section className="bg-ttc-blue-800 py-12 text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Available Projects</h1>
            <p className="text-lg mb-6">Browse and apply to projects that match your skills and expertise</p>
          </div>
        </div>
      </section>
      
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:col-span-2"
            />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="construction">Construction</SelectItem>
                <SelectItem value="electrical">Electrical</SelectItem>
                <SelectItem value="plumbing">Plumbing</SelectItem>
                <SelectItem value="hvac">HVAC</SelectItem>
                <SelectItem value="landscaping">Landscaping</SelectItem>
              </SelectContent>
            </Select>
            <Select value={budgetFilter} onValueChange={setBudgetFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Budget Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Budgets</SelectItem>
                <SelectItem value="under5k">Under $5,000</SelectItem>
                <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                <SelectItem value="over10k">Over $10,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const projectSkills = project.recommended_skills ? 
                (Array.isArray(project.recommended_skills) 
                  ? project.recommended_skills 
                  : JSON.parse(project.recommended_skills) as string[]) 
                : [];
              
              return (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{project.title}</CardTitle>
                    <CardDescription>
                      Posted {formatDate(project.created_at)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {project.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Budget:</span>
                          <p className="text-gray-600">
                            {project.budget ? `$${project.budget.toLocaleString()}` : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium">Timeline:</span>
                          <p className="text-gray-600">{project.timeline || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="font-medium">Location:</span>
                          <p className="text-gray-600">{project.location || 'Remote'}</p>
                        </div>
                        <div>
                          <span className="font-medium">Status:</span>
                          <p className="text-gray-600">{project.status || 'Open'}</p>
                        </div>
                      </div>
                      {projectSkills.length > 0 && (
                        <div>
                          <span className="text-sm font-medium">Required Skills:</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {projectSkills.map((skill) => (
                              <Badge key={skill} variant="outline">
                                <span>{skill}</span>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={() => handleProjectClick(project.id)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProfessionalProjectMarketplace;
