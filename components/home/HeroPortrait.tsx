"use client";

import { useEffect, useRef } from "react";
import Image, { type StaticImageData } from "next/image";

const reducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;

const finePointer =
  typeof window !== "undefined" ? window.matchMedia("(pointer: fine)") : null;

interface HeroPortraitProps {
  src: StaticImageData;
  className?: string;
  style?: React.CSSProperties;
}

// Desktop-only depth cue: the portrait and the accent glow behind it drift a
// few px in opposite directions as the cursor moves across the hero,
// reading as two layers at different depths rather than one flat cutout.
// Tracked across the whole hero section (not just the image) so the effect
// is already settling by the time the cursor reaches the portrait itself.
export default function HeroPortrait({ src, className, style }: HeroPortraitProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgLayerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion?.matches || !finePointer?.matches) return;
    const section = wrapRef.current?.closest("section");
    if (!section) return;

    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      const rect = section!.getBoundingClientRect();
      const dx = (e.clientX - rect.left) / rect.width - 0.5;
      const dy = (e.clientY - rect.top) / rect.height - 0.5;
      if (imgLayerRef.current) {
        imgLayerRef.current.style.transform = `translate3d(${(dx * -7).toFixed(2)}px, ${(dy * -7).toFixed(2)}px, 0)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${(dx * 12).toFixed(2)}px, ${(dy * 12).toFixed(2)}px, 0)`;
      }
    }
    function onLeave() {
      imgLayerRef.current?.style.setProperty("transform", "translate3d(0,0,0)");
      glowRef.current?.style.setProperty("transform", "translate3d(0,0,0)");
    }

    section.addEventListener("pointermove", onMove, { passive: true });
    section.addEventListener("pointerleave", onLeave, { passive: true });
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={wrapRef} className={className} style={style}>
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute -inset-5 -z-10 rounded-[1.75rem] bg-[radial-gradient(closest-side,var(--accent-dim),transparent)] opacity-70 blur-2xl transition-transform duration-500 ease-out will-change-transform"
      />
      <div className="hero-portrait-mask overflow-hidden rounded-2xl">
        <div ref={imgLayerRef} className="transition-transform duration-500 ease-out will-change-transform">
          <Image
            src={src}
            alt="Portrait of Sajidur Rahman Sajid"
            width={2916}
            height={4376}
            priority
            quality={100}
            sizes="240px"
            className="block h-auto w-60 scale-[1.03]"
          />
        </div>
      </div>
    </div>
  );
}
