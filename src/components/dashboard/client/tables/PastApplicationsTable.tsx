
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Link } from 'react-router-dom';
import { Application } from '../../types';
import { getStatusBadgeClass } from '../../professional/applications/applicationUtils';

interface PastApplicationsTableProps {
  applications: Application[];
  projects: any[];
  onViewApplication: (application: Application) => void;
}

const PastApplicationsTable: React.FC<PastApplicationsTableProps> = ({
  applications,
  projects,
  onViewApplication
}) => {
  const pastApplications = applications.filter(app => app.status !== 'pending');
  
  if (pastApplications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-ttc-neutral-600">No past applications.</p>
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
        {pastApplications.map(app => {
          const project = projects.find(p => p.id === app.project_id);
          
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
              <TableCell>${app.bid_amount || project?.budget || 'N/A'}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(app.status)}`}>
                  {app.status}
                </span>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onViewApplication(app)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default PastApplicationsTable;
