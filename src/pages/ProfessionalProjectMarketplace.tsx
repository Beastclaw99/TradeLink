import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Project } from '@/components/dashboard/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

const ProfessionalProjectMarketplace: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [userSkills, setUserSkills] = useState<string[]>([]);

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
      
      const typedProjects: Project[] = data?.map(project => ({
        id: project.id,
        title: project.title,
        description: project.description || null,
        category: project.category || null,
        budget: project.budget || null,
        expected_timeline: project.expected_timeline || null,
        location: project.location || null,
        urgency: project.urgency || null,
        requirements: project.requirements || null,
        required_skills: project.recommended_skills || null,
        status: project.status || null,
        created_at: project.created_at || null,
        updated_at: project.updated_at || null,
        client_id: project.client_id || null,
        assigned_to: project.assigned_to || null,
        professional_id: project.professional_id || null,
        contract_template_id: project.contract_template_id || null,
        deadline: project.deadline || null,
        industry_specific_fields: project.industry_specific_fields || null,
        location_coordinates: project.location_coordinates || null,
        project_start_time: project.project_start_time || null,
        rich_description: project.rich_description || null,
        scope: project.scope || null,
        service_contract: project.service_contract || null,
        sla_terms: project.sla_terms || null,
        client: project.client || undefined
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
      const projectSkills = JSON.parse(project.recommended_skills) as string[];
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
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-ttc-blue-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => {
                const projectSkills = project.recommended_skills ? JSON.parse(project.recommended_skills) as string[] : [];
                
                return (
                  <Card key={project.id} className="flex flex-col">
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{project.title}</CardTitle>
                      <CardDescription>
                        Posted by {project.client?.first_name} {project.client?.last_name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="space-y-4">
                        <p className="text-gray-600 line-clamp-3">{project.description}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Budget:</span>
                            <span className="font-medium">{formatBudget(project.budget)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Location:</span>
                            <span className="font-medium">{project.location || 'Remote'}</span>
                          </div>
                          {projectSkills.length > 0 && (
                            <div className="space-y-2">
                              <span className="text-sm font-medium">Required Skills</span>
                              <div className="flex flex-wrap gap-2">
                                {projectSkills.map((skill) => (
                                  <Badge
                                    key={skill}
                                    variant={userSkills.includes(skill) ? "default" : "secondary"}
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ProfessionalProjectMarketplace; 