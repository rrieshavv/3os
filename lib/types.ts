export type OsId = "windows" | "mac" | "linux";

export type Phase = "boot" | "lock" | "desktop" | "shutdown";

export type AppId = "welcome" | "files" | "notepad" | "terminal" | "settings";

export type WallpaperId = "aurora" | "dusk" | "dawn";

export type AccentId = "cyan" | "violet" | "amber";

export type FolderId = "this-pc" | "desktop" | "documents" | "pictures";

export type Flyout =
  | "start"
  | "quick"
  | "calendar"
  | "apple"
  | "appmenu"
  | "control"
  | "spotlight"
  | "launchpad"
  | "activities"
  | "system"
  | null;

export type WindowState = {
  id: AppId;
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
};

export type AppSpec = {
  id: AppId;
  title: string;
  width: number;
  height: number;
  x: number;
  y: number;
};

export type FileKind = "text" | "image";

export type VirtualFile = {
  id: string;
  name: string;
  folder: Exclude<FolderId, "this-pc">;
  kind: FileKind;
  body?: string;
  hue?: WallpaperId;
};
