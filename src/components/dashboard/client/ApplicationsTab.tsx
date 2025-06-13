import React, { useState, useMemo } from 'react';
import { Application, Project } from '@/types/database';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import ViewApplicationDialog from './dialogs/ViewApplicationDialog';
import ActionConfirmationDialog from './dialogs/ActionConfirmationDialog';
import PendingApplicationsTable from './tables/PendingApplicationsTable';
import PastApplicationsTable from './tables/PastApplicationsTable';
import { Button } from "@/components/ui/button";
import { MessageSquare, Filter, SortAsc, SortDesc } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ApplicationsTabProps {
  isLoading: boolean;
  projects: Project[];
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
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'accept' | 'reject' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // New state for filtering and sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [sortBy, setSortBy] = useState<'date' | 'project'>('date');

  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
    setViewDialogOpen(true);
  };
  
  const handleActionInitiate = (application: Application, action: 'accept' | 'reject') => {
    setSelectedApplication(application);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const handleMessage = (application: Application) => {
    if (!application.professional_id) return;
    navigate(`/messages?recipient=${application.professional_id}&project=${application.project_id}`);
  };
  
  const handleConfirmAction = async () => {
    if (!selectedApplication || !actionType) return;
    
    try {
      setIsProcessing(true);
      
      const newStatus = actionType === 'accept' ? 'accepted' : 'rejected';
      
      await handleApplicationUpdate(
        selectedApplication.id,
        newStatus,
        selectedApplication.project_id,
        selectedApplication.professional_id
      );
      
      toast({
        title: `Application ${actionType === 'accept' ? 'Accepted' : 'Rejected'}`,
        description: `The application has been ${actionType === 'accept' ? 'accepted' : 'rejected'} successfully.`
      });
      
      setActionDialogOpen(false);
      setViewDialogOpen(false);
      
    } catch (error: any) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: "Failed to update application status. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter and sort applications
  const filteredApplications = useMemo(() => {
    let filtered = [...applications];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app => 
        app.project?.title?.toLowerCase().includes(query) ||
        `${app.professional?.first_name} ${app.professional?.last_name}`.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Apply project filter
    if (projectFilter !== 'all') {
      filtered = filtered.filter(app => app.project_id === projectFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        return sortOrder === 'asc'
          ? (a.project?.title || '').localeCompare(b.project?.title || '')
          : (b.project?.title || '').localeCompare(a.project?.title || '');
      }
    });

    return filtered;
  }, [applications, searchQuery, statusFilter, projectFilter, sortOrder, sortBy]);

  const pendingApplications = filteredApplications.filter(app => app.status === 'pending');
  const pastApplications = filteredApplications.filter(app => app.status !== 'pending');
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Applications to Your Projects</h2>
        <Button
          variant="outline"
          onClick={() => navigate('/messages')}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          View All Messages
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="md:col-span-1"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="md:col-span-1">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="md:col-span-1">
                <SelectValue placeholder="Filter by project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2 md:col-span-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </Button>
              <Select value={sortBy} onValueChange={(value: 'date' | 'project') => setSortBy(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <p className="text-gray-500">Loading applications...</p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Pending Applications
                  <Badge variant="secondary" className="ml-2">
                    {pendingApplications.length}
                  </Badge>
                </h3>
              </div>
              {pendingApplications.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center text-gray-500">
                    No pending applications to review.
                  </CardContent>
                </Card>
              ) : (
                <PendingApplicationsTable 
                  applications={pendingApplications}
                  projects={projects}
                  onViewApplication={handleViewApplication}
                  onActionInitiate={handleActionInitiate}
                />
              )}
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Past Applications
                  <Badge variant="secondary" className="ml-2">
                    {pastApplications.length}
                  </Badge>
                </h3>
              </div>
              {pastApplications.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center text-gray-500">
                    No past applications to display.
                  </CardContent>
                </Card>
              ) : (
                <PastApplicationsTable 
                  applications={pastApplications}
                  projects={projects}
                  onViewApplication={handleViewApplication}
                />
              )}
            </div>
          </div>
        </>
      )}
      
      {/* View Application Dialog */}
      <ViewApplicationDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        selectedApplication={selectedApplication}
        projects={projects}
        onAccept={(app) => {
          setViewDialogOpen(false);
          handleActionInitiate(app, 'accept');
        }}
        onReject={(app) => {
          setViewDialogOpen(false);
          handleActionInitiate(app, 'reject');
        }}
        onMessage={handleMessage}
      />
      
      {/* Action Confirmation Dialog */}
      <ActionConfirmationDialog
        open={actionDialogOpen}
        onOpenChange={setActionDialogOpen}
        actionType={actionType}
        isProcessing={isProcessing}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
};

export default ApplicationsTab;
