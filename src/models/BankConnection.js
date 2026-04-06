import mongoose from "mongoose";

const BankConnectionSchema = new mongoose.Schema({
  bankName: { type: String, required: true },
  accountName: { type: String, required: true },
  accountMask: { type: String, required: true }, // e.g., "1234"
  status: { type: String, enum: ['Connected', 'Disconnected', 'Syncing'], default: 'Connected' },
  balance: { type: Number, default: 0 },
  lastSync: { type: Date, default: Date.now },
  provider: { type: String, default: 'Mock-Plaid' } // Plaid, Stripe, etc
}, { timestamps: true });

export default mongoose.models.BankConnection || mongoose.model("BankConnection", BankConnectionSchema);
