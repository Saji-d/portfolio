import { ArrowUpRight } from "lucide-react";

/**
 * "LIVE" chip for demo links. Purely presentational (it always sits inside the
 * host <a>/<button>, so it is never interactive itself): glass body, animated
 * emerald-to-cyan gradient border, radar-ring dot and an arrow that nudges when
 * the host is hovered or focused. Animations are off under reduced motion.
 */
export default function LiveBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`live-chip ${className}`}>
      <style>{`
        .live-chip{position:relative;display:inline-flex;align-items:center;gap:.375rem;isolation:isolate;
          border:1px solid transparent;border-radius:9999px;padding:.1875rem .4375rem .1875rem .5rem;
          font-family:var(--font-mono);font-size:.6875rem;font-weight:700;line-height:1;
          letter-spacing:.12em;text-transform:uppercase;color:#a7f3d0;white-space:nowrap;
          background:linear-gradient(rgba(6,18,20,.78),rgba(6,18,20,.78)) padding-box,
            linear-gradient(110deg,#34d399,#22d3ee,#34d399,#22d3ee) border-box;
          background-size:100% 100%,300% 100%;background-position:0 0,0% 0;
          box-shadow:0 0 14px -4px rgba(52,211,153,.55),inset 0 1px 0 rgba(255,255,255,.08);
          backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
        .live-chip .live-dot{position:relative;width:.375rem;height:.375rem;border-radius:9999px;background:#34d399;box-shadow:0 0 6px #34d399}
        .live-chip .live-dot::after{content:"";position:absolute;inset:-1px;border-radius:inherit;border:1px solid #34d399}
        .live-chip .live-arrow{transition:transform .25s cubic-bezier(.22,1,.36,1);color:#67e8f9}
        a:hover>.live-chip .live-arrow,a:focus-visible>.live-chip .live-arrow,button:hover>.live-chip .live-arrow{transform:translate(2px,-2px)}
        a:focus-visible:has(>.live-chip),button:focus-visible:has(>.live-chip){outline:2px solid #34d399;outline-offset:2px}
        @media (prefers-reduced-motion:no-preference){
          .live-chip{animation:live-border 4s linear infinite}
          .live-chip .live-dot::after{animation:live-radar 1.9s cubic-bezier(0,0,.2,1) infinite}
        }
        @keyframes live-border{to{background-position:0 0,300% 0}}
        @keyframes live-radar{0%{transform:scale(1);opacity:.9}100%{transform:scale(3.4);opacity:0}}
      `}</style>
      <span aria-hidden="true" className="live-dot" />
      Live
      <ArrowUpRight aria-hidden="true" className="live-arrow h-3 w-3" strokeWidth={2.5} />
    </span>
  );
}
