"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Files } from "@/components/apps/Files";
import { Notepad } from "@/components/apps/Notepad";
import { Settings } from "@/components/apps/Settings";
import { Terminal } from "@/components/apps/Terminal";
import { Welcome } from "@/components/apps/Welcome";
import { BootScreen } from "@/components/desktop/BootScreen";
import {
  DesktopContext,
  type DesktopContextValue,
} from "@/components/desktop/desktop-context";
import { DesktopIcons, getDesktopIcons } from "@/components/desktop/DesktopIcons";
import { LinuxShell } from "@/components/desktop/linux/LinuxShell";
import { LockScreen } from "@/components/desktop/LockScreen";
import { MacShell } from "@/components/desktop/mac/MacShell";
import type { ShellProps } from "@/components/desktop/shell-props";
import { ShutdownScreen } from "@/components/desktop/ShutdownScreen";
import { SwitchDialog } from "@/components/desktop/SwitchDialog";
import { Taskbar } from "@/components/desktop/Taskbar";
import { Wallpaper } from "@/components/desktop/Wallpaper";
import { WindowFrame } from "@/components/desktop/WindowFrame";
import { getApp } from "@/lib/apps";
import { cn } from "@/lib/cn";
import { osMeta } from "@/lib/os";
import type {
  AccentId,
  AppId,
  Flyout,
  FolderId,
  OsId,
  Phase,
  WallpaperId,
  WindowState,
} from "@/lib/types";

export function Desktop() {
  const [os, setOs] = useState<OsId>("windows");
  const [pendingOs, setPendingOs] = useState<OsId | null>(null);
  const [phase, setPhase] = useState<Phase>("boot");
  const [unlocking, setUnlocking] = useState(false);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [flyout, setFlyout] = useState<Flyout>(null);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [wallpaper, setWallpaper] = useState<WallpaperId>("aurora");
  const [accent, setAccent] = useState<AccentId>("cyan");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [volume, setVolume] = useState(72);
  const [brightness, setBrightness] = useState(100);
  const [filesFolder, setFilesFolder] = useState<FolderId>("this-pc");
  const [notepadName, setNotepadName] = useState("Untitled.txt");
  const [notepadText, setNotepadText] = useState("");
  const [switchTarget, setSwitchTarget] = useState<OsId | null>(null);
  const welcomed = useRef(false);
  const signing = useRef(false);
  const metaSolo = useRef(false);

  const openApp = useCallback(
    (id: AppId, folder?: FolderId) => {
      if (folder) setFilesFolder(folder);
      setFlyout(null);
      const insets = osMeta[os].insets;
      setWindows((prev) => {
        const z = prev.reduce((max, win) => Math.max(max, win.z), 10) + 1;
        const existing = prev.find((win) => win.id === id);
        if (existing) {
          return prev.map((win) => (win.id === id ? { ...win, minimized: false, z } : win));
        }
        const spec = getApp(id);
        const areaX = insets.left;
        const areaY = insets.top;
        const areaW = Math.max(320, window.innerWidth - insets.left - insets.right);
        const areaH = Math.max(280, window.innerHeight - insets.top - insets.bottom);
        const offset = prev.length * 26;
        const lead = os === "mac" ? 24 : 108;
        const width = Math.min(spec.width, areaW - 16);
        const height = Math.min(spec.height, areaH - 16);
        const x = Math.max(
          areaX,
          Math.min(areaX + Math.max(lead, spec.x) + offset, areaX + areaW - width),
        );
        const y = Math.max(areaY, Math.min(areaY + spec.y + offset, areaY + areaH - height));
        return [...prev, { id, x, y, width, height, z, minimized: false, maximized: false }];
      });
    },
    [os],
  );

  const openNote = useCallback(
    (name: string, body: string) => {
      setNotepadName(name);
      setNotepadText(body);
      openApp("notepad");
    },
    [openApp],
  );

  const focusApp = useCallback((id: AppId) => {
    setWindows((prev) => {
      const top = prev.reduce((max, win) => Math.max(max, win.z), 0);
      const target = prev.find((win) => win.id === id);
      if (!target || (target.z === top && !target.minimized)) return prev;
      return prev.map((win) => (win.id === id ? { ...win, z: top + 1, minimized: false } : win));
    });
  }, []);

  const closeApp = useCallback((id: AppId) => {
    setWindows((prev) => prev.filter((win) => win.id !== id));
  }, []);

  const minimizeApp = useCallback((id: AppId) => {
    setWindows((prev) => prev.map((win) => (win.id === id ? { ...win, minimized: true } : win)));
  }, []);

  const toggleMaximize = useCallback((id: AppId) => {
    setWindows((prev) =>
      prev.map((win) =>
        win.id === id ? { ...win, maximized: !win.maximized, minimized: false } : win,
      ),
    );
  }, []);

  const moveApp = useCallback(
    (id: AppId, x: number, y: number) => {
      const insets = osMeta[os].insets;
      setWindows((prev) =>
        prev.map((win) => {
          if (win.id !== id) return win;
          const nextX = Math.min(
            Math.max(x, insets.left - win.width + 140),
            window.innerWidth - insets.right - 80,
          );
          const nextY = Math.min(
            Math.max(y, insets.top),
            window.innerHeight - insets.bottom - 48,
          );
          return { ...win, x: nextX, y: nextY };
        }),
      );
    },
    [os],
  );

  const restart = useCallback(() => {
    signing.current = false;
    welcomed.current = false;
    setUnlocking(false);
    setWindows([]);
    setFlyout(null);
    setSelectedIcon(null);
    setPhase("boot");
  }, []);

  const sleep = useCallback(() => {
    signing.current = false;
    setUnlocking(false);
    setFlyout(null);
    setPhase("lock");
  }, []);

  const requestOs = useCallback(
    (target: OsId) => {
      if (target === os) return;
      setFlyout(null);
      setPendingOs(target);
    },
    [os],
  );

  const confirmSwitch = useCallback(() => {
    if (!pendingOs) return;
    setSwitchTarget(pendingOs);
    signing.current = false;
    setPendingOs(null);
    setFlyout(null);
    setSelectedIcon(null);
    setUnlocking(false);
    setPhase("shutdown");
  }, [pendingOs]);

  const finishShutdown = useCallback(() => {
    const target = switchTarget ?? os;
    setSwitchTarget(null);
    welcomed.current = false;
    setWindows([]);
    setOs(target);
    setAccent(osMeta[target].defaultAccent);
    setPhase("boot");
  }, [os, switchTarget]);

  const signIn = useCallback(() => {
    if (signing.current || phase !== "lock") return;
    signing.current = true;
    setUnlocking(true);
    if (!welcomed.current) {
      welcomed.current = true;
      openApp("welcome");
    }
    const reduced =
      reduceMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(
      () => {
        setPhase("desktop");
        setUnlocking(false);
        signing.current = false;
      },
      reduced ? 0 : 620,
    );
  }, [openApp, phase, reduceMotion]);

  useEffect(() => {
    document.title = `${osMeta[os].name} Preview`;
  }, [os]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target;
      const typing = target instanceof Element && Boolean(target.closest("input, textarea"));
      if (event.key === "Meta") {
        metaSolo.current = !event.repeat;
        return;
      }
      metaSolo.current = false;
      if (event.key === "Escape") {
        setFlyout(null);
        setSelectedIcon(null);
        setPendingOs(null);
        return;
      }
      if (phase === "desktop" && os === "mac" && event.metaKey && event.code === "Space") {
        event.preventDefault();
        setFlyout((current) => (current === "spotlight" ? null : "spotlight"));
        return;
      }
      if (phase === "desktop" && os === "mac" && event.metaKey && !event.ctrlKey && !typing) {
        const focused = windows
          .filter((win) => !win.minimized)
          .reduce<(typeof windows)[number] | undefined>(
            (top, win) => (!top || win.z > top.z ? win : top),
            undefined,
          );
        if (event.key === ",") {
          event.preventDefault();
          openApp("settings");
          return;
        }
        if ((event.key === "q" || event.key === "w") && focused) {
          event.preventDefault();
          closeApp(focused.id);
          return;
        }
        if (event.key === "m" && focused) {
          event.preventDefault();
          minimizeApp(focused.id);
          return;
        }
        if (event.key === "n") {
          event.preventDefault();
          openApp(event.shiftKey ? "notepad" : "files");
          return;
        }
      }
      if (event.key !== "Enter" || typing || pendingOs) return;
      if (phase === "lock") {
        event.preventDefault();
        signIn();
        return;
      }
      if (phase === "desktop" && selectedIcon) {
        const icon = getDesktopIcons(os).find((item) => item.id === selectedIcon);
        if (icon) openApp(icon.app, icon.folder);
      }
    }
    function onKeyUp(event: KeyboardEvent) {
      if (event.key !== "Meta" || !metaSolo.current) return;
      metaSolo.current = false;
      if (phase !== "desktop" || pendingOs) return;
      if (os === "windows") setFlyout((current) => (current === "start" ? null : "start"));
      if (os === "linux") {
        setFlyout((current) => (current === "activities" ? null : "activities"));
      }
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [closeApp, minimizeApp, openApp, os, pendingOs, phase, selectedIcon, signIn, windows]);

  useEffect(() => {
    if (!flyout) return;
    function onPointerDown(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("[data-flyout], [data-flyout-toggle]")) return;
      setFlyout(null);
    }
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [flyout]);

  const value = useMemo<DesktopContextValue>(
    () => ({
      os,
      requestOs,
      openApp,
      closeApp,
      notepadName,
      notepadText,
      setNotepadText,
      openNote,
      filesFolder,
      setFilesFolder,
      wallpaper,
      setWallpaper,
      accent,
      setAccent,
      reduceMotion,
      setReduceMotion,
      volume,
      setVolume,
      brightness,
      setBrightness,
      restart,
      sleep,
    }),
    [
      accent,
      brightness,
      closeApp,
      filesFolder,
      notepadName,
      notepadText,
      openApp,
      openNote,
      os,
      reduceMotion,
      requestOs,
      restart,
      sleep,
      volume,
      wallpaper,
    ],
  );

  const topZ = windows.reduce((max, win) => Math.max(max, win.z), 0);
  const showDesktop = phase === "desktop" || phase === "shutdown" || unlocking;
  const shell: ShellProps = {
    flyout,
    setFlyout,
    windows,
    topZ,
    onFocus: focusApp,
    onClose: closeApp,
    onMinimize: minimizeApp,
    onMaximize: toggleMaximize,
  };

  return (
    <DesktopContext.Provider value={value}>
      <div
        className={cn("os relative h-dvh overflow-hidden text-white", reduceMotion && "reduce-motion")}
        data-accent={accent}
        data-wallpaper={wallpaper}
        data-os={os}
        style={{ "--brightness": 0.35 + 0.65 * (brightness / 100) } as CSSProperties}
      >
        <Wallpaper />
        {phase === "boot" || phase === "lock" ? (
          <LockScreen disabled={phase === "boot"} fading={unlocking} onUnlock={signIn} />
        ) : null}
        {showDesktop ? (
          <div className="absolute inset-0 z-10">
            <div
              className={cn(
                "absolute inset-0 z-[1]",
                (flyout === "launchpad" || flyout === "activities") && "invisible",
              )}
              onPointerDown={(event) => {
                const target = event.target;
                if (!(target instanceof Element)) return;
                if (target.closest(".desk-icon, .window")) return;
                setSelectedIcon(null);
              }}
            >
              <DesktopIcons selected={selectedIcon} onSelect={setSelectedIcon} />
              {windows
                .filter((win) => !win.minimized)
                .map((win) => (
                  <WindowFrame
                    key={win.id}
                    id={win.id}
                    x={win.x}
                    y={win.y}
                    width={win.width}
                    height={win.height}
                    z={win.z}
                    focused={win.z === topZ}
                    maximized={win.maximized}
                    onFocus={focusApp}
                    onClose={closeApp}
                    onMinimize={minimizeApp}
                    onMaximize={toggleMaximize}
                    onMove={moveApp}
                  >
                    {win.id === "welcome" ? <Welcome /> : null}
                    {win.id === "files" ? <Files /> : null}
                    {win.id === "notepad" ? <Notepad /> : null}
                    {win.id === "terminal" ? <Terminal /> : null}
                    {win.id === "settings" ? <Settings /> : null}
                  </WindowFrame>
                ))}
            </div>
            {os === "windows" ? <Taskbar {...shell} /> : null}
            {os === "mac" ? <MacShell {...shell} /> : null}
            {os === "linux" ? <LinuxShell {...shell} /> : null}
          </div>
        ) : null}
        {pendingOs ? (
          <SwitchDialog
            target={pendingOs}
            onCancel={() => setPendingOs(null)}
            onConfirm={confirmSwitch}
          />
        ) : null}
        {phase === "shutdown" ? (
          <ShutdownScreen
            os={os}
            target={switchTarget ?? os}
            reduceMotion={reduceMotion}
            onDone={finishShutdown}
          />
        ) : null}
        {phase === "boot" ? (
          <BootScreen os={os} reduceMotion={reduceMotion} onExited={() => setPhase("lock")} />
        ) : null}
        <div className="brightness-veil" aria-hidden />
      </div>
    </DesktopContext.Provider>
  );
}
