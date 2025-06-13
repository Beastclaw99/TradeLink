import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Briefcase, Award, Mail, Phone } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type AccountType = Database['public']['Enums']['account_type_enum'];

interface ProfileCardProps {
  profile: Profile;
  onEdit?: (profile: Profile) => void;
  onViewDetails?: (profile: Profile) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onEdit,
  onViewDetails
}) => {
  const getAccountTypeBadge = (type: AccountType) => {
    const typeConfig = {
      client: { color: 'bg-blue-100 text-blue-800' },
      professional: { color: 'bg-green-100 text-green-800' }
    };
    
    const config = typeConfig[type];
    
    return (
      <Badge variant="outline" className={config.color}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const renderRatingStars = (rating: number | null) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < (rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              {profile.first_name} {profile.last_name}
            </CardTitle>
            <CardDescription>
              {profile.business_name || profile.role || 'Member'}
            </CardDescription>
          </div>
          {getAccountTypeBadge(profile.account_type)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {profile.bio && (
            <div>
              <p className="text-sm font-medium mb-1">About:</p>
              <p className="text-sm text-gray-600 line-clamp-3">
                {profile.bio}
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            {profile.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{profile.location}</span>
              </div>
            )}
            {profile.years_of_experience && (
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{profile.years_of_experience} years experience</span>
              </div>
            )}
            {profile.completed_projects && (
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{profile.completed_projects} projects completed</span>
              </div>
            )}
            {profile.rating && (
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-gray-500" />
                {renderRatingStars(profile.rating)}
              </div>
            )}
          </div>
          
          {profile.skills && profile.skills.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Skills:</p>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap gap-4">
            {profile.show_email && profile.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{profile.email}</span>
              </div>
            )}
            {profile.show_phone && profile.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{profile.phone}</span>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-2">
            {onViewDetails && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(profile)}
              >
                View Details
              </Button>
            )}
            {onEdit && (
              <Button
                size="sm"
                onClick={() => onEdit(profile)}
              >
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard; 