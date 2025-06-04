import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Upload, Link, FileText, GripVertical, Calendar, Clock } from 'lucide-react';
import { ProjectData, Milestone, Deliverable, DragResult, FileUploadResult } from '../types';
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
      title: 'Initial Consultation',
      description: 'Discuss project requirements and scope',
      due_date: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
      deliverables: [
        {
          description: 'Project Requirements Document',
          deliverable_type: 'note',
          content: 'Detailed list of project requirements and specifications'
        }
      ],
      is_complete: false
    },
    {
      title: 'Design Approval',
      description: 'Review and approve design plans',
      due_date: format(addDays(new Date(), 14), 'yyyy-MM-dd'),
      deliverables: [
        {
          description: 'Design Plans',
          deliverable_type: 'file',
          content: ''
        }
      ],
      is_complete: false
    }
  ],
  'cleaning': [
    {
      title: 'Initial Assessment',
      description: 'Evaluate cleaning requirements and areas',
      due_date: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
      deliverables: [
        {
          description: 'Cleaning Checklist',
          deliverable_type: 'note',
          content: 'Detailed cleaning requirements and schedule'
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
    deliverable_type: 'note',
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
  } = useProjectCreation({ milestones: data.milestones });

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
    const newMilestone: Milestone = {
      id: `milestone-${Date.now()}`,
      title: 'New Milestone',
      description: '',
      deliverables: [],
    };
    addMilestone(newMilestone);
  };

  const handleDelete = (type: 'milestone' | 'deliverable', id: string, parentId?: string) => {
    if (type === 'milestone') {
      const index = data.milestones.findIndex(m => m.id === id);
      if (index !== -1) {
        removeMilestone(index);
      }
    } else if (type === 'deliverable' && parentId) {
      const milestoneIndex = data.milestones.findIndex(m => m.id === parentId);
      if (milestoneIndex !== -1) {
        const deliverableIndex = data.milestones[milestoneIndex].deliverables.findIndex(d => d.id === id);
        if (deliverableIndex !== -1) {
          removeDeliverable(milestoneIndex, deliverableIndex);
        }
      }
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
                  fileUrl: 'uploaded-file-url',
                  fileName: file.name,
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
    if (validationErrors.isValid) {
      onNext();
    }
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
                      onDelete={(id) => setDeleteDialog({
                        isOpen: true,
                        type: 'milestone',
                        id,
                      })}
                      onDeliverableAdd={addDeliverable}
                      onDeliverableUpdate={updateDeliverable}
                      onDeliverableDelete={(milestoneId, deliverableId) => setDeleteDialog({
                        isOpen: true,
                        type: 'deliverable',
                        id: deliverableId,
                        parentId: milestoneId,
                      })}
                      onDeliverableReorder={reorderDeliverables}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {/* Add/Edit Milestone Form */}
          <div className="space-y-4">
            <Label>{editingMilestoneIndex !== null ? 'Edit Milestone' : 'Add New Milestone'}</Label>
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
                onClick={() => {
                  if (editingMilestoneIndex !== null) {
                    updateMilestone(newMilestone);
                  } else {
                    addMilestone(newMilestone);
                  }
                }}
              >
                {editingMilestoneIndex !== null ? 'Update Milestone' : 'Add Milestone'}
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
          disabled={!validationErrors.isValid}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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