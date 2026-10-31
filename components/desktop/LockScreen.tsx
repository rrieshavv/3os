"use client";

import { useEffect, useRef, useState } from "react";
import { useDesktop } from "@/components/desktop/desktop-context";
import { cn } from "@/lib/cn";
import { formatDate, formatTime } from "@/lib/time";

export function LockScreen({
  disabled = false,
  fading = false,
  onUnlock,
}: {
  disabled?: boolean;
  fading?: boolean;
  onUnlock: () => void;
}) {
  const { os } = useDesktop();
  const [now, setNow] = useState<Date | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!disabled && !fading) buttonRef.current?.focus();
  }, [disabled, fading]);

  const time = now ? formatTime(now) : "00:00";
  const date = now ? formatDate(now) : "Today";

  return (
    <div className={cn("lock", fading && "is-fading")}>
      <div className="lock-scrim" />
      <button
        ref={buttonRef}
        type="button"
        className="lock-hit"
        onClick={onUnlock}
        disabled={disabled || fading}
        aria-label="Sign in as Preview"
      >
        {os === "windows" ? (
          <>
            <div className={cn("lock-clock", !now && "opacity-0")}>
              <p className="lock-time text-[5.5rem] leading-none font-extralight tracking-tight tabular-nums">
                {time}
              </p>
              <p className="lock-date mt-3 text-xl text-white/80">{date}</p>
            </div>
            <span className="user-chip glass">
              <span className="avatar">P</span>
              <span>
                <span className="block text-sm font-medium">Preview</span>
                <span className="block text-xs text-white/60">Click or press Enter</span>
              </span>
            </span>
          </>
        ) : null}
        {os === "mac" ? (
          <>
            <div className={cn("lock-clock", !now && "opacity-0")}>
              <p className="lock-date text-lg font-semibold text-white/90">{date}</p>
              <p className="lock-time text-[6.5rem] leading-none font-bold tracking-tight tabular-nums">
                {time}
              </p>
            </div>
            <span className="mac-user">
              <span className="avatar">P</span>
              <span className="text-sm font-semibold">Preview</span>
              <span className="mac-pass">Enter Password</span>
            </span>
          </>
        ) : null}
        {os === "linux" ? (
          <>
            <div className={cn("lock-clock", !now && "opacity-0")}>
              <p className="lock-time text-[6rem] leading-none font-bold tracking-tight tabular-nums">
                {time}
              </p>
              <p className="lock-date mt-4 text-xl font-medium text-white/85">{date}</p>
            </div>
            <span className="gnome-unlock">
              <span className="avatar">P</span>
              <span className="text-base font-semibold">Preview</span>
              <span className="text-xs text-white/60">Click or press Enter to unlock</span>
            </span>
          </>
        ) : null}
      </button>
    </div>
  );
}
