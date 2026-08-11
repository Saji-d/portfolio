"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const CortexConsole = dynamic(
  () => import("@/components/home/cortex/CortexConsole"),
  {
    ssr: false,
    loading: () => <Skeleton />,
  },
);

function Skeleton() {
  // Matched as closely as practical to CortexConsole's real rendered height
  // (header + input + command row + output panel + history row) so the
  // dynamic-import swap doesn't shift page layout — and therefore doesn't
  // silently carry the scroll position away from wherever a visitor (or a
  // hash-on-load correction) just placed it.
  return (
    <div className="flex h-[500px] items-center justify-center rounded-2xl border border-line bg-surface/60 font-mono text-xs text-text-muted sm:h-[580px]">
      cortex loading<span className="animate-caret text-accent">_</span>
    </div>
  );
}

export default function CortexLazyGate() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "720px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <div ref={ref}>{inView ? <CortexConsole /> : <Skeleton />}</div>;
}
