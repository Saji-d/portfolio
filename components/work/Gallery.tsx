"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import type { ProjectScreenshot } from "@/data/projects";

const GalleryLightbox = dynamic(() => import("@/components/work/GalleryLightbox"));

export default function Gallery({ images }: { images: ProjectScreenshot[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  function open(i: number) {
    triggerRef.current = document.activeElement as HTMLElement | null;
    setIndex(i);
  }

  function close() {
    setIndex(null);
  }

  function prev() {
    setIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
  }

  function next() {
    setIndex((i) => (i === null ? i : (i + 1) % images.length));
  }

  useEffect(() => {
    if (index === null) triggerRef.current?.focus?.();
  }, [index]);

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

      {index !== null && (
        <GalleryLightbox
          images={images}
          index={index}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </div>
  );
}
