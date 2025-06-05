import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X, Eye, User, Calendar, DollarSign } from "lucide-react";
import { Application } from '../../types';
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';

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
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Professional</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Bid Amount</TableHead>
            <TableHead>Availability</TableHead>
            <TableHead>Applied</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => {
            const project = projects.find(p => p.id === application.project_id);
            const professional = application.professional;

            return (
              <TableRow key={application.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {professional?.first_name} {professional?.last_name}
                      </div>
                      <Badge variant="secondary" className="mt-1">
                        {application.status}
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{project?.title}</div>
                  <div className="text-sm text-gray-500">
                    Budget: ${project?.budget}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span>${application.bid_amount}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>{application.availability}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewApplication(application)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => onActionInitiate(application, 'reject')}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => onActionInitiate(application, 'accept')}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default PendingApplicationsTable;
