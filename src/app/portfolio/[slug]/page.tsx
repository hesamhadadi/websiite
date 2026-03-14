import { Metadata } from "next";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import { ProjectModel } from "@/models/Project";
import type { Project } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";

interface Props { params: { slug: string } }

async function getProject(id: string): Promise<Project | null> {
  try {
    await dbConnect();
    const project = await ProjectModel.findById(id).lean();
    if (!project) return null;
    return JSON.parse(JSON.stringify(project));
  } catch { return null; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject(params.slug);
  if (!project) return { title: "Not Found" };
  return { title: project.title, description: project.description };
}

export const revalidate = 60;

export default async function ProjectPage({ params }: Props) {
  const project = await getProject(params.slug);
  if (!project) notFound();

  const allImages = project.images && project.images.length > 0
    ? project.images
    : project.image ? [project.image] : [];

  const primaryImage = project.image || allImages[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative">
        {primaryImage ? (
          <div className="relative h-[55vh] md:h-[70vh] w-full overflow-hidden">
            <Image src={primaryImage} alt={project.title} fill className="object-cover" priority sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          </div>
        ) : (
          <div className="h-48 w-full bg-surface border-b border-border" />
        )}

        {/* Back */}
        <div className="absolute top-8 left-6 md:left-10">
          <Link href="/portfolio" className="inline-flex items-center gap-2 font-mono text-xs text-text-secondary hover:text-text-primary transition-colors tracking-widest uppercase bg-background/70 backdrop-blur-sm border border-border px-3 py-2">
            <ArrowLeft size={11} /> Back
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-6 pb-32 -mt-24 relative z-10">
        <div className="grid md:grid-cols-3 gap-16">

          {/* Main */}
          <div className="md:col-span-2">
            <div className="mb-10">
              <span className="font-mono text-xs text-accent tracking-widest uppercase">{project.year}</span>
              <h1 className="font-display text-5xl md:text-7xl mt-3 leading-tight">{project.title}</h1>
              <p className="text-text-secondary text-lg font-light mt-4 leading-relaxed">{project.description}</p>
            </div>

            {project.longDescription && (
              <div className="mb-12">
                <div className="w-8 h-px bg-accent mb-6" />
                <p className="text-text-secondary font-light leading-loose whitespace-pre-line">{project.longDescription}</p>
              </div>
            )}

            {/* Gallery */}
            {allImages.length > 0 && (
              <div className="mb-12">
                <span className="font-mono text-xs text-muted tracking-widest uppercase mb-6 block">Gallery</span>
                {allImages.length === 1 ? (
                  <div className="relative aspect-video overflow-hidden border border-border">
                    <Image src={allImages[0]} alt={project.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 66vw" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {allImages.map((img, i) => (
                      <div key={img} className={`relative overflow-hidden border border-border bg-surface ${i === 0 ? "col-span-2 aspect-video" : "aspect-square"}`}>
                        <Image src={img} alt={`${project.title} ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 50vw" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="sticky top-28 space-y-8">
              <div className="space-y-3">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-between w-full px-5 py-4 bg-accent text-background font-mono text-xs font-medium tracking-widest uppercase hover:bg-accent-dim transition-colors">
                    View Live Site <ArrowUpRight size={13} />
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-between w-full px-5 py-4 border border-border text-text-secondary font-mono text-xs tracking-widest uppercase hover:text-text-primary hover:border-accent/40 transition-colors">
                    View Code <Github size={13} />
                  </a>
                )}
              </div>

              {project.tags.length > 0 && (
                <div>
                  <span className="font-mono text-[10px] text-muted tracking-widest uppercase mb-3 block">Tech Stack</span>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="font-mono text-xs px-2.5 py-1.5 border border-border text-text-secondary">{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4 pt-4 border-t border-border">
                <div>
                  <span className="font-mono text-[10px] text-muted tracking-widest uppercase block mb-1">Year</span>
                  <span className="font-mono text-sm text-text-primary">{project.year}</span>
                </div>
                {project.featured && (
                  <div>
                    <span className="font-mono text-[10px] text-muted tracking-widest uppercase block mb-1">Type</span>
                    <span className="font-mono text-sm text-accent">Featured Project</span>
                  </div>
                )}
              </div>

              <Link href="/portfolio" className="inline-flex items-center gap-2 font-mono text-xs text-text-secondary hover:text-accent transition-colors tracking-widest uppercase pt-4 border-t border-border w-full">
                <ArrowLeft size={11} /> All Projects
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
