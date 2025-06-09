
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, DollarSign, Star, User } from "lucide-react";
import { Project, Payment } from '../types';

interface ActiveProjectsTabProps {
  isLoading: boolean;
  projects: Project[];
  payments: Payment[];
  markProjectComplete: (projectId: string) => Promise<void>;
}

const ActiveProjectsTab: React.FC<ActiveProjectsTabProps> = ({ 
  isLoading, 
  projects, 
  payments,
  markProjectComplete 
}) => {
  const activeProjects = projects.filter(p => p.status === 'in_progress' || p.status === 'assigned');

  const getProjectPayment = (projectId: string) => {
    return payments.find(p => p.project_id === projectId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'assigned': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="flex items-center mb-8">
        <div className="flex-1">
          <h2 className="text-2xl font-bold">Active Projects</h2>
          <p className="text-ttc-neutral-600">Manage your ongoing work</p>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">
            {activeProjects.length}
          </div>
          <div className="text-sm text-ttc-neutral-500">Active Projects</div>
        </div>
      </div>
      
      {isLoading ? (
        <p>Loading active projects...</p>
      ) : activeProjects.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 mx-auto text-ttc-neutral-400" />
          <p className="mt-4 text-ttc-neutral-600">No active projects yet.</p>
          <p className="mt-2 text-sm text-ttc-neutral-500">
            Apply to projects to start working on them.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {activeProjects.map(project => {
            const payment = getProjectPayment(project.id);
            const clientName = project.client ? 
              `${project.client.first_name} ${project.client.last_name}` : 
              'Unknown Client';
            const projectSkills = Array.isArray(project.required_skills) 
              ? project.required_skills 
              : (project.required_skills?.toString().split(',') || []);
            
            return (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        ${project.budget?.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">Budget</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-gray-700">{project.description}</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="w-4 h-4 mr-2" />
                      {clientName}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {project.location || 'Location not specified'}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {project.deadline 
                        ? new Date(project.deadline).toLocaleDateString()
                        : 'No deadline'
                      }
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {project.expected_timeline || 'Timeline not specified'}
                    </div>
                  </div>

                  {projectSkills.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Required Skills:</h4>
                      <div className="flex flex-wrap gap-2">
                        {projectSkills.map((skill, index) => (
                          <Badge key={index} variant="outline">
                            {skill.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {payment && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-green-800">Payment Status</span>
                        <Badge className="bg-green-100 text-green-800">
                          {payment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-green-600 mt-1">
                        Amount: ${payment.amount}
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Started {new Date(project.created_at).toLocaleDateString()}
                      </div>
                      <div className="space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/projects/${project.id}`, '_blank')}
                        >
                          View Details
                        </Button>
                        {project.status === 'in_progress' && (
                          <Button
                            size="sm"
                            onClick={() => markProjectComplete(project.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
};

export default ActiveProjectsTab;
