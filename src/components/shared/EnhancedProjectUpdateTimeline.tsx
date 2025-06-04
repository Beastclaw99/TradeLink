import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { ProjectUpdate } from '@/types/projectUpdates';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Filter, Plus } from 'lucide-react';
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
import AddProjectUpdateModal from './AddProjectUpdateModal';

interface EnhancedProjectUpdateTimelineProps {
  projectId: string;
  showAddUpdate?: boolean;
  maxUpdates?: number;
  isProfessionalView?: boolean;
  canEdit?: boolean;
  onUpdateAdded?: () => void;
  projectStatus: string;
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

const UpdateTypeBadgeColors: Record<string, { bg: string; text: string; border: string }> = {
  status_change: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
  start_time: { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200' },
  completion_note: { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200' },
  check_in: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
  check_out: { bg: 'bg-gray-50', text: 'text-gray-800', border: 'border-gray-200' },
  on_my_way: { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-200' },
  delayed: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200' },
  cancelled: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200' },
  revisit_required: { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-200' },
  expense_submitted: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
  expense_approved: { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200' },
  payment_processed: { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200' },
  task_completed: { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200' },
  message: { bg: 'bg-gray-50', text: 'text-gray-800', border: 'border-gray-200' },
};

export default function EnhancedProjectUpdateTimeline({ 
  projectId, 
  showAddUpdate = true, 
  maxUpdates,
  isProfessionalView = false,
  canEdit = false,
  onUpdateAdded,
  projectStatus
}: EnhancedProjectUpdateTimelineProps) {
  const { toast } = useToast();
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [filteredUpdates, setFilteredUpdates] = useState<ProjectUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('project_updates')
        .select('*, profiles(first_name, last_name)')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (maxUpdates) {
        query = query.limit(maxUpdates);
      }

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

  useEffect(() => {
    let filtered = updates;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(update => update.update_type === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(update => 
        update.message?.toLowerCase().includes(searchLower) ||
        update.update_type.toLowerCase().includes(searchLower) ||
        update.status_update?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredUpdates(filtered);
  }, [updates, statusFilter, searchTerm]);

  const uniqueUpdateTypes = Array.from(new Set(updates.map(update => update.update_type)));

  const handleUpdateAdded = () => {
    setIsAddModalOpen(false);
    fetchUpdates();
    onUpdateAdded?.();
    toast({
      title: "Success",
      description: "Update added successfully",
    });
  };

  const renderUpdateCard = (update: ProjectUpdate) => {
    const Icon = UpdateTypeIcons[update.update_type] || DocumentIcon;
    const colors = UpdateTypeBadgeColors[update.update_type] || { bg: 'bg-gray-50', text: 'text-gray-800', border: 'border-gray-200' };
    
    return (
      <Card key={update.id} className="transition-all duration-200 hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full ${colors.bg} ${colors.border} border flex items-center justify-center`}>
              <Icon className={`h-5 w-5 ${colors.text}`} aria-hidden="true" />
            </div>
            
            <div className="flex-grow min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Badge 
                    className={`${colors.bg} ${colors.text} ${colors.border} border`}
                    aria-label={`Update type: ${update.update_type.replace('_', ' ')}`}
                  >
                    {update.update_type.replace('_', ' ')}
                  </Badge>
                  {update.status_update && (
                    <Badge variant="outline" className="text-xs">
                      {update.status_update}
                    </Badge>
                  )}
                </div>
                <time 
                  className="text-sm text-gray-500 flex-shrink-0"
                  dateTime={update.created_at}
                >
                  {format(new Date(update.created_at), 'MMM d, h:mm a')}
                </time>
              </div>
              
              {isProfessionalView && update.profiles && (
                <p className="text-sm text-gray-600 mb-2">
                  By: {update.profiles.first_name} {update.profiles.last_name}
                </p>
              )}
              
              {update.message && (
                <p className="text-gray-700 mb-2 break-words">{update.message}</p>
              )}
              
              {update.file_url && (
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <a
                      href={`${supabase.storage.from('project-files').getPublicUrl(update.file_url).data.publicUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Download attached file"
                    >
                      <PaperClipIcon className="h-4 w-4 mr-1" />
                      View Attachment
                    </a>
                  </Button>
                </div>
              )}
              
              {update.metadata && (
                <div className="mt-2 text-sm text-gray-600">
                  {update.metadata.geolocation && (
                    <p>📍 Location: {update.metadata.geolocation.latitude.toFixed(6)}, {update.metadata.geolocation.longitude.toFixed(6)}</p>
                  )}
                  {update.metadata.amount && (
                    <p>💰 Amount: ${update.metadata.amount}</p>
                  )}
                  {update.metadata.task_name && (
                    <p>📋 Task: {update.metadata.task_name}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-grow space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <p className="text-red-600" role="alert">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Update and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Project Updates</h3>
          <Badge variant="outline" className="text-xs">
            {filteredUpdates.length} of {updates.length}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
            aria-expanded={showFilters}
            aria-controls="filter-panel"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          
          {showAddUpdate && canEdit && (
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Update
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Project Update</DialogTitle>
                </DialogHeader>
                <AddProjectUpdateModal
                  projectId={projectId}
                  onUpdateAdded={handleUpdateAdded}
                  projectStatus={projectStatus}
                  isProfessional={isProfessionalView}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card id="filter-panel" className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Filter Updates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium mb-1">
                  Status Type
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Updates</SelectItem>
                    {uniqueUpdateTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="search-updates" className="block text-sm font-medium mb-1">
                  Search Updates
                </label>
                <Input
                  id="search-updates"
                  type="text"
                  placeholder="Search messages, types..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            
            {(statusFilter !== 'all' || searchTerm) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setStatusFilter('all');
                  setSearchTerm('');
                }}
                className="text-sm"
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Updates Timeline */}
      <div className="space-y-4">
        {filteredUpdates.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <ClockIcon className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {updates.length === 0 ? 'No Updates Yet' : 'No Matching Updates'}
              </h3>
              <p className="text-gray-500 max-w-sm">
                {updates.length === 0 
                  ? 'Project updates will appear here as work progresses.'
                  : 'Try adjusting your filters to see more updates.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <ScrollArea className="h-auto max-h-[600px]">
            <div className="space-y-4 pr-4">
              {filteredUpdates.map(renderUpdateCard)}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
