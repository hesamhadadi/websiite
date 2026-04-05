import type { Project } from "@/types";

const projectCoverByHost: Record<string, string> = {
  "bazaarino.online": "/project-covers/bazaarino.webp",
  "gitiazizi.vercel.app": "/project-covers/giti-azizi.webp",
  "strive-tau.vercel.app": "/project-covers/strive.webp",
  "realtime-speech-to-text-lake.vercel.app": "/project-covers/realtime-speech.webp",
  "nava-call.vercel.app": "/project-covers/nava-call.webp",
  "gym-zc2q.vercel.app": "/project-covers/gym.webp",
};

function getProjectHost(liveUrl?: string) {
  if (!liveUrl) return null;

  try {
    return new URL(liveUrl).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function getProjectCoverImage(project: Project) {
  const host = getProjectHost(project.liveUrl);
  if (host && projectCoverByHost[host]) return projectCoverByHost[host];
  return project.image || project.images?.[0] || null;
}

export function getProjectGallery(project: Project) {
  const coverImage = getProjectCoverImage(project);
  const gallery = project.images?.length ? [...project.images] : project.image ? [project.image] : [];

  if (!coverImage) return gallery;
  if (gallery.includes(coverImage)) return gallery;
  return [coverImage, ...gallery];
}
