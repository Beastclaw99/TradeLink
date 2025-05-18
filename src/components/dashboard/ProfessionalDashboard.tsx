
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Star, Briefcase, FileText, AlertCircle } from "lucide-react";
import { 
  Project, 
  Application, 
  Payment, 
  Review,
  ProjectChangeRequest,
  ChangePayload
} from './types';

interface ProfessionalDashboardProps {
  userId: string;
}

const ProfessionalDashboard: React.FC<ProfessionalDashboardProps> = ({ userId }) => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [changeRequests, setChangeRequests] = useState<ProjectChangeRequest[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, [userId]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // First get the professional's profile to get their skills
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('skills')
        .eq('id', userId)
        .single();
      
      if (profileError) throw profileError;
      
      // Set skills array or default to empty array
      const userSkills = profileData?.skills || [];
      setSkills(userSkills);
      
      // Fetch projects that match skills (if skills are available)
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          client:profiles(first_name, last_name)
        `)
        .eq('status', 'open');
      
      if (projectsError) throw projectsError;
      
      // Filter projects by skills if skills are available
      let filteredProjects = projectsData || [];
      if (userSkills.length > 0) {
        // This is a simple filter - in real world you might want more complex matching
        filteredProjects = projectsData.filter((project: any) => {
          const projTags = project.tags || [];
          return userSkills.some((skill: string) => 
            projTags.includes(skill) || 
            project.title.toLowerCase().includes(skill.toLowerCase()) ||
            project.description?.toLowerCase().includes(skill.toLowerCase())
          );
        });
      }
      
      setProjects(filteredProjects);
      
      // Fetch applications made by the professional
      const { data: appsData, error: appsError } = await supabase
        .from('applications')
        .select(`
          *,
          project:projects(title, status, budget)
        `)
        .eq('professional_id', userId);
      
      if (appsError) throw appsError;
      setApplications(appsData || []);
      
      // Fetch payments for completed projects
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select(`
          *,
          project:projects(title)
        `)
        .eq('professional_id', userId);
      
      if (paymentsError) throw paymentsError;
      
      // Ensure each payment has a created_at field, using current date as fallback
      const paymentsWithCreatedAt = (paymentsData || []).map(payment => ({
        ...payment,
        created_at: payment.created_at || new Date().toISOString()
      }));
      
      setPayments(paymentsWithCreatedAt);
      
      // Fetch reviews for the professional
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('professional_id', userId);
      
      if (reviewsError) throw reviewsError;
      setReviews(reviewsData || []);
      
      // Fetch change requests for projects where professional is accepted
      const acceptedProjectIds = applications
        .filter(app => app.status === 'accepted')
        .map(app => app.project_id)
        .filter(Boolean) as string[];

      if (acceptedProjectIds.length > 0) {
        const { data: changeRequestData, error: changeRequestError } = await supabase
          .from('project_change_requests')
          .select(`
            *,
            project:projects(title)
          `)
          .eq('professional_id', userId)
          .in('status', ['pending']);
        
        if (changeRequestError) throw changeRequestError;
        
        // Ensure the change_payload is properly typed
        const typedChangeRequests = (changeRequestData || []).map(request => ({
          ...request,
          change_payload: request.change_payload as ChangePayload
        }));
        
        setChangeRequests(typedChangeRequests);
      }
      
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    return (total / reviews.length).toFixed(1);
  };

  const calculatePaymentTotals = () => {
    const received = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const pending = payments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);
    
    return { received, pending };
  };

  const handleApplyToProject = async () => {
    if (!selectedProject || !coverLetter.trim()) {
      toast({
        title: "Missing information",
        description: "Please write a cover letter for your application",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsApplying(true);
      
      const { data, error } = await supabase
        .from('applications')
        .insert([
          {
            project_id: selectedProject,
            professional_id: userId,
            cover_letter: coverLetter,
            status: 'pending'
          }
        ])
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully!"
      });
      
      // Reset form
      setCoverLetter('');
      setSelectedProject(null);
      
      // Refresh data
      fetchDashboardData();
      
    } catch (error: any) {
      console.error('Error applying to project:', error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsApplying(false);
    }
  };

  const handleChangeRequest = async (changeRequestId: string, decision: 'approved' | 'rejected') => {
    try {
      setIsResponding(true);
      
      const { error } = await supabase
        .from('project_change_requests')
        .update({ 
          status: decision,
          decision_at: new Date().toISOString()
        })
        .eq('id', changeRequestId);
      
      if (error) throw error;
      
      toast({
        title: "Response Submitted",
        description: `You have ${decision} the requested change.`
      });
      
      // Refresh data
      fetchDashboardData();
      
    } catch (error: any) {
      console.error('Error responding to change request:', error);
      toast({
        title: "Error",
        description: "Failed to submit your response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsResponding(false);
    }
  };

  const formatChangeRequestDescription = (changeRequest: ProjectChangeRequest) => {
    if (!changeRequest.change_payload) return 'No changes specified';
    
    const changes = [];
    const payload = changeRequest.change_payload;
    
    if (payload.title) changes.push(`Title changed to: "${payload.title}"`);
    if (payload.description) changes.push(`Description updated`);
    if (payload.budget !== undefined) changes.push(`Budget changed to: $${payload.budget}`);
    if (payload.status) changes.push(`Status changed to: ${payload.status}`);
    
    return changes.length > 0 ? changes.join(', ') : 'No changes specified';
  };

  return (
    <Tabs defaultValue="featured">
      <TabsList className="mb-6">
        <TabsTrigger value="featured">Featured Projects</TabsTrigger>
        <TabsTrigger value="applications">Your Applications</TabsTrigger>
        <TabsTrigger value="changes">Change Requests</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>
      
      <TabsContent value="featured">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Featured Projects</h2>
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1 bg-ttc-blue-50 text-ttc-blue-700 text-xs rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {isLoading ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="text-center py-8">
            <Briefcase className="w-12 h-12 mx-auto text-ttc-neutral-400" />
            <p className="mt-4 text-ttc-neutral-600">No matching projects available at the moment.</p>
            {skills.length === 0 && (
              <p className="mt-2 text-sm text-ttc-neutral-500">
                Add skills to your profile to see matching projects.
              </p>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map(project => {
              // Check if user has already applied to this project
              const hasApplied = applications.some(app => app.project_id === project.id);
              
              return (
                <Card key={project.id}>
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription className="flex items-center justify-between">
                      <span>Posted on {new Date(project.created_at || '').toLocaleDateString()}</span>
                      <span>by {project.client?.first_name} {project.client?.last_name}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-ttc-neutral-600 mb-4">{project.description}</p>
                    <p className="font-medium">Budget: ${project.budget}</p>
                  </CardContent>
                  <CardFooter>
                    {hasApplied ? (
                      <Button variant="outline" disabled className="w-full">
                        Already Applied
                      </Button>
                    ) : (
                      <Button 
                        className="w-full bg-ttc-blue-700 hover:bg-ttc-blue-800"
                        onClick={() => {
                          setSelectedProject(project.id);
                          const applyTab = document.querySelector('[data-value="apply"]');
                          if (applyTab) {
                            (applyTab as HTMLElement).click();
                          }
                        }}
                      >
                        Apply for this Project
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
        
        {selectedProject && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Apply to Project</CardTitle>
              <CardDescription>
                Write a cover letter explaining why you're a good fit for this project.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Describe your experience, skills, and why you're interested in this project..."
                className="min-h-[150px]"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedProject(null);
                  setCoverLetter('');
                }}
              >
                Cancel
              </Button>
              <Button 
                className="bg-ttc-blue-700 hover:bg-ttc-blue-800"
                onClick={handleApplyToProject}
                disabled={isApplying}
              >
                {isApplying ? "Submitting..." : "Submit Application"}
              </Button>
            </CardFooter>
          </Card>
        )}
      </TabsContent>
      
      <TabsContent value="applications">
        <h2 className="text-2xl font-bold mb-4">Your Applications</h2>
        {isLoading ? (
          <p>Loading your applications...</p>
        ) : applications.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 mx-auto text-ttc-neutral-400" />
            <p className="mt-4 text-ttc-neutral-600">You haven't applied to any projects yet.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                const featuredTab = document.querySelector('[data-value="featured"]');
                if (featuredTab) {
                  (featuredTab as HTMLElement).click();
                }
              }}
            >
              Browse Available Projects
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Applied On</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map(app => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.project?.title || 'Unknown Project'}</TableCell>
                  <TableCell>{new Date(app.created_at || '').toLocaleDateString()}</TableCell>
                  <TableCell>${app.project?.budget || 'N/A'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      app.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {app.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TabsContent>
      
      <TabsContent value="changes">
        <div className="flex items-center mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold">Project Change Requests</h2>
            <p className="text-ttc-neutral-600">Clients need your approval for project changes</p>
          </div>
        </div>
        
        {isLoading ? (
          <p>Loading change requests...</p>
        ) : changeRequests.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 mx-auto text-ttc-neutral-400" />
            <p className="mt-4 text-ttc-neutral-600">No pending change requests.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {changeRequests.map(request => (
              <Card key={request.id} className="border-yellow-200">
                <CardHeader className="bg-yellow-50 border-b border-yellow-100">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center">
                      <AlertCircle className="mr-2 h-5 w-5 text-yellow-600" />
                      Change Request: {request.project?.title}
                    </CardTitle>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      Pending Approval
                    </span>
                  </div>
                  <CardDescription>
                    Requested on {new Date(request.created_at || '').toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-ttc-neutral-700 font-medium mb-2">
                    Change Type: {request.change_type || 'Update'}
                  </p>
                  <p className="text-ttc-neutral-700 mb-4">
                    {formatChangeRequestDescription(request)}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 pt-2 border-t">
                  <Button 
                    variant="outline" 
                    className="border-red-200 text-red-700 hover:bg-red-50" 
                    onClick={() => handleChangeRequest(request.id, 'rejected')}
                    disabled={isResponding}
                  >
                    Reject Changes
                  </Button>
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleChangeRequest(request.id, 'approved')}
                    disabled={isResponding}
                  >
                    Approve Changes
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="payments">
        <h2 className="text-2xl font-bold mb-4">Payment Summary</h2>
        
        {isLoading ? (
          <p>Loading payment information...</p>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-700">Received Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">${calculatePaymentTotals().received}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-yellow-700">Pending Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">${calculatePaymentTotals().pending}</p>
                </CardContent>
              </Card>
            </div>
            
            <h3 className="text-xl font-semibold mb-4">Payment History</h3>
            {payments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-ttc-neutral-600">No payment history yet.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map(payment => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.project?.title || 'Unknown Project'}</TableCell>
                      <TableCell>${payment.amount}</TableCell>
                      <TableCell>{new Date(payment.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          payment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {payment.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </>
        )}
      </TabsContent>
      
      <TabsContent value="reviews">
        <div className="flex items-center mb-8">
          <div className="flex-1">
            <h2 className="text-2xl font-bold">Your Reviews</h2>
            <p className="text-ttc-neutral-600">See what clients are saying about your work</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`w-5 h-5 ${
                    star <= Number(calculateAverageRating()) 
                      ? 'text-yellow-400 fill-yellow-400' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-lg font-bold">{calculateAverageRating()}</span>
            <span className="text-ttc-neutral-500">({reviews.length} reviews)</span>
          </div>
        </div>
        
        {isLoading ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8">
            <Star className="w-12 h-12 mx-auto text-ttc-neutral-400" />
            <p className="mt-4 text-ttc-neutral-600">No reviews yet.</p>
            <p className="mt-2 text-sm text-ttc-neutral-500">
              Complete projects to start receiving reviews from clients.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map(review => (
              <Card key={review.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Project Review</CardTitle>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-4 h-4 ${
                            star <= (review.rating || 0)
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <CardDescription>
                    {new Date(review.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-ttc-neutral-700">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ProfessionalDashboard;
