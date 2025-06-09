
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { History, FileText, MessageSquare, CheckCircle, AlertCircle, Archive } from 'lucide-react';
import { format } from 'date-fns';

interface HistoryItem {
  id: string;
  history_type: string;
  history_data: any;
  created_at: string;
  created_by_name?: string;
  created_by_id?: string;
}

interface ProjectHistoryProps {
  projectId: string;
}

const ProjectHistory: React.FC<ProjectHistoryProps> = ({ projectId }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadHistory();
  }, [projectId]);

  const loadHistory = async () => {
    try {
      // Fetch project history
      const { data: historyData, error: historyError } = await supabase
        .from('project_history')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (historyError) throw historyError;

      // If we have history items with created_by, fetch user names
      const userIds = historyData
        ?.filter(item => item.created_by)
        .map(item => item.created_by) || [];

      let profiles: any[] = [];
      if (userIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', userIds);

        if (!profilesError) {
          profiles = profilesData || [];
        }
      }

      // Transform the data
      const transformedHistory: HistoryItem[] = (historyData || []).map(item => {
        const profile = profiles.find(p => p.id === item.created_by);
        return {
          id: item.id,
          history_type: item.history_type,
          history_data: item.history_data,
          created_at: item.created_at,
          created_by_name: profile ? `${profile.first_name} ${profile.last_name}` : 'System',
          created_by_id: item.created_by
        };
      });
      
      setHistory(transformedHistory);
    } catch (error: any) {
      console.error('Error loading project history:', error);
      toast({
        title: 'Error',
        description: 'Failed to load project history.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getHistoryIcon = (type: string) => {
    switch (type) {
      case 'status_change':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'milestone':
        return <FileText className="h-5 w-5 text-green-500" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
      case 'archive':
        return <Archive className="h-5 w-5 text-gray-500" />;
      default:
        return <History className="h-5 w-5 text-gray-500" />;
    }
  };

  const getHistoryTitle = (type: string, data: any) => {
    switch (type) {
      case 'status_change':
        return `Status changed to ${data.new_status || 'Unknown'}`;
      case 'milestone':
        return `Milestone "${data.milestone_title || 'Unknown'}" ${data.action || 'updated'}`;
      case 'message':
        return 'New message added';
      case 'archive':
        return 'Project archived';
      default:
        return type.replace('_', ' ');
    }
  };

  const getHistoryDescription = (type: string, data: any) => {
    if (!data) return 'No additional details';
    
    switch (type) {
      case 'status_change':
        return data.reason || data.previous_status ? 
          `Changed from ${data.previous_status || 'Unknown'} to ${data.new_status || 'Unknown'}` : 
          'Status updated';
      case 'milestone':
        return data.description || 'Milestone updated';
      case 'message':
        return data.message || 'Message content not available';
      case 'archive':
        return data.reason || 'Project archived';
      default:
        return typeof data === 'object' ? JSON.stringify(data) : String(data);
    }
  };

  if (loading) {
    return <div>Loading project history...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <History className="h-5 w-5 mr-2" />
          Project History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {history.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No history available for this project.
            </div>
          ) : (
            history.map((item) => (
              <div key={item.id} className="flex space-x-4">
                <div className="flex-shrink-0">
                  {getHistoryIcon(item.history_type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">
                      {getHistoryTitle(item.history_type, item.history_data)}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {format(new Date(item.created_at), 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {getHistoryDescription(item.history_type, item.history_data)}
                  </p>
                  <div className="flex items-center mt-2">
                    <span className="text-xs text-gray-500">
                      By {item.created_by_name || 'Unknown User'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-4">
          <Button variant="outline" onClick={loadHistory} size="sm">
            Refresh History
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectHistory;
