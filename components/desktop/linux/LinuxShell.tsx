"use client";

import { Activities } from "@/components/desktop/linux/Activities";
import { Dash } from "@/components/desktop/linux/Dash";
import { TopBar } from "@/components/desktop/linux/TopBar";
import type { ShellProps } from "@/components/desktop/shell-props";

export function LinuxShell(props: ShellProps) {
  const overlay = props.flyout === "activities" || props.flyout === "launchpad";
  return (
    <>
      {overlay ? (
        <Activities {...props} mode={props.flyout === "launchpad" ? "apps" : "overview"} />
      ) : null}
      <TopBar {...props} />
      <Dash {...props} />
    </>
  );
}
