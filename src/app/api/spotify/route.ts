import { NextResponse } from "next/server";

async function getAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) return null;

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  });

  if (!response.ok) return null;
  const data = await response.json() as { access_token?: string };
  return data.access_token || null;
}

export async function GET() {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return NextResponse.json({ isPlaying: false });
    }

    const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (response.status === 204 || response.status > 400) {
      return NextResponse.json({ isPlaying: false });
    }

    const song = await response.json() as Record<string, unknown>;
    const item = song.item as Record<string, unknown> | undefined;
    const album = item?.album as Record<string, unknown> | undefined;
    const artists = Array.isArray(item?.artists)
      ? (item?.artists as Array<Record<string, unknown>>).map((artist) => artist.name).join(", ")
      : "";

    return NextResponse.json({
      isPlaying: Boolean(song.is_playing),
      title: item?.name || "",
      artist: artists,
      album: album?.name || "",
      songUrl: (item?.external_urls as Record<string, string> | undefined)?.spotify || "",
      albumImageUrl: Array.isArray(album?.images) ? (album?.images as Array<{ url?: string }>)[0]?.url || "" : "",
    });
  } catch (error) {
    console.error("Spotify API error:", error);
    return NextResponse.json({ isPlaying: false });
  }
}
