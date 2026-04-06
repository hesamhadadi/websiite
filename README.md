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

## 1. Local Setup

### Clone & Install

```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
npm install
```

### Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your values:

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/portfolio
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
EMAIL_TO=your@gmail.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

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
