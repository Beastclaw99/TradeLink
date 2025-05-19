
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Application } from '../types';

interface ApplicationsTabProps {
  isLoading: boolean;
  projects: any[];
  applications: Application[];
  handleApplicationUpdate: (
    applicationId: string, 
    newStatus: string, 
    projectId: string, 
    professionalId: string
  ) => Promise<void>;
}

const ApplicationsTab: React.FC<ApplicationsTabProps> = ({ 
  isLoading, 
  projects, 
  applications, 
  handleApplicationUpdate 
}) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Applications to Your Projects</h2>
      {isLoading ? (
        <p>Loading applications...</p>
      ) : applications.filter(app => app.status === 'pending').length === 0 ? (
        <div className="text-center py-8">
          <p className="text-ttc-neutral-600">No pending applications at the moment.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Applicant</TableHead>
              <TableHead>Cover Letter</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications
              .filter(app => app.status === 'pending')
              .map(app => {
                const project = projects.find(p => p.id === app.project_id);
                // Only show applications for projects that are still open
                if (!project || project.status !== 'open') return null;
                
                return (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{project?.title || 'Unknown Project'}</TableCell>
                    <TableCell>
                      {app.professional ? `${app.professional.first_name} ${app.professional.last_name}` : 'Unknown Applicant'}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{app.cover_letter}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                          onClick={() => handleApplicationUpdate(
                            app.id, 
                            'accepted', 
                            app.project_id || '', 
                            app.professional_id || ''
                          )}
                        >
                          <Check className="w-4 h-4 mr-1" /> Accept
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                          onClick={() => handleApplicationUpdate(
                            app.id, 
                            'rejected', 
                            app.project_id || '', 
                            app.professional_id || ''
                          )}
                        >
                          <X className="w-4 h-4 mr-1" /> Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      )}
      
      <h2 className="text-2xl font-bold mb-4 mt-8">Past Applications</h2>
      {applications.filter(app => app.status !== 'pending').length === 0 ? (
        <div className="text-center py-8">
          <p className="text-ttc-neutral-600">No past applications.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Applicant</TableHead>
              <TableHead>Applied On</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications
              .filter(app => app.status !== 'pending')
              .map(app => {
                const project = projects.find(p => p.id === app.project_id);
                
                return (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{project?.title || 'Unknown Project'}</TableCell>
                    <TableCell>
                      {app.professional ? `${app.professional.first_name} ${app.professional.last_name}` : 'Unknown Applicant'}
                    </TableCell>
                    <TableCell>{new Date(app.created_at || '').toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        app.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {app.status}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default ApplicationsTab;
