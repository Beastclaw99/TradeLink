
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X, Eye } from "lucide-react";
import { Link } from 'react-router-dom';
import { Application } from '../../types';

interface PendingApplicationsTableProps {
  applications: Application[];
  projects: any[];
  onViewApplication: (application: Application) => void;
  onActionInitiate: (application: Application, action: 'accept' | 'reject') => void;
}

const PendingApplicationsTable: React.FC<PendingApplicationsTableProps> = ({
  applications,
  projects,
  onViewApplication,
  onActionInitiate
}) => {
  const pendingApplications = applications.filter(app => app.status === 'pending');
  
  if (pendingApplications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-ttc-neutral-600">No pending applications at the moment.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead>Applicant</TableHead>
          <TableHead>Bid Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pendingApplications.map(app => {
          const project = projects.find(p => p.id === app.project_id);
          // Only show applications for projects that are still open
          if (!project || project.status !== 'open') return null;
          
          return (
            <TableRow key={app.id}>
              <TableCell className="font-medium">
                <Link to={`/projects/${app.project_id}`} className="text-ttc-blue-700 hover:underline">
                  {project?.title || 'Unknown Project'}
                </Link>
              </TableCell>
              <TableCell>
                {app.professional ? (
                  <Link to={`/professionals/${app.professional_id}`} className="text-ttc-blue-700 hover:underline">
                    {`${app.professional.first_name} ${app.professional.last_name}`}
                  </Link>
                ) : (
                  'Unknown Applicant'
                )}
              </TableCell>
              <TableCell>
                ${app.bid_amount || project?.budget || 'N/A'}
                {app.bid_amount && project?.budget && app.bid_amount < project.budget && (
                  <span className="ml-2 text-green-600 text-xs">
                    (${project.budget - app.bid_amount} less)
                  </span>
                )}
                {app.bid_amount && project?.budget && app.bid_amount > project.budget && (
                  <span className="ml-2 text-amber-600 text-xs">
                    (${app.bid_amount - project.budget} more)
                  </span>
                )}
              </TableCell>
              <TableCell>
                <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                  Pending
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onViewApplication(app)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                    onClick={() => onActionInitiate(app, 'accept')}
                  >
                    <Check className="w-4 h-4 mr-1" /> Accept
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                    onClick={() => onActionInitiate(app, 'reject')}
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
  );
};

export default PendingApplicationsTable;
