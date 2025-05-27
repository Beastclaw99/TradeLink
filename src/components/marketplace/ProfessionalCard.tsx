
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
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

interface ProfessionalCardProps {
  professional: Professional;
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ professional }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={professional.profileImage} alt={professional.name} />
            <AvatarFallback>{professional.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold truncate">{professional.name}</h3>
            <p className="text-ttc-blue-700 font-medium">{professional.trade}</p>
            
            <div className="flex items-center space-x-1 mt-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{professional.rating}</span>
              <span className="text-sm text-gray-500">({professional.reviewCount} reviews)</span>
            </div>
            
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {professional.location}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {professional.availability}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex flex-wrap gap-1">
            {professional.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold text-ttc-blue-700">
              ${professional.hourlyRate}
            </span>
            <span className="text-sm text-gray-500">/hour</span>
          </div>
          <span className="text-sm text-gray-600">
            {professional.yearsExperience} years exp.
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        <div className="w-full space-y-2">
          <Button className="w-full">View Profile</Button>
          <Button variant="outline" className="w-full">Contact</Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProfessionalCard;
