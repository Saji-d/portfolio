"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Neon thruster glued to the rocket cursor's nozzle. This intentionally has
 * no point history, no interpolation, and no trail: every pointermove
 * repositions the exhaust to exactly where the nozzle is *right now*, so it
 * can never lag or detach from the rocket the way a fading motion-trail
 * would. The flicker/pulse is pure CSS (see globals.css) so it keeps
 * animating smoothly independent of pointer/JS frame timing.
 */
export default function RocketExhaust({
  targetRef,
  overGlobeRef,
  anchorOffsetY,
}: {
  targetRef: RefObject<HTMLDivElement | null>;
  /** True while the pointer is over the interactive globe - exhaust hides there. */
  overGlobeRef: RefObject<boolean>;
  /** Distance from the cursor hotspot down to the rocket's nozzle. */
  anchorOffsetY: number;
}) {
  const exhaustRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = targetRef.current;
    const exhaust = exhaustRef.current;
    if (!target || !exhaust) return;

    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let visible = false;
    const setVisible = (next: boolean) => {
      if (visible === next) return;
      visible = next;
      exhaust.style.opacity = next ? "1" : "0";
    };

    function onMove(e: PointerEvent) {
      if (overGlobeRef.current) {
        setVisible(false);
        return;
      }
      const rect = target!.getBoundingClientRect();
      const x = e.clientX - rect.left -0.5;
      const y = e.clientY - rect.top + anchorOffsetY;
      exhaust!.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      setVisible(true);
    }

    function onLeave() {
      setVisible(false);
    }

    target.addEventListener("pointermove", onMove, { passive: true });
    target.addEventListener("pointerleave", onLeave);

    return () => {
      target.removeEventListener("pointermove", onMove);
      target.removeEventListener("pointerleave", onLeave);
    };
  }, [targetRef, overGlobeRef, anchorOffsetY]);

  return (
    <div ref={exhaustRef} className="rocket-exhaust" aria-hidden="true">
      <span className="rocket-exhaust-glow" />
      <span className="rocket-exhaust-flame" />
      <span className="rocket-exhaust-core" />
      <span className="rocket-exhaust-spark rocket-exhaust-spark-a" />
      <span className="rocket-exhaust-spark rocket-exhaust-spark-b" />
    </div>
  );
}
