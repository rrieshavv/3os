"use client";

import { useDesktop } from "@/components/desktop/desktop-context";
import { cn } from "@/lib/cn";
import { osMeta } from "@/lib/os";
import type { AccentId, WallpaperId } from "@/lib/types";

const wallpaperIds: WallpaperId[] = ["aurora", "dusk", "dawn"];
const accentIds: AccentId[] = ["cyan", "violet", "amber"];

export function ThemeControls({ dense = false }: { dense?: boolean }) {
  const { os, wallpaper, setWallpaper, accent, setAccent } = useDesktop();
  const meta = osMeta[os];

  return (
    <div className={dense ? "mt-4" : "mt-5"}>
      <p className="mb-2 text-xs font-medium tracking-wide text-white/55 uppercase">Wallpaper</p>
      <div className="grid grid-cols-3 gap-2">
        {wallpaperIds.map((id) => (
          <button
            key={id}
            type="button"
            className={cn("wall-preview", dense && "is-dense")}
            data-wallpaper={id}
            aria-pressed={wallpaper === id}
            aria-label={meta.wallpapers[id]}
            onClick={() => setWallpaper(id)}
          >
            <span className="absolute bottom-1.5 left-2 text-[11px] font-medium text-white drop-shadow-sm">
              {meta.wallpapers[id]}
            </span>
          </button>
        ))}
      </div>
      <p className="mt-4 mb-2 text-xs font-medium tracking-wide text-white/55 uppercase">Accent</p>
      <div className="flex items-center gap-3">
        {accentIds.map((id) => (
          <button
            key={id}
            type="button"
            className="accent-swatch"
            style={{ background: meta.accents[id].background }}
            aria-pressed={accent === id}
            aria-label={`${meta.accents[id].label} accent`}
            title={meta.accents[id].label}
            onClick={() => setAccent(id)}
          />
        ))}
      </div>
    </div>
  );
}
