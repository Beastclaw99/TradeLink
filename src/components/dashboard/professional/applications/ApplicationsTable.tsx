
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Eye, X } from "lucide-react";
import { Link } from 'react-router-dom';
import { Application } from '../../types';
import { getStatusBadgeClass } from './applicationUtils';

interface ApplicationsTableProps {
  applications: Application[];
  onViewApplication: (application: Application) => void;
  onWithdrawInitiate: (application: Application) => void;
}

const ApplicationsTable: React.FC<ApplicationsTableProps> = ({
  applications,
  onViewApplication,
  onWithdrawInitiate
}) => {
  if (applications.length === 0) {
    return (
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
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead>Applied On</TableHead>
          <TableHead>Your Bid</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map(app => (
          <TableRow key={app.id}>
            <TableCell className="font-medium">
              <Link to={`/projects/${app.project_id}`} className="text-ttc-blue-700 hover:underline">
                {app.project?.title || 'Unknown Project'}
              </Link>
            </TableCell>
            <TableCell>{new Date(app.created_at || '').toLocaleDateString()}</TableCell>
            <TableCell>${app.bid_amount || app.project?.budget || 'N/A'}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(app.status)}`}>
                {app.status}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => onViewApplication(app)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                
                {app.status === 'pending' && (
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 text-red-500 hover:bg-red-50" 
                    onClick={() => onWithdrawInitiate(app)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ApplicationsTable;
