"use client";

import { Dock } from "@/components/desktop/mac/Dock";
import { Launchpad } from "@/components/desktop/mac/Launchpad";
import { MenuBar } from "@/components/desktop/mac/MenuBar";
import { Spotlight } from "@/components/desktop/mac/Spotlight";
import type { ShellProps } from "@/components/desktop/shell-props";

export function MacShell(props: ShellProps) {
  return (
    <>
      {props.flyout === "launchpad" ? <Launchpad setFlyout={props.setFlyout} /> : null}
      <MenuBar {...props} />
      <Dock {...props} />
      {props.flyout === "spotlight" ? <Spotlight setFlyout={props.setFlyout} /> : null}
    </>
  );
}
