import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  const username = process.env.GITHUB_USERNAME || "hesamhaddadinik";

  try {
    const response = await fetch(`https://api.github.com/users/${username}/events/public`, {
      headers: process.env.GITHUB_TOKEN
        ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
        : undefined,
      next: { revalidate },
    });

    if (!response.ok) throw new Error("Failed to fetch GitHub activity");

    const events = await response.json() as Array<Record<string, unknown>>;
    const simplified = events
      .filter((event) => typeof event.type === "string" && event.repo)
      .slice(0, 6)
      .map((event) => ({
        id: String(event.id),
        type: String(event.type),
        repo: String((event.repo as { name?: string }).name || ""),
        createdAt: String(event.created_at || ""),
      }));

    return NextResponse.json(simplified);
  } catch (error) {
    console.error("GitHub API error:", error);
    return NextResponse.json([]);
  }
}
