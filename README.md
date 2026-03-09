# Personal Portfolio — Next.js + MongoDB

A dark, minimal personal portfolio with blog, project showcase, and contact form.

## Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB + Mongoose
- **Email**: Nodemailer (Gmail)
- **Deployment**: Vercel

---


## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── blog/        → GET/POST blog posts
│   │   ├── contact/     → POST contact form
│   │   └── projects/    → GET/POST projects
│   ├── blog/
│   │   ├── [slug]/      → Blog post detail
│   │   └── page.tsx     → Blog listing
│   ├── contact/page.tsx → Contact form
│   ├── portfolio/page.tsx → Projects grid
│   ├── page.tsx         → Home page
│   ├── layout.tsx       → Root layout
│   └── globals.css      → Global styles
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── sections/
│       └── ProjectCard.tsx
├── lib/
│   ├── db.ts            → MongoDB connection
│   └── utils.ts         → Utility functions
├── models/
│   ├── Project.ts
│   ├── BlogPost.ts
│   └── Contact.ts
└── types/index.ts
```
