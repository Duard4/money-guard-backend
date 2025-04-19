import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createTransactionSchema,
  updateTransactionSchema,
} from '../validation/transaction.js';
import {
  updateTransactionController,
  createTransactionController,
  deleteTransactionController,
  getTransactionsController,
  getMonthlySummaryController,
} from '../controllers/transactions.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();
router.use(authenticate);

router.get('/', ctrlWrapper(getTransactionsController));
router.post(
  '/',
  validateBody(createTransactionSchema),
  ctrlWrapper(createTransactionController),
);
router.patch(
  '/:transactionId',
  // checkTransactionAccess,
  validateBody(updateTransactionSchema),
  ctrlWrapper(updateTransactionController),
);
router.delete('/:transactionId', ctrlWrapper(deleteTransactionController));
router.get('/summary', ctrlWrapper(getMonthlySummaryController));

export default router;
