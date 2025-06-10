
import React from 'react';
import { CheckCircleIcon, TagIcon, ClockIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface StatusIconProps {
  status: string;
}

export const StatusIcon: React.FC<StatusIconProps> = ({ status }) => {
  switch (status) {
    case 'completed':
      return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
    case 'assigned':
      return <TagIcon className="h-4 w-4 text-blue-600" />;
    case 'open':
      return <ClockIcon className="h-4 w-4 text-gray-600" />;
    default:
      return <ExclamationCircleIcon className="h-4 w-4 text-yellow-600" />;
  }
};
