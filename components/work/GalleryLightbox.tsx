"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { ProjectScreenshot } from "@/data/projects";

export default function GalleryLightbox({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  images: ProjectScreenshot[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNext, onPrev]);

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
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg/94 p-4 backdrop-blur-sm"
          onClick={onClose}
          onKeyDown={trapTab}
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery"
          ref={dialogRef}
        >
          <button
            ref={closeRef}
            className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-md border border-line bg-surface text-text-secondary hover:text-text-primary"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            className="absolute left-2 grid h-10 w-10 place-items-center rounded-md border border-line bg-surface text-text-secondary hover:text-text-primary sm:left-6"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            className="absolute right-2 grid h-10 w-10 place-items-center rounded-md border border-line bg-surface text-text-secondary hover:text-text-primary sm:right-6"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
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
              {images[index].alt} · {index + 1} / {images.length}
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </MotionConfig>
  );
}
