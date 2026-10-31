import { cn } from "@/lib/cn";
import type { AppId, OsId } from "@/lib/types";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export type IconId = AppId | "pc" | "disk" | "home" | "finder" | "launchpad" | "trash";

export function Logo({
  size = 72,
  animated = false,
}: {
  size?: number;
  animated?: boolean;
}) {
  return (
    <span
      className={cn("logo-mark", animated && "is-animated")}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {animated ? <span className="logo-glow" /> : null}
      <span className="pane pane-a" />
      <span className="pane pane-b" />
      <span className="pane pane-c" />
      <span className="pane pane-d" />
    </span>
  );
}

export function AppleMark({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
      />
    </svg>
  );
}

export function TuxMark({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <ellipse cx="32" cy="40" rx="18" ry="20" fill="#18181b" stroke="rgba(255,255,255,.22)" />
      <path d="M14 34c-4 10-3 17 2 20 3-4 4-12 3-20Z" fill="#18181b" stroke="rgba(255,255,255,.22)" />
      <path d="M50 34c4 10 3 17-2 20-3-4-4-12-3-20Z" fill="#18181b" stroke="rgba(255,255,255,.22)" />
      <circle cx="32" cy="18" r="12.5" fill="#18181b" stroke="rgba(255,255,255,.22)" />
      <ellipse cx="32" cy="44" rx="12" ry="14" fill="#f5f5f4" />
      <ellipse cx="32" cy="22.5" rx="8" ry="6.5" fill="#f5f5f4" />
      <circle cx="28" cy="16.5" r="2.8" fill="#fff" />
      <circle cx="36" cy="16.5" r="2.8" fill="#fff" />
      <circle cx="28.7" cy="17" r="1.3" fill="#18181b" />
      <circle cx="35.3" cy="17" r="1.3" fill="#18181b" />
      <path d="M27 21.5h10l-5 5.5Z" fill="#f59e0b" />
      <ellipse cx="23" cy="58.5" rx="7.5" ry="3.5" fill="#f59e0b" />
      <ellipse cx="41" cy="58.5" rx="7.5" ry="3.5" fill="#f59e0b" />
    </svg>
  );
}

export function OsLogo({ os, size = 24 }: { os: OsId; size?: number }) {
  if (os === "mac") return <AppleMark size={size} />;
  if (os === "linux") return <TuxMark size={size} />;
  return <Logo size={size} />;
}

export function AppIcon({ id, size = 40 }: { id: IconId; size?: number }) {
  return (
    <span className={`app-icon app-icon-${id}`} style={{ width: size, height: size }} aria-hidden>
      <Glyph id={id} />
    </span>
  );
}

function Glyph({ id }: { id: IconId }) {
  if (id === "welcome") {
    return (
      <svg width="54%" height="54%" viewBox="0 0 24 24" aria-hidden>
        <path
          fill="currentColor"
          d="M12 2.2 13.7 9 20.6 12 13.7 15 12 21.8 10.3 15 3.4 12 10.3 9 12 2.2Z"
        />
      </svg>
    );
  }
  if (id === "files") {
    return (
      <svg width="58%" height="58%" viewBox="0 0 24 24" aria-hidden>
        <path
          fill="currentColor"
          d="M3.5 8.2A2.2 2.2 0 0 1 5.7 6h3.7l1.7 1.8h7.2A2.2 2.2 0 0 1 20.5 10v7.2a2.2 2.2 0 0 1-2.2 2.2H5.7a2.2 2.2 0 0 1-2.2-2.2V8.2Z"
        />
      </svg>
    );
  }
  if (id === "notepad") {
    return (
      <svg width="54%" height="54%" viewBox="0 0 24 24" aria-hidden>
        <rect x="6" y="3.5" width="12" height="17" rx="2" {...stroke} />
        <path d="M9 8.5h6M9 12h6M9 15.5h4" {...stroke} />
      </svg>
    );
  }
  if (id === "terminal") {
    return (
      <svg width="58%" height="58%" viewBox="0 0 24 24" aria-hidden>
        <path d="M5 7.5 10 12l-5 4.5" {...stroke} strokeWidth="2.2" />
        <path d="M12.5 17H19" {...stroke} strokeWidth="2.2" />
      </svg>
    );
  }
  if (id === "settings") {
    return (
      <svg width="58%" height="58%" viewBox="0 0 24 24" aria-hidden>
        <path d="M4 7h16M4 12h16M4 17h16" {...stroke} />
        <circle cx="9" cy="7" r="2.1" fill="currentColor" stroke="none" />
        <circle cx="15" cy="12" r="2.1" fill="currentColor" stroke="none" />
        <circle cx="11" cy="17" r="2.1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (id === "finder") {
    return (
      <svg width="100%" height="100%" viewBox="0 0 48 48" aria-hidden>
        <path d="M24 0h14a10 10 0 0 1 10 10v28a10 10 0 0 1-10 10H24Z" fill="#1d6ff2" />
        <path
          d="M24 2c-4 8-6 16-6 23 0 7 2 14 6 21"
          fill="none"
          stroke="rgba(0,0,0,.45)"
          strokeWidth="2.2"
        />
        <circle cx="15" cy="19" r="2.2" fill="#0f2a5a" />
        <circle cx="33" cy="19" r="2.2" fill="#fff" />
        <path d="M13 31c7 6 15 6 22 0" fill="none" stroke="#0f2a5a" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M24 31c4 3 7 3 11 0" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === "launchpad") {
    return (
      <svg width="62%" height="62%" viewBox="0 0 24 24" aria-hidden>
        <rect x="3" y="3" width="5" height="5" rx="1.4" fill="#ff6b6b" />
        <rect x="9.5" y="3" width="5" height="5" rx="1.4" fill="#ffd166" />
        <rect x="16" y="3" width="5" height="5" rx="1.4" fill="#06d6a0" />
        <rect x="3" y="9.5" width="5" height="5" rx="1.4" fill="#4cc9f0" />
        <rect x="9.5" y="9.5" width="5" height="5" rx="1.4" fill="#b388ff" />
        <rect x="16" y="9.5" width="5" height="5" rx="1.4" fill="#ff8fab" />
        <rect x="3" y="16" width="5" height="5" rx="1.4" fill="#ffb703" />
        <rect x="9.5" y="16" width="5" height="5" rx="1.4" fill="#5ee7ff" />
        <rect x="16" y="16" width="5" height="5" rx="1.4" fill="#9bf6ff" />
      </svg>
    );
  }
  if (id === "trash") {
    return (
      <svg width="56%" height="56%" viewBox="0 0 24 24" aria-hidden>
        <path d="M5 7h14M9 7V4.8A.8.8 0 0 1 9.8 4h4.4a.8.8 0 0 1 .8.8V7" {...stroke} />
        <path d="M7 7l.8 12.2a1.5 1.5 0 0 0 1.5 1.3h5.4a1.5 1.5 0 0 0 1.5-1.3L17 7" {...stroke} />
        <path d="M10 11v6M14 11v6" {...stroke} />
      </svg>
    );
  }
  if (id === "disk") {
    return (
      <svg width="62%" height="62%" viewBox="0 0 24 24" aria-hidden>
        <rect x="3" y="6" width="18" height="12" rx="2.5" {...stroke} />
        <circle cx="16.5" cy="12" r="1.3" fill="currentColor" stroke="none" />
        <path d="M6.5 12h5" {...stroke} />
      </svg>
    );
  }
  if (id === "home") {
    return (
      <svg width="58%" height="58%" viewBox="0 0 24 24" aria-hidden>
        <path d="M4 11.5 12 5l8 6.5" {...stroke} strokeWidth="2" />
        <path d="M6.5 10.5V19h11v-8.5" {...stroke} strokeWidth="2" />
      </svg>
    );
  }
  return (
    <svg width="58%" height="58%" viewBox="0 0 24 24" aria-hidden>
      <rect x="3" y="4" width="18" height="12" rx="2" {...stroke} />
      <path d="M12 16v3.5M8 20h8" {...stroke} />
    </svg>
  );
}

export function SearchIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <circle cx="11" cy="11" r="6" {...stroke} />
      <path d="M16 16.5 20 20.5" {...stroke} />
    </svg>
  );
}

export function WifiIcon({ off = false }: { off?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path d="M5 10.5a10 10 0 0 1 14 0" {...stroke} />
      <path d="M8 13.5a6 6 0 0 1 8 0" {...stroke} />
      <path d="M12 17.5h.01" {...stroke} strokeWidth="3" />
      {off ? <path d="M4 4 20 20" {...stroke} /> : null}
    </svg>
  );
}

export function VolumeIcon({ muted = false }: { muted?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path d="M4 10h3.2L11 6.5v11L7.2 14H4v-4Z" {...stroke} />
      {muted ? (
        <path d="M15 10.5 20 15.5M20 10.5 15 15.5" {...stroke} />
      ) : (
        <path d="M15 9.5a4.5 4.5 0 0 1 0 5M17.5 7.5a7.5 7.5 0 0 1 0 9" {...stroke} />
      )}
    </svg>
  );
}

export function BatteryIcon() {
  return (
    <svg width="18" height="16" viewBox="0 0 24 24" aria-hidden>
      <rect x="2" y="7" width="17" height="10" rx="2" {...stroke} />
      <path d="M20.5 10.5v3" {...stroke} />
      <rect x="4.2" y="9.2" width="10" height="5.6" rx="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function PowerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 3.5v7" {...stroke} />
      <path d="M7.2 6.4a7.5 7.5 0 1 0 9.6 0" {...stroke} />
    </svg>
  );
}

export function BluetoothIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path d="M7 8l10 8-5 4V4l5 4-10 8" {...stroke} />
    </svg>
  );
}

export function AirdropIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="2.4" {...stroke} />
      <path d="M7.5 7.5a6.4 6.4 0 0 0 0 9M16.5 7.5a6.4 6.4 0 0 1 0 9" {...stroke} />
      <path d="M4.5 4.5a10.6 10.6 0 0 0 0 15M19.5 4.5a10.6 10.6 0 0 1 0 15" {...stroke} />
    </svg>
  );
}

export function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" {...stroke} />
    </svg>
  );
}

export function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="4" {...stroke} />
      <path
        d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"
        {...stroke}
      />
    </svg>
  );
}

export function GridIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      {[4, 10.5, 17].flatMap((x) =>
        [4, 10.5, 17].map((y) => (
          <circle key={`${x}-${y}`} cx={x + 1.5} cy={y + 1.5} r="1.9" fill="currentColor" />
        )),
      )}
    </svg>
  );
}

export function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <rect x="5" y="10.5" width="14" height="10" rx="2" {...stroke} />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" {...stroke} />
    </svg>
  );
}

export function GearIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="3" {...stroke} />
      <path
        d="M12 2.8l1.6 2.6 3-.6.6 3 2.6 1.6-1.4 2.6 1.4 2.6-2.6 1.6-.6 3-3-.6L12 21.2l-1.6-2.6-3 .6-.6-3-2.6-1.6L5.6 12 4.2 9.4 6.8 7.8l.6-3 3 .6Z"
        {...stroke}
        strokeWidth="1.4"
      />
    </svg>
  );
}

export function ControlCenterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <rect x="3" y="5" width="18" height="6" rx="3" {...stroke} />
      <rect x="3" y="13" width="18" height="6" rx="3" {...stroke} />
      <circle cx="8" cy="8" r="2" fill="currentColor" />
      <circle cx="16" cy="16" r="2" fill="currentColor" />
    </svg>
  );
}

export function ChevronIcon({ direction = "right" }: { direction?: "right" | "down" }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      aria-hidden
      style={{ transform: direction === "down" ? "rotate(90deg)" : undefined }}
    >
      <path d="m9 6 6 6-6 6" {...stroke} />
    </svg>
  );
}

export function FileGlyph({
  kind,
  size = 36,
}: {
  kind: "text" | "image" | "folder";
  size?: number;
}) {
  if (kind === "folder") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <path
          fill="#fbbf24"
          d="M3.2 8.2A2.2 2.2 0 0 1 5.4 6h3.8l1.7 1.8h7.5a2.2 2.2 0 0 1 2.2 2.2v7.3a2.2 2.2 0 0 1-2.2 2.2H5.4a2.2 2.2 0 0 1-2.2-2.2V8.2Z"
        />
      </svg>
    );
  }
  if (kind === "image") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <rect x="3" y="4" width="18" height="16" rx="2.5" fill="#38bdf8" />
        <circle cx="9" cy="9" r="1.6" fill="white" />
        <path d="M4.5 16.5 9 12l3 2.8 2.2-2 5.3 4.2" fill="none" stroke="white" strokeWidth="1.6" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#dbeafe"
        d="M7 3.5h6.2L19 9.2V20a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 6 20V5A1.5 1.5 0 0 1 7.5 3.5H7Z"
      />
      <path d="M13 3.8V9h5" fill="none" stroke="#1d4ed8" strokeWidth="1.4" />
      <path d="M9 13h6M9 16h4" fill="none" stroke="#1d4ed8" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
