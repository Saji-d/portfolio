"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Pill } from "@/components/ui/Badge";

/**
 * Tech tags capped to a fixed number of rows. Tags are listed best-first, so
 * whatever doesn't fit collapses into a "+N" chip (full list on hover).
 * Re-fits whenever the card's width changes.
 */
export default function StackPills({
  tags,
  maxRows = 2,
  className = "",
}: {
  tags: string[];
  maxRows?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(tags.length);
  const [fitKey, setFitKey] = useState(0);
  const widthRef = useRef(0);

  // Trim one tag at a time until the pills (plus the "+N" chip) fit in
  // maxRows. Layout effects flush synchronously, so this settles before paint.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || visible <= 1) return;
    const tops = new Set(
      Array.from(el.children).map((child) => (child as HTMLElement).offsetTop),
    );
    if (tops.size > maxRows) setVisible(visible - 1);
  }, [visible, maxRows, fitKey]);

  // A width change (resize, layout shift) restarts the fit from the full list.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    widthRef.current = el.clientWidth;
    const ro = new ResizeObserver(() => {
      if (Math.abs(el.clientWidth - widthRef.current) > 1) {
        widthRef.current = el.clientWidth;
        setVisible(tags.length);
        setFitKey((k) => k + 1);
      }
    });
    ro.observe(el);

    // Pill widths change once the web fonts swap in, without the container
    // itself resizing, so refit from the full list when fonts are ready.
    let cancelled = false;
    const refit = () => {
      if (cancelled) return;
      setVisible(tags.length);
      setFitKey((k) => k + 1);
    };
    document.fonts?.ready.then(refit);
    document.fonts?.addEventListener?.("loadingdone", refit);

    return () => {
      cancelled = true;
      ro.disconnect();
      document.fonts?.removeEventListener?.("loadingdone", refit);
    };
  }, [tags.length]);

  const hidden = tags.length - visible;

  return (
    <div ref={ref} className={`flex flex-wrap gap-1.5 ${className}`}>
      {tags.slice(0, visible).map((tech) => (
        <Pill key={tech}>{tech}</Pill>
      ))}
      {hidden > 0 && (
        <span title={tags.slice(visible).join(", ")}>
          <Pill>{`+${hidden}`}</Pill>
        </span>
      )}
    </div>
  );
}
