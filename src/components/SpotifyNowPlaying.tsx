"use client";

import { useEffect, useState } from "react";

type SpotifyState = {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  songUrl?: string;
};

export function SpotifyNowPlaying() {
  const [song, setSong] = useState<SpotifyState>({ isPlaying: false });

  useEffect(() => {
    fetch("/api/spotify")
      .then((response) => response.json())
      .then((data) => setSong(data))
      .catch(() => setSong({ isPlaying: false }));
  }, []);

  return (
    <div className="border border-border bg-surface p-6">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">Spotify</p>
      <h3 className="mt-2 font-display text-2xl">Now Playing</h3>
      <div className="mt-4 border border-border bg-background p-4">
        {song.isPlaying && song.songUrl ? (
          <a href={song.songUrl} target="_blank" rel="noreferrer" className="block">
            <div className="font-mono text-xs uppercase tracking-widest text-text-primary">{song.title}</div>
            <div className="mt-2 text-sm text-text-secondary">{song.artist}</div>
          </a>
        ) : (
          <p className="text-sm text-text-secondary">Set Spotify env vars to show live listening status.</p>
        )}
      </div>
    </div>
  );
}
