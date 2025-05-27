import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Phone, MessageSquare, Heart, Users } from 'lucide-react';

const Network: React.FC = () => {
  // Mock data for preferred professionals
  const preferredProfessionals = [
    {
      id: 1,
      name: "John Smith",
      trade: "Electrician",
      rating: 4.8,
      reviews: 24,
      projects: 8,
      skills: ["Electrical", "Wiring", "Safety"],
      lastProject: "Kitchen Renovation - March 2024"
    },
    {
      id: 2,
      name: "Maria Rodriguez",
      trade: "Plumber",
      rating: 4.9,
      reviews: 31,
      projects: 12,
      skills: ["Plumbing", "Emergency Repairs", "Installation"],
      lastProject: "Bathroom Upgrade - February 2024"
    },
    {
      id: 3,
      name: "David Johnson",
      trade: "Carpenter",
      rating: 4.7,
      reviews: 18,
      projects: 5,
      skills: ["Carpentry", "Custom Work", "Furniture"],
      lastProject: "Deck Construction - January 2024"
    }
  ];

  return (
    <Layout>
      <div className="bg-ttc-blue-800 py-12 text-white">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-4">My Network</h1>
          <p className="text-xl text-blue-50">
            Your preferred professionals and trusted trade experts.
          </p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Preferred Professionals</h2>
            <p className="text-gray-600">Professionals you've worked with and trust</p>
          </div>
          <Button className="bg-ttc-blue-600 hover:bg-ttc-blue-700">
            Find New Professionals
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {preferredProfessionals.map((professional) => (
            <Card key={professional.id} className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="" alt={professional.name} />
                      <AvatarFallback className="bg-ttc-blue-100 text-ttc-blue-700">
                        {professional.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{professional.name}</CardTitle>
                      <CardDescription>{professional.trade}</CardDescription>
                    </div>
                  </div>
                  <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-4 h-4 ${
                          star <= professional.rating 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {professional.rating} ({professional.reviews} reviews)
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {professional.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Projects Together</h4>
                  <p className="text-sm">{professional.projects} completed</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Last Project</h4>
                  <p className="text-sm">{professional.lastProject}</p>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Phone className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {preferredProfessionals.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Preferred Professionals Yet</h3>
              <p className="text-gray-600 mb-4">
                Start working with professionals to build your trusted network.
              </p>
              <Button className="bg-ttc-blue-600 hover:bg-ttc-blue-700">
                Browse Professionals
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Network;
