import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/components/dashboard/types';
import ProjectUpdateTimeline from '@/components/shared/UnifiedProjectUpdateTimeline';
import { MapPin, DollarSign, Calendar, User, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);

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
          client:profiles!projects_client_id_fkey(first_name, last_name),
          professional:profiles!projects_professional_id_fkey(first_name, last_name)
        `)
        .eq('id', projectId)
        .single();

      if (error) throw error;
      setProject(data);
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

  const getStatusBadge = (status: string | null) => {
    const statusColors: Record<string, string> = {
      'open': 'bg-green-100 text-green-800',
      'in_progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={statusColors[status || ''] || 'bg-gray-100 text-gray-800'}>
        {(status || 'Open').charAt(0).toUpperCase() + (status || 'Open').slice(1).replace('_', ' ')}
      </Badge>
    );
  };

  const requiredSkills = project.required_skills && typeof project.required_skills === 'string' 
    ? project.required_skills.split(',').map(skill => skill.trim())
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
                    {getStatusBadge(project.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
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

              {/* Project Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProjectUpdateTimeline 
                    projectId={project.id}
                    projectStatus={project.status || 'open'}
                    showAddUpdate={false}
                  />
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

              {project.status === 'open' && (
                <Card>
                  <CardContent className="pt-6">
                    <Button 
                      onClick={handleApplyToProject}
                      disabled={isApplying}
                      className="w-full bg-ttc-blue-700 hover:bg-ttc-blue-800"
                    >
                      {isApplying ? "Applying..." : "Apply for this Project"}
                    </Button>
                  </CardContent>
                </Card>
              )}

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
