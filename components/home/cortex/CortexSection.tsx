import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";
import CortexLazyGate from "@/components/home/cortex/CortexLazyGate";

function NeuralBackdropSvg() {
  const nodes = Array.from({ length: 16 }).map((_, i) => ({
    cx: (i * 97 + 23) % 420,
    cy: (i * 61 + 11) % 420,
  }));
  return (
    <svg
      className="absolute right-[-12%] top-[-6%] h-[560px] w-[560px] opacity-[0.05]"
      viewBox="0 0 420 420"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M30 120 L140 210 L230 130 L320 260 L390 180"
        stroke="#4fd1c5"
        strokeWidth="1"
      />
      <path
        d="M110 300 L200 240 L310 310 L390 250"
        stroke="#4fd1c5"
        strokeWidth="1"
      />
      <path
        d="M260 60 L330 130 L380 90"
        stroke="#7c7dff"
        strokeWidth="1"
      />
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.cx}
          cy={n.cy}
          r={i % 3 === 0 ? 3 : 2}
          fill={i % 4 === 0 ? "#7c7dff" : "#4fd1c5"}
        />
      ))}
    </svg>
  );
}

export default function CortexSection() {
  return (
    <section
      id="cortex"
      aria-label="Interactive intro"
      className="relative scroll-mt-0 overflow-hidden"
    >
      {/* A full-bleed console zone, breaking out of the normal container
          rhythm every other section follows. This is the one place on the
          page meant to feel like you've stepped into a different mode, not
          another card section. */}
      <div className="relative left-1/2 flex h-[100dvh] w-screen -translate-x-1/2 flex-col border-b border-line bg-surface/40 pb-10 pt-[calc(var(--nav-offset)_+_2.5rem)] sm:pb-12">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(var(--grid-dot)_1px,transparent_1px)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />
          <NeuralBackdropSvg />
          <div className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />
          <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-accent-2/5 blur-3xl" />
        </div>

        <div className="container-site relative flex min-h-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="max-w-2xl">
              <Reveal>
                <Eyebrow index="02">cortex</Eyebrow>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="section-title">
                  Run a command. Follow the rabbit hole.
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.12}>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-accent/30 bg-accent-dim px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-accent">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                </span>
                system online
              </span>
            </Reveal>
          </div>

          <div className="mt-4 flex min-h-0 flex-1 flex-col">
            <CortexLazyGate />
          </div>

          <noscript>
            <p className="mt-4 font-mono text-xs text-text-muted">
              The console needs JavaScript. See{" "}
              <a href="/resume" className="text-accent">
                the resume
              </a>{" "}
              instead.
            </p>
          </noscript>
        </div>
      </div>
    </section>
  );
}
