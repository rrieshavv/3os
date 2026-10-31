"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { AppleMark, Logo, TuxMark } from "@/components/icons";
import { cn } from "@/lib/cn";
import { osMeta } from "@/lib/os";
import type { OsId } from "@/lib/types";

const bootLog: Array<{ ok: boolean; text: string }> = [
  { ok: true, text: "Started Journal Service." },
  { ok: true, text: "Mounted /boot/efi." },
  { ok: true, text: "Reached target Local File Systems." },
  { ok: true, text: "Started Network Manager." },
  { ok: true, text: "Started Bluetooth service." },
  { ok: true, text: "Started Accounts Service." },
  { ok: true, text: "Reached target Sound Card." },
  { ok: true, text: "Started GNOME Display Manager." },
  { ok: true, text: "Reached target Graphical Interface." },
  { ok: false, text: "Starting Hold until boot process finishes up..." },
];

export function BootScreen({
  os,
  reduceMotion,
  onExited,
}: {
  os: OsId;
  reduceMotion: boolean;
  onExited: () => void;
}) {
  const [exiting, setExiting] = useState(false);
  const finished = useRef(false);
  const onExitedRef = useRef(onExited);
  const finishRef = useRef<() => void>(() => {});

  useEffect(() => {
    onExitedRef.current = onExited;
  }, [onExited]);

  useEffect(() => {
    const reduced =
      reduceMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function finish() {
      if (finished.current) return;
      finished.current = true;
      if (reduced) {
        onExitedRef.current();
        return;
      }
      setExiting(true);
    }

    finishRef.current = finish;
    const timer = window.setTimeout(finish, reduced ? 700 : osMeta[os].bootMs);
    function onKey(event: KeyboardEvent) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        finish();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, [os, reduceMotion]);

  return (
    <div
      className={cn("boot", exiting && "is-exiting")}
      data-os={os}
      onClick={() => finishRef.current()}
      onAnimationEnd={(event) => {
        if (event.target !== event.currentTarget || !exiting) return;
        onExitedRef.current();
      }}
      role="button"
      tabIndex={0}
      aria-label={`${osMeta[os].name} startup. Activate to skip.`}
    >
      {os === "windows" ? (
        <div className="boot-center">
          <Logo animated size={92} />
          <div className="boot-copy">
            <h1>Windows 12</h1>
            <p>Preview</p>
          </div>
          <div className="boot-track" aria-hidden>
            <span />
          </div>
        </div>
      ) : null}
      {os === "mac" ? (
        <div className="boot-center">
          <AppleMark size={88} className="apple-mark" />
          <div className="mac-track" aria-hidden>
            <span />
          </div>
        </div>
      ) : null}
      {os === "linux" ? (
        <>
          <div className="sysd-log" aria-hidden>
            {bootLog.map((line, index) => (
              <p key={line.text} style={{ "--i": index } as CSSProperties}>
                {line.ok ? <span className="ok">[  OK  ]</span> : <span className="pad" />} {line.text}
              </p>
            ))}
          </div>
          <div className="plymouth">
            <TuxMark size={96} />
            <h1>Linux</h1>
            <div className="ply-dots" aria-hidden>
              {[0, 1, 2, 3, 4].map((index) => (
                <span key={index} style={{ "--i": index } as CSSProperties} />
              ))}
            </div>
          </div>
        </>
      ) : null}
      <p className="boot-hint">Click or press Enter to skip</p>
    </div>
  );
}
