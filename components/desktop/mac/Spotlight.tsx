"use client";

import { useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useDesktop } from "@/components/desktop/desktop-context";
import { AppIcon, FileGlyph, SearchIcon } from "@/components/icons";
import { apps, appTitle } from "@/lib/apps";
import { cn } from "@/lib/cn";
import { files } from "@/lib/files";
import type { Flyout } from "@/lib/types";

type Result = { key: string; label: string; sub: string; icon: ReactNode; go: () => void };

export function Spotlight({ setFlyout }: { setFlyout: Dispatch<SetStateAction<Flyout>> }) {
  const { os, openApp, openNote } = useDesktop();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const needle = query.trim().toLowerCase();

  const results: Result[] = needle
    ? [
        ...apps
          .filter((app) => appTitle(app.id, os).toLowerCase().includes(needle))
          .map((app) => ({
            key: `app-${app.id}`,
            label: appTitle(app.id, os),
            sub: "Application",
            icon: <AppIcon id={app.id} size={28} />,
            go: () => openApp(app.id),
          })),
        ...files
          .filter((file) => file.name.toLowerCase().includes(needle))
          .map((file) => ({
            key: `file-${file.id}`,
            label: file.name,
            sub: file.kind === "text" ? "Document" : "Image",
            icon: <FileGlyph kind={file.kind} size={28} />,
            go: () =>
              file.kind === "text" && file.body
                ? openNote(file.name, file.body)
                : openApp("files", file.folder),
          })),
      ]
    : [];
  const current = Math.min(active, Math.max(0, results.length - 1));

  return (
    <div
      className="spotlight"
      data-flyout
      onPointerDown={(event) => {
        if (!(event.target as Element).closest(".spotlight-box")) setFlyout(null);
      }}
    >
      <div className="spotlight-box" role="dialog" aria-label="Spotlight Search">
        <label className="flex items-center gap-3 px-4">
          <span className="text-white/60">
            <SearchIcon size={22} />
          </span>
          <input
            autoFocus
            value={query}
            placeholder="Spotlight Search"
            aria-label="Spotlight Search"
            spellCheck={false}
            autoComplete="off"
            className="h-14 w-full bg-transparent text-[22px] font-light outline-none placeholder:text-white/35"
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActive((index) => Math.min(index + 1, results.length - 1));
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setActive((index) => Math.max(index - 1, 0));
              } else if (event.key === "Enter" && results[current]) {
                results[current].go();
              }
            }}
          />
        </label>
        {needle ? (
          <div className="sp-results">
            {results.length === 0 ? (
              <p className="px-3 py-4 text-sm text-white/50">No results for “{query.trim()}”</p>
            ) : (
              results.map((result, index) => (
                <button
                  key={result.key}
                  type="button"
                  className={cn("sp-row", index === current && "is-active")}
                  onMouseEnter={() => setActive(index)}
                  onClick={result.go}
                >
                  {result.icon}
                  <span className="min-w-0 flex-1 text-left">
                    <span className="block truncate text-sm">{result.label}</span>
                  </span>
                  <span className="text-xs opacity-60">{result.sub}</span>
                </button>
              ))
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
