
import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Milestone, Deliverable } from '../types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash2, Calendar, GripVertical } from 'lucide-react';
import { DeliverableList } from './DeliverableList';

interface MilestoneItemProps {
  milestone: Milestone;
  index: number;
  onUpdate: (updatedMilestone: Milestone) => void;
  onDelete: (id: string) => void;
  onDeliverableAdd: (milestoneId: string, deliverable: Deliverable) => void;
  onDeliverableUpdate: (milestoneId: string, deliverableId: string, updatedDeliverable: Deliverable) => void;
  onDeliverableDelete: (milestoneId: string, deliverableId: string) => void;
  onDeliverableReorder: (milestoneId: string, startIndex: number, endIndex: number) => void;
}

export const MilestoneItem: React.FC<MilestoneItemProps> = ({
  milestone,
  index,
  onUpdate,
  onDelete,
  onDeliverableAdd,
  onDeliverableUpdate,
  onDeliverableDelete,
  onDeliverableReorder
}) => {
  const handleUpdate = (field: keyof Milestone, value: any) => {
    onUpdate({
      ...milestone,
      [field]: value
    });
  };

  const handleAddDeliverable = () => {
    const newDeliverable: Deliverable = {
      id: `deliverable-${Date.now()}`,
      title: 'New Deliverable',
      description: '',
      deliverable_type: 'text',
      content: '',
      milestone_id: milestone.id
    };
    onDeliverableAdd(milestone.id, newDeliverable);
  };

  return (
    <Draggable draggableId={milestone.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="border rounded-lg p-4 bg-white space-y-4"
        >
          <div className="flex items-center justify-between">
            <div {...provided.dragHandleProps} className="cursor-move">
              <GripVertical className="h-5 w-5 text-gray-400" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(milestone.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <Input
              placeholder="Milestone title"
              value={milestone.title}
              onChange={(e) => handleUpdate('title', e.target.value)}
            />
            
            <Textarea
              placeholder="Milestone description (optional)"
              value={milestone.description || ''}
              onChange={(e) => handleUpdate('description', e.target.value)}
              rows={2}
            />
            
            <div className="flex gap-2 items-center">
              <Calendar className="h-4 w-4 text-gray-500" />
              <Input
                type="date"
                value={milestone.due_date || ''}
                onChange={(e) => handleUpdate('due_date', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <DeliverableList
            milestoneId={milestone.id}
            deliverables={milestone.deliverables}
            onAdd={handleAddDeliverable}
            onUpdate={onDeliverableUpdate}
            onDelete={onDeliverableDelete}
            onReorder={onDeliverableReorder}
          />
        </div>
      )}
    </Draggable>
  );
};
