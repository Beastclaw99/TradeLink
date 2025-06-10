import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import {
  Plus,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  Circle,
  AlertTriangle
} from 'lucide-react';

interface ProjectTasksProps {
  projectId: string;
  tasks: any[];
  onCreateTask: (task: any) => Promise<void>;
  onUpdateTask: (taskId: string, updates: any) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  canEdit: boolean;
}

const ProjectTasks: React.FC<ProjectTasksProps> = ({
  projectId,
  tasks,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  canEdit
}) => {
  const { toast } = useToast();
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy] = useState('due_date');
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Project Tasks</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
          
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No tasks found.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={(checked) => onUpdateTask(task.id, { completed: checked })}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-gray-500">{task.description}</p>
                  </div>
                  <Badge variant="outline">{task.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectTasks;
