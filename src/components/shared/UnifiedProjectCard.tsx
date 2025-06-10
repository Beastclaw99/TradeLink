import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Project } from '@/components/dashboard/types';
import { Milestone } from '@/components/project/creation/types';
import ProjectChat from '../project/ProjectChat';
import { ChatBubbleLeftIcon, ClockIcon, ExclamationCircleIcon, DocumentIcon, CalendarIcon, CheckCircleIcon, TagIcon, EyeIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import ProjectUpdateTimeline from '../project/ProjectUpdateTimeline';
import ProjectMilestones from '../project/ProjectMilestones';
import ProjectDeliverables from '../project/ProjectDeliverables';
import { ProgressIndicator } from "@/components/ui/progress-indicator";
import { supabase } from '@/integrations/supabase/client';
import { convertDBMilestoneToMilestone } from '@/components/project/creation/types';
import { useToast } from "@/components/ui/use-toast";
import { ProjectStatus } from '@/types/projectUpdates';

interface UnifiedProjectCardProps {
  project: Project;
  variant?: 'list' | 'card';
  onStatusChange?: (newStatus: ProjectStatus) => void;
  isProfessional?: boolean;
  onClick?: () => void;
  actionLabel?: string;
  isClient?: boolean;
  onMilestoneUpdate?: (milestoneId: string, updates: Partial<Milestone>) => Promise<void>;
  onMilestoneDelete?: (milestoneId: string) => Promise<void>;
  onTaskStatusUpdate?: (milestoneId: string, taskId: string, completed: boolean) => Promise<void>;
}

const statusColors = {
  open: { bg: 'bg-blue-100', text: 'text-blue-800' },
  assigned: { bg: 'bg-green-100', text: 'text-green-800' },
  in_progress: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  work_submitted: { bg: 'bg-purple-100', text: 'text-purple-800' },
  work_revision_requested: { bg: 'bg-orange-100', text: 'text-orange-800' },
  work_approved: { bg: 'bg-green-100', text: 'text-green-800' },
  completed: { bg: 'bg-green-100', text: 'text-green-800' },
  archived: { bg: 'bg-gray-100', text: 'text-gray-800' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-800' },
  disputed: { bg: 'bg-red-100', text: 'text-red-800' },
};

const formatDate = (date: string | null) => {
  if (!date) return 'N/A';
  return format(new Date(date), 'MMM d, yyyy');
};

const formatCurrency = (amount: number | null) => {
  if (!amount) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
    case 'assigned':
      return <TagIcon className="h-4 w-4 text-blue-600" />;
    case 'open':
      return <ClockIcon className="h-4 w-4 text-gray-600" />;
    default:
      return <ExclamationCircleIcon className="h-4 w-4 text-yellow-600" />;
  }
};

const getProjectSteps = (project: Project) => {
  return [
    {
      id: 'assigned',
      title: 'Assigned',
      status: project.status === 'assigned' ? 'current' : 'completed' as 'completed' | 'current' | 'pending'
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      status: project.status === 'in_progress' ? 'current' : 
             ['assigned'].includes(project.status) ? 'pending' : 'completed' as 'completed' | 'current' | 'pending'
    },
    {
      id: 'review',
      title: 'Review',
      status: project.status === 'review' ? 'current' : 
             ['assigned', 'in_progress'].includes(project.status) ? 'pending' : 'completed' as 'completed' | 'current' | 'pending'
    },
    {
      id: 'completed',
      title: 'Completed',
      status: project.status === 'completed' ? 'completed' : 'pending' as 'completed' | 'current' | 'pending'
    }
  ];
};

const getProjectProgress = (project: Project) => {
  const steps = getProjectSteps(project);
  const completedSteps = steps.filter(step => step.status === 'completed').length;
  return Math.round((completedSteps / steps.length) * 100);
};

const UnifiedProjectCard: React.FC<UnifiedProjectCardProps> = ({
  project,
  variant = 'card',
  onStatusChange,
  isProfessional = false,
  onClick,
  actionLabel,
  isClient = false,
  onMilestoneUpdate,
  onMilestoneDelete,
  onTaskStatusUpdate
}) => {
  const { toast } = useToast();
  const [showChat, setShowChat] = useState(false);
  const [activeTab, setActiveTab] = useState('timeline');
  const [expanded, setExpanded] = useState(false);
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  const canShowChat = project.status !== 'open' && 
    project.status !== 'cancelled' && 
    project.status !== 'archived' &&
    project.client_id && 
    project.professional_id;

  useEffect(() => {
    if (expanded && project.status !== 'open') {
      fetchMilestones();
    }
  }, [expanded, project.id]);

  const fetchMilestones = async () => {
    try {
      const { data, error } = await supabase
        .from('project_milestones')
        .select('*')
        .eq('project_id', project.id)
        .order('due_date', { ascending: true });

      if (error) throw error;

      setMilestones((data || []).map(convertDBMilestoneToMilestone));
    } catch (error) {
      console.error('Error fetching milestones:', error);
      toast({
        title: "Error",
        description: "Failed to fetch project milestones.",
        variant: "destructive"
      });
    }
  };

  const renderStatusBadge = () => (
    <Badge 
      variant="secondary" 
      className={`${statusColors[project.status as keyof typeof statusColors]?.bg || 'bg-gray-100'} ${statusColors[project.status as keyof typeof statusColors]?.text || 'text-gray-800'}`}
    >
      {project.status?.replace(/_/g, ' ') || 'Open'}
    </Badge>
  );

  if (variant === 'list') {
    return (
      <div className="relative">
        <Card className="mb-4" onClick={onClick}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                  {renderStatusBadge()}
                </div>
                <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>Budget: {formatCurrency(project.budget)}</span>
                  <span>Created: {formatDate(project.created_at)}</span>
                  <span>Deadline: {formatDate(project.deadline)}</span>
                </div>
              </div>
              {canShowChat && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowChat(!showChat);
                  }}
                  className="ml-4"
                >
                  <ChatBubbleLeftIcon className="h-4 w-4 mr-2" />
                  {showChat ? 'Hide Chat' : 'Show Chat'}
                </Button>
              )}
              {actionLabel && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick?.();
                  }}
                  className="ml-4"
                >
                  {actionLabel}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        {showChat && canShowChat && (
          <div className="mt-4">
            <ProjectChat
              projectId={project.id}
              clientId={project.client_id || ''}
              professionalId={project.professional_id || ''}
              projectStatus={project.status || 'open'}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <Card className="mb-4" onClick={onClick}>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-xl">{project.title}</CardTitle>
                <div className="flex items-center gap-2">
                  {getStatusIcon(project.status)}
                  {renderStatusBadge()}
                  {project.urgency && (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {project.urgency} Priority
                    </Badge>
                  )}
                </div>
              </div>
              <CardDescription className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Created {formatDate(project.created_at)}
              </CardDescription>
            </div>
            {canShowChat && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowChat(!showChat);
                }}
              >
                <ChatBubbleLeftIcon className="h-4 w-4 mr-2" />
                {showChat ? 'Hide Chat' : 'Show Chat'}
              </Button>
            )}
            {actionLabel && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick?.();
                }}
                className="ml-4"
              >
                {actionLabel}
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Project Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Project Progress</span>
              <span className="text-gray-600">{getProjectProgress(project)}%</span>
            </div>
            <Progress value={getProjectProgress(project)} className="h-2" />
            <ProgressIndicator 
              steps={getProjectSteps(project)}
              orientation="horizontal"
            />
          </div>

          <Separator />

          {/* Project Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Budget:</span>
              <p>{formatCurrency(project.budget)}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Deadline:</span>
              <p>{formatDate(project.deadline)}</p>
            </div>
            {project.category && (
              <div>
                <span className="font-medium text-gray-700">Category:</span>
                <p className="capitalize">{project.category}</p>
              </div>
            )}
          </div>

          {project.description && (
            <div>
              <span className="font-medium text-gray-700">Description:</span>
              <p className="text-gray-600 mt-1">{project.description}</p>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="w-full"
          >
            {expanded ? 'Show Less' : 'Show More'}
          </Button>

          {expanded && (
            <div className="mt-6 border-t pt-6">
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="timeline" className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4" />
                    Timeline
                  </TabsTrigger>
                  <TabsTrigger value="milestones" className="flex items-center gap-2">
                    <TagIcon className="h-4 w-4" />
                    Milestones
                  </TabsTrigger>
                  <TabsTrigger value="deliverables" className="flex items-center gap-2">
                    <DocumentIcon className="h-4 w-4" />
                    Deliverables
                  </TabsTrigger>
                  <TabsTrigger value="details" className="flex items-center gap-2">
                    <EyeIcon className="h-4 w-4" />
                    Details
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="timeline" className="mt-4">
                  <ProjectUpdateTimeline 
                    projectId={project.id} 
                    projectStatus={project.status || ''}
                    isProfessional={isProfessional}
                  />
                </TabsContent>

                <TabsContent value="milestones" className="mt-4">
                  <ProjectMilestones 
                    projectId={project.id}
                    projectStatus={project.status || 'open'}
                    milestones={milestones}
                    isClient={isClient}
                    onAddMilestone={async () => {}}
                    onEditMilestone={onMilestoneUpdate || async () => {}}
                    onDeleteMilestone={onMilestoneDelete || async () => {}}
                    onUpdateTaskStatus={onTaskStatusUpdate || async () => {}}
                  />
                </TabsContent>

                <TabsContent value="deliverables" className="mt-4">
                  <ProjectDeliverables 
                    projectId={project.id}
                    canUpload={isProfessional}
                  />
                </TabsContent>

                <TabsContent value="details" className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Project Details</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Location:</span>
                          <p>{project.location || 'Not specified'}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Timeline:</span>
                          <p>{project.expected_timeline || 'Not specified'}</p>
                        </div>
                        {project.requirements && (
                          <div className="col-span-2">
                            <span className="text-gray-600">Requirements:</span>
                            <ul className="list-disc list-inside mt-1">
                              {project.requirements.map((req, index) => (
                                <li key={index}>{req}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>

      {showChat && canShowChat && (
        <div className="mt-4">
          <ProjectChat
            projectId={project.id}
            clientId={project.client_id || ''}
            professionalId={project.professional_id || ''}
            projectStatus={project.status || 'open'}
          />
        </div>
      )}
    </div>
  );
};

export default UnifiedProjectCard;
