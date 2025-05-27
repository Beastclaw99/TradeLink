
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Star, MapPin, Clock, CheckCircle } from 'lucide-react';

interface Professional {
  id: string;
  first_name: string;
  last_name: string;
  rating: number;
  skills: string[];
  location?: string;
  availability?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  budget: number;
  status: string;
  category?: string;
}

const ProjectDispatch: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [project, setProject] = useState<Project | null>(null);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>([]);
  const [selectedProfessionals, setSelectedProfessionals] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [skillFilter, setSkillFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [minRating, setMinRating] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');

  useEffect(() => {
    if (!user || !projectId) return;
    
    fetchProjectAndProfessionals();
  }, [user, projectId]);

  useEffect(() => {
    applyFilters();
  }, [professionals, skillFilter, locationFilter, minRating, availabilityFilter]);

  const fetchProjectAndProfessionals = async () => {
    try {
      setLoading(true);
      
      // Fetch project details
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .eq('client_id', user?.id)
        .single();
      
      if (projectError) throw projectError;
      setProject(projectData);
      
      // Fetch available professionals
      // TODO: Backend - Add filtering by skills, location, availability status
      // Required tables: professional_availability, professional_skills
      // Consider adding professional_locations table for better location matching
      const { data: professionalsData, error: professionalsError } = await supabase
        .from('profiles')
        .select('*')
        .eq('account_type', 'professional');
      
      if (professionalsError) throw professionalsError;
      setProfessionals(professionalsData || []);
      
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load project data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...professionals];
    
    if (skillFilter) {
      filtered = filtered.filter(prof => 
        prof.skills?.some(skill => 
          skill.toLowerCase().includes(skillFilter.toLowerCase())
        )
      );
    }
    
    if (locationFilter) {
      // TODO: Backend - Implement proper location matching
      filtered = filtered.filter(prof => 
        prof.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
    
    if (minRating) {
      const rating = parseFloat(minRating);
      filtered = filtered.filter(prof => (prof.rating || 0) >= rating);
    }
    
    if (availabilityFilter) {
      // TODO: Backend - Filter by professional availability status
      // This would require a professional_availability table
    }
    
    setFilteredProfessionals(filtered);
  };

  const toggleProfessionalSelection = (professionalId: string) => {
    setSelectedProfessionals(prev => 
      prev.includes(professionalId)
        ? prev.filter(id => id !== professionalId)
        : [...prev, professionalId]
    );
  };

  const sendRequests = async () => {
    if (selectedProfessionals.length === 0) {
      toast({
        title: "No professionals selected",
        description: "Please select at least one professional to send requests to.",
        variant: "destructive"
      });
      return;
    }

    try {
      // TODO: Backend - Create dispatch_requests table
      // Fields: id, project_id, professional_id, client_id, status, sent_at, message
      // RLS: Allow clients to create requests for their projects
      
      // For now, we'll create applications on behalf of the client
      const applications = selectedProfessionals.map(professionalId => ({
        project_id: projectId,
        professional_id: professionalId,
        status: 'invited',
        proposal_message: 'You have been invited to apply for this project.'
      }));

      const { error } = await supabase
        .from('applications')
        .insert(applications);

      if (error) throw error;

      toast({
        title: "Requests Sent",
        description: `Successfully sent requests to ${selectedProfessionals.length} professional(s).`
      });
      
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error('Error sending requests:', error);
      toast({
        title: "Error",
        description: "Failed to send requests. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container-custom py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading project data...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="container-custom py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Project not found</h1>
            <p className="mt-2 text-gray-600">The project you're looking for doesn't exist or you don't have access to it.</p>
            <Button onClick={() => navigate('/dashboard')} className="mt-4">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-custom py-8">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Dispatch Project</h1>
          <p className="text-gray-600 mt-2">Send your project to qualified professionals</p>
        </div>

        {/* Project Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-lg">{project.title}</h3>
                <p className="text-gray-600 mt-1">{project.description}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Budget:</span>
                  <span>${project.budget?.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  <Badge variant="outline">{project.status}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter Professionals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="skill-filter">Skill</Label>
                <Input
                  id="skill-filter"
                  placeholder="e.g., plumbing"
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="location-filter">Location</Label>
                <Input
                  id="location-filter"
                  placeholder="e.g., Port of Spain"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="rating-filter">Minimum Rating</Label>
                <Select value={minRating} onValueChange={setMinRating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any rating</SelectItem>
                    <SelectItem value="4">4+ stars</SelectItem>
                    <SelectItem value="4.5">4.5+ stars</SelectItem>
                    <SelectItem value="5">5 stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="availability-filter">Availability</Label>
                <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any availability</SelectItem>
                    <SelectItem value="available">Available now</SelectItem>
                    <SelectItem value="busy">Busy but available</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professionals List */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              Available Professionals ({filteredProfessionals.length})
              {selectedProfessionals.length > 0 && (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  - {selectedProfessionals.length} selected
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredProfessionals.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No professionals match your current filters.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProfessionals.map((professional) => (
                  <div
                    key={professional.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedProfessionals.includes(professional.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleProfessionalSelection(professional.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div>
                            <h4 className="font-semibold">
                              {professional.first_name} {professional.last_name}
                            </h4>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                              {professional.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span>{professional.rating.toFixed(1)}</span>
                                </div>
                              )}
                              {professional.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{professional.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {professional.skills && professional.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {professional.skills.map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        {selectedProfessionals.includes(professional.id) && (
                          <CheckCircle className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Send Requests Button */}
        <div className="flex justify-end">
          <Button 
            onClick={sendRequests}
            disabled={selectedProfessionals.length === 0}
            size="lg"
          >
            Send Request to {selectedProfessionals.length} Professional{selectedProfessionals.length !== 1 ? 's' : ''}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDispatch;
