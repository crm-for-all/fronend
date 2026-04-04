/**
 * Formats a number with commas as thousands separators and exactly two decimal places.
 * Example: 1000000 -> "1,000,000.00"
 */
export const formatCurrency = (amount: number | string | undefined | null): string => {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (value === undefined || value === null || isNaN(value)) {
    return '0.00';
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};
