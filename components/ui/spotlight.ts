import type { MouseEvent } from "react";

// Shared by any card that wants a cursor-pinned radial highlight (Contact
// channels, Skill categories): sets --sx/--sy directly on the element via
// imperative style mutation - MagneticButton-style, no state/re-render -
// which the .spotlight-layer rule in globals.css reads for its gradient
// position. Kept as a plain function rather than a hook since it needs no
// lifecycle of its own, just a stable reference for onMouseMove.
export function handleSpotlight(e: MouseEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--sx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--sy", `${e.clientY - rect.top}px`);
}
