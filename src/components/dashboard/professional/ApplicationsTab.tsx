
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Application } from '../types';

interface ApplicationsTabProps {
  isLoading: boolean;
  applications: Application[];
}

const ApplicationsTab: React.FC<ApplicationsTabProps> = ({ isLoading, applications }) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Your Applications</h2>
      {isLoading ? (
        <p>Loading your applications...</p>
      ) : applications.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 mx-auto text-ttc-neutral-400" />
          <p className="mt-4 text-ttc-neutral-600">You haven't applied to any projects yet.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              const featuredTab = document.querySelector('[data-value="featured"]');
              if (featuredTab) {
                (featuredTab as HTMLElement).click();
              }
            }}
          >
            Browse Available Projects
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Applied On</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map(app => (
              <TableRow key={app.id}>
                <TableCell className="font-medium">{app.project?.title || 'Unknown Project'}</TableCell>
                <TableCell>{new Date(app.created_at || '').toLocaleDateString()}</TableCell>
                <TableCell>${app.project?.budget || 'N/A'}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    app.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {app.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default ApplicationsTab;
