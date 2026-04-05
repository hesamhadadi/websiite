import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Download, Sparkles } from "lucide-react";
import { GitHubActivity } from "@/components/GitHubActivity";
import { SpotifyNowPlaying } from "@/components/SpotifyNowPlaying";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { getSettingsMap, getSettingValue } from "@/lib/site";

const skills = [
  { category: "Core", items: ["JavaScript", "TypeScript", "Next.js", "React"] },
  { category: "Styling", items: ["Tailwind CSS", "Framer Motion", "Material UI", "Figma-to-Code"] },
  { category: "Tools", items: ["Socket.io", "Mapbox", "Zustand", "RESTful APIs"] },
  { category: "Platform", items: ["Vercel", "Git", "PWA", "SEO"] },
];

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

  return (
    <div className="relative">
      <section className="relative min-h-screen overflow-hidden px-6">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(200,240,76,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(200,240,76,0.05) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="absolute left-[12%] top-24 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-10 right-[8%] h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="relative mx-auto grid min-h-screen max-w-5xl items-center gap-14 py-28 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="mb-8 inline-flex items-center gap-3 border border-border bg-surface px-4 py-2">
              <span className={`h-2.5 w-2.5 rounded-full ${availabilityMode === "open" ? "bg-accent" : "bg-orange-400"}`} />
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-text-secondary">
                {availabilityLabel}
              </span>
            </div>

            <h1 className="font-display text-6xl leading-[0.9] md:text-8xl lg:text-9xl">
              <span className="block">Hesam</span>
              <span className="block italic text-text-secondary">Haddadi</span>
              <span className="block text-accent">Nik.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-text-secondary">
              Senior Frontend Developer building scalable product interfaces with React, Next.js,
              and TypeScript. This portfolio now includes resume download, richer SEO, a real
              contact flow, analytics, theme switching, structured data, and admin-driven status.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 bg-accent px-6 py-3 font-mono text-xs uppercase tracking-widest text-background transition-colors hover:bg-accent-dim"
              >
                View Work <ArrowUpRight size={14} />
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

            <div className="mt-14 grid grid-cols-2 gap-px bg-border md:grid-cols-4">
              {[
                { value: "7+", label: "Years Experience" },
                { value: "25+", label: "Projects Shipped" },
                { value: "SEO", label: "Structured Data Ready" },
                { value: "PWA", label: "Installable" },
              ].map((item) => (
                <div key={item.label} className="bg-surface px-4 py-6">
                  <div className="font-display text-4xl text-accent">{item.value}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-text-secondary">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="relative">
              <div className="absolute -inset-4 border border-accent/20" />
              <div className="relative h-80 w-64 overflow-hidden border border-border bg-surface md:h-[26rem] md:w-80">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="Hesam Haddadi Nik"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 256px, 320px"
                    priority
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-6 text-center text-text-secondary">
                    Upload a profile image from admin settings.
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 flex items-center gap-3">
            <Sparkles size={16} className="text-accent" />
            <span className="font-mono text-xs uppercase tracking-widest text-accent">What changed</span>
          </div>
          <div className="grid gap-px bg-border md:grid-cols-2">
            {[
              "Resume/CV download wired through settings",
              "Open Graph metadata, robots, sitemap, schema.org, and manifest",
              "Real contact form with persistence and rate limiting",
              "Analytics, command palette, dark/light theme toggle",
              "Portfolio filters, blog views, newsletter signup",
              "GitHub activity, Spotify now playing, testimonials",
            ].map((item) => (
              <div key={item} className="bg-surface px-6 py-5 text-text-secondary">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-accent">Stack</span>
            <h2 className="mt-4 font-display text-5xl">Working across product, design, and delivery.</h2>
          </div>
          <div className="grid gap-px bg-border md:grid-cols-4">
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

      <section className="border-t border-border px-6 py-24">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          <GitHubActivity />
          <SpotifyNowPlaying />
        </div>
      </section>

      <TestimonialsSection />
    </div>
  );
}
