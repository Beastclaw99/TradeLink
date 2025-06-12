import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow, format } from 'date-fns';
import { ProjectStatus, ProjectUpdate, UpdateType } from '@/types/projectUpdates';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProjectStatusUpdate } from '@/types/database';

interface StatusHistoryProps {
  projectId: string;
}

interface StatusMetadata {
  previous_status?: ProjectStatus;
  cancellation_reason?: string;
  dispute_reason?: string;
  revision_notes?: string;
}

interface StatusUpdate extends Omit<ProjectStatusUpdate, 'metadata'> {
  metadata: StatusMetadata;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    profile_image: string | null;
  };
}

const statusColors: Record<ProjectStatus, string> = {
  draft: 'bg-gray-100 text-gray-800',
  open: 'bg-blue-100 text-blue-800',
  assigned: 'bg-purple-100 text-purple-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  work_submitted: 'bg-indigo-100 text-indigo-800',
  work_revision_requested: 'bg-orange-100 text-orange-800',
  work_approved: 'bg-green-100 text-green-800',
  completed: 'bg-emerald-100 text-emerald-800',
  archived: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
  disputed: 'bg-rose-100 text-rose-800'
};

export function StatusHistory({ projectId }: StatusHistoryProps) {
  const { data: statusUpdates, isLoading } = useQuery<StatusUpdate[]>({
    queryKey: ['project-status-history', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_updates')
        .select(`
          *,
          profiles!project_updates_user_id_fkey (
            first_name,
            last_name,
            profile_image
          )
        `)
        .eq('project_id', projectId)
        .eq('update_type', 'status_change')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(update => ({
        ...update,
        metadata: update.metadata as StatusMetadata,
        profiles: update.profiles as StatusUpdate['profiles']
      }));
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Status History</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-4 text-gray-500">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (!statusUpdates?.length) {
    return (
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Status History</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-4 text-gray-500">No status updates yet</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Status History</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {statusUpdates.map((update) => (
            <div key={update.id} className="flex items-start space-x-4">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className={statusColors[update.status_update as ProjectStatus]}>
                      {update.status_update}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {format(new Date(update.created_at || ''), 'PPP')}
                    </span>
                  </div>
                  {update.profiles && (
                    <span className="text-sm text-gray-600">
                      by {update.profiles.first_name} {update.profiles.last_name}
                    </span>
                  )}
                </div>
                <div className="mt-2 space-y-1">
                  {update.metadata?.cancellation_reason && (
                    <p className="text-sm text-gray-600">
                      Cancellation reason: {update.metadata.cancellation_reason}
                    </p>
                  )}
                  {update.metadata?.dispute_reason && (
                    <p className="text-sm text-gray-600">
                      Dispute reason: {update.metadata.dispute_reason}
                    </p>
                  )}
                  {update.metadata?.revision_notes && (
                    <p className="text-sm text-gray-600">
                      Revision notes: {update.metadata.revision_notes}
                    </p>
                  )}
                  {update.message && (
                    <p className="text-sm text-gray-600">{update.message}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default StatusHistory; 