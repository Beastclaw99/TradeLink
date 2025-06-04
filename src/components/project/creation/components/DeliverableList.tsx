
import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Deliverable } from '@/types';
import { DeliverableItem } from './DeliverableItem';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface DeliverableListProps {
  milestoneId: string;
  deliverables: Deliverable[];
  onAdd: () => void;
  onUpdate: (milestoneId: string, deliverableId: string, deliverable: Deliverable) => void;
  onDelete: (milestoneId: string, deliverableId: string) => void;
  onReorder: (milestoneId: string, startIndex: number, endIndex: number) => void;
}

export const DeliverableList: React.FC<DeliverableListProps> = ({
  milestoneId,
  deliverables,
  onAdd,
  onUpdate,
  onDelete,
  onReorder
}) => {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-700">Deliverables</h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAdd}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Deliverable
        </Button>
      </div>
      
      <Droppable droppableId={`deliverables-${milestoneId}`}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {deliverables.map((deliverable, index) => (
              <Draggable key={deliverable.id} draggableId={deliverable.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="p-2 border rounded mb-2 bg-white"
                  >
                    <DeliverableItem
                      deliverable={deliverable}
                      onUpdate={(updatedDeliverable) => onUpdate(milestoneId, deliverable.id, updatedDeliverable)}
                      onDelete={() => onDelete(milestoneId, deliverable.id)}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
