/** Small highlighted "LIVE" pill: emerald tint, round dot (pulses only when motion is allowed). */
export default function LiveBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/15 px-2 py-0.5 font-mono text-[0.6875rem] font-semibold uppercase leading-none tracking-wider text-emerald-300 ${className}`}
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full bg-emerald-400 motion-safe:animate-pulse"
      />
      Live
    </span>
  );
}
