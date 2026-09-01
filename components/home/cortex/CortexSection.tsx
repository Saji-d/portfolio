import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";
import CortexLazyGate from "@/components/home/cortex/CortexLazyGate";

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
      <div className="relative left-1/2 flex h-[100dvh] w-screen -translate-x-1/2 flex-col pb-10 pt-[calc(var(--nav-offset)_+_2.5rem)] sm:pb-12">
        <div className="container-site relative flex min-h-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="max-w-2xl">
              <Reveal>
                <Eyebrow index="07">cortex</Eyebrow>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="section-title">
                  Peek inside the machine.
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.12}>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-accent/30 bg-accent-dim px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-accent-hover">
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
              <a href="/resume" className="text-accent-hover">
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
