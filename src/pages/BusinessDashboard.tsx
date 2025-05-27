
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import NotificationSystem from '@/components/shared/NotificationSystem';
import { BarChart3, Users, Calendar, AlertTriangle, TrendingUp, MapPin } from 'lucide-react';

const BusinessDashboard: React.FC = () => {
  const stats = [
    { title: 'Active Projects', value: '12', icon: BarChart3, color: 'text-blue-600' },
    { title: 'Team Members', value: '8', icon: Users, color: 'text-green-600' },
    { title: 'Scheduled Today', value: '5', icon: Calendar, color: 'text-orange-600' },
    { title: 'Urgent Tasks', value: '3', icon: AlertTriangle, color: 'text-red-600' }
  ];

  const recentProjects = [
    { id: '1', name: 'Office Renovation', status: 'In Progress', progress: 75, location: 'Port of Spain' },
    { id: '2', name: 'Residential Plumbing', status: 'Pending', progress: 0, location: 'San Fernando' },
    { id: '3', name: 'Commercial Electrical', status: 'Completed', progress: 100, location: 'Chaguanas' }
  ];

  return (
    <Layout>
      <div className="container-custom py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Business Dashboard</h1>
            <p className="text-gray-600">Project dispatch, team management, and business alerts</p>
          </div>
          <Button>Create New Project</Button>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Recent Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{project.name}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <Badge 
                            variant={
                              project.status === 'Completed' ? 'default' :
                              project.status === 'In Progress' ? 'secondary' : 'outline'
                            }
                          >
                            {project.status}
                          </Badge>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {project.location}
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-ttc-blue-700 h-2 rounded-full" 
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 mt-1">{project.progress}% Complete</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notifications */}
          <div>
            <NotificationSystem />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button variant="outline" className="p-6 h-auto flex flex-col items-center">
                  <Users className="h-8 w-8 mb-2" />
                  <span>Manage Team</span>
                </Button>
                <Button variant="outline" className="p-6 h-auto flex flex-col items-center">
                  <Calendar className="h-8 w-8 mb-2" />
                  <span>Schedule Jobs</span>
                </Button>
                <Button variant="outline" className="p-6 h-auto flex flex-col items-center">
                  <TrendingUp className="h-8 w-8 mb-2" />
                  <span>View Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default BusinessDashboard;
