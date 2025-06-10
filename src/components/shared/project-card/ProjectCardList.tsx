
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { Project } from '@/components/dashboard/types';
import ProjectChat from '../../project/ProjectChat';
import { ProjectStatusBadge } from './ProjectStatusBadge';
import { formatCurrency, formatDate } from './utils';

interface ProjectCardListProps {
  project: Project;
  showChat: boolean;
  setShowChat: (show: boolean) => void;
  canShowChat: boolean;
  onClick?: () => void;
  actionLabel?: string;
}

export const ProjectCardList: React.FC<ProjectCardListProps> = ({
  project,
  showChat,
  setShowChat,
  canShowChat,
  onClick,
  actionLabel
}) => {
  return (
    <div className="relative">
      <Card className="mb-4" onClick={onClick}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4">
                <h3 className="text-lg font-semibold">{project.title}</h3>
                <ProjectStatusBadge status={project.status} />
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
};
