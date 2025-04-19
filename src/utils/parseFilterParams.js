const parseBoolean = (value) => {
  if (value === undefined) return undefined;
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }
  return undefined;
};

const parseNumber = (value, fallback = undefined) => {
  if (value === undefined || value === '') return fallback;
  const num = Number(value);
  return isNaN(num) ? fallback : num;
};

const parseDate = (value) => {
  if (!value) return undefined;
  const date = new Date(value);
  return isNaN(date.getTime()) ? undefined : date;
};

/**
 * Parses filter parameters from the query object.
 * @param {Object} query - The query object containing filter parameters.
 * @returns {Object} - An object containing parsed filter parameters.
 */
export const parseFilterParams = (query) => {
  return {
    // Amount range
    minSum: parseNumber(query.minSum),
    maxSum: parseNumber(query.maxSum),

    // Transaction type
    type:
      query.type === 'income' || query.type === 'expense'
        ? query.type
        : undefined,

    // Categories
    categories: query.categories ? query.categories.split(',') : undefined,

    // Date range
    startDate: parseDate(query.startDate),
    endDate: parseDate(query.endDate),

    // Comment search
    comment: query.comment || undefined,

    // Sorting parameters
    sortBy: query.sortBy || 'date',
    sortOrder: query.sortOrder || 'desc',
  };
};
