import dynamic from "next/dynamic";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";

const CortexConsole = dynamic(
  () => import("@/components/home/cortex/CortexConsole"),
  {
    loading: () => (
      <div className="flex min-h-[540px] items-center justify-center rounded-2xl border border-line bg-surface/60 font-mono text-xs text-text-muted">
        cortex loading<span className="animate-caret text-accent">_</span>
      </div>
    ),
  },
);

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
    <section aria-label="Interactive intro" className="relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />
        <NeuralBackdropSvg />
        <div className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-accent-2/5 blur-3xl" />
      </div>

      <div className="container-site relative">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow index="01">cortex</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-gradient sm:text-4xl">
              Peek inside the machine.
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-4 text-base leading-relaxed text-text-secondary">
              This isn&apos;t an about page. It&apos;s the console to the engineer&apos;s
              brain — run a command, poke around, and learn the person by exploring the
              system.
            </p>
          </Reveal>
        </div>

        <div className="mt-10">
          <CortexConsole />
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
    </section>
  );
}
