
// Common style utilities to reduce duplication across components
export const commonStyles = {
  // Button variants
  buttons: {
    primary: "bg-ttc-blue-700 hover:bg-ttc-blue-800 text-white font-semibold py-2 px-4 rounded transition-colors",
    secondary: "bg-ttc-green-500 hover:bg-ttc-green-600 text-white font-semibold py-2 px-4 rounded transition-colors",
    outline: "border border-ttc-blue-700 text-ttc-blue-700 hover:bg-ttc-blue-700 hover:text-white font-semibold py-2 px-4 rounded transition-colors",
  },
  
  // Card styles
  cards: {
    base: "bg-white rounded-lg shadow-sm border border-gray-200",
    hover: "transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
    interactive: "bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer",
  },
  
  // Status badges
  statusBadges: {
    open: "bg-green-100 text-green-800 border-green-200",
    in_progress: "bg-blue-100 text-blue-800 border-blue-200", 
    completed: "bg-gray-100 text-gray-800 border-gray-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  
  // Text styles
  text: {
    heading: "font-heading font-semibold",
    body: "text-gray-600",
    muted: "text-gray-500",
    accent: "text-ttc-blue-700",
  },
  
  // Layout helpers
  layout: {
    container: "container mx-auto px-4",
    section: "py-8",
    flexCenter: "flex items-center justify-center",
    flexBetween: "flex items-center justify-between",
  }
};

// Utility function to get status badge class
export const getStatusBadgeClass = (status: string) => {
  return commonStyles.statusBadges[status as keyof typeof commonStyles.statusBadges] || commonStyles.statusBadges.open;
};

// Utility function to format currency
export const formatCurrency = (amount: number | string) => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

// Utility function to format dates consistently
export const formatDate = (dateString: string, options?: Intl.DateTimeFormatOptions) => {
  const defaultOptions: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  };
  return new Date(dateString).toLocaleDateString('en-US', options || defaultOptions);
};
