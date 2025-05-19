
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Loader2, Star, Award, Clock, Briefcase, File } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileData, ProfessionalStats, ClientStats } from '@/components/profile/types';
import { Project, Review, Payment } from '@/components/dashboard/types';

const Profile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [professionalStats, setProfessionalStats] = useState<ProfessionalStats>({
    completedProjects: 0,
    activeProjects: 0,
    totalEarnings: 0,
    averageRating: 0,
    totalReviews: 0
  });
  const [clientStats, setClientStats] = useState<ClientStats>({
    postedProjects: 0,
    completedProjects: 0,
    activeProjects: 0,
    totalSpent: 0
  });

  useEffect(() => {
    // Check if viewing own profile
    if (user && (id === user.id || !id)) {
      setIsOwnProfile(true);
      fetchProfileData(user.id);
    } else if (id) {
      setIsOwnProfile(false);
      fetchProfileData(id);
    } else {
      navigate('/dashboard');
    }
  }, [id, user]);

  const fetchProfileData = async (profileId: string) => {
    try {
      setIsLoading(true);
      
      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single();
        
      if (profileError) throw profileError;
      
      setProfile(profileData);
      
      // Fetch different data based on account type
      if (profileData.account_type === 'professional') {
        // For professionals
        await fetchProfessionalData(profileId);
      } else {
        // For clients
        await fetchClientData(profileId);
      }
      
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfessionalData = async (profileId: string) => {
    try {
      // Fetch projects assigned to this professional
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          client:profiles!projects_client_id_fkey(first_name, last_name)
        `)
        .eq('assigned_to', profileId);
        
      if (projectsError) throw projectsError;
      
      setProjects(projectsData || []);
      
      // Fetch reviews for this professional
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('professional_id', profileId);
        
      if (reviewsError) throw reviewsError;
      
      setReviews(reviewsData || []);
      
      // Fetch payments to calculate earnings
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .eq('professional_id', profileId)
        .eq('status', 'completed');
        
      if (paymentsError) throw paymentsError;
      
      // Calculate professional stats
      const completedProjects = projectsData ? projectsData.filter(p => p.status === 'completed').length : 0;
      const activeProjects = projectsData ? projectsData.filter(p => p.status === 'assigned').length : 0;
      const totalEarnings = paymentsData ? paymentsData.reduce((sum, payment) => sum + payment.amount, 0) : 0;
      const totalReviews = reviewsData ? reviewsData.length : 0;
      const totalRating = reviewsData ? reviewsData.reduce((sum, review) => sum + (review.rating || 0), 0) : 0;
      const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;
      
      setProfessionalStats({
        completedProjects,
        activeProjects,
        totalEarnings,
        averageRating,
        totalReviews
      });
      
    } catch (error) {
      console.error('Error fetching professional data:', error);
    }
  };

  const fetchClientData = async (profileId: string) => {
    try {
      // Fetch projects posted by this client
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', profileId);
        
      if (projectsError) throw projectsError;
      
      setProjects(projectsData || []);
      
      // Fetch payments to calculate spending
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .eq('client_id', profileId)
        .eq('status', 'completed');
        
      if (paymentsError) throw paymentsError;
      
      // Calculate client stats
      const postedProjects = projectsData ? projectsData.length : 0;
      const completedProjects = projectsData ? projectsData.filter(p => p.status === 'completed').length : 0;
      const activeProjects = projectsData ? projectsData.filter(p => p.status === 'assigned').length : 0;
      const totalSpent = paymentsData ? paymentsData.reduce((sum, payment) => sum + payment.amount, 0) : 0;
      
      setClientStats({
        postedProjects,
        completedProjects,
        activeProjects,
        totalSpent
      });
      
    } catch (error) {
      console.error('Error fetching client data:', error);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    return (total / reviews.length).toFixed(1);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-ttc-blue-700" />
          <span className="ml-2 text-lg">Loading profile...</span>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="container-custom py-8">
          <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
          <p>The requested profile could not be found.</p>
          <Button 
            onClick={() => navigate('/dashboard')} 
            className="mt-4"
          >
            Return to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }

  const renderProfessionalProfile = () => (
    <>
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="" alt={`${profile.first_name} ${profile.last_name}`} />
                  <AvatarFallback className="text-2xl bg-ttc-blue-100 text-ttc-blue-700">
                    {profile.first_name?.[0]}{profile.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                {isOwnProfile && (
                  <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                    Edit Profile
                  </Button>
                )}
              </div>
              <CardTitle className="mt-4">{profile.first_name} {profile.last_name}</CardTitle>
              <div className="flex items-center mt-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                      key={star} 
                      className={`h-4 w-4 ${
                        star <= professionalStats.averageRating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm">
                  {professionalStats.averageRating.toFixed(1)} ({professionalStats.totalReviews} reviews)
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="font-medium mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No skills listed</p>
                )}
              </div>
              
              <h3 className="font-medium mt-4 mb-2">Member since</h3>
              <p className="text-sm">{new Date(profile.created_at).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full md:w-2/3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 flex items-center">
                  <Award className="mr-2 h-4 w-4" />
                  Completed Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{professionalStats.completedProjects}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 flex items-center">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Active Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{professionalStats.activeProjects}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 flex items-center">
                  <Star className="mr-2 h-4 w-4" />
                  Total Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{professionalStats.totalReviews}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  Total Earnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">${professionalStats.totalEarnings.toFixed(2)}</p>
              </CardContent>
            </Card>
          </div>
          
          {reviews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews.slice(0, 3).map(review => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex justify-between mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star 
                              key={star} 
                              className={`h-4 w-4 ${
                                star <= (review.rating || 0)
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
                {reviews.length > 3 && (
                  <Button variant="link" className="px-0 mt-2">
                    View all {reviews.length} reviews
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="projects">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="projects">
          <h2 className="text-xl font-bold mb-4">Projects</h2>
          {projects.length === 0 ? (
            <p className="text-gray-500">No projects yet.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {projects.map(project => (
                <Card key={project.id}>
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                    <div className="flex justify-between items-center">
                      <Badge 
                        className={`${
                          project.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          project.status === 'assigned' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {project.status}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Budget: ${project.budget}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-3">{project.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="reviews">
          <h2 className="text-xl font-bold mb-4">Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            <div className="space-y-6">
              {reviews.map(review => (
                <Card key={review.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star 
                            key={star} 
                            className={`h-5 w-5 ${
                              star <= (review.rating || 0)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );

  const renderClientProfile = () => (
    <>
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="" alt={`${profile.first_name} ${profile.last_name}`} />
                  <AvatarFallback className="text-2xl bg-ttc-blue-100 text-ttc-blue-700">
                    {profile.first_name?.[0]}{profile.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                {isOwnProfile && (
                  <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                    Edit Profile
                  </Button>
                )}
              </div>
              <CardTitle className="mt-4">{profile.first_name} {profile.last_name}</CardTitle>
              <div className="text-sm text-gray-500 mt-1">Client</div>
            </CardHeader>
            <CardContent>
              <h3 className="font-medium mt-4 mb-2">Member since</h3>
              <p className="text-sm">{new Date(profile.created_at).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full md:w-2/3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 flex items-center">
                  <File className="mr-2 h-4 w-4" />
                  Posted Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{clientStats.postedProjects}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 flex items-center">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Active Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{clientStats.activeProjects}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 flex items-center">
                  <Award className="mr-2 h-4 w-4" />
                  Completed Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{clientStats.completedProjects}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  Total Spend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">${clientStats.totalSpent.toFixed(2)}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="projects">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>
        
        <TabsContent value="projects">
          <h2 className="text-xl font-bold mb-4">Projects</h2>
          {projects.length === 0 ? (
            <p className="text-gray-500">No projects posted yet.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {projects.map(project => (
                <Card key={project.id}>
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                    <div className="flex justify-between items-center">
                      <Badge 
                        className={`${
                          project.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          project.status === 'assigned' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {project.status}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Budget: ${project.budget}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-3">{project.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );

  return (
    <Layout>
      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        
        {profile.account_type === 'professional' ? (
          renderProfessionalProfile()
        ) : (
          renderClientProfile()
        )}
      </div>
    </Layout>
  );
};

export default Profile;
