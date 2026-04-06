import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  email: { type: String, required: true },
  currency: { type: String, default: "USD" },
  timezone: { type: String, default: "UTC" },
  theme: { type: String, enum: ['Light', 'Dark', 'System'], default: 'Light' }
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
