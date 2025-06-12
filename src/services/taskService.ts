import { supabase } from '@/integrations/supabase/client';
import { notificationService } from './notificationService';
import { TaskStatus } from '@/types/database';

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assigned_to?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export const taskService = {
  // Create a new task
  async createTask(taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert(taskData)
      .select()
      .single();

    if (error) throw error;

    // Create notification for assignee if assigned
    if (data.assigned_to) {
      await notificationService.createNotification({
        user_id: data.assigned_to,
        title: 'New Task Assigned',
        message: `You have been assigned a new task: ${data.title}`,
        type: 'info'
      });
    }

    return data as Task;
  },

  // Get task by ID
  async getTask(taskId: string): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .select()
      .eq('id', taskId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as Task;
  },

  // Get tasks for a project
  async getProjectTasks(projectId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select()
      .eq('project_id', projectId);

    if (error) throw error;
    return (data || []) as Task[];
  },

  // Get tasks assigned to a user
  async getUserTasks(userId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select()
      .eq('assigned_to', userId);

    if (error) throw error;
    return (data || []) as Task[];
  },

  // Update task status
  async updateTaskStatus(taskId: string, status: TaskStatus): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update({ status })
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;

    // Create status change notification
    if (data.assigned_to) {
      await notificationService.createNotification({
        user_id: data.assigned_to,
        title: 'Task Status Updated',
        message: `The status of task "${data.title}" has been updated to ${status}`,
        type: 'info'
      });
    }

    return data as Task;
  },

  // Assign task to user
  async assignTask(taskId: string, userId: string): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update({ assigned_to: userId })
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;

    // Create assignment notification
    await notificationService.createNotification({
      user_id: userId,
      title: 'Task Assigned',
      message: `You have been assigned to task: ${data.title}`,
      type: 'info'
    });

    return data as Task;
  }
};
