import type { AccentId, OsId, WallpaperId } from "@/lib/types";

export type OsMeta = {
  id: OsId;
  name: string;
  shortName: string;
  version: string;
  device: string;
  deviceWord: string;
  rootLabel: string;
  homePath: string;
  defaultAccent: AccentId;
  wallpapers: Record<WallpaperId, string>;
  accents: Record<AccentId, { label: string; background: string }>;
  insets: { top: number; right: number; bottom: number; left: number };
  bootMs: number;
};

export const osList: OsId[] = ["windows", "mac", "linux"];

export const osMeta: Record<OsId, OsMeta> = {
  windows: {
    id: "windows",
    name: "Windows 12",
    shortName: "Windows",
    version: "Preview · build 27000",
    device: "PREVIEW-PC",
    deviceWord: "PC",
    rootLabel: "This PC",
    homePath: "C:\\Users\\Preview",
    defaultAccent: "cyan",
    wallpapers: { aurora: "Aurora", dusk: "Dusk", dawn: "Dawn" },
    accents: {
      cyan: { label: "Cyan", background: "linear-gradient(135deg, #5ee7ff, #8b7cff)" },
      violet: { label: "Violet", background: "linear-gradient(135deg, #d4c4ff, #f0abfc)" },
      amber: { label: "Amber", background: "linear-gradient(135deg, #fbbf24, #fb7185)" },
    },
    insets: { top: 8, right: 8, bottom: 84, left: 8 },
    bootMs: 4300,
  },
  mac: {
    id: "mac",
    name: "macOS",
    shortName: "macOS",
    version: "Sequoia 15.1",
    device: "Preview's MacBook Pro",
    deviceWord: "Mac",
    rootLabel: "Macintosh HD",
    homePath: "/Users/preview",
    defaultAccent: "cyan",
    wallpapers: { aurora: "Sequoia", dusk: "Sonoma", dawn: "Ventura" },
    accents: {
      cyan: { label: "Blue", background: "linear-gradient(135deg, #0a84ff, #5e5ce6)" },
      violet: { label: "Purple", background: "linear-gradient(135deg, #bf5af2, #ff375f)" },
      amber: { label: "Orange", background: "linear-gradient(135deg, #ff9f0a, #ff453a)" },
    },
    insets: { top: 36, right: 8, bottom: 96, left: 8 },
    bootMs: 4300,
  },
  linux: {
    id: "linux",
    name: "Linux",
    shortName: "Linux",
    version: "Kernel 6.11 · GNOME 47",
    device: "preview-laptop",
    deviceWord: "machine",
    rootLabel: "Home",
    homePath: "/home/preview",
    defaultAccent: "amber",
    wallpapers: { aurora: "Noble", dusk: "Jammy", dawn: "Fedora" },
    accents: {
      cyan: { label: "Blue", background: "linear-gradient(135deg, #3584e4, #62a0ea)" },
      violet: { label: "Purple", background: "linear-gradient(135deg, #9141ac, #c061cb)" },
      amber: { label: "Orange", background: "linear-gradient(135deg, #e95420, #f7a35c)" },
    },
    insets: { top: 40, right: 8, bottom: 8, left: 80 },
    bootMs: 4800,
  },
};
