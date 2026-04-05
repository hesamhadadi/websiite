import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Download, Layers3, Sparkles, Workflow, Zap } from "lucide-react";
import dbConnect from "@/lib/db";
import { ProjectModel } from "@/models/Project";
import type { Project } from "@/types";
import { GitHubActivity } from "@/components/GitHubActivity";
import { SpotifyNowPlaying } from "@/components/SpotifyNowPlaying";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { CertificatesSection } from "@/components/CertificatesSection";
import { getSettingsMap, getSettingValue } from "@/lib/site";
import { getProjectCoverImage, mergeProjectContent } from "@/lib/project-media";

const skills = [
  { category: "Frontend", items: ["React", "Next.js", "TypeScript", "Framer Motion"] },
  { category: "Systems", items: ["Design Systems", "App Router", "PWA", "SEO"] },
  { category: "Product", items: ["Case Study Thinking", "Figma-to-Code", "Performance", "Accessibility"] },
  { category: "Delivery", items: ["MongoDB", "Vercel", "NextAuth", "Admin CMS"] },
];

async function getFeaturedProjects(): Promise<Project[]> {
  try {
    await dbConnect();
    const projects = await ProjectModel.find({}).sort({ featured: -1, year: -1 }).limit(6).lean();
    return JSON.parse(JSON.stringify(projects)).map(mergeProjectContent);
  } catch {
    return [];
  }
}

export const revalidate = 60;

export default async function Home() {
  const settings = await getSettingsMap();
  const avatarUrl = getSettingValue(settings, "avatar_url");
  const resumeUrl = getSettingValue(settings, "resume_url", "/contact");
  const availabilityMode = getSettingValue(settings, "availability_mode", "open");
  const availabilityLabel = getSettingValue(
    settings,
    "availability_label",
    availabilityMode === "open" ? "Open to opportunities" : "Limited availability"
  );
  const featuredProjects = await getFeaturedProjects();

  return (
    <div className="relative">
      <section className="relative overflow-hidden px-6 pb-20 pt-28 md:pb-28">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(200,240,76,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(200,240,76,0.05) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="absolute left-[8%] top-16 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-10 right-[8%] h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="mb-8 inline-flex items-center gap-3 border border-border bg-surface px-4 py-2">
                <span className={`h-2.5 w-2.5 rounded-full ${availabilityMode === "open" ? "bg-accent" : "bg-orange-400"}`} />
                <span className="font-mono text-xs uppercase tracking-[0.22em] text-text-secondary">
                  {availabilityLabel}
                </span>
              </div>

              <div className="max-w-4xl">
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-accent">Senior Frontend Developer</p>
                <h1 className="mt-6 font-display text-6xl leading-[0.9] md:text-8xl lg:text-[7.5rem]">
                  Product interfaces that feel
                  <span className="italic text-text-secondary"> sharp, fast, and hireable.</span>
                </h1>
                <p className="mt-8 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
                  I build modern React and Next.js products with strong visual execution, clean
                  architecture, and portfolio-ready polish. This site now presents stronger case
                  studies, recruiter-facing proof, certifications, and richer project galleries.
                </p>
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2 bg-accent px-6 py-3 font-mono text-xs uppercase tracking-widest text-background transition-colors hover:bg-accent-dim"
                >
                  Explore Work <ArrowUpRight size={14} />
                </Link>
                <a
                  href={resumeUrl}
                  target={resumeUrl.startsWith("http") ? "_blank" : undefined}
                  rel={resumeUrl.startsWith("http") ? "noreferrer" : undefined}
                  className="inline-flex items-center gap-2 border border-border px-6 py-3 font-mono text-xs uppercase tracking-widest text-text-secondary transition-colors hover:border-accent hover:text-accent"
                >
                  Download Resume <Download size={14} />
                </a>
              </div>

              <div className="mt-16 grid gap-px bg-border md:grid-cols-4">
                {[
                  { value: "7+", label: "Years Building UI" },
                  { value: "25+", label: "Projects Shipped" },
                  { value: "PWA", label: "Installable Products" },
                  { value: "SEO", label: "Search-Ready Delivery" },
                ].map((item) => (
                  <div key={item.label} className="bg-surface px-5 py-6">
                    <div className="font-display text-4xl text-accent">{item.value}</div>
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-text-secondary">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="relative overflow-hidden border border-border bg-surface p-5">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
                <div className="mb-4 flex items-center justify-between">
                  <p className="font-mono text-xs uppercase tracking-widest text-accent">Profile</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">Turin, Italy</p>
                </div>
                <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] lg:grid-cols-1 xl:grid-cols-[0.8fr_1.2fr]">
                  <div className="relative min-h-[22rem] overflow-hidden border border-border bg-background">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt="Hesam Haddadi Nik"
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 768px) 100vw, 320px"
                        priority
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-6 text-center text-text-secondary">
                        Upload a profile image from admin settings.
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    {[
                      "Frontend systems with product-level polish, not only page assembly.",
                      "Case-study presentation that communicates outcomes, not just screenshots.",
                      "Admin tooling, SEO, analytics, and CMS-style workflows when the product needs them.",
                    ].map((item) => (
                      <div key={item} className="border border-border bg-background px-4 py-4 text-sm leading-relaxed text-text-secondary">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    icon: Workflow,
                    title: "Case Studies",
                    body: "Focused project stories with stronger galleries, context, and clearer GitHub/live links.",
                  },
                  {
                    icon: BadgeCheck,
                    title: "Credentials",
                    body: "Dedicated certificate management and a public trust layer for recruiters.",
                  },
                  {
                    icon: Zap,
                    title: "Performance",
                    body: "Structured metadata, sitemap, analytics, responsive media, and PWA-friendly delivery.",
                  },
                ].map(({ icon: Icon, title, body }) => (
                  <div key={title} className="border border-border bg-surface p-5">
                    <Icon size={16} className="text-accent" />
                    <h3 className="mt-4 font-display text-2xl">{title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-text-secondary">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex items-center gap-3">
            <Sparkles size={16} className="text-accent" />
            <span className="font-mono text-xs uppercase tracking-widest text-accent">Selected Work</span>
          </div>
          <div className="grid gap-6 xl:grid-cols-3">
            {featuredProjects.slice(0, 3).map((project) => {
              const coverImage = getProjectCoverImage(project);
              return (
                <article key={project._id} className="group overflow-hidden border border-border bg-surface">
                  <Link href={`/portfolio/${project._id}`} className="block">
                    <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-background">
                      {coverImage ? (
                        <Image
                          src={coverImage}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          sizes="(max-width: 1200px) 100vw, 33vw"
                        />
                      ) : null}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-accent">{project.year}</span>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">
                          {project.featured ? "Featured" : "Project"}
                        </span>
                      </div>
                      <h3 className="mt-4 font-display text-3xl transition-colors group-hover:text-accent">
                        {project.title}
                      </h3>
                      <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-text-secondary">
                        {project.description}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {project.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-text-secondary">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-accent">
                        Open Case Study <ArrowUpRight size={12} />
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
          <div className="mt-8">
            <Link href="/portfolio" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-text-secondary transition-colors hover:text-accent">
              View Full Portfolio <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-accent">How I Work</span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">A professional portfolio should show proof, process, and trust.</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                icon: Layers3,
                title: "Clear positioning",
                body: "A recruiter should understand role, level, stack, and value proposition within the first few seconds.",
              },
              {
                icon: Workflow,
                title: "Context-rich projects",
                body: "The strongest portfolios show screenshots, links, technical choices, and what the product actually does.",
              },
              {
                icon: BadgeCheck,
                title: "Trust signals",
                body: "Testimonials, certifications, admin-grade polish, and strong metadata make the work feel more complete and credible.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="border border-border bg-surface p-6">
                <Icon size={16} className="text-accent" />
                <h3 className="mt-4 font-display text-3xl">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-px bg-border md:grid-cols-4">
            {skills.map(({ category, items }) => (
              <div key={category} className="bg-background px-6 py-8">
                <div className="font-mono text-xs uppercase tracking-widest text-text-secondary">{category}</div>
                <ul className="mt-5 space-y-2">
                  {items.map((item) => (
                    <li key={item} className="text-sm text-text-primary">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CertificatesSection />

      <section className="border-t border-border px-6 py-24">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <GitHubActivity />
          <SpotifyNowPlaying />
        </div>
      </section>

      <TestimonialsSection />

      <section className="border-t border-border px-6 py-24">
        <div className="mx-auto max-w-4xl border border-border bg-surface p-8 text-center md:p-14">
          <span className="font-mono text-xs uppercase tracking-widest text-accent">Next Step</span>
          <h2 className="mt-5 font-display text-4xl md:text-6xl">Need a frontend engineer who can make the product look finished?</h2>
          <p className="mx-auto mt-5 max-w-2xl text-text-secondary">
            If you want the site to feel more premium, the fastest gains usually come from better presentation,
            stronger proof, and cleaner interactions. This portfolio now reflects that direction.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-accent px-6 py-3 font-mono text-xs uppercase tracking-widest text-background transition-colors hover:bg-accent-dim">
              Start A Conversation <ArrowUpRight size={14} />
            </Link>
            <Link href="/blog" className="inline-flex items-center gap-2 border border-border px-6 py-3 font-mono text-xs uppercase tracking-widest text-text-secondary transition-colors hover:border-accent hover:text-accent">
              Read Writing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
