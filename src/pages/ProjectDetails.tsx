import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, DollarSign, Calendar, MapPin, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ChatDialog } from '@/components/chat/ChatDialog';

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (projectId) {
      fetchProject(projectId);
    }
  }, [projectId]);

  const fetchProject = async (id: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          client:profiles!projects_client_id_fkey(
            id,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      setProject(data);
    } catch (error: any) {
      console.error("Error fetching project:", error);
      toast({
        title: "Error",
        description: "Failed to load project details. Please try again later.",
        variant: "destructive"
      });
      navigate('/project-marketplace');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <span className="loading loading-ring loading-lg"></span>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="container-custom py-8">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p>The project you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/project-marketplace')} className="mt-4">
            Back to Marketplace
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-custom py-8">
        <div className="md:flex gap-4">
          <div className="md:w-3/4">
            <h1 className="text-3xl font-bold mb-4">{project.title}</h1>

            <div className="flex items-center gap-4 mb-4">
              <Avatar>
                <AvatarImage src={project.client?.avatar_url} />
                <AvatarFallback>{project.client?.first_name?.[0]}{project.client?.last_name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{project.client?.first_name} {project.client?.last_name}</div>
                <div className="text-sm text-gray-500">Client</div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <Badge variant="outline">
                  {project.category}
                </Badge>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(project.created_at), 'PPP')}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {project.location}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  {project.expected_timeline}
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600">
                ${project.budget}
              </div>
            </div>

            <Separator className="mb-4" />

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Project Description</h2>
              <p className="text-gray-700">{project.description}</p>
            </div>

            {project?.required_skills && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Skills Required</h3>
                <div className="flex flex-wrap gap-2">
                  {(project.required_skills as string).split(',').map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="md:w-1/4">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Interested?</h3>
              <p className="text-sm text-gray-500 mb-4">Send a proposal or message the client to discuss your interest in this project.</p>

              <Textarea
                placeholder="Write a proposal..."
                className="mb-4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <Button className="w-full mb-2">
                Submit Proposal
              </Button>

              <Button variant="outline" className="w-full" onClick={() => setIsChatOpen(true)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Client
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="py-4">
          <h4 className="text-lg font-semibold mb-2">Similar Projects</h4>
          <p className="text-sm text-gray-500">Here are some other projects that might interest you.</p>
        </div>
      </div>

      <ChatDialog
        open={isChatOpen}
        onOpenChange={setIsChatOpen}
        title={`Chat with ${project.client?.first_name} ${project.client?.last_name}`}
        recipient_id={project.client_id || ''}
      />
    </Layout>
  );
};

export default ProjectDetails;
