import { TransactionsCollection } from '../db/models/transaction.js';
import createHttpError from 'http-errors';

export const checkTransactionAccess = async (req, _res, next) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user._id;

    const transaction = await TransactionsCollection.findById(transactionId);
    if (!transaction || transaction.userId.toString() !== userId.toString()) {
      throw createHttpError(404, 'Transaction not found or access denied');
    }
    next();
  } catch (error) {
    next(error);
  }
};
