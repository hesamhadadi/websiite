import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hesam Haddadi Nik Portfolio",
    short_name: "Hesam",
    description: "Portfolio, writing, and frontend case studies.",
    start_url: "/",
    display: "standalone",
    background_color: "#080808",
    theme_color: "#c8f04c",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
