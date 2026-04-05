import mongoose, { Schema, models } from "mongoose";

export interface Testimonial {
  _id?: string;
  name: string;
  role: string;
  company?: string;
  quote: string;
  featured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const TestimonialSchema = new Schema<Testimonial>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    company: { type: String, trim: true },
    quote: { type: String, required: true, trim: true },
    featured: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const TestimonialModel =
  models.Testimonial || mongoose.model<Testimonial>("Testimonial", TestimonialSchema);
