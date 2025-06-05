import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, MapPin, Clock, Tag, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { Project } from '@/components/dashboard/types';
import ProjectChat from '../project/ProjectChat';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

interface UnifiedProjectCardProps {
  project: Project;
  onClick?: () => void;
  variant?: 'card' | 'list';
  showActions?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  onStatusChange?: (newStatus: string) => void;
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

const UnifiedProjectCard: React.FC<UnifiedProjectCardProps> = ({ 
  project, 
  onClick, 
  variant = 'card',
  showActions = true,
  actionLabel = 'View Details',
  onAction,
  onStatusChange
}) => {
  const [showChat, setShowChat] = useState(false);

  const canShowChat = project.status !== 'open' && 
    project.status !== 'cancelled' && 
    project.status !== 'archived' &&
    project.client_id && 
    project.professional_id;

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
        <Card className="mb-4">
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
                  onClick={() => setShowChat(!showChat)}
                  className="ml-4"
                >
                  <ChatBubbleLeftIcon className="h-4 w-4 mr-2" />
                  {showChat ? 'Hide Chat' : 'Show Chat'}
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
      <Card className="mb-4">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{project.title}</h3>
              {renderStatusBadge()}
            </div>
            <p className="text-gray-600">{project.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Budget:</span>
                <span className="ml-2">{formatCurrency(project.budget)}</span>
              </div>
              <div>
                <span className="font-medium">Created:</span>
                <span className="ml-2">{formatDate(project.created_at)}</span>
              </div>
              <div>
                <span className="font-medium">Deadline:</span>
                <span className="ml-2">{formatDate(project.deadline)}</span>
              </div>
              <div>
                <span className="font-medium">Status:</span>
                <span className="ml-2">{project.status?.replace(/_/g, ' ')}</span>
              </div>
            </div>
            {canShowChat && (
              <Button
                variant="outline"
                onClick={() => setShowChat(!showChat)}
                className="w-full"
              >
                <ChatBubbleLeftIcon className="h-4 w-4 mr-2" />
                {showChat ? 'Hide Chat' : 'Show Chat'}
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
};

export default UnifiedProjectCard;
