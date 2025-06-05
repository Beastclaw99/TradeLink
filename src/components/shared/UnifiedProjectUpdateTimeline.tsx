import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProjectUpdate } from '@/types/projectUpdates';
import { useAuth } from '@/contexts/AuthContext';
import {
  ClockIcon,
  ExclamationCircleIcon,
  DocumentIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  CheckCircleIcon,
  PaperClipIcon,
  MapPinIcon,
  TruckIcon,
  BanknotesIcon,
  ListBulletIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import AddProjectUpdate from '../project/updates/AddProjectUpdate';

interface UnifiedProjectUpdateTimelineProps {
  projectId: string;
  isProfessional: boolean;
  projectStatus: string;
}

const UpdateTypeIcons = {
  message: DocumentIcon,
  status_change: ClockIcon,
  file_upload: PaperClipIcon,
  site_check: MapPinIcon,
  start_time: ClockIcon,
  completion_note: CheckCircleIcon,
  check_in: ClockIcon,
  check_out: ClockIcon,
  on_my_way: TruckIcon,
  delayed: ExclamationCircleIcon,
  cancelled: ExclamationCircleIcon,
  revisit_required: MapPinIcon,
  expense_submitted: BanknotesIcon,
  expense_approved: CurrencyDollarIcon,
  payment_processed: CurrencyDollarIcon,
  schedule_updated: CalendarIcon,
  task_completed: ListBulletIcon,
  custom_field_updated: PencilSquareIcon,
};

const UpdateTypeBadgeColors = {
  message: { bg: 'bg-blue-100', text: 'text-blue-800' },
  status_change: { bg: 'bg-purple-100', text: 'text-purple-800' },
  file_upload: { bg: 'bg-gray-100', text: 'text-gray-800' },
  site_check: { bg: 'bg-green-100', text: 'text-green-800' },
  start_time: { bg: 'bg-blue-100', text: 'text-blue-800' },
  completion_note: { bg: 'bg-green-100', text: 'text-green-800' },
  check_in: { bg: 'bg-blue-100', text: 'text-blue-800' },
  check_out: { bg: 'bg-blue-100', text: 'text-blue-800' },
  on_my_way: { bg: 'bg-blue-100', text: 'text-blue-800' },
  delayed: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-800' },
  revisit_required: { bg: 'bg-orange-100', text: 'text-orange-800' },
  expense_submitted: { bg: 'bg-green-100', text: 'text-green-800' },
  expense_approved: { bg: 'bg-green-100', text: 'text-green-800' },
  payment_processed: { bg: 'bg-green-100', text: 'text-green-800' },
  schedule_updated: { bg: 'bg-blue-100', text: 'text-blue-800' },
  task_completed: { bg: 'bg-green-100', text: 'text-green-800' },
  custom_field_updated: { bg: 'bg-purple-100', text: 'text-purple-800' },
};

export default function UnifiedProjectUpdateTimeline({ 
  projectId, 
  isProfessional,
  projectStatus 
}: UnifiedProjectUpdateTimelineProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('project_updates')
        .select('*, profiles(first_name, last_name)')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setUpdates((data || []) as ProjectUpdate[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch updates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();

    // Set up real-time subscription for updates
    const channel = supabase
      .channel(`project_updates:${projectId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'project_updates',
        filter: `project_id=eq.${projectId}`
      }, () => {
        fetchUpdates();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 my-4">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  const renderUpdateContent = (update: ProjectUpdate) => {
    const Icon = UpdateTypeIcons[update.update_type] || DocumentIcon;
    const colors = UpdateTypeBadgeColors[update.update_type] || { bg: 'bg-gray-100', text: 'text-gray-800' };
    
    const renderBadge = (text: string) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${colors.bg} ${colors.text}`}>
        {text}
      </span>
    );

    const renderMetadata = () => {
      if (!update.metadata) return null;
      
      switch (update.update_type) {
        case 'site_check':
          return (
            <div className="text-sm text-gray-600">
              {update.metadata.checked_by && <p>Checked by: {update.metadata.checked_by}</p>}
              {update.metadata.geolocation && (
                <p className="mt-1">
                  📍 Location: {update.metadata.geolocation.latitude.toFixed(6)}, 
                  {update.metadata.geolocation.longitude.toFixed(6)}
                </p>
              )}
            </div>
          );
          
        case 'expense_submitted':
        case 'expense_approved':
          return (
            <div className="text-sm text-gray-600">
              <p>Amount: ${update.metadata.amount}</p>
              {update.metadata.description && (
                <p className="mt-1">Description: {update.metadata.description}</p>
              )}
            </div>
          );
          
        case 'task_completed':
          return (
            <div className="text-sm text-gray-600">
              <p>Task: {update.metadata.task_name}</p>
            </div>
          );
          
        case 'custom_field_updated':
          return (
            <div className="text-sm text-gray-600">
              <p>Field: {update.metadata.field_name}</p>
              <p className="mt-1">New Value: {update.metadata.field_value}</p>
            </div>
          );
          
        case 'delayed':
          return (
            <div className="text-sm text-red-600">
              Reason: {update.metadata.delay_reason}
            </div>
          );
          
        default:
          return null;
      }
    };

    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex space-x-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon className={`h-5 w-5 ${colors.text}`} />
            </div>
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">
                    {format(new Date(update.created_at || ''), 'MMM d, yyyy h:mm a')}
                  </span>
                  {isProfessional && update.profiles && (
                    <span className="text-sm text-gray-600">
                      By: {update.profiles.first_name} {update.profiles.last_name}
                    </span>
                  )}
                </div>
                {update.update_type !== 'message' && renderBadge(update.update_type.replace('_', ' '))}
              </div>
              
              <div className="mt-2">
                {update.message && (
                  <p className="text-gray-700">{update.message}</p>
                )}
                
                {update.status_update && (
                  <div className="mt-1">{renderBadge(update.status_update)}</div>
                )}
                
                {update.file_url && (
                  <div className="mt-2">
                    <a
                      href={`${supabase.storage.from('project-files').getPublicUrl(update.file_url).data.publicUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <PaperClipIcon className="h-4 w-4 mr-1" />
                      Download File
                    </a>
                  </div>
                )}
                
                {renderMetadata()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <AddProjectUpdate 
        projectId={projectId} 
        onUpdateAdded={fetchUpdates}
        projectStatus={projectStatus}
        isProfessional={isProfessional}
      />

      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-4">
          {updates.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                No updates found.
              </CardContent>
            </Card>
          ) : (
            updates.map((update) => (
              <div key={update.id}>
                {renderUpdateContent(update)}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
