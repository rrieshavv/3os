"use client";

import { useEffect, useState } from "react";
import { CalendarGrid } from "@/components/desktop/CalendarFlyout";
import { useDesktop } from "@/components/desktop/desktop-context";
import { ControlCenter } from "@/components/desktop/mac/ControlCenter";
import type { ShellProps } from "@/components/desktop/shell-props";
import {
  AppleMark,
  BatteryIcon,
  ControlCenterIcon,
  SearchIcon,
  WifiIcon,
} from "@/components/icons";
import { appTitle } from "@/lib/apps";
import { cn } from "@/lib/cn";
import { formatMenuBarDate, formatMonth, formatTime } from "@/lib/time";

type MenuItem =
  | { label: string; shortcut?: string; disabled?: boolean; checked?: boolean; onSelect?: () => void }
  | "sep";

const menuNames = ["app", "File", "Edit", "View", "Window", "Help"] as const;
type MenuName = (typeof menuNames)[number];

export function MenuBar({
  flyout,
  setFlyout,
  windows,
  topZ,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
}: ShellProps) {
  const { openApp, requestOs, restart, sleep, notepadName } = useDesktop();
  const [now, setNow] = useState<Date | null>(null);
  const [menu, setMenu] = useState<MenuName>("app");

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const focusedWin = windows.find((win) => !win.minimized && win.z === topZ);
  const focusedId = focusedWin?.id;
  const appName = focusedId ? appTitle(focusedId, "mac") : "Finder";
  const menusOpen = flyout === "apple" || flyout === "appmenu";

  function toggle(next: Exclude<ShellProps["flyout"], null>) {
    setFlyout((current) => (current === next ? null : next));
  }

  function openMenu(name: MenuName) {
    setMenu(name);
    setFlyout("appmenu");
  }

  const appleItems: MenuItem[] = [
    { label: "About This Mac", onSelect: () => openApp("settings") },
    "sep",
    { label: "System Settings…", onSelect: () => openApp("settings") },
    { label: "App Store…", disabled: true },
    "sep",
    { label: "Sleep", onSelect: sleep },
    { label: "Restart…", onSelect: restart },
    "sep",
    { label: "Switch to Windows…", onSelect: () => requestOs("windows") },
    { label: "Switch to Linux…", onSelect: () => requestOs("linux") },
    "sep",
    { label: "Lock Screen", shortcut: "⌃⌘Q", onSelect: sleep },
    { label: "Log Out Preview…", shortcut: "⇧⌘Q", onSelect: sleep },
  ];

  function itemsFor(name: MenuName): MenuItem[] {
    if (name === "app") {
      return [
        { label: `About ${appName}`, onSelect: () => openApp(focusedId ?? "files") },
        "sep",
        { label: "Settings…", shortcut: "⌘,", onSelect: () => openApp("settings") },
        "sep",
        {
          label: `Hide ${appName}`,
          shortcut: "⌘H",
          disabled: !focusedId,
          onSelect: () => focusedId && onMinimize(focusedId),
        },
        { label: "Hide Others", shortcut: "⌥⌘H", disabled: true },
        "sep",
        {
          label: `Quit ${appName}`,
          shortcut: "⌘Q",
          disabled: !focusedId,
          onSelect: () => focusedId && onClose(focusedId),
        },
      ];
    }
    if (name === "File") {
      return [
        { label: "New Finder Window", shortcut: "⌘N", onSelect: () => openApp("files") },
        { label: "New Note", onSelect: () => openApp("notepad") },
        { label: "New Terminal", onSelect: () => openApp("terminal") },
        "sep",
        {
          label: "Close Window",
          shortcut: "⌘W",
          disabled: !focusedId,
          onSelect: () => focusedId && onClose(focusedId),
        },
      ];
    }
    if (name === "Edit") {
      return [
        { label: "Undo", shortcut: "⌘Z", disabled: true },
        { label: "Redo", shortcut: "⇧⌘Z", disabled: true },
        "sep",
        { label: "Cut", shortcut: "⌘X" },
        { label: "Copy", shortcut: "⌘C" },
        { label: "Paste", shortcut: "⌘V" },
        { label: "Select All", shortcut: "⌘A" },
      ];
    }
    if (name === "View") {
      return [
        { label: "as Icons", shortcut: "⌘1", checked: true },
        { label: "as List", shortcut: "⌘2" },
        { label: "as Columns", shortcut: "⌘3" },
        "sep",
        {
          label: focusedWin?.maximized ? "Exit Full Screen" : "Enter Full Screen",
          shortcut: "⌃⌘F",
          disabled: !focusedId,
          onSelect: () => focusedId && onMaximize(focusedId),
        },
      ];
    }
    if (name === "Window") {
      const open: MenuItem[] = windows.map((win) => ({
        label: win.id === "notepad" ? notepadName : appTitle(win.id, "mac"),
        checked: win.id === focusedId,
        onSelect: () => onFocus(win.id),
      }));
      return [
        {
          label: "Minimize",
          shortcut: "⌘M",
          disabled: !focusedId,
          onSelect: () => focusedId && onMinimize(focusedId),
        },
        {
          label: "Zoom",
          disabled: !focusedId,
          onSelect: () => focusedId && onMaximize(focusedId),
        },
        "sep",
        ...(open.length ? open : [{ label: "No open windows", disabled: true }]),
      ];
    }
    return [
      { label: "Welcome Tour", onSelect: () => openApp("welcome") },
      { label: "macOS Help", onSelect: () => openApp("welcome") },
      "sep",
      { label: "Open Terminal", onSelect: () => openApp("terminal") },
    ];
  }

  return (
    <div className="mac-menubar" role="menubar" aria-label="Menu bar">
      <div className="relative">
        <button
          type="button"
          className={cn("mb-item", flyout === "apple" && "is-open")}
          aria-label="Apple menu"
          aria-expanded={flyout === "apple"}
          data-flyout-toggle
          onClick={() => toggle("apple")}
          onMouseEnter={() => menusOpen && setFlyout("apple")}
        >
          <AppleMark size={15} />
        </button>
        {flyout === "apple" ? <Menu items={appleItems} onDone={() => setFlyout(null)} /> : null}
      </div>
      {menuNames.map((name) => {
        const open = flyout === "appmenu" && menu === name;
        return (
          <div key={name} className="relative">
            <button
              type="button"
              className={cn("mb-item", name === "app" && "font-bold", open && "is-open")}
              aria-expanded={open}
              data-flyout-toggle
              onClick={() => (open ? setFlyout(null) : openMenu(name))}
              onMouseEnter={() => menusOpen && openMenu(name)}
            >
              {name === "app" ? appName : name}
            </button>
            {open ? <Menu items={itemsFor(name)} onDone={() => setFlyout(null)} /> : null}
          </div>
        );
      })}
      <div className="mb-status flex items-center gap-0.5">
        <span className="mb-item gap-1.5 text-[12px]" aria-label="Battery 86 percent">
          86%
          <BatteryIcon />
        </span>
        <span className="mb-item" aria-label="Wi-Fi connected">
          <WifiIcon />
        </span>
        <button
          type="button"
          className={cn("mb-item", flyout === "spotlight" && "is-open")}
          aria-label="Spotlight"
          aria-expanded={flyout === "spotlight"}
          data-flyout-toggle
          onClick={() => toggle("spotlight")}
        >
          <SearchIcon size={15} />
        </button>
        <div className="relative">
          <button
            type="button"
            className={cn("mb-item", flyout === "control" && "is-open")}
            aria-label="Control Center"
            aria-expanded={flyout === "control"}
            data-flyout-toggle
            onClick={() => toggle("control")}
          >
            <ControlCenterIcon />
          </button>
          {flyout === "control" ? (
            <div className="mac-popover right-0" data-flyout>
              <ControlCenter />
            </div>
          ) : null}
        </div>
        <div className="relative">
          <button
            type="button"
            className={cn("mb-item tabular-nums", flyout === "calendar" && "is-open")}
            aria-label={now ? `${formatMenuBarDate(now)}, ${formatTime(now)}` : "Clock"}
            aria-expanded={flyout === "calendar"}
            data-flyout-toggle
            onClick={() => toggle("calendar")}
          >
            <span className={cn(!now && "opacity-0")}>
              {now ? `${formatMenuBarDate(now)}\u2002${formatTime(now)}` : "Clock"}
            </span>
          </button>
          {flyout === "calendar" && now ? (
            <div className="mac-popover right-0 w-[300px]" data-flyout>
              <p className="text-sm font-semibold">{formatMonth(now)}</p>
              <CalendarGrid now={now} />
              <p className="mt-3 border-t border-white/10 pt-3 text-xs text-white/50">
                No new notifications
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Menu({ items, onDone }: { items: MenuItem[]; onDone: () => void }) {
  return (
    <div className="mac-menu" role="menu" data-flyout>
      {items.map((item, index) =>
        item === "sep" ? (
          <hr key={`sep-${index}`} />
        ) : (
          <button
            key={item.label}
            type="button"
            role="menuitem"
            className="mi"
            disabled={item.disabled}
            onClick={() => {
              item.onSelect?.();
              onDone();
            }}
          >
            <span className="flex min-w-0 items-center gap-1.5">
              <span className="w-3 text-[11px]">{item.checked ? "✓" : ""}</span>
              <span className="truncate">{item.label}</span>
            </span>
            {item.shortcut ? <kbd>{item.shortcut}</kbd> : null}
          </button>
        ),
      )}
    </div>
  );
}
