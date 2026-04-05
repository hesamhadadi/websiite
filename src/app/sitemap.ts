import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import dbConnect from "@/lib/db";
import { BlogPostModel } from "@/models/BlogPost";
import { ProjectModel } from "@/models/Project";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/portfolio", "/blog", "/contact"].map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
  }));

  try {
    await dbConnect();
    const [posts, projects] = await Promise.all([
      BlogPostModel.find({ published: true }).select("slug updatedAt").lean(),
      ProjectModel.find({}).select("_id updatedAt").lean(),
    ]);

    return [
      ...staticRoutes,
      ...posts.map((post) => ({
        url: absoluteUrl(`/blog/${post.slug}`),
        lastModified: post.updatedAt || new Date(),
      })),
      ...projects.map((project) => ({
        url: absoluteUrl(`/portfolio/${project._id}`),
        lastModified: project.updatedAt || new Date(),
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
