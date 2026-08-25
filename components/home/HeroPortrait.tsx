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
    <div ref={wrapRef} className={`relative ${className ?? ""}`} style={style}>
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute -inset-5 -z-10 rounded-[1.5rem] bg-[radial-gradient(closest-side,var(--accent-dim),transparent)] opacity-70 blur-2xl transition-transform duration-500 ease-out will-change-transform"
      />
      {/* The frame IS the border - a hairline neon gradient ring sitting
          flush against the portrait (padding-box trick: gradient fill on
          the outer box, inset radius on the inner) rather than a separate
          outline offset outward from it. That offset gap read as dead
          space around the image; this reads as a signature accent instead. */}
      <div className="rounded-2xl bg-gradient-to-br from-accent-3/70 via-accent/70 to-accent-2/70 p-px">
        <div className="hero-portrait-mask overflow-hidden rounded-[calc(1rem-1px)] bg-bg">
          <div
            ref={imgLayerRef}
            className="relative aspect-[4/5] transition-transform duration-500 ease-out will-change-transform"
          >
            {/* fill + object-cover + object-top: a deliberately shorter crop
                than the source photo's natural ~2:3 ratio, biased to the
                upper body so the face/shoulders stay prominent in a more
                compact frame rather than shrinking the whole figure down. */}
            <Image
              src={src}
              alt="Portrait of Sajidur Rahman Sajid"
              fill
              priority
              quality={100}
              sizes="(min-width: 1024px) 256px, (min-width: 640px) 144px, 128px"
              className="object-cover object-top scale-[1.04]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
