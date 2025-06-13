import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';
import { MoreHorizontal, CheckCircle, XCircle, Clock } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface Application {
  id: string;
  project_id: string;
  professional_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  proposal_message: string;
  bid_amount: number;
  availability: string;
  created_at: string;
  professional: {
    id: string;
    first_name: string;
    last_name: string;
    profile_image_url?: string;
    rating?: number;
  };
}

interface ApplicationsTableProps {
  projectId: string;
  isClient: boolean;
  onStatusChange?: () => void;
}

const ApplicationsTable: React.FC<ApplicationsTableProps> = ({
  projectId,
  isClient,
  onStatusChange
}) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    fetchApplications();
  }, [projectId]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          professional:profiles!applications_professional_id_fkey(
            id,
            first_name,
            last_name,
            profile_image_url,
            rating
          )
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map raw data to Application interface and filter out invalid joins
      const mapped = (data || [])
        .filter((row: any) => row.professional && !row.professional.error)
        .map((row: any): Application => ({
          id: row.id,
          project_id: row.project_id,
          professional_id: row.professional_id,
          status: row.status,
          proposal_message: row.proposal_message || '',
          bid_amount: row.bid_amount || 0,
          availability: row.availability || '',
          created_at: row.created_at,
          professional: {
            id: row.professional.id,
            first_name: row.professional.first_name,
            last_name: row.professional.last_name,
            profile_image_url: row.professional.profile_image_url,
            rating: row.professional.rating,
          },
        }));
      
      setApplications(mapped);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to load applications. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId: string, newStatus: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) throw error;

      // Update local state
      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      toast({
        title: "Success",
        description: `Application ${newStatus} successfully.`
      });

      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: "Error",
        description: "Failed to update application status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: Application['status']) => {
    const statusConfig = {
      pending: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <Clock className="h-4 w-4" />
      },
      accepted: {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle className="h-4 w-4" />
      },
      rejected: {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <XCircle className="h-4 w-4" />
      }
    };

    const { color, icon } = statusConfig[status];
    return (
      <Badge variant="outline" className={color}>
        {icon}
        <span className="ml-1">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No applications received yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Professional</TableHead>
            <TableHead>Proposal</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Timeline</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applied</TableHead>
            {isClient && <TableHead className="w-[50px]"></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    {application.professional.profile_image_url ? (
                      <img
                        src={application.professional.profile_image_url}
                        alt={`${application.professional.first_name} ${application.professional.last_name}`}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <span className="text-sm font-medium">
                        {application.professional.first_name[0]}
                        {application.professional.last_name[0]}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">
                      {application.professional.first_name} {application.professional.last_name}
                    </div>
                    {application.professional.rating && (
                      <div className="text-sm text-gray-500">
                        Rating: {application.professional.rating.toFixed(1)}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="max-w-md">
                <p className="truncate">{application.proposal_message}</p>
              </TableCell>
              <TableCell>TTD {application.bid_amount.toLocaleString()}</TableCell>
              <TableCell>{application.availability}</TableCell>
              <TableCell>{getStatusBadge(application.status)}</TableCell>
              <TableCell>
                {format(new Date(application.created_at), 'MMM d, yyyy')}
              </TableCell>
              {isClient && application.status === 'pending' && (
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(application.id, 'accepted')}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Accept
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(application.id, 'rejected')}
                        className="text-red-600"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicationsTable;
