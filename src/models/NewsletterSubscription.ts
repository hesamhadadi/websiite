import mongoose, { Schema, models } from "mongoose";

export interface NewsletterSubscription {
  _id?: string;
  email: string;
  source?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const NewsletterSubscriptionSchema = new Schema<NewsletterSubscription>(
  {
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    source: { type: String, default: "site" },
  },
  { timestamps: true }
);

export const NewsletterSubscriptionModel =
  models.NewsletterSubscription ||
  mongoose.model<NewsletterSubscription>("NewsletterSubscription", NewsletterSubscriptionSchema);
