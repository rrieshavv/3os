import type { FolderId, VirtualFile } from "@/lib/types";

export const folders: Array<{ id: FolderId; label: string }> = [
  { id: "this-pc", label: "This PC" },
  { id: "desktop", label: "Desktop" },
  { id: "documents", label: "Documents" },
  { id: "pictures", label: "Pictures" },
];

export const files: VirtualFile[] = [
  {
    id: "notes",
    name: "Notes.txt",
    folder: "desktop",
    kind: "text",
    body: "Ideas for the preview\n\n• Keep motion short and soft\n• Let the wallpaper carry the color\n• Open a note straight from Files",
  },
  {
    id: "welcome-note",
    name: "Welcome.txt",
    folder: "documents",
    kind: "text",
    body: "Welcome to this desktop preview.\n\nGlass panels, a few everyday apps, and a full switch between Windows, macOS, and Linux.\n\nOpen Settings → Operating system, or use the power menu, to restart into another desktop. Wallpaper, notes, and files stay in this session.",
  },
  {
    id: "aurora",
    name: "Aurora.png",
    folder: "pictures",
    kind: "image",
    hue: "aurora",
  },
  {
    id: "dusk",
    name: "Dusk.png",
    folder: "pictures",
    kind: "image",
    hue: "dusk",
  },
  {
    id: "dawn",
    name: "Dawn.png",
    folder: "pictures",
    kind: "image",
    hue: "dawn",
  },
];

export function filesIn(folder: FolderId) {
  if (folder === "this-pc") return [];
  return files.filter((file) => file.folder === folder);
}
