"use client";

import { ArrowUpRight, Github, ExternalLink } from "lucide-react";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export function ProjectCard({ project }: { project: Project }) {
  const coverImage = project.image || (project.images && project.images[0]);
  const slug = project._id;

  return (
    <div className={cn(
      "group relative flex flex-col overflow-hidden bg-surface border border-border hover:border-accent/30 transition-all duration-500",
      project.featured && "md:col-span-2"
    )}>
      {/* Image */}
      <Link href={`/portfolio/${slug}`} className="block relative overflow-hidden">
        <div className={cn("relative w-full", project.featured ? "h-80 md:h-[480px]" : "h-60 md:h-72")}>
          {coverImage ? (
            <>
              <Image
                src={coverImage} alt={project.title} fill
                className="object-cover transition-all duration-700 group-hover:scale-105"
                sizes={project.featured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 50vw"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-background border-b border-border">
              <span className="font-mono text-xs text-muted tracking-widest uppercase">No image</span>
            </div>
          )}

          {project.featured && (
            <div className="absolute top-4 left-4 bg-accent text-background px-3 py-1 font-mono text-[10px] tracking-widest uppercase font-medium">
              Featured
            </div>
          )}
          {project.images && project.images.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-background/70 backdrop-blur-sm border border-border px-2 py-1 font-mono text-[10px] text-text-secondary tracking-widest">
              +{project.images.length - 1} photos
            </div>
          )}

          {/* Hover CTA */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex items-center gap-2 bg-accent text-background px-5 py-2.5 font-mono text-xs tracking-widest uppercase font-medium translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              View Project <ArrowUpRight size={12} />
            </div>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-3">
          <span className="font-mono text-xs text-muted tracking-widest">{project.year}</span>
          <Link href={`/portfolio/${slug}`}>
            <h3 className={cn(
              "font-display mt-1 text-text-primary group-hover:text-accent transition-colors duration-200 leading-tight",
              project.featured ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl"
            )}>
              {project.title}
            </h3>
          </Link>
        </div>

        <p className="text-text-secondary font-light leading-relaxed text-sm mb-5 line-clamp-2">{project.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tags.map((tag) => (
            <span key={tag} className="font-mono text-[11px] px-2.5 py-1 border border-border text-muted hover:border-accent/40 hover:text-text-secondary transition-colors">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
          <Link href={`/portfolio/${slug}`} className="inline-flex items-center gap-1.5 font-mono text-xs text-accent hover:text-accent-dim transition-colors uppercase tracking-widest">
            Case study <ArrowUpRight size={10} />
          </Link>
          <div className="flex items-center gap-3">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-text-secondary hover:text-text-primary transition-colors uppercase tracking-widest"
                onClick={(e) => e.stopPropagation()}>
                Live <ExternalLink size={10} />
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-text-secondary hover:text-text-primary transition-colors uppercase tracking-widest"
                onClick={(e) => e.stopPropagation()}>
                <Github size={12} /> Code
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
