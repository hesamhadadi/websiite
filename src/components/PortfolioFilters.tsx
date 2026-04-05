"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/types";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { cn } from "@/lib/utils";

export function PortfolioFilters({ projects }: { projects: Project[] }) {
  const [activeTag, setActiveTag] = useState("All");

  const tags = useMemo(() => {
    const uniqueTags = new Set<string>();
    projects.forEach((project) => project.tags.forEach((tag) => uniqueTags.add(tag)));
    return ["All", ...Array.from(uniqueTags)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeTag === "All") return projects;
    return projects.filter((project) => project.tags.includes(activeTag));
  }, [activeTag, projects]);

  return (
    <div>
      <div className="mb-10 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setActiveTag(tag)}
            className={cn(
              "border px-3 py-2 font-mono text-[11px] uppercase tracking-widest transition-colors",
              activeTag === tag
                ? "border-accent bg-accent text-background"
                : "border-border text-text-secondary hover:border-accent hover:text-accent"
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="grid gap-px bg-border md:grid-cols-2">
        {filteredProjects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </div>
  );
}
