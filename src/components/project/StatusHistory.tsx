
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface StatusUpdate {
  id: string;
  project_id: string;
  update_type: string;
  status_update?: string;
  message?: string;
  file_url?: string;
  file_name?: string;
  created_at: string;
  professional_id: string;
  metadata?: any;
  profiles?: {
    first_name?: string;
    last_name?: string;
  };
}

interface StatusHistoryProps {
  projectId: string;
}

const StatusHistory: React.FC<StatusHistoryProps> = ({ projectId }) => {
  const { data: updates, isLoading } = useQuery({
    queryKey: ['project-status-history', projectId],
    queryFn: async (): Promise<StatusUpdate[]> => {
      const { data, error } = await supabase
        .from('project_updates')
        .select(`
          *,
          profiles:professional_id(first_name, last_name)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map(item => ({
        ...item,
        message: item.message || undefined,
        file_url: item.file_url || undefined,
        file_name: item.file_name || undefined,
        project_id: item.project_id || '',
        professional_id: item.professional_id || '',
        created_at: item.created_at || new Date().toISOString()
      }));
    }
  });

  if (isLoading) {
    return <div>Loading status history...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {updates?.map((update) => (
            <div key={update.id} className="border-l-2 border-gray-200 pl-4 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{update.update_type}</Badge>
                <span className="text-sm text-gray-500">
                  {new Date(update.created_at).toLocaleDateString()}
                </span>
              </div>
              {update.message && (
                <p className="text-sm text-gray-700">{update.message}</p>
              )}
              {update.profiles && (
                <p className="text-xs text-gray-500 mt-1">
                  By: {update.profiles.first_name} {update.profiles.last_name}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusHistory;
