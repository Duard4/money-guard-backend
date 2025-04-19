import { SORT_ORDER } from '../constants/index.js';

const parseSortOrder = (sortOrder) => {
  return [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder)
    ? sortOrder
    : SORT_ORDER.DESC;
};

const parseSortBy = (sortBy) => {
  const validFields = ['type', 'category', 'sum', 'date'];

  const fieldMap = {
    type: 'type',
    category: 'category',
    date: 'date',
    sum: 'sum',
  };

  const dbField = fieldMap[sortBy] || sortBy;
  return validFields.includes(dbField) ? dbField : 'date';
};

export const parseSortParams = (query) => {
  const { sortBy = 'date', sortOrder } = query;

  return {
    sortBy: parseSortBy(sortBy),
    sortOrder: parseSortOrder(sortOrder),
  };
};
