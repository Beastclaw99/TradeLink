import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area"
import { CircleDollarSign, Mail, MessageSquare, User2 } from 'lucide-react';
import { Separator } from "@/components/ui/separator"
import { supabase } from '@/integrations/supabase/client';
import { Project, Application } from '@/types';
import Layout from '@/components/layout/Layout';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

const ProjectApplications: React.FC = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [project, setProject] = useState<Project | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          client:profiles!projects_client_id_fkey(first_name, last_name)
        `)
        .eq('id', projectId)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Error",
        description: "Failed to load project details.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          professional:profiles!applications_professional_id_fkey(first_name, last_name)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data);
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Error",
        description: "Failed to load applications.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
    fetchApplications();
  }, [projectId]);

  const handleAcceptApplication = async (applicationId: string, professionalId: string) => {
    if (!projectId) return;

    try {
      setLoading(true);

      // Update application status to 'accepted'
      const { error: appError } = await supabase
        .from('applications')
        .update({ status: 'accepted' })
        .eq('id', applicationId);

      if (appError) throw appError;

      // Update project status to 'assigned' and assign the professional
      const { error: projectError } = await supabase
        .from('projects')
        .update({ status: 'assigned', assigned_to: professionalId })
        .eq('id', projectId);

      if (projectError) throw projectError;

      toast({
        title: "Application Accepted",
        description: "The application has been accepted and the project assigned.",
      });

      // Refresh data
      await fetchProject();
      await fetchApplications();
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Error",
        description: "Failed to accept application.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('applications')
        .update({ status: 'rejected' })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Application Rejected",
        description: "The application has been rejected.",
      });

      // Refresh data
      await fetchApplications();
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Error",
        description: "Failed to reject application.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async (): Promise<void> => {
    if (projectId) {
      await fetchProject();
      await fetchApplications();
    }
  };

  if (loading) {
    return <Layout>Loading applications...</Layout>;
  }

  if (error) {
    return <Layout>Error: {error}</Layout>;
  }

  if (!project) {
    return <Layout>Project not found.</Layout>;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        <Card>
          <CardHeader>
            <CardTitle>Project: {project.title}</CardTitle>
            <p className="text-sm text-gray-500">Created at: {format(new Date(project.created_at), 'PPP')}</p>
          </CardHeader>
          <CardContent>
            <p>{project.description}</p>
            <div className="mt-4">
              <Badge variant="secondary">{project.category}</Badge>
              <Badge variant="outline">{project.status}</Badge>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Applications</h2>
          {applications.length === 0 ? (
            <p>No applications yet.</p>
          ) : (
            <ScrollArea className="rounded-md border">
              <div className="divide-y divide-border">
                {applications.map((app) => (
                  <div key={app.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={`https://avatar.vercel.sh/${app.professional?.first_name}.png`} />
                          <AvatarFallback>{app.professional?.first_name?.[0]}{app.professional?.last_name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-semibold">{app.professional?.first_name} {app.professional?.last_name}</h3>
                          <p className="text-sm text-gray-500">Applied on: {format(new Date(app.created_at), 'PPP')}</p>
                        </div>
                      </div>
                      <div>
                        {project.status === 'open' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleAcceptApplication(app.id, app.professional_id)}
                              disabled={loading}
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectApplication(app.id)}
                              disabled={loading}
                              className="ml-2"
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {project.status !== 'open' && (
                          <Badge variant="success">Assigned</Badge>
                        )}
                      </div>
                    </div>
                    <Separator />
                    <div className="grid gap-6 py-4">
                      <div>
                        <h4 className="font-medium leading-none mb-2">Cover Letter</h4>
                        <p className="text-sm text-gray-600">{app.cover_letter}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>Bid Amount</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center gap-2">
                              <CircleDollarSign className="w-4 h-4 text-gray-500" />
                              <span>{app.bid_amount}</span>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle>Availability</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center gap-2">
                              <User2 className="w-4 h-4 text-gray-500" />
                              <span>{app.availability}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex justify-end mt-4">
                      <Button variant="link">
                        <Mail className="mr-2 h-4 w-4" /> Contact
                      </Button>
                      <Button variant="link">
                        <MessageSquare className="mr-2 h-4 w-4" /> Chat
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProjectApplications;
