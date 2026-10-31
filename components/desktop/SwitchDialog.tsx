"use client";

import { useEffect, useRef } from "react";
import { useDesktop } from "@/components/desktop/desktop-context";
import { OsLogo } from "@/components/icons";
import { osMeta } from "@/lib/os";
import type { OsId } from "@/lib/types";

export function SwitchDialog({
  target,
  onCancel,
  onConfirm,
}: {
  target: OsId;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const { os } = useDesktop();
  const from = osMeta[os];
  const to = osMeta[target];
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    confirmRef.current?.focus();
  }, []);

  return (
    <div
      className="dialog-scrim"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div
        className="dialog glass"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="switch-title"
        aria-describedby="switch-desc"
      >
        <div className="dialog-body">
          <span className="dialog-icon" aria-hidden>
            <OsLogo os={target} size={44} />
          </span>
          <p className="mb-3 text-xs tracking-wide text-white/45 uppercase">
            {from.shortName} → {to.shortName}
          </p>
          <h2 id="switch-title" className="dialog-title">
            Switch to {to.name}?
          </h2>
          <p id="switch-desc" className="dialog-copy">
            {from.shortName} will shut down and this {from.deviceWord} will restart into {to.name}.
            Open windows close. Your wallpaper, notes, and files stay in this session.
          </p>
        </div>
        <div className="dialog-actions">
          <button type="button" className="btn dialog-btn" onClick={onCancel}>
            Cancel
          </button>
          <button
            ref={confirmRef}
            type="button"
            className="btn btn-primary dialog-btn"
            onClick={onConfirm}
          >
            Restart into {to.shortName}
          </button>
        </div>
      </div>
    </div>
  );
}
