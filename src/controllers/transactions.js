import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
  getMonthlySummary,
  getCategories,
} from '../services/transactions.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

export const getTransactionsController = async (req, res) => {
  const userId = req.user._id;
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filters = parseFilterParams(req.query);

  const transactions = await getTransactions({
    userId,
    page,
    perPage,
    sortBy,
    sortOrder,
    filters,
  });

  res.json({
    status: 200,
    message: 'Successfully fetched transactions!',
    data: transactions,
  });
};

export const createTransactionController = async (req, res) => {
  const userId = req.user._id;
  const transaction = await createTransaction(userId, req.body);

  res.json({
    status: 201,
    message: 'Successfully created a transaction!',
    data: transaction,
  });
};

export const updateTransactionController = async (req, res) => {
  const userId = req.user._id;
  const { transactionId } = req.params;
  const transaction = await updateTransaction(userId, transactionId, req.body);

  res.json({
    status: 200,
    message: 'Successfully updated a transaction!',
    data: transaction,
  });
};

export const deleteTransactionController = async (req, res) => {
  const userId = req.user._id;
  const { transactionId } = req.params;
  await deleteTransaction(userId, transactionId);

  res.status(204).send();
};

export const getMonthlySummaryController = async (req, res) => {
  const userId = req.user._id;
  const { month, year } = req.query;

  const summary = await getMonthlySummary(userId, month, year);

  res.json({
    status: 200,
    message: 'Successfully fetched monthly summary!',
    data: summary,
  });
};

export const getCategoriesController = async (req, res) => {
  const { type } = req.body;
  const categories = await getCategories(type);
  res.json({
    status: 200,
    message: `Successfully fetched categories of type ${type}`,
    data: categories,
  });
};
