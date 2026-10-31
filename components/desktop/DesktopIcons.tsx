"use client";

import { useDesktop } from "@/components/desktop/desktop-context";
import { AppIcon, type IconId } from "@/components/icons";
import { cn } from "@/lib/cn";
import { osMeta } from "@/lib/os";
import type { AppId, FolderId, OsId } from "@/lib/types";

export type DesktopIcon = {
  id: string;
  label: string;
  icon: IconId;
  app: AppId;
  folder?: FolderId;
};

export function getDesktopIcons(os: OsId): DesktopIcon[] {
  const rootIcon: IconId = os === "mac" ? "disk" : os === "linux" ? "home" : "pc";
  return [
    { id: "root", label: osMeta[os].rootLabel, icon: rootIcon, app: "files", folder: "this-pc" },
    { id: "documents", label: "Documents", icon: "files", app: "files", folder: "documents" },
    { id: "welcome", label: "Welcome", icon: "welcome", app: "welcome" },
  ];
}

export function DesktopIcons({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (id: string | null) => void;
}) {
  const { os, openApp } = useDesktop();

  return (
    <div className="shell-icons absolute flex flex-col gap-1">
      {getDesktopIcons(os).map((icon) => (
        <button
          key={icon.id}
          type="button"
          className={cn(
            "desk-icon flex w-[92px] flex-col items-center gap-1.5 rounded-xl px-2 py-2",
            selected === icon.id ? "is-selected" : "hover:bg-white/10",
          )}
          onClick={(event) => {
            event.stopPropagation();
            onSelect(icon.id);
          }}
          onDoubleClick={(event) => {
            event.stopPropagation();
            openApp(icon.app, icon.folder);
          }}
        >
          <AppIcon id={icon.icon} size={48} />
          <span className="desk-label">{icon.label}</span>
        </button>
      ))}
    </div>
  );
}
