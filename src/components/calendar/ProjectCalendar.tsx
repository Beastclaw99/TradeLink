
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import TaskDetailModal from './TaskDetailModal';

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
}

const ProjectCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

  // Mock calendar events
  const events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Kitchen Plumbing Installation',
      type: 'project',
      date: '2024-01-20',
      time: '09:00',
      duration: 480,
      status: 'scheduled',
      priority: 'high',
      professional: 'John Smith',
      projectId: 'proj-001'
    },
    {
      id: '2',
      title: 'Site Inspection',
      type: 'task',
      date: '2024-01-20',
      time: '14:00',
      duration: 60,
      status: 'completed',
      priority: 'medium',
      professional: 'John Smith'
    },
    {
      id: '3',
      title: 'Client Meeting - Bathroom Renovation',
      type: 'meeting',
      date: '2024-01-22',
      time: '10:30',
      duration: 90,
      status: 'scheduled',
      priority: 'medium'
    },
    {
      id: '4',
      title: 'Project Deadline - Electrical Work',
      type: 'deadline',
      date: '2024-01-25',
      status: 'scheduled',
      priority: 'high',
      professional: 'Maria Rodriguez'
    }
  ];

  const typeConfig = {
    project: { color: 'bg-blue-500', text: 'Project' },
    task: { color: 'bg-green-500', text: 'Task' },
    meeting: { color: 'bg-purple-500', text: 'Meeting' },
    deadline: { color: 'bg-red-500', text: 'Deadline' }
  };

  const statusConfig = {
    scheduled: { color: 'bg-blue-100 text-blue-800', text: 'Scheduled' },
    'in-progress': { color: 'bg-yellow-100 text-yellow-800', text: 'In Progress' },
    completed: { color: 'bg-green-100 text-green-800', text: 'Completed' },
    cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelled' }
  };

  const priorityConfig = {
    low: { color: 'bg-gray-100 text-gray-800', text: 'Low' },
    medium: { color: 'bg-yellow-100 text-yellow-800', text: 'Medium' },
    high: { color: 'bg-red-100 text-red-800', text: 'High' }
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  const openTaskDetail = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowTaskModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-6 w-6" />
              Project Calendar
            </CardTitle>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={previousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Today</Button>
              <Button variant="outline" size="sm">Week</Button>
              <Button variant="outline" size="sm">Month</Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0">
          {/* Days of week header */}
          <div className="grid grid-cols-7 border-b">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-3 text-center font-medium text-gray-600 border-r last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: firstDay }, (_, i) => (
              <div key={`empty-${i}`} className="h-32 border-r border-b last:border-r-0"></div>
            ))}
            
            {/* Days of the month */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dayEvents = getEventsForDate(day);
              const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
              
              return (
                <div key={day} className={`h-32 border-r border-b last:border-r-0 p-2 ${isToday ? 'bg-blue-50' : ''}`}>
                  <div className={`text-sm font-medium mb-2 ${isToday ? 'text-blue-600' : ''}`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className="text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: typeConfig[event.type].color + '20', color: typeConfig[event.type].color }}
                        onClick={() => openTaskDetail(event)}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        {event.time && (
                          <div className="text-xs opacity-75">{event.time}</div>
                        )}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500 font-medium">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Today's Events */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events
              .filter(event => event.date === new Date().toISOString().split('T')[0])
              .map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => openTaskDetail(event)}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className={`w-3 h-3 rounded-full ${typeConfig[event.type].color}`}
                    ></div>
                    <div>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-gray-600">
                        {event.time && `${event.time} • `}
                        {event.professional && `${event.professional} • `}
                        {typeConfig[event.type].text}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={priorityConfig[event.priority].color}>
                      {priorityConfig[event.priority].text}
                    </Badge>
                    <Badge className={statusConfig[event.status].color}>
                      {statusConfig[event.status].text}
                    </Badge>
                  </div>
                </div>
              ))
            }
          </div>
        </CardContent>
      </Card>

      {/* Task Detail Modal */}
      {showTaskModal && selectedEvent && (
        <TaskDetailModal
          event={selectedEvent}
          isOpen={showTaskModal}
          onClose={() => {
            setShowTaskModal(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
};

export default ProjectCalendar;
