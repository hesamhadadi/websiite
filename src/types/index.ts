export interface Project {
  _id?: string;
  title: string;
  description: string;
  longDescription?: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  image?: string;       // primary image (kept for backwards compat)
  images?: string[];    // all uploaded images
  featured: boolean;
  year: number;
  createdAt?: Date;
}

export interface BlogPost {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
  published: boolean;
  readTime?: number;
  views?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ContactMessage {
  _id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt?: Date;
}

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

export interface Certificate {
  _id?: string;
  title: string;
  issuer: string;
  issueDate?: string;
  credentialUrl?: string;
  imageUrl?: string;
  featured: boolean;
  skills: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
