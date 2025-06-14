
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { MapPin, Phone, Mail, Calendar, User, Building, Star, Award, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Profile } from '@/types/database';

interface ProfileTabProps {
  profile: Profile | null;
  isLoading: boolean;
  onProfileUpdate: () => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ profile, isLoading, onProfileUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editData, setEditData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    location: profile?.location || '',
    bio: profile?.bio || '',
    business_name: profile?.business_name || '',
    business_description: profile?.business_description || ''
  });
  const { toast } = useToast();

  const handleEdit = () => {
    setEditData({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      location: profile?.location || '',
      bio: profile?.bio || '',
      business_name: profile?.business_name || '',
      business_description: profile?.business_description || ''
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!profile?.id) return;

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('profiles')
        .update(editData)
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully."
      });

      setIsEditing(false);
      onProfileUpdate();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      location: profile?.location || '',
      bio: profile?.bio || '',
      business_name: profile?.business_name || '',
      business_description: profile?.business_description || ''
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-600">Profile not found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile.profile_image_url || undefined} />
                <AvatarFallback>
                  {(profile.first_name?.[0] || '') + (profile.last_name?.[0] || '')}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">
                  {profile.first_name || ''} {profile.last_name || ''}
                </CardTitle>
                <CardDescription>
                  {profile.business_name && (
                    <span className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      {profile.business_name}
                    </span>
                  )}
                </CardDescription>
              </div>
            </div>
            {!isEditing && (
              <Button onClick={handleEdit}>
                <User className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={editData.first_name}
                    onChange={(e) => setEditData({ ...editData, first_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={editData.last_name}
                    onChange={(e) => setEditData({ ...editData, last_name: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={editData.location}
                  onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="business_name">Business Name</Label>
                <Input
                  id="business_name"
                  value={editData.business_name}
                  onChange={(e) => setEditData({ ...editData, business_name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={editData.bio}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="business_description">Business Description</Label>
                <Textarea
                  id="business_description"
                  value={editData.business_description}
                  onChange={(e) => setEditData({ ...editData, business_description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleSave} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{profile.email}</span>
                  </div>
                )}
                {profile.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{profile.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>Member since {new Date(profile.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <Separator />

              {/* Bio */}
              {profile.bio && (
                <div>
                  <h3 className="font-semibold mb-2">About</h3>
                  <p className="text-gray-700">{profile.bio}</p>
                </div>
              )}

              {/* Business Description */}
              {profile.business_description && (
                <div>
                  <h3 className="font-semibold mb-2">Business Description</h3>
                  <p className="text-gray-700">{profile.business_description}</p>
                </div>
              )}

              {/* Account Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold">{profile.rating || 0}</span>
                  </div>
                  <p className="text-sm text-gray-600">Rating</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="font-semibold">{profile.completed_projects || 0}</span>
                  </div>
                  <p className="text-sm text-gray-600">Projects Completed</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Award className="w-4 h-4 text-blue-500" />
                    <Badge variant={profile.verification_status === 'verified' ? 'default' : 'secondary'}>
                      {profile.verification_status || 'pending'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">Status</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileTab;
