"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Pill } from "@/components/ui/Badge";

/**
 * Tech tags capped to a fixed number of rows. Tags are listed best-first, so
 * whatever doesn't fit collapses into a "+N" chip (full list on hover).
 * Re-fits whenever the card's width changes.
 */
type Item = { kind: "tag" | "planned" | "label"; text: string };

export default function StackPills({
  tags,
  planned = [],
  maxRows = 2,
  className = "",
}: {
  tags: string[];
  /** Planned (not yet shipped) stack, shown after a muted "Next up" label. */
  planned?: string[];
  maxRows?: number;
  className?: string;
}) {
  const items: Item[] = [
    ...tags.map((text): Item => ({ kind: "tag", text })),
    ...(planned.length > 0
      ? [
          { kind: "label", text: "Next up" } as Item,
          ...planned.map((text): Item => ({ kind: "planned", text })),
        ]
      : []),
  ];
  const total = items.length;
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(total);
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
        setVisible(total);
        setFitKey((k) => k + 1);
      }
    });
    ro.observe(el);

    // Pill widths change once the web fonts swap in, without the container
    // itself resizing, so refit from the full list when fonts are ready.
    let cancelled = false;
    const refit = () => {
      if (cancelled) return;
      setVisible(total);
      setFitKey((k) => k + 1);
    };
    document.fonts?.ready.then(refit);
    document.fonts?.addEventListener?.("loadingdone", refit);

    return () => {
      cancelled = true;
      ro.disconnect();
      document.fonts?.removeEventListener?.("loadingdone", refit);
    };
  }, [total]);

  // Never end on a dangling "Next up" label with no chips after it.
  let shown = items.slice(0, visible);
  if (shown.length > 0 && shown[shown.length - 1].kind === "label") shown = shown.slice(0, -1);
  const rest = items.slice(shown.length).filter((i) => i.kind !== "label");
  const hidden = rest.length;

  return (
    <div ref={ref} className={`flex flex-wrap gap-1.5 ${className}`}>
      {shown.map((item) =>
        item.kind === "label" ? (
          <span
            key="__planned-label"
            className="ml-1 inline-flex items-center border border-transparent py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-text-muted"
          >
            {item.text}
          </span>
        ) : (
          <Pill key={`${item.kind}-${item.text}`} planned={item.kind === "planned"}>
            {item.text}
          </Pill>
        ),
      )}
      {hidden > 0 && (
        <span title={rest.map((i) => i.text).join(", ")}>
          <Pill>{`+${hidden}`}</Pill>
        </span>
      )}
    </div>
  );
}
