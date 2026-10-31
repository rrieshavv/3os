import type { AppId, AppSpec, OsId } from "@/lib/types";

export const apps: AppSpec[] = [
  { id: "welcome", title: "Welcome", width: 760, height: 470, x: 140, y: 40 },
  { id: "files", title: "Files", width: 820, height: 520, x: 110, y: 28 },
  { id: "notepad", title: "Notepad", width: 680, height: 480, x: 180, y: 60 },
  { id: "terminal", title: "Terminal", width: 720, height: 440, x: 220, y: 90 },
  { id: "settings", title: "Settings", width: 720, height: 560, x: 160, y: 36 },
];

export function getApp(id: AppId) {
  const app = apps.find((item) => item.id === id);
  if (!app) {
    throw new Error(`Unknown app: ${id}`);
  }
  return app;
}

export function appTitle(id: AppId, os: OsId) {
  if (os === "mac") {
    if (id === "files") return "Finder";
    if (id === "settings") return "System Settings";
    if (id === "notepad") return "TextEdit";
  }
  if (os === "linux" && id === "notepad") return "Text Editor";
  return getApp(id).title;
}
