
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, File, Download, Trash2, Plus, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { Deliverable } from '@/types';

interface ProjectDeliverablesProps {
  projectId: string;
}

const ProjectDeliverables: React.FC<ProjectDeliverablesProps> = ({ projectId }) => {
  const { toast } = useToast();
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newDeliverable, setNewDeliverable] = useState({
    title: '',
    description: '',
    deliverable_type: 'text' as const,
    content: ''
  });

  const fetchDeliverables = async () => {
    try {
      const { data, error } = await supabase
        .from('project_deliverables')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Transform the data to match our Deliverable type
      const transformedDeliverables: Deliverable[] = (data || []).map(item => ({
        id: item.id,
        title: item.description || 'Untitled Deliverable',
        description: item.description || '',
        deliverable_type: (item.deliverable_type === 'file' ? 'file' : 'text') as 'text' | 'file',
        content: item.content || '',
        milestone_id: item.milestone_id || '',
        file_url: item.file_url,
        file_name: item.file_url ? item.file_url.split('/').pop() : undefined,
        created_at: item.created_at || undefined,
        updated_at: item.created_at || undefined
      }));

      setDeliverables(transformedDeliverables);
    } catch (error: any) {
      console.error('Error fetching deliverables:', error);
      toast({
        title: "Error",
        description: "Failed to load deliverables",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliverables();
  }, [projectId]);

  const handleSubmitDeliverable = async () => {
    if (!newDeliverable.title.trim()) {
      toast({
        title: "Error",
        description: "Please provide a title for the deliverable",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('project_deliverables')
        .insert([{
          project_id: projectId,
          description: newDeliverable.title,
          deliverable_type: newDeliverable.deliverable_type,
          content: newDeliverable.content,
          file_url: newDeliverable.deliverable_type === 'file' ? newDeliverable.content : ''
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Deliverable submitted successfully"
      });

      setNewDeliverable({
        title: '',
        description: '',
        deliverable_type: 'text',
        content: ''
      });

      fetchDeliverables();
    } catch (error: any) {
      console.error('Error submitting deliverable:', error);
      toast({
        title: "Error",
        description: "Failed to submit deliverable",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDeliverable = async (deliverableId: string) => {
    try {
      const { error } = await supabase
        .from('project_deliverables')
        .delete()
        .eq('id', deliverableId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Deliverable deleted successfully"
      });

      fetchDeliverables();
    } catch (error: any) {
      console.error('Error deleting deliverable:', error);
      toast({
        title: "Error",
        description: "Failed to delete deliverable",
        variant: "destructive"
      });
    }
  };

  const getDeliverableTypeColor = (type: string) => {
    return type === 'file' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project Deliverables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading deliverables...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <File className="h-5 w-5" />
            Project Deliverables
          </CardTitle>
        </CardHeader>
        <CardContent>
          {deliverables.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No deliverables submitted yet.
            </div>
          ) : (
            <div className="space-y-4">
              {deliverables.map((deliverable) => (
                <div
                  key={deliverable.id}
                  className="border rounded-lg p-4 flex items-start justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{deliverable.title}</h3>
                      <Badge className={getDeliverableTypeColor(deliverable.deliverable_type)}>
                        {deliverable.deliverable_type}
                      </Badge>
                    </div>
                    {deliverable.description && (
                      <p className="text-gray-600 text-sm mb-2">{deliverable.description}</p>
                    )}
                    {deliverable.deliverable_type === 'file' && deliverable.file_url && (
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <File className="h-4 w-4" />
                        <a
                          href={deliverable.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {deliverable.file_name || 'Download File'}
                        </a>
                      </div>
                    )}
                    {deliverable.created_at && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(deliverable.created_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteDeliverable(deliverable.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add New Deliverable Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Submit New Deliverable
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Deliverable title"
            value={newDeliverable.title}
            onChange={(e) => setNewDeliverable(prev => ({ ...prev, title: e.target.value }))}
          />
          
          <Textarea
            placeholder="Description (optional)"
            value={newDeliverable.description}
            onChange={(e) => setNewDeliverable(prev => ({ ...prev, description: e.target.value }))}
          />
          
          <Select
            value={newDeliverable.deliverable_type}
            onValueChange={(value: 'text' | 'file') => 
              setNewDeliverable(prev => ({ ...prev, deliverable_type: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text Content</SelectItem>
              <SelectItem value="file">File Upload</SelectItem>
            </SelectContent>
          </Select>
          
          {newDeliverable.deliverable_type === 'text' ? (
            <Textarea
              placeholder="Enter your content here..."
              value={newDeliverable.content}
              onChange={(e) => setNewDeliverable(prev => ({ ...prev, content: e.target.value }))}
              rows={4}
            />
          ) : (
            <Input
              type="url"
              placeholder="File URL"
              value={newDeliverable.content}
              onChange={(e) => setNewDeliverable(prev => ({ ...prev, content: e.target.value }))}
            />
          )}
          
          <Button
            onClick={handleSubmitDeliverable}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Submitting..." : "Submit Deliverable"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDeliverables;
