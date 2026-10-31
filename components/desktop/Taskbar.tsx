"use client";

import { useEffect, useState } from "react";
import { apps } from "@/lib/apps";
import { useDesktop } from "@/components/desktop/desktop-context";
import { CalendarFlyout } from "@/components/desktop/CalendarFlyout";
import { QuickSettings } from "@/components/desktop/QuickSettings";
import type { ShellProps } from "@/components/desktop/shell-props";
import { StartMenu } from "@/components/desktop/StartMenu";
import {
  AppIcon,
  BatteryIcon,
  Logo,
  SearchIcon,
  VolumeIcon,
  WifiIcon,
} from "@/components/icons";
import { cn } from "@/lib/cn";
import { formatShortDate, formatTime } from "@/lib/time";

export function Taskbar({ flyout, setFlyout, windows, topZ }: ShellProps) {
  const { openApp, volume } = useDesktop();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="taskbar-wrap pointer-events-none absolute inset-x-0 bottom-3 z-40 flex justify-center px-3">
      <div className="pointer-events-auto relative">
        {flyout === "start" ? (
          <div className="absolute bottom-full left-1/2 z-50 mb-3 -translate-x-1/2" data-flyout>
            <StartMenu />
          </div>
        ) : null}
        {flyout === "quick" ? (
          <div className="absolute right-0 bottom-full z-50 mb-3" data-flyout>
            <QuickSettings />
          </div>
        ) : null}
        {flyout === "calendar" && now ? (
          <div className="absolute right-0 bottom-full z-50 mb-3" data-flyout>
            <CalendarFlyout now={now} />
          </div>
        ) : null}
        <div className="glass flex max-w-[calc(100vw-24px)] items-center gap-1 overflow-x-auto rounded-[22px] px-1.5 py-1.5">
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-xl hover:bg-white/10"
            aria-label="Start"
            aria-expanded={flyout === "start"}
            data-flyout-toggle
            onClick={() => setFlyout((current) => (current === "start" ? null : "start"))}
          >
            <Logo size={22} />
          </button>
          <button
            type="button"
            className="flex h-9 items-center gap-2 rounded-full bg-white/10 px-3 text-sm text-white/70 hover:bg-white/15"
            data-flyout-toggle
            onClick={() => setFlyout("start")}
          >
            <SearchIcon />
            Search
          </button>
          <span className="mx-1 h-6 w-px shrink-0 bg-white/15" />
          {apps.map((app) => {
            const running = windows.find((win) => win.id === app.id);
            const focused = Boolean(running && !running.minimized && running.z === topZ);
            return (
              <button
                key={app.id}
                type="button"
                aria-label={app.title}
                className={cn("task-icon", running && "is-running", focused && "is-focused")}
                onClick={() => openApp(app.id)}
              >
                <AppIcon id={app.id} size={30} />
              </button>
            );
          })}
          <span className="mx-1 h-6 w-px shrink-0 bg-white/15" />
          <button
            type="button"
            className="flex h-11 items-center gap-2 rounded-xl px-2 text-white/85 hover:bg-white/10"
            aria-label="Quick settings"
            aria-expanded={flyout === "quick"}
            data-flyout-toggle
            onClick={() => setFlyout((current) => (current === "quick" ? null : "quick"))}
          >
            <WifiIcon />
            <VolumeIcon muted={volume === 0} />
            <BatteryIcon />
            <span className="text-xs tabular-nums">86</span>
          </button>
          <button
            type="button"
            className="rounded-xl px-3 py-1 text-right leading-tight hover:bg-white/10"
            aria-label={now ? `${formatTime(now)}, ${formatShortDate(now)}` : "Clock"}
            aria-expanded={flyout === "calendar"}
            data-flyout-toggle
            onClick={() => setFlyout((current) => (current === "calendar" ? null : "calendar"))}
          >
            <span className={cn("block text-xs font-medium tabular-nums", !now && "opacity-0")}>
              {now ? formatTime(now) : "00:00"}
            </span>
            <span className={cn("block text-[11px] text-white/60", !now && "opacity-0")}>
              {now ? formatShortDate(now) : "Date"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
