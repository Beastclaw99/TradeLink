export const formatCurrency = (amount: number | null): string => {
  if (amount === null) return 'Not specified';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}; 