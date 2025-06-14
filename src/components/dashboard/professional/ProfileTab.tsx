
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, User, Mail, Phone, MapPin, Star, Briefcase, Clock } from 'lucide-react';

interface ProfileTabProps {
  profile: any;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  updateProfile: (data: any) => void;
  isSubmitting: boolean;
}

const ProfileTab: React.FC<ProfileTabProps> = ({
  profile,
  isEditing,
  setIsEditing,
  updateProfile,
  isSubmitting
}) => {
  if (!profile) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Profile Not Found</h3>
          <p className="text-gray-600">
            Unable to load your profile information.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Professional Profile</h2>
        <Button
          variant="outline"
          onClick={handleEdit}
          disabled={isSubmitting}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-lg">
                {profile.first_name && profile.last_name 
                  ? `${profile.first_name} ${profile.last_name}`
                  : 'Not specified'
                }
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Account Type</label>
              <p className="text-lg capitalize">{profile.account_type || 'Not specified'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span>{profile.email}</span>
              </div>
            )}
            {profile.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{profile.phone}</span>
              </div>
            )}
          </div>

          {profile.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span>{profile.location}</span>
            </div>
          )}

          {profile.bio && (
            <div>
              <label className="text-sm font-medium text-gray-500">Bio</label>
              <p className="text-gray-700 mt-1">{profile.bio}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Professional Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {profile.rating && (
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span>{profile.rating.toFixed(1)} Rating</span>
              </div>
            )}
            {profile.years_of_experience !== null && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span>{profile.years_of_experience} Years Experience</span>
              </div>
            )}
            {profile.completed_projects !== null && (
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-gray-400" />
                <span>{profile.completed_projects} Projects Completed</span>
              </div>
            )}
          </div>

          {profile.hourly_rate && (
            <div>
              <label className="text-sm font-medium text-gray-500">Hourly Rate</label>
              <p className="text-lg">${profile.hourly_rate}/hour</p>
            </div>
          )}

          {profile.availability && (
            <div>
              <label className="text-sm font-medium text-gray-500">Availability</label>
              <p className="text-gray-700">{profile.availability}</p>
            </div>
          )}

          {profile.skills && profile.skills.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-500">Skills</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.skills.map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {profile.specialties && profile.specialties.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-500">Specialties</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.specialties.map((specialty: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {profile.service_areas && profile.service_areas.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-500">Service Areas</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.service_areas.map((area: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Business Information */}
      {(profile.business_name || profile.business_description || profile.license_number) && (
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.business_name && (
              <div>
                <label className="text-sm font-medium text-gray-500">Business Name</label>
                <p className="text-lg">{profile.business_name}</p>
              </div>
            )}

            {profile.business_description && (
              <div>
                <label className="text-sm font-medium text-gray-500">Business Description</label>
                <p className="text-gray-700">{profile.business_description}</p>
              </div>
            )}

            {profile.license_number && (
              <div>
                <label className="text-sm font-medium text-gray-500">License Number</label>
                <p className="text-gray-700">{profile.license_number}</p>
              </div>
            )}

            {profile.insurance_info && (
              <div>
                <label className="text-sm font-medium text-gray-500">Insurance Information</label>
                <p className="text-gray-700">{profile.insurance_info}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfileTab;
