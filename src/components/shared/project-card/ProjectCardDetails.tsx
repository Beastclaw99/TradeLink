
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ProgressIndicator } from "@/components/ui/progress-indicator";
import { CalendarIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { Project } from '@/components/dashboard/types';
import { ProjectStatusBadge } from './ProjectStatusBadge';
import { StatusIcon } from './StatusIcon';
import { formatCurrency, formatDate, getProjectSteps, getProjectProgress } from './utils';

interface ProjectCardDetailsProps {
  project: Project;
  showChat: boolean;
  setShowChat: (show: boolean) => void;
  canShowChat: boolean;
  onClick?: () => void;
  actionLabel?: string;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  children?: React.ReactNode;
}

export const ProjectCardDetails: React.FC<ProjectCardDetailsProps> = ({
  project,
  showChat,
  setShowChat,
  canShowChat,
  onClick,
  actionLabel,
  expanded,
  setExpanded,
  children
}) => {
  return (
    <Card className="mb-4" onClick={onClick}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="text-xl">{project.title}</CardTitle>
              <div className="flex items-center gap-2">
                <StatusIcon status={project.status} />
                <ProjectStatusBadge status={project.status} />
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

        {expanded && children}
      </CardContent>
    </Card>
  );
};
