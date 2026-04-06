import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Download } from "lucide-react";
import dbConnect from "@/lib/db";
import { BlogPostModel } from "@/models/BlogPost";
import { ProjectModel } from "@/models/Project";
import type { Project } from "@/types";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { CertificatesSection } from "@/components/CertificatesSection";
import { getSettingsMap, getSettingValue } from "@/lib/site";
import { getProjectCoverImage, mergeProjectContent } from "@/lib/project-media";

type WritingCard = {
  title: string;
  body: string;
  href: string;
};

async function getProjects(): Promise<Project[]> {
  try {
    await dbConnect();
    const projects = await ProjectModel.find({}).sort({ featured: -1, year: -1 }).limit(12).lean();
    return JSON.parse(JSON.stringify(projects)).map(mergeProjectContent);
  } catch {
    return [];
  }
}

async function getPosts() {
  try {
    await dbConnect();
    const posts = await BlogPostModel.find({ published: true }).sort({ createdAt: -1 }).limit(3).lean();
    return JSON.parse(JSON.stringify(posts));
  } catch {
    return [];
  }
}

export const revalidate = 60;

export default async function Home() {
  const settings = await getSettingsMap();
  const projects = await getProjects();
  const posts = await getPosts();
  const writingCards: WritingCard[] = posts.length
    ? posts.map((post: { title: string; excerpt: string; slug: string }) => ({
        title: post.title,
        body: post.excerpt,
        href: `/blog/${post.slug}`,
      }))
    : [
        {
          title: "How I present product work",
          body: "Turning screenshots into case studies that explain the product clearly.",
          href: "/blog",
        },
        {
          title: "What makes frontend work feel polished",
          body: "Small interface decisions that make a portfolio look more senior and finished.",
          href: "/blog",
        },
        {
          title: "Designing useful React products",
          body: "Balancing component quality, speed, and visual clarity in real product UI.",
          href: "/blog",
        },
      ];

  const avatarUrl = getSettingValue(settings, "avatar_url");
  const resumeUrl = getSettingValue(settings, "resume_url", "/contact");
  const availabilityMode = getSettingValue(settings, "availability_mode", "open");
  const availabilityLabel = getSettingValue(
    settings,
    "availability_label",
    availabilityMode === "open" ? "Open to opportunities" : "Limited availability"
  );

  return (
    <div>
      <section className="px-6 pb-20 pt-28 md:pb-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-start gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-3 border border-border bg-surface px-4 py-2">
                <span className={`h-2.5 w-2.5 rounded-full ${availabilityMode === "open" ? "bg-accent" : "bg-orange-400"}`} />
                <span className="font-mono text-xs uppercase tracking-[0.22em] text-text-secondary">
                  {availabilityLabel}
                </span>
              </div>

              <h1 className="mt-8 font-display text-5xl leading-[0.95] md:text-7xl lg:text-[5.5rem]">
                Hesam Haddadi Nik
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
                Senior Frontend Developer with 7+ years of experience building scalable web products
                with React, Next.js, and TypeScript.
              </p>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-secondary">
                Based in Turin, Italy. Currently pursuing an M.Sc. in Data Science at Politecnico di Torino,
                with a focus on product-quality frontend engineering, performance, and interface polish.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {["React", "Next.js", "TypeScript", "Framer Motion", "MongoDB", "SEO", "PWA", "Design Systems"].map((item) => (
                  <span key={item} className="border border-border px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-text-secondary">
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2 bg-accent px-6 py-3 font-mono text-xs uppercase tracking-widest text-background transition-colors hover:bg-accent-dim"
                >
                  View Projects <ArrowUpRight size={14} />
                </Link>
                <a
                  href={resumeUrl}
                  target={resumeUrl.startsWith("http") ? "_blank" : undefined}
                  rel={resumeUrl.startsWith("http") ? "noreferrer" : undefined}
                  className="inline-flex items-center gap-2 border border-border px-6 py-3 font-mono text-xs uppercase tracking-widest text-text-secondary transition-colors hover:border-accent hover:text-accent"
                >
                  Resume <Download size={14} />
                </a>
              </div>
            </div>

            <div className="lg:justify-self-end">
              <div className="overflow-hidden border border-border bg-surface p-4 md:p-5">
                <div className="relative aspect-[4/5] w-full max-w-[24rem] overflow-hidden bg-background">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt="Hesam Haddadi Nik"
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 100vw, 384px"
                      priority
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-6 text-center text-text-secondary">
                      Upload a profile image from admin settings.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border px-6 py-20 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Product Frontend",
                body: "Shipping modern interfaces that balance design precision, performance, and maintainable architecture.",
              },
              {
                title: "Enterprise Mindset",
                body: "Experience across scalable apps, dashboards, marketplace flows, and polished user-facing products.",
              },
              {
                title: "Continuous Growth",
                body: "Frontend depth backed by ongoing study in data science, product thinking, and web performance.",
              },
            ].map((item) => (
              <div key={item.title} className="border border-border bg-surface p-5">
                <h2 className="font-display text-2xl">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-accent">Selected Projects</span>
              <h2 className="mt-4 font-display text-4xl md:text-5xl">Work</h2>
            </div>
            <Link href="/portfolio" className="hidden font-mono text-xs uppercase tracking-widest text-text-secondary transition-colors hover:text-accent md:inline-flex md:items-center md:gap-2">
              All Projects <ArrowUpRight size={12} />
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="border border-dashed border-border p-16 text-center">
              <p className="font-mono text-sm text-text-secondary">No projects yet.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => {
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
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                            sizes="(max-width: 1200px) 100vw, 33vw"
                          />
                        ) : null}
                      </div>

                      <div className="p-5">
                        <div className="flex items-center justify-between gap-4">
                          <span className="font-mono text-[10px] uppercase tracking-widest text-accent">{project.year}</span>
                          {project.featured ? (
                            <span className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">Featured</span>
                          ) : null}
                        </div>

                        <h3 className="mt-4 font-display text-3xl transition-colors group-hover:text-accent">
                          {project.title}
                        </h3>
                        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-text-secondary">
                          {project.description}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {project.tags.slice(0, 4).map((tag) => (
                            <span key={tag} className="border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-text-secondary">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          )}

          <Link href="/portfolio" className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-text-secondary transition-colors hover:text-accent md:hidden">
            All Projects <ArrowUpRight size={12} />
          </Link>
        </div>
      </section>

      <CertificatesSection />

      <section className="border-t border-border px-6 py-20 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-accent">Writing</span>
              <h2 className="mt-4 font-display text-4xl md:text-5xl">Notes & case studies</h2>
            </div>
            <Link href="/blog" className="hidden font-mono text-xs uppercase tracking-widest text-text-secondary transition-colors hover:text-accent md:inline-flex md:items-center md:gap-2">
              Go To Blog <ArrowUpRight size={12} />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {writingCards.map((item) => (
              <Link key={item.title} href={item.href} className="group border border-border bg-surface p-6 transition-colors hover:border-accent/40">
                <h3 className="font-display text-3xl transition-colors group-hover:text-accent">{item.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-text-secondary">{item.body}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-accent">
                  Read More <ArrowUpRight size={12} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection />

      <section className="border-t border-border px-6 py-20 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-4xl md:text-6xl">Let&apos;s build something clean and useful.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-text-secondary">
            Available for freelance work, product collaborations, and frontend engineering roles.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-accent px-6 py-3 font-mono text-xs uppercase tracking-widest text-background transition-colors hover:bg-accent-dim">
              Contact Me <ArrowUpRight size={14} />
            </Link>
            <Link href="/blog" className="inline-flex items-center gap-2 border border-border px-6 py-3 font-mono text-xs uppercase tracking-widest text-text-secondary transition-colors hover:border-accent hover:text-accent">
              Read Blog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
