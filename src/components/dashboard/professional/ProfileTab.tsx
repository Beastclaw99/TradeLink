
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Edit, Save, X } from "lucide-react";

interface ProfileTabProps {
  profile: any;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  updateProfile: (data: any) => void;
  isSubmitting: boolean;
  calculateAverageRating: () => number;
}

const ProfileTab: React.FC<ProfileTabProps> = ({
  profile,
  isEditing,
  setIsEditing,
  updateProfile,
  isSubmitting,
  calculateAverageRating
}) => {
  const [editedProfile, setEditedProfile] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    hourly_rate: profile?.hourly_rate || '',
  });

  const handleSave = () => {
    updateProfile(editedProfile);
  };

  const handleCancel = () => {
    setEditedProfile({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      bio: profile?.bio || '',
      location: profile?.location || '',
      hourly_rate: profile?.hourly_rate || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Professional Profile</CardTitle>
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave} disabled={isSubmitting}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">First Name</Label>
              {isEditing ? (
                <Input
                  id="first_name"
                  value={editedProfile.first_name}
                  onChange={(e) => setEditedProfile({ ...editedProfile, first_name: e.target.value })}
                />
              ) : (
                <p className="mt-1">{profile?.first_name || 'Not provided'}</p>
              )}
            </div>
            <div>
              <Label htmlFor="last_name">Last Name</Label>
              {isEditing ? (
                <Input
                  id="last_name"
                  value={editedProfile.last_name}
                  onChange={(e) => setEditedProfile({ ...editedProfile, last_name: e.target.value })}
                />
              ) : (
                <p className="mt-1">{profile?.last_name || 'Not provided'}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            {isEditing ? (
              <Textarea
                id="bio"
                value={editedProfile.bio}
                onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                rows={3}
              />
            ) : (
              <p className="mt-1">{profile?.bio || 'No bio provided'}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              {isEditing ? (
                <Input
                  id="location"
                  value={editedProfile.location}
                  onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                />
              ) : (
                <p className="mt-1">{profile?.location || 'Not provided'}</p>
              )}
            </div>
            <div>
              <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
              {isEditing ? (
                <Input
                  id="hourly_rate"
                  type="number"
                  value={editedProfile.hourly_rate}
                  onChange={(e) => setEditedProfile({ ...editedProfile, hourly_rate: e.target.value })}
                />
              ) : (
                <p className="mt-1">${profile?.hourly_rate || 'Not set'}</p>
              )}
            </div>
          </div>

          <div>
            <Label>Skills</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {profile?.skills?.map((skill: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              )) || <p className="text-muted-foreground">No skills listed</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Rating</Label>
              <p className="mt-1">{calculateAverageRating().toFixed(1)} ⭐</p>
            </div>
            <div>
              <Label>Completed Projects</Label>
              <p className="mt-1">{profile?.completed_projects || 0}</p>
            </div>
            <div>
              <Label>Response Rate</Label>
              <p className="mt-1">{profile?.response_rate || 0}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileTab;
