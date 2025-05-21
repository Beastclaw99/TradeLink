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
} from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState<number | ''>('');
  const [bidMessage, setBidMessage] = useState("");
  const [bidSubmitted, setBidSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  useEffect(() => {
    if (!projectId) return;
    
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        
        // Fetch the project details
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select(`
            *,
            client:profiles!projects_client_id_fkey(first_name, last_name)
          `)
          .eq('id', projectId)
          .single();
        
        if (projectError) throw projectError;
        
        setProject(projectData);
        
        // If user is logged in, check if they've already applied
        if (user) {
          const { data: applicationData, error: applicationError } = await supabase
            .from('applications')
            .select('id, status')
            .eq('project_id', projectId)
            .eq('professional_id', user.id);
            
          if (!applicationError && applicationData.length > 0) {
            setHasApplied(true);
            const application = applicationData[0];
            // If the application was withdrawn, allow reapplication
            if (application.status === 'withdrawn') {
              setHasApplied(false);
            }
          }
        }
        
        // Set initial bid amount to project budget
        if (projectData.budget) {
          setBidAmount(projectData.budget);
        }
        
      } catch (error: any) {
        console.error('Error fetching project:', error);
        toast({
          title: "Error",
          description: "Failed to load project details. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProject();
  }, [projectId, user, toast]);
  
  const handleApplicationSubmission = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login as a professional to apply for projects.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    if (!bidAmount || !bidMessage.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both a bid amount and proposal message.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Submit the application to Supabase
      const { data, error } = await supabase
        .from('applications')
        .insert([
          {
            project_id: projectId,
            professional_id: user.id,
            status: 'pending',
            bid_amount: bidAmount,
            proposal_message: bidMessage
          }
        ])
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted to the client successfully!"
      });
      
      setDialogOpen(false);
      setBidSubmitted(true);
      setHasApplied(true);
      
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "Failed to submit your application. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleWithdrawApplication = async () => {
    if (!user || !projectId) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Find the application
      const { data: applicationData, error: findError } = await supabase
        .from('applications')
        .select('id')
        .eq('project_id', projectId)
        .eq('professional_id', user.id)
        .eq('status', 'pending')
        .single();
      
      if (findError) throw findError;
      
      // Update application status to withdrawn
      const { error: updateError } = await supabase
        .from('applications')
        .update({ status: 'withdrawn' })
        .eq('id', applicationData.id);
      
      if (updateError) throw updateError;
      
      toast({
        title: "Application Withdrawn",
        description: "Your application has been withdrawn. You can apply again if you wish."
      });
      
      setHasApplied(false);
      setBidSubmitted(false);
      
    } catch (error: any) {
      console.error('Error withdrawing application:', error);
      toast({
        title: "Error",
        description: "Failed to withdraw your application. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin w-8 h-8 border-4 border-ttc-blue-700 border-t-transparent rounded-full"></div>
          <span className="ml-2">Loading project details...</span>
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
          <Button onClick={() => navigate('/marketplace')} className="mt-4">
            Back to Marketplace
          </Button>
        </div>
      </Layout>
    );
  }

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
              <Tabs defaultValue="details">
                <TabsList className="w-full">
                  <TabsTrigger value="details">Project Details</TabsTrigger>
                  <TabsTrigger value="client">About Client</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Description</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p>{project.description}</p>
                      
                      {/* Include other project details as available */}
                      {/* These are placeholders since we don't have all fields in the actual projects table */}
                      {project.scope && (
                        <div className="pt-4">
                          <h3 className="font-semibold text-lg mb-2">Project Scope</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {project.scope.map((item: string, index: number) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {project.deadline && (
                        <div className="pt-4">
                          <h3 className="font-semibold text-lg mb-2">Project Timeline</h3>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500">Deadline</div>
                            <div className="font-medium">{new Date(project.deadline).toLocaleDateString()}</div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="client">
                  <Card>
                    <CardHeader>
                      <CardTitle>About the Client</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-16 h-16 rounded-full bg-ttc-blue-100 flex items-center justify-center text-ttc-blue-700 font-bold text-xl mr-4">
                          {project.client?.first_name?.[0] || '?'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {project.client ? `${project.client.first_name || ''} ${project.client.last_name || ''}` : 'Unknown Client'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Member since {new Date(project.client?.created_at || new Date()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
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
                  ) : bidSubmitted || hasApplied ? (
                    <div className="bg-green-50 p-4 rounded-lg text-green-800 border border-green-200">
                      <div className="flex items-center mb-2">
                        <Check className="mr-2" size={20} />
                        <h3 className="font-medium">Proposal Submitted!</h3>
                      </div>
                      <p className="text-sm">
                        Your proposal has been sent to the client. They will review it and get back to you soon.
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-4 w-full border-red-200 text-red-700 hover:bg-red-50"
                        onClick={handleWithdrawApplication}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Processing..." : "Withdraw Application"}
                      </Button>
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
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value ? Number(e.target.value) : '')}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Client's budget: ${project.budget}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Proposal Message</label>
                        <Textarea 
                          placeholder="Describe why you're the right professional for this project..."
                          className="min-h-32"
                          value={bidMessage}
                          onChange={(e) => setBidMessage(e.target.value)}
                        />
                      </div>
                    </>
                  )}
                </CardContent>
                
                {project.status === 'open' && !bidSubmitted && !hasApplied && (
                  <CardFooter className="flex flex-col gap-3">
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-ttc-blue-700 hover:bg-ttc-blue-800" disabled={!user}>
                          {bidAmount === project.budget ? "Accept Project Price" : "Submit Proposal"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Submission</DialogTitle>
                          <DialogDescription>
                            You are about to submit a {bidAmount === project.budget ? "proposal at the client's budget" : "counteroffer"} of ${bidAmount} for this project.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <p className="text-sm text-gray-600 mb-4">
                            By proceeding, you agree to complete the project according to the outlined specifications if selected.
                          </p>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                          <Button 
                            onClick={handleApplicationSubmission}
                            className="bg-ttc-blue-700 hover:bg-ttc-blue-800"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Submitting..." : "Confirm Submission"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    {bidAmount === project.budget && (
                      <Button variant="outline" className="w-full" onClick={() => setBidAmount('')}>
                        Make a Counteroffer
                      </Button>
                    )}
                    
                    {bidAmount !== project.budget && bidAmount !== '' && (
                      <Button variant="outline" className="w-full" onClick={() => setBidAmount(project.budget || 0)}>
                        Accept Client's Budget
                      </Button>
                    )}
                    
                    {!user && (
                      <p className="text-sm text-yellow-600 text-center mt-2">
                        You must be logged in as a professional to apply for projects.
                      </p>
                    )}
                  </CardFooter>
                )}
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
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetails;
