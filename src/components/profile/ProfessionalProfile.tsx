
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Star, Mail, Phone, MapPin, Award } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProfessionalProfileProps {
  profile: any;
  isOwnProfile: boolean;
}

const ProfessionalProfile: React.FC<ProfessionalProfileProps> = ({ profile, isOwnProfile }) => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [certInput, setCertInput] = useState('');
  const [formData, setFormData] = useState({
    first_name: profile.first_name || '',
    last_name: profile.last_name || '',
    email: profile.email || '',
    phone: profile.phone || '',
    city: profile.city || '',
    state: profile.state || '',
    bio: profile.bio || '',
    skills: profile.skills || [],
    certifications: profile.certifications || []
  });

  useEffect(() => {
    fetchProfessionalData();
  }, [profile.id]);

  const fetchProfessionalData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch professional's accepted applications/work history
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('applications')
        .select(`
          *,
          project:projects(id, title, status, client_id, created_at),
          client:projects(client:profiles(first_name, last_name))
        `)
        .eq('professional_id', profile.id)
        .eq('status', 'accepted');
        
      if (applicationsError) throw applicationsError;
      
      // Fetch reviews received by the professional
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          *,
          client:profiles!reviews_client_id_fkey(first_name, last_name),
          project:projects(title)
        `)
        .eq('professional_id', profile.id);
      
      if (reviewsError) throw reviewsError;
      
      setApplications(applicationsData || []);
      setReviews(reviewsData || []);
    } catch (error) {
      console.error('Error fetching professional data:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleAddCertification = () => {
    if (certInput.trim() && !formData.certifications.includes(certInput.trim())) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, certInput.trim()]
      }));
      setCertInput('');
    }
  };

  const handleRemoveCertification = (certToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert !== certToRemove)
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          state: formData.state,
          bio: formData.bio,
          skills: formData.skills,
          certifications: formData.certifications
        })
        .eq('id', profile.id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    return (total / reviews.length).toFixed(1);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Professional Profile</CardTitle>
            {isOwnProfile && (
              <Button 
                variant={isEditing ? "outline" : "default"}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="first_name">First Name</label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="last_name">Last Name</label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="phone">Phone Number</label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="city">City</label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="state">State</label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1" htmlFor="bio">Bio/Description</label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Skills</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-1 text-xs hover:text-red-500"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddSkill}>Add</Button>
                </div>
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Certifications</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.certifications.map((cert, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {cert}
                      <button
                        type="button"
                        onClick={() => handleRemoveCertification(cert)}
                        className="ml-1 text-xs hover:text-red-500"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a certification..."
                    value={certInput}
                    onChange={(e) => setCertInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCertification();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddCertification}>Add</Button>
                </div>
              </div>
              
              <div className="col-span-2 flex justify-end">
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold">
                    {profile.first_name} {profile.last_name}
                  </h3>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-ttc-neutral-500" />
                      <span>{profile.email || 'No email provided'}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-ttc-neutral-500" />
                      <span>{profile.phone || 'No phone provided'}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-ttc-neutral-500" />
                      <span>
                        {profile.city && profile.state ? 
                          `${profile.city}, ${profile.state}` : 
                          'No location provided'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-2 text-ttc-neutral-500" />
                      <span>{applications.length} Project{applications.length !== 1 ? 's' : ''} Completed</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center mr-2">
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
                    <span className="font-medium">{calculateAverageRating()}</span>
                    <span className="text-gray-500 ml-1">
                      ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                    </span>
                  </div>
                  
                  <div className="border rounded p-4 bg-gray-50 mt-4">
                    <h4 className="font-medium mb-2">Bio</h4>
                    <p className="text-gray-700">
                      {profile.bio || 'No bio information available.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills && profile.skills.length > 0 ? 
                    profile.skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    )) : 
                    <p className="text-ttc-neutral-500">No skills listed</p>
                  }
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Certifications</h3>
                <div>
                  {profile.certifications && profile.certifications.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {profile.certifications.map((cert: string, index: number) => (
                        <li key={index}>{cert}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-ttc-neutral-500">No certifications listed</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="work-history">
        <TabsList>
          <TabsTrigger value="work-history">Work History</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="work-history">
          <Card>
            <CardHeader>
              <CardTitle>Work History</CardTitle>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <p className="text-ttc-neutral-500 text-center py-6">No work history available.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Start Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.project?.title}</TableCell>
                        <TableCell>
                          {app.client?.client?.first_name} {app.client?.client?.last_name}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            app.project?.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            app.project?.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {app.project?.status || 'Unknown'}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(app.project?.created_at || '').toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Client Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {reviews.length === 0 ? (
                <p className="text-ttc-neutral-500 text-center py-6">No reviews received yet.</p>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">
                            {review.client?.first_name} {review.client?.last_name}
                          </p>
                          <p className="text-sm text-ttc-neutral-500">
                            Project: {review.project?.title || 'Unknown Project'}
                          </p>
                        </div>
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
                      <p className="text-ttc-neutral-700">{review.comment}</p>
                      <p className="text-xs text-ttc-neutral-500 mt-2">
                        {new Date(review.created_at || '').toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfessionalProfile;
