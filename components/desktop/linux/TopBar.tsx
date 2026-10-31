"use client";

import { useEffect, useState } from "react";
import { CalendarGrid } from "@/components/desktop/CalendarFlyout";
import { useDesktop } from "@/components/desktop/desktop-context";
import { SystemMenu } from "@/components/desktop/linux/SystemMenu";
import type { ShellProps } from "@/components/desktop/shell-props";
import { BatteryIcon, MoonIcon, VolumeIcon, WifiIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import { formatDate, formatShortDate, formatTime } from "@/lib/time";

export function TopBar({ flyout, setFlyout }: ShellProps) {
  const { volume } = useDesktop();
  const [now, setNow] = useState<Date | null>(null);
  const [dnd, setDnd] = useState(false);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  function toggle(next: Exclude<ShellProps["flyout"], null>) {
    setFlyout((current) => (current === next ? null : next));
  }

  return (
    <div className="gnome-topbar">
      <button
        type="button"
        className={cn("tb-item gap-1.5", flyout === "activities" && "is-open")}
        aria-label="Activities"
        aria-expanded={flyout === "activities"}
        data-flyout-toggle
        onClick={() => toggle("activities")}
      >
        <span className="ws-pill is-active" />
        <span className="ws-pill" />
      </button>
      <div className="absolute left-1/2 -translate-x-1/2">
        <button
          type="button"
          className={cn("tb-item tabular-nums", flyout === "calendar" && "is-open")}
          aria-label={now ? `${formatShortDate(now)}, ${formatTime(now)}` : "Clock"}
          aria-expanded={flyout === "calendar"}
          data-flyout-toggle
          onClick={() => toggle("calendar")}
        >
          <span className={cn(!now && "opacity-0")}>
            {now ? `${formatShortDate(now)}\u2002${formatTime(now)}` : "Clock"}
          </span>
        </button>
        {flyout === "calendar" && now ? (
          <div className="gnome-panel gnome-calendar" data-flyout>
            <div className="flex min-h-[260px] flex-col rounded-2xl bg-white/5 p-4">
              <p className="text-sm font-bold">Notifications</p>
              <p className="my-auto text-center text-sm text-white/45">No Notifications</p>
              <label className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <MoonIcon />
                  Do Not Disturb
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={dnd}
                  aria-label="Do Not Disturb"
                  className={cn("switch", dnd && "is-on")}
                  onClick={() => setDnd((value) => !value)}
                >
                  <span />
                </button>
              </label>
            </div>
            <div className="w-[260px] px-2">
              <p className="text-sm font-bold">{formatDate(now)}</p>
              <CalendarGrid now={now} />
            </div>
          </div>
        ) : null}
      </div>
      <div className="relative">
        <button
          type="button"
          className={cn("tb-item gap-2", flyout === "system" && "is-open")}
          aria-label="System menu"
          aria-expanded={flyout === "system"}
          data-flyout-toggle
          onClick={() => toggle("system")}
        >
          <WifiIcon />
          <VolumeIcon muted={volume === 0} />
          <BatteryIcon />
        </button>
        {flyout === "system" ? (
          <div className="gnome-panel right-0 w-[380px]" data-flyout>
            <SystemMenu />
          </div>
        ) : null}
      </div>
    </div>
  );
}
