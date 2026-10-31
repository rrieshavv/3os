"use client";

import { useEffect, useRef, useState } from "react";
import { useDesktop } from "@/components/desktop/desktop-context";
import { apps, appTitle } from "@/lib/apps";
import { files, folders } from "@/lib/files";
import { osMeta } from "@/lib/os";
import type { AppId, OsId } from "@/lib/types";

type Line = { id: number; text: string; kind: "in" | "out" | "err" };

function promptFor(os: OsId) {
  if (os === "windows") return "PS C:\\Users\\Preview>";
  if (os === "mac") return "preview@MacBook-Pro ~ %";
  return "preview@preview-laptop:~$";
}

function intro(os: OsId) {
  if (os === "windows") {
    return ["Windows PowerShell", "Copyright (C) Microsoft Corporation. All rights reserved.", "", "Type 'help' to see what this preview can do.", ""];
  }
  if (os === "mac") {
    return [`Last login: ${new Date().toDateString()} on ttys000`, "Type 'help' to see what this preview can do.", ""];
  }
  return ["Welcome to Linux (GNU/Linux 6.11.0 x86_64)", "", " * Type 'help' to see what this preview can do.", ""];
}

const helpText = [
  "Available commands:",
  "  help                 show this list",
  "  ls [folder]          list folders or files",
  "  cat <file>           print a text file",
  "  open <app>           open Files, Notepad, Terminal, Settings, Welcome",
  "  switch <os>          restart into windows, mac, or linux",
  "  neofetch             show system info",
  "  whoami · hostname · pwd · date · uname · echo · history · clear · exit",
];

export function Terminal() {
  const { os, openApp, closeApp, requestOs, volume, brightness, wallpaper, accent } = useDesktop();
  const meta = osMeta[os];
  const prompt = promptFor(os);
  const [lines, setLines] = useState<Line[]>(() =>
    intro(os).map((text, index) => ({ id: index, text, kind: "out" })),
  );
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const nextId = useRef(1000);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const started = useRef(0);

  useEffect(() => {
    started.current = Date.now();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  function emit(kind: Line["kind"], ...texts: string[]) {
    const items = texts
      .flatMap((text) => text.split("\n"))
      .map((text) => ({ id: nextId.current++, text, kind }));
    setLines((prev) => [...prev, ...items]);
  }

  function notFound(name: string) {
    if (os === "windows") {
      return `${name} : The term '${name}' is not recognized as the name of a cmdlet, function, script file, or operable program.`;
    }
    if (os === "mac") return `zsh: command not found: ${name}`;
    return `${name}: command not found`;
  }

  function run(raw: string) {
    const cmd = raw.trim();
    emit("in", `${prompt} ${cmd}`);
    if (!cmd) return;
    setHistory((prev) => [cmd, ...prev].slice(0, 50));
    setCursor(-1);
    const [name, ...rest] = cmd.split(/\s+/);
    const lower = name.toLowerCase();
    const arg = rest.join(" ");

    switch (lower) {
      case "help":
      case "?":
        emit("out", ...helpText);
        return;
      case "clear":
      case "cls":
        setLines([]);
        return;
      case "ls":
      case "dir": {
        const target = arg.toLowerCase().replace(/^~\/?/, "").replace(/\/$/, "");
        if (!target) {
          emit(
            "out",
            folders
              .filter((folder) => folder.id !== "this-pc")
              .map((folder) => `${folder.label}/`)
              .join("  "),
          );
          return;
        }
        const folder = folders.find((item) => item.label.toLowerCase() === target);
        if (!folder || folder.id === "this-pc") {
          emit("err", `ls: cannot access '${arg}': No such file or directory`);
          return;
        }
        const entries = files.filter((file) => file.folder === folder.id);
        emit("out", entries.length ? entries.map((file) => file.name).join("  ") : "(empty)");
        return;
      }
      case "cat":
      case "type": {
        const file = files.find((item) => item.name.toLowerCase() === arg.toLowerCase());
        if (!file) {
          emit("err", `${lower}: ${arg || "<file>"}: No such file or directory`);
          return;
        }
        if (file.kind !== "text") {
          emit("err", `${lower}: ${file.name}: binary file (use Files to preview it)`);
          return;
        }
        emit("out", file.body ?? "");
        return;
      }
      case "open":
      case "start": {
        const needle = arg.toLowerCase();
        const app = apps.find(
          (item) =>
            item.id === needle ||
            item.title.toLowerCase() === needle ||
            appTitle(item.id, os).toLowerCase() === needle,
        );
        if (!app) {
          emit("err", `open: no app named '${arg}'. Try: ${apps.map((item) => item.id).join(", ")}`);
          return;
        }
        emit("out", `Opening ${appTitle(app.id as AppId, os)}…`);
        openApp(app.id);
        return;
      }
      case "switch": {
        const needle = arg.toLowerCase();
        const target: OsId | null =
          needle === "windows" || needle === "win"
            ? "windows"
            : needle === "mac" || needle === "macos" || needle === "osx"
              ? "mac"
              : needle === "linux" || needle === "ubuntu" || needle === "gnome"
                ? "linux"
                : null;
        if (!target) {
          emit("err", "usage: switch <windows|mac|linux>");
          return;
        }
        if (target === os) {
          emit("out", `Already running ${meta.name}.`);
          return;
        }
        emit("out", `Preparing to restart into ${osMeta[target].name}…`);
        requestOs(target);
        return;
      }
      case "neofetch":
      case "fastfetch":
      case "systeminfo": {
        const uptime = Math.max(1, Math.round((Date.now() - started.current) / 1000));
        emit(
          "out",
          `preview@${meta.device}`,
          "-".repeat(`preview@${meta.device}`.length),
          `OS:         ${meta.name} ${meta.version}`,
          `Host:       ${meta.device}`,
          `Kernel:     ${os === "windows" ? "NT 12.0" : os === "mac" ? "Darwin 24.1.0" : "6.11.0-generic"}`,
          `Uptime:     ${uptime}s`,
          `Shell:      ${os === "windows" ? "pwsh 7.4" : os === "mac" ? "zsh 5.9" : "bash 5.2"}`,
          `DE:         ${os === "windows" ? "Windows Shell" : os === "mac" ? "Aqua" : "GNOME 47"}`,
          `Wallpaper:  ${meta.wallpapers[wallpaper]}`,
          `Accent:     ${meta.accents[accent].label}`,
          `Volume:     ${volume}%`,
          `Brightness: ${brightness}%`,
          `Memory:     3.1 GiB / 16 GiB`,
        );
        return;
      }
      case "whoami":
        emit("out", "preview");
        return;
      case "hostname":
        emit("out", meta.device);
        return;
      case "pwd":
        emit("out", meta.homePath);
        return;
      case "date":
        emit("out", new Date().toString());
        return;
      case "uname":
        emit(
          "out",
          os === "windows"
            ? "Windows_NT PREVIEW-PC 12.0 x86_64"
            : os === "mac"
              ? "Darwin MacBook-Pro 24.1.0 arm64"
              : "Linux preview-laptop 6.11.0-generic x86_64 GNU/Linux",
        );
        return;
      case "ver":
        emit("out", `${meta.name} [${meta.version}]`);
        return;
      case "echo":
        emit("out", arg);
        return;
      case "history":
        emit("out", ...[cmd, ...history].reverse().map((item, index) => `  ${index + 1}  ${item}`));
        return;
      case "exit":
      case "logout":
        closeApp("terminal");
        return;
      default:
        emit("err", notFound(name));
    }
  }

  return (
    <div
      className="terminal"
      onClick={() => inputRef.current?.focus()}
      onKeyDown={(event) => {
        if (event.key === "ArrowUp") {
          event.preventDefault();
          const next = Math.min(cursor + 1, history.length - 1);
          if (history[next] !== undefined) {
            setCursor(next);
            setInput(history[next]);
          }
        } else if (event.key === "ArrowDown") {
          event.preventDefault();
          const next = cursor - 1;
          setCursor(Math.max(next, -1));
          setInput(next >= 0 ? history[next] : "");
        }
      }}
    >
      <div className="term-scroll">
        {lines.map((line) => (
          <pre key={line.id} className={`term-line is-${line.kind}`}>
            {line.text || " "}
          </pre>
        ))}
        <form
          className="term-input-row"
          onSubmit={(event) => {
            event.preventDefault();
            run(input);
            setInput("");
          }}
        >
          <span className="term-prompt">{prompt}</span>
          <input
            ref={inputRef}
            autoFocus
            value={input}
            aria-label="Terminal input"
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            onChange={(event) => setInput(event.target.value)}
          />
        </form>
        <div ref={endRef} />
      </div>
    </div>
  );
}
