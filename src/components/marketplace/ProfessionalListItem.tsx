
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Clock } from 'lucide-react';

interface Professional {
  id: string;
  name: string;
  trade: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  location: string;
  availability: string;
  profileImage: string;
  skills: string[];
  yearsExperience: number;
}

interface ProfessionalListItemProps {
  professional: Professional;
}

const ProfessionalListItem: React.FC<ProfessionalListItemProps> = ({ professional }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <Avatar className="h-16 w-16">
              <AvatarImage src={professional.profileImage} alt={professional.name} />
              <AvatarFallback>{professional.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{professional.name}</h3>
                  <p className="text-ttc-blue-700 font-medium text-lg">{professional.trade}</p>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-ttc-blue-700">
                    ${professional.hourlyRate}
                    <span className="text-sm font-normal text-gray-500">/hour</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {professional.yearsExperience} years experience
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 mt-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{professional.rating}</span>
                <span className="text-gray-500">({professional.reviewCount} reviews)</span>
              </div>
              
              <div className="flex items-center space-x-6 mt-2 text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {professional.location}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {professional.availability}
                </div>
              </div>
              
              <div className="mt-3">
                <div className="flex flex-wrap gap-2">
                  {professional.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
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
