import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import PortfolioUpload from '@/components/profile/PortfolioUpload';
import ProfileImageUpload from '@/components/profile/ProfileImageUpload';
import { ProfileData } from '@/components/profile/types';

const EditProfile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'personal';
  
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState('');
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    location: '',
    phone: '',
    email: '',
    hourly_rate: '',
    availability: '' as 'available' | 'busy' | 'unavailable' | '',
    skills: [] as string[],
    certifications: [] as string[],
    years_of_experience: '',
    profile_visibility: true,
    show_email: true,
    show_phone: true,
    allow_messages: true,
  });

  const fetchProfile = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      // Cast the database profile to our ProfileData type
      const profileData: ProfileData = {
        ...data,
        bio: data.bio || null,
        location: data.location || null,
        phone: data.phone || null,
        email: data.email || null,
        hourly_rate: data.hourly_rate || null,
        availability: (data.availability as 'available' | 'busy' | 'unavailable') || null,
        skills: data.skills || null,
        certifications: data.certifications || null,
        completed_projects: data.completed_projects || null,
        response_rate: data.response_rate || null,
        on_time_completion: data.on_time_completion || null,
        profile_visibility: data.profile_visibility ?? true,
        show_email: data.show_email ?? true,
        show_phone: data.show_phone ?? true,
        allow_messages: data.allow_messages ?? true,
        profile_image_url: data.profile_image_url || null,
        verification_status: (data.verification_status as 'unverified' | 'pending' | 'verified') || null,
        years_of_experience: data.years_of_experience || null,
      };
      
      setProfile(profileData);
      setFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        bio: data.bio || '',
        location: data.location || '',
        phone: data.phone || '',
        email: data.email || '',
        hourly_rate: data.hourly_rate?.toString() || '',
        availability: (data.availability as 'available' | 'busy' | 'unavailable') || '',
        skills: data.skills || [],
        certifications: data.certifications || [],
        years_of_experience: data.years_of_experience?.toString() || '',
        profile_visibility: data.profile_visibility ?? true,
        show_email: data.show_email ?? true,
        show_phone: data.show_phone ?? true,
        allow_messages: data.allow_messages ?? true,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/profile/edit?tab=${value}`);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill)
    });
  };

  const handleAddCertification = () => {
    if (newCertification.trim() && !formData.certifications.includes(newCertification.trim())) {
      setFormData({
        ...formData,
        certifications: [...formData.certifications, newCertification.trim()]
      });
      setNewCertification('');
    }
  };

  const handleRemoveCertification = (certification: string) => {
    setFormData({
      ...formData,
      certifications: formData.certifications.filter(c => c !== certification)
    });
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    setIsSaving(true);
    try {
      const updateData: any = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        bio: formData.bio,
        location: formData.location,
        phone: formData.phone,
        email: formData.email,
        profile_visibility: formData.profile_visibility,
        show_email: formData.show_email,
        show_phone: formData.show_phone,
        allow_messages: formData.allow_messages,
      };

      // Only include professional-specific fields if the user is a professional
      if (profile?.account_type === 'professional') {
        updateData.hourly_rate = formData.hourly_rate ? parseFloat(formData.hourly_rate) : null;
        updateData.availability = formData.availability || null;
        updateData.skills = formData.skills;
        updateData.certifications = formData.certifications;
        updateData.years_of_experience = formData.years_of_experience ? parseInt(formData.years_of_experience) : null;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
      
      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <div>Loading...</div>
      </div>
    );
  }

  const isProfessional = profile?.account_type === 'professional';

  return (
    <div className="container-custom py-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className={`grid w-full ${isProfessional ? 'grid-cols-5' : 'grid-cols-3'} mb-8`}>
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              {isProfessional && (
                <>
                  <TabsTrigger value="professional">Professional</TabsTrigger>
                  <TabsTrigger value="skills">Skills & Certifications</TabsTrigger>
                </>
              )}
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="photo">Profile Photo</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="profile_visibility">Profile Visibility</Label>
                    <Switch
                      id="profile_visibility"
                      checked={formData.profile_visibility}
                      onCheckedChange={(checked) => setFormData({ ...formData, profile_visibility: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show_email">Show Email</Label>
                    <Switch
                      id="show_email"
                      checked={formData.show_email}
                      onCheckedChange={(checked) => setFormData({ ...formData, show_email: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show_phone">Show Phone</Label>
                    <Switch
                      id="show_phone"
                      checked={formData.show_phone}
                      onCheckedChange={(checked) => setFormData({ ...formData, show_phone: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allow_messages">Allow Messages</Label>
                    <Switch
                      id="allow_messages"
                      checked={formData.allow_messages}
                      onCheckedChange={(checked) => setFormData({ ...formData, allow_messages: checked })}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {isProfessional && (
              <>
                <TabsContent value="professional">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
                      <Input
                        id="hourly_rate"
                        type="number"
                        value={formData.hourly_rate}
                        onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="years_of_experience">Years of Experience</Label>
                      <Input
                        id="years_of_experience"
                        type="number"
                        value={formData.years_of_experience}
                        onChange={(e) => setFormData({ ...formData, years_of_experience: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="availability">Availability</Label>
                      <select
                        id="availability"
                        value={formData.availability}
                        onChange={(e) => setFormData({ ...formData, availability: e.target.value as 'available' | 'busy' | 'unavailable' })}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="">Select availability</option>
                        <option value="available">Available</option>
                        <option value="busy">Busy</option>
                        <option value="unavailable">Unavailable</option>
                      </select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="skills">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Skills</Label>
                        <div className="flex gap-2">
                          <Input
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            placeholder="Add a skill"
                          />
                          <Button onClick={handleAddSkill}>Add</Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                              <button
                                onClick={() => handleRemoveSkill(skill)}
                                className="ml-2 hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Certifications</Label>
                        <div className="flex gap-2">
                          <Input
                            value={newCertification}
                            onChange={(e) => setNewCertification(e.target.value)}
                            placeholder="Add a certification"
                          />
                          <Button onClick={handleAddCertification}>Add</Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.certifications.map((certification) => (
                            <Badge key={certification} variant="secondary">
                              {certification}
                              <button
                                onClick={() => handleRemoveCertification(certification)}
                                className="ml-2 hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </>
            )}

            <TabsContent value="portfolio">
              <PortfolioUpload userId={user?.id || ''} />
            </TabsContent>

            <TabsContent value="photo">
              <ProfileImageUpload userId={user?.id || ''} />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-6">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProfile;
