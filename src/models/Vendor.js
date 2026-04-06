import mongoose from "mongoose";

const VendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  category: { type: String },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  totalSpent: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Vendor || mongoose.model("Vendor", VendorSchema);
