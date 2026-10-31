"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import { useDesktop } from "@/components/desktop/desktop-context";
import type { ShellProps } from "@/components/desktop/shell-props";
import { AppIcon, type IconId } from "@/components/icons";
import { cn } from "@/lib/cn";
import type { AppId, Flyout } from "@/lib/types";

const items: Array<{ icon: IconId; label: string; app?: AppId; flyout?: Exclude<Flyout, null> }> = [
  { icon: "finder", label: "Finder", app: "files" },
  { icon: "launchpad", label: "Launchpad", flyout: "launchpad" },
  { icon: "welcome", label: "Welcome", app: "welcome" },
  { icon: "notepad", label: "TextEdit", app: "notepad" },
  { icon: "terminal", label: "Terminal", app: "terminal" },
  { icon: "settings", label: "System Settings", app: "settings" },
];

function magnify(dock: HTMLElement, clientX: number | null) {
  dock.querySelectorAll<HTMLElement>(".dock-item").forEach((button) => {
    if (clientX === null) {
      button.style.transform = "";
      button.style.marginInline = "";
      return;
    }
    const rect = button.getBoundingClientRect();
    const distance = Math.abs(clientX - (rect.left + rect.width / 2));
    const amount = Math.max(0, 1 - distance / 88);
    const scale = 1 + amount * amount * 0.72;
    button.style.transform = `translateY(${(1 - scale) * 22}px) scale(${scale})`;
    button.style.marginInline = `${(scale - 1) * 9}px`;
  });
}

export function Dock({ windows, flyout, setFlyout, topZ, onMinimize }: ShellProps) {
  const { openApp, reduceMotion } = useDesktop();

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (reduceMotion) return;
    magnify(event.currentTarget, event.clientX);
  }

  function onPointerLeave(event: ReactPointerEvent<HTMLDivElement>) {
    magnify(event.currentTarget, null);
  }

  return (
    <div className={cn("mac-dock-wrap", flyout === "launchpad" && "is-away")}>
      <div
        className="mac-dock"
        role="toolbar"
        aria-label="Dock"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        {items.map((item) => {
          const running = item.app ? windows.find((win) => win.id === item.app) : undefined;
          const focused = Boolean(running && !running.minimized && running.z === topZ);
          const open = item.flyout ? flyout === item.flyout : false;
          return (
            <button
              key={item.label}
              type="button"
              className={cn("dock-item", (running || open) && "is-running")}
              data-label={item.label}
              aria-label={item.label}
              data-flyout-toggle={item.flyout ? "" : undefined}
              onClick={() => {
                if (item.app) {
                  if (focused) onMinimize(item.app);
                  else openApp(item.app);
                  return;
                }
                if (item.flyout) {
                  const next = item.flyout;
                  setFlyout((current) => (current === next ? null : next));
                }
              }}
            >
              <AppIcon id={item.icon} size={48} />
            </button>
          );
        })}
        <span className="dock-sep" aria-hidden />
        <button
          type="button"
          className="dock-item"
          data-label="Trash"
          aria-label="Trash"
          onClick={() => openApp("files", "this-pc")}
        >
          <AppIcon id="trash" size={48} />
        </button>
      </div>
    </div>
  );
}
