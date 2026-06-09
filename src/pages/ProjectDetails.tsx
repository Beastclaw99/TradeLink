import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/database';
import { MapPin, DollarSign, Calendar, User, Clock, AlertTriangle, FileText, CheckCircle, BadgeInfo, Layers, Pen } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatDateToLocale } from '@/utils/dateUtils';

const labelClass = "font-medium text-gray-700";
const valueClass = "text-gray-600";

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [hasAcceptedContract, setHasAcceptedContract] = useState(false);
  const [bidAmount, setBidAmount] = useState<number | ''>('');
  const [proposalMessage, setProposalMessage] = useState('');

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  useEffect(() => {
    if (project && project.budget != null && bidAmount === '') {
      setBidAmount(Number(project.budget));
    }
    // Only set on first load to avoid overwriting user changes
    // eslint-disable-next-line
  }, [project]);

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
      
      // Transform the data to match Project interface
      const transformedProject: Project = {
        id: data.id,
        title: data.title,
        description: data.description,
        category: data.category,
        budget: data.budget,
        timeline: data.timeline,
        location: data.location,
        urgency: data.urgency,
        requirements: data.requirements,
        recommended_skills: data.recommended_skills || null,
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
        client: data.client,
        professional: data.professional
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

    if (typeof bidAmount !== 'number' || isNaN(bidAmount) || bidAmount <= 0) {
      toast({
        title: "Invalid Bid Amount",
        description: "Please enter a valid bid amount.",
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
            status: 'pending',
            bid_amount: bidAmount,
            proposal_message: proposalMessage,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully!"
      });
      // Reset form
      setProposalMessage('');
      setBidAmount(project?.budget || '');

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

  const requirements = project.requirements && Array.isArray(project.requirements)
    ? project.requirements
    : [];
  const recommendedSkills = project.recommended_skills && typeof project.recommended_skills === 'string'
    ? project.recommended_skills.split(',').map(skill => skill.trim()).filter(Boolean)
    : Array.isArray(project.recommended_skills)
      ? project.recommended_skills
      : [];

  // Add improved display helpers
  const formatCurrency = (value: number | null) =>
    value ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value) : 'Not specified';
  const notSpecified = <span className="italic text-gray-400">Not specified</span>;

  return (
    <Layout>
      <div className="bg-gray-50 py-8 min-h-[96vh]">
        <div className="container-custom">
          <Button 
            variant="outline" 
            onClick={() => navigate('/project-marketplace')}
            className="mb-8"
          >
            ← Back to Projects
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2 flex flex-col space-y-8">
              {/* Title and Meta */}
              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
                    <div>
                      <CardTitle className="text-3xl mb-1 flex items-center gap-2">
                        <BadgeInfo className="h-6 w-6 text-ttc-blue-700" />
                        {project.title}
                      </CardTitle>
                      <CardDescription className="text-base flex gap-3 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Posted {formatDateToLocale(project.created_at)}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Layers className="h-4 w-4" />
                          <span>{project.category || "Uncategorized"}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Badge variant="outline" className="ml-1">{project.status ? project.status.replace(/_/g, ' ').toUpperCase() : "Open"}</Badge>
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          Client: {project.client?.first_name || 'Anonymous'} {project.client?.last_name || ''}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex gap-3 mt-4 md:mt-0">
                      <Badge variant={project.urgency === 'high' ? 'destructive' : 'outline'}>
                        {project.urgency ?
                          `${project.urgency.charAt(0).toUpperCase()}${project.urgency.slice(1)}` :
                          'Normal'} Priority
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Description */}
                    <div>
                      <h3 className="font-semibold mb-2 text-lg flex items-center gap-1">
                        <FileText className="h-4 w-4" /> Description
                      </h3>
                      <p className="text-gray-800">{project.description || 'No description provided'}</p>
                    </div>

                    {/* Requirements / Recommended Skills */}
                    {(requirements && requirements.length > 0) && (
                      <div>
                        <h3 className="font-semibold mb-2 text-lg flex items-center gap-1">
                          <Pen className="h-4 w-4" /> Requirements
                        </h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700">
                          {requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {recommendedSkills.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2 text-lg flex items-center gap-1">
                          <Layers className="h-4 w-4" /> Recommended Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {recommendedSkills.map((skill, index) => (
                            <Badge key={index} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Scope */}
                    {project.scope && (
                      <div>
                        <h3 className="font-semibold mb-2 text-lg flex items-center gap-1">
                          <BadgeInfo className="h-4 w-4" /> Project Scope
                        </h3>
                        <p className="text-gray-700">{project.scope}</p>
                      </div>
                    )}

                    {/* Timeline, Start, Deadline in grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-1">
                        <span className={labelClass}>Timeline:</span>
                        <span className={valueClass}>{project.timeline || notSpecified}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className={labelClass}>Start Time:</span>
                        <span className={valueClass}>{project.project_start_time ? formatDateToLocale(project.project_start_time) : notSpecified}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className={labelClass}>Deadline:</span>
                        <span className={valueClass}>{project.deadline ? formatDateToLocale(project.deadline) : notSpecified}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className={labelClass}>Last Updated:</span>
                        <span className={valueClass}>{project.updated_at ? formatDateToLocale(project.updated_at) : notSpecified}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Service Contract */}
              <Card className="border-blue-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-ttc-blue-700" /> Service Contract
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertDescription>
                      Please review the service contract carefully. By applying to this project, you agree to all terms and conditions.
                    </AlertDescription>
                  </Alert>
                  <ScrollArea className="h-[300px] rounded border p-4 bg-gray-50">
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
            <div className="flex flex-col space-y-6">
              {/* Project Detail Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Budget:</span>
                    <span className="ml-1">{formatCurrency(project.budget)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-rose-500" />
                    <span className="font-medium">Location:</span>
                    <span className="ml-1">{project.location || "Remote"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Layers className="h-5 w-5 text-indigo-500" />
                    <span className="font-medium">Category:</span>
                    <span className="ml-1">{project.category || notSpecified}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BadgeInfo className="h-5 w-5 text-ttc-blue-700" />
                    <span className="font-medium">Status:</span>
                    <Badge variant="outline" className="ml-1">{project.status ? project.status.replace(/_/g, ' ').toUpperCase() : "Open"}</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <span className="font-medium">Urgency:</span>
                    <span className="ml-1">{project.urgency || "Normal"}</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Assigned Professional */}
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
              
              {/* Client Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-500"/>
                    Client
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <span className="font-medium">{project.client?.first_name || 'Anonymous'} {project.client?.last_name || ''}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Application */}
              <Card className="border-green-100">
                <CardHeader>
                  <CardTitle>Apply for Project</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      handleApplyToProject();
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label htmlFor="bid-amount" className="block text-sm font-medium mb-1">
                        Bid Amount <span className="text-gray-500 text-xs">(You can match or adjust the budget)</span>
                      </label>
                      <div className="relative">
                        <input
                          id="bid-amount"
                          type="number"
                          min={1}
                          step="0.01"
                          value={bidAmount}
                          onChange={e => setBidAmount(e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-ttc-blue-300 focus:border-ttc-blue-500 transition"
                          placeholder={project.budget ? String(project.budget) : 'Enter your bid'}
                          disabled={isApplying}
                          required
                        />
                        {project.budget && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                            USD
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="proposal-message" className="block text-sm font-medium mb-1">
                        Proposal Message
                      </label>
                      <textarea
                        id="proposal-message"
                        value={proposalMessage}
                        onChange={e => setProposalMessage(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-ttc-blue-300 focus:border-ttc-blue-500 transition min-h-[80px] text-sm"
                        placeholder="Add a message with your bid (optional)"
                        maxLength={1200}
                        disabled={isApplying}
                      />
                    </div>
                    <Button 
                      type="submit"
                      disabled={isApplying || !hasAcceptedContract}
                      className="w-full bg-ttc-blue-700 hover:bg-ttc-blue-800 transition-colors"
                    >
                      {isApplying ? "Applying..." : "Apply for this Project"}
                    </Button>
                  </form>
                  {!hasAcceptedContract && (
                    <p className="text-sm text-yellow-600">
                      Please review and accept the service contract before applying
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetails;
