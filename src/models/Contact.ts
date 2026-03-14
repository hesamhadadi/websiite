import mongoose, { Schema, models } from "mongoose";
import type { ContactMessage } from "@/types";

const ContactSchema = new Schema<ContactMessage>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ContactModel =
  models.Contact || mongoose.model<ContactMessage>("Contact", ContactSchema);
