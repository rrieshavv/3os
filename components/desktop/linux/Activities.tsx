"use client";

import { useState } from "react";
import { useDesktop } from "@/components/desktop/desktop-context";
import type { ShellProps } from "@/components/desktop/shell-props";
import { AppIcon, FileGlyph, SearchIcon } from "@/components/icons";
import { apps, appTitle } from "@/lib/apps";
import { files } from "@/lib/files";

export function Activities({
  windows,
  onFocus,
  onClose,
  setFlyout,
  mode,
}: ShellProps & { mode: "overview" | "apps" }) {
  const { os, openApp, openNote, notepadName } = useDesktop();
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();
  const showApps = mode === "apps" || needle.length > 0;
  const shownApps = apps.filter((app) => appTitle(app.id, os).toLowerCase().includes(needle));
  const shownFiles = needle ? files.filter((file) => file.name.toLowerCase().includes(needle)) : [];

  return (
    <div
      className="overview"
      data-flyout
      role="dialog"
      aria-label={mode === "apps" ? "Applications" : "Activities overview"}
      onPointerDown={(event) => {
        if (!(event.target as Element).closest("button, label, .win-card")) setFlyout(null);
      }}
    >
      <label className="ov-search">
        <SearchIcon size={14} />
        <input
          autoFocus
          value={query}
          placeholder="Type to search"
          aria-label="Search"
          spellCheck={false}
          autoComplete="off"
          className="w-full bg-transparent text-sm outline-none placeholder:text-white/50"
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
      {showApps ? (
        <div className="ov-apps">
          <div className="app-grid">
            {shownApps.map((app) => (
              <button key={app.id} type="button" onClick={() => openApp(app.id)}>
                <AppIcon id={app.id} size={72} />
                <span>{appTitle(app.id, os)}</span>
              </button>
            ))}
            {shownFiles.map((file) => (
              <button
                key={file.id}
                type="button"
                onClick={() =>
                  file.kind === "text" && file.body
                    ? openNote(file.name, file.body)
                    : openApp("files", file.folder)
                }
              >
                <span className="grid h-[72px] w-[72px] place-items-center">
                  <FileGlyph kind={file.kind} size={60} />
                </span>
                <span>{file.name}</span>
              </button>
            ))}
            {shownApps.length === 0 && shownFiles.length === 0 ? (
              <p className="col-span-full py-10 text-center text-sm text-white/60">No results</p>
            ) : null}
          </div>
        </div>
      ) : (
        <>
          <div className="ov-workspaces" aria-hidden>
            <span className="ws-thumb is-active" />
            <span className="ws-thumb" />
          </div>
          <div className="ov-windows">
            {windows.length === 0 ? (
              <p className="self-center text-sm text-white/55">No open windows</p>
            ) : (
              windows.map((win) => {
                const title = win.id === "notepad" ? notepadName : appTitle(win.id, os);
                return (
                  <div
                    key={win.id}
                    className="win-card"
                    role="button"
                    tabIndex={0}
                    aria-label={`Focus ${title}`}
                    onClick={() => {
                      onFocus(win.id);
                      setFlyout(null);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onFocus(win.id);
                        setFlyout(null);
                      }
                    }}
                  >
                    <div className="win-card-body">
                      <AppIcon id={win.id} size={56} />
                    </div>
                    <div className="win-card-title">
                      <AppIcon id={win.id} size={16} />
                      <span className="truncate">{title}</span>
                    </div>
                    <button
                      type="button"
                      className="win-card-close"
                      aria-label={`Close ${title}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        onClose(win.id);
                      }}
                    >
                      ×
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}
