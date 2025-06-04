import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import { DraggableProvided } from '@hello-pangea/dnd';
import { Deliverable } from '../../../../types';
import { useDeliverables } from '../../../../contexts/DeliverableContext';

/**
 * Props for the DeliverableItem component
 * @interface DeliverableItemProps
 */
interface DeliverableItemProps {
  /** The draggable provided object from react-beautiful-dnd */
  provided: DraggableProvided;
  /** The deliverable data to display */
  deliverable: Deliverable;
}

/**
 * A component that displays and allows editing of a single deliverable item.
 * Supports drag and drop functionality and inline editing.
 * 
 * @component
 * @example
 * ```tsx
 * <DeliverableItem
 *   provided={draggableProvided}
 *   deliverable={deliverableData}
 * />
 * ```
 */
export const DeliverableItem: React.FC<DeliverableItemProps> = memo(({
  provided,
  deliverable,
}) => {
  const { updateDeliverable, deleteDeliverable } = useDeliverables();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(deliverable.title);
  const [description, setDescription] = useState(deliverable.description);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditing]);

  /**
   * Handles saving the deliverable changes
   */
  const handleSave = useCallback(() => {
    updateDeliverable(deliverable.milestone_id, deliverable.id, {
      ...deliverable,
      title,
      description,
    });
    setIsEditing(false);
  }, [deliverable, title, description, updateDeliverable]);

  /**
   * Handles keyboard events for saving
   * @param {React.KeyboardEvent} e - The keyboard event
   */
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setTitle(deliverable.title);
      setDescription(deliverable.description);
    }
  }, [deliverable, handleSave]);

  /**
   * Handles deleting the deliverable
   */
  const handleDelete = useCallback(() => {
    deleteDeliverable(deliverable.milestone_id, deliverable.id);
  }, [deliverable, deleteDeliverable]);

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="group relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:border-gray-300"
    >
      {isEditing ? (
        <div className="space-y-2">
          <input
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyPress}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter title"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyPress}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter description"
            rows={3}
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="rounded-md px-3 py-1 text-sm text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="rounded-md bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-900">{deliverable.title}</h3>
          {deliverable.description && (
            <p className="text-sm text-gray-500">{deliverable.description}</p>
          )}
          <div className="absolute right-2 top-2 hidden group-hover:block">
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              aria-label="Edit deliverable"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className="ml-1 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500"
              aria-label="Delete deliverable"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

DeliverableItem.displayName = 'DeliverableItem'; 