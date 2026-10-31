"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useDesktop } from "@/components/desktop/desktop-context";
import { Slider } from "@/components/desktop/mac/ControlCenter";
import {
  AppleMark,
  BatteryIcon,
  BluetoothIcon,
  ChevronIcon,
  GearIcon,
  LockIcon,
  Logo,
  MoonIcon,
  PowerIcon,
  SunIcon,
  VolumeIcon,
  WifiIcon,
} from "@/components/icons";
import { cn } from "@/lib/cn";

const powerModes = ["Balanced", "Performance", "Power Saver"];

export function SystemMenu() {
  const { volume, setVolume, brightness, setBrightness, openApp, sleep, restart, requestOs } =
    useDesktop();
  const [powerOpen, setPowerOpen] = useState(false);
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(false);
  const [night, setNight] = useState(false);
  const [dark, setDark] = useState(true);
  const [airplane, setAirplane] = useState(false);
  const [mode, setMode] = useState(0);

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 px-2 text-sm">
          <BatteryIcon />
          86%
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            className="qs-icon-btn"
            aria-label="Settings"
            onClick={() => openApp("settings")}
          >
            <GearIcon />
          </button>
          <button type="button" className="qs-icon-btn" aria-label="Lock screen" onClick={sleep}>
            <LockIcon />
          </button>
          <button
            type="button"
            className={cn("qs-icon-btn", powerOpen && "is-on")}
            aria-label="Power options"
            aria-expanded={powerOpen}
            onClick={() => setPowerOpen((value) => !value)}
          >
            <PowerIcon />
          </button>
        </div>
      </div>
      {powerOpen ? (
        <div className="mt-3 rounded-2xl bg-white/5 p-1.5">
          <button type="button" className="menu-item" onClick={sleep}>
            Suspend
          </button>
          <button type="button" className="menu-item" onClick={restart}>
            Restart…
          </button>
          <button type="button" className="menu-item" onClick={restart}>
            Power Off…
          </button>
          <hr className="my-1 border-white/10" />
          <button
            type="button"
            className="menu-item flex items-center gap-2.5"
            onClick={() => requestOs("windows")}
          >
            <Logo size={13} />
            Switch to Windows…
          </button>
          <button
            type="button"
            className="menu-item flex items-center gap-2.5"
            onClick={() => requestOs("mac")}
          >
            <AppleMark size={14} />
            Switch to macOS…
          </button>
        </div>
      ) : null}
      <div className="mt-4 grid gap-3 px-1">
        <Slider
          icon={<VolumeIcon muted={volume === 0} />}
          value={volume}
          onChange={setVolume}
          label="Volume"
        />
        <Slider
          icon={<SunIcon />}
          value={brightness}
          min={20}
          onChange={setBrightness}
          label="Brightness"
        />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <QsToggle
          on={wifi}
          icon={<WifiIcon off={!wifi} />}
          label="Wi‑Fi"
          sub={wifi ? "Home" : "Off"}
          chevron
          onClick={() => setWifi((value) => !value)}
        />
        <QsToggle
          on={bluetooth}
          icon={<BluetoothIcon />}
          label="Bluetooth"
          sub={bluetooth ? "On" : "Off"}
          chevron
          onClick={() => setBluetooth((value) => !value)}
        />
        <QsToggle
          on
          icon={<PowerIcon />}
          label="Power Mode"
          sub={powerModes[mode]}
          chevron
          onClick={() => setMode((value) => (value + 1) % powerModes.length)}
        />
        <QsToggle
          on={night}
          icon={<SunIcon />}
          label="Night Light"
          onClick={() => setNight((value) => !value)}
        />
        <QsToggle
          on={dark}
          icon={<MoonIcon />}
          label="Dark Style"
          onClick={() => setDark((value) => !value)}
        />
        <QsToggle
          on={airplane}
          icon={<AirplaneGlyph />}
          label="Airplane Mode"
          onClick={() => setAirplane((value) => !value)}
        />
      </div>
    </div>
  );
}

function QsToggle({
  on,
  icon,
  label,
  sub,
  chevron = false,
  onClick,
}: {
  on: boolean;
  icon: ReactNode;
  label: string;
  sub?: string;
  chevron?: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" className={cn("qs-toggle", on && "is-on")} aria-pressed={on} onClick={onClick}>
      <span className="shrink-0">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-semibold">{label}</span>
        {sub ? <span className="block truncate text-[11px] opacity-70">{sub}</span> : null}
      </span>
      {chevron ? (
        <span className="opacity-60">
          <ChevronIcon />
        </span>
      ) : null}
    </button>
  );
}

function AirplaneGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M10.5 3.5c0-.8 1.5-.8 1.5 0v6l8 4.5v2l-8-2.5v4l2 1.5v1.5l-2.8-.8-2.7.8V18.5l2-1.5v-4l-8 2.5v-2l8-4.5v-6Z"
        fill="currentColor"
      />
    </svg>
  );
}
