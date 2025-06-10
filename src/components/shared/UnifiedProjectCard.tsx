
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { convertDBMilestoneToMilestone } from '@/components/project/creation/types';
import { useToast } from "@/hooks/use-toast";
import { Milestone } from '@/components/project/creation/types';
import ProjectChat from '../project/ProjectChat';
import { UnifiedProjectCardProps } from './project-card/types';
import { ProjectCardList } from './project-card/ProjectCardList';
import { ProjectCardDetails } from './project-card/ProjectCardDetails';
import { ProjectCardTabs } from './project-card/ProjectCardTabs';

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

  if (variant === 'list') {
    return (
      <ProjectCardList
        project={project}
        showChat={showChat}
        setShowChat={setShowChat}
        canShowChat={canShowChat}
        onClick={onClick}
        actionLabel={actionLabel}
      />
    );
  }

  return (
    <div className="relative">
      <ProjectCardDetails
        project={project}
        showChat={showChat}
        setShowChat={setShowChat}
        canShowChat={canShowChat}
        onClick={onClick}
        actionLabel={actionLabel}
        expanded={expanded}
        setExpanded={setExpanded}
      >
        <ProjectCardTabs
          project={project}
          milestones={milestones}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isProfessional={isProfessional}
          isClient={isClient}
          onMilestoneUpdate={onMilestoneUpdate}
          onMilestoneDelete={onMilestoneDelete}
          onTaskStatusUpdate={onTaskStatusUpdate}
        />
      </ProjectCardDetails>

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
