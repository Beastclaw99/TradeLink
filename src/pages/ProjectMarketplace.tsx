
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  DollarSign, 
  Filter, 
  Grid,
  LayoutList,
  MapPin, 
  Search,
  Tag, 
  Clock,
  Loader2
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { Project } from '@/components/dashboard/types';

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
      
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          client:profiles(first_name, last_name)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setProjects(data || []);
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
      <section className="bg-ttc-blue-800 py-12 text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Project Marketplace</h1>
            <p className="text-lg mb-6">Browse available projects or post your own project to find the right professional</p>
            <Button 
              size="lg" 
              className="bg-ttc-green-500 hover:bg-ttc-green-600 mt-2"
              onClick={handlePostProject}
            >
              Post a New Project
            </Button>
          </div>
        </div>
      </section>
      
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Projects</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input 
                    id="search"
                    placeholder="Search by keyword..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="w-full md:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Carpentry">Carpentry</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="Plumbing">Plumbing</SelectItem>
                    <SelectItem value="Painting">Painting</SelectItem>
                    <SelectItem value="Roofing">Roofing</SelectItem>
                    <SelectItem value="Landscaping">Landscaping</SelectItem>
                    <SelectItem value="Masonry">Masonry</SelectItem>
                    <SelectItem value="Flooring">Flooring</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="Port of Spain">Port of Spain</SelectItem>
                    <SelectItem value="San Fernando">San Fernando</SelectItem>
                    <SelectItem value="Arima">Arima</SelectItem>
                    <SelectItem value="Chaguanas">Chaguanas</SelectItem>
                    <SelectItem value="Point Fortin">Point Fortin</SelectItem>
                    <SelectItem value="Tobago">Tobago</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                <Select value={budgetFilter} onValueChange={setBudgetFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any Budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Budget</SelectItem>
                    <SelectItem value="under5k">Under $5,000</SelectItem>
                    <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                    <SelectItem value="over10k">Over $10,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" className="gap-2 md:w-auto w-full" onClick={fetchProjects}>
                <Filter size={16} /> Filter
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-ttc-neutral-800">{filteredProjects.length} Projects Available</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 border rounded-md p-1">
                <Button 
                  size="icon" 
                  variant={viewMode === "grid" ? "default" : "ghost"} 
                  onClick={() => setViewMode("grid")} 
                  className="h-8 w-8"
                >
                  <Grid size={16} />
                </Button>
                <Button 
                  size="icon" 
                  variant={viewMode === "list" ? "default" : "ghost"} 
                  onClick={() => setViewMode("list")} 
                  className="h-8 w-8"
                >
                  <LayoutList size={16} />
                </Button>
              </div>
              <Select defaultValue="newest">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="budget-high">Budget: High to Low</SelectItem>
                  <SelectItem value="budget-low">Budget: Low to High</SelectItem>
                  <SelectItem value="deadline">Deadline: Soonest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-ttc-blue-700 mr-2" />
              <span>Loading projects...</span>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge variant="secondary" className="bg-ttc-blue-50 text-ttc-blue-700 mb-2">
                        Project
                      </Badge>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        {project.status || 'Open'}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin size={14} /> Location
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pb-4">
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                      {project.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center text-ttc-neutral-700">
                        <DollarSign size={16} className="mr-1 text-ttc-blue-700" />
                        <span className="font-semibold">${project.budget}</span>
                      </div>
                      
                      <div className="flex items-center text-ttc-neutral-700">
                        <Clock size={16} className="mr-1 text-ttc-blue-700" />
                        <span>
                          {project.created_at 
                            ? new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) 
                            : 'Recent'}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-ttc-neutral-700">
                        <Tag size={16} className="mr-1 text-ttc-blue-700" />
                        <span>Fixed Price</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-0 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      Posted by: <span className="font-medium">
                        {project.client?.first_name} {project.client?.last_name}
                      </span>
                    </div>
                    <Link to={`/project/${project.id}`}>
                      <Button variant="outline" className="border-ttc-blue-700 text-ttc-blue-700 hover:bg-ttc-blue-50">
                        View Details
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <div key={project.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="bg-ttc-blue-50 text-ttc-blue-700">
                          Project
                        </Badge>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          {project.status || 'Open'}
                        </Badge>
                      </div>
                      
                      <h3 className="text-lg font-semibold mb-1">{project.title}</h3>
                      
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin size={14} className="mr-1" /> Location
                        <span className="mx-2">|</span>
                        <span>Posted by: <span className="font-medium">
                          {project.client?.first_name} {project.client?.last_name}
                        </span></span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                        <div className="flex items-center text-ttc-neutral-700">
                          <DollarSign size={16} className="mr-1 text-ttc-blue-700" />
                          <span className="font-semibold">${project.budget}</span>
                        </div>
                        
                        <div className="flex items-center text-ttc-neutral-700">
                          <Clock size={16} className="mr-1 text-ttc-blue-700" />
                          <span>
                            {project.created_at 
                              ? new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) 
                              : 'Recent'}
                          </span>
                        </div>
                      </div>
                      
                      <Link to={`/project/${project.id}`}>
                        <Button variant="outline" className="border-ttc-blue-700 text-ttc-blue-700 hover:bg-ttc-blue-50 whitespace-nowrap">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {filteredProjects.length === 0 && !loading && (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search filters or check back later.</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="bg-ttc-blue-700 rounded-lg shadow-xl p-8 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-4">Have a project you need help with?</h2>
                <p className="mb-6">Post your project for free and get connected with qualified professionals in Trinidad & Tobago.</p>
                <Button className="bg-white text-ttc-blue-700 hover:bg-blue-50" onClick={handlePostProject}>
                  Post Your Project
                </Button>
              </div>
              <div className="hidden md:block">
                <img 
                  src="/lovable-uploads/8bbf4ce1-7690-4c37-9adf-b2751ac81a84.png" 
                  alt="Post a project" 
                  className="rounded-lg max-h-48 w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProjectMarketplace;
