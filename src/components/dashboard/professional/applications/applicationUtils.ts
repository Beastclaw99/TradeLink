
/**
 * Returns the appropriate CSS class for a status badge based on the application status
 * @param status The application status
 * @returns CSS class string for the status badge
 */
export const getStatusBadgeClass = (status: string | null): string => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'accepted':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'withdrawn':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
