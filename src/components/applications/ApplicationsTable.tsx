
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Application } from '../dashboard/types';

interface ApplicationsTableProps {
  projectId: string;
  onStatusUpdate?: (applicationId: string, status: string) => void;
}

const ApplicationsTable: React.FC<ApplicationsTableProps> = ({ 
  projectId, 
  onStatusUpdate 
}) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // Mock data for now - replace with actual API call
        const mockApplications: Application[] = [
          {
            id: '1',
            project_id: projectId,
            professional_id: 'prof1',
            cover_letter: 'I am interested in this project',
            proposal_message: 'I can complete this work',
            bid_amount: 5000,
            availability: 'available',
            status: 'pending',
            created_at: '2024-01-15',
            updated_at: '2024-01-15',
            professional: {
              first_name: 'John',
              last_name: 'Doe',
              skills: ['construction'],
              rating: 4.5
            }
          }
        ];
        
        setApplications(mockApplications);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setApplications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [projectId]);

  const handleStatusUpdate = (applicationId: string, newStatus: string) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: newStatus }
          : app
      )
    );
    
    if (onStatusUpdate) {
      onStatusUpdate(applicationId, newStatus);
    }
  };

  if (isLoading) {
    return <div>Loading applications...</div>;
  }

  if (applications.length === 0) {
    return <div>No applications found for this project.</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Project Applications</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Professional</TableHead>
            <TableHead>Bid Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applied Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application.id}>
              <TableCell>
                <div>
                  <p className="font-medium">
                    {application.professional?.first_name} {application.professional?.last_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Rating: {application.professional?.rating || 'N/A'}
                  </p>
                </div>
              </TableCell>
              <TableCell>${application.bid_amount}</TableCell>
              <TableCell>
                <Badge variant={application.status === 'accepted' ? 'default' : 'secondary'}>
                  {application.status}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(application.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {application.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(application.id, 'accepted')}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(application.id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicationsTable;
