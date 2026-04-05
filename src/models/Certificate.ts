import mongoose, { Schema, models } from "mongoose";
import type { Certificate } from "@/types";

const CertificateSchema = new Schema<Certificate>(
  {
    title: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    issueDate: { type: String, trim: true },
    credentialUrl: { type: String, trim: true },
    imageUrl: { type: String, trim: true },
    featured: { type: Boolean, default: true, index: true },
    skills: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

CertificateSchema.index({ featured: -1, createdAt: -1 });

export const CertificateModel =
  models.Certificate || mongoose.model<Certificate>("Certificate", CertificateSchema);
