import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabaseClient';
import { ProjectUpdate } from '@/types/projectUpdates';
import {
  CheckCircleIcon,
  ClockIcon,
  DocumentIcon,
  ExclamationCircleIcon,
  MapPinIcon,
  PaperClipIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface ProjectUpdateTimelineProps {
  projectId: string;
}

const UpdateTypeIcons: Record<string, React.ElementType> = {
  message: DocumentIcon,
  status_change: CheckCircleIcon,
  file_upload: PaperClipIcon,
  site_check: MapPinIcon,
  start_time: ClockIcon,
  check_in: CheckIcon,
  check_out: XMarkIcon,
  on_my_way: MapPinIcon,
  delayed: ExclamationCircleIcon,
  expense_submitted: CurrencyDollarIcon,
  schedule_updated: CalendarIcon,
};

export default function ProjectUpdateTimeline({ projectId }: ProjectUpdateTimelineProps) {
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const { data, error } = await supabase
          .from('project_updates')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setUpdates(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch updates');
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
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

  if (updates.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No updates available for this project yet.
      </div>
    );
  }

  const renderUpdateContent = (update: ProjectUpdate) => {
    const Icon = UpdateTypeIcons[update.update_type] || DocumentIcon;
    
    const renderMetadata = () => {
      if (!update.metadata) return null;
      switch (update.update_type) {
        case 'site_check':
          return (
            <div className="text-sm text-gray-600">
              Checked by: {update.metadata.checked_by}
              {update.metadata.geolocation && (
                <span className="ml-2">
                  📍 {update.metadata.geolocation.latitude.toFixed(6)}, 
                  {update.metadata.geolocation.longitude.toFixed(6)}
                </span>
              )}
            </div>
          );
        case 'expense_submitted':
          return (
            <div className="text-sm text-gray-600">
              Amount: ${update.metadata.amount}
              <br />
              Description: {update.metadata.description}
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div className="flex space-x-4 group">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <Icon className="h-5 w-5 text-gray-600" />
        </div>
        <div className="flex-grow">
          <div className="flex items-center">
            <span className="text-sm text-gray-500">
              {format(new Date(update.created_at), 'MMM d, yyyy h:mm a')}
            </span>
          </div>
          
          <div className="mt-2">
            {update.update_type === 'message' && (
              <p className="text-gray-700">{update.message}</p>
            )}
            
            {update.update_type === 'status_change' && (
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {update.status_update}
              </div>
            )}
            
            {update.update_type === 'file_upload' && update.file_url && (
              <a
                href={update.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800"
              >
                <PaperClipIcon className="h-4 w-4" />
                <span>{update.file_name || 'Download file'}</span>
              </a>
            )}
            
            {update.update_type === 'completion_note' && (
              <p className="font-medium text-gray-900">{update.message}</p>
            )}
            
            {update.update_type === 'delayed' && update.metadata?.delay_reason && (
              <div className="text-amber-600">
                Delayed: {update.metadata.delay_reason}
              </div>
            )}
            
            {update.update_type === 'task_completed' && update.metadata?.task_name && (
              <div className="text-green-600">
                ✓ Completed: {update.metadata.task_name}
              </div>
            )}
            
            {renderMetadata()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {updates.map((update, idx) => (
          <li key={update.id}>
            <div className="relative pb-8">
              {idx !== updates.length - 1 && (
                <span
                  className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              )}
              <div className="relative">
                {renderUpdateContent(update)}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 