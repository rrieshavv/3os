"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { osMeta } from "@/lib/os";
import type { OsId } from "@/lib/types";

const shutdownLog = [
  "Stopped target Graphical Interface.",
  "Stopped GNOME Display Manager.",
  "Stopped Session 2 of User preview.",
  "Stopped Network Manager.",
  "Unmounted /boot/efi.",
  "Reached target System Reboot.",
];

export function ShutdownScreen({
  os,
  target,
  reduceMotion,
  onDone,
}: {
  os: OsId;
  target: OsId;
  reduceMotion: boolean;
  onDone: () => void;
}) {
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const reduced =
      reduceMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => onDoneRef.current(), reduced ? 250 : 2100);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  return (
    <div className="shutdown" data-os={os} role="status" aria-live="polite">
      {os === "windows" ? (
        <div className="flex flex-col items-center gap-6">
          <span className="spin-ring" aria-hidden />
          <p className="text-base">Restarting</p>
        </div>
      ) : null}
      {os === "mac" ? <span className="mac-spinner" aria-hidden /> : null}
      {os === "linux" ? (
        <div className="sysd-log is-shutdown">
          {shutdownLog.map((text, index) => (
            <p key={text} style={{ "--i": index } as CSSProperties}>
              <span className="ok">[  OK  ]</span> {text}
            </p>
          ))}
          <p style={{ "--i": shutdownLog.length } as CSSProperties}>
            <span className="pad" /> Rebooting into {osMeta[target].name}...
          </p>
        </div>
      ) : null}
      <span className="sr-only">Restarting into {osMeta[target].name}</span>
    </div>
  );
}
