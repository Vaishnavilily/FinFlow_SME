import mongoose from "mongoose";

const PayoutSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  destinationBank: { type: String, required: true },
  accountMask: { type: String, required: true },
  reference: { type: String },
  status: { type: String, enum: ['Paid', 'Pending', 'In Transit', 'Failed'], default: 'In Transit' },
  expectedArrival: { type: Date }
}, { timestamps: true });

export default mongoose.models.Payout || mongoose.model("Payout", PayoutSchema);
