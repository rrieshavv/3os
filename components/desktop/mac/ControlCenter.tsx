"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useDesktop } from "@/components/desktop/desktop-context";
import {
  AirdropIcon,
  BluetoothIcon,
  MoonIcon,
  SunIcon,
  VolumeIcon,
  WifiIcon,
} from "@/components/icons";
import { cn } from "@/lib/cn";

export function ControlCenter() {
  const { volume, setVolume, brightness, setBrightness } = useDesktop();
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [airdrop, setAirdrop] = useState(true);
  const [focus, setFocus] = useState(false);

  return (
    <div className="w-[320px]">
      <div className="grid grid-cols-2 gap-2">
        <div className="cc-tile grid gap-3">
          <ToggleRow
            icon={<WifiIcon off={!wifi} />}
            label="Wi‑Fi"
            sub={wifi ? "Home" : "Off"}
            on={wifi}
            onClick={() => setWifi((value) => !value)}
          />
          <ToggleRow
            icon={<BluetoothIcon />}
            label="Bluetooth"
            sub={bluetooth ? "On" : "Off"}
            on={bluetooth}
            onClick={() => setBluetooth((value) => !value)}
          />
          <ToggleRow
            icon={<AirdropIcon />}
            label="AirDrop"
            sub={airdrop ? "Contacts Only" : "Off"}
            on={airdrop}
            onClick={() => setAirdrop((value) => !value)}
          />
        </div>
        <div className="grid gap-2">
          <button
            type="button"
            className={cn("cc-tile flex items-center gap-3 text-left", focus && "is-on")}
            aria-pressed={focus}
            onClick={() => setFocus((value) => !value)}
          >
            <span className="cc-dot">
              <MoonIcon />
            </span>
            <span>
              <span className="block text-[13px] font-medium">Focus</span>
              <span className="block text-[11px] opacity-60">
                {focus ? "Do Not Disturb" : "Off"}
              </span>
            </span>
          </button>
          <div className="grid grid-cols-2 gap-2">
            <div className="cc-tile cc-small">
              <span className="block text-[11px] leading-tight font-medium">Stage Manager</span>
            </div>
            <div className="cc-tile cc-small">
              <span className="block text-[11px] leading-tight font-medium">Screen Mirroring</span>
            </div>
          </div>
        </div>
      </div>
      <div className="cc-tile mt-2">
        <p className="mb-2 text-[13px] font-medium">Display</p>
        <Slider
          icon={<SunIcon />}
          value={brightness}
          min={20}
          onChange={setBrightness}
          label="Display brightness"
        />
      </div>
      <div className="cc-tile mt-2">
        <p className="mb-2 text-[13px] font-medium">Sound</p>
        <Slider
          icon={<VolumeIcon muted={volume === 0} />}
          value={volume}
          onChange={setVolume}
          label="Sound volume"
        />
      </div>
    </div>
  );
}

function ToggleRow({
  icon,
  label,
  sub,
  on,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  sub: string;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="flex items-center gap-3 text-left"
      aria-pressed={on}
      onClick={onClick}
    >
      <span className={cn("cc-dot", on && "is-on")}>{icon}</span>
      <span>
        <span className="block text-[13px] font-medium">{label}</span>
        <span className="block text-[11px] opacity-60">{sub}</span>
      </span>
    </button>
  );
}

export function Slider({
  icon,
  value,
  min = 0,
  onChange,
  label,
}: {
  icon: ReactNode;
  value: number;
  min?: number;
  onChange: (value: number) => void;
  label: string;
}) {
  const fill = ((value - min) / (100 - min)) * 100;
  return (
    <div className="relative flex items-center">
      <span className="pointer-events-none absolute left-2 z-10 text-black/70">{icon}</span>
      <input
        className="volume cc-slider"
        type="range"
        min={min}
        max={100}
        value={value}
        aria-label={label}
        style={{ ["--fill" as string]: `${fill}%` }}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}
