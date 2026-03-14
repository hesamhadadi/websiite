import mongoose, { Schema, models } from "mongoose";
import type { Project } from "@/types";

const ProjectSchema = new Schema<Project>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    longDescription: { type: String },
    tags: [{ type: String }],
    githubUrl: { type: String },
    liveUrl: { type: String },
    image: { type: String },       // primary image
    images: [{ type: String }],    // all images
    featured: { type: Boolean, default: false },
    year: { type: Number, required: true },
  },
  { timestamps: true }
);

export const ProjectModel =
  models.Project || mongoose.model<Project>("Project", ProjectSchema);
