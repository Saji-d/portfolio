"use client";

import { useRef, type ReactNode } from "react";

const reducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;

const finePointer =
  typeof window !== "undefined" ? window.matchMedia("(pointer: fine)") : null;

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  max?: number;
  /** Render a cursor-following radial glare on top of the card. Off by default. */
  glare?: boolean;
}

export default function TiltCard({ children, className, max = 3, glare = false }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion?.matches) return;
    if (finePointer && !finePointer.matches) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateY(-2px)`;

    if (glare && glareRef.current) {
      const gx = ((px + 0.5) * 100).toFixed(1);
      const gy = ((py + 0.5) * 100).toFixed(1);
      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      const color = isLight ? "rgba(15, 118, 110, 0.06)" : "rgba(255, 255, 255, 0.08)";
      glareRef.current.style.background = `radial-gradient(circle at ${gx}% ${gy}%, ${color}, transparent 55%)`;
      glareRef.current.style.opacity = "1";
    }
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)";
    if (glare && glareRef.current) {
      glareRef.current.style.opacity = "0";
    }
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`${glare ? "relative" : ""} transition-transform duration-300 ease-out will-change-transform ${className ?? ""}`}
    >
      {children}
      {glare && (
        <div
          ref={glareRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 ease-out"
        />
      )}
    </div>
  );
}
