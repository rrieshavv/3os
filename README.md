# Windows 12 Preview

A browser desktop that boots like a real machine. It starts as **Windows 12**, and you can shut down and restart into **macOS** or **Linux**. Wallpaper, notes, and files stay in the session.

Glass panels, a few everyday apps, and a full switch between three operating systems. Nothing here leaves the tab.

## Run it

This repo uses [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Click or press Enter to skip boot and lock screens.

```bash
pnpm build    # production build
pnpm start    # serve the build
pnpm lint     # eslint
```

## Switch operating system

Each switch shuts the current desktop down and boots the one you pick.

- Welcome window → **Try macOS** / **Try Linux** / **Try Windows**
- Settings → **Operating system**
- Windows Start → power menu
- Apple menu (macOS)
- Linux system menu → power
- Terminal: `switch windows`, `switch mac`, or `switch linux`

## What’s in each desktop

**Windows 12** — centered taskbar, Start search, quick settings, and the usual window chrome.

**macOS** — menu bar, Control Center, Spotlight (`⌘ Space`), Launchpad, a magnifying Dock, and traffic-light windows. `⌘Q` / `⌘W` close, `⌘M` minimizes, `⌘N` opens Finder, `⌘,` opens System Settings.

**Linux** — GNOME-style top bar, Dash on the left, Activities overview (`Super`), and a system menu with Wi‑Fi, brightness, and power.

Boot, lock, and shutdown look different on each system too.

## Apps

| App | What it does |
| --- | --- |
| Welcome | Tour of the current desktop, plus buttons to try another OS |
| Files / Finder | Folders, notes, and wallpapers you can set |
| Notepad / TextEdit | A session-only text editor |
| Terminal | A small shell (`help` lists commands) |
| Settings | Wallpaper, accent, reduce motion, and OS switch |

Pictures in Files can be set as wallpaper. Volume and brightness live in quick settings / Control Center / the GNOME system menu.

## Project shape

```
app/                  Next.js App Router, global CSS
components/apps/      Welcome, Files, Notepad, Terminal, Settings
components/desktop/   Shell, windows, lock/boot/shutdown
components/desktop/mac/
components/desktop/linux/
lib/                  Apps, files, OS metadata, types
```

The whole desktop is a client tree rooted at `components/desktop/Desktop.tsx`. OS chrome, insets, and copy live in `lib/os.ts`.
