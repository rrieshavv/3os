"use client";

import type { CSSProperties, ReactNode } from "react";
import type { AppId } from "@/lib/types";
import { appTitle } from "@/lib/apps";
import { useDesktop } from "@/components/desktop/desktop-context";
import { AppIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import { osMeta } from "@/lib/os";

export function WindowFrame({
  id,
  x,
  y,
  width,
  height,
  z,
  focused,
  maximized,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onMove,
  children,
}: {
  id: AppId;
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;
  focused: boolean;
  maximized: boolean;
  onFocus: (id: AppId) => void;
  onClose: (id: AppId) => void;
  onMinimize: (id: AppId) => void;
  onMaximize: (id: AppId) => void;
  onMove: (id: AppId, x: number, y: number) => void;
  children: ReactNode;
}) {
  const { os, notepadName } = useDesktop();
  const title = id === "notepad" ? notepadName : appTitle(id, os);
  const insets = osMeta[os].insets;
  const horizontal = insets.left + insets.right;
  const vertical = insets.top + insets.bottom;

  const style: CSSProperties = maximized
    ? {
        left: insets.left,
        top: insets.top,
        width: `calc(100vw - ${horizontal}px)`,
        height: `calc(100dvh - ${vertical}px)`,
        zIndex: z,
      }
    : {
        left: x,
        top: y,
        width,
        height,
        zIndex: z,
        maxWidth: `calc(100vw - ${horizontal}px)`,
        maxHeight: `calc(100dvh - ${vertical}px)`,
      };

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("[data-no-drag]")) return;
    event.preventDefault();
    event.stopPropagation();
    onFocus(id);
    if (maximized) return;
    const el = event.currentTarget;
    el.setPointerCapture(event.pointerId);
    const origin = { x, y, px: event.clientX, py: event.clientY };

    function move(ev: PointerEvent) {
      onMove(id, origin.x + ev.clientX - origin.px, origin.y + ev.clientY - origin.py);
    }
    function up() {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
    }
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
  }

  return (
    <section
      className={cn("window glass", focused && "is-focused", maximized && "is-maximized")}
      style={style}
      aria-label={title}
      onPointerDown={(event) => {
        event.stopPropagation();
        onFocus(id);
      }}
    >
      <div
        className="titlebar"
        onPointerDown={onPointerDown}
        onDoubleClick={(event) => {
          if ((event.target as HTMLElement).closest("[data-no-drag]")) return;
          onMaximize(id);
        }}
      >
        {os === "mac" ? (
          <>
            <div className="traffic" data-no-drag>
              <button
                type="button"
                className="tl tl-close"
                aria-label={`Close ${title}`}
                onClick={() => onClose(id)}
              >
                <svg viewBox="0 0 12 12" aria-hidden>
                  <path d="M3.5 3.5l5 5M8.5 3.5l-5 5" />
                </svg>
              </button>
              <button
                type="button"
                className="tl tl-min"
                aria-label={`Minimize ${title}`}
                onClick={() => onMinimize(id)}
              >
                <svg viewBox="0 0 12 12" aria-hidden>
                  <path d="M3 6h6" />
                </svg>
              </button>
              <button
                type="button"
                className="tl tl-zoom"
                aria-label={maximized ? `Restore ${title}` : `Zoom ${title}`}
                onClick={() => onMaximize(id)}
              >
                <svg viewBox="0 0 12 12" aria-hidden>
                  <path d="M3.2 8.8V3.2h5.6M8.8 3.2 3.2 8.8" />
                </svg>
              </button>
            </div>
            <span className="title-center">
              <AppIcon id={id} size={16} />
              <span className="truncate text-[13px] font-semibold">{title}</span>
            </span>
          </>
        ) : null}
        {os === "linux" ? (
          <>
            <span className="title-center">
              <span className="truncate text-sm font-bold">{title}</span>
            </span>
            <div className="hb-buttons" data-no-drag>
              <button
                type="button"
                className="hb-btn"
                aria-label={`Minimize ${title}`}
                onClick={() => onMinimize(id)}
              >
                <svg viewBox="0 0 16 16" aria-hidden>
                  <path d="M4 11h8" />
                </svg>
              </button>
              <button
                type="button"
                className="hb-btn"
                aria-label={maximized ? `Restore ${title}` : `Maximize ${title}`}
                onClick={() => onMaximize(id)}
              >
                <svg viewBox="0 0 16 16" aria-hidden>
                  <rect x="4" y="4" width="8" height="8" rx="1" />
                </svg>
              </button>
              <button
                type="button"
                className="hb-btn hb-close"
                aria-label={`Close ${title}`}
                onClick={() => onClose(id)}
              >
                <svg viewBox="0 0 16 16" aria-hidden>
                  <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" />
                </svg>
              </button>
            </div>
          </>
        ) : null}
        {os === "windows" ? (
          <>
            <AppIcon id={id} size={18} />
            <span className="min-w-0 flex-1 truncate text-sm font-medium">{title}</span>
            <button
              type="button"
              data-no-drag
              className="win-btn"
              aria-label={`Minimize ${title}`}
              onClick={() => onMinimize(id)}
            >
              <span className="block h-px w-3 bg-white" />
            </button>
            <button
              type="button"
              data-no-drag
              className="win-btn"
              aria-label={maximized ? `Restore ${title}` : `Maximize ${title}`}
              onClick={() => onMaximize(id)}
            >
              <span
                className={cn(
                  "block h-2.5 w-2.5 border border-white",
                  maximized ? "rounded-[2px]" : "rounded-[1px]",
                )}
              />
            </button>
            <button
              type="button"
              data-no-drag
              className="win-btn win-close"
              aria-label={`Close ${title}`}
              onClick={() => onClose(id)}
            >
              <span aria-hidden className="text-sm leading-none">
                ×
              </span>
            </button>
          </>
        ) : null}
      </div>
      <div className="window-body">{children}</div>
    </section>
  );
}
