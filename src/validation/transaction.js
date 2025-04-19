import Joi from 'joi';

export const createTransactionSchema = Joi.object({
  sum: Joi.number().required(),
  date: Joi.date().required(),
  type: Joi.string().valid('income', 'expense').required(),
  category: Joi.string()
    .valid(
      'Incomes',
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
    )
    .required(),
  comment: Joi.string().optional(),
});

export const updateTransactionSchema = Joi.object({
  sum: Joi.number().optional(),
  date: Joi.date().optional(),
  type: Joi.string().valid('income', 'expense').optional(),
  category: Joi.string()
    .valid(
      'Incomes',
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
    )
    .optional(),
  comment: Joi.string().optional(),
});
