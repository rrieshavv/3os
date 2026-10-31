"use client";

import { useDesktop } from "@/components/desktop/desktop-context";
import { OsSwitcher } from "@/components/desktop/OsSwitcher";
import { ThemeControls } from "@/components/desktop/ThemeControls";
import { cn } from "@/lib/cn";
import { osMeta } from "@/lib/os";

export function Settings() {
  const { os, reduceMotion, setReduceMotion } = useDesktop();
  const meta = osMeta[os];

  return (
    <div className="h-full overflow-auto px-6 py-5">
      <h2 className="text-lg font-semibold">{os === "windows" ? "Personalization" : "Appearance"}</h2>
      <p className="mt-1 max-w-md text-sm leading-6 text-white/60">
        Wallpaper, accent, and motion for this preview. Changes stay in the session.
      </p>
      <ThemeControls />
      <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl bg-white/10 px-4 py-3">
        <div>
          <p className="text-sm font-medium">Reduce motion</p>
          <p className="text-xs leading-5 text-white/55">
            Shorten movement and hold the wallpaper still.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={reduceMotion}
          aria-label="Reduce motion"
          className={cn("switch", reduceMotion && "is-on")}
          onClick={() => setReduceMotion(!reduceMotion)}
        >
          <span />
        </button>
      </div>

      <h2 className="mt-8 text-lg font-semibold">Operating system</h2>
      <p className="mt-1 max-w-md text-sm leading-6 text-white/60">
        Pick a desktop. The {meta.deviceWord} shuts down and restarts into the one you choose;
        your wallpaper, notes, and files come along.
      </p>
      <div className="mt-4">
        <OsSwitcher />
      </div>

      <h2 className="mt-8 text-lg font-semibold">About</h2>
      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 rounded-2xl bg-white/10 px-4 py-3 text-sm">
        <dt className="text-white/55">System</dt>
        <dd>{meta.name}</dd>
        <dt className="text-white/55">Version</dt>
        <dd>{meta.version}</dd>
        <dt className="text-white/55">Device name</dt>
        <dd className="font-mono text-[13px]">{meta.device}</dd>
        <dt className="text-white/55">Signed in as</dt>
        <dd>Preview</dd>
      </dl>
      <p className="mt-6 text-xs text-white/40">{meta.name} Preview · this session only</p>
    </div>
  );
}
