
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { 
  Plus, 
  Target, 
  CheckCircle, 
  Clock, 
  Calendar,
  Edit,
  Trash2
} from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  status: string;
  is_complete: boolean;
  requires_deliverable: boolean;
  created_at: string;
  updated_at?: string;
}

interface ProjectMilestonesProps {
  projectId: string;
  canEdit?: boolean;
}

const ProjectMilestones: React.FC<ProjectMilestonesProps> = ({ 
  projectId, 
  canEdit = false 
}) => {
  const { toast } = useToast();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    requires_deliverable: false
  });

  useEffect(() => {
    fetchMilestones();
  }, [projectId]);

  const fetchMilestones = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('project_milestones')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMilestones(data || []);
    } catch (error) {
      console.error('Error fetching milestones:', error);
      toast({
        title: "Error",
        description: "Failed to load project milestones",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const milestoneData = {
        ...formData,
        project_id: projectId,
        created_by: user.id,
        status: 'not_started',
        is_complete: false,
        due_date: formData.due_date || null
      };

      if (editingMilestone) {
        const { error } = await supabase
          .from('project_milestones')
          .update(milestoneData)
          .eq('id', editingMilestone.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Milestone updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('project_milestones')
          .insert([milestoneData]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Milestone created successfully"
        });
      }

      setDialogOpen(false);
      setEditingMilestone(null);
      setFormData({
        title: '',
        description: '',
        due_date: '',
        requires_deliverable: false
      });
      fetchMilestones();
    } catch (error) {
      console.error('Error saving milestone:', error);
      toast({
        title: "Error",
        description: "Failed to save milestone",
        variant: "destructive"
      });
    }
  };

  const toggleMilestoneComplete = async (milestone: Milestone) => {
    try {
      const { error } = await supabase
        .from('project_milestones')
        .update({ 
          is_complete: !milestone.is_complete,
          status: !milestone.is_complete ? 'completed' : 'in_progress'
        })
        .eq('id', milestone.id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Milestone marked as ${!milestone.is_complete ? 'completed' : 'incomplete'}`
      });
      
      fetchMilestones();
    } catch (error) {
      console.error('Error updating milestone:', error);
      toast({
        title: "Error",
        description: "Failed to update milestone",
        variant: "destructive"
      });
    }
  };

  const deleteMilestone = async (milestoneId: string) => {
    try {
      const { error } = await supabase
        .from('project_milestones')
        .delete()
        .eq('id', milestoneId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Milestone deleted successfully"
      });
      
      fetchMilestones();
    } catch (error) {
      console.error('Error deleting milestone:', error);
      toast({
        title: "Error",
        description: "Failed to delete milestone",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (milestone: Milestone) => {
    setEditingMilestone(milestone);
    setFormData({
      title: milestone.title,
      description: milestone.description || '',
      due_date: milestone.due_date || '',
      requires_deliverable: milestone.requires_deliverable
    });
    setDialogOpen(true);
  };

  const getStatusColor = (status: string, isComplete: boolean) => {
    if (isComplete) return 'bg-green-100 text-green-800';
    switch (status) {
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const completedMilestones = milestones.filter(m => m.is_complete).length;
  const totalMilestones = milestones.length;
  const progressPercentage = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Target className="h-5 w-5" />
            Project Milestones
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{completedMilestones} of {totalMilestones} completed</span>
            <Progress value={progressPercentage} className="w-32 h-2" />
            <span>{Math.round(progressPercentage)}%</span>
          </div>
        </div>
        
        {canEdit && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Milestone
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingMilestone ? 'Edit Milestone' : 'Create New Milestone'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="due_date">Due Date</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="requires_deliverable"
                    checked={formData.requires_deliverable}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, requires_deliverable: checked }))
                    }
                  />
                  <Label htmlFor="requires_deliverable">Requires Deliverable</Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setDialogOpen(false);
                      setEditingMilestone(null);
                      setFormData({ title: '', description: '', due_date: '', requires_deliverable: false });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingMilestone ? 'Update' : 'Create'} Milestone
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {milestones.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="text-center py-8">
            <Target className="w-10 h-10 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600">No milestones defined for this project yet.</p>
            {canEdit && (
              <Button 
                className="mt-3" 
                onClick={() => setDialogOpen(true)}
              >
                Create First Milestone
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {milestones.map((milestone) => (
            <Card key={milestone.id} className={milestone.is_complete ? 'bg-green-50 border-green-200' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => canEdit && toggleMilestoneComplete(milestone)}
                      disabled={!canEdit}
                      className={`mt-1 ${canEdit ? 'cursor-pointer' : 'cursor-default'}`}
                    >
                      {milestone.is_complete ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    <div>
                      <CardTitle className={`text-lg ${milestone.is_complete ? 'line-through text-gray-600' : ''}`}>
                        {milestone.title}
                      </CardTitle>
                      {milestone.description && (
                        <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(milestone.status, milestone.is_complete)}>
                      {milestone.is_complete ? 'Completed' : milestone.status.replace('_', ' ')}
                    </Badge>
                    {canEdit && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openEditDialog(milestone)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteMilestone(milestone.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {milestone.due_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Due: {new Date(milestone.due_date).toLocaleDateString()}
                    </span>
                  )}
                  {milestone.requires_deliverable && (
                    <Badge variant="outline" className="text-xs">
                      Requires Deliverable
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectMilestones;
