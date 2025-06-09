import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Archive, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface ProjectArchivalProps {
  projectId: string;
  projectTitle: string;
  onArchive: () => void;
}

const ProjectArchival: React.FC<ProjectArchivalProps> = ({ projectId, projectTitle, onArchive }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [archiveReason, setArchiveReason] = useState('');
  const [archiveNotes, setArchiveNotes] = useState('');
  const [isArchiving, setIsArchiving] = useState(false);
  const { toast } = useToast();

  const handleArchive = async () => {
    if (!archiveReason.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a reason for archiving.',
        variant: 'destructive'
      });
      return;
    }

    setIsArchiving(true);
    try {
      // Start transaction
      const { error: archiveError } = await supabase
        .from('project_archives')
        .insert({
          project_id: projectId,
          archive_reason: archiveReason,
          archive_notes: archiveNotes,
          archived_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (archiveError) throw archiveError;

      // Update project status to archived
      const { error: updateError } = await supabase
        .from('projects')
        .update({ status: 'archived' })
        .eq('id', projectId);

      if (updateError) throw updateError;

      // Create project history record
      const { error: historyError } = await supabase
        .from('project_history')
        .insert({
          project_id: projectId,
          history_type: 'archive',
          history_data: {
            reason: archiveReason,
            notes: archiveNotes,
            archived_at: new Date().toISOString()
          }
        });

      if (historyError) throw historyError;

      toast({
        title: 'Success',
        description: 'Project has been archived successfully.'
      });

      setIsDialogOpen(false);
      onArchive();
    } catch (error: any) {
      console.error('Error archiving project:', error);
      toast({
        title: 'Error',
        description: 'Failed to archive project.',
        variant: 'destructive'
      });
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => setIsDialogOpen(true)}
      >
        <Archive className="h-4 w-4 mr-2" />
        Archive Project
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to archive "{projectTitle}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Archiving *</Label>
              <Textarea
                id="reason"
                value={archiveReason}
                onChange={(e) => setArchiveReason(e.target.value)}
                placeholder="Please provide a reason for archiving this project..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={archiveNotes}
                onChange={(e) => setArchiveNotes(e.target.value)}
                placeholder="Add any additional notes about the project..."
              />
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Important</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Archiving a project will:
                    <ul className="list-disc list-inside mt-2">
                      <li>Move the project to archived status</li>
                      <li>Preserve all project data and history</li>
                      <li>Make the project read-only</li>
                    </ul>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isArchiving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleArchive}
              disabled={isArchiving || !archiveReason.trim()}
            >
              {isArchiving ? 'Archiving...' : 'Archive Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectArchival; 