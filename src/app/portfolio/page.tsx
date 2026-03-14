import { Metadata } from "next";
import { ProjectCard } from "@/components/sections/ProjectCard";
import dbConnect from "@/lib/db";
import { ProjectModel } from "@/models/Project";
import type { Project } from "@/types";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected projects and case studies.",
};

export const revalidate = 60;

async function getProjects(): Promise<Project[]> {
  try {
    await dbConnect();
    const projects = await ProjectModel.find({})
      .sort({ featured: -1, year: -1 })
      .lean();
    return JSON.parse(JSON.stringify(projects));
  } catch {
    return [];
  }
}

export default async function PortfolioPage() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen pt-28 px-6 pb-24">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-20">
          <span className="font-mono text-xs text-accent tracking-widest uppercase">
            002 — Work
          </span>
          <h1 className="font-display text-6xl md:text-8xl mt-4 leading-tight">
            Selected
            <span className="italic text-text-secondary"> Projects</span>
          </h1>
          <p className="text-text-secondary mt-6 font-light max-w-lg">
            A collection of things I&apos;ve built — from side projects to client work.
          </p>
        </div>

        {/* Projects grid */}
        {projects.length === 0 ? (
          <div className="border border-dashed border-border p-16 text-center">
            <p className="font-mono text-sm text-text-secondary">
              No projects yet. Add some via the API.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-px bg-border">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
