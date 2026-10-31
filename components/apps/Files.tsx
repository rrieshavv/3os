"use client";

import { useState } from "react";
import { useDesktop } from "@/components/desktop/desktop-context";
import { FileGlyph } from "@/components/icons";
import { filesIn, folders } from "@/lib/files";
import { cn } from "@/lib/cn";
import { osMeta } from "@/lib/os";
import type { VirtualFile } from "@/lib/types";

export function Files() {
  const { filesFolder } = useDesktop();
  return <FilesPane key={filesFolder} />;
}

function FilesPane() {
  const { os, filesFolder, setFilesFolder, openNote, setWallpaper } = useDesktop();
  const pcLabel = osMeta[os].rootLabel;
  const [selected, setSelected] = useState<string | null>(null);
  const [preview, setPreview] = useState<VirtualFile | null>(null);

  const folder = folders.find((item) => item.id === filesFolder);
  const entries = filesIn(filesFolder);

  const places = os === "linux" ? "Places" : os === "mac" ? "Favorites" : "Navigation";

  return (
    <div className="files-app flex h-full min-h-0">
      <aside className="flex w-44 shrink-0 flex-col gap-1 border-r border-white/10 p-2">
        <p className="files-section">{places}</p>
        {folders.map((item) => (
          <button
            key={item.id}
            type="button"
            className={cn(
              "flex items-center gap-2 rounded-xl px-2 py-1.5 text-left text-sm",
              filesFolder === item.id ? "bg-white/15" : "text-white/75 hover:bg-white/10",
            )}
            onClick={() => setFilesFolder(item.id)}
          >
            <FileGlyph kind="folder" size={18} />
            <span className="truncate">{item.id === "this-pc" ? pcLabel : item.label}</span>
          </button>
        ))}
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3 text-sm">
          <button
            type="button"
            className="text-white/60 hover:text-white"
            onClick={() => {
              setPreview(null);
              setFilesFolder("this-pc");
            }}
          >
            {pcLabel}
          </button>
          {filesFolder !== "this-pc" ? (
            <>
              <span className="text-white/30">/</span>
              <span>{folder?.label}</span>
            </>
          ) : null}
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-4">
          {preview?.hue ? (
            <div className="mx-auto flex max-w-md flex-col gap-4">
              <button
                type="button"
                className="w-fit text-sm text-white/60 hover:text-white"
                onClick={() => setPreview(null)}
              >
                Back
              </button>
              <div className="wall-preview h-56" data-wallpaper={preview.hue} />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{preview.name}</p>
                  <p className="text-xs text-white/55">Picture</p>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    if (preview.hue) setWallpaper(preview.hue);
                  }}
                >
                  Set as wallpaper
                </button>
              </div>
            </div>
          ) : filesFolder === "this-pc" ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(108px,1fr))] gap-3">
              {folders
                .filter((item) => item.id !== "this-pc")
                .map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-2xl px-2 py-4",
                      selected === item.id ? "bg-white/15" : "hover:bg-white/10",
                    )}
                    onDoubleClick={() => setFilesFolder(item.id)}
                    onClick={() => setSelected(item.id)}
                  >
                    <FileGlyph kind="folder" size={42} />
                    <span className="text-xs">{item.label}</span>
                  </button>
                ))}
            </div>
          ) : entries.length === 0 ? (
            <p className="px-2 py-8 text-center text-sm text-white/50">This folder is empty</p>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(108px,1fr))] gap-3">
              {entries.map((file) => (
                <button
                  key={file.id}
                  type="button"
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-2xl px-2 py-4",
                    selected === file.id ? "bg-white/15" : "hover:bg-white/10",
                  )}
                  onClick={() => setSelected(file.id)}
                  onDoubleClick={() => {
                    if (file.kind === "text" && file.body) openNote(file.name, file.body);
                    if (file.kind === "image") setPreview(file);
                  }}
                >
                  <FileGlyph kind={file.kind} size={42} />
                  <span className="w-full truncate text-center text-xs">{file.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
