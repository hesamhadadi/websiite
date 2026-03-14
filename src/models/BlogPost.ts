import mongoose, { Schema, models } from "mongoose";
import type { BlogPost } from "@/types";
import { estimateReadTime } from "@/lib/utils";

const BlogPostSchema = new Schema<BlogPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    published: { type: Boolean, default: false },
    readTime: { type: Number },
  },
  { timestamps: true }
);

BlogPostSchema.pre("save", function (next) {
  if (this.content) {
    this.readTime = estimateReadTime(this.content);
  }
  next();
});

export const BlogPostModel =
  models.BlogPost || mongoose.model<BlogPost>("BlogPost", BlogPostSchema);
