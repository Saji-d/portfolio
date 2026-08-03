"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  x?: number;
  scale?: number;
}

let observer: IntersectionObserver | null = null;
const targets = new Map<Element, () => void>();

function getObserver() {
  if (typeof window === "undefined") return null;
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const reveal = targets.get(entry.target);
          if (!reveal) continue;
          reveal();
          targets.delete(entry.target);
          observer?.unobserve(entry.target);
        }
      },
      { rootMargin: "-15% 0px -10% 0px" }
    );
  }
  return observer;
}

export default function Reveal({
  children,
  delay = 0,
  className,
  y = 24,
  x = 0,
  scale = 1,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const obs = getObserver();
    if (!el || !obs) return;

    targets.set(el, () => {
      if (delay) el.style.transitionDelay = `${delay}s`;
      el.classList.add("reveal-in");
    });
    obs.observe(el);

    return () => {
      obs.unobserve(el);
      targets.delete(el);
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`reveal ${className ?? ""}`}
      style={
        {
          "--reveal-x": `${x}px`,
          "--reveal-y": `${y}px`,
          "--reveal-scale": String(scale),
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
