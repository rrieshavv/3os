"use client";

import { useDesktop } from "@/components/desktop/desktop-context";

export function Notepad() {
  const { notepadText, setNotepadText } = useDesktop();

  return (
    <div className="flex h-full flex-col">
      <textarea
        value={notepadText}
        onChange={(event) => setNotepadText(event.target.value)}
        placeholder="Start typing…"
        spellCheck
        className="min-h-0 w-full flex-1 resize-none bg-transparent px-5 py-4 font-mono text-sm leading-7 text-white/90 outline-none placeholder:text-white/30"
      />
      <div className="flex items-center justify-between border-t border-white/10 px-4 py-1.5 text-[11px] text-white/50">
        <span>{notepadText.length} characters</span>
        <span>Kept for this session</span>
      </div>
    </div>
  );
}
