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

<<<<<<< HEAD
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

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 2. MongoDB Setup (Atlas)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user with read/write access
4. Whitelist `0.0.0.0/0` in Network Access (or Vercel IPs)
5. Click "Connect" → "Connect your application" → copy the URI
6. Replace `<password>` and `<dbname>` with `portfolio`

---

## 3. Gmail App Password (for contact form)

1. Enable 2FA on your Google account
2. Go to Google Account → Security → App Passwords
3. Create a new app password for "Mail"
4. Use that 16-character password as `EMAIL_PASS`

---

## 4. Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo at [vercel.com](https://vercel.com):

1. Import your repository
2. Add environment variables (same as `.env.local`)
3. Deploy → get a `.vercel.app` URL

---

## 5. Connect Custom Domain

1. In Vercel Dashboard → your project → Settings → Domains
2. Add your domain (e.g., `yourdomain.com`)
3. Go to your domain registrar (Namecheap, GoDaddy, etc.)
4. Add DNS records as shown by Vercel:
   - **A record**: `@` → `76.76.21.21`
   - **CNAME**: `www` → `cname.vercel-dns.com`
5. Wait 24–48h for DNS propagation

---

## 6. Add Content via API

### Add a Project

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Cool Project",
    "description": "Short description",
    "tags": ["React", "TypeScript"],
    "githubUrl": "https://github.com/you/project",
    "liveUrl": "https://project.com",
    "featured": true,
    "year": 2024
  }'
```

### Add a Blog Post

```bash
curl -X POST http://localhost:3000/api/blog \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "slug": "my-first-post",
    "excerpt": "A short description shown in the list.",
    "content": "# Hello World\n\nThis is my first blog post written in **Markdown**.",
    "tags": ["nextjs", "react"],
    "published": true
  }'
```

---

## 7. Customize

| What | Where |
|------|-------|
| Your name & bio | `src/app/page.tsx` |
| Social links | `src/components/layout/Footer.tsx` + `src/app/contact/page.tsx` |
| Nav links | `src/components/layout/Navbar.tsx` |
| Colors & fonts | `src/app/globals.css` + `tailwind.config.ts` |
| SEO metadata | `src/app/layout.tsx` |

---

## 8. Git Workflow

```bash
git init
git add .
git commit -m "feat: initial portfolio setup"
git branch -M main
git remote add origin https://github.com/yourusername/portfolio.git
git push -u origin main
```

After that, every `git push` automatically redeploys on Vercel.

---
=======
>>>>>>> 4609c1571c2376f1b2a65d06aa1f30528a69c6cd

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
