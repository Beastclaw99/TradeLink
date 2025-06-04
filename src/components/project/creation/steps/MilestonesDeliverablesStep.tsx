
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Upload, Link, FileText, GripVertical, Calendar, Clock } from 'lucide-react';
import { ProjectData, Milestone, Deliverable, DragResult, FileUploadResult } from '@/types';
import { format, addDays } from 'date-fns';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import { LoadingState } from '@/components/common/LoadingState';
import { DragDropFeedback } from '@/components/common/DragDropFeedback';
import { MilestoneItem } from '../components/MilestoneItem';
import { useProjectCreation } from '../hooks/useProjectCreation';
import { Alert } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Milestone templates based on project category
const milestoneTemplates: Record<string, Milestone[]> = {
  'home-improvement': [
    {
      id: `milestone-${Date.now()}-1`,
      title: 'Initial Consultation',
      description: 'Discuss project requirements and scope',
      due_date: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
      deliverables: [
        {
          id: `deliverable-${Date.now()}-1`,
          title: 'Project Requirements Document',
          description: 'Detailed list of project requirements and specifications',
          deliverable_type: 'text',
          content: 'Detailed list of project requirements and specifications',
          milestone_id: `milestone-${Date.now()}-1`
        }
      ],
      is_complete: false
    },
    {
      id: `milestone-${Date.now()}-2`,
      title: 'Design Approval',
      description: 'Review and approve design plans',
      due_date: format(addDays(new Date(), 14), 'yyyy-MM-dd'),
      deliverables: [
        {
          id: `deliverable-${Date.now()}-2`,
          title: 'Design Plans',
          description: 'Design plans and specifications',
          deliverable_type: 'file',
          content: '',
          milestone_id: `milestone-${Date.now()}-2`
        }
      ],
      is_complete: false
    }
  ],
  'cleaning': [
    {
      id: `milestone-${Date.now()}-3`,
      title: 'Initial Assessment',
      description: 'Evaluate cleaning requirements and areas',
      due_date: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
      deliverables: [
        {
          id: `deliverable-${Date.now()}-3`,
          title: 'Cleaning Checklist',
          description: 'Detailed cleaning requirements and schedule',
          deliverable_type: 'text',
          content: 'Detailed cleaning requirements and schedule',
          milestone_id: `milestone-${Date.now()}-3`
        }
      ],
      is_complete: false
    }
  ]
};

interface MilestonesDeliverablesStepProps {
  data: ProjectData;
  onUpdate: (data: Partial<ProjectData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const MilestonesDeliverablesStep: React.FC<MilestonesDeliverablesStepProps> = ({ data, onUpdate, onNext, onBack }) => {
  const [editingMilestoneIndex, setEditingMilestoneIndex] = useState<number | null>(null);
  const [newMilestone, setNewMilestone] = useState<Partial<Milestone>>({
    title: '',
    description: '',
    due_date: '',
    deliverables: [],
    is_complete: false,
    status: 'not_started'
  });

  const [newDeliverable, setNewDeliverable] = useState<Partial<Deliverable>>({
    description: '',
    deliverable_type: 'text',
    content: ''
  });

  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    type: 'milestone' | 'deliverable';
    id: string;
    parentId?: string;
  } | null>(null);

  const {
    isLoading,
    error,
    validationErrors,
    addMilestone,
    updateMilestone,
    removeMilestone,
    addDeliverable,
    updateDeliverable,
    removeDeliverable,
    reorderMilestones,
    reorderDeliverables,
  } = useProjectCreation(data);

  const handleDragEnd = (result: any) => {
    setIsDragging(false);
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === 'milestones' && destination.droppableId === 'milestones') {
      reorderMilestones(source.index, destination.index);
    } else if (source.droppableId.startsWith('deliverables-') && destination.droppableId.startsWith('deliverables-')) {
      const milestoneId = source.droppableId.split('-')[1];
      reorderDeliverables(
        data.milestones.findIndex(m => m.id === milestoneId),
        source.index,
        destination.index
      );
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleAddMilestone = () => {
    const milestone: Milestone = {
      id: `milestone-${Date.now()}`,
      title: newMilestone.title || 'New Milestone',
      description: newMilestone.description || '',
      due_date: newMilestone.due_date,
      deliverables: [],
      is_complete: false,
      status: 'not_started'
    };
    
    const updatedMilestones = [...data.milestones, milestone];
    onUpdate({ milestones: updatedMilestones });
    
    // Reset form
    setNewMilestone({
      title: '',
      description: '',
      due_date: '',
      deliverables: [],
      is_complete: false,
      status: 'not_started'
    });
  };

  const handleDelete = (type: 'milestone' | 'deliverable', id: string, parentId?: string) => {
    if (type === 'milestone') {
      const updatedMilestones = data.milestones.filter(m => m.id !== id);
      onUpdate({ milestones: updatedMilestones });
    } else if (type === 'deliverable' && parentId) {
      const updatedMilestones = data.milestones.map(milestone => {
        if (milestone.id === parentId) {
          return {
            ...milestone,
            deliverables: milestone.deliverables.filter(d => d.id !== id)
          };
        }
        return milestone;
      });
      onUpdate({ milestones: updatedMilestones });
    }
  };

  const applyTemplate = () => {
    if (selectedTemplate && milestoneTemplates[selectedTemplate]) {
      onUpdate({
        milestones: [...data.milestones, ...milestoneTemplates[selectedTemplate]]
      });
      setSelectedTemplate('');
    }
  };

  const handleFileUpload = async (file: File, milestoneId: string, deliverableId: string) => {
    setIsUploading(true);
    try {
      // File upload logic here
      const newMilestones = data.milestones.map(milestone => {
        if (milestone.id === milestoneId) {
          return {
            ...milestone,
            deliverables: milestone.deliverables.map(deliverable => {
              if (deliverable.id === deliverableId) {
                return {
                  ...deliverable,
                  file_url: 'uploaded-file-url',
                  file_name: file.name,
                };
              }
              return deliverable;
            }),
          };
        }
        return milestone;
      });
      onUpdate({ milestones: newMilestones });
    } catch (error) {
      console.error('File upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleNext = () => {
    onNext();
  };

  const handleMilestoneUpdate = (milestoneId: string, updatedMilestone: Milestone) => {
    const updatedMilestones = data.milestones.map(m => 
      m.id === milestoneId ? updatedMilestone : m
    );
    onUpdate({ milestones: updatedMilestones });
  };

  const handleDeliverableAdd = (milestoneId: string, deliverable: Deliverable) => {
    const updatedMilestones = data.milestones.map(milestone => {
      if (milestone.id === milestoneId) {
        return {
          ...milestone,
          deliverables: [...milestone.deliverables, deliverable]
        };
      }
      return milestone;
    });
    onUpdate({ milestones: updatedMilestones });
  };

  const handleDeliverableUpdate = (milestoneId: string, deliverableId: string, updatedDeliverable: Deliverable) => {
    const updatedMilestones = data.milestones.map(milestone => {
      if (milestone.id === milestoneId) {
        return {
          ...milestone,
          deliverables: milestone.deliverables.map(d => 
            d.id === deliverableId ? updatedDeliverable : d
          )
        };
      }
      return milestone;
    });
    onUpdate({ milestones: updatedMilestones });
  };

  const handleDeliverableDelete = (milestoneId: string, deliverableId: string) => {
    setDeleteDialog({
      isOpen: true,
      type: 'deliverable',
      id: deliverableId,
      parentId: milestoneId,
    });
  };

  const handleDeliverableReorder = (milestoneId: string, startIndex: number, endIndex: number) => {
    const updatedMilestones = data.milestones.map(milestone => {
      if (milestone.id === milestoneId) {
        const reorderedDeliverables = [...milestone.deliverables];
        const [removed] = reorderedDeliverables.splice(startIndex, 1);
        reorderedDeliverables.splice(endIndex, 0, removed);
        
        return {
          ...milestone,
          deliverables: reorderedDeliverables
        };
      }
      return milestone;
    });
    onUpdate({ milestones: updatedMilestones });
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </Alert>
      )}

      {!validationErrors.isValid && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <div className="space-y-1">
            {validationErrors.errors.map((error, index) => (
              <p key={index} className="text-sm">
                {error.message}
              </p>
            ))}
          </div>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Project Milestones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Template Selection */}
          {data.category && milestoneTemplates[data.category] && (
            <div className="space-y-2">
              <Label>Use Template</Label>
              <div className="flex gap-2">
                <select
                  className="px-3 py-2 border rounded-md flex-1"
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                >
                  <option value="">Select a template...</option>
                  <option value={data.category}>Default {data.category} template</option>
                </select>
                <Button
                  type="button"
                  variant="outline"
                  onClick={applyTemplate}
                  disabled={!selectedTemplate}
                >
                  Apply Template
                </Button>
              </div>
            </div>
          )}

          {/* Milestone List */}
          <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
            <Droppable droppableId="milestones">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {data.milestones.map((milestone, index) => (
                    <MilestoneItem
                      key={milestone.id}
                      milestone={milestone}
                      index={index}
                      onUpdate={(updated) => handleMilestoneUpdate(milestone.id, updated)}
                      onDelete={(id) => setDeleteDialog({
                        isOpen: true,
                        type: 'milestone',
                        id,
                      })}
                      onDeliverableAdd={handleDeliverableAdd}
                      onDeliverableUpdate={handleDeliverableUpdate}
                      onDeliverableDelete={handleDeliverableDelete}
                      onDeliverableReorder={handleDeliverableReorder}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {/* Add New Milestone Form */}
          <div className="space-y-4">
            <Label>Add New Milestone</Label>
            <div className="space-y-4">
              <Input
                placeholder="Milestone title"
                value={newMilestone.title}
                onChange={(e) => setNewMilestone(prev => ({ ...prev, title: e.target.value }))}
              />
              <Textarea
                placeholder="Milestone description (optional)"
                value={newMilestone.description}
                onChange={(e) => setNewMilestone(prev => ({ ...prev, description: e.target.value }))}
              />
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={newMilestone.due_date}
                  onChange={(e) => setNewMilestone(prev => ({ ...prev, due_date: e.target.value }))}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setNewMilestone(prev => ({ 
                    ...prev, 
                    due_date: format(addDays(new Date(), 7), 'yyyy-MM-dd')
                  }))}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Set to 1 week
                </Button>
              </div>
              <Button
                type="button"
                onClick={handleAddMilestone}
                disabled={!newMilestone.title}
              >
                Add Milestone
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Next
        </button>
      </div>

      <DragDropFeedback
        isDragging={isDragging}
        message="Drop to reorder"
        type="info"
      />

      {isUploading && (
        <LoadingState
          message="Uploading file..."
          size="sm"
          fullScreen={false}
        />
      )}

      {isLoading && (
        <LoadingState
          message="Processing..."
          size="sm"
          fullScreen={false}
        />
      )}

      <ConfirmationDialog
        isOpen={!!deleteDialog}
        onClose={() => setDeleteDialog(null)}
        onConfirm={() => {
          if (deleteDialog) {
            handleDelete(deleteDialog.type, deleteDialog.id, deleteDialog.parentId);
            setDeleteDialog(null);
          }
        }}
        title={`Delete ${deleteDialog?.type === 'milestone' ? 'Milestone' : 'Deliverable'}`}
        message={`Are you sure you want to delete this ${deleteDialog?.type}? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default MilestonesDeliverablesStep;
