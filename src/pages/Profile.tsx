import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PortfolioUpload from '@/components/profile/PortfolioUpload';
import {
  MapPin,
  Star,
  Calendar,
  Phone,
  Mail,
  MessageCircle,
  Edit,
  Camera,
  Loader2,
  Briefcase
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ProfileData {
  id: string;
  first_name: string;
  last_name: string;
  account_type: 'professional' | 'client';
  profile_image?: string;
  location?: string;
  rating?: number;
  completed_projects?: number;
  created_at: string;
  phone?: string;
  email?: string;
  bio?: string;
  skills?: string[];
  hourly_rate?: number;
  availability?: string;
  portfolio_images?: string[];
  response_rate?: number;
  on_time_completion?: number;
}

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOwnProfile, setIsOwnProfile] = useState(!id); // If no ID, it's own profile
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileId = id || user?.id;
        if (!profileId) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', profileId)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [id, user]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-ttc-blue-700" />
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="container-custom py-8">
          <h1 className="text-3xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-gray-600">The requested profile could not be found.</p>
        </div>
      </Layout>
    );
  }

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  const handleUpdateContactInfo = () => {
    navigate('/profile/edit?tab=contact');
  };

  const handleMessage = () => {
    navigate(`/messages?recipient=${profile?.id}`);
  };

  const handleHire = () => {
    navigate('/projects/create');
  };

  const handleRequestQuote = () => {
    navigate(`/projects/create?professional=${profile?.id}`);
  };

  const handleReportProfile = () => {
    navigate(`/report?type=profile&id=${profile?.id}`);
  };

  return (
    <Layout>
      <div className="bg-gray-50 py-8">
        <div className="container-custom">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="relative">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={profile?.profile_image || `https://api.dicebear.com/6/initials/svg?seed=${profile?.first_name} ${profile?.last_name}`} />
                    <AvatarFallback className="text-2xl">{profile?.first_name?.[0]}{profile?.last_name?.[0]}</AvatarFallback>
                  </Avatar>
                  {isOwnProfile && (
                    <Button 
                      size="sm" 
                      className="absolute -bottom-2 -right-2 rounded-full p-2"
                      onClick={() => navigate('/profile/edit?tab=photo')}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{profile?.first_name} {profile?.last_name}</h1>
                      <p className="text-xl text-ttc-blue-600 font-medium mb-2">{profile?.account_type === 'professional' ? 'Professional' : 'Client'}</p>
                      <div className="flex items-center gap-4 text-gray-600">
                        {profile?.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {profile.location}
                          </div>
                        )}
                        {profile?.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {profile.rating} ({profile.completed_projects || 0} projects)
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Joined {new Date(profile?.created_at || '').toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    {isOwnProfile ? (
                      <Button 
                        className="flex items-center gap-2"
                        onClick={handleEditProfile}
                      >
                        <Edit className="h-4 w-4" />
                        Edit Profile
                      </Button>
                    ) : (
                      <>
                        <Button 
                          variant="outline" 
                          className="flex items-center gap-2"
                          onClick={handleMessage}
                        >
                          <MessageCircle className="h-4 w-4" />
                          Message
                        </Button>
                        <Button 
                          className="flex items-center gap-2"
                          onClick={handleHire}
                        >
                          <Briefcase className="h-4 w-4" />
                          Hire Now
                        </Button>
                      </>
                    )}
                  </div>
                  
                  {profile?.account_type === 'professional' && (
                    <div className="flex items-center gap-6 mb-4">
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        {profile.availability || 'Available'}
                      </Badge>
                      {profile.hourly_rate && (
                        <span className="text-lg font-semibold">TTD {profile.hourly_rate}/hour</span>
                      )}
                    </div>
                  )}
                  
                  {profile?.bio && (
                    <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <div className="space-y-6">
                    {profile?.skills && profile.skills.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Skills & Expertise</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {profile.skills.map((skill, index) => (
                              <Badge key={index} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {profile?.account_type === 'professional' && isOwnProfile && (
                      <PortfolioUpload userId={profile.id} />
                    )}

                    {profile?.portfolio_images && profile.portfolio_images.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Portfolio Gallery</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {profile.portfolio_images.map((image, index) => (
                              <div key={index} className="aspect-square rounded-lg overflow-hidden">
                                <img
                                  src={image}
                                  alt={`Portfolio image ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="projects">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">No projects to display yet.</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews">
                  <Card>
                    <CardHeader>
                      <CardTitle>Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">No reviews to display yet.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!isOwnProfile && (
                    <>
                      {profile?.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-gray-500" />
                          <span>{profile.phone}</span>
                        </div>
                      )}
                      {profile?.email && (
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-gray-500" />
                          <span>{profile.email}</span>
                        </div>
                      )}
                    </>
                  )}
                  
                  {isOwnProfile && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Contact details are only visible to clients you're working with.</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleUpdateContactInfo}
                      >
                        Update Contact Info
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {profile?.account_type === 'professional' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Projects Completed</span>
                      <span className="font-semibold">{profile.completed_projects || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Rating</span>
                      <span className="font-semibold">{profile.rating || 0}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Response Rate</span>
                      <span className="font-semibold">{profile.response_rate || 0}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">On-Time Completion</span>
                      <span className="font-semibold">{profile.on_time_completion || 0}%</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {!isOwnProfile && (
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      className="w-full"
                      onClick={handleRequestQuote}
                    >
                      Request Quote
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleMessage}
                    >
                      Send Message
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleReportProfile}
                    >
                      Report Profile
                    </Button>
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

export default Profile;
