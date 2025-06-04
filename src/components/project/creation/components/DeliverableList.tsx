
import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Deliverable } from '../types';
import { DeliverableItem } from './DeliverableItem';

interface DeliverableListProps {
  milestoneId: string;
  deliverables: Deliverable[];
  onAdd: (deliverable: Deliverable) => void;
  onUpdate: (deliverableId: string, deliverable: Deliverable) => void;
  onDelete: (deliverableId: string) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
}

export const DeliverableList: React.FC<DeliverableListProps> = ({
  milestoneId,
  deliverables,
  onAdd,
  onUpdate,
  onDelete,
  onReorder
}) => {
  // Component implementation here
  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2">Deliverables</h4>
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
                      onUpdate={(updated) => onUpdate(deliverable.id, updated)}
                      onDelete={() => onDelete(deliverable.id)}
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
