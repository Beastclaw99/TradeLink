import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ProjectStatus, ProjectUpdate, UpdateType } from '@/types/projectUpdates';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface StatusHistoryProps {
  projectId: string;
}

interface StatusUpdate extends Omit<ProjectUpdate, 'profiles'> {
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    profile_image: string | null;
  };
}

interface DatabaseUpdate {
  id: string;
  project_id: string;
  update_type: UpdateType;
  message: string | null;
  status_update: ProjectStatus | null;
  file_url: string | null;
  file_name: string | null;
  created_at: string;
  professional_id: string;
  metadata: {
    previous_status?: ProjectStatus;
    cancellation_reason?: string;
    dispute_reason?: string;
    revision_notes?: string;
    [key: string]: any;
  };
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    profile_image: string | null;
  };
}

const statusColors: Record<ProjectStatus, string> = {
  open: 'bg-blue-100 text-blue-800',
  assigned: 'bg-purple-100 text-purple-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  work_submitted: 'bg-indigo-100 text-indigo-800',
  work_revision_requested: 'bg-orange-100 text-orange-800',
  work_approved: 'bg-green-100 text-green-800',
  completed: 'bg-emerald-100 text-emerald-800',
  paid: 'bg-green-600 text-white',
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

      return (data as DatabaseUpdate[]).map(update => ({
        ...update,
        update_type: update.update_type as UpdateType,
        status_update: update.status_update as ProjectStatus,
        metadata: update.metadata as StatusUpdate['metadata']
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
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[300px]" />
                </div>
              </div>
            ))}
          </div>
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
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>No status changes recorded yet.</p>
          </div>
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
        <div className="space-y-6">
          {statusUpdates.map((update) => (
            <div key={update.id} className="flex items-start space-x-4">
              <Avatar>
                <AvatarImage src={update.profiles?.profile_image || undefined} />
                <AvatarFallback>
                  {update.profiles?.first_name?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">
                      {update.profiles?.first_name && update.profiles?.last_name
                        ? `${update.profiles.first_name} ${update.profiles.last_name}`
                        : 'Unknown User'}
                    </span>
                    {update.status_update && (
                      <Badge variant="secondary" className={statusColors[update.status_update]}>
                        {update.status_update.replace('_', ' ')}
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(update.created_at), { addSuffix: true })}
                  </span>
                </div>
                
                {update.metadata?.previous_status && (
                  <p className="text-sm text-gray-600">
                    Changed from{' '}
                    <span className="font-medium">
                      {update.metadata.previous_status.replace('_', ' ')}
                    </span>
                  </p>
                )}
                
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default StatusHistory; 