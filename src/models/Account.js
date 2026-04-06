import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'], 
    required: true 
  },
  balance: { type: Number, default: 0 },
  description: { type: String }
}, { timestamps: true });

export default mongoose.models.Account || mongoose.model("Account", AccountSchema);
