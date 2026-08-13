/**
 * The page's base atmosphere: a barely-visible engineering grid plus two
 * large, soft indigo/violet ambient washes. This is the ONE constant layer
 * behind every section — CircuitTraces (see components/ui/CircuitTraces.tsx)
 * adds the per-section variation on top of it.
 *
 * Deliberately static/CSS-only (no canvas, no rAF loop, no pointer tracking)
 * — this replaces the old particle-network background, which was heavier
 * than a decorative layer needs to be and read as "space" rather than
 * "engineering". Fixed positioning matches the old system's behavior so it
 * reads as a constant ambient light source rather than scrolling scenery.
 */
export default function EngineeringBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="engineering-grid absolute inset-0" />
      <div className="animate-ambient-drift absolute -top-1/4 left-[-12%] h-[68vh] w-[68vh] rounded-full bg-[radial-gradient(closest-side,var(--glow-primary),transparent)] opacity-40 blur-3xl" />
      <div className="absolute -bottom-1/4 right-[-12%] h-[58vh] w-[58vh] rounded-full bg-[radial-gradient(closest-side,var(--glow-secondary),transparent)] opacity-30 blur-3xl" />
    </div>
  );
}
