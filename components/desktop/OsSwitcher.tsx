"use client";

import { useDesktop } from "@/components/desktop/desktop-context";
import { OsLogo } from "@/components/icons";
import { cn } from "@/lib/cn";
import { osList, osMeta } from "@/lib/os";

export function OsSwitcher({ compact = false }: { compact?: boolean }) {
  const { os, requestOs } = useDesktop();

  return (
    <div className="grid grid-cols-3 gap-3">
      {osList.map((id) => {
        const meta = osMeta[id];
        const active = id === os;
        return (
          <button
            key={id}
            type="button"
            className={cn("os-card", active && "is-active", compact && "is-compact")}
            aria-pressed={active}
            aria-label={active ? `${meta.name}, current system` : `Switch to ${meta.name}`}
            onClick={() => requestOs(id)}
          >
            <span className="os-thumb" data-os-thumb={id} aria-hidden>
              <i className="thumb-bar" />
              <i className="thumb-dock" />
              <i className="thumb-window" />
            </span>
            <span className="mt-2.5 flex items-center gap-2 text-sm font-medium">
              <OsLogo os={id} size={16} />
              {meta.name}
            </span>
            <span className="text-xs text-white/50">
              {active ? "Current system" : `Restart into ${meta.shortName}`}
            </span>
          </button>
        );
      })}
    </div>
  );
}
