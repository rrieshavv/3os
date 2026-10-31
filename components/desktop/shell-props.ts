import type { Dispatch, SetStateAction } from "react";
import type { AppId, Flyout, WindowState } from "@/lib/types";

export type ShellProps = {
  flyout: Flyout;
  setFlyout: Dispatch<SetStateAction<Flyout>>;
  windows: WindowState[];
  topZ: number;
  onFocus: (id: AppId) => void;
  onClose: (id: AppId) => void;
  onMinimize: (id: AppId) => void;
  onMaximize: (id: AppId) => void;
};
