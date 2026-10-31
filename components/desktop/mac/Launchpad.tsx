"use client";

import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useDesktop } from "@/components/desktop/desktop-context";
import { AppIcon, SearchIcon } from "@/components/icons";
import { apps, appTitle } from "@/lib/apps";
import type { Flyout } from "@/lib/types";

export function Launchpad({ setFlyout }: { setFlyout: Dispatch<SetStateAction<Flyout>> }) {
  const { os, openApp } = useDesktop();
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();
  const shown = apps.filter((app) => appTitle(app.id, os).toLowerCase().includes(needle));

  return (
    <div
      className="launchpad"
      data-flyout
      role="dialog"
      aria-label="Launchpad"
      onPointerDown={(event) => {
        if (!(event.target as Element).closest("button, label")) setFlyout(null);
      }}
    >
      <label className="lp-search">
        <SearchIcon size={14} />
        <input
          autoFocus
          value={query}
          placeholder="Search"
          aria-label="Search apps"
          spellCheck={false}
          autoComplete="off"
          className="w-full bg-transparent text-sm outline-none placeholder:text-white/50"
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
      <div className="lp-grid">
        {shown.map((app) => (
          <button key={app.id} type="button" onClick={() => openApp(app.id)}>
            <AppIcon id={app.id} size={84} />
            <span>{appTitle(app.id, os)}</span>
          </button>
        ))}
        {shown.length === 0 ? (
          <p className="col-span-full py-10 text-center text-sm text-white/60">No results</p>
        ) : null}
      </div>
      <div className="lp-dots" aria-hidden>
        <span className="is-active" />
        <span />
      </div>
    </div>
  );
}
