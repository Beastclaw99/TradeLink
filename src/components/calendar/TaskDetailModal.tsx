
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, MapPin, Edit, Trash2 } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'project' | 'task' | 'meeting' | 'deadline';
  date: string;
  time?: string;
  duration?: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  professional?: string;
  projectId?: string;
  description?: string;
  location?: string;
}

interface TaskDetailModalProps {
  event: CalendarEvent;
  isOpen: boolean;
  onClose: () => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ 
  event, 
  isOpen, 
  onClose 
}) => {
  const typeConfig = {
    project: { color: 'bg-blue-100 text-blue-800', text: 'Project' },
    task: { color: 'bg-green-100 text-green-800', text: 'Task' },
    meeting: { color: 'bg-purple-100 text-purple-800', text: 'Meeting' },
    deadline: { color: 'bg-red-100 text-red-800', text: 'Deadline' }
  };

  const statusConfig = {
    scheduled: { color: 'bg-blue-100 text-blue-800', text: 'Scheduled' },
    'in-progress': { color: 'bg-yellow-100 text-yellow-800', text: 'In Progress' },
    completed: { color: 'bg-green-100 text-green-800', text: 'Completed' },
    cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelled' }
  };

  const priorityConfig = {
    low: { color: 'bg-gray-100 text-gray-800', text: 'Low Priority' },
    medium: { color: 'bg-yellow-100 text-yellow-800', text: 'Medium Priority' },
    high: { color: 'bg-red-100 text-red-800', text: 'High Priority' }
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'No duration set';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    return `${mins}m`;
  };

  const handleStatusUpdate = (newStatus: string) => {
    // TODO: Integrate with backend API to update status
    console.log('Updating status to:', newStatus);
    alert(`Status updated to ${newStatus} (Placeholder)`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {event.title}
            <Badge className={typeConfig[event.type].color}>
              {typeConfig[event.type].text}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{new Date(event.date).toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>

              {event.time && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>
                    {event.time}
                    {event.duration && ` (${formatDuration(event.duration)})`}
                  </span>
                </div>
              )}

              {event.professional && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>{event.professional}</span>
                </div>
              )}

              {event.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-600">Status:</span>
                <Badge className={`ml-2 ${statusConfig[event.status].color}`}>
                  {statusConfig[event.status].text}
                </Badge>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-600">Priority:</span>
                <Badge className={`ml-2 ${priorityConfig[event.priority].color}`}>
                  {priorityConfig[event.priority].text}
                </Badge>
              </div>

              {event.projectId && (
                <div>
                  <span className="text-sm font-medium text-gray-600">Project ID:</span>
                  <span className="ml-2 text-sm font-mono">{event.projectId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-gray-600">{event.description}</p>
            </div>
          )}

          {/* Status Update Actions */}
          {event.status !== 'completed' && event.status !== 'cancelled' && (
            <div>
              <h4 className="font-medium mb-3">Update Status</h4>
              <div className="flex gap-2">
                {event.status === 'scheduled' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleStatusUpdate('in-progress')}
                  >
                    Start Work
                  </Button>
                )}
                {event.status === 'in-progress' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleStatusUpdate('completed')}
                  >
                    Mark Complete
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleStatusUpdate('cancelled')}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
            
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailModal;
