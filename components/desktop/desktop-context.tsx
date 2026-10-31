"use client";

import { createContext, useContext } from "react";
import type { AccentId, AppId, FolderId, OsId, WallpaperId } from "@/lib/types";

export type DesktopContextValue = {
  os: OsId;
  requestOs: (os: OsId) => void;
  openApp: (id: AppId, folder?: FolderId) => void;
  closeApp: (id: AppId) => void;
  notepadName: string;
  notepadText: string;
  setNotepadText: (value: string) => void;
  openNote: (name: string, body: string) => void;
  filesFolder: FolderId;
  setFilesFolder: (folder: FolderId) => void;
  wallpaper: WallpaperId;
  setWallpaper: (wallpaper: WallpaperId) => void;
  accent: AccentId;
  setAccent: (accent: AccentId) => void;
  reduceMotion: boolean;
  setReduceMotion: (value: boolean) => void;
  volume: number;
  setVolume: (value: number) => void;
  brightness: number;
  setBrightness: (value: number) => void;
  restart: () => void;
  sleep: () => void;
};

export const DesktopContext = createContext<DesktopContextValue | null>(null);

export function useDesktop() {
  const value = useContext(DesktopContext);
  if (!value) {
    throw new Error("useDesktop must be used inside Desktop");
  }
  return value;
}
