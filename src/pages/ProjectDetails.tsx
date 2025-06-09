
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/components/dashboard/types';
import { MapPin, DollarSign, Calendar, User, Clock, AlertTriangle, FileText, CheckCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [hasAcceptedContract, setHasAcceptedContract] = useState(false);

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          client:profiles!projects_client_id_fkey(id, first_name, last_name, email),
          professional:profiles!projects_professional_id_fkey(id, first_name, last_name, email)
        `)
        .eq('id', projectId)
        .single();

      if (error) throw error;
      
      // Transform the data to match Project interface
      const transformedProject: Project = {
        id: data.id,
        title: data.title,
        description: data.description,
        category: data.category,
        budget: data.budget,
        expected_timeline: data.expected_timeline,
        location: data.location,
        urgency: data.urgency,
        requirements: data.requirements,
        required_skills: Array.isArray(data.recommended_skills) 
          ? data.recommended_skills 
          : (typeof data.recommended_skills === 'string' 
             ? data.recommended_skills.split(',').map((skill: string) => skill.trim())
             : []),
        status: data.status,
        created_at: data.created_at,
        updated_at: data.updated_at,
        client_id: data.client_id,
        assigned_to: data.assigned_to,
        professional_id: data.professional_id,
        contract_template_id: data.contract_template_id,
        deadline: data.deadline,
        industry_specific_fields: data.industry_specific_fields,
        location_coordinates: data.location_coordinates,
        project_start_time: data.project_start_time,
        rich_description: data.rich_description,
        scope: data.scope,
        service_contract: data.service_contract,
        sla_terms: data.sla_terms,
        client: data.client ? {
          id: data.client.id || data.client_id,
          first_name: data.client.first_name || 'Unknown',
          last_name: data.client.last_name || 'User',
          email: data.client.email
        } : undefined,
        professional: data.professional ? {
          id: data.professional.id || data.professional_id,
          first_name: data.professional.first_name || 'Unknown',
          last_name: data.professional.last_name || 'User', 
          email: data.professional.email
        } : undefined
      };
      
      setProject(transformedProject);
    } catch (error) {
      console.error('Error fetching project details:', error);
      toast({
        title: "Error",
        description: "Failed to load project details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApplyToProject = async () => {
    if (!hasAcceptedContract) {
      toast({
        title: "Contract Required",
        description: "Please review and accept the service contract before applying",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsApplying(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to apply to projects",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('applications')
        .insert([
          {
            project_id: projectId,
            professional_id: user.id,
            status: 'pending'
          }
        ]);

      if (error) throw error;

      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully!"
      });

      fetchProjectDetails();
    } catch (error) {
      console.error('Error applying to project:', error);
      toast({
        title: "Error",
        description: "Failed to submit application",
        variant: "destructive"
      });
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container-custom py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
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
            <h1 className="text-2xl font-bold mb-4">Project not found</h1>
            <Button onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const requiredSkills = Array.isArray(project.required_skills) 
    ? project.required_skills 
    : [];

  return (
    <Layout>
      <div className="bg-gray-50 py-8">
        <div className="container-custom">
          <Button 
            variant="outline" 
            onClick={() => navigate('/project-marketplace')}
            className="mb-6"
          >
            ← Back to Projects
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl mb-2">{project.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Posted {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'Recently'}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {project.client?.first_name || 'Anonymous'} {project.client?.last_name || ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-gray-700">{project.description || 'No description provided'}</p>
                    </div>

                    {project.requirements && project.requirements.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Requirements</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {project.requirements.map((req, index) => (
                            <li key={index} className="text-gray-700">{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {requiredSkills.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Required Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {requiredSkills.map((skill, index) => (
                            <Badge key={index} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Service Contract Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Service Contract</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <AlertDescription>
                      Please review the service contract carefully. By applying to this project, you agree to all terms and conditions.
                    </AlertDescription>
                  </Alert>

                  <ScrollArea className="h-[400px] rounded-md border p-4">
                    <pre className="whitespace-pre-wrap font-mono text-sm">
                      {project.service_contract || 'No service contract available'}
                    </pre>
                  </ScrollArea>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="accept-contract"
                      checked={hasAcceptedContract}
                      onChange={(e) => setHasAcceptedContract(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor="accept-contract" className="text-sm">
                      I have read and agree to the terms of this service contract
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Budget:</span>
                    <span>{project.budget ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(project.budget) : 'Not specified'}</span>
                  </div>

                  {project.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Location:</span>
                      <span>{project.location}</span>
                    </div>
                  )}

                  {project.expected_timeline && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Timeline:</span>
                      <span>{project.expected_timeline}</span>
                    </div>
                  )}

                  {project.urgency && (
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Urgency:</span>
                      <span>{project.urgency}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Apply for Project</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={handleApplyToProject}
                    disabled={isApplying || !hasAcceptedContract}
                    className="w-full bg-ttc-blue-700 hover:bg-ttc-blue-800"
                  >
                    {isApplying ? "Applying..." : "Apply for this Project"}
                  </Button>
                  
                  {!hasAcceptedContract && (
                    <p className="text-sm text-yellow-600">
                      Please review and accept the service contract before applying
                    </p>
                  )}
                </CardContent>
              </Card>

              {project.professional && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Assigned Professional
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">
                      {project.professional.first_name} {project.professional.last_name}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetails;
