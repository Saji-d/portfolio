"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function RouteProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const rafRef = useRef(0);
  const timerRef = useRef(0);
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;
    setProgress(0);
    setVisible(true);

    cancelAnimationFrame(rafRef.current);
    let p = 0;
    const tick = () => {
      p = Math.min(0.9, p + (0.9 - p) * 0.18);
      setProgress(p);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      cancelAnimationFrame(rafRef.current);
      setProgress(1);
      window.setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 220);
    }, 350);
  }, [pathname]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(timerRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px]"
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-accent to-accent-2 transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
