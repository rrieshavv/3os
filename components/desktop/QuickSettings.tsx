"use client";

import { useDesktop } from "@/components/desktop/desktop-context";
import { BatteryIcon, VolumeIcon, WifiIcon } from "@/components/icons";
import { ThemeControls } from "@/components/desktop/ThemeControls";

export function QuickSettings() {
  const { volume, setVolume } = useDesktop();

  return (
    <div className="flyout glass w-[min(320px,calc(100vw-24px))] rounded-2xl p-4">
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-white/10 px-3 py-3">
          <WifiIcon />
          <p className="mt-2 text-sm font-medium">Wi-Fi</p>
          <p className="text-xs text-white/55">Connected</p>
        </div>
        <div className="rounded-2xl bg-white/10 px-3 py-3">
          <BatteryIcon />
          <p className="mt-2 text-sm font-medium">Battery</p>
          <p className="text-xs text-white/55">86%</p>
        </div>
      </div>
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-xs text-white/70">
          <span className="inline-flex items-center gap-2">
            <VolumeIcon muted={volume === 0} />
            Volume
          </span>
          <span className="tabular-nums">{volume}</span>
        </div>
        <input
          className="volume"
          type="range"
          min={0}
          max={100}
          value={volume}
          aria-label="Volume"
          style={{ ["--fill" as string]: `${volume}%` }}
          onChange={(event) => setVolume(Number(event.target.value))}
        />
      </div>
      <ThemeControls dense />
    </div>
  );
}
