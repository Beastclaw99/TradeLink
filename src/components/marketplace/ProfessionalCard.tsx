import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StarRating } from '@/components/ui/star-rating';
import type { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ProfessionalCardProps {
  professional: Profile;
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ professional }) => {
  const fullName = `${professional.first_name || 'Anonymous'} ${professional.last_name || ''}`;
  const initials = `${professional.first_name?.[0] || ''}${professional.last_name?.[0] || ''}`;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={professional.profile_image || `https://api.dicebear.com/6/initials/svg?seed=${fullName}`} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          
          <h3 className="text-xl font-semibold">{fullName}</h3>
          <p className="text-ttc-blue-700 font-medium">
            {professional.skills?.[0] || 'Professional'}
          </p>
          
          <div className="flex items-center space-x-1 mt-2">
            <StarRating
              value={professional.rating || 0}
              onChange={() => {}}
              className="h-4 w-4"
            />
            <span className="font-medium">{professional.rating?.toFixed(1) || '0.0'}</span>
          </div>
          
          <div className="mt-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {professional.skills?.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <div className="text-2xl font-bold text-ttc-blue-700">
              ${professional.hourly_rate || 0}
              <span className="text-sm font-normal text-gray-500">/hour</span>
            </div>
            <div className="text-sm text-gray-600">
              {professional.completed_projects || 0} projects completed
            </div>
            {professional.response_rate && (
              <div className="text-sm text-gray-600">
                {professional.response_rate}% response rate
              </div>
            )}
            {professional.on_time_completion && (
              <div className="text-sm text-gray-600">
                {professional.on_time_completion}% on-time completion
              </div>
            )}
          </div>

          {professional.verification_status === 'verified' && (
            <Badge className="mt-2" variant="secondary">
              Verified Professional
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center space-x-2 p-6 pt-0">
        <Button>View Profile</Button>
        <Button variant="outline">Contact</Button>
      </CardFooter>
    </Card>
  );
};

export default ProfessionalCard;
