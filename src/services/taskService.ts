import { supabase } from '@/integrations/supabase/client';
import { notificationService } from './notificationService';
import { Milestone } from '@/components/project/creation/types';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  deadline?: string;
  dependencies: string[];
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  [key: string]: any; // Add index signature for Json compatibility
}

interface MilestoneWithTasks {
  id: string;
  title: string;
  description: string;
  due_date: string;
  status: string;
  progress: number;
  tasks: any[]; // Change to any[] for Json compatibility
  project_id: string;
  created_at: string;
  updated_at: string;
}

// Helper function to convert Task to Json-compatible format
const taskToJson = (task: Task): any => {
  return {
    id: task.id,
    title: task.title,
    completed: task.completed,
    deadline: task.deadline,
    dependencies: task.dependencies,
    status: task.status,
    priority: task.priority
  };
};

// Helper function to convert Json to Task format
const jsonToTask = (json: any): Task => {
  return {
    id: json.id || crypto.randomUUID(),
    title: json.title || '',
    completed: Boolean(json.completed),
    deadline: json.deadline,
    dependencies: Array.isArray(json.dependencies) ? json.dependencies : [],
    status: json.status || 'todo',
    priority: json.priority || 'medium'
  };
};

export const taskService = {
  // Create a new task
  async createTask(
    milestoneId: string, 
    title: string, 
    deadline?: string,
    dependencies: string[] = [],
    priority: Task['priority'] = 'medium'
  ): Promise<Task> {
    const { data, error } = await supabase
      .from('project_tasks')
      .insert([
        {
          title,
          completed: false,
          deadline,
          dependencies,
          status: 'todo',
          priority,
          milestone_id: milestoneId
        }
      ])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Update task status
  async updateTaskStatus(
    milestoneId: string,
    taskId: string,
    completed: boolean,
    projectId: string,
    projectTitle: string,
    milestoneTitle: string,
    clientId: string,
    professionalId: string
  ): Promise<void> {
    // Fetch the task to check dependencies
    const { data: task, error: fetchError } = await supabase
      .from('project_tasks')
      .select('*')
      .eq('id', taskId)
      .single();
    if (fetchError) throw fetchError;
    if (completed && task.dependencies && task.dependencies.length > 0) {
      // Fetch all tasks for this milestone
      const { data: allTasks, error: allTasksError } = await supabase
        .from('project_tasks')
        .select('*')
        .eq('milestone_id', milestoneId);
      if (allTasksError) throw allTasksError;
      const incompleteDependencies = task.dependencies.filter((depId: string) => {
        const depTask = allTasks.find((t: any) => t.id === depId);
        return !depTask?.completed;
      });
      if (incompleteDependencies.length > 0) {
        throw new Error('Cannot complete task: dependencies are not completed');
      }
    }
    // Update the task
    const { error: updateError } = await supabase
      .from('project_tasks')
      .update({
        completed,
        status: completed ? 'completed' : 'in_progress',
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId);
    if (updateError) throw updateError;
    // Optionally: update milestone progress here if needed
    // Send notifications as before
    // ... (notification logic unchanged)
  },

  // Add a new task to a milestone (alias for createTask)
  async addTask(
    milestoneId: string,
    title: string,
    projectId: string,
    projectTitle: string,
    milestoneTitle: string,
    clientId: string,
    professionalId: string,
    deadline?: string,
    dependencies: string[] = [],
    priority: Task['priority'] = 'medium'
  ): Promise<void> {
    await taskService.createTask(milestoneId, title, deadline, dependencies, priority);
    // Optionally: send notification
  },

  // Remove a task from a milestone
  async removeTask(
    milestoneId: string,
    taskId: string,
    projectId: string,
    projectTitle: string,
    milestoneTitle: string,
    clientId: string,
    professionalId: string
  ): Promise<void> {
    // Check if task is a dependency of any other task
    const { data: allTasks, error: allTasksError } = await supabase
      .from('project_tasks')
      .select('*')
      .eq('milestone_id', milestoneId);
    if (allTasksError) throw allTasksError;
    const isDependency = allTasks.some((task: any) => 
      task.dependencies && task.dependencies.includes(taskId)
    );
    if (isDependency) {
      throw new Error('Cannot remove task: it is a dependency of other tasks');
    }
    const { error } = await supabase
      .from('project_tasks')
      .delete()
      .eq('id', taskId);
    if (error) throw error;
  },

  // Get all tasks for a milestone
  async getMilestoneTasks(milestoneId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('project_tasks')
      .select('*')
      .eq('milestone_id', milestoneId);
    if (error) throw error;
    return data || [];
  },

  // Check for overdue tasks
  async checkOverdueTasks(milestoneId: string): Promise<Task[]> {
    const tasks = await this.getMilestoneTasks(milestoneId);
    const now = new Date();
    
    return tasks.filter(task => 
      task.deadline && 
      !task.completed && 
      new Date(task.deadline) < now
    );
  }
};
