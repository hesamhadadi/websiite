"use client";

import { ArrowUpRight, Github } from "lucide-react";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const coverImage = project.image || (project.images && project.images[0]);

  return (
    <div
      className={cn(
        "group relative bg-background hover:bg-surface transition-colors duration-300 flex flex-col",
        project.featured && "md:col-span-2"
      )}
    >
      {/* Cover image */}
      {coverImage && (
        <div
          className={cn(
            "relative w-full overflow-hidden bg-surface",
            project.featured ? "h-72 md:h-96" : "h-52"
          )}
        >
          <Image
            src={coverImage}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={project.featured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
          />
          {/* subtle dark overlay on hover */}
          <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-300" />

          {/* Image count badge */}
          {project.images && project.images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm px-2 py-1 font-mono text-[10px] text-text-secondary tracking-widest">
              +{project.images.length - 1} more
            </div>
          )}
        </div>
      )}

      <div className="p-8 flex flex-col flex-1 min-h-[200px]">
        {project.featured && (
          <span className="absolute top-6 right-6 font-mono text-xs text-accent tracking-widest uppercase">
            Featured
          </span>
        )}

        <div className="flex-1">
          <div className="font-mono text-xs text-text-secondary mb-4 tracking-wider">
            {project.year}
          </div>
          <h3 className="font-display text-3xl md:text-4xl text-text-primary mb-4 group-hover:text-accent transition-colors duration-200">
            {project.title}
          </h3>
          <p className="text-text-secondary font-light leading-relaxed mb-6">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-xs px-2 py-1 border border-border text-text-secondary group-hover:border-muted transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 mt-8 pt-6 border-t border-border">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-text-secondary hover:text-accent transition-colors uppercase tracking-widest"
            >
              Live <ArrowUpRight size={10} />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-text-secondary hover:text-accent transition-colors uppercase tracking-widest"
            >
              <Github size={12} /> Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
