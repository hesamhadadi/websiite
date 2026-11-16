import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import dbConnect from "@/lib/db";
import { BlogPostModel } from "@/models/BlogPost";
import { ProjectModel } from "@/models/Project";
import type { Project } from "@/types";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { CertificatesSection } from "@/components/CertificatesSection";
import { getSettingsMap, getSettingValue } from "@/lib/site";
import { getProjectCoverImage, mergeProjectContent } from "@/lib/project-media";

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
  const avatarUrl = getSettingValue(settings, "avatar_url");
  const resumeUrl = getSettingValue(settings, "resume_url", "/contact");
  const availabilityMode = getSettingValue(settings, "availability_mode", "open");
  const availabilityLabel = getSettingValue(
    settings,
    "availability_label",
    availabilityMode === "open" ? "Open to opportunities" : "Limited availability"
  );

  const work = projects.length ? projects.map(project => ({
    title: project.title, description: project.description, cover: getProjectCoverImage(project),
    href: `/portfolio/${project._id}`, tags: project.tags
  })) : [
    {title: "Bazaarino", description: "Classifieds, housing reservations and real-time chat for Persian speakers in Europe.", cover: "/project-covers/bazaarino.webp", href: "https://github.com/hesamhadadi/Bazaarino", tags: ["Next.js", "MongoDB"]},
    {title: "NavaCall", description: "One-to-one video and audio calls with presets for low-bandwidth connections.", cover: "/project-covers/nava-call.webp", href: "https://github.com/hesamhadadi/NavaCall", tags: ["WebRTC", "Supabase"]},
    {title: "Persian Real-time Speech", description: "A small TypeScript library for live browser transcription in Persian and other languages.", cover: "/project-covers/realtime-speech.webp", href: "https://github.com/hesamhadadi/realtime-speech-to-text", tags: ["TypeScript", "Web Speech API"]}
  ];

  return (
    <div className="folio">
      <section className="folio-hero">
        <div className="folio-intro">
          <p className="folio-kicker">Senior frontend engineer <span aria-hidden="true">/</span> Turin, Italy</p>
          <h1>Hesam<br/><em>Haddadi Nik.</em></h1>
          <p className="folio-bio">I build web products with React, Next.js and TypeScript. Over seven years of frontend engineering, now paired with graduate studies in data science at Politecnico di Torino.</p>
          <div className="folio-actions"><a className="folio-primary" href="#work">Explore my work <ArrowDown size={16}/></a><a href={resumeUrl}>{resumeUrl === "/contact" ? "Contact me" : "Résumé"} <ArrowUpRight size={16}/></a></div>
        </div>
        <aside className="folio-feature">
          <Link href={work[0].href} className="folio-art">
            {work[0].cover ? <Image src={work[0].cover} alt={work[0].title} fill priority sizes="(min-width: 850px) 42vw, 92vw" className="object-contain"/> : <span className="folio-type-cover">{work[0].title}</span>}
          </Link>
          <Link href={work[0].href} className="folio-caption"><span>Featured work</span><strong>{work[0].title}</strong><ArrowUpRight size={16}/></Link>
        </aside>
      </section>
      <div className="folio-status">
        {avatarUrl && <Image src={avatarUrl} width={36} height={36} alt="" className="rounded-full object-cover"/>}
        <span className="status-dot" style={{background: availabilityMode === "open" ? "var(--accent)" : "#e29a53"}}/>{availabilityLabel}
      </div>
      <section id="work" className="folio-section">
        <header><h2>Selected work</h2><Link href="/portfolio">All projects <ArrowUpRight size={16}/></Link></header>
        <div className="folio-grid">{work.map(project => <Link className="folio-card" href={project.href} key={project.href}>
          {project.cover && <div className="folio-cover"><Image src={project.cover} alt="" fill sizes="(min-width: 850px) 45vw, 92vw" className="object-contain"/></div>}
          <small>{project.tags.slice(0,3).join(" · ")}</small><h3>{project.title} <ArrowUpRight size={22}/></h3><p>{project.description}</p>
        </Link>)}</div>
      </section>
      <CertificatesSection/>
      {posts.length > 0 && <section className="folio-section"><header><h2>Writing</h2><Link href="/blog">All articles <ArrowUpRight size={16}/></Link></header>
        {posts.map((post: {slug: string; title: string; excerpt: string}) => <Link className="folio-article" key={post.slug} href={`/blog/${post.slug}`}><h3>{post.title}</h3><p>{post.excerpt}</p><ArrowUpRight size={20}/></Link>)}
      </section>}
      <TestimonialsSection/>
      <section className="folio-section"><header><h2>Get in touch.</h2><Link href="/contact">Contact me <ArrowUpRight size={18}/></Link></header></section>
    </div>
  );
}
