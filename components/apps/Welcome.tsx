"use client";

import { useDesktop } from "@/components/desktop/desktop-context";
import { OsLogo } from "@/components/icons";
import { osList, osMeta } from "@/lib/os";
import type { OsId } from "@/lib/types";

const copy: Record<
  OsId,
  { title: string; intro: string; features: Array<{ title: string; copy: string }> }
> = {
  windows: {
    title: "Windows 12",
    intro:
      "A preview of a quieter desktop. Glass stays light, motion settles quickly, and the everyday apps are one click away.",
    features: [
      { title: "Soft light", copy: "Wallpaper color drifts slowly behind frosted glass." },
      { title: "Quiet motion", copy: "Windows, menus, and the taskbar ease in, then settle." },
      { title: "Everyday apps", copy: "Files, Notepad, Terminal, and Settings sit on the taskbar." },
    ],
  },
  mac: {
    title: "macOS",
    intro:
      "The menu bar stays out of the way, the Dock magnifies under your pointer, and Spotlight is a ⌘ Space away.",
    features: [
      { title: "Menu bar", copy: "App menus on the left, Control Center and the clock on the right." },
      { title: "Dock", copy: "Hover to magnify. Running apps show a dot underneath." },
      { title: "Spotlight", copy: "Press ⌘ Space to search apps and documents from anywhere." },
    ],
  },
  linux: {
    title: "Linux",
    intro:
      "A clean GNOME-style desktop. Press Super for the Activities overview, launch from the Dash, and open a Terminal whenever you like.",
    features: [
      { title: "Activities", copy: "Press Super or click the top-left pills to see every window." },
      { title: "Dash", copy: "Favorites live on the left. The grid at the bottom shows all apps." },
      { title: "Quick Settings", copy: "Wi‑Fi, volume, brightness, and power live in the top-right menu." },
    ],
  },
};

export function Welcome() {
  const { os, openApp, requestOs } = useDesktop();
  const meta = copy[os];

  return (
    <div className="flex h-full flex-col">
      <div className="relative overflow-hidden px-8 pt-8 pb-5">
        <div className="pointer-events-none absolute -top-12 -right-8 h-40 w-40 rounded-full bg-[var(--accent)] opacity-30 blur-3xl" />
        <OsLogo os={os} size={52} />
        <h1 className="mt-5 text-3xl font-semibold tracking-tight">{meta.title}</h1>
        <p className="mt-2 max-w-lg text-sm leading-6 text-white/70">{meta.intro}</p>
      </div>
      <div className="grid grid-cols-3 gap-3 px-8">
        {meta.features.map((feature) => (
          <article key={feature.title} className="rounded-2xl bg-white/10 px-4 py-4">
            <h2 className="text-sm font-medium">{feature.title}</h2>
            <p className="mt-2 text-xs leading-5 text-white/60">{feature.copy}</p>
          </article>
        ))}
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-white/10 px-8 py-4">
        <button type="button" className="btn btn-primary" onClick={() => openApp("files", "documents")}>
          Browse files
        </button>
        <button type="button" className="btn" onClick={() => openApp("notepad")}>
          Open Notepad
        </button>
        <button type="button" className="btn" onClick={() => openApp("settings")}>
          Personalize
        </button>
        <span className="ml-auto flex items-center gap-2">
          {osList
            .filter((id) => id !== os)
            .map((id) => (
              <button
                key={id}
                type="button"
                className="btn flex items-center gap-2"
                onClick={() => requestOs(id)}
              >
                <OsLogo os={id} size={14} />
                Try {osMeta[id].shortName}
              </button>
            ))}
        </span>
      </div>
    </div>
  );
}
