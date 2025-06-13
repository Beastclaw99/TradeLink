import { format, isValid } from 'date-fns';

/**
 * Safely formats a date string using date-fns format function
 * @param date - The date string to format
 * @param formatStr - The format string to use (defaults to 'PPP' - e.g., "April 29th, 2021")
 * @returns Formatted date string or fallback message
 */
export const formatDate = (date: string | null | undefined, formatStr: string = 'PPP'): string => {
  if (!date) return 'Not set';
  
  try {
    const parsedDate = new Date(date);
    if (!isValid(parsedDate)) {
      console.error('Invalid date:', date);
      return 'Invalid date';
    }
    return format(parsedDate, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

/**
 * Safely formats a date string using toLocaleDateString
 * @param date - The date string to format
 * @returns Formatted date string or fallback message
 */
export const formatDateToLocale = (date: string | Date | null): string => {
  if (!date) return 'N/A';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'MMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

/**
 * Formats a date string or Date object to a localized date and time string
 * @param date - The date to format (string or Date object)
 * @returns Formatted date and time string in the format "MMM d, yyyy h:mm a"
 */
export const formatDateTimeToLocale = (date: string | Date | null): string => {
  if (!date) return 'N/A';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'MMM d, yyyy h:mm a');
  } catch (error) {
    console.error('Error formatting date and time:', error);
    return 'Invalid Date';
  }
};

/**
 * Formats a date string or Date object to a relative time string (e.g., "2 hours ago")
 * @param date - The date to format (string or Date object)
 * @returns Relative time string
 */
export const formatRelativeTime = (date: string | Date | null): string => {
  if (!date) return 'N/A';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Invalid Date';
  }
}; 