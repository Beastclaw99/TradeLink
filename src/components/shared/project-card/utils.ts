import { format } from 'date-fns';
import { Project } from '@/components/dashboard/types';
import { formatDateToLocale } from '@/utils/dateUtils';

export const statusColors = {
  open: { bg: 'bg-blue-100', text: 'text-blue-800' },
  assigned: { bg: 'bg-green-100', text: 'text-green-800' },
  in_progress: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  work_submitted: { bg: 'bg-purple-100', text: 'text-purple-800' },
  work_revision_requested: { bg: 'bg-orange-100', text: 'text-orange-800' },
  work_approved: { bg: 'bg-green-100', text: 'text-green-800' },
  completed: { bg: 'bg-green-100', text: 'text-green-800' },
  archived: { bg: 'bg-gray-100', text: 'text-gray-800' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-800' },
  disputed: { bg: 'bg-red-100', text: 'text-red-800' },
};

export const formatDate = (date: string | null) => {
  return formatDateToLocale(date);
};

export const formatCurrency = (amount: number | null) => {
  if (!amount) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const getStatusIconName = (status: string) => {
  switch (status) {
    case 'completed':
      return 'CheckCircleIcon';
    case 'assigned':
      return 'TagIcon';
    case 'open':
      return 'ClockIcon';
    default:
      return 'ExclamationCircleIcon';
  }
};

export const getProjectSteps = (project: Project) => {
  return [
    {
      id: 'assigned',
      title: 'Assigned',
      status: project.status === 'assigned' ? 'current' : 'completed' as 'completed' | 'current' | 'pending'
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      status: project.status === 'in_progress' ? 'current' : 
             ['assigned'].includes(project.status) ? 'pending' : 'completed' as 'completed' | 'current' | 'pending'
    },
    {
      id: 'review',
      title: 'Review',
      status: project.status === 'review' ? 'current' : 
             ['assigned', 'in_progress'].includes(project.status) ? 'pending' : 'completed' as 'completed' | 'current' | 'pending'
    },
    {
      id: 'completed',
      title: 'Completed',
      status: project.status === 'completed' ? 'completed' : 'pending' as 'completed' | 'current' | 'pending'
    }
  ];
};

export const getProjectProgress = (project: Project) => {
  const steps = getProjectSteps(project);
  const completedSteps = steps.filter(step => step.status === 'completed').length;
  return Math.round((completedSteps / steps.length) * 100);
};
