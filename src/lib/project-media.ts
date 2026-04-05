import type { Project } from "@/types";

type ProjectOverride = Partial<Project> & {
  coverImage?: string;
  gallery?: string[];
};

const projectOverridesByHost: Record<string, ProjectOverride> = {
  "bazaarino.online": {
    coverImage: "/project-covers/bazaarino.webp",
  },
  "gitiazizi.vercel.app": {
    coverImage: "/project-covers/giti-azizi.webp",
  },
  "strive-tau.vercel.app": {
    coverImage: "/project-covers/strive/dashboard.webp",
    gallery: [
      "/project-covers/strive/dashboard.webp",
      "/project-covers/strive/habits.webp",
      "/project-covers/strive/tasks.webp",
      "/project-covers/strive/stats.webp",
      "/project-covers/strive/admin.webp",
    ],
    description:
      "iOS-inspired habit tracker and PWA with streaks, bad-habit recovery, task management, stats, and an admin panel in a polished mobile-first UI.",
    longDescription:
      "HabitFlow is a high-performance personal growth app built with Next.js 14, TypeScript, MongoDB, and Tailwind CSS. The product combines good-habit tracking, bad-habit recovery with savings and health progress, a focused todo workflow, a stats dashboard, installable PWA behavior, and a lightweight admin area. The interface is intentionally native-like: dark aurora visuals, glassmorphism cards, fluid transitions, and a mobile-first information hierarchy that feels closer to an iOS app than a generic CRUD dashboard.",
    githubUrl: "https://github.com/hesamhadadi/Strive",
    tags: ["Next.js", "TypeScript", "MongoDB", "PWA", "NextAuth", "Tailwind CSS"],
  },
  "realtime-speech-to-text-lake.vercel.app": {
    coverImage: "/project-covers/realtime-speech.webp",
  },
  "nava-call.vercel.app": {
    coverImage: "/project-covers/nava-call.webp",
  },
  "gym-zc2q.vercel.app": {
    coverImage: "/project-covers/gym/home.webp",
    gallery: [
      "/project-covers/gym/home.webp",
      "/project-covers/gym/gyms.webp",
      "/project-covers/gym/map.webp",
      "/project-covers/gym/detail.webp",
    ],
    description:
      "Full-stack gym discovery platform with map-based browsing, advanced filtering, reviews, pricing packages, multilingual support, and owner/admin workflows.",
    longDescription:
      "GymFinder is a marketplace-style fitness platform built with Next.js 14, TypeScript, and MongoDB. Users can explore gyms on an interactive map, compare membership packages, filter by amenities, and read reviews. Beyond the public experience, the product also includes operational tooling for gym owners and admins: listing management, verification workflows, multilingual content, and dashboard-oriented maintenance flows. The visual system leans into a dark, high-contrast product aesthetic that fits both consumer browsing and management interfaces.",
    githubUrl: "https://github.com/hesamhadadi/gym",
    tags: ["Next.js", "TypeScript", "MongoDB", "Leaflet", "NextAuth", "Tailwind CSS"],
  },
};

function getProjectHost(liveUrl?: string) {
  if (!liveUrl) return null;

  try {
    return new URL(liveUrl).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function mergeProjectContent(project: Project): Project {
  const host = getProjectHost(project.liveUrl);
  const override = host ? projectOverridesByHost[host] : null;

  if (!override) return project;

  return {
    ...project,
    ...override,
    image: override.coverImage || project.image,
    images: override.gallery || project.images,
    githubUrl: override.githubUrl || project.githubUrl,
    tags: override.tags || project.tags,
  };
}

export function getProjectCoverImage(project: Project) {
  const host = getProjectHost(project.liveUrl);
  if (host && projectOverridesByHost[host]?.coverImage) return projectOverridesByHost[host].coverImage;
  return project.image || project.images?.[0] || null;
}

export function getProjectGallery(project: Project) {
  const host = getProjectHost(project.liveUrl);
  const overrideGallery = host ? projectOverridesByHost[host]?.gallery : null;
  const coverImage = getProjectCoverImage(project);
  const gallery = overrideGallery?.length
    ? [...overrideGallery]
    : project.images?.length
      ? [...project.images]
      : project.image
        ? [project.image]
        : [];

  if (!coverImage) return gallery;
  if (gallery.includes(coverImage)) return gallery;
  return [coverImage, ...gallery];
}
