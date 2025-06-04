import React, { memo, useCallback } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Milestone, Deliverable } from '../types';
import { DeliverableList } from './DeliverableList';
import { TrashIcon } from '@heroicons/react/24/outline';

interface MilestoneItemProps {
  milestone: Milestone;
  index: number;
  onDelete: (id: string) => void;
  onDeliverableAdd: (milestoneId: string, deliverable: Deliverable) => void;
  onDeliverableUpdate: (milestoneId: string, deliverableId: string, deliverable: Deliverable) => void;
  onDeliverableDelete: (milestoneId: string, deliverableId: string) => void;
  onDeliverableReorder: (milestoneId: string, startIndex: number, endIndex: number) => void;
}

export const MilestoneItem: React.FC<MilestoneItemProps> = memo(({
  milestone,
  index,
  onDelete,
  onDeliverableAdd,
  onDeliverableUpdate,
  onDeliverableDelete,
  onDeliverableReorder,
}) => {
  const handleDelete = useCallback(() => {
    onDelete(milestone.id);
  }, [milestone.id, onDelete]);

  const handleDeliverableAdd = useCallback((deliverable: Deliverable) => {
    onDeliverableAdd(milestone.id, deliverable);
  }, [milestone.id, onDeliverableAdd]);

  const handleDeliverableUpdate = useCallback((deliverableId: string, deliverable: Deliverable) => {
    onDeliverableUpdate(milestone.id, deliverableId, deliverable);
  }, [milestone.id, onDeliverableUpdate]);

  const handleDeliverableDelete = useCallback((deliverableId: string) => {
    onDeliverableDelete(milestone.id, deliverableId);
  }, [milestone.id, onDeliverableDelete]);

  const handleDeliverableReorder = useCallback((startIndex: number, endIndex: number) => {
    onDeliverableReorder(milestone.id, startIndex, endIndex);
  }, [milestone.id, onDeliverableReorder]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleDelete();
    }
  }, [handleDelete]);

  return (
    <Draggable draggableId={milestone.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          role="article"
          aria-label={`Milestone ${index + 1}: ${milestone.title}`}
        >
          <div
            {...provided.dragHandleProps}
            className="mb-4 flex items-center justify-between"
            role="group"
            aria-label="Milestone header"
          >
            <div>
              <h3 className="text-lg font-medium" id={`milestone-title-${milestone.id}`}>
                {milestone.title}
              </h3>
              {milestone.description && (
                <p className="mt-1 text-sm text-gray-500" id={`milestone-description-${milestone.id}`}>
                  {milestone.description}
                </p>
              )}
              {milestone.due_date && (
                <p 
                  className="mt-1 text-sm text-gray-500"
                  id={`milestone-due-date-${milestone.id}`}
                  aria-label={`Due date: ${new Date(milestone.due_date).toLocaleDateString()}`}
                >
                  Due: {new Date(milestone.due_date).toLocaleDateString()}
                </p>
              )}
            </div>
            <button
              onClick={handleDelete}
              onKeyPress={handleKeyPress}
              className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-full p-1"
              aria-label={`Delete milestone: ${milestone.title}`}
              tabIndex={0}
            >
              <TrashIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <DeliverableList
            milestoneId={milestone.id}
            deliverables={milestone.deliverables}
            onAdd={handleDeliverableAdd}
            onUpdate={handleDeliverableUpdate}
            onDelete={handleDeliverableDelete}
            onReorder={handleDeliverableReorder}
          />
        </div>
      )}
    </Draggable>
  );
});

MilestoneItem.displayName = 'MilestoneItem';
