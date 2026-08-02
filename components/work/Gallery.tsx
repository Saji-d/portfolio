"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { ProjectScreenshot } from "@/data/projects";

export default function Gallery({ images }: { images: ProjectScreenshot[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  function open(i: number) {
    triggerRef.current = document.activeElement as HTMLElement | null;
    setIndex(i);
  }

  useEffect(() => {
    if (index !== null) {
      closeRef.current?.focus();
    } else {
      triggerRef.current?.focus?.();
    }
  }, [index]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") setIndex((i) => (i === null ? i : (i + 1) % images.length));
      if (e.key === "ArrowLeft")
        setIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, images.length]);

  function trapTab(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Tab") return;
    const container = dialogRef.current;
    if (!container) return;
    const focusables = Array.from(
      container.querySelectorAll<HTMLElement>(
        'button, [href], input, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute("disabled"));
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;
    if (e.shiftKey) {
      if (active === first || !container.contains(active)) {
        e.preventDefault();
        last.focus();
      }
    } else if (active === last || !container.contains(active)) {
      e.preventDefault();
      first.focus();
    }
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((img, i) => (
        <button
          key={img.src}
          onClick={() => open(i)}
          className="group relative aspect-[16/10] overflow-hidden rounded-lg border border-line bg-surface-2 transition-colors hover:border-accent/40"
          aria-label={`Open screenshot: ${img.alt}`}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </button>
      ))}

      <AnimatePresence>
        {index !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0E14]/94 p-4 backdrop-blur-sm"
            onClick={() => setIndex(null)}
            onKeyDown={trapTab}
            role="dialog"
            aria-modal="true"
            aria-label="Image gallery"
            ref={dialogRef}
          >
            <button
              ref={closeRef}
              className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-md border border-line bg-surface text-text-secondary hover:text-text-primary"
              onClick={() => setIndex(null)}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              className="absolute left-2 grid h-10 w-10 place-items-center rounded-md border border-line bg-surface text-text-secondary hover:text-text-primary sm:left-6"
              onClick={(e) => {
                e.stopPropagation();
                setIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
              }}
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              className="absolute right-2 grid h-10 w-10 place-items-center rounded-md border border-line bg-surface text-text-secondary hover:text-text-primary sm:right-6"
              onClick={(e) => {
                e.stopPropagation();
                setIndex((i) => (i === null ? i : (i + 1) % images.length));
              }}
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="relative max-h-[85vh] w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-line">
                <Image
                  src={images[index].src}
                  alt={images[index].alt}
                  fill
                  sizes="80vw"
                  className="object-contain"
                />
              </div>
              <p className="mt-3 text-center font-mono text-xs text-text-muted">
                {images[index].alt} — {index + 1} / {images.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
