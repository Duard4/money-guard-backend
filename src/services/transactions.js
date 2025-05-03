import { TransactionsCollection } from '../db/models/transaction.js';
import { SORT_ORDER } from '../constants/index.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { UsersCollection } from '../db/models/user.js';
import mongoose from 'mongoose';

/**
 * getTransactions retrieves transactions from the database with pagination and sorting.
 * Applies filters to the transactions based on the provided query parameters.
 * @param {object} query - The query parameters for pagination and sorting.
 * @param {number} query.page - The page number for pagination.
 * @param {number} query.perPage - The number of transactions per page.
 * @param {string} query.sortBy - The field to sort by.
 * @param {string} query.sortOrder - The order to sort by (asc or desc).
 * @param {object} query.filters - The filters to apply to the transactions.
 * @returns {Promise<object>} - An object containing the transactions and pagination data.
 * @throws {Error} - If an error occurs while retrieving transactions.
 */
export const getTransactions = async ({
  userId,
  page = 1,
  perPage = 10,
  sortBy = 'date',
  sortOrder = SORT_ORDER.ASC,
  filters = {},
}) => {
  const query = { userId: userId };

  if (filters.minSum !== undefined) {
    query.sum = { ...query.sum, $gte: Number(filters.minSum) };
  }

  if (filters.maxSum !== undefined) {
    query.sum = { ...query.sum, $lte: Number(filters.maxSum) };
  }

  if (filters.type && ['income', 'expense'].includes(filters.type)) {
    query.type = filters.type;
  }

  if (filters.category && TRANSACTION_CATEGORIES.includes(filters.category)) {
    query.category = filters.category;
  }

  if (filters.startDate) {
    query.date = { ...query.date, $gte: new Date(filters.startDate) };
  }

  if (filters.endDate) {
    query.date = { ...query.date, $lte: new Date(filters.endDate) };
  }

  if (filters.comment) {
    query.comment = { $regex: filters.comment, $options: 'i' };
  }

  const transactions = await TransactionsCollection.find(query)
    .sort({ [sortBy]: sortOrder === SORT_ORDER.ASC ? 1 : -1 })
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec();

  const total = await TransactionsCollection.countDocuments(query);

  return {
    data: transactions,
    ...calculatePaginationData({
      page,
      perPage,
      total,
    }),
  };
};

/**
 * createTransaction creates a new transaction in the database and update user's balance.
 * Expence transaction cannot be done if the user does not have enough balance.
 * category of the income type can be only 'Incomes', and all other categories can be used for expense type.
 * @param {string} userId - The ID of the user creating the transaction.
 * @param {object} payload - The transaction data to be created.
 * @returns {Promise<object>} - The created transaction object.
 */
export const createTransaction = async (userId, payload) => {
  const user = await UsersCollection.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  if (payload.type === 'income' && payload.category !== 'Incomes') {
    throw new Error('Invalid category for income type');
  }
  if (payload.type === 'expense' && payload.category === 'Incomes') {
    throw new Error('Invalid category for expense type');
  }
  const session = await mongoose.startSession();
  session.startTransaction();

  const balanceChange = payload.type === 'income' ? payload.sum : -payload.sum;
  const newBalance = user.balance + balanceChange;

  await UsersCollection.updateOne(
    { _id: userId },
    {
      $inc: { balance: balanceChange },
    },
  );
  const transaction = await TransactionsCollection.create(
    [
      {
        ...payload,
        userId,
      },
    ],
    { session },
  );
  await session.commitTransaction();
  const cleanTransaction = transaction[0].toObject();
  return {
    ...cleanTransaction,
    balanceAfter: newBalance,
  };
};

/**
 * updateTransaction updates an existing transaction with proper balance adjustment.
 * First reverses the effect of the old transaction, then applies the new effect.
 */
export const updateTransaction = async (userId, transactionId, payload) => {
  const [transaction, user] = await Promise.all([
    TransactionsCollection.findOne({ _id: transactionId, userId }),
    UsersCollection.findById(userId),
  ]);

  if (!user) throw new Error('User not found');
  if (!transaction) throw new Error('Transaction not found');

  if (payload.type) {
    if (payload.type === 'income' && payload.category !== 'Incomes') {
      throw new Error('Income transactions must use "Incomes" category');
    }
    if (payload.type === 'expense' && payload.category === 'Incomes') {
      throw new Error('Expense transactions cannot use "Incomes" category');
    }
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  const newType = payload.type || transaction.type;
  const newSum = payload.sum !== undefined ? payload.sum : transaction.sum;

  let balanceChange = 0;
  balanceChange +=
    transaction.type === 'income' ? -transaction.sum : transaction.sum;
  balanceChange += newType === 'income' ? newSum : -newSum;
  const newBalance = user.balance + balanceChange;

  await UsersCollection.updateOne(
    { _id: userId },
    { $inc: { balance: balanceChange } },
  );

  const updatedTransaction = await TransactionsCollection.findOneAndUpdate(
    { _id: transactionId },
    { $set: payload },
    { new: true },
  );
  await session.commitTransaction();

  return { ...updatedTransaction.toObject(), balanceAfter: newBalance };
};

export const deleteTransaction = async (userId, transactionId) => {
  const [transaction, user] = await Promise.all([
    TransactionsCollection.findOne({ _id: transactionId, userId }),
    UsersCollection.findById(userId),
  ]);

  if (!user) {
    throw new Error('User not found');
  }

  if (!transaction) {
    throw new Error('Transaction not found');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const balanceChange =
    transaction.type === 'income' ? -transaction.sum : transaction.sum;

  const newBalance = user.balance + balanceChange;

  await UsersCollection.updateOne(
    { _id: userId },
    { $inc: { balance: balanceChange } },
    { session },
  );

  await TransactionsCollection.deleteOne({ _id: transactionId }, { session });

  await session.commitTransaction();

  return {
    _id: transactionId,
    userId: user._id,
    balanceAfter: newBalance,
    deleted: true,
  };
};

/**
 * getMonthlySummary retrieves the monthly summary of transactions for a user.
 * It calculates the total income and expense for each category and the overall balance.
 * @param {string} userId - The ID of the user.
 * @param {string} month - The month for which to retrieve the summary (1-12).
 * @param {string} year - The year for which to retrieve the summary (YYYY).
 * @returns {Promise<object>} - An object containing the monthly summary.
 * */
export const getMonthlySummary = async (userId, month, year) => {
  const startDate = new Date(`${year}-${month}-01`);
  const endDate = new Date(
    month === '12' ? `${year + 1}-01-01` : `${year}-${Number(month) + 1}-01`,
  );

  const transactions = await TransactionsCollection.aggregate([
    {
      $match: {
        userId: String(userId),
        date: {
          $gte: startDate,
          $lt: endDate,
        },
      },
    },
    {
      $group: {
        _id: {
          type: '$type',
          category: '$category',
        },
        total: { $sum: '$sum' },
      },
    },
  ]);
  const summary = {
    income: {},
    expense: {},
    totalIncome: 0,
    totalExpense: 0,
  };

  transactions.forEach((trans) => {
    const { type, category } = trans._id;
    if (type === 'income') {
      if (!summary.income[category]) {
        summary.income[category] = 0;
      }
      summary.income[category] += trans.total;
      summary.totalIncome += trans.total;
    } else if (type === 'expense') {
      if (!summary.expense[category]) {
        summary.expense[category] = 0;
      }
      summary.expense[category] += trans.total;
      summary.totalExpense += trans.total;
    }
  });
  console.log('Found transactions:', transactions.length);
  console.log(transactions);

  const balance = summary.totalIncome - summary.totalExpense;

  return {
    income: summary.income,
    expense: summary.expense,
    totalIncome: summary.totalIncome,
    totalExpense: summary.totalExpense,
    balance,
  };
};

export const getCategories = (type) => {
  const expenses = [
    'Main expenses',
    'Products',
    'Car',
    'Self care',
    'Child care',
    'Household products',
    'Education',
    'Leisure',
    'Other expenses',
    'Entertainment',
  ];
  return type === 'income'
    ? ['Incomes']
    : type === 'expense'
    ? expenses
    : [...expenses, 'Incomes'];
};
