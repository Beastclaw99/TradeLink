import { useState, useEffect, useCallback, useMemo } from 'react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UpdateType, ProjectUpdate } from '@/types/projectUpdates';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import {
  ClockIcon,
  ExclamationCircleIcon,
  DocumentIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckCircleIcon,
  XMarkIcon,
  PaperClipIcon,
  MapPinIcon,
  TruckIcon,
  BanknotesIcon,
  ListBulletIcon,
  PencilSquareIcon,
  XMarkIcon as XMark,
} from '@heroicons/react/24/outline';
import AddProjectUpdate from '../project/updates/AddProjectUpdate';

interface UnifiedProjectUpdateTimelineProps {
  projectId: string;
  isProfessional: boolean;
  projectStatus: string;
}

const UpdateTypeIcons: Record<string, React.ElementType> = {
  message: DocumentIcon,
  status_change: CheckCircleIcon,
  file_upload: PaperClipIcon,
  site_check: MapPinIcon,
  start_time: ClockIcon,
  completion_note: CheckCircleIcon,
  check_in: CheckCircleIcon,
  check_out: XMarkIcon,
  on_my_way: TruckIcon,
  delayed: ExclamationCircleIcon,
  cancelled: XMarkIcon,
  revisit_required: XMarkIcon,
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

type UpdateGroupKey = 'activity' | 'status' | 'files' | 'expenses' | 'schedule';

// Update type groups for better organization
const UPDATE_TYPE_GROUPS: Record<UpdateGroupKey, {
  label: string;
  types: readonly UpdateType[];
  icon: typeof ClockIcon;
}> = {
  activity: {
    label: 'Activity',
    types: ['message', 'check_in', 'check_out', 'on_my_way', 'site_check'] as const,
    icon: ClockIcon
  },
  status: {
    label: 'Status',
    types: ['status_change', 'delayed', 'cancelled', 'revisit_required'] as const,
    icon: ExclamationCircleIcon
  },
  files: {
    label: 'Files & Notes',
    types: ['file_upload', 'completion_note'] as const,
    icon: DocumentIcon
  },
  expenses: {
    label: 'Expenses',
    types: ['expense_submitted', 'expense_approved', 'payment_processed'] as const,
    icon: CurrencyDollarIcon
  },
  schedule: {
    label: 'Schedule',
    types: ['start_time', 'schedule_updated'] as const,
    icon: CalendarIcon
  }
} as const;

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
  const [selectedGroup, setSelectedGroup] = useState<UpdateGroupKey>('activity');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('project_updates')
        .select('*, profiles(first_name, last_name)')
        .eq('project_id', projectId)
        .order('created_at', { ascending: sortOrder === 'asc' });

      const { data, error: fetchError } = await query;

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
  }, [projectId, sortOrder]);

  // Filter and sort updates
  const filteredUpdates = useMemo(() => {
    let filtered = [...updates];
    
    // Filter by type
    const groupTypes = UPDATE_TYPE_GROUPS[selectedGroup].types;
    filtered = filtered.filter(update => 
      groupTypes.includes(update.update_type as UpdateType)
    );
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(update => 
        update.message?.toLowerCase().includes(query) ||
        (update.profiles?.first_name?.toLowerCase() || '').includes(query) ||
        (update.profiles?.last_name?.toLowerCase() || '').includes(query)
      );
    }
    
    // Sort updates
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at || '').getTime();
      const dateB = new Date(b.created_at || '').getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    
    return filtered;
  }, [updates, selectedGroup, searchQuery, sortOrder]);

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
        onUpdateAdded={() => {
          fetchUpdates();
        }}
        projectStatus={projectStatus}
        isProfessional={isProfessional}
      />

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search updates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Tabs value={selectedGroup} onValueChange={(value: UpdateGroupKey) => setSelectedGroup(value)}>
              <TabsList className="w-full">
                {Object.entries(UPDATE_TYPE_GROUPS).map(([key, { label }]) => (
                  <TabsTrigger key={key} value={key}>{label}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="w-full"
            >
              {sortOrder === 'asc' ? (
                <ArrowUpIcon className="h-4 w-4 mr-2" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 mr-2" />
              )}
              {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Updates Timeline */}
      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-4">
          {filteredUpdates.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                No updates found.
              </CardContent>
            </Card>
          ) : (
            filteredUpdates.map((update) => (
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
