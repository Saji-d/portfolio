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
  return (
    <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-line bg-surface/60 font-mono text-xs text-text-muted">
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
