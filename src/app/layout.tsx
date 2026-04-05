import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/Providers";
import { ThemeScript } from "@/components/ThemeScript";
import { absoluteUrl, DEFAULT_OG_IMAGE, getSettingsMap, getSettingValue, getSiteUrl } from "@/lib/site";
import { Analytics } from "@vercel/analytics/react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettingsMap();
  const siteUrl = getSettingValue(settings, "site_url", getSiteUrl());
  const ogImage = getSettingValue(settings, "og_image", absoluteUrl(DEFAULT_OG_IMAGE));

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "Hesam Haddadi Nik — Senior Frontend Developer",
      template: "%s | Hesam Haddadi Nik",
    },
    description:
      "Senior Frontend Developer with 7+ years of experience building scalable web apps with React, Next.js & TypeScript. Based in Turin, Italy.",
    keywords: ["frontend", "developer", "react", "nextjs", "typescript", "portfolio", "hesam haddadi"],
    authors: [{ name: "Hesam Haddadi Nik" }],
    creator: "Hesam Haddadi Nik",
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      title: "Hesam Haddadi Nik — Senior Frontend Developer",
      description: "Senior Frontend Developer with 7+ years of experience building scalable web apps with React, Next.js & TypeScript.",
      siteName: "Hesam Haddadi Nik",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Hesam Haddadi Nik Portfolio",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Hesam Haddadi Nik — Senior Frontend Developer",
      description: "Senior Frontend Developer with 7+ years of experience building scalable web apps.",
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Hesam Haddadi Nik",
    url: getSiteUrl(),
    jobTitle: "Senior Frontend Developer",
    sameAs: [
      "https://github.com/hesamhaddadinik",
      "https://www.linkedin.com/in/hesam-hadadi-557574194/",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Hesam Haddadi Nik",
    url: getSiteUrl(),
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      </head>
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
