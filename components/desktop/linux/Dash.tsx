"use client";

import { useDesktop } from "@/components/desktop/desktop-context";
import type { ShellProps } from "@/components/desktop/shell-props";
import { AppIcon, GridIcon } from "@/components/icons";
import { apps, appTitle } from "@/lib/apps";
import { cn } from "@/lib/cn";

export function Dash({ windows, topZ, flyout, setFlyout, onMinimize }: ShellProps) {
  const { os, openApp } = useDesktop();

  return (
    <div className="gnome-dash" role="toolbar" aria-label="Dash">
      {apps.map((app) => {
        const running = windows.find((win) => win.id === app.id);
        const focused = Boolean(running && !running.minimized && running.z === topZ);
        const title = appTitle(app.id, os);
        return (
          <button
            key={app.id}
            type="button"
            className={cn("dash-item", running && "is-running", focused && "is-focused")}
            data-label={title}
            aria-label={title}
            onClick={() => {
              if (focused) onMinimize(app.id);
              else openApp(app.id);
            }}
          >
            <AppIcon id={app.id} size={44} />
          </button>
        );
      })}
      <span className="mt-auto" />
      <button
        type="button"
        className={cn("dash-item dash-apps", flyout === "launchpad" && "is-open")}
        data-label="Show Apps"
        aria-label="Show Applications"
        aria-expanded={flyout === "launchpad"}
        data-flyout-toggle
        onClick={() => setFlyout((current) => (current === "launchpad" ? null : "launchpad"))}
      >
        <GridIcon size={26} />
      </button>
    </div>
  );
}
