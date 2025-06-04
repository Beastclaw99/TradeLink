import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { MapPin, Calendar, DollarSign, Search, Grid, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchFiltersProps {
  onFilterChange: (filters: any) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onFilterChange }) => {
  const [category, setCategory] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [minBudget, setMinBudget] = useState<number>(0);
  const [maxBudget, setMaxBudget] = useState<number>(10000);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState<string>('');

  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const applyFilters = () => {
    onFilterChange({
      category,
      location,
      minBudget,
      maxBudget,
      skills
    });
  };

  const resetFilters = () => {
    setCategory('');
    setLocation('');
    setMinBudget(0);
    setMaxBudget(10000);
    setSkills([]);
    onFilterChange({});
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Projects</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="plumbing">Plumbing</SelectItem>
              <SelectItem value="electrical">Electrical</SelectItem>
              <SelectItem value="carpentry">Carpentry</SelectItem>
              <SelectItem value="painting">Painting</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Location</label>
          <Input 
            placeholder="Enter location" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Budget Range</label>
          <div className="flex items-center justify-between">
            <span>${minBudget}</span>
            <span>${maxBudget}</span>
          </div>
          <Slider 
            defaultValue={[minBudget, maxBudget]} 
            max={10000} 
            step={100}
            onValueChange={(values) => {
              setMinBudget(values[0]);
              setMaxBudget(values[1]);
            }}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Skills</label>
          <div className="flex gap-2">
            <Input 
              placeholder="Add skill" 
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
            />
            <Button type="button" size="sm" onClick={handleAddSkill}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                {skill}
                <button onClick={() => handleRemoveSkill(skill)} className="ml-1 text-xs">&times;</button>
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={resetFilters}>Reset</Button>
        <Button onClick={applyFilters}>Apply Filters</Button>
      </CardFooter>
    </Card>
  );
};

interface ProjectsDisplayProps {
  projects: Project[];
  loading: boolean;
  viewMode: 'grid' | 'list';
}

const ProjectsDisplay: React.FC<ProjectsDisplayProps> = ({ projects, loading, viewMode }) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No deadline';
    return new Date(dateString).toLocaleDateString();
  };

  const formatBudget = (budget: number | null) => {
    if (!budget) return 'Budget not specified';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(budget);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-64">
          <p className="text-lg font-medium text-gray-500">No projects found</p>
          <p className="text-sm text-gray-400">Try adjusting your filters</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
      {projects.map((project) => (
        <Card key={project.id} className="h-full">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{project.title}</CardTitle>
              <Badge>{project.category || 'Uncategorized'}</Badge>
            </div>
            <CardDescription className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {project.location || 'Remote'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-3 text-sm text-gray-600 mb-4">
              {project.description || 'No description provided'}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.required_skills?.split(',').map((skill, index) => (
                <Badge key={index} variant="outline">{skill.trim()}</Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <div className="flex items-center gap-1 text-sm">
              <DollarSign className="h-4 w-4" />
              {formatBudget(project.budget)}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Calendar className="h-4 w-4" />
              {formatDate(project.deadline)}
            </div>
            <Button onClick={() => navigate(`/projects/${project.id}`)}>View Details</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

const HeroSection: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg p-8 mb-8">
      <h1 className="text-3xl font-bold mb-2">Find Your Next Project</h1>
      <p className="text-lg opacity-90 mb-6">Browse through available projects and find the perfect match for your skills</p>
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <Input 
          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
          placeholder="Search projects by keyword..."
        />
      </div>
    </div>
  );
};

const CTASection: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-gray-100 rounded-lg p-8 mt-12 text-center">
      <h2 className="text-2xl font-bold mb-2">Ready to offer your services?</h2>
      <p className="text-gray-600 mb-6 max-w-lg mx-auto">
        Create your professional profile and start bidding on projects that match your skills and expertise.
      </p>
      <Button onClick={() => navigate('/profile/create')} size="lg">
        Create Professional Profile
      </Button>
    </div>
  );
};

const ProjectMarketplace: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<any>({});

  useEffect(() => {
    fetchProjects();
  }, [filters]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('projects')
        .select('*')
        .eq('status', 'open');
      
      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      
      if (filters.minBudget) {
        query = query.gte('budget', filters.minBudget);
      }
      
      if (filters.maxBudget) {
        query = query.lte('budget', filters.maxBudget);
      }
      
      if (filters.skills && filters.skills.length > 0) {
        // This is a simplified approach - in a real app you might need a more sophisticated search
        const skillsCondition = filters.skills.map((skill: string) => 
          `required_skills.ilike.%${skill}%`
        ).join(',');
        query = query.or(skillsCondition);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <HeroSection />
        
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-1/4">
            <SearchFilters onFilterChange={handleFilterChange} />
          </aside>
          
          <main className="lg:w-3/4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Available Projects ({projects.length})</h2>
              <div className="flex items-center gap-2">
                <Button 
                  variant={viewMode === 'grid' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === 'list' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <ProjectsDisplay 
              projects={projects} 
              loading={loading}
              viewMode={viewMode}
            />
          </main>
        </div>
        
        <CTASection />
      </div>
    </Layout>
  );
};

export default ProjectMarketplace;
