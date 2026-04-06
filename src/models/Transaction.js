import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  date: { type: Date, required: true, default: Date.now },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['Income', 'Expense'], required: true },
  category: { type: String, default: 'Uncategorized' },
  reference: { type: String },
  status: { type: String, enum: ['Completed', 'Pending', 'Failed'], default: 'Completed' }
}, { timestamps: true });

export default mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);
