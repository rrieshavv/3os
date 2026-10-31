"use client";

import { useEffect, useRef, useState } from "react";
import { apps } from "@/lib/apps";
import { files } from "@/lib/files";
import { useDesktop } from "@/components/desktop/desktop-context";
import { AppIcon, AppleMark, PowerIcon, SearchIcon, TuxMark } from "@/components/icons";

export function StartMenu() {
  const { openApp, openNote, restart, sleep, requestOs } = useDesktop();
  const [query, setQuery] = useState("");
  const [powerOpen, setPowerOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  const needle = query.trim().toLowerCase();
  const shownApps = apps.filter((app) => app.title.toLowerCase().includes(needle));
  const shownFiles = files.filter(
    (file) => file.kind === "text" && file.body && file.name.toLowerCase().includes(needle),
  );

  return (
    <div className="start-menu glass w-[min(540px,calc(100vw-24px))] rounded-3xl p-4">
      <label className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2">
        <SearchIcon />
        <input
          ref={searchRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search apps and files"
          className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
          aria-label="Search"
        />
      </label>

      <p className="mt-4 mb-2 px-1 text-xs font-medium tracking-wide text-white/50 uppercase">
        Pinned
      </p>
      {shownApps.length === 0 ? (
        <p className="px-1 py-6 text-center text-sm text-white/50">No matching apps</p>
      ) : (
        <div className="grid grid-cols-4 gap-1">
          {shownApps.map((app) => (
            <button
              key={app.id}
              type="button"
              className="flex flex-col items-center gap-2 rounded-2xl px-2 py-3 text-xs hover:bg-white/10"
              onClick={() => openApp(app.id)}
            >
              <AppIcon id={app.id} size={40} />
              {app.title}
            </button>
          ))}
        </div>
      )}

      <p className="mt-3 mb-2 px-1 text-xs font-medium tracking-wide text-white/50 uppercase">
        Recommended
      </p>
      <div className="grid gap-1">
        {shownFiles.length === 0 ? (
          <p className="px-1 py-3 text-sm text-white/50">No matching files</p>
        ) : (
          shownFiles.map((file) => (
            <button
              key={file.id}
              type="button"
              className="flex items-center justify-between rounded-xl px-2 py-2 text-left hover:bg-white/10"
              onClick={() => openNote(file.name, file.body ?? "")}
            >
              <span className="text-sm">{file.name}</span>
              <span className="text-xs text-white/45 capitalize">{file.folder}</span>
            </button>
          ))
        )}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
        <div className="flex items-center gap-3 px-1">
          <span className="avatar">P</span>
          <span>
            <span className="block text-sm font-medium">Preview</span>
            <span className="block text-xs text-white/50">Local session</span>
          </span>
        </div>
        <div className="relative">
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-lg hover:bg-white/10"
            aria-label="Power"
            aria-expanded={powerOpen}
            onClick={() => setPowerOpen((open) => !open)}
          >
            <PowerIcon />
          </button>
          {powerOpen ? (
            <div className="glass absolute right-0 bottom-11 w-52 rounded-xl p-1">
              <button type="button" className="menu-item" onClick={sleep}>
                Sleep
              </button>
              <button type="button" className="menu-item" onClick={restart}>
                Restart
              </button>
              <hr className="my-1 border-white/10" />
              <button
                type="button"
                className="menu-item flex items-center gap-2.5"
                onClick={() => requestOs("mac")}
              >
                <AppleMark size={14} />
                Switch to macOS
              </button>
              <button
                type="button"
                className="menu-item flex items-center gap-2.5"
                onClick={() => requestOs("linux")}
              >
                <TuxMark size={15} />
                Switch to Linux
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
