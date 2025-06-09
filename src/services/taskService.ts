
import { supabase } from '@/integrations/supabase/client';
import { notificationService } from './notificationService';
import { Milestone } from '@/components/project/creation/types';

// Make Task interface compatible with Json
interface Task {
  [key: string]: any;
  id: string;
  title: string;
  completed: boolean;
  deadline?: string;
  dependencies: string[];
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

interface MilestoneWithTasks {
  id: string;
  title: string;
  description: string;
  due_date: string;
  status: string;
  progress: number;
  tasks: Task[];
  project_id: string;
  created_at: string;
  updated_at: string;
}

export const taskService = {
  // Create a new task
  async createTask(
    milestoneId: string, 
    title: string, 
    deadline?: string,
    dependencies: string[] = [],
    priority: Task['priority'] = 'medium'
  ): Promise<Task> {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      deadline,
      dependencies,
      status: 'todo' as const,
      priority
    };

    // Get current milestone
    const { data: milestone, error: milestoneError } = await supabase
      .from('project_milestones')
      .select('*')
      .eq('id', milestoneId)
      .single();

    if (milestoneError) throw milestoneError;

    const milestoneWithTasks = milestone as unknown as MilestoneWithTasks;
    const tasks = milestoneWithTasks.tasks || [];

    // Update milestone with new task
    const { error: updateError } = await supabase
      .from('project_milestones')
      .update({
        tasks: [...tasks, newTask] as any,
        updated_at: new Date().toISOString()
      })
      .eq('id', milestoneId);

    if (updateError) throw updateError;
    return newTask;
  },

  // Update task status and milestone progress
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
    // Get current milestone
    const { data: milestone, error: milestoneError } = await supabase
      .from('project_milestones')
      .select('*')
      .eq('id', milestoneId)
      .single();

    if (milestoneError) throw milestoneError;

    const milestoneWithTasks = milestone as unknown as MilestoneWithTasks;
    const tasks = milestoneWithTasks.tasks || [];

    // Check dependencies before completing task
    if (completed) {
      const task = tasks.find(t => t.id === taskId);
      if (task && task.dependencies.length > 0) {
        const incompleteDependencies = task.dependencies.filter(depId => {
          const depTask = tasks.find(t => t.id === depId);
          return !depTask?.completed;
        });

        if (incompleteDependencies.length > 0) {
          throw new Error('Cannot complete task: dependencies are not completed');
        }
      }
    }

    // Update task status
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { 
        ...task, 
        completed,
        status: completed ? 'completed' : 'in_progress'
      } : task
    );

    // Calculate milestone progress
    const totalTasks = updatedTasks.length;
    const completedTasks = updatedTasks.filter(task => task.completed).length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Update milestone
    const { error: updateError } = await supabase
      .from('project_milestones')
      .update({
        tasks: updatedTasks as any,
        progress,
        status: progress === 100 ? 'completed' : 'in_progress',
        updated_at: new Date().toISOString()
      })
      .eq('id', milestoneId);

    if (updateError) throw updateError;

    // Create notification for task completion
    if (completed) {
      const task = updatedTasks.find(t => t.id === taskId);
      if (task) {
        await notificationService.createNotification({
          user_id: clientId,
          type: 'info',
          title: 'Task Completed',
          message: `Task "${task.title}" has been completed in milestone "${milestoneTitle}" for project "${projectTitle}".`,
          action_url: `/projects/${projectId}`,
          action_label: 'View Project'
        });

        await notificationService.createNotification({
          user_id: professionalId,
          type: 'info',
          title: 'Task Completed',
          message: `Task "${task.title}" has been completed in milestone "${milestoneTitle}" for project "${projectTitle}".`,
          action_url: `/projects/${projectId}`,
          action_label: 'View Project'
        });
      }
    }

    // Check if all tasks are completed
    if (progress === 100) {
      // Create milestone completion notification
      await notificationService.createMilestoneNotification(
        projectId,
        projectTitle,
        milestoneTitle,
        'completed',
        clientId,
        professionalId
      );
    }
  },

  // Add a new task to a milestone
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
    // Get current milestone
    const { data: milestone, error: milestoneError } = await supabase
      .from('project_milestones')
      .select('*')
      .eq('id', milestoneId)
      .single();

    if (milestoneError) throw milestoneError;

    const milestoneWithTasks = milestone as unknown as MilestoneWithTasks;
    const tasks = milestoneWithTasks.tasks || [];

    // Add new task
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      deadline,
      dependencies,
      status: 'todo' as const,
      priority
    };

    const updatedTasks = [...tasks, newTask];

    // Update milestone
    const { error: updateError } = await supabase
      .from('project_milestones')
      .update({
        tasks: updatedTasks as any,
        updated_at: new Date().toISOString()
      })
      .eq('id', milestoneId);

    if (updateError) throw updateError;

    // Create notification for new task
    await notificationService.createNotification({
      user_id: clientId,
      type: 'info',
      title: 'New Task Added',
      message: `A new task "${title}" has been added to milestone "${milestoneTitle}" in project "${projectTitle}".`,
      action_url: `/projects/${projectId}`,
      action_label: 'View Project'
    });

    await notificationService.createNotification({
      user_id: professionalId,
      type: 'info',
      title: 'New Task Added',
      message: `A new task "${title}" has been added to milestone "${milestoneTitle}" in project "${projectTitle}".`,
      action_url: `/projects/${projectId}`,
      action_label: 'View Project'
    });
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
    // Get current milestone
    const { data: milestone, error: milestoneError } = await supabase
      .from('project_milestones')
      .select('*')
      .eq('id', milestoneId)
      .single();

    if (milestoneError) throw milestoneError;

    const milestoneWithTasks = milestone as unknown as MilestoneWithTasks;
    const tasks = milestoneWithTasks.tasks || [];

    // Check if task is a dependency of any other task
    const isDependency = tasks.some(task => 
      task.dependencies.includes(taskId)
    );

    if (isDependency) {
      throw new Error('Cannot remove task: it is a dependency of other tasks');
    }

    // Remove task
    const updatedTasks = tasks.filter(task => task.id !== taskId);

    // Calculate new progress
    const totalTasks = updatedTasks.length;
    const completedTasks = updatedTasks.filter(task => task.completed).length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Update milestone
    const { error: updateError } = await supabase
      .from('project_milestones')
      .update({
        tasks: updatedTasks as any,
        progress,
        status: progress === 100 ? 'completed' : 'in_progress',
        updated_at: new Date().toISOString()
      })
      .eq('id', milestoneId);

    if (updateError) throw updateError;
  },

  // Update task deadline
  async updateTaskDeadline(
    milestoneId: string,
    taskId: string,
    deadline: string
  ): Promise<void> {
    const { data: milestone, error: milestoneError } = await supabase
      .from('project_milestones')
      .select('*')
      .eq('id', milestoneId)
      .single();

    if (milestoneError) throw milestoneError;

    const milestoneWithTasks = milestone as unknown as MilestoneWithTasks;
    const tasks = milestoneWithTasks.tasks || [];

    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, deadline } : task
    );

    const { error: updateError } = await supabase
      .from('project_milestones')
      .update({
        tasks: updatedTasks as any,
        updated_at: new Date().toISOString()
      })
      .eq('id', milestoneId);

    if (updateError) throw updateError;
  },

  // Add task dependency
  async addTaskDependency(
    milestoneId: string,
    taskId: string,
    dependencyId: string
  ): Promise<void> {
    const { data: milestone, error: milestoneError } = await supabase
      .from('project_milestones')
      .select('*')
      .eq('id', milestoneId)
      .single();

    if (milestoneError) throw milestoneError;

    const milestoneWithTasks = milestone as unknown as MilestoneWithTasks;
    const tasks = milestoneWithTasks.tasks || [];

    // Check for circular dependencies
    const hasCircularDependency = (taskId: string, dependencyId: string, visited = new Set<string>()): boolean => {
      if (taskId === dependencyId) return true;
      if (visited.has(taskId)) return false;
      
      visited.add(taskId);
      const task = tasks.find(t => t.id === taskId);
      if (!task) return false;

      return task.dependencies.some(depId => 
        hasCircularDependency(depId, dependencyId, visited)
      );
    };

    if (hasCircularDependency(dependencyId, taskId)) {
      throw new Error('Cannot add dependency: would create a circular dependency');
    }

    const updatedTasks = tasks.map(task =>
      task.id === taskId 
        ? { 
            ...task, 
            dependencies: [...new Set([...task.dependencies, dependencyId])]
          } 
        : task
    );

    const { error: updateError } = await supabase
      .from('project_milestones')
      .update({
        tasks: updatedTasks as any,
        updated_at: new Date().toISOString()
      })
      .eq('id', milestoneId);

    if (updateError) throw updateError;
  },

  // Remove task dependency
  async removeTaskDependency(
    milestoneId: string,
    taskId: string,
    dependencyId: string
  ): Promise<void> {
    const { data: milestone, error: milestoneError } = await supabase
      .from('project_milestones')
      .select('*')
      .eq('id', milestoneId)
      .single();

    if (milestoneError) throw milestoneError;

    const milestoneWithTasks = milestone as unknown as MilestoneWithTasks;
    const tasks = milestoneWithTasks.tasks || [];

    const updatedTasks = tasks.map(task =>
      task.id === taskId 
        ? { 
            ...task, 
            dependencies: task.dependencies.filter(id => id !== dependencyId)
          } 
        : task
    );

    const { error: updateError } = await supabase
      .from('project_milestones')
      .update({
        tasks: updatedTasks as any,
        updated_at: new Date().toISOString()
      })
      .eq('id', milestoneId);

    if (updateError) throw updateError;
  },

  // Get all tasks for a milestone
  async getMilestoneTasks(milestoneId: string): Promise<Task[]> {
    const { data: milestone, error } = await supabase
      .from('project_milestones')
      .select('tasks')
      .eq('id', milestoneId)
      .single();

    if (error) throw error;
    return (milestone?.tasks as unknown as Task[]) || [];
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
