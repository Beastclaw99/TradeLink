import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Check,
  DollarSign,
  FileText,
  MapPin,
  Star,
  Clock,
  AlertTriangle,
  User,
} from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ProjectApplicationForm from "@/components/dashboard/professional/ProjectApplicationForm";
import SubmitWorkForm from "@/components/project/SubmitWorkForm";
import ClientReviewForm from "@/components/project/ClientReviewForm";
import InvoiceSection from "@/components/project/InvoiceSection";
import ReviewForm from "@/components/project/ReviewForm";
import UnifiedProjectUpdateTimeline from "@/components/shared/UnifiedProjectUpdateTimeline";
import ApplicationsTable from '@/components/applications/ApplicationsTable';
import ApplicationForm from '@/components/applications/ApplicationForm';
import { format } from 'date-fns';

interface Project {
  id: string;
  title: string;
  description: string;
  budget: number;
  location: string;
  category: string;
  subcategory?: string;
  scope?: string | string[];
  status: string;
  created_at: string;
  deadline: string;
  client: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          title,
          description,
          budget,
          location,
          category,
          status,
          created_at,
          deadline,
          scope,
          client:profiles!projects_client_id_fkey(
            id,
            first_name,
            last_name
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      // Defensive: Check if data is a valid object and has client and scope
      if (!data || typeof data !== 'object' || !data.client || (data.client as any).error) {
        setProject(null);
      } else {
        // If scope is a stringified array, try to parse it
        let scope = data.scope;
        if (typeof scope === 'string') {
          try {
            const parsed = JSON.parse(scope);
            if (Array.isArray(parsed)) scope = parsed;
          } catch {
            // leave as string
          }
        }
        // Type assertion to ensure data is treated as Project type
        const projectData = { ...data, scope } as Project;
        setProject(projectData);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      toast({
        title: "Error",
        description: "Failed to load project details. Please try again.",
        variant: "destructive"
      });
      navigate('/marketplace');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3" />
          <div className="h-32 bg-gray-100 rounded animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-24 bg-gray-100 rounded animate-pulse" />
            <div className="h-24 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-4">The project you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/marketplace')}>
            Back to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  const isClient = user?.id === project.client.id;
  const isProfessional = user?.role === 'professional';

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <section className="bg-ttc-blue-800 py-10 text-white">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-ttc-blue-200 text-ttc-blue-800">
                    {project.category || 'Uncategorized'}
                  </Badge>
                  <Badge variant="outline" className="bg-white/10 border-white/20">
                    {project.subcategory || 'General'}
                  </Badge>
                  <Badge className={`${
                    project.status === 'open' ? 'bg-green-100 text-green-800 border-green-200' :
                    project.status === 'assigned' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                    'bg-gray-100 text-gray-800 border-gray-200'
                  }`}>
                    {project.status}
                  </Badge>
                </div>
                
                <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  {project.location && (
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-1" /> {project.location}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1" /> Posted: {new Date(project.created_at || '').toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <div className="text-center">
                  <div className="text-2xl font-bold">${project.budget}</div>
                  <div className="text-xs">Client's Budget</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <div className="container-custom py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="w-full">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  {isClient && <TabsTrigger value="applications">Applications</TabsTrigger>}
                  {isProfessional && project.status === 'open' && (
                    <TabsTrigger value="apply">Apply</TabsTrigger>
                  )}
                </TabsList>
                
                <TabsContent value="overview">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="prose max-w-none">
                        <p>{project.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-gray-500" />
                          <div>
                            <div className="text-sm text-gray-500">Budget</div>
                            <div className="font-medium">TTD {project.budget.toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-gray-500" />
                          <div>
                            <div className="text-sm text-gray-500">Location</div>
                            <div className="font-medium">{project.location}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-gray-500" />
                          <div>
                            <div className="text-sm text-gray-500">Deadline</div>
                            <div className="font-medium">
                              {format(new Date(project.deadline), 'MMM d, yyyy')}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{project.category}</Badge>
                        </div>
                      </div>
                      
                      {project.scope && (
                        <div className="mt-4">
                          <h3 className="font-semibold mb-2">Project Scope</h3>
                          {Array.isArray(project.scope) ? (
                            <ul className="list-disc pl-5 space-y-1">
                              {project.scope.map((item: string, index: number) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-600">{project.scope}</p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="applications">
                  <Card>
                    <CardHeader>
                      <CardTitle>Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ApplicationsTable
                        projectId={project.id}
                        isClient={true}
                        onStatusChange={fetchProject}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="apply">
                  <Card>
                    <CardHeader>
                      <CardTitle>Submit Application</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ApplicationForm
                        projectId={project.id}
                        onSuccess={() => {
                          setActiveTab('overview');
                          toast({
                            title: "Success",
                            description: "Your application has been submitted successfully."
                          });
                        }}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Submit Your Proposal</CardTitle>
                  <CardDescription>
                    {project.status === 'open' ? 
                      "You can either accept the client's budget or make a counteroffer." :
                      "This project is no longer accepting applications."
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {project.status !== 'open' ? (
                    <div className="bg-yellow-50 p-4 rounded-lg text-yellow-800 border border-yellow-200">
                      <div className="flex items-center mb-2">
                        <AlertTriangle className="mr-2" size={20} />
                        <h3 className="font-medium">Project Unavailable</h3>
                      </div>
                      <p className="text-sm">
                        This project is no longer accepting applications as it has been {project.status}.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Bid Amount ($)</label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                          <Input 
                            type="number"
                            placeholder="Enter your bid amount"
                            className="pl-10"
                            value={project.budget}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Proposal Message</label>
                        <Textarea 
                          placeholder="Describe why you're the right professional for this project..."
                          className="min-h-32"
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
              
              <div className="mt-6 bg-ttc-blue-50 p-4 rounded-lg border border-ttc-blue-100">
                <h3 className="font-medium text-ttc-blue-800 mb-2">Why work on this project?</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="mr-2 text-ttc-blue-700 mt-0.5" size={16} />
                    <span className="text-sm">Fixed price project with clear scope</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 text-ttc-blue-700 mt-0.5" size={16} />
                    <span className="text-sm">Direct communication with client</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 text-ttc-blue-700 mt-0.5" size={16} />
                    <span className="text-sm">Secure payment process</span>
                  </li>
                </ul>
              </div>

              {/* Add SubmitWorkForm */}
              {isProfessional && ['in_progress', 'revision'].includes(project?.status) && (
                <SubmitWorkForm
                  projectId={project.id}
                  projectStatus={project?.status}
                  isProfessional={isProfessional}
                  onWorkSubmitted={fetchProject}
                />
              )}

              {/* Add ClientReviewForm */}
              <ClientReviewForm
                projectId={project.id}
                projectStatus={project?.status}
                isClient={isClient}
                onReviewSubmitted={fetchProject}
              />

              {/* Add InvoiceSection */}
              <InvoiceSection
                projectId={project.id}
                projectStatus={project?.status}
                isClient={isClient}
                isProfessional={isProfessional}
                onPaymentProcessed={fetchProject}
              />

              {/* Add ReviewForm */}
              <ReviewForm
                projectId={project.id}
                projectStatus={project?.status}
                isClient={isClient}
                isProfessional={isProfessional}
                onReviewSubmitted={fetchProject}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetails;
