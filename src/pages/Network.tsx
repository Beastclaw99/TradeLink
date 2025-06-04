
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Star, MapPin, Phone, Mail, Plus, Users } from 'lucide-react';

const Network: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for preferred professionals
  const [professionals] = useState([
    {
      id: '1',
      name: 'John Smith',
      profession: 'Electrician',
      location: 'Port of Spain',
      rating: 4.8,
      projects: 15,
      phone: '+1 (868) 555-0123',
      email: 'john.smith@email.com',
      skills: ['Electrical Installation', 'Home Wiring', 'Commercial Electric'],
      joined: '2023-06-15'
    },
    {
      id: '2',
      name: 'Maria Rodriguez',
      profession: 'Plumber',
      location: 'San Fernando',
      rating: 4.9,
      projects: 23,
      phone: '+1 (868) 555-0456',
      email: 'maria.rodriguez@email.com',
      skills: ['Pipe Installation', 'Leak Repair', 'Bathroom Renovation'],
      joined: '2023-03-20'
    },
    {
      id: '3',
      name: 'David Chen',
      profession: 'Carpenter',
      location: 'Chaguanas',
      rating: 4.7,
      projects: 18,
      phone: '+1 (868) 555-0789',
      email: 'david.chen@email.com',
      skills: ['Custom Furniture', 'Kitchen Cabinets', 'Flooring'],
      joined: '2023-01-10'
    }
  ]);

  const filteredProfessionals = professionals.filter(prof =>
    prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prof.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prof.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Layout>
      <div className="bg-gray-50 py-8">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Network</h1>
              <p className="text-gray-600">
                Manage your preferred professionals and build lasting relationships
              </p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Professional
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search your network..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {filteredProfessionals.map((professional) => (
                  <Card key={professional.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={`https://api.dicebear.com/6/initials/svg?seed=${professional.name}`} />
                          <AvatarFallback>{professional.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold mb-1">{professional.name}</h3>
                              <p className="text-ttc-blue-600 font-medium mb-2">{professional.profession}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {professional.location}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  {professional.rating}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {professional.projects} projects
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2 mb-3">
                                {professional.skills.map((skill, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button size="sm" variant="outline">
                                <Phone className="h-4 w-4 mr-1" />
                                Call
                              </Button>
                              <Button size="sm" variant="outline">
                                <Mail className="h-4 w-4 mr-1" />
                                Message
                              </Button>
                            </div>
                          </div>
                          
                          <div className="pt-3 border-t">
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Contact:</span> {professional.phone} • {professional.email}
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm">
                                  Hire Again
                                </Button>
                                <Button size="sm" variant="outline">
                                  View Profile
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredProfessionals.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      {searchTerm ? 'No matching professionals found' : 'No professionals in your network yet'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {searchTerm 
                        ? 'Try adjusting your search terms to find professionals in your network.'
                        : 'When you work with professionals, you can add them to your network for easy access.'
                      }
                    </p>
                    <Button>
                      Find Professionals
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Network Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Professionals</span>
                      <span className="font-semibold">{professionals.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active This Month</span>
                      <span className="font-semibold">2</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Rating</span>
                      <span className="font-semibold">4.8</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Projects</span>
                      <span className="font-semibold">56</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Professional
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Search className="h-4 w-4 mr-2" />
                    Find More Professionals
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Group Message
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium">John Smith</span> completed Electrical Installation project
                      <div className="text-gray-500">2 days ago</div>
                    </div>
                    <div>
                      <span className="font-medium">Maria Rodriguez</span> was added to your network
                      <div className="text-gray-500">1 week ago</div>
                    </div>
                    <div>
                      <span className="font-medium">David Chen</span> updated their profile
                      <div className="text-gray-500">2 weeks ago</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Network;
