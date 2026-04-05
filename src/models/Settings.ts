import mongoose, { Schema, models } from "mongoose";

export interface SiteSetting {
  key: string;
  value: string;
}

const SettingsSchema = new Schema<SiteSetting>(
  {
    key: { type: String, required: true, unique: true, index: true },
    value: { type: String, default: "" },
  },
  { timestamps: true }
);

export const SettingsModel =
  models.Settings || mongoose.model<SiteSetting>("Settings", SettingsSchema);
