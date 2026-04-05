"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

type GitHubEvent = {
  id: string;
  type: string;
  repo: string;
  createdAt: string;
};

export function GitHubActivity() {
  const [events, setEvents] = useState<GitHubEvent[]>([]);

  useEffect(() => {
    fetch("/api/github")
      .then((response) => response.json())
      .then((data) => setEvents(Array.isArray(data) ? data : []))
      .catch(() => setEvents([]));
  }, []);

  return (
    <div className="border border-border bg-surface p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-accent">GitHub</p>
          <h3 className="mt-2 font-display text-2xl">Recent Activity</h3>
        </div>
      </div>
      <div className="space-y-3">
        {events.length ? (
          events.map((event) => (
            <div key={event.id} className="border border-border bg-background px-4 py-3">
              <div className="font-mono text-xs uppercase tracking-widest text-text-primary">{event.type}</div>
              <div className="mt-1 text-sm text-text-secondary">{event.repo}</div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted">
                {event.createdAt ? formatDistanceToNow(new Date(event.createdAt), { addSuffix: true }) : ""}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-text-secondary">Connect `GITHUB_TOKEN` for richer activity data.</p>
        )}
      </div>
    </div>
  );
}
