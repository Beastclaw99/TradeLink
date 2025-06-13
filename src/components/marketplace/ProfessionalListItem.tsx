import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StarRating } from '@/components/ui/star-rating';
import type { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ProfessionalListItemProps {
  professional: Profile;
}

const ProfessionalListItem: React.FC<ProfessionalListItemProps> = ({ professional }) => {
  const fullName = `${professional.first_name || 'Anonymous'} ${professional.last_name || ''}`;
  const initials = `${professional.first_name?.[0] || ''}${professional.last_name?.[0] || ''}`;
  const skills = professional.skills || [];
  const hourlyRate = professional.hourly_rate || 0;
  const responseRate = professional.response_rate || 0;
  const onTimeCompletion = professional.on_time_completion || 0;
  const rating = professional.rating || 0;
  const completedProjects = professional.completed_projects || 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <Avatar className="h-16 w-16">
              <AvatarImage src={professional.profile_image_url || `https://api.dicebear.com/6/initials/svg?seed=${fullName}`} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{fullName}</h3>
                  <p className="text-ttc-blue-700 font-medium text-lg">
                    {skills[0] || 'Professional'}
                  </p>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-ttc-blue-700">
                    ${hourlyRate.toFixed(2)}
                    <span className="text-sm font-normal text-gray-500">/hour</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {completedProjects} {completedProjects === 1 ? 'project' : 'projects'} completed
                  </div>
                  {responseRate > 0 && (
                    <div className="text-sm text-gray-600">
                      {responseRate}% response rate
                    </div>
                  )}
                  {onTimeCompletion > 0 && (
                    <div className="text-sm text-gray-600">
                      {onTimeCompletion}% on-time completion
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-1 mt-2">
                <StarRating
                  value={rating}
                  readOnly
                  className="h-4 w-4"
                />
                <span className="font-medium">{rating.toFixed(1)}</span>
              </div>
              
              <div className="mt-3">
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge 
                      key={skill} 
                      variant="secondary" 
                      className="text-xs"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {professional.verification_status === 'verified' && (
                <Badge 
                  variant="secondary" 
                  className="mt-2"
                >
                  Verified Professional
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex flex-col space-y-2 ml-4">
            <Button>View Profile</Button>
            <Button variant="outline">Contact</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfessionalListItem;
