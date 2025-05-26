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
  TruckIcon,
  ArrowPathIcon,
  BanknotesIcon,
  ListBulletIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';

interface ProjectUpdateTimelineProps {
  projectId: string; // Using camelCase for React props
}

const UpdateTypeIcons: Record<string, React.ElementType> = {
  message: DocumentIcon,
  status_change: CheckCircleIcon,
  file_upload: PaperClipIcon,
  site_check: MapPinIcon,
  start_time: ClockIcon,
  completion_note: CheckCircleIcon,
  check_in: CheckIcon,
  check_out: XMarkIcon,
  on_my_way: TruckIcon,
  delayed: ExclamationCircleIcon,
  cancelled: XMarkIcon,
  revisit_required: ArrowPathIcon,
  expense_submitted: BanknotesIcon,
  expense_approved: CurrencyDollarIcon,
  payment_processed: BanknotesIcon,
  schedule_updated: CalendarIcon,
  task_completed: ListBulletIcon,
  custom_field_updated: PencilSquareIcon,
};

const UpdateTypeBadgeColors: Record<string, { bg: string; text: string }> = {
  status_change: { bg: 'bg-blue-100', text: 'text-blue-800' },
  start_time: { bg: 'bg-green-100', text: 'text-green-800' },
  completion_note: { bg: 'bg-green-100', text: 'text-green-800' },
  check_in: { bg: 'bg-blue-100', text: 'text-blue-800' },
  check_out: { bg: 'bg-gray-100', text: 'text-gray-800' },
  on_my_way: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  delayed: { bg: 'bg-red-100', text: 'text-red-800' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-800' },
  revisit_required: { bg: 'bg-orange-100', text: 'text-orange-800' },
  expense_submitted: { bg: 'bg-purple-100', text: 'text-purple-800' },
  expense_approved: { bg: 'bg-green-100', text: 'text-green-800' },
  payment_processed: { bg: 'bg-green-100', text: 'text-green-800' },
  task_completed: { bg: 'bg-green-100', text: 'text-green-800' },
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
          .eq('project_id', projectId) // Using the prop name in the query
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
              <p>Checked by: {update.metadata.checked_by}</p>
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
      <div className="flex space-x-4 group">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <Icon className={`h-5 w-5 ${colors.text}`} />
        </div>
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {format(new Date(update.created_at), 'MMM d, yyyy h:mm a')}
            </span>
            {update.update_type !== 'message' && renderBadge(update.update_type.replace('_', ' '))}
          </div>
          
          <div className="mt-2">
            {update.update_type === 'message' && (
              <p className="text-gray-700">{update.message}</p>
            )}
            
            {update.update_type === 'status_change' && (
              <div className="mt-1">{renderBadge(update.status_update || '')}</div>
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
            
            {update.update_type === 'start_time' && (
              <p className="text-gray-700">Work started at {format(new Date(update.created_at), 'h:mm a')}</p>
            )}
            
            {update.update_type === 'completion_note' && (
              <p className="font-medium text-gray-900">{update.message}</p>
            )}
            
            {update.update_type === 'check_in' && (
              <p className="text-gray-700">
                {update.metadata?.checked_by || 'Professional'} checked in
              </p>
            )}
            
            {update.update_type === 'check_out' && (
              <p className="text-gray-700">
                {update.metadata?.checked_by || 'Professional'} checked out
              </p>
            )}
            
            {update.update_type === 'on_my_way' && (
              <p className="text-gray-700">Professional is en route to the job site</p>
            )}
            
            {update.update_type === 'cancelled' && (
              <p className="text-red-600">
                Cancelled by {update.metadata?.cancelled_by || 'unknown'} at{' '}
                {format(new Date(update.created_at), 'h:mm a')}
              </p>
            )}
            
            {update.update_type === 'payment_processed' && (
              <p className="text-green-600">Payment has been processed successfully</p>
            )}
            
            {update.update_type === 'schedule_updated' && update.metadata?.new_time && (
              <p className="text-gray-700">
                Rescheduled to: {format(new Date(update.metadata.new_time), 'MMM d, yyyy h:mm a')}
              </p>
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