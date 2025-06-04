import React, { memo, useCallback } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Deliverable } from '../../../../types';
import { DeliverableItem } from './DeliverableItem';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useDeliverables } from '../../../../contexts/DeliverableContext';

/**
 * Props for the DeliverableList component
 * @interface DeliverableListProps
 */
interface DeliverableListProps {
  /** The ID of the milestone this list belongs to */
  milestoneId: string;
  /** Array of deliverables to display */
  deliverables: Deliverable[];
}

/**
 * A component that displays a list of deliverables with drag and drop functionality.
 * Supports adding, updating, deleting, and reordering deliverables.
 * 
 * @component
 * @example
 * ```tsx
 * <DeliverableList
 *   milestoneId="milestone-1"
 *   deliverables={deliverablesData}
 * />
 * ```
 */
export const DeliverableList: React.FC<DeliverableListProps> = memo(({
  milestoneId,
  deliverables,
}) => {
  const {
    addDeliverable,
    updateDeliverable,
    deleteDeliverable,
    reorderDeliverables,
    state: { loading, error },
  } = useDeliverables();

  /**
   * Creates and adds a new deliverable
   */
  const handleAddDeliverable = useCallback(() => {
    const newDeliverable: Deliverable = {
      id: `deliverable-${Date.now()}`,
      title: 'New Deliverable',
      description: '',
      deliverable_type: 'text',
      content: '',
      milestone_id: milestoneId,
    };
    addDeliverable(milestoneId, newDeliverable);
  }, [milestoneId, addDeliverable]);

  /**
   * Handles updating a deliverable
   * @param {string} deliverableId - The ID of the deliverable to update
   * @param {Deliverable} deliverable - The updated deliverable data
   */
  const handleUpdate = useCallback((deliverableId: string, deliverable: Deliverable) => {
    updateDeliverable(milestoneId, deliverableId, deliverable);
  }, [milestoneId, updateDeliverable]);

  /**
   * Handles deleting a deliverable
   * @param {string} deliverableId - The ID of the deliverable to delete
   */
  const handleDelete = useCallback((deliverableId: string) => {
    deleteDeliverable(milestoneId, deliverableId);
  }, [milestoneId, deleteDeliverable]);

  /**
   * Handles reordering deliverables
   * @param {number} startIndex - The index of the deliverable being moved
   * @param {number} endIndex - The index where the deliverable is being moved to
   */
  const handleDeliverableReorder = useCallback((startIndex: number, endIndex: number) => {
    reorderDeliverables(milestoneId, startIndex, endIndex);
  }, [milestoneId, reorderDeliverables]);

  /**
   * Handles keyboard events for the add button
   * @param {React.KeyboardEvent} e - The keyboard event
   */
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleAddDeliverable();
    }
  }, [handleAddDeliverable]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="space-y-2"
      role="region"
      aria-label="Deliverables list"
    >
      <Droppable droppableId={`deliverables-${milestoneId}`}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2"
            role="list"
            aria-label="Deliverables"
          >
            {deliverables.map((deliverable, index) => (
              <Draggable
                key={deliverable.id}
                draggableId={deliverable.id}
                index={index}
              >
                {(provided) => (
                  <DeliverableItem
                    provided={provided}
                    deliverable={deliverable}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <button
        onClick={handleAddDeliverable}
        onKeyPress={handleKeyPress}
        className="mt-2 flex w-full items-center justify-center rounded-md border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Add new deliverable"
        tabIndex={0}
      >
        <PlusIcon className="mr-2 h-4 w-4" aria-hidden="true" />
        Add Deliverable
      </button>
    </div>
  );
});

DeliverableList.displayName = 'DeliverableList'; 