import Link from "next/link";
import { ArrowUpRight, Code2, Layers, Zap } from "lucide-react";
import Image from "next/image";
import dbConnect from "@/lib/db";
import mongoose, { Schema, models } from "mongoose";

interface ISetting { key: string; value: string; }
const SettingsSchema = new Schema<ISetting>({ key: String, value: String });
const SettingsModel = models.Settings || mongoose.model<ISetting>("Settings", SettingsSchema);

async function getSettings(): Promise<Record<string, string>> {
  try {
    await dbConnect();
    const docs = await SettingsModel.find({}).lean<ISetting[]>();
    const result: Record<string, string> = {};
    for (const doc of docs) { if (doc.key) result[doc.key] = doc.value ?? ""; }
    return result;
  } catch {
    return {};
  }
}

const skills = [
  { category: "Core", items: ["JavaScript", "TypeScript", "Next.js", "React"] },
  { category: "Styling", items: ["Tailwind CSS", "Framer Motion", "Material UI", "Figma-to-Code"] },
  { category: "Tools", items: ["Socket.io", "Mapbox", "Zustand", "RESTful APIs"] },
  { category: "Platform", items: ["Vercel", "Git", "PWA", "SEO"] },
];

export const revalidate = 60;

export default async function Home() {
  const settings = await getSettings();
  const avatarUrl = settings["avatar_url"] || null;

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center px-6 overflow-hidden">
        {/* Grid bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(200,240,76,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(200,240,76,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
          }}
        />
        {/* Glow */}
        <div
          className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(200,240,76,0.05) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(200,240,76,0.03) 0%, transparent 70%)" }}
        />

        <div className="relative mx-auto max-w-5xl w-full pt-28 pb-16">
          <div className="grid md:grid-cols-5 gap-12 items-center">
            {/* Text — 3 cols */}
            <div className="md:col-span-3">
              <div className="inline-flex items-center gap-2 mb-10 px-3 py-1.5 border border-border bg-surface">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="font-mono text-xs text-text-secondary tracking-widest">
                  OPEN TO OPPORTUNITIES
                </span>
              </div>

              <h1 className="font-display text-6xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tight mb-8">
                <span className="block text-text-primary">Hesam</span>
                <span className="block italic text-text-secondary">Haddadi</span>
                <span className="block text-accent">Nik.</span>
              </h1>

              <p className="max-w-xl text-text-secondary text-lg leading-relaxed mb-12 font-light">
                Senior Frontend Developer with 7+ years building scalable, high-performance
                web apps. Specializing in React, Next.js & TypeScript — from pixel-perfect
                Figma to production.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/portfolio"
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-accent text-background font-mono text-sm font-medium tracking-widest uppercase transition-all duration-200 hover:bg-accent-dim"
                >
                  View Work
                  <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-border text-text-secondary font-mono text-sm tracking-widest uppercase transition-all duration-200 hover:border-accent hover:text-accent"
                >
                  Get in Touch
                </Link>
              </div>
            </div>

            {/* Avatar — 2 cols */}
            <div className="md:col-span-2 flex justify-center md:justify-end">
              <div className="relative">
                {/* Decorative frame */}
                <div className="absolute -inset-3 border border-accent/20" />
                <div className="absolute -inset-6 border border-accent/10" />
                <div className="relative w-64 h-80 md:w-72 md:h-96 overflow-hidden bg-surface border border-border">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt="Hesam Haddadi Nik"
                      fill
                      className="object-cover object-top grayscale hover:grayscale-0 transition-all duration-700"
                      sizes="(max-width: 768px) 256px, 288px"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-surface">
                      <div className="w-20 h-20 rounded-full bg-muted/30 border border-border" />
                      <span className="font-mono text-[10px] text-muted tracking-widest">PHOTO</span>
                    </div>
                  )}
                  {/* Accent bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent" />
                </div>
                {/* Year label */}
                <div className="absolute -bottom-4 -right-4 bg-background border border-border px-3 py-1.5">
                  <span className="font-mono text-xs text-accent tracking-widest">2024</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-12 right-6 hidden md:flex flex-col items-center gap-3 opacity-40">
            <span className="font-mono text-xs tracking-widest text-text-secondary rotate-90 mb-2">SCROLL</span>
            <div className="w-px h-16 bg-gradient-to-b from-text-secondary to-transparent" />
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border bg-surface/50">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {[
              { value: "7+", label: "Years Experience" },
              { value: "4M+", label: "Users Reached" },
              { value: "25+", label: "Projects Shipped" },
              { value: "3", label: "Languages" },
            ].map(({ value, label }) => (
              <div key={label} className="px-6 py-8 group hover:bg-surface transition-colors">
                <div className="font-display text-4xl text-accent mb-1">{value}</div>
                <div className="font-mono text-[10px] text-muted tracking-wider uppercase">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="px-6 py-28">
        <div className="mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-20 items-start">
            <div>
              <span className="font-mono text-xs text-accent tracking-widest uppercase">001 — About</span>
              <h2 className="font-display text-5xl md:text-6xl mt-4 mb-8 leading-tight">
                Turning ideas into
                <span className="italic text-text-secondary"> interfaces.</span>
              </h2>
              <div className="space-y-4 text-text-secondary leading-relaxed font-light">
                <p>
                  I&apos;m a Senior Frontend Developer based in Turin, Italy, currently pursuing
                  an M.Sc. in Data Science at Politecnico di Torino. I bring 7+ years of
                  professional experience building enterprise-grade web applications for
                  global clients.
                </p>
                <p>
                  My work spans social platforms, health-tracking apps with millions of users,
                  governmental portals, and complex dashboards. I care deeply about performance,
                  accessibility, and interfaces that feel genuinely right.
                </p>
              </div>
              <Link
                href="/portfolio"
                className="group inline-flex items-center gap-2 mt-8 font-mono text-xs tracking-widest uppercase text-accent hover:gap-3 transition-all duration-200"
              >
                See my work <ArrowUpRight size={12} />
              </Link>
            </div>

            <div className="space-y-3">
              {[
                {
                  icon: Code2,
                  title: "Pixel-Perfect Engineering",
                  desc: "Expert at translating Figma designs into production-ready code with zero compromises.",
                },
                {
                  icon: Layers,
                  title: "Scalable Architecture",
                  desc: "Built micro-frontend systems and design libraries used by millions of users daily.",
                },
                {
                  icon: Zap,
                  title: "Performance Obsessed",
                  desc: "30% faster load times, 40% scalability improvements — metrics that matter.",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="group p-6 border border-border bg-surface/50 hover:border-accent/30 hover:bg-surface transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 p-2 border border-border group-hover:border-accent/40 transition-colors shrink-0">
                      <Icon size={14} className="text-accent" />
                    </div>
                    <div>
                      <h3 className="font-mono text-sm text-text-primary mb-1 tracking-wide">{title}</h3>
                      <p className="text-sm text-text-secondary leading-relaxed font-light">{desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="px-6 py-16 border-t border-border">
        <div className="mx-auto max-w-5xl">
          <span className="font-mono text-xs text-accent tracking-widest uppercase block mb-10">Tech Stack</span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
            {skills.map(({ category, items }) => (
              <div key={category} className="bg-background px-6 py-8 group hover:bg-surface transition-colors">
                <div className="font-mono text-xs text-text-secondary tracking-wider mb-4 uppercase">{category}</div>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item} className="text-sm text-text-primary font-light group-hover:text-accent transition-colors duration-300">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-32 border-t border-border">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden border border-border bg-surface p-12 md:p-20 text-center">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at center, rgba(200,240,76,0.05) 0%, transparent 70%)" }}
            />
            <h2 className="relative font-display text-5xl md:text-7xl mb-6">
              Let&apos;s build something
              <span className="italic text-accent"> together.</span>
            </h2>
            <p className="relative text-text-secondary mb-10 font-light max-w-md mx-auto">
              Have a project in mind? I&apos;d love to hear about it.
            </p>
            <Link
              href="/contact"
              className="relative group inline-flex items-center gap-2 px-8 py-4 bg-accent text-background font-mono text-sm font-medium tracking-widest uppercase transition-all duration-200 hover:bg-accent-dim"
            >
              Start a conversation
              <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
