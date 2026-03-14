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
  tags: string[];
  published: boolean;
  readTime?: number;
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
