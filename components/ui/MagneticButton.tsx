"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";

const reducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  external?: boolean;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

export default function MagneticButton({
  children,
  href,
  external,
  onClick,
  className = "",
  ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion?.matches) return;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width / 2) * 0.15;
    const dy = (e.clientY - rect.top - rect.height / 2) * 0.3;
    el.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate3d(0, 0, 0)";
  }

  const classes = `inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors ${className}`;
  const handlers = { onMouseMove: onMove, onMouseLeave: onLeave };

  if (href && external) {
    return (
      <a ref={ref} href={href} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel} className={classes} {...handlers}>
        {children}
      </a>
    );
  }
  if (href) {
    return (
      <Link ref={ref} href={href} aria-label={ariaLabel} className={classes} {...handlers}>
        {children}
      </Link>
    );
  }
  return (
    <button ref={ref} onClick={onClick} aria-label={ariaLabel} className={classes} {...handlers}>
      {children}
    </button>
  );
}
