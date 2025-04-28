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
  getCategoriesController,
} from '../controllers/transactions.js';
import { authenticate } from '../middlewares/authenticate.js';
import { checkTransactionAccess } from '../middlewares/checkTransactionAccess.js';

const router = Router();

router.get('/categories', ctrlWrapper(getCategoriesController));
router.use(authenticate);
router.get('/', ctrlWrapper(getTransactionsController));
router.post(
  '/',
  validateBody(createTransactionSchema),
  ctrlWrapper(createTransactionController),
);
router.patch(
  '/:transactionId',
  checkTransactionAccess,
  validateBody(updateTransactionSchema),
  ctrlWrapper(updateTransactionController),
);
router.delete(
  '/:transactionId',
  checkTransactionAccess,
  ctrlWrapper(deleteTransactionController),
);
router.get('/summary', ctrlWrapper(getMonthlySummaryController));
export default router;
