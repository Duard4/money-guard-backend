import { model, Schema } from 'mongoose';

// category Incomes relate to type income only, and all other categories relate to type expense only
const transactionsSchema = new Schema(
  {
    userId: { type: String, required: true },
    sum: { type: Number, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: {
      type: String,
      enum: [
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
      ],
      required: true,
    },
    comment: { type: String, required: false },
    date: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false },
);

transactionsSchema.methods.toJSON = function () {
  const obj = this.toObject();
  return obj;
};

export const TransactionsCollection = model('transactions', transactionsSchema);
