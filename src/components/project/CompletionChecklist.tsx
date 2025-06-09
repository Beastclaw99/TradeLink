import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface ChecklistItem {
  id: string;
  item_type: string;
  item_name: string;
  is_required: boolean;
  is_completed: boolean;
  completed_at: string | null;
  completed_by: string | null;
  notes: string | null;
}

interface CompletionChecklistProps {
  projectId: string;
  onComplete: () => void;
}

const CompletionChecklist: React.FC<CompletionChecklistProps> = ({ projectId, onComplete }) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadChecklist();
  }, [projectId]);

  const loadChecklist = async () => {
    try {
      const { data, error } = await supabase
        .from('project_completion_checklist')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at');

      if (error) throw error;

      if (!data || data.length === 0) {
        // Initialize default checklist items
        const defaultItems = [
          {
            project_id: projectId,
            item_type: 'deliverable',
            item_name: 'All deliverables submitted and approved',
            is_required: true,
            is_completed: false
          },
          {
            project_id: projectId,
            item_type: 'milestone',
            item_name: 'All milestones completed',
            is_required: true,
            is_completed: false
          },
          {
            project_id: projectId,
            item_type: 'review',
            item_name: 'Client review submitted',
            is_required: true,
            is_completed: false
          },
          {
            project_id: projectId,
            item_type: 'payment',
            item_name: 'Final payment processed',
            is_required: true,
            is_completed: false
          },
          {
            project_id: projectId,
            item_type: 'documentation',
            item_name: 'Project documentation completed',
            is_required: false,
            is_completed: false
          }
        ];

        const { data: newItems, error: insertError } = await supabase
          .from('project_completion_checklist')
          .insert(defaultItems)
          .select();

        if (insertError) throw insertError;
        setChecklist(newItems || []);
      } else {
        setChecklist(data);
      }
    } catch (error: any) {
      console.error('Error loading checklist:', error);
      toast({
        title: 'Error',
        description: 'Failed to load completion checklist.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (itemId: string) => {
    setSelectedItem(itemId);
    const item = checklist.find(i => i.id === itemId);
    setNotes(item?.notes || '');
  };

  const handleItemComplete = async (itemId: string) => {
    try {
      const item = checklist.find(i => i.id === itemId);
      if (!item) return;

      const { error } = await supabase
        .from('project_completion_checklist')
        .update({
          is_completed: !item.is_completed,
          completed_at: !item.is_completed ? new Date().toISOString() : null,
          completed_by: !item.is_completed ? (await supabase.auth.getUser()).data.user?.id : null,
          notes: notes
        })
        .eq('id', itemId);

      if (error) throw error;

      await loadChecklist();
      setSelectedItem(null);
      setNotes('');

      // Check if all required items are completed
      const updatedChecklist = checklist.map(i => 
        i.id === itemId ? { ...i, is_completed: !i.is_completed } : i
      );
      const allRequiredCompleted = updatedChecklist
        .filter(i => i.is_required)
        .every(i => i.is_completed);

      if (allRequiredCompleted) {
        onComplete();
      }
    } catch (error: any) {
      console.error('Error updating checklist item:', error);
      toast({
        title: 'Error',
        description: 'Failed to update checklist item.',
        variant: 'destructive'
      });
    }
  };

  const handleNotesSave = async () => {
    if (!selectedItem) return;

    try {
      const { error } = await supabase
        .from('project_completion_checklist')
        .update({ notes })
        .eq('id', selectedItem);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Notes saved successfully.'
      });

      setSelectedItem(null);
      setNotes('');
    } catch (error: any) {
      console.error('Error saving notes:', error);
      toast({
        title: 'Error',
        description: 'Failed to save notes.',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return <div>Loading checklist...</div>;
  }

  const allRequiredCompleted = checklist
    .filter(item => item.is_required)
    .every(item => item.is_completed);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Project Completion Checklist</span>
          {allRequiredCompleted && (
            <span className="text-green-600 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Ready to Complete
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {checklist.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-lg border ${
                selectedItem === item.id ? 'border-blue-500' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start space-x-3">
                <Checkbox
                  checked={item.is_completed}
                  onCheckedChange={() => handleItemComplete(item.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor={item.id}
                      className={`text-sm font-medium ${
                        item.is_completed ? 'line-through text-gray-500' : ''
                      }`}
                    >
                      {item.item_name}
                      {item.is_required && (
                        <span className="ml-2 text-red-500">*</span>
                      )}
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleItemClick(item.id)}
                    >
                      {item.notes ? 'Edit Notes' : 'Add Notes'}
                    </Button>
                  </div>
                  {item.completed_at && (
                    <p className="text-xs text-gray-500 mt-1">
                      Completed on {new Date(item.completed_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              {selectedItem === item.id && (
                <div className="mt-3">
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this item..."
                    className="mb-2"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedItem(null);
                        setNotes('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleNotesSave}
                    >
                      Save Notes
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompletionChecklist; 