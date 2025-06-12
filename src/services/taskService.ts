import { supabase } from '@/integrations/supabase/client';
import { notificationService } from './notificationService';
import { Task, TaskInsert, TaskStatus } from '@/types/database';

export const taskService = {
  // Create a new task
  async createTask(taskData: TaskInsert): Promise<Task> {
    const { data, error } = await supabase
      .from('project_tasks')
      .insert(taskData)
      .select()
      .single();

    if (error) throw error;

    // Create notification for assignee if assigned
    if (data.assignee_id) {
      await notificationService.createNotification({
        user_id: data.assignee_id,
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
      .from('project_tasks')
      .select()
      .eq('id', taskId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as Task;
  },

  // Get tasks for a project
  async getProjectTasks(projectId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('project_tasks')
      .select()
      .eq('project_id', projectId);

    if (error) throw error;
    return (data || []) as Task[];
  },

  // Get tasks assigned to a user
  async getUserTasks(userId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('project_tasks')
      .select()
      .eq('assignee_id', userId);

    if (error) throw error;
    return (data || []) as Task[];
  },

  // Update task status
  async updateTaskStatus(taskId: string, status: TaskStatus): Promise<Task> {
    const { data, error } = await supabase
      .from('project_tasks')
      .update({ status })
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;

    // Create status change notification
    if (data.assignee_id) {
      await notificationService.createNotification({
        user_id: data.assignee_id,
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
      .from('project_tasks')
      .update({ assignee_id: userId })
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
